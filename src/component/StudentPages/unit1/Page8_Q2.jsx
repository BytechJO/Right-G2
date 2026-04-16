import React, { useState, useRef, useEffect } from "react";
import "./Page8_Q2.css";
import sound1 from "../../../assets/audio/ClassBook/U 1/page8-q1.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import ValidationAlert from "../../Popup/ValidationAlert";

// Example images imports. Replace with your actual paths.
import img1a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-1.svg";
import img1b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2.svg";
import img1c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3.svg";

import img2a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2-1.svg";
import img2b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2-2.svg";
import img2c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2-3.svg";

import img3a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3-1.svg";
import img3b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3-2.svg";
import img3c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3-3.svg";

import img4a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-4-1.svg";
import img4b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-4-2.svg";
import img4c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-4-3.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const Page8_Q2 = () => {
  const groups = [
    { images: [img1a, img1b, img1c], different: 2 },
    { images: [img2a, img2b, img2c], different: 1 },
    { images: [img3a, img3b, img3c], different: 1 },
    { images: [img4a, img4b, img4c], different: 2 },
  ];
  const [showResult2, setShowResult2] = useState(false);
  const [selected, setSelected] = useState(Array(groups.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.579,
      end: 3.379,
      text: "Page 8. Right Activities.",
    },
    {
      start: 4.519,
      end: 6.859,
      text: "Exercise A, number 2.",
    },
    {
      start: 7.919,
      end: 12.439,
      text: "Listen and write X on the picture with a different sound.",
    },
    {
      start: 13.5,
      end: 19.739,
      text: "1:run, rabbit, lemon.",
    },
   
    {
      start: 19.739,
      end: 26.26,
      text: "2:leg,railroad track, red",
    },
   
    {
      start: 26.26,
      end: 32.34,
      text: "3:laugh, rain, lock.",
    },
   
    {
      start: 32.34,
      end: 37.84,
      text: "4: lion, lamp,ring",
    },
   
  ];

  const handleSelect = (groupIndex, imageIndex) => {
    if (locked || showResult2) return; // 🔒 منع التعديل بعد Show Answer
    const updated = [...selected];
    updated[groupIndex] = imageIndex;
    setSelected(updated);
    setShowResult2(false);
  };
  const showAnswers = () => {
    const correctSelections = groups.map((g) => g.different);

    setSelected(correctSelections);
    setShowResult2(true);
    setLocked(true); // 🔒 قفل التعديل
  };

  const checkAnswers = () => {
    if (locked || showResult2) return; // 🔒 منع التعديل بعد Show Answer
    if (selected.some((val) => val === null)) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }
    let correctCount = 0;
    let wrongCount = 0;
    groups.forEach((group, index) => {
      if (selected[index] === null)
        return ValidationAlert.info(
          "Please choose a circle (f or v) for all items!",
        );

      if (selected[index] === group.different) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const total = groups.length; // 8 نقاط
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;
    // تحديد الرسالة حسب نوع الإجابات
    if (correctCount === groups.length) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
    setShowResult2(true);
  };

  const reset = () => {
    setSelected(Array(groups.length).fill(null));
    setShowResult(false);
    setShowResult2(false);
     setLocked(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h3 className="header-title-page8">
          <span style={{ color: "#2e3192" }}>2</span> Listen and write{" "}
          <span style={{ color: "#2e3192" }}>✗</span> on the picture with a
          different sound.
        </h3>
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={12.43}
        />
        <div className="exercise-row-CB-unit1-p8-q2">
          {groups.map((group, gIndex) => (
            <div className="group-box-CB-unit1-p8-q2 " key={gIndex}>
              <span style={{ color: "darkblue", fontWeight: "700" }}>
                {gIndex + 1}
              </span>
              {group.images.map((img, iIndex) => {
                const isSelected = selected[gIndex] === iIndex;
                const isCorrect = group.different === iIndex;

                return (
                  <div
                    className="image-wrapper-CB-unit1-p8-q2 "
                    key={iIndex}
                    onClick={() => !locked && handleSelect(gIndex, iIndex)}
                  >
                    <img src={img} className="image-CB-unit1-p8-q2 " />

                    {/* Display X only when result is shown */}
                    {isSelected && <div className="ds-x">✕</div>}
                    {/* ❌ دائرة حمراء فيها X بيضاء للخطأ فقط عند النتيجة */}
                    {showResult2 && !locked && isSelected && !isCorrect && (
                      <span className="wrong-x-CB-unit1-p8-q2">✕</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Page8_Q2;
