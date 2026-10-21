import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable, useMouseSensor, useTouchSensor } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

import imgA from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Ex D 1.svg";
import imgB from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 69/Ex D 2.svg";

import sound1 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_001_He_has_two_pairs_of_socks.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_002_He_has_two_pairs_of_shoes.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_003_He_has_three_caps.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_004_She_has_five_shirts.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_005_She_has_two_skirts.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_006_She_has_three_dresses.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_007_How_many_pairs_of_socks_does_he_have.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_008_How_many_pairs_of_shoes_does_he_have.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_009_How_many_caps_does_he_have.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_010_How_many_shirts_does_she_have.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 8/Page 69 - D/Item_011_How_many_skirts.mp3";

const pointerSensors = [useMouseSensor, useTouchSensor];
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";
const focusClass = " focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";

const Unit8_Page6_Q1 = () => {
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

  const answersBank = [
    "He has two pairs of socks.",
    "He has two pairs of shoes.",
    "He has three caps.",
    "She has five shirts.",
    "She has two skirts.",
    "She has three dresses.",
  ];

  const questions = [
    {
      id: 1,
      text: "How many pairs of socks does he have?",
      answer: "He has two pairs of socks.",
    },
    {
      id: 2,
      text: "How many pairs of shoes does he have?",
      answer: "He has two pairs of shoes.",
    },
    {
      id: 3,
      text: "How many caps does he have?",
      answer: "He has three caps.",
    },
    {
      id: 4,
      text: "How many shirts does she have?",
      answer: "She has five shirts.",
    },
    {
      id: 5,
      text: "How many skirts does she have?",
      answer: "She has two skirts.",
    },
    {
      id: 6,
      text: "How many dresses does she have?",
      answer: "She has three dresses.",
    },
  ];

  const options = answersBank;
  const blanks = Object.fromEntries(questions.map((q) => [String(q.id), q.answer]));
  const questionSounds = { 1: sound7, 2: sound8, 3: sound9, 4: sound10, 5: sound11 };

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
  const wordSounds = Object.fromEntries(answersBank.map((sentence, i) => [sentence, [sound1, sound2, sound3, sound4, sound5, sound6][i]]));
  const isLocked = (id) => locked || lockedSlots.includes(String(id));
  const isWrong = (id) => showResult && wrongSlots.includes(String(id));
  const isWordUsed = (word, currentAnswers = answers, wrong = wrongSlots) =>
    Object.entries(currentAnswers).some(([id, value]) => value === word && !wrong.includes(id));

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
    if (!skipFocusSound.current && e.currentTarget.matches(":focus-visible")) playSound(src, key);
  };
  const blockActivationKeyUp = (e) => {
    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const audioProps = (src) => ({
    role: "button",
    tabIndex: 0,
    className: "relative" + focusClass,
    style: playingKey === src ? {
      boxShadow: "0 0 0 3px #2563eb",
      backgroundColor: "#dbeafe",
      borderRadius: "4px",
    } : undefined,
    onClick: () => playSound(src),
    onFocus: (e) => onAudioFocus(e, src),
    onKeyDown: (e) => {
      if (!isActivateKey(e)) return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) playSound(src);
    },
    onKeyUp: blockActivationKeyUp,
  });
  const placeWord = (slot, word) => {
    if (!Object.hasOwn(blanks, slot) || !options.includes(word) || isLocked(slot)) return null;
    if (Object.entries(answers).some(([id, value]) => value === word && isLocked(id))) return null;
    const updated = { ...answers };
    const cleared = [];
    Object.keys(updated).forEach((id) => {
      if (updated[id] === word) {
        delete updated[id];
        cleared.push(id);
      }
    });
    updated[slot] = word;
    const remainingWrong = wrongSlots.filter((id) => id !== slot && !cleared.includes(id));
    setAnswers(updated);
    setWrongSlots(remainingWrong);
    setPickedWord(null);
    setAnnouncement(word + " placed in blank " + slot + ".");
    return { updated, remainingWrong };
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination && /^answer-[1-6]$/.test(destination.droppableId)) placeWord(destination.droppableId.slice(7), draggableId);
  };
  const pickWord = (word) => {
    playSound(wordSounds[word], `word-${word}`);
    if (locked || isWordUsed(word)) {
      setAnnouncement(locked ? "Answers are locked. Press Start Again to try again." : word + " is already used.");
      return;
    }
    const target = Object.keys(blanks).find((id) => !isLocked(id) && !answers[id]) ||
      Object.keys(blanks).find((id) => !isLocked(id));
    if (!target) return;
    setPickedWord(word);
    setAnnouncement(word + " selected. Press Tab to choose a blank, then Enter or Space to place it. Escape cancels.");
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
      setAnnouncement("Choose a word first, then press Enter or Space on a blank.");
      return;
    }
    const placed = placeWord(id, pickedWord);
    if (!placed || !viaKeyboard) return;
    const next = options.find((word) => !isWordUsed(word, placed.updated, placed.remainingWrong)) || pickedWord;
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

  const speakerBadge = (key) => playingKey === key && (
    <span
      aria-hidden="true"
      style={{
        position: "absolute", top: -10, right: -10, width: 22, height: 22,
        borderRadius: "50%", display: "flex", alignItems: "center",
        justifyContent: "center", pointerEvents: "none", zIndex: 3,
        lineHeight: 1, background: "#fff", color: "#000",
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
    const correct = Object.keys(blanks).filter((id) => lockedSlots.includes(id) || answers[id] === blanks[id]);
    const wrong = Object.keys(blanks).filter((id) => !correct.includes(id));
    const score = correct.length;
    setLockedSlots(correct);
    setWrongSlots(wrong);
    setLocked(score === total);
    setShowResult(true);
    setAnnouncement("Score " + score + " out of " + total + ". " +
      Object.keys(blanks).map((id) => "Blank " + id + (correct.includes(id) ? " is correct and locked." : " is incorrect and editable.")).join(" "));
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors={false} sensors={pointerSensors}
      dragHandleUsageInstructions="Press Enter or Space to select a sentence, then activate an answer slot to place it. You can also drag with a mouse or touch."
      onDragStart={() => { cancelAnimationFrame(focusFrame.current); setPickedWord(null); }}>
      <div className="main-container-component" onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
        if (e.key !== "Escape" || !pickedWord) return;
        e.preventDefault(); e.stopPropagation();
        const sentence = pickedWord;
        setPickedWord(null);
        setAnnouncement("Selection cancelled.");
        focusElement(() => chipRefs.current[sentence]);
      }} onKeyUp={(e) => { if (isActivateKey(e)) e.stopPropagation(); }}>
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
        <p id="u8p6q1-help" className="sr-only">Tab and Shift+Tab move between sentences, questions, and answer slots. Enter or Space selects a sentence and places it in a slot. Activate a filled editable slot to return its sentence to the bank. Escape cancels selection. Delete or Backspace removes an incorrect answer. Correct answers are locked.</p>
        <div className="div-forall" style={{ gap: "10px" }}>
          <ExerciseHeader sectionLetter="D" title="Look and write." subTitle={"Use the picture and word clues, then type the missing word or sentence carefully."} />

          {/* IMAGES */}
          <div className="w-[100%] flex flex-col gap-3">
            <div className="flex justify-center gap-10">
              <div className="relative">
                <img
                  src={imgA}
                  alt="A boy beside an open wardrobe containing shirts, caps, socks, and shoes."
                  className="w-[380px]! h-[230px]! object-contain"
                />
              </div>

              <div className="relative">
                <img
                  src={imgB}
                  alt="A girl beside an open wardrobe containing shirts, skirts, and dresses."
                  className="w-[380px]! h-[230px]! object-contain"
                />
              </div>
            </div>

            {/* ANSWERS BANK */}

            <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5 p-2 rounded-lg"
                >
                  {answersBank.map((a, index) => {
                    const used = isWordUsed(a);
                    return (
                      <Draggable
                        key={a}
                        draggableId={a}
                        index={index}
                        isDragDisabled={locked || used}
                      >
                        {(provided) => (
                          <div
                            ref={(node) => { provided.innerRef(node); chipRefs.current[a] = node; }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              ...(pickedWord === a ? {
                                boxShadow: "0 0 0 3px #2563eb",
                                backgroundColor: "#dbeafe",
                              } : {}),
                            }}
                            role="button" tabIndex={0}
                            aria-pressed={pickedWord === a} aria-disabled={locked || used}
                            aria-label={a + (used ? " Already used." : " Press Enter or Space to select.")}
                            aria-describedby="u8p6q1-help"
                            onClick={() => playSound(wordSounds[a], `word-${a}`)}
                            onFocus={(e) => onAudioFocus(e, wordSounds[a], `word-${a}`)}
                            onKeyDown={(e) => {
                              if (!isActivateKey(e)) return;
                              e.preventDefault(); e.stopPropagation();
                              if (!e.repeat) pickWord(a);
                            }}
                            onKeyUp={blockActivationKeyUp}
                            className={`relative ${focusClass} bg-yellow-200 px-4 py-2 rounded-lg cursor-grab  ${
                              used
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-white cursor-grab hover:bg-gray-100"
                            }`}
                          >
                            {a}
                            {speakerBadge(`word-${a}`)}
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

            <div className="grid grid-cols-2 gap-x-16 mb-20 ">
              {questions.map((q) => (
                <div key={q.id} role="group" aria-label={`Question ${q.id}`}>
                  <div className="flex gap-3 text-lg">
                    <span className="font-bold">{q.id}</span>
                    <p {...(questionSounds[q.id] ? audioProps(questionSounds[q.id]) : {})}>
                      {q.text}{questionSounds[q.id] && speakerBadge(questionSounds[q.id])}
                    </p>
                  </div>

                  <Droppable droppableId={`answer-${q.id}`} isDropDisabled={isLocked(q.id)}>
                    {(provided, snapshot) => (
                      <div className="relative h-10 mt-2">
                        {/* ❌ */}
                        {isWrong(q.id) && (
                          <span aria-hidden="true" className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                            ✕
                          </span>
                        )}

                        <div
                          ref={(node) => { provided.innerRef(node); blankRefs.current[q.id] = node; }}
                          {...provided.droppableProps}
                          role="button" tabIndex={0} aria-disabled={isLocked(q.id)}
                          aria-describedby="u8p6q1-help"
                          aria-label={`Answer ${q.id}. ${answers[q.id] || "Empty"}.${isLocked(q.id) ? " Correct and locked." : isWrong(q.id) ? " Incorrect, editable." : ""}`}
                          onClick={() => activateBlank(String(q.id))}
                          onFocus={(e) => onAudioFocus(e, wordSounds[answers[q.id]], `blank-${q.id}`)}
                          onKeyDown={(e) => onBlankKeyDown(e, String(q.id))}
                          onKeyUp={blockActivationKeyUp}
                          className={`relative h-8 transition-all duration-200 ${focusClass}
    ${
      snapshot.isDraggingOver
        ? "bg-blue-100 border-2 border-dashed border-blue-500 rounded-md"
        : isWrong(q.id)
          ? "border-b-2 border-red-500"
          : lockedSlots.includes(String(q.id)) ? "border-b-2 border-green-600" : "border-b-2 border-black"
    }
  `}
                        >
                          <span className="text-red-600 font-semibold">
                            {answers[q.id]}
                          </span>

                          {provided.placeholder}
                          {answers[q.id] && speakerBadge(`blank-${q.id}`)}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
          {/* BUTTONS */}

          <div className="action-buttons-container mt-10">
            <button type="button" onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className={`try-again-button`}>
              Start Again ↻
            </button>

            <button
              onClick={showAnswers}
              type="button" className={`show-answer-btn swal-continue`}
            >
              Show Answer
            </button>

            <button type="button" onClick={checkAnswers} aria-disabled={locked} className={`check-button2`}>
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit8_Page6_Q1;
