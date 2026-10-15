import React, { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import { FaVolumeUp } from "react-icons/fa";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import greenSound from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_004_green.mp3";
import blueSound from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_003_blue.mp3";
import pinkSound from "../../../assets/audio/ClassBook/U 2/Page 15 - D/pink.mp3";

const items = [
  {
    sentence: "He has four pairs of",
    scrambled: ["neerg", "strohs"],
    correct: ["green", "shorts"],
  },
  {
    sentence: "She has five pairs of",
    scrambled: ["lube", "skcos"],
    correct: ["blue", "socks"],
  },
  {
    sentence: "They have nine",
    scrambled: ["kcalb", "stekcaj"],
    correct: ["black", "jackets"],
  },
  {
    sentence: "You have six",
    scrambled: ["etihw", "seit"],
    correct: ["white", "ties"],
  },
  {
    sentence: "I have three",
    scrambled: ["knip", "sesserd"],
    correct: ["pink", "dresses"],
  },
];
const sensors = [useMouseSensor, useTouchSensor];
const focusClass =
  " rounded-md focus-visible:outline-3! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-3!";
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const emptyPlacement = () => items.map(() => [[], []]);
const letterId = (letter, q, w, index) => `${letter}-${q}-${w}-${index}`;
const wordSounds = { green: greenSound, blue: blueSound, pink: pinkSound };
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};

export default function Review8_Page1_Q2() {
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

  // Keep each tile's identity, including repeated letters in the same word.
  const [placements, setPlacements] = useState(emptyPlacement);
  const [correctSlots, setCorrectSlots] = useState([]);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [pickedLetter, setPickedLetter] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const bankRefs = useRef({});
  const slotRefs = useRef({});
  const focusFrame = useRef(null);
  const suppressFocusAudio = useRef(false);
  const audioRef = useRef(null);
  const answers = placements.map((row) =>
    row.map((ids) => ids.map((id) => id.split("-")[0]).join("")),
  );
  const usedIds = new Set(placements.flat(2));
  const isLocked = (slot) => revealed || correctSlots.includes(slot);
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusSafely = (getElement) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocusAudio.current = true;
      try {
        getElement()?.focus();
      } finally {
        suppressFocusAudio.current = false;
      }
    });
  };
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playSound = (src, key) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    audio.onended = finish;
    audio.onerror = finish;
    try {
      audio.play().catch(finish);
    } catch {
      finish();
    }
  };
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    },
    [],
  );

  const clearSelection = () => {
    cancelFocus();
    setPickedLetter(null);
  };
  const changeSlot = (q, w, ids) => {
    setPlacements((prev) =>
      prev.map((row, i) =>
        i === q ? row.map((value, j) => (j === w ? ids : value)) : row,
      ),
    );
    setWrongSlots((prev) => prev.filter((slot) => slot !== `slot-${q}-${w}`));
  };
  const placeLetter = (id, slot, keyboard = false) => {
    const [letter, sourceQ, sourceW, index] = id.split("-");
    const match = /^slot-(\d+)-(\d+)$/.exec(slot);
    if (!match) return;
    const q = Number(match[1]),
      w = Number(match[2]);
    if (
      !items[q]?.scrambled[w] ||
      Number(sourceQ) !== q ||
      Number(sourceW) !== w ||
      items[q].scrambled[w][Number(index)] !== letter ||
      isLocked(slot) ||
      usedIds.has(id) ||
      placements[q][w].length >= items[q].correct[w].length
    )
      return;
    const ids = [...placements[q][w], id];
    changeSlot(q, w, ids);
    clearSelection();
    setAnnouncement(`${letter} placed in question ${q + 1}, word ${w + 1}.`);
    if (keyboard) {
      const next = items[q].scrambled[w]
        .split("")
        .map((char, n) => letterId(char, q, w, n))
        .find((tile) => !usedIds.has(tile) && tile !== id);
      focusSafely(() =>
        next ? bankRefs.current[next] : slotRefs.current[slot],
      );
    }
  };
  const removeLetter = (q, w, id, keyboard = false) => {
    if (isLocked(`slot-${q}-${w}`) || !placements[q][w].includes(id)) return;
    changeSlot(
      q,
      w,
      placements[q][w].filter((tile) => tile !== id),
    );
    clearSelection();
    setAnnouncement(`${id.split("-")[0]} returned to its letter bank.`);
    if (keyboard) focusSafely(() => bankRefs.current[id]);
  };
  const chooseLetter = (id, q, w) => {
    if (isLocked(`slot-${q}-${w}`) || usedIds.has(id)) return;
    setPickedLetter(id);
    setAnnouncement(
      `${id.split("-")[0]} selected. Press Enter or Space in word ${w + 1} of question ${q + 1}.`,
    );
    focusSafely(() => slotRefs.current[`slot-${q}-${w}`]);
  };
  const escapeSelection = (e) => {
    if (e.key !== "Escape" || !pickedLetter) return;
    e.preventDefault();
    e.stopPropagation();
    const id = pickedLetter;
    clearSelection();
    setAnnouncement("Selection cancelled.");
    focusSafely(() => bankRefs.current[id]);
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination && draggableId.startsWith("letter-"))
      placeLetter(draggableId.slice(7), destination.droppableId);
  };
  const resetAll = () => {
    clearSelection();
    stopAudio();
    setPlacements(emptyPlacement());
    setCorrectSlots([]);
    setWrongSlots([]);
    setRevealed(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const showAnswers = () => {
    clearSelection();
    stopAudio();
    setPlacements(
      items.map((item, q) =>
        item.correct.map((word, w) => {
          const available = item.scrambled[w]
            .split("")
            .map((char, n) => letterId(char, q, w, n));
          return word.split("").map(
            (char) =>
              available.splice(
                available.findIndex((id) => id.startsWith(`${char}-`)),
                1,
              )[0],
          );
        }),
      ),
    );
    setCorrectSlots(
      items.flatMap((_, q) => [0, 1].map((w) => `slot-${q}-${w}`)),
    );
    setWrongSlots([]);
    setRevealed(true);
    setAnnouncement("All correct answers shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed || correctSlots.length === items.length * 2) return;
    clearSelection();
    stopAudio();
    if (answers.some((row) => row.some((word) => word === ""))) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const correct = new Set(correctSlots),
      wrong = [];
    answers.forEach((row, q) =>
      row.forEach((word, w) => {
        const slot = `slot-${q}-${w}`;
        if (word === items[q].correct[w]) correct.add(slot);
        else if (!correct.has(slot)) wrong.push(slot);
      }),
    );
    setCorrectSlots([...correct]);
    setWrongSlots(wrong);
    const score = answers.filter(
      (row, q) => row.join(" ") === items[q].correct.join(" "),
    ).length;
    const total = items.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const message = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(message));
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
    setAnnouncement(
      `Score ${score} out of ${total}. Correct words are locked. Incorrect words can be changed.`,
    );
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={clearSelection}
      enableDefaultSensors={false}
      sensors={sensors}
    >
      <div className="main-container-component">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <p id="r8p1q2-help" className="sr-only">
          Choose a letter with Enter or Space, then press Enter or Space in its
          word slot. Activate a placed letter to return it to its bank. Delete
          or Backspace removes the last letter of an incorrect word. Escape
          cancels selection. Correct words are locked.
        </p>
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="B"
            title="Unscramble the words and write the sentences."
            subTitle={"Say the answer first, then rearrange the letters or words into the correct order."}
            isReview={true}
          />
          <div className="flex flex-col gap-2">
            {items.map((item, q) => (
              <div key={q} className="mb-8 mt-4">
                <div className="flex gap-4 flex-col">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-xl w-5">{q + 1}</span>
                    <span className="text-xl">
                      {item.sentence} {item.scrambled[0]} {item.scrambled[1]}
                    </span>
                  </div>
                  <div className="flex gap-8 mt-3 ml-8">
                    {item.scrambled.map((word, w) => {
                      const slot = `slot-${q}-${w}`;
                      const locked = isLocked(slot),
                        wrong = wrongSlots.includes(slot);
                      return (
                        <div
                          key={w}
                          className="flex flex-col items-center gap-2"
                        >
                          <Droppable
                            droppableId={`bank-${q}-${w}`}
                            direction="horizontal"
                            isDropDisabled
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-1"
                              >
                                {word.split("").map((letter, n) => {
                                  const id = letterId(letter, q, w, n),
                                    used = usedIds.has(id);
                                  return (
                                    <Draggable
                                      key={id}
                                      draggableId={`letter-${id}`}
                                      index={n}
                                      isDragDisabled={locked || used}
                                    >
                                      {(provided) => (
                                        <span
                                          ref={(el) => {
                                            provided.innerRef(el);
                                            bankRefs.current[id] = el;
                                          }}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          role="button"
                                          tabIndex={0}
                                          aria-disabled={locked || used}
                                          aria-pressed={pickedLetter === id}
                                          aria-label={`${letter}, question ${q + 1}, word ${w + 1}, letter ${n + 1}${used ? ", used" : ""}${locked ? ", locked" : ""}`}
                                          aria-describedby="r8p1q2-help"
                                          data-letter-id={id}
                                          style={{
                                            ...provided.draggableProps.style,
                                            ...(pickedLetter === id
                                              ? activeStyle
                                              : {}),
                                          }}
                                          onKeyDown={(e) => {
                                            escapeSelection(e);
                                            if (activateKey(e)) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              if (!e.repeat)
                                                chooseLetter(id, q, w);
                                            }
                                          }}
                                          onKeyUp={(e) => {
                                            if (activateKey(e)) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                            }
                                          }}
                                          className={`w-9 h-9 text-xl flex items-center justify-center rounded border-2 border-gray-500 ${used ? "bg-gray-300 cursor-not-allowed opacity-50" : "bg-white cursor-grab"}${focusClass}`}
                                        >
                                          {letter}
                                        </span>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          <Droppable droppableId={slot} isDropDisabled={locked}>
                            {(provided, snapshot) => (
                              <div
                                ref={(el) => {
                                  provided.innerRef(el);
                                  slotRefs.current[slot] = el;
                                }}
                                {...provided.droppableProps}
                                tabIndex={0}
                                role="group"
                                aria-label={`Question ${q + 1}, word ${w + 1}: ${answers[q][w] || "empty"}${locked ? ", correct and locked" : wrong ? ", incorrect" : ""}`}
                                aria-describedby="r8p1q2-help"
                                data-slot={slot}
                                className={`w-[100%] h-10 relative border-0 border-b-2 px-3 py-2 text-lg text-center ${locked ? "border-green-600" : wrong ? "border-red-500" : "border-gray-500"}${focusClass}`}
                                style={
                                  snapshot.isDraggingOver && !locked
                                    ? {
                                        outline: "2px dashed #2563eb",
                                        outlineOffset: 2,
                                        backgroundColor: "#dbeafe",
                                      }
                                    : undefined
                                }
                                onKeyDown={(e) => {
                                  if (e.target !== e.currentTarget) return;
                                  escapeSelection(e);
                                  if (activateKey(e)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!e.repeat && pickedLetter)
                                      placeLetter(pickedLetter, slot, true);
                                  }
                                  if (
                                    e.key === "Delete" ||
                                    e.key === "Backspace"
                                  ) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!e.repeat && wrong)
                                      removeLetter(
                                        q,
                                        w,
                                        placements[q][w].at(-1),
                                        true,
                                      );
                                  }
                                }}
                                onKeyUp={(e) => {
                                  if (activateKey(e)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }
                                }}
                              >
                                {placements[q][w].map((id) => (
                                  <span
                                    key={id}
                                    role="button"
                                    tabIndex={0}
                                    aria-disabled={locked}
                                    aria-label={`Return ${id.split("-")[0]} to its bank${locked ? ", locked" : ""}`}
                                    data-placed-id={id}
                                    className={`cursor-pointer hover:text-red-500${focusClass}`}
                                    onClick={() => removeLetter(q, w, id)}
                                    onKeyDown={(e) => {
                                      escapeSelection(e);
                                      if (activateKey(e)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!e.repeat) {
                                          if (pickedLetter)
                                            placeLetter(
                                              pickedLetter,
                                              slot,
                                              true,
                                            );
                                          else removeLetter(q, w, id, true);
                                        }
                                      }
                                    }}
                                    onKeyUp={(e) => {
                                      if (activateKey(e)) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }
                                    }}
                                  >
                                    {id.split("-")[0]}
                                  </span>
                                ))}
                                {wrong && (
                                  <div
                                    aria-hidden="true"
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white"
                                  >
                                    ✕
                                  </div>
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 ml-8">
                  <div className="w-full max-w-[500px] border-2 border-gray-500 rounded-lg px-3 py-3 text-lg flex gap-2 flex-wrap items-center">
                    <span>{item.sentence}</span>
                    {item.correct.map((word, w) => {
                      const slot = `slot-${q}-${w}`,
                        key = `answer-${q}-${w}`;
                      const src = isLocked(slot) ? wordSounds[word] : null;
                      return (
                        <span
                          key={w}
                          className={`relative min-w-[80px] h-[30px] border-b-2 text-center px-2 ${isLocked(slot) ? "border-green-600" : "border-gray-600"}${src ? focusClass + " cursor-pointer" : ""}`}
                          role={src ? "button" : undefined}
                          tabIndex={src ? 0 : undefined}
                          aria-label={src ? `Hear ${word}` : undefined}
                          style={playingKey === key ? activeStyle : undefined}
                          onClick={() => playSound(src, key)}
                          onFocus={(e) => {
                            if (
                              !suppressFocusAudio.current &&
                              e.currentTarget.matches(":focus-visible")
                            )
                              playSound(src, key);
                          }}
                          onKeyDown={(e) => {
                            if (src && activateKey(e)) {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!e.repeat) playSound(src, key);
                            }
                          }}
                          onKeyUp={(e) => {
                            if (src && activateKey(e)) {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          {answers[q][w]}
                          {playingKey === key && (
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
                                pointerEvents: "none",
                                background: "white",
                                color: "black",
                                boxShadow: "0 1px 3px rgba(0,0,0,.25)",
                              }}
                            >
                              <FaVolumeUp size={12} />
                            </span>
                          )}
                        </span>
                      );
                    })}
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
