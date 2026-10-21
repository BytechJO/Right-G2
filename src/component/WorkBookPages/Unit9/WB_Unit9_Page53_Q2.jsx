/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
// تأكد من صحة المسار في مشروعك
import Button from "../Button"; // تأكد من صحة المسار في مشروعك

// استيراد الصور (تأكد من تغيير المسارات لتناسب مشروعك)
// تأكد من صحة المسار في مشروعك

// استيراد الصور (تأكد من تغيير المسارات لتناسب مشروعك)
import imgA from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 1.svg";
import imgB from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 2.svg";
import imgC from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 3.svg";
import imgD from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 4.svg";
import imgE from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 5.svg";
import imgF from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 53/Ex F 6.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 53 - F/Item_001_She_isn't_playing_chess_with_her_friend.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 53 - F/Item_002_I'm_sending_an_e-mail_to_my_friend.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 53 - F/Item_003_I'm_cooking_dinner_for_my_family.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 53 - F/Item_004_He_isn't_listening_to_the_radio.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 9/Page 53 - F/Item_005_They_aren't_playing_soccer.mp3";
const focusClass =
  "focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "white",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);
const activate = (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) e.currentTarget.click();
};
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
function useExerciseAudio() {
  const rootRef = useRef(null),
    ownerRef = useRef(Symbol("workbook-exercise")),
    tokenRef = useRef(0);
  const [playingKey, setPlayingKey] = useState(null);
  const stopAudio = () => {
    tokenRef.current++;
    stopGlobalAudio(ownerRef.current);
    setPlayingKey(null);
  };
  const playSound = (key, src) => {
    if (!src) return;
    stopAudio();
    rootRef.current
      ?.querySelectorAll("audio")
      .forEach((audio) => audio.pause());
    const token = tokenRef.current;
    setPlayingKey(key);
    try {
      playGlobalAudio(src, {
        owner: ownerRef.current,
        onFinish: () => {
          if (tokenRef.current === token) setPlayingKey(null);
        },
      });
    } catch {
      stopAudio();
    }
  };
  useEffect(() => {
    const tokenState = tokenRef,
      owner = ownerRef.current;
    const onPlay = (e) => {
      if (e.target?.tagName !== "AUDIO") return;
      tokenRef.current++;
      stopGlobalAudio(ownerRef.current);
      setPlayingKey(null);
    };
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      tokenState.current++;
      stopGlobalAudio(owner);
    };
  }, []);
  return {
    rootRef,
    playingKey,
    playSound,
    stopAudio,
  };
}
const AudioText = ({
  children,
  audioKey,
  label,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
  tabIndex = 0,
}) => {
  if (!src)
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  return (
    <span
      role="button"
      tabIndex={tabIndex}
      aria-label={label || String(children) + ". Hear it."}
      className={className + " focus-visible:rounded-sm! " + focusClass}
      onClick={() => playSound(audioKey, src)}
      onKeyDown={activate}
      onKeyUp={release}
      style={{
        borderRadius: "8px",
        ...style,
        position: "relative",
        cursor: "pointer",
        ...(playingKey === audioKey
          ? {
              boxShadow: "0 0 0 3px #2563eb",
              backgroundColor: "#dbeafe",
            }
          : {}),
      }}
    >
      {children}
      {playingKey === audioKey && <SpeakerBadge />}
    </span>
  );
};
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({
      preventScroll: true,
    });
  }
  ValidationAlert[kind](...messages);
}
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
  const completionRef = useRef(false);
  completionRef.current = complete || revealed;
  useCheckButton(audio.rootRef, complete || revealed);
  const locked = (id) => revealed || results[id] === "correct";
  const chosen = (id, value) =>
    Array.isArray(correct[id])
      ? (values[id] || []).includes(value)
      : values[id] === value;
  const choose = (id, value) => {
    if (locked(id)) return;
    let next = value;
    if (Array.isArray(correct[id])) {
      const current = values[id] || [];
      if (current.includes(value)) next = current.filter((v) => v !== value);
      else {
        if (options.limit && current.length >= options.limit) return;
        next = [...current, value];
      }
    }
    setValues((prev) => ({
      ...prev,
      [id]: next,
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setMessage("Answer " + id + " updated.");
  };
  const stop = () => {
    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
  };
  const check = () => {
    if (completionRef.current) return;
    stop();
    if (
      ids.some((id) =>
        Array.isArray(correct[id])
          ? !values[id]?.length
          : values[id] === undefined || values[id] === "",
      )
    ) {
      const text = options.missing || "Please complete all answers first.";
      setMessage(text);
      ValidationAlert.info(text);
      return;
    }
    const same = (actual, expected) =>
      Array.isArray(expected)
        ? actual.length === expected.length &&
          expected.every((v) => actual.includes(v))
        : options.normalize
          ? normalized(actual) === normalized(expected)
          : actual === expected;
    const next = Object.fromEntries(
      ids.map((id) => [
        id,
        results[id] === "correct" || same(values[id], correct[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((v) => v === "correct").length;
    completionRef.current = score === ids.length;
    setMessage(
      "Score " +
        score +
        " out of " +
        ids.length +
        ". Correct answers are locked.",
    );
    showCheckFeedback(
      audio.rootRef.current,
      score === ids.length ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + ids.length,
    );
  };
  const show = () => {
    completionRef.current = true;
    stop();
    setValues(
      Object.fromEntries(
        ids.map((id) => [
          id,
          Array.isArray(correct[id]) ? [...correct[id]] : correct[id],
        ]),
      ),
    );
    setResults(Object.fromEntries(ids.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    completionRef.current = false;
    stop();
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const resultStyle = (id, value) =>
    chosen(id, value) && results[id]
      ? {
          borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          boxShadow:
            "inset 0 0 0 1px " +
            (results[id] === "correct" ? "#16a34a" : "#ef4444"),
        }
      : {};
  const props = (id, value, src, label = String(value)) => ({
    role: "button",
    tabIndex: 0,
    "aria-label":
      "Question " +
      id +
      ": " +
      label +
      (locked(id) ? ". Correct and locked." : ""),
    "aria-pressed": chosen(id, value),
    "aria-disabled": locked(id),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      options.beforeInteract?.();
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(chosen(id, value) && !results[id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => {
      const value = options.numeric ? Number(e.target.value) : e.target.value;
      choose(id, value);
      const src = soundFor(value === "doesnt" ? "doesn't have" : value);
      if (src) audio.playSound("answer-" + id, src);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        if (e.repeat) e.preventDefault();
      }
    },
    onKeyUp: (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    },
    style: {
      position: "relative",
      borderRadius: 0,
      ...(results[id]
        ? {
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
    },
  });
  return {
    ...audio,
    setResults,
    setMessage,
    completionRef,
    values,
    results,
    revealed,
    message,
    locked,
    chosen,
    choose,
    check,
    show,
    reset,
    resultStyle,
    props,
    nativeProps,
  };
}
// Percentages follow the inspected SVG artwork, so regions scale with each picture.
// The larger detail buttons below are alternatives to the compact picture regions.
const SOUNDS = {
  "she isn't playing chess with her friend": clip0,
  "i'm sending an e-mail to my friend": clip1,
  "i'm cooking dinner for my family": clip2,
  "he isn't listening to the radio": clip3,
  "they aren't playing soccer": clip4,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgA]: "A man preparing food in a kitchen.",
  [imgB]: "A man sitting beside a radio.",
  [imgC]: "Two children standing near hens.",
  [imgD]: "Two children playing with a soccer ball.",
  [imgE]: "Two children seated at a chessboard.",
  [imgF]: "A girl using a laptop on her lap.",
};
const exerciseFData = [
  {
    id: 1,
    sentence: "She isn't playing chess with her friend.",
    correct: "e",
  },
  {
    id: 2,
    sentence: "I'm sending an e-mail to my friend.",
    correct: "f",
  },
  {
    id: 3,
    sentence: "I'm cooking dinner for my family.",
    correct: "a",
  },
  {
    id: 4,
    sentence: "He isn't listening to the radio.",
    correct: "b",
  },
  {
    id: 5,
    sentence: "They aren't playing soccer.",
    correct: "d",
  },
  {
    id: 6,
    sentence: "We are looking at the hens.",
    correct: "c",
  },
];
const imagesData = [
  {
    id: "a",
    src: imgA,
    check: true,
  },
  {
    id: "b",
    src: imgB,
    check: false,
  },
  {
    id: "c",
    src: imgC,
    check: true,
  },
  {
    id: "d",
    src: imgD,
    check: false,
  },
  {
    id: "e",
    src: imgE,
    check: false,
  },
  {
    id: "f",
    src: imgF,
    check: true,
  },
];
const WB_Unit9_Page53_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(exerciseFData.map((q) => [q.id, q.correct])),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const userAnswers = a.values;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleTryAgain = a.reset;
  return (
    <div className="main-container-component" ref={rootRef}>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <div
        className="div-forall"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title={<>Read and look. Match pictures with sentences.</>}
          subTitle={
            "Start with one picture or phrase, then connect it to the matching present activities partner."
          }
        />

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sentences with Select */}
          <div className="flex-1 flex flex-col gap-2">
            {exerciseFData.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center w-full justify-between gap-4 text-lg"
              >
                <div className="flex items-center gap-4 text-lg">
                  <div className="relative">
                    <select
                      className={
                        `w-12 h-10 border-b-2 text-lg border-gray-400 bg-transparent text-center font-bold text-blue-900 focus:outline-none appearance-none cursor-pointer
                                       
                                        ${!!a.results[item.id] && userAnswers[item.id] !== item.correct && userAnswers[item.id] !== "" ? " border-red-500" : ""}
                                    ` +
                        " " +
                        focusClass
                      }
                      {...a.nativeProps(item.id)}
                      aria-label={"Question " + item.id + ": " + item.sentence}
                    >
                      <option value=""></option>
                      {["a", "b", "c", "d", "e", "f"].map((letter) => (
                        <option key={letter} value={letter}>
                          {letter}
                        </option>
                      ))}
                    </select>
                    {!!a.results[item.id] &&
                      userAnswers[item.id] !== item.correct && (
                        <span className="absolute -right-2 top-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                          ✕
                        </span>
                      )}
                  </div>
                  <span className="font-bold text-blue-900 w-4">{item.id}</span>
                  <span className="text-gray-800 font-medium">
                    <AudioText
                      audioKey={"question-" + item.id}
                      src={soundFor(item.sentence)}
                      playSound={playSound}
                      playingKey={playingKey}
                      tabIndex={a.picked ? -1 : 0}
                    >
                      {item.sentence}
                    </AudioText>
                  </span>
                </div>

                <div
                  key={imagesData[i].id}
                  className="relative overflow-hidden"
                >
                  <img
                    src={imagesData[i].src}
                    className="object-cover"
                    style={{
                      height: "90px",
                      width: "auto",
                    }}
                    alt={
                      IMAGE_DESCRIPTIONS[imagesData[i].src] ||
                      "Illustration for this question"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit9_Page53_Q2;
