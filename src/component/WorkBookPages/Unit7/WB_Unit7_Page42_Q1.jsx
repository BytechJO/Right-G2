/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - G/Item_001_November.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - G/Item_002_March.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - G/Item_003_September.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - G/Item_004_February.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 7/Page 42 - G/Item_005_January.mp3";
import React, { useState, useRef, useEffect, useMemo } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 42/Ex H 1.svg";
const IMAGE_DESCRIPTIONS = {
  [img]: "Five children with speech bubbles.",
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
  november: clip0,
  march: clip1,
  september: clip2,
  february: clip3,
  january: clip4,
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
const exerciseDataO = {
  words: [
    {
      id: "o1",
      fullWord: "March",
      pattern: ["M", "a", null, "c", "h"],
      bubbleClass: "top-[21%] left-[7%]",
    },
    {
      id: "o2",
      fullWord: "September",
      pattern: [null, "e", "p", "t", null, null, null, null, null],
      bubbleClass: "top-[21%] right-[47%]",
    },
    {
      id: "o3",
      fullWord: "November",
      pattern: ["N", "o", null, null, null, null, null, null],
      bubbleClass: "top-[18%] left-[56%]",
    },
    {
      id: "o4",
      fullWord: "January",
      pattern: [null, "a", "n", null, null, "r", null],
      bubbleClass: "bottom-[55%] left-[17%]",
    },
    {
      id: "o5",
      fullWord: "February",
      pattern: ["F", null, "b", null, "u", null, null, "y"],
      bubbleClass: "bottom-[55%] right-[28%]",
    },
  ],
};
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const getOptionsForLetter = (correctLetter) => {
  const wrongLetters = alphabet.filter((l) => l !== correctLetter);
  const randomWrong = wrongLetters.sort(() => 0.5 - Math.random()).slice(0, 2);
  return [correctLetter, ...randomWrong].sort(() => 0.5 - Math.random());
};
const WB_Unit7_Page42_Q1 = () => {
  const a = useAnswers(
    Object.fromEntries(
      exerciseDataO.words.flatMap((w) =>
        w.pattern.flatMap((c, i) =>
          c === null ? [[w.id + "-" + i, w.fullWord[i]]] : [],
        ),
      ),
    ),
    {},
  );
  const { rootRef, message, playingKey, playSound } = a;
  const checkAnswers = () => {
      if (a.completionRef.current) return;
      a.stopAudio();
      if (
        exerciseDataO.words.some((w) =>
          w.pattern.some((c, i) => c === null && !a.values[w.id + "-" + i]),
        )
      ) {
        ValidationAlert.info("Please fill all the missing letters first!");
        return;
      }
      const next = Object.fromEntries(
        exerciseDataO.words.flatMap((w) =>
          w.pattern.flatMap((c, i) =>
            c === null
              ? [
                  [
                    w.id + "-" + i,
                    a.values[w.id + "-" + i] === w.fullWord[i]
                      ? "correct"
                      : "wrong",
                  ],
                ]
              : [],
          ),
        ),
      );
      a.setResults(next);
      const score = exerciseDataO.words.filter((w) =>
        w.pattern.every(
          (c, i) => c !== null || next[w.id + "-" + i] === "correct",
        ),
      ).length;
      a.completionRef.current = score === 5;
      a.setMessage("Score " + score + " out of 5. Correct letters are locked.");
      showCheckFeedback(
        rootRef.current,
        score === 5 ? "success" : score ? "warning" : "error",
        "Score: " + score + " / 5",
      );
    },
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const optionsMap = useMemo(() => {
    const map = {};
    exerciseDataO.words.forEach((word) => {
      map[word.id] = {};
      word.pattern.forEach((char, idx) => {
        if (char === null) {
          map[word.id][idx] = getOptionsForLetter(word.fullWord[idx]);
        }
      });
    });
    return map;
  }, []);
  const renderWord = (word) => {
    return word.pattern.map((char, idx) => {
      if (char === null) {
        const options = optionsMap[word.id][idx];
        return (
          <div key={`${word.id}-${idx}`} className="relative">
            <select
              className={
                `w-4 text-center text-lg font-semibold border-0 border-b-2 appearance-none focus:outline-none
  ${isLetterWrong(word, idx) ? "border-red-500 text-black bg-white" : "border-black text-black bg-white"}
` +
                " " +
                focusClass +
                " focus-visible:rounded-sm!"
              }
              {...a.nativeProps(word.id + "-" + idx)}
            >
              <option value=""></option>
              {options.map((letter, i) => (
                <option key={i} value={letter}>
                  {letter}
                </option>
              ))}
            </select>

            {}
            {isLetterWrong(word, idx) && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white">
                ✕
              </div>
            )}
            {playingKey === "answer-" + (word.id + "-" + idx) && (
              <SpeakerBadge />
            )}
          </div>
        );
      }
      return (
        <span key={`${word.id}-${idx}`} className="text-lg font-semibold">
          {char}
        </span>
      );
    });
  };
  const isLetterWrong = (w, i) => a.results[w.id + "-" + i] === "wrong";
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
          sectionLetter="G"
          title="Look and write missing letters."
          subTitle={"Read the whole sentence first, then use the picture or word bank to complete the days, months, travel, and time answer."}
        />

        <div className="flex flex-col">
          {/* الكلمات الجانبية */}
          <div className="w-full rounded-lg">
            <div className="flex gap-5 justify-center items-center text-lg">
              {["November", "March", "September", "February", "January"].map(
                (month) => (
                  <div
                    key={month}
                    className="WB-word-bank"
                    style={{
                      padding: "9px 22px",
                    }}
                  >
                    <AudioText
                      audioKey={"month-" + month}
                      src={soundFor(month)}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {month}
                    </AudioText>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* الصورة + الانبوت */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-[70%] md:w-[87%] flex justify-center items-center">
              <img
                src={img}
                className="w-full"
                style={{
                  height: "100%",
                  width: "auto",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[img] || "Illustration for this exercise"
                }
              />

              {exerciseDataO.words.map((word) => (
                <div key={word.id} className={`absolute ${word.bubbleClass}`}>
                  <div className="flex items-center gap-1">
                    {renderWord(word)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            handleStartAgain={handleStartAgain}
            handleShowAnswer={handleShowAnswer}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit7_Page42_Q1;
