/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 8/Page 50 - A/Item_001_h_g.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 8/Page 50 - A/Item_002_t_b.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 8/Page 50 - A/Item_003_gl.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 8/Page 50 - A/Item_004_bl.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 8/Page 50 - A/Item_005_c_b.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 8/Page 50 - A/Item_006_t_n.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/p50q1.mp3";
import imgElephant from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 1.svg";
import imgTube from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 2.svg";
import imgGlue from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 3.svg";
import imgBlue from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 4.svg";
import imgCube from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 5.svg";
import imgTune from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 6.svg";
const IMAGE_DESCRIPTIONS = {
  [imgElephant]: "An elephant.",
  [imgTube]: "A test tube.",
  [imgGlue]: "A glue bottle.",
  [imgBlue]: "A bottle of blue ink with a splash of ink.",
  [imgCube]: "An ice cube.",
  [imgTune]: "Musical notes.",
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
  "h g": clip0,
  "t b": clip1,
  gl: clip2,
  bl: clip3,
  "c b": clip4,
  "t n": clip5,
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
const CORRECT_A = {
  q1_1: "u",
  q1_2: "e",
  q2_1: "u",
  q2_2: "e",
  q3_1: "u",
  q3_2: "e",
  q4_1: "u",
  q4_2: "e",
  q5_1: "u",
  q5_2: "e",
  q6_1: "u",
  q6_2: "e",
};
const OPTIONS = ["u", "e", "o", "a", "i"];
const WORD_PARTS = [
  {
    before: "h",
    middle: "g",
    after: "",
  },
  {
    before: "t",
    middle: "b",
    after: "",
  },
  {
    before: "gl",
    middle: "",
    after: "",
  },
  {
    before: "bl",
    middle: "",
    after: "",
  },
  {
    before: "c",
    middle: "b",
    after: "",
  },
  {
    before: "t",
    middle: "n",
    after: "",
  },
];
const IMGS = [imgElephant, imgTube, imgGlue, imgBlue, imgCube, imgTune];
const INITIAL_STATE = {
  q1_1: "",
  q1_2: "",
  q2_1: "",
  q2_2: "",
  q3_1: "",
  q3_2: "",
  q4_1: "",
  q4_2: "",
  q5_1: "",
  q5_2: "",
  q6_1: "",
  q6_2: "",
};
const WB_Unit8_Page50_Q1 = () => {
  const captions = [
    {
      start: 0.56,
      end: 3.18,
      text: "Page 50, Phonics Exercise A.",
    },
    {
      start: 4.34,
      end: 6.34,
      text: "Listen and write the missing letters.",
    },
    {
      start: 7.46,
      end: 9.32,
      text: "1.huge.",
    },
    {
      start: 10.22,
      end: 12.14,
      text: "2.tube.",
    },
    {
      start: 13.2,
      end: 15.21,
      text: "3.glue",
    },
    {
      start: 16,
      end: 18,
      text: "4.blue.",
    },
    {
      start: 18.78,
      end: 21.39,
      text: "5.cube.",
    },
    {
      start: 22,
      end: 23.96,
      text: "6.tune.",
    },
  ];
  const a = useAnswers(CORRECT_A);
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
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title="Listen and write the missing letters."
          subTitle={"Listen to each word, replay if needed, then choose the letters that complete the long-u spelling."}
        />
        <div className="flex flex-col gap-5">
          <QuestionAudioPlayer
            src={sound}
            captions={captions}
            stopAtSecond={6.35}
            pageId="wb_unit8_page50_q1"
          />
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((num, idx) => {
              const parts = WORD_PARTS[idx];
              const key1 = `q${num}_1`;
              const key2 = `q${num}_2`;
              return (
                <div key={num} className="flex items-center gap-3">
                  <div className="flex gap-4 justify-center items-center">
                    <span className="self-start font-bold text-blue-900 text-xl">
                      {num}
                    </span>
                    <img
                      src={IMGS[idx]}
                      className="object-contain"
                      style={{
                        height: "110px",
                        width: "120px",
                      }}
                      alt={
                        IMAGE_DESCRIPTIONS[IMGS[idx]] ||
                        "Illustration for this exercise"
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xl font-bold text-gray-600">
                    <span>
                      <AudioText
                        audioKey={"fragment-" + idx}
                        src={[clip0, clip1, clip2, clip3, clip4, clip5][idx]}
                        playSound={playSound}
                        playingKey={playingKey}
                        label={"Hear question " + num + " word fragment"}
                      >
                        {parts.before}
                      </AudioText>
                    </span>

                    {/* select 1 */}
                    <div className="relative">
                      <select
                        className={
                          focusClass +
                          " focus-visible:rounded-sm! " +
                          `border-b-2 cursor-pointer pr-3 ${a.results[key1] === "wrong" && "border-red-500"}`
                        }
                        {...a.nativeProps(key1)}
                      >
                        <option value=""></option>
                        {OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        {playingKey === "answer-" + key1 && <SpeakerBadge />}
                      </select>

                      {a.results[key1] === "wrong" && (
                        <span className="absolute right-0 top-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                          ✕
                        </span>
                      )}
                    </div>

                    {parts.middle && <span>{parts.middle}</span>}

                    {/* select 2 */}
                    <div className="relative">
                      <select
                        className={
                          focusClass +
                          " focus-visible:rounded-sm! " +
                          `border-b-2 cursor-pointer pr-3 ${a.results[key2] === "wrong" && "border-red-500"}`
                        }
                        {...a.nativeProps(key2)}
                      >
                        <option value=""></option>
                        {OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                        {playingKey === "answer-" + key2 && <SpeakerBadge />}
                      </select>

                      {a.results[key2] === "wrong" && (
                        <span className="absolute right-0 top-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">
                          ✕
                        </span>
                      )}
                    </div>

                    {parts.after && <span>{parts.after}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center">
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
export default WB_Unit8_Page50_Q1;
