import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Asset 43.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Untitled 1.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 81/Untitled 2.svg";
import bikeSound from "../../../assets/audio/ClassBook/U 9/Page 81 - D/Item_001_He's_riding_a_bike.mp3";
import soccerSound from "../../../assets/audio/ClassBook/U 9/Page 81 - D/Item_002_They're_playing_soccer.mp3";
import cornSound from "../../../assets/audio/ClassBook/U 9/Page 81 - D/Item_003_They're_eating_corn.mp3";
import appleSound from "../../../assets/audio/ClassBook/U 9/Page 81 - D/Item_004_She_is_eating_an_apple.mp3";
//..
const questions = [
  {
    id: 1,
    img: img1,
    correct: "He's riding a bike.",
    alt: "A helmeted child riding a bicycle outdoors.",
  },
  {
    id: 2,
    img: img3,
    correct: "She is eating an apple.",
    alt: "Three chickens pecking at scattered grains outdoors.",
  },
  {
    id: 3,
    img: img2,
    correct: "They're eating corn.",
    alt: "Two children playing chess on a mat.",
  },
  {
    id: 4,
    img: img4,
    correct: "They're playing soccer.",
    alt: "Two children watching a television.",
  },
];
//...
const sentences = [
  "He's riding a bike.",
  "They're playing soccer.",
  "They're eating corn.",
  "She is eating an apple.",
];
const sentenceSounds = {
  "He's riding a bike.": bikeSound,
  "They're playing soccer.": soccerSound,
  "They're eating corn.": cornSound,
  "She is eating an apple.": appleSound,
};
const sensors = [useMouseSensor, useTouchSensor];
const focusClass =
  " focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};

const Unit9_Page6_Q1 = () => {
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

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [pickedSentence, setPickedSentence] = useState(null);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const audioRef = useRef(null),
    chipRefs = useRef({}),
    blankRefs = useRef({});
  const focusFrame = useRef(null),
    suppressFocusAudio = useRef(false);
  const isLocked = (slot) => revealed || results[slot] === "correct";
  const allDone = questions.every((q) => isLocked(`slot-${q.id}`));
  const isUsed = (
    sentence,
    currentAnswers = answers,
    currentResults = results,
  ) =>
    Object.entries(currentAnswers).some(
      ([slot, value]) => value === sentence && currentResults[slot] !== "wrong",
    );
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
  const clearSelection = () => {
    cancelFocus();
    setPickedSentence(null);
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
  const playSentence = (sentence, key) => {
    if (!sentenceSounds[sentence]) return;
    stopAudio();
    const audio = new Audio(sentenceSounds[sentence]);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);

  const placeSentence = (sentence, slot, keyboard = false) => {
    if (
      !sentences.includes(sentence) ||
      !questions.some((q) => `slot-${q.id}` === slot) ||
      isLocked(slot)
    )
      return;
    if (
      Object.entries(answers).some(
        ([source, value]) => value === sentence && isLocked(source),
      )
    )
      return;
    const next = { ...answers },
      nextResults = { ...results };
    Object.keys(next).forEach((source) => {
      if (next[source] === sentence) {
        delete next[source];
        nextResults[source] = null;
      }
    });
    next[slot] = sentence;
    nextResults[slot] = null;
    setAnswers(next);
    setResults(nextResults);
    clearSelection();
    setAnnouncement(`${sentence} placed in question ${slot.slice(5)}.`);
    if (keyboard) {
      const available = sentences.find(
        (value) => !isUsed(value, next, nextResults),
      );
      focusSafely(() =>
        available ? chipRefs.current[available] : blankRefs.current[slot],
      );
    }
  };
  const removeSentence = (slot, keyboard = false) => {
    if (isLocked(slot) || !answers[slot]) return;
    const sentence = answers[slot];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setResults((prev) => ({ ...prev, [slot]: null }));
    clearSelection();
    setAnnouncement(`${sentence} returned to the sentence bank.`);
    if (keyboard) focusSafely(() => chipRefs.current[sentence]);
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination) return;
    let sentence;
    if (draggableId.startsWith("bank-")) sentence = draggableId.slice(5);
    else {
      const match = /^slot-(\d+)-(.+)$/.exec(draggableId);
      if (
        !match ||
        answers[`slot-${match[1]}`] !== match[2] ||
        isLocked(`slot-${match[1]}`)
      )
        return;
      sentence = match[2];
    }
    if (destination.droppableId === "bank") {
      const slot = Object.keys(answers).find(
        (key) => answers[key] === sentence,
      );
      if (slot) removeSentence(slot);
    } else placeSentence(sentence, destination.droppableId);
  };
  const pickSentence = (sentence) => {
    playSentence(sentence, `bank-${sentence}`);
    if (allDone || isUsed(sentence)) {
      setAnnouncement(
        "This sentence is already used or the answers are locked.",
      );
      return;
    }
    const target =
      questions.find(
        (q) => !isLocked(`slot-${q.id}`) && !answers[`slot-${q.id}`],
      ) || questions.find((q) => !isLocked(`slot-${q.id}`));
    if (!target) return;
    setPickedSentence(sentence);
    setAnnouncement(
      `${sentence} selected. Press Enter or Space on a blank to place it.`,
    );
    focusSafely(() => blankRefs.current[`slot-${target.id}`]);
  };
  const cancelSelection = (e) => {
    if (e.key !== "Escape" || !pickedSentence) return;
    e.preventDefault();
    e.stopPropagation();
    const sentence = pickedSentence;
    clearSelection();
    setAnnouncement("Selection cancelled.");
    focusSafely(() => chipRefs.current[sentence]);
  };
  const activateSlot = (slot, keyboard = false) => {
    if (isLocked(slot)) {
      playSentence(answers[slot], `answer-${slot}`);
      return;
    }
    if (keyboard && pickedSentence) placeSentence(pickedSentence, slot, true);
    else if (answers[slot]) removeSentence(slot, keyboard);
    else
      setAnnouncement(
        "Choose a sentence first, then press Enter or Space on a blank.",
      );
  };
  const slotKeyDown = (e, slot) => {
    cancelSelection(e);
    if (activateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) activateSlot(slot, true);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && results[slot] === "wrong") removeSentence(slot, true);
    }
  };
  const activationKeyUp = (e) => {
    if (activateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const reset = () => {
    clearSelection();
    stopAudio();
    setAnswers({});
    setResults({});
    setRevealed(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const showAnswers = () => {
    clearSelection();
    stopAudio();
    setAnswers(
      Object.fromEntries(questions.map((q) => [`slot-${q.id}`, q.correct])),
    );
    setResults(
      Object.fromEntries(questions.map((q) => [`slot-${q.id}`, "correct"])),
    );
    setRevealed(true);
    setAnnouncement("All correct sentences shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed || allDone) return;
    clearSelection();
    stopAudio();
    if (questions.some((q) => !answers[`slot-${q.id}`])) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        `slot-${q.id}`,
        results[`slot-${q.id}`] === "correct" ||
        answers[`slot-${q.id}`] === q.correct
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter(
        (result) => result === "correct",
      ).length,
      total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id}: ${next[`slot-${q.id}`] === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect sentences and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
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
          pointerEvents: "none",
          zIndex: 3,
          background: "white",
          color: "black",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={clearSelection}
      enableDefaultSensors={false}
      sensors={sensors}
    >
      <div className="main-container-component mb-10">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <p id="u9p6q1-help" className="sr-only">
          Choose a bank sentence with Enter or Space, then place it in a blank
          with Enter or Space. Activate a filled editable blank to return its
          sentence. Delete or Backspace removes only an incorrect answer. Escape
          cancels sentence selection. Correct answers are locked.
        </p>
        <div className="div-forall" style={{ gap: "10px" }}>
          <ExerciseHeader
            sectionLetter="D"
            title="Look and write."
            subTitle={
              "Use the picture and word clues, then type the missing word or sentence carefully."
            }
          />
          <div>
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-4 justify-center flex-wrap mb-3 p-4 rounded-lg"
                >
                  {sentences.map((sentence, index) => {
                    const used = isUsed(sentence),
                      key = `bank-${sentence}`;
                    return (
                      <Draggable
                        key={key}
                        draggableId={key}
                        index={index}
                        isDragDisabled={allDone || used}
                      >
                        {(provided) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              chipRefs.current[sentence] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            role="button"
                            tabIndex={0}
                            aria-pressed={pickedSentence === sentence}
                            aria-disabled={allDone || used}
                            data-bank-sentence={sentence}
                            aria-label={`${sentence} Press Enter or Space to choose it.${used ? " Already used." : ""}`}
                            aria-describedby="u9p6q1-help"
                            className={`relative px-4 py-2 rounded-full text-center ${used ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-200 cursor-grab"}${focusClass}`}
                            style={{
                              ...provided.draggableProps.style,
                              ...(pickedSentence === sentence ||
                              playingKey === key
                                ? activeStyle
                                : {}),
                            }}
                            onClick={() => playSentence(sentence, key)}
                            onFocus={(e) => {
                              if (
                                !suppressFocusAudio.current &&
                                e.currentTarget.matches(":focus-visible")
                              )
                                playSentence(sentence, key);
                            }}
                            onKeyDown={(e) => {
                              cancelSelection(e);
                              if (activateKey(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!e.repeat) pickSentence(sentence);
                              }
                            }}
                            onKeyUp={activationKeyUp}
                          >
                            {sentence}
                            {badge(key)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="flex flex-col gap-2">
              {questions.map((q) => {
                const slot = `slot-${q.id}`,
                  value = answers[slot],
                  key = `answer-${slot}`;
                return (
                  <div key={q.id} className="flex items-center gap-5">
                    <div className="flex justify-start gap-5">
                      <span className="font-bold text-[20px]">{q.id}</span>
                      <img
                        src={q.img}
                        alt={q.alt}
                        style={{ height: "auto", width: "230px" }}
                        className=" object-contain"
                      />
                    </div>
                    <Droppable
                      droppableId={slot}
                      isDropDisabled={isLocked(slot)}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            blankRefs.current[slot] = el;
                          }}
                          {...provided.droppableProps}
                          role="button"
                          tabIndex={0}
                          aria-disabled={isLocked(slot)}
                          data-slot={slot}
                          aria-describedby="u9p6q1-help"
                          aria-label={`Question ${q.id}, blank: ${value || "empty"}${results[slot] ? (results[slot] === "correct" ? ", correct and locked" : ", incorrect") : ""}`}
                          className={`relative flex-1 min-h-[35px] border-b-1 transition-all duration-200 rounded-md ${isLocked(slot) ? "border-green-600" : results[slot] === "wrong" ? "border-red-500" : "border-black"}${focusClass}`}
                          style={
                            snapshot.isDraggingOver && !isLocked(slot)
                              ? {
                                  outline: "2px dashed #2563eb",
                                  outlineOffset: 2,
                                  backgroundColor: "#dbeafe",
                                }
                              : playingKey === key
                                ? activeStyle
                                : undefined
                          }
                          onClick={() => activateSlot(slot)}
                          onKeyDown={(e) => slotKeyDown(e, slot)}
                          onKeyUp={activationKeyUp}
                        >
                          {value && (
                            <Draggable
                              draggableId={`slot-${q.id}-${value}`}
                              index={0}
                              isDragDisabled={isLocked(slot)}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  tabIndex={-1}
                                  className="cursor-pointer text-xl"
                                  style={provided.draggableProps.style}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    activateSlot(slot);
                                  }}
                                  onKeyDown={(e) => slotKeyDown(e, slot)}
                                >
                                  {value}
                                </span>
                              )}
                            </Draggable>
                          )}
                          {results[slot] === "wrong" && (
                            <div
                              aria-hidden="true"
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white z-10 shadow-lg"
                            >
                              ✕
                            </div>
                          )}
                          {provided.placeholder}
                          {badge(key)}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
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
export default Unit9_Page6_Q1;
