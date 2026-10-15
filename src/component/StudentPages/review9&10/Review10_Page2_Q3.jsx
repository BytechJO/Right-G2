import React, { useState, useRef, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_001_nest.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_002_feet.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_003_rest.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_004_eat.mp3";
import clip4 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_005_desk.mp3";
import clip5 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_006_egg.mp3";
import clip6 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_007_beg.mp3";
import clip7 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_008_meat.mp3";
import clip8 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_009_vet.mp3";
import clip9 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_010_seal.mp3";
import clip10 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_011_net.mp3";
import clip11 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_012_tea.mp3";
import clip12 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_013_pen.mp3";
import clip13 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_014_pet.mp3";
import clip14 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_015_ten.mp3";
const clips = {
  nest: clip0,
  feet: clip1,
  rest: clip2,
  eat: clip3,
  desk: clip4,
  egg: clip5,
  beg: clip6,
  meat: clip7,
  vet: clip8,
  seal: clip9,
  net: clip10,
  tea: clip11,
  pen: clip12,
  pet: clip13,
  ten: clip14,
};
const items = [
  { scrambled: ["tae"], correct: ["eat"] },
  { scrambled: ["tesn"], correct: ["nest"] },
  { scrambled: ["neegr"], correct: ["green"] },
  { scrambled: ["leas"], correct: ["seal"] },
  { scrambled: ["geg"], correct: ["egg"] },
  { scrambled: ["nep"], correct: ["pen"] },
];

export default function Review10_Page2_Q3() {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null),
    scopeRef = useRef(null);
  const normalizeAudioText = (text) =>
    text.replaceAll("’", "'").replace(/[.?!]$/, "");
  const stopAudio = () => {
    const a = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    scopeRef.current?.querySelectorAll("audio").forEach((a) => {
      a.pause();
      try {
        a.currentTime = 0;
      } catch {
        /* media unavailable */
      }
    });
  };
  const listen = (key, text) => {
    const src = clips[normalizeAudioText(text)];
    if (!src) return;
    stopAudio();
    const a = new Audio(src);
    audioRef.current = a;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== a) return;
      a.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    a.onended = finish;
    a.onerror = fail;
    try {
      a.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (e) => {
      const a = audioRef.current;
      if (!a || e.target === a) return;
      audioRef.current = null;
      a.onended = null;
      a.onerror = null;
      a.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const a = audioRef.current;
      audioRef.current = null;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.pause();
      }
    };
  }, []);
  const badge = (key) =>
    playingKey === key && (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          color: "black",
          pointerEvents: "none",
          zIndex: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const activation = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) action();
    }
  };
  const activationUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const [answers, setAnswers] = useState(items.map(() => []));
  const [placedIds, setPlacedIds] = useState(items.map(() => []));
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState(null);
  const [hoveredWord, setHoveredWord] = useState(null);
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    focusFrame = useRef(null);
  const isLocked = (i) => locked || results[i] === "correct";
  const letterBank = items.map((item, i) =>
    item.scrambled[0]
      .split("")
      .map((value, j) => ({ value, used: placedIds[i].includes(j) })),
  );
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusLater = (get) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      get()?.focus();
    });
  };
  useEffect(() => () => cancelFocus(), []);
  const clearChoice = () => {
    cancelFocus();
    setPicked(null);
  };
  const updateRow = (i, ids) => {
    setPlacedIds((prev) => prev.map((v, row) => (row === i ? ids : v)));
    setAnswers((prev) =>
      prev.map((v, row) =>
        row === i ? ids.map((j) => letterBank[i][j].value) : v,
      ),
    );
    setResults((prev) => ({ ...prev, [i]: null }));
  };
  const place = (i, j, keyboard = false) => {
    if (
      isLocked(i) ||
      letterBank[i][j]?.used ||
      answers[i].length >= items[i].correct[0].length
    )
      return;
    const ids = [...placedIds[i], j];
    updateRow(i, ids);
    clearChoice();
    setAnnouncement(
      "Letter " + letterBank[i][j].value + " placed in word " + (i + 1) + ".",
    );
    if (keyboard) {
      const next = letterBank[i].findIndex((_, k) => !ids.includes(k));
      focusLater(() =>
        next < 0 ? slotRefs.current[i] : bankRefs.current[i + "-" + next],
      );
    }
  };
  const handleRemoveLetter = (i, j, keyboard = false) => {
    if (isLocked(i) || !placedIds[i].length) return;
    const id = placedIds[i][j];
    updateRow(
      i,
      placedIds[i].filter((_, k) => k !== j),
    );
    clearChoice();
    setAnnouncement("Letter returned to the bank.");
    if (keyboard) focusLater(() => bankRefs.current[i + "-" + id]);
  };
  const pickLetter = (i, j) => {
    if (isLocked(i) || letterBank[i][j].used) return;
    setPicked({ i, j });
    setAnnouncement(
      "Letter " +
        letterBank[i][j].value +
        " chosen. Press Enter or Space on word " +
        (i + 1) +
        " to place it.",
    );
    focusLater(() => slotRefs.current[i]);
  };
  const escape = (e) => {
    if (e.key !== "Escape" || !picked) return;
    e.preventDefault();
    e.stopPropagation();
    const token = picked;
    clearChoice();
    setAnnouncement("Selection cancelled.");
    focusLater(() => bankRefs.current[token.i + "-" + token.j]);
  };
  const slotKey = (e, i) => {
    escape(e);
    if (e.key === "Enter" || e.key === " ") {
      activation(e, () => {
        if (isLocked(i)) {
          listen("word-" + i, items[i].correct[0]);
          return;
        }
        if (picked) {
          if (picked.i === i) place(i, picked.j, true);
        } else if (answers[i].length)
          handleRemoveLetter(i, answers[i].length - 1, true);
      });
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && results[i] === "wrong")
        handleRemoveLetter(i, answers[i].length - 1, true);
    }
  };
  const onDragEnd = ({ source, destination }) => {
    if (
      !destination ||
      !source.droppableId.startsWith("bank-") ||
      !destination.droppableId.startsWith("slot-")
    )
      return;
    const i = Number(source.droppableId.slice(5));
    if (i !== Number(destination.droppableId.slice(5))) return;
    place(i, source.index);
  };
  const resetAll = () => {
    clearChoice();
    stopAudio();
    setAnswers(items.map(() => []));
    setPlacedIds(items.map(() => []));
    setResults({});
    setLocked(false);
    setAnnouncement("Activity reset.");
  };
  const showAnswers = () => {
    clearChoice();
    stopAudio();
    const ids = items.map((item, i) => {
      const taken = [];
      for (const letter of item.correct[0]) {
        const j = letterBank[i].findIndex(
          (t, j) => t.value === letter && !taken.includes(j),
        );
        taken.push(j);
      }
      return taken;
    });
    setPlacedIds(ids);
    setAnswers(items.map((item) => item.correct[0].split("")));
    setResults(Object.fromEntries(items.map((_, i) => [i, "correct"])));
    setLocked(true);
    setAnnouncement("All correct words shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    clearChoice();
    stopAudio();
    if (answers.some((a) => a.length === 0)) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const next = Object.fromEntries(
      items.map((item, i) => [
        i,
        answers[i].join("") === item.correct[0] ? "correct" : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((v) => v === "correct").length,
      total = items.length;
    setLocked(score === total);
    setAnnouncement("Score " + score + " out of " + total + ".");
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg =
      '<div style="font-size:20px;text-align:center;"><span style="color:' +
      color +
      ';font-weight:bold">Score: ' +
      score +
      " /" +
      total +
      "</span></div>";
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={clearChoice}
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
    >
      <div ref={scopeRef} className="main-container-component">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <div className="div-forall">
          <div className="header-title-page8">
            <ExerciseHeader
              isReview={true}
              sectionLetter="G"
              title="Unscramble and write the words."
              subTitle={"Say the answer first, then rearrange the letters or words into the correct order."}
            />
          </div>
          <div>
            {items.map((item, i) => (
              <div key={i} className="mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-lg w-5">{i + 1}</span>

                  {/* 🔤 BANK */}
                  <div className="w-50">
                    <Droppable droppableId={`bank-${i}`} direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex gap-2"
                        >
                          {letterBank[i].map((letter, index) => {
                            const id = `letter-${i}-${index}-${letter.value}`;

                            return (
                              <Draggable
                                key={id}
                                draggableId={id}
                                index={index}
                                isDragDisabled={isLocked(i) || letter.used}
                              >
                                {(provided) => (
                                  <span
                                    ref={(el) => {
                                      provided.innerRef(el);
                                      bankRefs.current[i + "-" + index] = el;
                                    }}
                                    {...provided.draggableProps}
                                    role="button"
                                    tabIndex={picked ? -1 : 0}
                                    aria-label={`Word ${i + 1}, letter ${letter.value}`}
                                    aria-pressed={
                                      picked?.i === i && picked.j === index
                                    }
                                    aria-disabled={isLocked(i) || letter.used}
                                    onKeyDown={(e) => {
                                      escape(e);
                                      activation(e, () => pickLetter(i, index));
                                    }}
                                    onKeyUp={activationUp}
                                    style={{
                                      ...provided.draggableProps.style,
                                      ...(picked?.i === i && picked.j === index
                                        ? {
                                            outline: "4px solid #2563eb",
                                            outlineOffset: 2,
                                            backgroundColor: "#dbeafe",
                                          }
                                        : {}),
                                    }}
                                    {...provided.dragHandleProps}
                                    className={`w-9 h-9 focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! flex items-center justify-center rounded border
                                  ${
                                    letter.used
                                      ? "bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed"
                                      : "bg-white border-2 border-blue-900 cursor-grab hover:bg-blue-50"
                                  }
                                `}
                                  >
                                    {letter.value}
                                  </span>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  {/* ✍️ SLOT */}
                  <div style={{ position: "relative" }}>
                    <Droppable
                      droppableId={`slot-${i}`}
                      direction="horizontal"
                      isDropDisabled={isLocked(i)}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            slotRefs.current[i] = el;
                          }}
                          {...provided.droppableProps}
                          role="button"
                          tabIndex={
                            picked && (picked.i !== i || isLocked(i)) ? -1 : 0
                          }
                          aria-disabled={isLocked(i)}
                          aria-label={`Word ${i + 1}: ${answers[i].join("") || "empty"}${results[i] ? ", " + results[i] : ""}`}
                          className="rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                          onKeyDown={(e) => slotKey(e, i)}
                          onKeyUp={activationUp}
                          onClick={() => {
                            if (isLocked(i))
                              listen(`word-${i}`, item.correct[0]);
                            else if (answers[i].length)
                              handleRemoveLetter(i, answers[i].length - 1);
                          }}
                          style={{
                            width: "360px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 8px",
                            position: "relative",

                            // 🔥 الايفيكت
                            borderBottom: isLocked(i)
                              ? "2px solid #16a34a"
                              : "2px solid gray",
                            borderRadius: 8,
                            ...(snapshot.isDraggingOver && !isLocked(i)
                              ? {
                                  outline: "2px dashed #2563eb",
                                  outlineOffset: 2,
                                  backgroundColor: "#bfdbfe",
                                }
                              : {}),
                            transition: "all 0.2s ease",

                            // ❌ حالة الخطأ
                            ...(results[i] === "wrong" &&
                            answers[i].join("") !== item.correct[0]
                              ? {
                                  border: "2px dashed red",
                                  backgroundColor: "#fee2e2",
                                }
                              : {}),

                            // ✨ تكبير خفيف
                            transform:
                              snapshot.isDraggingOver && !isLocked(i)
                                ? "scale(1.02)"
                                : "scale(1)",
                          }}
                        >
                          {answers[i].map((letter, letterIndex) => {
                            const key = `${i}-${letterIndex}`;

                            return (
                              <span
                                key={key}
                                onMouseEnter={() => setHoveredWord(key)}
                                onMouseLeave={() => setHoveredWord(null)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLetter(i, letterIndex);
                                }}
                                className={`
        text-xl font-semibold
        ${locked ? "cursor-default" : "cursor-pointer"}
      `}
                                style={{
                                  marginRight: "2px",
                                  color: hoveredWord === key ? "red" : "black",
                                  transition: "0.2s",
                                }}
                              >
                                {letter}
                              </span>
                            );
                          })}
                          {badge(`word-${i}`)}
                          {provided.placeholder}
                          {results[i] === "wrong" &&
                            answers[i].join("") !== item.correct[0] && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-8px",
                                  width: "26px",
                                  height: "26px",
                                  backgroundColor: "red",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "16px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                  border: "2px solid white",
                                }}
                              >
                                ✕
                              </div>
                            )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="action-buttons-container">
            <button className="try-again-button" onClick={(checkEvent) => { resetCompletedCheck(); (resetAll)(checkEvent); }}>
              Start Again ↻
            </button>

            <button onClick={showAnswers} className="show-answer-btn">
              Show Answer
            </button>

            <button className="check-button2" onClick={checkAnswers}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
