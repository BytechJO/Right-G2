/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - A/Item_001_o-e.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - A/Item_002_oa.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - A/Item_003_ow.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 44 - A/Item_004_study_for_exam.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import sound from "../../../assets/audio/WorkBook/p44q1.mp3";
import boatImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 1.svg";
import snowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 2.svg";
import examImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 3.svg";
import bowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 4.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
const HEADER_TITLE = (
  <>
    Listen and write <span className="text-blue-900">✓</span>.
  </>
);
const IMAGE_DESCRIPTIONS = {
  [boatImg]: "A sailboat.",
  [snowImg]: "A snow-covered tree and a snowman.",
  [examImg]: "A pale rectangular sheet with a small circular hole.",
  [bowImg]: "A patterned bow tie.",
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
  "o-e": clip0,
  oa: clip1,
  ow: clip2,
  "study for exam": clip3,
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
const exerciseAData = [
  {
    id: 1,
    image: boatImg,
    options: ["o-e", "oa", "ow"],
    correct: "oa",
  },
  {
    id: 2,
    image: snowImg,
    options: ["o-e", "oa", "ow"],
    correct: "ow",
  },
  {
    id: 3,
    image: examImg,
    options: ["ow", "oa", "o-e"],
    correct: "o-e",
  },
  {
    id: 4,
    image: bowImg,
    options: ["ow", "oa", "o-e"],
    correct: "ow",
  },
];
const WB_Unit7_Page44_Q1 = () => {
  const a = useAnswers(
    Object.fromEntries(exerciseAData.map((q) => [q.id, q.correct])),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const answersA = a.values;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleTryAgain = a.reset;
  const stopAtSecond = 6.15;
  const captions = [
    {
      start: 0,
      end: 3.48,
      text: "Page 44, phonics exercise A.",
    },
    {
      start: 3.5,
      end: 6.14,
      text: "Listen and write ✓.",
    },
    {
      start: 6.3,
      end: 7.12,
      text: "Boat.",
    },
    {
      start: 7.5,
      end: 8.89,
      text: "snow.",
    },
    {
      start: 10.16,
      end: 10.56,
      text: "note.",
    },
    {
      start: 11.76,
      end: 12.24,
      text: "bow.",
    },
  ];
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
          title={HEADER_TITLE}
          subTitle={
            "Listen to each word twice, then mark only the words that contain the long-o sound."
          }
        />
        <div className="flex flex-col gap-5">
          <QuestionAudioPlayer
            pageId="wb_unit7_page44_q1"
            src={sound}
            captions={captions}
            stopAtSecond={stopAtSecond}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
            {exerciseAData.map((item) => (
              <div key={item.id} className="flex items-center gap-10 p-3">
                <div className="w-[120px] h-[100px] flex items-center justify-center">
                  <img
                    src={item.image}
                    className="object-contain"
                    style={{
                      height: "120px",
                    }}
                    alt={
                      IMAGE_DESCRIPTIONS[item.image] ||
                      "Illustration for this exercise"
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  {item.options.map((opt) => {
                    const isSelected = answersA[item.id] === opt;
                    const isWrong =
                      a.results[item.id] === "wrong" && isSelected;
                    return (
                      <div key={opt} className="flex items-center gap-4">
                        <span className="w-10 text-right font-bold text-lg text-gray-700">
                          <AudioText
                            audioKey={"label-" + item.id + "-" + opt}
                            src={soundFor(opt)}
                            playSound={playSound}
                            playingKey={playingKey}
                          >
                            {opt}
                          </AudioText>
                        </span>

                        <div className="relative">
                          <div
                            {...a.props(item.id, opt, soundFor(opt))}
                            className={`${focusClass} w-10 h-10 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all
  ${isWrong ? "border-red-500" : isSelected ? "border-blue-900" : "border-gray-400 hover:border-blue-900"}
`}
                          >
                            {playingKey === "choice-" + item.id + "-" + opt && (
                              <SpeakerBadge />
                            )}
                            {isSelected && (
                              <span className="text-2xl font-bold text-blue-600">
                                <img
                                  src={trueIcon}
                                  style={{
                                    height: "25px",
                                  }}
                                  alt=""
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </div>

                          {/* ❌ Wrong Icon */}
                          {isWrong && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                              ✕
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
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
export default WB_Unit7_Page44_Q1;
