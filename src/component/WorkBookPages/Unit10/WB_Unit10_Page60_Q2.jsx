/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - G/Item_001_ball_She_yard_in_._playing_is_the.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - G/Item_002_TV_They_._are_watching.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - G/Item_003_He_shower_._bathroom_taking_is_a_the_in.mp3";
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
      onClick={(e) => {
        e.stopPropagation();
        playSound(audioKey, src);
      }}
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
    audio.rootRef.current
      ?.querySelectorAll("audio")
      .forEach((player) => player.pause());
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
      else audio.stopAudio();
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
// Percentages follow the inspected SVG artwork, so regions scale with each picture.
// The larger detail buttons below are alternatives to the compact picture regions.
const SOUNDS = {
  "ball she yard in playing is the": clip0,
  "tv they are watching": clip1,
  "he shower bathroom taking is a the in": clip2,
};
const soundFor = (text) => SOUNDS[normalized(text)];
function useWordOrder(questions) {
  const a = useAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correct.toLowerCase()])),
    {
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
    const text = next
      .map((i) => question(id).words[i])
      .join(" ")
      .replace(/\s+([.,!?])/g, "$1")
      .toLowerCase();
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
    "aria-label": `${question(id).words[index]}. ${a.locked(id) ? "Correct and locked. Hear this word." : placed ? "Return this word to this sentence's bank." : "Add this word to this sentence."}`,
    "aria-disabled": a.locked(id) || (!placed && indices(id).includes(index)),
    onClick: (event) => {
      a.playSound(
        (placed ? "answer-" : "bank-") + id + "-" + index,
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
      solved[q.id] = q.correct
        .replace(/([.,!?])/g, " $1")
        .split(/\s+/)
        .map((word) => {
          const index = q.words.findIndex(
            (candidate, i) =>
              !used.has(i) && candidate.toLowerCase() === word.toLowerCase(),
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
function WB_Unit10_Page60_Q2() {
  const DATA = [
    {
      id: "q1",
      scrambled: ["ball", "She", "yard", "in", ".", "playing", "is", "the"],
      correct: "She is playing ball in the yard.",
    },
    {
      id: "q2",
      scrambled: ["TV", "They", ".", "are", "watching"],
      correct: "They are watching TV.",
    },
    {
      id: "q3",
      scrambled: [
        "He",
        "shower",
        ".",
        "bathroom",
        "taking",
        "is",
        "a",
        "the",
        "in",
      ],
      correct: "He is taking a shower in the bathroom.",
    },
    {
      id: "q4",
      scrambled: ["studying", "the", ".", "We", "bedroom", "are", "in"],
      correct: "We are studying in the bedroom.",
    },
    {
      id: "q5",
      scrambled: [
        "I'm",
        "yard",
        "flowers",
        ".",
        "watering",
        "the",
        "in",
        "the",
      ],
      correct: "I'm watering the flowers in the yard.",
    },
  ];
  const a = useWordOrder(
    DATA.map((q) => ({
      ...q,
      words: q.scrambled,
    })),
  );
  const { rootRef, message, playingKey, playSound } = a;
  const answers = Object.fromEntries(
    DATA.map((q) => [q.id, a.indices(q.id).map((i) => q.scrambled[i])]),
  );
  const checkAnswers = a.check,
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
          sectionLetter="G"
          title={<>Unscramble and write each sentence.</>}
          subTitle={
            "Say the correct present-continuous sentence first, then arrange every word and punctuation mark."
          }
        />

        <div>
          {DATA.map((item, idx) => {
            return (
              <div key={item.id} className="space-y-1 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-black-600 text-lg flex gap-2 items-center">
                      {" "}
                      <span className="font-bold text-blue-900 text-xl">
                        {idx + 1}
                      </span>{" "}
                      <AudioText
                        audioKey={"scrambled-" + item.id}
                        src={soundFor(item.scrambled.join(" "))}
                        playSound={playSound}
                        playingKey={playingKey}
                        tabIndex={a.picked ? -1 : 0}
                      >
                        {item.scrambled.join(" ")}
                      </AudioText>
                    </h2>
                    <div className="flex flex-wrap gap-2 w-160 p-2 rounded-lg">
                      {item.scrambled.map((word, wIdx) => {
                        const isUsed = a.indices(item.id).includes(wIdx);
                        return (
                          <button
                            key={wIdx}
                            className={
                              `WB-word-bank ${isUsed ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border-2 border-blue-900 text-blue-900 hover:border-blue-400 hover:shadow-sm"}` +
                              " rounded-lg " +
                              focusClass
                            }
                            type="button"
                            {...a.wordProps(item.id, wIdx)}
                            style={{
                              position: "relative",
                            }}
                            ref={(el) => {
                              a.bankRefs.current[item.id + "-" + wIdx] = el;
                            }}
                          >
                            {word}
                            <>
                              {playingKey ===
                                "bank-" + item.id + "-" + wIdx && (
                                <SpeakerBadge />
                              )}
                            </>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div
                  className={`relative min-h-[50px] p-3 border-b-2 border-gray-400 flex flex-wrap gap-1 items-center transition-all ${a.results[item.id] === "wrong" && "border-red-500"}`}
                  style={{
                    borderBottomColor:
                      a.results[item.id] === "correct"
                        ? "#16a34a"
                        : a.results[item.id] === "wrong"
                          ? "#ef4444"
                          : undefined,
                  }}
                >
                  {/* ❌ Wrong Answer */}
                  {a.results[item.id] === "wrong" && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                      ✕
                    </div>
                  )}

                  {answers[item.id].length === 0 && (
                    <span className="text-gray-300 italic text-sm">
                      Click words to build the sentence...
                    </span>
                  )}

                  {answers[item.id].map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className={
                        "cursor-pointer text-lg hover:text-red-600 transition-colors " +
                        focusClass
                      }
                      {...a.wordProps(item.id, a.indices(item.id)[wIdx], true)}
                      ref={(el) => {
                        a.answerRefs.current[item.id + "-" + wIdx] = el;
                      }}
                      style={{
                        position: "relative",
                        borderRadius: 4,
                      }}
                    >
                      {word}
                      <>
                        {playingKey ===
                          "answer-" +
                            item.id +
                            "-" +
                            a.indices(item.id)[wIdx] && <SpeakerBadge />}
                      </>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
            handleShowAnswer={a.show}
          />
        </div>
      </div>
    </div>
  );
}
export default WB_Unit10_Page60_Q2;
