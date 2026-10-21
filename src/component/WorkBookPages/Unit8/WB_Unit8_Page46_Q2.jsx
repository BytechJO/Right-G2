/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_001_He.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_002_a_big_hat.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_003_a_short_tie.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_005_a_small_jacket.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_006_big_hat.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_007_short_tie.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_008_big_shoes.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 8/Page 46 - E/Item_009_small_jacket.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_001_two.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_002_I_don't_have.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_003_I_have.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_004_has.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_005_doesn't_have.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_006_Hello!_This_is_my_closet._I_have.mp3";
import clip15 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_007_shirts,_but.mp3";
import clip16 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_008_any.mp3";
import clip17 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_009_skirts.mp3";
import clip18 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_010_a_big_hat._It.mp3";
import clip19 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_011_a_feather.mp3";
import clip20 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_012_This_is_John's_closet._He.mp3";
import clip21 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_013_a_tie._He.mp3";
import clip22 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_014_a_cap._He.mp3";
import clip23 from "../../../assets/audio/WorkBook/Unit 8/Page 47 - G/Item_015_a_pair_of_pants.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import imgClown from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 46/Ex E 1_1.svg";
const IMAGE_DESCRIPTIONS = {
  [imgClown]: "A clown with a red nose and colorful clothes.",
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
  he: clip0,
  "a big hat": clip1,
  "a short tie": clip2,
  "a small jacket": clip4,
  "big hat": clip5,
  "short tie": clip6,
  "big shoes": clip7,
  "small jacket": clip8,
  two: clip9,
  "i don't have": clip10,
  "i have": clip11,
  has: clip12,
  "doesn't have": clip13,
  "hello this is my closet i have": clip14,
  "shirts but": clip15,
  any: clip16,
  skirts: clip17,
  "a big hat it": clip18,
  "a feather": clip19,
  "this is john's closet he": clip20,
  "a tie he": clip21,
  "a cap he": clip22,
  "a pair of pants": clip23,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
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
const VERB_CHIPS = [
  {
    id: "has",
    label: "has",
  },
  {
    id: "doesnt",
    label: "doesn't have",
  },
];
const QUESTIONS = [
  {
    key: "q1",
    hint: "big hat",
    correctVerb: "doesnt",
    restOfSentence: "a big hat",
  },
  {
    key: "q2",
    hint: "short tie",
    correctVerb: "has",
    restOfSentence: "a short tie",
  },
  {
    key: "q3",
    hint: "big shoes",
    correctVerb: "has",
    restOfSentence: "big shoes",
  },
  {
    key: "q4",
    hint: "small jacket",
    correctVerb: "doesnt",
    restOfSentence: "a small jacket",
  },
];
const INITIAL_DROPS = {
  q1: "",
  q2: "",
  q3: "",
  q4: "",
};
const WB_Unit8_Page46_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(QUESTIONS.map((q) => [q.key, q.correctVerb])),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleReset = a.reset;
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
          gap: "120px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="E"
          title="Look and write."
          subTitle={
            "Look at the picture or sentence clue, say the clothing and quantities answer first, then write or select it carefully."
          }
        />

        <div className="flex items-start gap-10">
          {/* Image */}
          <div className="min-w-[120px]">
            <img
              src={imgClown}
              className="max-w-90 max-h-50 object-contain"
              alt={
                IMAGE_DESCRIPTIONS[imgClown] || "Illustration for this exercise"
              }
            />
          </div>

          {/* Questions */}
          <div className="flex-1 flex flex-col gap-5">
            {QUESTIONS.map((q, idx) => {
              const isWrong = a.results[q.key] === "wrong";
              return (
                <div key={q.key} className="flex items-center gap-3">
                  <span className="font-bold text-blue-900 text-lg max-w-4">
                    {idx + 1}
                  </span>

                  <div className="flex items-center flex-wrap gap-2 font-semibold text-lg text-gray-700">
                    <span>
                      <AudioText
                        audioKey={"prefix-" + q.key}
                        src={soundFor("He")}
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {"He"}
                      </AudioText>
                    </span>

                    {/* 🔽 Dropdown */}
                    <div className="relative">
                      <select
                        className={
                          focusClass +
                          " focus-visible:rounded-sm! " +
                          `px-2 py-1 border-b-2 bg-transparent outline-none
                          ${isWrong ? "border-red-500" : "border-gray-400"}`
                        }
                        {...a.nativeProps(q.key)}
                      >
                        <option value="">----</option>
                        {VERB_CHIPS.map((chip) => (
                          <option key={chip.id} value={chip.id}>
                            {chip.label}
                          </option>
                        ))}
                        {playingKey === "answer-" + q.key && <SpeakerBadge />}
                      </select>

                      {/* ❌ Wrong icon */}
                      {isWrong && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                          ✕
                        </div>
                      )}
                    </div>

                    <span>
                      <AudioText
                        audioKey={"rest-" + q.key}
                        src={soundFor(q.restOfSentence)}
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {q.restOfSentence}
                      </AudioText>
                      .
                    </span>
                  </div>

                  {/* Hint */}
                  <div className="ml-auto px-3 py-1 rounded-md border border-gray-300 bg-white text-lg font-medium text-gray-700">
                    <AudioText
                      audioKey={"hint-" + q.key}
                      src={soundFor(q.hint)}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {q.hint}
                    </AudioText>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit8_Page46_Q2;
