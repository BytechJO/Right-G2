/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import imgA from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/with numbers 2.svg";
import imgB from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 54/with numbers 1.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_001_wearing.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_002_man.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_003_is.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_004_hat.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_005_The.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_006_a.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_007_isn't.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_008_sandcastle.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_009_building.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_010_girl.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_011_eating.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 9/Page 54 - G/Item_012_She.mp3";
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
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
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
      position: "relative",
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
// Percentages follow the inspected SVG artwork, so regions scale with each picture.
// The larger detail buttons below are alternatives to the compact picture regions.
const SOUNDS = {
  wearing: clip0,
  man: clip1,
  is: clip2,
  hat: clip3,
  the: clip4,
  a: clip5,
  "isn't": clip6,
  sandcastle: clip7,
  building: clip8,
  girl: clip9,
  eating: clip10,
  she: clip11,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgA]:
    "A beach scene with five numbered people: a man reclining under an umbrella, two children on the sand, a seated woman with an ice cream, and a child holding a doll.",
  [imgB]:
    "A second beach scene: a man reclining without a hat, a child eating, a swimmer waving, a woman reading, and a child with a yellow balloon.",
};
const exerciseGData = [
  {
    id: 1,
    img: "A",
    correct: "The man is wearing a hat.",
    scrambled: ["wearing", "man", "is", "hat.", "The", "a"],
  },
  {
    id: 1,
    img: "B",
    correct: "The man isn't wearing a hat.",
    scrambled: ["isn't", "man", "The", "a", "wearing", "hat."],
  },
  {
    id: 2,
    img: "A",
    correct: "The girl is building a sandcastle.",
    scrambled: ["is", "sandcastle.", "building", "The", "a", "girl"],
  },
  {
    id: 2,
    img: "B",
    correct: "She isn't building a sandcastle. She is eating.",
    scrambled: [
      "building",
      "isn't",
      "eating.",
      "a",
      "She",
      "She",
      "is",
      "sandcastle.",
    ],
  },
  {
    id: 3,
    img: "A",
    correct: "The boy is holding a bucket.",
    scrambled: ["is", "boy", "bucket.", "The", "a", "holding"],
  },
  {
    id: 3,
    img: "B",
    correct: "The boy isn't carrying a bucket. He is swimming and waving.",
    scrambled: [
      "isn't",
      "a",
      "carrying",
      "bucket.",
      "boy",
      "The",
      "swimming",
      "is",
      "He",
      "waving.",
      "and",
    ],
  },
  {
    id: 4,
    img: "A",
    correct: "The woman is eating an ice cream.",
    scrambled: ["an", "is", "woman", "The", "eating", "cream.", "ice"],
  },
  {
    id: 4,
    img: "B",
    correct: "She isn't eating ice cream. She is reading a book.",
    scrambled: [
      "isn't",
      "ice",
      "reading",
      "She",
      "She",
      "is",
      "cream.",
      "book.",
      "a",
      "eating",
    ],
  },
  {
    id: 5,
    img: "A",
    correct: "The girl is playing with a doll.",
    scrambled: ["girl", "doll.", "playing", "The", "a", "with", "is"],
  },
  {
    id: 5,
    img: "B",
    correct: "The girl is playing with a yellow balloon.",
    scrambled: [
      "playing",
      "girl",
      "is",
      "with",
      "The",
      "balloon.",
      "a",
      "yellow",
    ],
  },
];
function useWordOrder(questions) {
  const a = useAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correct])),
    {
      normalize: true,
      missing: "Please complete all sentences first!",
    },
  );
  const [arrangements, setArrangements] = useState({});
  const bankRefs = useRef({}),
    answerRefs = useRef({}),
    frame = useRef(null);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      get()?.focus();
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const question = (id) => questions.find((q) => q.id === id);
  const indices = (id) => arrangements[id] || [];
  const update = (id, next) => {
    setArrangements((prev) => ({
      ...prev,
      [id]: next,
    }));
    const text = next.map((i) => question(id).words[i]).join(" ");
    a.choose(id, text);
    a.setMessage(`Sentence ${id}: ${text || "Empty"}.`);
  };
  const add = (id, index, keyboard = false) => {
    if (
      a.locked(id) ||
      !question(id) ||
      index < 0 ||
      index >= question(id).words.length ||
      indices(id).includes(index)
    )
      return;
    const next = [...indices(id), index];
    update(id, next);
    if (keyboard) {
      const available = question(id).words.findIndex(
        (_, i) => !next.includes(i),
      );
      focus(() =>
        available >= 0
          ? bankRefs.current[id + "-" + available]
          : answerRefs.current[id + "-0"],
      );
    }
  };
  const remove = (id, index, keyboard = false) => {
    if (a.locked(id) || !indices(id).includes(index)) return;
    update(
      id,
      indices(id).filter((i) => i !== index),
    );
    if (keyboard) focus(() => bankRefs.current[id + "-" + index]);
  };
  const wordProps = (id, index, placed = false) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `Sentence ${id}, word ${index + 1}: ${question(id).words[index]}. ${a.locked(id) ? "Correct and locked. Hear this word." : placed ? "Return this word to this sentence's bank." : "Add this word to this sentence."}`,
    "aria-disabled": a.locked(id) || (!placed && indices(id).includes(index)),
    onClick: (event) => {
      a.playSound(
        (placed && a.locked(id) ? "answer-" : "bank-") + id + "-" + index,
        soundFor(question(id).words[index]),
      );
      if (placed) remove(id, index, event.detail === 0);
      else add(id, index, event.detail === 0);
    },
    onKeyDown: (event) => {
      if (["Delete", "Backspace"].includes(event.key) && placed) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat && a.results[id] === "wrong") remove(id, index, true);
        return;
      }
      activate(event);
    },
    onKeyUp: release,
  });
  const check = () => {
    if (a.completionRef.current) return;
    cancelFocus();
    a.stopAudio();
    if (questions.some((q) => indices(q.id).length !== q.words.length)) {
      a.setMessage("Please complete all sentences first!");
      ValidationAlert.info("Please complete all sentences first!");
      return;
    }
    a.check();
  };
  const show = () => {
    cancelFocus();
    const solved = {};
    for (const q of questions) {
      const used = new Set();
      solved[q.id] = q.correct.split(/\s+/).map((word) => {
        const index = q.words.findIndex(
          (candidate, i) =>
            !used.has(i) && normalized(candidate) === normalized(word),
        );
        used.add(index);
        return index;
      });
    }
    setArrangements(solved);
    a.show();
  };
  const reset = () => {
    cancelFocus();
    setArrangements({});
    a.reset();
  };
  return {
    ...a,
    arrangements,
    indices,
    add,
    remove,
    wordProps,
    bankRefs,
    answerRefs,
    check,
    show,
    reset,
  };
}
function WB_Unit9_Page54_Q1() {
  const order = useWordOrder(
    exerciseGData.map((item) => ({
      id: item.img + "-" + item.id,
      words: item.scrambled,
      correct: item.correct,
    })),
  );
  const { rootRef, message, playingKey } = order;
  const userAnswers = order.arrangements;
  const checkAnswers = order.check,
    handleShowAnswer = order.show,
    handleTryAgain = order.reset;
  const renderSentence = (key, item) =>
    order.indices(key).map((i, position) => (
      <span
        key={i}
        {...order.wordProps(key, i, true)}
        ref={(el) => {
          order.answerRefs.current[key + "-" + position] = el;
        }}
        className={
          "mr-1 cursor-pointer hover:text-red-500 transition rounded-sm " +
          focusClass
        }
        style={{
          position: "relative",
        }}
      >
        {item.scrambled[i]}
        {playingKey === "answer-" + key + "-" + i && <SpeakerBadge />}
      </span>
    ));
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="G"
          title={<>What is different? Look and write.</>}
          subTitle={"Compare the pictures in each row and write the action or detail that makes one picture different."}
        />
        <div className="flex flex-col gap-5">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2"
            style={{
              justifyItems: "center",
            }}
          >
            <div className="relative ">
              <img
                src={imgA}
                className="max-w-full max-h-45 object-contain"
                alt={
                  IMAGE_DESCRIPTIONS[imgA] || "Illustration for this question"
                }
              />
            </div>
            <div className="relative">
              <img
                src={imgB}
                className="max-w-full max-h-45 object-contain"
                alt={
                  IMAGE_DESCRIPTIONS[imgB] || "Illustration for this question"
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {["A", "B"].map((side) => (
              <div key={side} className="flex flex-col gap-8">
                {exerciseGData
                  .filter((d) => d.img === side)
                  .map((item) => {
                    const key = `${side}-${item.id}`;
                    return (
                      <div key={key} className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-600 w-4">
                            {item.id}
                          </span>
                          <div
                            className="flex-1 min-h-[40px] border-b-2 border-gray-400 font-serif text-lg px-2 flex items-center relative"
                            style={{
                              ...(order.results[key]
                                ? {
                                    borderBottomColor:
                                      order.results[key] === "correct"
                                        ? "#16a34a"
                                        : "#ef4444",
                                  }
                                : {}),
                            }}
                          >
                            {renderSentence(key, item)}

                            {order.results[key] === "wrong" && (
                              <span className="absolute -right-6 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                                ✕
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pl-7">
                          {item.scrambled.map((word, i) => {
                            const isUsed = (userAnswers[key] || []).includes(i);
                            return (
                              <button
                                key={i}
                                className={
                                  `WB-word-bank
                                ${isUsed ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed" : "border-blue-900 hover:bg-blue-50 hover:border-blue-300"}
                                ${order.locked(key) && "opacity-50"}
                              ` +
                                  " focus-visible:rounded-md! " +
                                  focusClass
                                }
                                style={{
                                  fontSize: "16px",
                                  position: "relative",
                                }}
                                type="button"
                                {...order.wordProps(key, i)}
                                disabled={order.locked(key) || isUsed}
                                ref={(el) => {
                                  order.bankRefs.current[key + "-" + i] = el;
                                }}
                              >
                                {word}
                                <>
                                  {playingKey === "bank-" + key + "-" + i && (
                                    <SpeakerBadge />
                                  )}
                                </>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
}
export default WB_Unit9_Page54_Q1;
