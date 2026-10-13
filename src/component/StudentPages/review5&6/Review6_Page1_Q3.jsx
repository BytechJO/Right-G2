/* eslint-disable react-refresh/only-export-components */
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 54/Ex c 1.svg";
import "./Review6_Page1_Q3.css";
import { FaVolumeUp } from "react-icons/fa";

import passageAudio1 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_001_Sheila_gets_up_at_seven_o'clock_in_the_morning._She_goes_to_school_at_ei.mp3";
import passageAudio2 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_002_She_comes_home_at_three_thirty._She_eats_dinner_at_seven_thirty_in_the_e.mp3";
import passageAudio3 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_003_She_does_her_homework_at_eight_o'clock._She_goes_to_bed_at_nine.mp3";
import qAudio1 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_004_Sheila_does_her_homework_at_8_00_p.m.mp3";
import qAudio2 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_005_Sheila_goes_to_school_at_8_30_p.m.mp3";
import qAudio3 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_006_Sheila_comes_home_at_3_30_p.m.mp3";
import qAudio4 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_007_Sheila_eats_dinner_at_7_30_a.m.mp3";
import qAudio5 from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_008_Sheila_goes_to_bed_at_9_00_p.m.mp3";
import trueAudio from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_009_True.mp3";
import falseAudio from "../../../assets/audio/ClassBook/U 6/Page 54 - C/Item_010_False.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const passageParts = [
  {
    id: "p1",
    text: "Sheila gets up at seven o’clock in the morning. She goes to school at eight thirty.",
    audio: passageAudio1,
  },
  {
    id: "p2",
    text: "She comes home at three thirty. She eats dinner at seven thirty in the evening.",
    audio: passageAudio2,
  },
  {
    id: "p3",
    text: "She does her homework at eight o’clock. She goes to bed at nine.",
    audio: passageAudio3,
  },
];

const questions = [
  {
    text: "Sheila does her homework at 8:00 p.m.",
    correct: "True",
    audio: qAudio1,
  },
  {
    text: "Sheila goes to school at 8:30 p.m.",
    correct: "False",
    audio: qAudio2,
  },
  {
    text: "Sheila comes home at 3:30 p.m.",
    correct: "True",
    audio: qAudio3,
  },
  {
    text: "Sheila eats dinner at 7:30 a.m.",
    correct: "False",
    audio: qAudio4,
  },
  {
    text: "Sheila goes to bed at 9:00 p.m.",
    correct: "True",
    audio: qAudio5,
  },
];

const optionAudio = { True: trueAudio, False: falseAudio };

const SpeakerIcon = () => (
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

const Review6_Page1_Q3 = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  // results[i]: null = not checked / changed, true = correct, false = wrong
  const [results, setResults] = useState(Array(questions.length).fill(null));
  const [locked, setLocked] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);
  const pointerDownRef = useRef(false);

  /* ---------------- audio ---------------- */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const playAudio = (src, id) => {
    stopAudio();
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingId(id);
    audio.onended = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  /* ---------------- answers ---------------- */
  const isItemLocked = (i) => locked || results[i] === true;

  const selectAnswer = (i, value) => {
    playAudio(optionAudio[value], `opt-${i}-${value}`);
    if (isItemLocked(i)) return;

    setAnswers((prev) => {
      const updated = [...prev];
      updated[i] = value;
      return updated;
    });

    // the student changed a wrong answer: clear its old result
    setResults((prev) => {
      if (prev[i] === null) return prev;
      const updated = [...prev];
      updated[i] = null;
      return updated;
    });
  };

  const checkAnswers = () => {
    if (locked) return;

    if (answers.includes(null)) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    const newResults = answers.map((ans, i) => ans === questions[i].correct);
    const score = newResults.filter(Boolean).length;
    const total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    setResults(newResults);

    if (score === total) {
      ValidationAlert.success(message);
      setLocked(true);
    } else if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  const showAnswers = () => {
    stopAudio();
    setAnswers(questions.map((q) => q.correct));
    setResults(Array(questions.length).fill(true));
    setLocked(true);
  };

  const reset = () => {
    stopAudio();
    setAnswers(Array(questions.length).fill(null));
    setResults(Array(questions.length).fill(null));
    setLocked(false);
  };

  /* ---------------- sentence with audio ---------------- */
  const renderSentence = (id, text, src, extraClass = "") => {
    const isPlaying = playingId === id;
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`Play audio: ${text}`}
        onPointerDown={() => {
          pointerDownRef.current = true;
        }}
        onClick={() => {
          pointerDownRef.current = false;
          playAudio(src, id);
        }}
        onFocus={() => {
          // keyboard (Tab) focus plays the audio; mouse focus is handled by onClick
          if (!pointerDownRef.current) playAudio(src, id);
        }}
        onBlur={() => {
          pointerDownRef.current = false;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playAudio(src, id);
          }
        }}
        className={`relative cursor-pointer rounded-lg py-2 pl-3 pr-9 text-[20px] leading-[1.6] outline-none transition-colors hover:bg-blue-50  ${
          isPlaying ? "border-2 border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 bg-blue-50" : ""
        } ${extraClass}`}
      >
        {text}
        {/* the speaker shows only while this sentence is playing */}
        {isPlaying && <SpeakerIcon />}
      </div>
    );
  };

  /* ---------------- true / false option ---------------- */
  const renderOption = (i, value) => {
    const selected = answers[i] === value;
    const itemLocked = isItemLocked(i);
    const showWrong = results[i] === false && selected;

    let cls =
      "relative rounded-full border-2 px-3 py-[3px] text-[20px] outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ";
    cls += itemLocked ? "cursor-default " : "cursor-pointer ";

    if (selected) {
      cls +=
        "font-bold " +
        (results[i] === true ? "border-green-500" : "border-blue-500");
    } else {
      cls += "border-transparent " + (itemLocked ? "" : "hover:bg-gray-100");
    }

    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-disabled={itemLocked}
        aria-label={`${value} for sentence ${i + 1}`}
        onClick={() => selectAnswer(i, value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectAnswer(i, value);
          }
        }}
        className={cls}
      >
        {value}
        {showWrong && (
          <div className="absolute -top-2 -right-2 ml-3 w-6 h-6 bg-red-500 rounded-full flex items-center text-sm justify-center text-white font-bold border-2 border-white shadow-lg">
            ✕
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="C"
          title="Read and circle true or false."
          subTitle="Read each statement and compare it with the picture or story before choosing True or False."
          isReview={true}
        />

        <div className="flex flex-col gap-5" style={{marginBottom:"50px"}}>
          {/* passage + image */}
          <div className="flex items-center gap-[30px] mb-[30px]">
            <div className="flex flex-1 flex-col gap-3 border-2 border-red-600 rounded-xl p-2">
              {passageParts.map((part) =>
                renderSentence(part.id, part.text, part.audio)
              )}
            </div>

            <img
              src={img1}
              alt="Illustration of Sheila's daily routine"
              style={{
                width: "170px",
                height: "auto",
              }}
            />
          </div>

          {/* questions */}
          <div>
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2.5 mb-3">
                <span className="font-bold text-xl">{i + 1}</span>

                {renderSentence(`q-${i}`, q.text, q.audio, "flex-1")}

                <div
                  role="radiogroup"
                  aria-label={`Sentence ${i + 1}: true or false`}
                  className="flex gap-5"
                >
                  {renderOption(i, "True")}
                  {renderOption(i, "False")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* buttons */}
      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
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
  );
};

export default Review6_Page1_Q3;