/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - D/Item_001_eats_breakfast.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - D/Item_002_sleeps.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - D/Item_003_does_homework.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - D/Item_004_makes_bed.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - D/Item_005_goes_to_school.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 34 - D/Item_006_gets_up.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex D 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex D 1.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 34/Ex D 3.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl eating at a table.",
  [img2]: "A girl writing at a desk.",
  [img3]: "A girl stretching in bed.",
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
  "eats breakfast": clip0,
  sleeps: clip1,
  "does homework": clip2,
  "makes bed": clip3,
  "goes to school": clip4,
  "gets up": clip5,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replaceAll("â€™", "'")
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
const QUESTIONS = [
  {
    id: 1,
    image: img1,
    options: ["eats breakfast", "sleeps"],
    correct: "eats breakfast",
  },
  {
    id: 2,
    image: img2,
    options: ["does homework", "makes bed"],
    correct: "does homework",
  },
  {
    id: 3,
    image: img3,
    options: ["goes to school", "gets up"],
    correct: "gets up",
  },
];
const WB_Unit6_Page34_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, q.correct])),
  );
  const { rootRef, message, playingKey } = a;
  const answers = a.values;
  const checkAnswers = a.check;
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
          gap: "20px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="D"
          title={<>Look, read, and circle.</>}
          subTitle={"Read the clue and look at the picture, then tap the daily routine and time answer you would circle."}
        />

        <div>
          <div>
            {QUESTIONS.map((q) => (
              <div key={q.id} className="flex items-center gap-6 p-2">
                <div className="flex items-start gap-2">
                  <span className="text-blue-900 mr-3 text-2xl font-bold">
                    {q.id}
                  </span>
                  <img
                    src={q.image}
                    className="object-cover rounded-lg "
                    style={{
                      height: "140px",
                    }}
                    alt={IMAGE_DESCRIPTIONS[q.image]}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, index) => {
                    const isSelected = answers[q.id] === opt;
                    const isCorrect = opt === q.correct;
                    const isWrongSelected =
                      a.results[q.id] === "wrong" && isSelected && !isCorrect;
                    return (
                      <button
                        key={opt}
                        {...a.props(q.id, opt, soundFor(opt))}
                        style={{
                          ...a.props(q.id, opt).style,
                        }}
                        className={`${focusClass} relative text-left px-4 py-2 rounded-lg border-2 transition
    ${isSelected ? "border-blue-900" : "border-gray-300 hover:border-blue-900"} ${isWrongSelected && "border-red-500 bg-white"}`}
                      >
                        <span className="font-bold mr-2">
                          {String.fromCharCode(97 + index)}.
                        </span>
                        {opt}
                        {playingKey === "choice-" + q.id + "-" + opt && (
                          <SpeakerBadge />
                        )}

                        {isWrongSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md border-2 border-white">
                            <span className="text-white text-xs font-bold leading-none">
                              ✕
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              checkAnswers={checkAnswers}
              handleStartAgain={a.reset}
              handleShowAnswer={a.show}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WB_Unit6_Page34_Q2;
