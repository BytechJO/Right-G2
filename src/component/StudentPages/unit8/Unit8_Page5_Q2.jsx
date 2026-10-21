import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable, useMouseSensor, useTouchSensor } from "@hello-pangea/dnd";

import calendar from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-1.svg";
import glue from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-2.svg";
import tube from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-3.svg";
import blue from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-4.svg";
import nute from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 68/Ex A2-5.svg";
import sound1 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_001_flute.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_002_June.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_003_blue.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_004_glue.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_005_tube.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_006_Sue_McClue_likes_to_play_her.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_007_in.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_008_Sue_wears.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_009_and_puts_a_spoon_in_the.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_010_when_she_plays_her_tune_called.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 8/Page 68 - A2/Item_011_on_the_Moon.mp3";

const pointerSensors = [useMouseSensor, useTouchSensor];
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";
const focusClass = " focus-visible:outline-3 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2";

const Unit8_Page5_Q2 = () => {
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

  const options = ["flute","glue",  "blue", "June", "tube"];

  const blanks = {
    b1: "flute",
    b2: "June",
    b3: "blue",
    b4: "glue",
    b5: "tube",
  };

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
  const wordSounds = { flute: sound1, June: sound2, blue: sound3, glue: sound4, tube: sound5 };
  const isLocked = (id) => locked || lockedSlots.includes(id);
  const isWrong = (id) => showResult && wrongSlots.includes(id);
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
    setAnnouncement(word + " placed in blank " + slot.slice(1) + ".");
    return { updated, remainingWrong };
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination) placeWord(destination.droppableId, draggableId);
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
      setAnnouncement("Blank " + id.slice(1) + " is locked.");
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
      setAnnouncement("Blank " + id.slice(1) + " cleared.");
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
  const show = () => {
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
      Object.keys(blanks).map((id) => "Blank " + id.slice(1) + (correct.includes(id) ? " is correct and locked." : " is incorrect and editable.")).join(" "));
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const renderBlank = (id) => (
  <Droppable droppableId={id} isDropDisabled={isLocked(id)}>
    {(provided, snapshot) => (
      <span className="relative inline-block min-w-[90px] h-[50px] mx-2 text-center">
        
        {/* ❌ */}
        {isWrong(id) && (
          <span aria-hidden="true" className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
            ✕
          </span>
        )}

        <span
          ref={(el) => { provided.innerRef(el); blankRefs.current[id] = el; }}
          {...provided.droppableProps}
          role="button"
          tabIndex={0}
          aria-disabled={isLocked(id)}
          aria-describedby="u8p5q2-help"
          aria-label={`Blank ${id.slice(1)}. ${answers[id] || "Empty"}.${isLocked(id) ? " Correct and locked." : isWrong(id) ? " Incorrect, editable." : ""}`}
          onKeyDown={(e) => onBlankKeyDown(e, id)}
          onKeyUp={blockActivationKeyUp}
          onClick={() => activateBlank(id)}
          onFocus={(e) => onAudioFocus(e, wordSounds[answers[id]], `blank-${id}`)}
          className={`inline-block w-full h-full border-b-2 transition-all duration-200 ${focusClass}
            ${
              snapshot.isDraggingOver
                ? "bg-blue-100 border-2 border-dashed border-blue-500 rounded-md"
                : isWrong(id)
                ? "border-red-500"
                : lockedSlots.includes(id) ? "border-green-600" : "border-black"
            }
          `}
        >
          {answers[id] && (
            <span className="text-red-600 font-semibold">
              {answers[id]}
            </span>
          )}

          {provided.placeholder}
          {answers[id] && speakerBadge(`blank-${id}`)}
        </span>
      </span>
    )}
  </Droppable>
);
  return (
    <DragDropContext dragHandleUsageInstructions="Press Enter or Space to select a word, then activate a blank to place it. You can also drag with a mouse or touch." onDragEnd={onDragEnd} enableDefaultSensors={false} sensors={pointerSensors} onDragStart={() => { cancelAnimationFrame(focusFrame.current); setPickedWord(null); }}>
      <div className="main-container-component" onKeyDown={(e) => {
        if (e.key !== "Escape" || !pickedWord) return;
        e.preventDefault();
        e.stopPropagation();
        const word = pickedWord;
        setPickedWord(null);
        setAnnouncement("Choice cancelled.");
        focusElement(() => chipRefs.current[word]);
      }}>
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
        <p id="u8p5q2-help" className="sr-only">Tab and Shift+Tab move between words and blanks. Enter or Space selects a word and places it in a blank. Activate a filled editable blank to return its word to the bank. Escape cancels selection. Delete or Backspace removes an incorrect answer. Correct answers are locked. Words and poem fragments can be heard with Enter or Space.</p>
        <div className="div-forall">
          {" "}
          {/* ❌ الهيدر كما هو */}
          <ExerciseHeader
            questionNumber="2"
            title="Look and complete the poem. Then say."
            subTitle={"Use the word bank and rhyme clues to fill each blank, then read the poem aloud."}
          />
          <div className="flex flex-col gap-5">
          {/* word bank */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-5 justify-center p-2 rounded-lg"
              >
                {options.map((word, index) => {
                  const used = isWordUsed(word);

                  return (
                    <Draggable
                      key={word}
                      draggableId={word}
                      index={index}
                      isDragDisabled={locked || used}
                    >
                      {(provided) => (
                        <div
                          ref={(el) => { provided.innerRef(el); chipRefs.current[word] = el; }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          role="button"
                          tabIndex={0}
                          aria-pressed={pickedWord === word}
                          aria-disabled={locked || used}
                          aria-describedby="u8p5q2-help"
                          aria-label={word + (used ? ", already used" : ", press Enter or Space to select")}
                          onClick={() => playSound(wordSounds[word], `word-${word}`)}
                          onFocus={(e) => onAudioFocus(e, wordSounds[word], `word-${word}`)}
                          onKeyDown={(e) => {
                            if (!isActivateKey(e)) return;
                            e.preventDefault();
                            e.stopPropagation();
                            if (!e.repeat) pickWord(word);
                          }}
                          onKeyUp={blockActivationKeyUp}
                          className={`relative px-4 py-2 text-xl border-2 border-blue-900 rounded-lg shadow transition-all ${focusClass}
            ${
              used
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-white cursor-grab hover:bg-gray-100"
            }
          `}
                        >
                          {word}
                          {speakerBadge(`word-${word}`)}
                        </div>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* poem */}
          <div className="text-2xl leading-[60px] text-gray-700 mt-8">
            <div>
              <span className="text-[#2e3192] font-bold mr-4">1</span>
              <span {...audioProps(sound6)}>Sue McClue likes to play her{speakerBadge(sound6)}</span>
              {renderBlank("b1")}
              <img
                src={calendar}
                alt="Red musical notes and a treble clef."
                className="inline w-14! h-14! mx-2 object-contain"
              />{" "}
              <span {...audioProps(sound7)}>in{speakerBadge(sound7)}</span>
              {renderBlank("b2")}
              <img
                src={glue}
                alt="A desk calendar showing June."
                className="inline w-14! h-14! ml-2 object-contain"
              />
            </div>

            <div>
              <span className="text-[#2e3192] font-bold mr-4">2 </span>
              <span {...audioProps(sound8)}>Sue wears{speakerBadge(sound8)}</span>
              {renderBlank("b3")}
              <img
                src={tube}
                alt="A blue crayon."
                className="inline w-14! h-14! mx-2 object-contain"
              />
              <span {...audioProps(sound9)}>and puts a spoon in the{speakerBadge(sound9)}</span>
              {renderBlank("b4")}
              <img
                src={blue}
                alt="A bottle labeled Glue."
                className="inline w-14! h-14! ml-2 object-contain"
              />
            </div>

            <div>
              <span {...audioProps(sound10)}>when she plays her tune called{speakerBadge(sound10)}</span>
              {renderBlank("b5")}
              <img
                src={nute}
                alt="A squeezable tube with its cap beside it."
                className="inline w-14! h-14! mx-2 object-contain"
              />
              <span {...audioProps(sound11)}>on the Moon.{speakerBadge(sound11)}</span>
            </div>
          </div></div>
        </div>

        {/* buttons */}

        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={show} className="show-answer-btn swal-continue">
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

export default Unit8_Page5_Q2;
