import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound from "../../../assets/audio/WorkBook/p38q3.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 5.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A bicycle.",
  [img2]: "A red arrow pointing right.",
  [img3]: "A blue numeral nine.",
  [img4]: "A plate of meat.",
  [img5]: "A metal pipe with a tap.",
};
const focusClass =
  "focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
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
    .replaceAll("â€™", "'")
    .replace(/:/g, " ")
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
const exerciseData = [
  {
    id: "b1",
    src: img1,
    correctAnswer: "✓",
  },
  {
    id: "b2",
    src: img2,
    correctAnswer: "✓",
  },
  {
    id: "b3",
    src: img3,
    correctAnswer: "✓",
  },
  {
    id: "b4",
    src: img4,
    correctAnswer: "✘",
  },
  {
    id: "b5",
    src: img5,
    correctAnswer: "✓",
  },
];
const WB_Unit6_Page38_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(exerciseData.map((q) => [q.id, q.correctAnswer])),
  );
  const { rootRef, message } = a;
  const selections = a.values;
  const stopAtSecond = 10;
  const captions = [
    {
      start: 0.52,
      end: 3.24,
      text: "Page 38, phonics exercise C.",
    },
    {
      start: 4.54,
      end: 9.32,
      text: "Does it have a long I? Listen and write check or X.",
    },
    {
      start: 10.46,
      end: 12.06,
      text: "1.bike.",
    },
    {
      start: 13.22,
      end: 14.98,
      text: "2.write.",
    },
    {
      start: 16.06,
      end: 18.12,
      text: "3.nine.",
    },
    {
      start: 19.14,
      end: 21.1,
      text: "4.neat.",
    },
    {
      start: 21.15,
      end: 23.46,
      text: "5.pipe.",
    },
  ];
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const choiceProps = (item, value) => ({
    ...a.props(
      item.id,
      value,
      undefined,
      value === "✓" ? "Tick, has long i" : "Cross, does not have long i",
    ),
    style: {
      ...a.props(item.id, value).style,
      ...(a.chosen(item.id, value) && !a.results[item.id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
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
          gap: "50px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={"Does it have long i? Listen and write ✓ or ✗."}
          subTitle={
            "Listen to the full word, then mark it only if you hear the long-i sound."
          }
        />

        <QuestionAudioPlayer
          pageId="wb_unit6_page38_q2"
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="flex gap-6 items-center justify-center">
          {exerciseData.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <div className="flex items-start">
                <span className="font-bold text-blue-600">{index + 1}</span>
                <img
                  src={item.src}
                  style={{
                    height: "120px",
                    width: "auto",
                  }}
                  alt={IMAGE_DESCRIPTIONS[item.src]}
                />
              </div>
              <div className="relative">
                <div className="flex gap-2">
                  {/* ✅ YES BOX */}
                  <div className="relative">
                    <div
                      {...choiceProps(item, "✓")}
                      className={`${focusClass} w-12 h-12 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
        ${selections[item.id] === "✓" ? "border-blue-900" : "border-gray-400 hover:border-blue-900"}
        ${a.results[item.id] === "wrong" && selections[item.id] === "✓" && selections[item.id] !== item.correctAnswer ? "border-red-500 bg-red-50" : ""}
      `}
                    >
                      <span className="text-green-600 text-2xl font-bold">
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

                    {/* ❌ error on YES */}
                    {a.results[item.id] === "wrong" &&
                      selections[item.id] === "✓" &&
                      selections[item.id] !== item.correctAnswer && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>

                  {/* ❌ NO BOX */}
                  <div className="relative">
                    <div
                      {...choiceProps(item, "✘")}
                      className={`${focusClass} w-12 h-12 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
        ${selections[item.id] === "✘" ? "border-blue-900" : "border-gray-400 hover:border-blue-900"}
        ${a.results[item.id] === "wrong" && selections[item.id] === "✘" && selections[item.id] !== item.correctAnswer ? "border-red-500 bg-red-50" : ""}
      `}
                    >
                      <span className="text-red-600 text-2xl font-bold">
                        {" "}
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

                    {/* ❌ error on NO */}
                    {a.results[item.id] === "wrong" &&
                      selections[item.id] === "✘" &&
                      selections[item.id] !== item.correctAnswer && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
export default WB_Unit6_Page38_Q2;
