/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_001_What_month_is_it.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_002_It's.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_003_January.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_004_February.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_005_March.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_006_April.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_007_May.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_008_June.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_009_July.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_010_August.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_011_September.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_012_October.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_013_November.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - E/Item_014_December.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Ex E 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 41/Asset 49.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A calendar card with a bird and the number 2.",
  [img2]: "A calendar card with a butterfly and the number 7.",
  [img3]: "A calendar card with an apple and the number 11.",
  [img4]: "A calendar card with a kite and the number 5.",
};
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
  "what month is it": clip0,
  "it's": clip1,
  january: clip2,
  february: clip3,
  march: clip4,
  april: clip5,
  may: clip6,
  june: clip7,
  july: clip8,
  august: clip9,
  september: clip10,
  october: clip11,
  november: clip12,
  december: clip13,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/:/g, " ")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
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
      const src = soundFor(value);
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
const exerciseDataM = {
  questions: [
    {
      id: "m1",
      number: 2,
      correctMonth: "February",
      image: img1,
    },
    {
      id: "m2",
      number: 7,
      correctMonth: "July",
      image: img2,
    },
    {
      id: "m3",
      number: 11,
      correctMonth: "November",
      image: img3,
    },
    {
      id: "m4",
      number: 5,
      correctMonth: "May",
      image: img4,
    },
  ],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};
const WB_Unit7_Page41_Q1 = () => {
  const a = useAnswers(
    Object.fromEntries(
      exerciseDataM.questions.map((q) => [q.id, q.correctMonth]),
    ),
    {},
  );
  const { rootRef, message, playingKey, playSound } = a;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const getSelectClass = () =>
    "border-b-2 border-gray-300 px-3 py-2 font-semibold";
  return (
    <div className="main-container-component mb-10" ref={rootRef}>
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="E"
          title="Look, read, and write."
          subTitle={"Look at the picture or sentence clue, say the days, months, travel, and time answer first, then write or select it carefully."}
        />

        <div
          className="grid grid-cols-2 gap-8 mb-8"
          style={{
            justifyItems: "end",
          }}
        >
          {/* Questions */}
          <div
            className="grid grid-cols-2 gap-x-32 gap-y-10"
            style={{
              justifyItems: "center",
            }}
          >
            {exerciseDataM.questions.map((question, idx) => {
              const isWrong = a.results[question.id] === "wrong";
              return (
                <div key={question.id} className="space-y-2">
                  <p className="font-bold text-lg text-gray-700">
                    <AudioText
                      label={
                        "Question " +
                        question.id +
                        ". What month is it? Hear it."
                      }
                      audioKey={"question-" + question.id}
                      src={soundFor("What month is it")}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {<>{idx + 1}. What month is it?</>}
                    </AudioText>
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-45 h-45 rounded-lg flex items-center justify-center">
                      <img
                        src={question.image}
                        className="max-w-40 max-h-40 object-cover"
                        alt={
                          IMAGE_DESCRIPTIONS[question.image] ||
                          "Illustration for this exercise"
                        }
                      />
                    </div>
                  </div>

                  {/* select + ❌ */}
                  <div className="relative flex gap-2">
                    <span className="text-lg font-bold">
                      <AudioText
                        audioKey={"prefix-" + question.id}
                        src={soundFor("It's")}
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {"It's"}
                      </AudioText>
                    </span>
                    <select
                      className={
                        `w-full ${getSelectClass(question.id)}` +
                        " " +
                        focusClass +
                        " focus-visible:rounded-sm!"
                      }
                      {...a.nativeProps(question.id)}
                    >
                      <option value="">Select a month</option>
                      {exerciseDataM.months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>

                    {isWrong && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                        <span className="text-white text-xs font-bold">✕</span>
                      </div>
                    )}
                    {playingKey === "answer-" + question.id && <SpeakerBadge />}
                  </div>
                </div>
              );
            })}
          </div>

          <img
            src={img5}
            className="object-contain"
            style={{
              height: "550px",
              width: "auto",
            }}
            alt={IMAGE_DESCRIPTIONS[img5] || "Illustration for this exercise"}
          />
        </div>

        <Button
          handleStartAgain={handleStartAgain}
          handleShowAnswer={handleShowAnswer}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit7_Page41_Q1;
