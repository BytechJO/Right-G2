/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - B/Item_001_bee.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - B/Item_002_tree.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - B/Item_003_bread.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 32 - B/Item_004_meat.mp3";
// ExerciseB.jsx

import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound from "../../../assets/audio/WorkBook/p32q2.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 12.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const questions = [
  {
    id: 1,
    word: "bee",
    sound: "ee",
    options: [
      {
        src: img1,
        label: "bed",
      },
      {
        src: img2,
        label: "meat",
      },
      {
        src: img3,
        label: "sleep",
      },
    ],
    correct: [1, 2],
  },
  {
    id: 2,
    word: "tree",
    sound: "ee",
    options: [
      {
        src: img4,
        label: "bread",
      },
      {
        src: img5,
        label: "green",
      },
      {
        src: img6,
        label: "feet",
      },
    ],
    correct: [2],
  },
  {
    id: 3,
    word: "bread",
    sound: "ea",
    options: [
      {
        src: img7,
        label: "sleep",
      },
      {
        src: img8,
        label: "bee",
      },
      {
        src: img9,
        label: "green",
      },
    ],
    correct: [2], // هذا السؤال لا يوجد له إجابة صحيحة
  },
  {
    id: 4,
    word: "meat",
    sound: "ea",
    options: [
      {
        src: img10,
        label: "feet",
      },
      {
        src: img11,
        label: "sheep",
      },
      {
        src: img12,
        label: "bread",
      },
    ],
    correct: [0, 1],
  },
];
const focusClass =
  "focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const SpeakerBadge = ({ inset = false }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: inset ? 0 : -10,
      right: inset ? 0 : -10,
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
  bee: clip0,
  tree: clip1,
  bread: clip2,
  meat: clip3,
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
  [img1]: "A bed in a bedroom.",
  [img2]: "A plate of meat.",
  [img3]: "A child asleep in a bed.",
  [img4]: "A loaf of sliced bread.",
  [img5]: "A spool of green thread.",
  [img6]: "Two bare feet.",
  [img7]: "A child asleep in a bed.",
  [img8]: "A bee.",
  [img9]: "A spool of green thread.",
  [img10]: "Two bare feet.",
  [img11]: "A sheep.",
  [img12]: "A loaf of sliced bread.",
};
export default function WB_Unit5_Page32_Q2() {
  const [forceStop, setForceStop] = useState(0);
  const a = useAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correct])),
    {
      beforeInteract: () => setForceStop((v) => v + 1),
    },
  );
  //....
  const { rootRef, message, playingKey, playSound } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const captions = [
    {
      start: 0.58,
      end: 3.26,
      text: "Page 32, Phonics Exercise B. ",
    },
    {
      start: 4.46,
      end: 8.26,
      text: "Listen and circle the pictures that have the same vowel sound.",
    },
    {
      start: 9.44,
      end: 10.88,
      text: "1.bee",
    },
    {
      start: 12.14,
      end: 16.8,
      text: "bed, meat, sleep.",
    },
    {
      start: 16.9,
      end: 18.22,
      text: "2.tree",
    },
    {
      start: 18.14,
      end: 20.22,
      text: "bread, thread, feet.",
    },
    {
      start: 21.34,
      end: 23.28,
      text: "3.bread",
    },
    {
      start: 24.42,
      end: 30.06,
      text: "sleep, bee, thread.",
    },
    {
      start: 30,
      end: 31.34,
      text: "4.meat",
    },
    {
      start: 31.28,
      end: 33.34,
      text: "feet, sheep, bread.",
    },
  ];
  const stopAtSecond = 9;
  const isRowIncorrect = (q) => a.results[q.id] === "wrong",
    isOptionWrong = (q, idx) =>
      a.results[q.id] === "wrong" &&
      a.chosen(q.id, idx) &&
      !q.correct.includes(idx);
  const getCellClass = (id, idx) =>
    "cursor-pointer rounded-xl p-2 border-2 transition-all " +
    (a.chosen(id, idx)
      ? "border-blue-900 bg-blue-50"
      : "border-transparent hover:border-blue-900");
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
        className="div-forall mb-10"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={
            "Listen and circle the pictures that have the same vowel sound."
          }
          subTitle={
            "Listen to both picture words before circling the pair with the same vowel sound."
          }
        />

        <QuestionAudioPlayer
          pageId="wb_unit5_page32_q2"
          forceStop={forceStop}
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div
          className="rounded-xl border border-gray-200 mb-6 flex flex-col"
          style={{ gap: "15px" }}
        >
          {questions.map((q, qi) => (
            <div
              key={q.id}
              className={`relative flex items-center gap-2 px-4 py-0 ${qi % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              {isRowIncorrect(q) && (
                <div className="absolute top-8 left-16 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                  <span className="text-white text-sm font-bold">✕</span>
                </div>
              )}

              <div className="w-20 shrink-0">
                <span className="text-blue-900 text-xl font-bold mr-2">
                  {q.id}
                </span>
                <span className="font-semibold text-gray-700 text-xl">
                  <AudioText
                    audioKey={"word-" + q.id}
                    src={soundFor(q.word)}
                    playSound={playSound}
                    playingKey={playingKey}
                    className=""
                  >
                    {q.word}
                  </AudioText>
                </span>
              </div>

              <div className="flex flex-1 justify-around">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    {...a.props(q.id, idx, undefined, opt.label)}
                    style={{
                      ...a.props(q.id, idx).style,
                      borderRadius: 12,
                    }}
                    className={`${focusClass} relative ${getCellClass(q.id, idx)}`}
                  >
                    <img
                      src={opt.src}
                      style={{
                        height: "80px",
                        width: "120px",
                      }}
                      alt={IMAGE_DESCRIPTIONS[opt.src]}
                    />

                    {/* ✕ فوق الصورة الغلط */}
                    {isOptionWrong(q, idx) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
                        <span className="text-white text-sm font-bold">✕</span>
                      </div>
                    )}
                  </div>
                ))}
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
}
