/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_001_I_don't_like_spaghetti.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_002_I_don't_like_rice.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_003_I_like_stew.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_004_I_don't_like_fish.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_005_I_like_chicken.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_006_I_like_burgers.mp3";
import React, { useState, useRef, useEffect } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page27/Ex B 1.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const exerciseData = [
  {
    id: "b1",
    sentence: "I don't like rice.",
    correctAnswer: "✘",
  },
  {
    id: "b2",
    sentence: "I like stew.",
    correctAnswer: "✘",
  },
  {
    id: "b3",
    sentence: "I don't like fish.",
    correctAnswer: "✓",
  },
  {
    id: "b4",
    sentence: "I like chicken.",
    correctAnswer: "✓",
  },
  {
    id: "b5",
    sentence: "I don't like spaghetti.",
    correctAnswer: "✘",
  },
  {
    id: "b6",
    sentence: "I like burgers.",
    correctAnswer: "✘",
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
  "i don't like spaghetti": clip0,
  "i don't like rice": clip1,
  "i like stew": clip2,
  "i don't like fish": clip3,
  "i like chicken": clip4,
  "i like burgers": clip5,
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
    onChange: (e) => choose(id, e.target.value),
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
  [placeholderImg]: "A boy seated at a table with several dishes of food.",
};
const WB_Unit5_Page27_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(exerciseData.map((q) => [q.id, q.correctAnswer])),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const selections = a.values;
  const isThisOptionWrong = (q, value) =>
    a.results[q.id] === "wrong" && selections[q.id] === value;
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
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={"Look, read, and write ✓ or ✗."}
          subTitle={"Compare each statement with the picture or text before choosing Check, X, True, or False."}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-30 items-center">
          <img
            src={placeholderImg}
            className="max-w-sm max-h-100 mx-auto "
            alt={IMAGE_DESCRIPTIONS[placeholderImg]}
          />
          <div className="space-y-4">
            {exerciseData.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2 relative">
                      {/* ✅ YES BOX */}
                      <div className="relative">
                        <div
                          {...a.props(item.id, "✓", null, "True")}
                          style={{
                            ...a.props(item.id, "✓").style,
                            ...(selections[item.id] === "✓" &&
                            !a.results[item.id]
                              ? {
                                  backgroundColor: "#dbeafe",
                                }
                              : {}),
                          }}
                          className={`${focusClass} w-10 h-10 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
      ${selections[item.id] === "✓" ? "border-blue-900" : "border-gray-400"}
      ${isThisOptionWrong(item, "✓") ? "border-red-500 bg-white" : ""}
    `}
                        >
                          <span className="text-green-600 font-bold text-2xl">
                            <img
                              src={trueIcon}
                              style={{
                                height: "25px",
                              }}
                              alt=""
                              aria-hidden="true"
                            />
                          </span>
                        </div>

                        {/* ❌ فوق البوكس الغلط فقط */}
                        {isThisOptionWrong(item, "✓") && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>

                      {/* ❌ NO BOX */}
                      <div className="relative">
                        <div
                          {...a.props(item.id, "✘", null, "False")}
                          style={{
                            ...a.props(item.id, "✘").style,
                            ...(selections[item.id] === "✘" &&
                            !a.results[item.id]
                              ? {
                                  backgroundColor: "#dbeafe",
                                }
                              : {}),
                          }}
                          className={`${focusClass} w-10 h-10 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
      ${selections[item.id] === "✘" ? "border-blue-900" : "border-gray-400"}
      ${isThisOptionWrong(item, "✘") ? "border-red-500  bg-white" : ""}
    `}
                        >
                          <span className="text-red-600 font-bold text-2xl">
                            <img
                              src={falseIcon}
                              style={{
                                height: "25px",
                              }}
                              alt=""
                              aria-hidden="true"
                            />
                          </span>
                        </div>

                        {/* ❌ فوق البوكس الغلط فقط */}
                        {isThisOptionWrong(item, "✘") && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="font-bold text-blue-900 text-xl">
                      {index + 1}
                    </span>
                    <p className="text-xl">
                      <AudioText
                        audioKey={"sentence-" + item.id}
                        src={soundFor(item.sentence)}
                        playSound={playSound}
                        playingKey={playingKey}
                        className=""
                      >
                        {item.sentence}
                      </AudioText>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit5_Page27_Q2;
