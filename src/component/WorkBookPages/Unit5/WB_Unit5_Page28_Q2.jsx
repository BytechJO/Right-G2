/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_001_Does_he_like_chicken.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_002_No,_he_doesn't.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_003_Does_she_like_fruit.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_004_No,_she_doesn't.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_005_Does_he_like_cheese.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_006_Does_she_like_tea.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - C/Item_007_Yes,_she_does.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - D/Item_001_Does_she_like_fish.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - D/Item_002_Does_she_like_chicken.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - D/Item_003_Does_he_like_stew.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - D/Item_004_Does_he_like_fruit.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - D/Item_005_Does_he_like_meat.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 5/Page 28 - D/Item_006_Does_he_like_rice.mp3";
import React, { useState, useRef, useEffect } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 5.svg";

// بيانات التمرين
const exerciseDataD = [
  {
    id: "d1",
    img: img1,
    options: ["Does she like fish?", "Does she like chicken?"],
    correctOption: "Does she like fish?",
    correctAnswer: "No, she doesn't.",
  },
  {
    id: "d2",
    img: img2,
    options: ["Does he like stew?", "Does he like fruit?"],
    correctOption: "Does he like stew?",
    correctAnswer: "No, he doesn't.",
  },
  {
    id: "d3",
    img: img3,
    options: ["Does he like meat?", "Does he like rice?"],
    correctOption: "Does he like meat?",
    correctAnswer: "No, he doesn't.",
  },
  {
    id: "d4",
    img: img4,
    options: ["Does she like fish?", "Does she like fruit?"],
    correctOption: "Does she like fruit?",
    correctAnswer: "Yes, she does.",
  },
  {
    id: "d5",
    img: img5,
    options: ["Does she like soup?", "Does she like chicken?"],
    correctOption: "Does she like chicken?",
    correctAnswer: "Yes, she does.",
  },
];
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
      className={className + " " + focusClass}
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
const SOUNDS = {
  "does he like chicken": clip0,
  "no he doesn't": clip1,
  "does she like fruit": clip2,
  "no she doesn't": clip3,
  "does he like cheese": clip4,
  "does she like tea": clip5,
  "yes she does": clip6,
  "does she like fish": clip7,
  "does she like chicken": clip8,
  "does he like stew": clip9,
  "does he like fruit": clip10,
  "does he like meat": clip11,
  "does he like rice": clip12,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
const soundFor = (text) => SOUNDS[normalized(text)];
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
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
    if (complete || revealed) return;
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
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => {
      if (locked(id)) return;
      choose(id, e.target.value);
      audio.playSound("answer-" + id, soundFor(e.target.value));
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
      borderRadius: 0,
      ...(audio.playingKey === "answer-" + id
        ? {
            outline: "3px solid #2563eb",
            outlineOffset: 2,
            borderRadius: 4,
            backgroundColor: "#dbeafe",
          }
        : {}),
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
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl seated at a table with a plate of fish.",
  [img2]: "A boy seated at a table with a bowl of soup.",
  [img3]: "A boy seated at a table with a plate of meat.",
  [img4]: "A woman seated at a table with a bowl of fruit.",
  [img5]: "A girl seated at a table with a plate of meat.",
};
const WB_Unit5_Page28_Q2 = () => {
  const correct = Object.fromEntries(
    exerciseDataD.flatMap((q) => [
      [q.id + "-option", q.correctOption],
      [q.id + "-answer", q.correctAnswer],
    ]),
  );
  const a = useAnswers(correct, {
    normalize: true,
  });
  const { rootRef, message, playingKey } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const selections = Object.fromEntries(
    exerciseDataD.map((q) => [q.id, a.values[q.id + "-option"]]),
  );
  const isOptionWrong = (q, opt) =>
      a.results[q.id + "-option"] === "wrong" && selections[q.id] === opt,
    isInputWrong = (q) => a.results[q.id + "-answer"] === "wrong";
  const getOptionClass = (id, opt) =>
    selections[id] === opt
      ? "border-blue-900"
      : "border-gray-300 hover:border-blue-900";
  const getInputClass = (id) =>
    a.results[id + "-answer"] === "correct"
      ? "border-green-600"
      : a.results[id + "-answer"] === "wrong"
        ? "border-red-500"
        : "border-gray-300";
  return (
    <div ref={rootRef} className="main-container-component">
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
          marginBottom: "30px",
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="D"
          title={<> Look, read, and circle. Answer.</>}
          subTitle={"Read the clue and look at the picture, then tap the food preferences answer you would circle."}
        />

        <div className="space-y-6">
          {exerciseDataD.map((q, index) => (
            <div key={q.id} className="flex items-center gap-x-6 gap-y-2">
              <div className="flex gap-1 items-start">
                <span className="font-bold text-blue-900 text-xl">
                  {index + 1}
                </span>
                <img
                  src={q.img}
                  style={{
                    height: "100px",
                    width: "150px",
                  }}
                  className="object-contain"
                  alt={IMAGE_DESCRIPTIONS[q.img]}
                />
              </div>
              <div className="flex gap-10 items-center space-y-2 w-full">
                <div className="flex flex-col gap-5 w-55">
                  {q.options.map((opt) => (
                    <div key={opt} className="relative">
                      <button
                        {...a.props(q.id + "-option", opt, soundFor(opt))}
                        style={{
                          ...a.props(q.id + "-option", opt).style,
                          borderRadius: "9999px",
                        }}
                        className={`${focusClass} w-full text-left px-4 py-2 rounded-full border-2 text-[17px] transition-all ${getOptionClass(q.id, opt, q.correctOption)}`}
                      >
                        {opt}
                        {playingKey === "choice-" + q.id + "-option-" + opt && (
                          <SpeakerBadge />
                        )}
                      </button>

                      {isOptionWrong(q, opt) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-start-3 relative">
                  <select
                    {...a.nativeProps(q.id + "-answer")}
                    className={`${focusClass} focus-visible:rounded-sm! cursor-pointer w-[300px] bg-transparent border-b-2 pb-1 text-lg ${getInputClass(q.id, q.correctAnswer)}`}
                  >
                    <option value="" disabled>
                      select
                    </option>
                    <option value="No, she doesn't.">No, she doesn't.</option>
                    <option value="No, he doesn't.">No, he doesn't.</option>
                    <option value="Yes, she does.">Yes, she does.</option>
                  </select>
                  {playingKey === "answer-" + q.id + "-answer" && (
                    <SpeakerBadge />
                  )}
                  {isInputWrong(q) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit5_Page28_Q2;
