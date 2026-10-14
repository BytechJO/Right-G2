import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex A 2.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

import "./WB_Unit1_Page3_Q1.css";

import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - A/Item_001_He's_my_father.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - A/Item_002_They're_my_father_and_mother.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - A/Item_003_Who_are_they.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 3 - A/Item_004_Who's_he.mp3";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl gestures toward a man seated at an outdoor table with a cup.",
  [img2]:
    "A girl gestures toward a man and a woman sitting together on a pink sofa.",
};

const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
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
// eslint-disable-next-line react-refresh/only-export-components -- Keep this control local.
const AudioText = ({
  children,
  audioKey,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
  tabIndex = 0,
}) => (
  <span
    role="button"
    tabIndex={tabIndex}
    aria-label={String(children) + ". Hear it."}
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
        ? { boxShadow: "0 0 0 3px #2563eb", backgroundColor: "#dbeafe" }
        : {}),
    }}
  >
    {children}
    {playingKey === audioKey && <SpeakerBadge />}
  </span>
);

function useWordPlacement({
  initialAnswers,
  correctAnswers,
  bank,
  sounds,
  limits = {},
  labels = {},
  missingMessage,
}) {
  const [values, setValues] = useState(initialAnswers),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    focusFrame = useRef(null),
    suppressFocus = useRef(false);
  const slotIds = Object.keys(correctAnswers),
    locked = (id) => revealed || results[id] === "correct";
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focus = (el) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocus.current = true;
      try {
        el()?.focus();
      } finally {
        suppressFocus.current = false;
      }
    });
  };
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );
  const used = (word, current = values) =>
    Object.entries(current).filter(
      ([id, v]) => v === word && results[id] !== "wrong",
    ).length >= (limits[word] || 1);
  const available = (word) => bank.includes(word) && !revealed && !used(word);
  const place = (id, word) => {
    if (!slotIds.includes(id) || locked(id) || !bank.includes(word)) return;
    if (
      Object.entries(values).filter(
        ([slot, v]) => slot !== id && v === word && locked(slot),
      ).length >= (limits[word] || 1)
    )
      return;
    const next = {
        ...values,
      },
      affected = [id];
    if ((limits[word] || 1) === 1) {
      for (const slot of slotIds)
        if (slot !== id && next[slot] === word && !locked(slot)) {
          next[slot] = "";
          affected.push(slot);
        }
    } else {
      const occupied = slotIds.filter(
        (slot) => slot !== id && next[slot] === word,
      );
      while (occupied.length >= limits[word]) {
        const prior = occupied.find((slot) => !locked(slot));
        if (!prior) return;
        next[prior] = "";
        affected.push(prior);
        occupied.splice(occupied.indexOf(prior), 1);
      }
    }
    next[id] = word;
    setValues(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([slot]) => !affected.includes(slot)),
      ),
    );
    setPicked(null);
    setMessage((labels[word] || word) + " placed in the blank.");
    return next;
  };
  const remove = (id) => {
    if (locked(id) || !values[id]) return;
    setValues((prev) => ({
      ...prev,
      [id]: "",
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setPicked(null);
    setMessage((labels[values[id]] || values[id]) + " returned to the bank.");
  };
  const cancel = () => {
    const old = picked;
    setPicked(null);
    setMessage("Selection cancelled.");
    if (old) focus(() => bankRefs.current[old]);
  };
  const wordLabel = (word) => labels[word] || word;
  const bankProps = (word) => ({
    "data-word-id": word,
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-pressed": picked === word,
    "aria-disabled": !available(word),
    "aria-label":
      wordLabel(word) + ". Choose with Enter or Space, then place in a blank.",
    onClick: () => playSound("bank-" + word, sounds[word]),
    onFocus: (e) => {
      if (!suppressFocus.current && e.currentTarget.matches(":focus-visible"))
        playSound("bank-" + word, sounds[word]);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape") {
        if (picked) {
          e.preventDefault();
          e.stopPropagation();
          cancel();
        }
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      playSound("bank-" + word, sounds[word]);
      if (!available(word)) return;
      const target =
        slotIds.find((id) => !locked(id) && !values[id]) ||
        slotIds.find((id) => !locked(id));
      if (!target) return;
      setPicked(word);
      setMessage(
        wordLabel(word) +
          " chosen. Press Enter or Space on a blank to place it.",
      );
      focus(() => slotRefs.current[target]);
    },
    onKeyUp: release,
  });
  const slotProps = (id, snapshot) => ({
    "data-slot-id": id,
    role: "button",
    tabIndex: 0,
    "aria-disabled": locked(id),
    "aria-label":
      "Blank " +
      (slotIds.indexOf(id) + 1) +
      ". " +
      (wordLabel(values[id]) || "Empty") +
      ". " +
      (locked(id)
        ? "Correct and locked."
        : results[id] === "wrong"
          ? "Incorrect, editable."
          : "Editable."),
    onClick: () => {
      if (locked(id)) {
        playSound("slot-" + id, sounds[values[id]]);
        return;
      }
      remove(id);
    },
    onKeyDown: (e) => {
      if (e.key === "Tab" && picked) {
        const editable = slotIds.filter((slot) => !locked(slot)),
          at = editable.indexOf(id),
          next = at + (e.shiftKey ? -1 : 1);
        if (next >= 0 && next < editable.length) {
          e.preventDefault();
          e.stopPropagation();
          focus(() => slotRefs.current[editable[next]]);
        }
        return;
      }
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && results[id] === "wrong") remove(id);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      if (locked(id)) {
        playSound("slot-" + id, sounds[values[id]]);
        return;
      }
      if (picked) {
        const word = picked,
          next = place(id, word);
        if (next)
          focus(
            () => bankRefs.current[bank.find((w) => !used(w, next)) || word],
          );
      } else remove(id);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: "6px",
      ...(results[id] === "correct" || revealed
        ? {
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 -2px #16a34a",
          }
        : {}),
      ...(snapshot?.isDraggingOver && !locked(id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const check = () => {
    if (revealed) return;
    cancelFocus();
    setPicked(null);
    stopAudio();
    if (slotIds.some((id) => !values[id])) {
      ValidationAlert.info(missingMessage);
      setMessage(missingMessage);
      return;
    }
    const next = Object.fromEntries(
      slotIds.map((id) => [
        id,
        results[id] === "correct" || values[id] === correctAnswers[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((x) => x === "correct").length,
      total = slotIds.length,
      msg = `Score: ${score} / ${total}`;
    setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const show = () => {
    cancelFocus();
    stopAudio();
    setPicked(null);
    setValues({
      ...correctAnswers,
    });
    setResults(Object.fromEntries(slotIds.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    cancelFocus();
    stopAudio();
    setPicked(null);
    setValues({
      ...initialAnswers,
    });
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset. All answers and results cleared.");
  };
  const dragStart = () => {
    cancelFocus();
    setPicked(null);
  };
  const bankStyle = (word) => ({
    position: "relative",
    ...(picked === word
      ? {
          outline: "4px solid #2563eb",
          outlineOffset: 2,
          backgroundColor: "#dbeafe",
        }
      : {}),
  });
  return {
    values,
    results,
    revealed,
    picked,
    message,
    rootRef,
    playingKey,
    playSound,
    stopAudio,
    bankRefs,
    slotRefs,
    locked,
    used,
    place,
    bankProps,
    slotProps,
    check,
    show,
    reset,
    dragStart,
    bankStyle,
  };
}

const WB_Unit1_Page3_Q1 = () => {
  const questions = [
    {
      img: img1,
      parts: [
        { type: "text", value: "Who's he?" },
        { type: "input", answer: "He's my father" },
      ],
    },
    {
      img: img2,
      parts: [
        { type: "input", answer: "Who are they?" },
        { type: "input", answer: "They're my father and mother" },
      ],
    },
  ];
  
  const wordBank = [
    { id: "w2", text: "Who are they?" },
    { id: "w1", text: "He's my father" },
    { id: "w3", text: "They're my father and mother" },
  ];

  const correctAnswers = Object.fromEntries(
    questions.flatMap((q, qi) =>
      q.parts.flatMap((part, pi) =>
        part.type === "input"
          ? [
              [
                `drop-${qi}-${pi}`,
                wordBank.find((w) => w.text === part.answer).id,
              ],
            ]
          : [],
      ),
    ),
  );
  const interaction = useWordPlacement({
    initialAnswers: Object.fromEntries(
      Object.keys(correctAnswers).map((id) => [id, ""]),
    ),
    correctAnswers,
    bank: wordBank.map((w) => w.id),
    labels: Object.fromEntries(wordBank.map((w) => [w.id, w.text])),
    sounds: { w1: clip0, w3: clip1, w2: clip2 },
    missingMessage: "Please fill all answers first!",
  });
  const { rootRef, message, playingKey, playSound } = interaction;
  const answers = questions.map((q, qi) =>
    q.parts.map((part, pi) =>
      part.type === "input" ? interaction.values[`drop-${qi}-${pi}`] : null,
    ),
  );
  const wrongInputs = Object.keys(interaction.results)
      .filter((id) => interaction.results[id] === "wrong")
      .map((id) => id.replace("drop-", "")),
    locked = interaction.revealed;
  const checkAnswers = interaction.check,
    showAnswers = interaction.show,
    reset = interaction.reset;
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination) interaction.place(destination.droppableId, draggableId);
  };
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={interaction.dragStart}
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
    >
      <div
        ref={rootRef}
        style={{ display: "flex", justifyContent: "center", padding: "30px" }}
      >
        <div className="div-forall" style={{ gap: "20px" }}>
          {/* ❌ الهيدر كما هو */}
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {message}
          </div>
          <ExerciseHeader
            isWorkbook
            sectionLetter="A"
            title={"Look and write."}
            subTitle={
              "Look at each family picture first, then choose or write the sentence that answers the question."
            }
          />

          <div className="flex flex-col gap-5">
            {/* WORD BANK */}
            <Droppable droppableId="word-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="CB-unit2-p6-q2-word-bank"
                  style={{ marginBottom: "0px" }}
                >
                  {wordBank.map((w, i) => {
                    const isUsed = interaction.used(w.id);
                    return (
                      <Draggable
                        key={w.id}
                        draggableId={w.id}
                        index={i}
                        isDragDisabled={locked || isUsed}
                      >
                        {(provided) => (
                          <span
                            ref={(el) => {
                              provided.innerRef(el);
                              interaction.bankRefs.current[w.id] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            {...interaction.bankProps(w.id)}
                            className={`WB-word-bank ${focusClass}`}
                            style={{
                              background: isUsed ? "#ccc" : "white",
                              opacity: isUsed ? 0.6 : 1,
                              cursor: isUsed ? "not-allowed" : "grab",
                              ...provided.draggableProps.style,
                              ...interaction.bankStyle(w.id),
                            }}
                          >
                            {w.text}
                            {playingKey === `bank-${w.id}` && <SpeakerBadge />}
                          </span>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS */}
            <div className="CB-unit2-p6-q2-content" style={{ gap: "45px" }}>
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="CB-unit2-p6-q2-row">
                  <div
                    className="CB-unit2-p6-q2-left"
                    style={{ alignItems: "flex-start" }}
                  >
                    <span className="font-bold text-2xl">{qIndex + 1}</span>
                    <img
                      src={q.img}
                      alt={IMAGE_DESCRIPTIONS[q.img] || ""}
                      className="WB-unit1-p3-q1-img"
                    />
                  </div>

                  <div className="WB-unit1-p3-q1-sentence">
                    {q.parts.map((part, pIndex) =>
                      part.type === "text" ? (
                        <AudioText
                          tabIndex={interaction.picked ? -1 : 0}
                          key={pIndex}
                          audioKey={`text-${qIndex}-${pIndex}`}
                          src={clip3}
                          playSound={playSound}
                          playingKey={playingKey}
                          className="CB-unit2-p6-q2-text"
                        >
                          {part.value}
                        </AudioText>
                      ) : (
                        <Droppable
                          key={pIndex}
                          droppableId={`drop-${qIndex}-${pIndex}`}
                          isDropDisabled={interaction.locked(
                            `drop-${qIndex}-${pIndex}`,
                          )}
                        >
                          {(provided, snapshot) => (
                            <span
                              ref={(el) => {
                                provided.innerRef(el);
                                interaction.slotRefs.current[
                                  `drop-${qIndex}-${pIndex}`
                                ] = el;
                              }}
                              {...provided.droppableProps}
                              {...interaction.slotProps(
                                `drop-${qIndex}-${pIndex}`,
                                snapshot,
                              )}
                              className={`WB-unit1-p3-q1-input ${focusClass} ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                            >
                              {wordBank.find(
                                (w) => w.id === answers[qIndex][pIndex],
                              )?.text || ""}
                              {playingKey ===
                                `slot-drop-${qIndex}-${pIndex}` && (
                                <SpeakerBadge />
                              )}
                              {provided.placeholder}
                              {wrongInputs.includes(`${qIndex}-${pIndex}`) && (
                                <span className="CB-unit2-p6-q2-input-error">
                                  ✕
                                </span>
                              )}
                            </span>
                          )}
                        </Droppable>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ❌ الأزرار كما هي */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page3_Q1;
