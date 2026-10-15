import React, { useEffect, useRef, useState } from "react";
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

import imgA from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex A 1.svg";
import imgB from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 72/Ex A 2.svg";

import sound1 from "../../../assets/audio/ClassBook/U 8/Page 72 - A/Item_001_I_have_pants.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 72 - A/Item_002_I_have_a_cap.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 72 - A/Item_003_I_have_shorts.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 72 - A/Item_004_She_has_skirts.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 72 - A/Item_005_She_has_a_hat.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 72 - A/Item_006_She_has_a_scarf.mp3";

const pointerSensors = [useMouseSensor, useTouchSensor];
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const Review8_Page1_Q1 = () => {
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

  const I_answers = ["I have pants.", "I have a cap.", "I have shorts."];

  const She_answers = ["She has skirts.", "She has a hat.", "She has a scarf."];

  const answersBank = [
    She_answers[2],
    I_answers[1],
    She_answers[0],
    I_answers[2],
    She_answers[1],
    I_answers[0],
  ];

  const questions = [
    { id: "I-1", type: "I" },
    { id: "I-2", type: "I" },
    { id: "I-3", type: "I" },

    { id: "S-1", type: "She" },
    { id: "S-2", type: "She" },
    { id: "S-3", type: "She" },
  ];

  const options = answersBank;
  const blanks = Object.fromEntries(
    questions.map((q) => [
      q.id,
      (q.type === "I" ? I_answers : She_answers)[Number(q.id.slice(2)) - 1],
    ]),
  );
  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lockedSlots, setLockedSlots] = useState([]);
  const [wrongSlots, setWrongSlots] = useState([]);
  const [pickedWord, setPickedWord] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null);
  const chipRefs = useRef({});
  const blankRefs = useRef({});
  const focusFrame = useRef(null);
  const skipFocusSound = useRef(false);
  const wordSounds = {
    "I have pants.": sound1,
    "I have a cap.": sound2,
    "I have shorts.": sound3,
    "She has skirts.": sound4,
    "She has a hat.": sound5,
    "She has a scarf.": sound6,
  };
  const isLocked = (id) => locked || lockedSlots.includes(String(id));
  const isWrong = (id) => showResult && wrongSlots.includes(String(id));
  const isWordUsed = (word, currentAnswers = answers, wrong = wrongSlots) =>
    Object.entries(currentAnswers).some(
      ([id, value]) => value === word && !wrong.includes(id),
    );

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
  const playSound = (src, key = src) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setPlayingKey(null);
      audio.onended = null;
      audio.onerror = null;
    };
    audio.onended = finish;
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.play().catch(() => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    });
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      const audio = audioRef.current;
      audioRef.current = null;
      setPlayingKey(null);
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const focusElement = (getElement) => {
    cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => {
      skipFocusSound.current = true;
      getElement()?.focus();
      skipFocusSound.current = false;
      focusFrame.current = null;
    });
  };
  const onAudioFocus = (e, src, key = src) => {
    if (!skipFocusSound.current && e.currentTarget.matches(":focus-visible"))
      playSound(src, key);
  };
  const blockActivationKeyUp = (e) => {
    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const placeWord = (slot, word) => {
    if (
      !Object.hasOwn(blanks, slot) ||
      !options.includes(word) ||
      isLocked(slot)
    )
      return null;
    if (
      Object.entries(answers).some(
        ([id, value]) => value === word && isLocked(id),
      )
    )
      return null;
    const updated = { ...answers };
    const cleared = [];
    Object.keys(updated).forEach((id) => {
      if (updated[id] === word) {
        delete updated[id];
        cleared.push(id);
      }
    });
    updated[slot] = word;
    const remainingWrong = wrongSlots.filter(
      (id) => id !== slot && !cleared.includes(id),
    );
    setAnswers(updated);
    setWrongSlots(remainingWrong);
    setPickedWord(null);
    setAnnouncement(word + " placed in blank " + slot + ".");
    return { updated, remainingWrong };
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination && /^answer-(I|S)-[1-3]$/.test(destination.droppableId))
      placeWord(destination.droppableId.slice(7), draggableId);
  };
  const pickWord = (word) => {
    playSound(wordSounds[word], `word-${word}`);
    if (locked || isWordUsed(word)) {
      setAnnouncement(
        locked
          ? "Answers are locked. Press Start Again to try again."
          : word + " is already used.",
      );
      return;
    }
    const target =
      Object.keys(blanks).find((id) => !isLocked(id) && !answers[id]) ||
      Object.keys(blanks).find((id) => !isLocked(id));
    if (!target) return;
    setPickedWord(word);
    setAnnouncement(
      word +
        " selected. Press Tab to choose a blank, then Enter or Space to place it. Escape cancels.",
    );
    focusElement(() => blankRefs.current[target]);
  };
  const returnWord = (id, viaKeyboard = false) => {
    if (isLocked(id) || !answers[id]) return;
    const word = answers[id];
    const updated = { ...answers };
    delete updated[id];
    setAnswers(updated);
    setWrongSlots(wrongSlots.filter((slot) => slot !== id));
    setPickedWord(null);
    setAnnouncement(word + " returned to the word bank.");
    playSound(wordSounds[word], `word-${word}`);
    if (viaKeyboard) focusElement(() => chipRefs.current[word]);
  };
  const activateBlank = (id, viaKeyboard = false) => {
    if (isLocked(id)) {
      playSound(wordSounds[answers[id]], `blank-${id}`);
      setAnnouncement("Blank " + id + " is locked.");
      return;
    }
    if (answers[id] && (!pickedWord || !viaKeyboard)) {
      returnWord(id, viaKeyboard);
      return;
    }
    if (!pickedWord) {
      setAnnouncement(
        "Choose a word first, then press Enter or Space on a blank.",
      );
      return;
    }
    const placed = placeWord(id, pickedWord);
    if (!placed || !viaKeyboard) return;
    const next =
      options.find(
        (word) => !isWordUsed(word, placed.updated, placed.remainingWrong),
      ) || pickedWord;
    focusElement(() => chipRefs.current[next]);
  };
  const onBlankKeyDown = (e, id) => {
    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      activateBlank(id, true);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      // Removal is allowed only for an answer marked incorrect by Check Answer.
      if (isLocked(id) || !wrongSlots.includes(id) || !answers[id]) return;
      const updated = { ...answers };
      delete updated[id];
      setAnswers(updated);
      setWrongSlots(wrongSlots.filter((slot) => slot !== id));
      setAnnouncement("Blank " + id + " cleared.");
    }
  };

  const speakerBadge = (key) =>
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
          lineHeight: 1,
          background: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const clearTransientState = () => {
    stopAudio();
    cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
    setPickedWord(null);
  };
  const reset = () => {
    clearTransientState();
    setAnswers({});
    setLocked(false);
    setShowResult(false);
    setLockedSlots([]);
    setWrongSlots([]);
    setAnnouncement("Activity reset. All answers and results are cleared.");
  };
  const showAnswers = () => {
    clearTransientState();
    setAnswers({ ...blanks });
    setLocked(true);
    setLockedSlots(Object.keys(blanks));
    setWrongSlots([]);
    setAnnouncement("All correct answers shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    clearTransientState();
    const total = Object.keys(blanks).length;
    if (Object.keys(blanks).some((id) => !answers[id])) {
      ValidationAlert.info("Please complete all answers");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const correct = Object.keys(blanks).filter(
      (id) =>
        lockedSlots.includes(id) ||
        (id.startsWith("I-") ? I_answers : She_answers).includes(answers[id]),
    );
    const wrong = Object.keys(blanks).filter((id) => !correct.includes(id));
    const score = correct.length;
    setLockedSlots(correct);
    setWrongSlots(wrong);
    setLocked(score === total);
    setShowResult(true);
    setAnnouncement(
      "Score " +
        score +
        " out of " +
        total +
        ". " +
        Object.keys(blanks)
          .map(
            (id) =>
              "Blank " +
              id +
              (correct.includes(id)
                ? " is correct and locked."
                : " is incorrect and editable."),
          )
          .join(" "),
    );
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const isWrongAnswer = (id) => isWrong(id);
  const slotProps = (id, provided, isDraggingOver = false) => ({
    ref: (node) => {
      provided.innerRef(node);
      blankRefs.current[id] = node;
    },
    role: "button",
    tabIndex: 0,
    "data-slot": id,
    "aria-disabled": isLocked(id),
    "aria-describedby": "r8p1q1-help",
    "aria-label": `${id.startsWith("I-") ? "I" : "She"} group, answer ${id.slice(2)}. ${answers[id] || "Empty"}.${isLocked(id) ? " Correct and locked." : isWrongAnswer(id) ? " Incorrect, editable." : ""}`,
    onClick: () => activateBlank(id),
    onFocus: (e) => onAudioFocus(e, wordSounds[answers[id]], "blank-" + id),
    onKeyDown: (e) => onBlankKeyDown(e, id),
    onKeyUp: blockActivationKeyUp,
    style: {
      outline: isDraggingOver && !isLocked(id) ? "2px dashed #2563eb" : undefined,
      outlineOffset: isDraggingOver && !isLocked(id) ? "2px" : undefined,
      backgroundColor: isDraggingOver && !isLocked(id) ? "#dbeafe" : undefined,
      borderColor: lockedSlots.includes(id)
        ? "#16a34a"
        : isWrongAnswer(id)
          ? "#dc2626"
          : undefined,
    },
  });
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      enableDefaultSensors={false}
      sensors={pointerSensors}
      dragHandleUsageInstructions="Press Enter or Space to select a sentence, then activate a slot to place it. You can also drag with mouse or touch."
      onDragStart={() => {
        cancelAnimationFrame(focusFrame.current);
        setPickedWord(null);
      }}
    >
      <div
        className="main-container-component"
        onKeyDown={(e) => {
          if (isActivateKey(e)) e.stopPropagation();
          if (e.key === "Escape" && pickedWord) {
            e.preventDefault();
            e.stopPropagation();
            const word = pickedWord;
            setPickedWord(null);
            setAnnouncement("Selection cancelled.");
            focusElement(() => chipRefs.current[word]);
          }
        }}
        onKeyUp={(e) => {
          if (isActivateKey(e)) e.stopPropagation();
        }}
      >
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <p id="r8p1q1-help" className="sr-only">
          Tab and Shift+Tab move between sentences and slots. Enter or Space
          selects and places a sentence. Activate a filled editable slot to
          return its sentence to the bank. Escape cancels selection. Correct
          slots lock after checking. Sentences in each group can be in any
          order.
        </p>
        <div className="div-forall" style={{ gap: "20px" }}>
          <ExerciseHeader
            sectionLetter="A"
            title="Look and write."
            subTitle={"Use the picture and word clues, then type the missing word or sentence carefully."}
            isReview={true}
          />

          {/* IMAGES */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-around w-full">
              <div className="relative">
                <img
                  src={imgA}
                  alt="A boy holding trousers, a cap, and shorts."
                  className="object-contain"
                  style={{ width: "auto", height: "155px" }}
                />
                <span className="absolute bottom-2 right-2 bg-yellow-300 rounded-full px-2 text-sm">
                  A
                </span>
              </div>

              <div className="relative">
                <img
                  style={{ width: "auto", height: "165px" }}
                  src={imgB}
                  alt="A girl holding skirts, a hat, and a scarf."
                  className="object-contain"
                />
                <span className="absolute bottom-2 right-2 bg-yellow-300 rounded-full px-2 text-sm">
                  B
                </span>
              </div>
            </div>

            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap w-full justify-center gap-4 p-4 rounded-lg"
                >
                  {answersBank.map((a, index) => {
                    const isUsed = isWordUsed(a);
                    return (
                      <Draggable
                        key={a}
                        draggableId={a}
                        index={index}
                        isDragDisabled={locked || isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={(node) => {
                              provided.innerRef(node);
                              chipRefs.current[a] = node;
                            }}
                            {...provided.draggableProps}
                            {...(!isUsed && provided.dragHandleProps)}
                            role="button"
                            tabIndex={0}
                            data-sentence={a}
                            aria-pressed={pickedWord === a}
                            aria-disabled={locked || isUsed}
                            aria-label={
                              a +
                              (isUsed
                                ? " Already placed."
                                : " Press Enter or Space to select.")
                            }
                            aria-describedby="r8p1q1-help"
                            onClick={() =>
                              playSound(wordSounds[a], "word-" + a)
                            }
                            onFocus={(e) =>
                              onAudioFocus(e, wordSounds[a], "word-" + a)
                            }
                            onKeyDown={(e) => {
                              if (!isActivateKey(e)) return;
                              e.preventDefault();
                              e.stopPropagation();
                              if (!e.repeat) pickWord(a);
                            }}
                            onKeyUp={blockActivationKeyUp}
                            style={{
                              ...provided.draggableProps.style,
                              ...(pickedWord === a || playingKey === "word-" + a
                                ? {
                                    boxShadow: "0 0 0 3px #2563eb",
                                    backgroundColor: "#dbeafe",
                                  }
                                : {}),
                            }}
                            className={`
    relative px-4 py-2 rounded-lg ${focusClass}
    ${isUsed ? "bg-gray-300 cursor-not-allowed opacity-60" : "bg-yellow-200 cursor-grab"}
  `}
                          >
                            {a}
                            {speakerBadge("word-" + a)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS GRID */}

            <div className="grid grid-cols-2 gap-x-16">
              {/* LEFT - I */}
              <div>
                {questions
                  .filter((q) => q.type === "I")
                  .map((q, index) => (
                    <div key={q.id} className="flex items-center gap-3 mb-4">
                      <span className="font-bold text-lg">{index + 1}</span>

                      <Droppable
                        droppableId={`answer-${q.id}`}
                        isDropDisabled={isLocked(q.id)}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...slotProps(q.id, provided, snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                            className={`relative border-b-2 border-black min-h-10 flex-1 ${focusClass} ${isWrongAnswer(q.id, answers[q.id]) ? "border-b-2 border-red-600" : "border-b-2 border-black"}`}
                          >
                            <span className="text-black font-semibold">
                              {answers[q.id]}
                            </span>

                            {/* ❌ WRONG ICON */}
                            {isWrongAnswer(q.id, answers[q.id]) && (
                              <div
                                aria-hidden="true"
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white"
                              >
                                ✕
                              </div>
                            )}
                            {provided.placeholder}
                            {answers[q.id] && speakerBadge("blank-" + q.id)}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </div>

              {/* RIGHT - She */}
              <div>
                {questions
                  .filter((q) => q.type === "She")
                  .map((q, index) => (
                    <div key={q.id} className="flex items-center gap-3 mb-4">
                      <span className="font-bold text-lg">{index + 1}</span>

                      <Droppable
                        droppableId={`answer-${q.id}`}
                        isDropDisabled={isLocked(q.id)}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...slotProps(q.id, provided, snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                            className={`relative border-b-2 border-black min-h-10 flex-1 ${focusClass} ${isWrongAnswer(q.id, answers[q.id]) ? "border-b-2 border-red-600" : "border-b-2 border-black"}`}
                          >
                            <span className="text-black font-semibold">
                              {answers[q.id]}
                            </span>
                            {/* ❌ WRONG ICON */}
                            {isWrongAnswer(q.id, answers[q.id]) && (
                              <div
                                aria-hidden="true"
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white"
                              >
                                ✕
                              </div>
                            )}
                            {provided.placeholder}
                            {answers[q.id] && speakerBadge("blank-" + q.id)}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* BUTTONS */}

          <div className="action-buttons-container mt-10">
            <button type="button" onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={showAnswers}
              type="button"
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>

            <button
              type="button"
              aria-disabled={locked}
              onClick={checkAnswers}
              className="check-button2"
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review8_Page1_Q1;
