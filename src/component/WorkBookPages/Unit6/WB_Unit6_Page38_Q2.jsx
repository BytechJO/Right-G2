import React, { useState, useEffect, useRef } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound from "../../../assets/audio/WorkBook/p38q3.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 38/Ex B 5.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import { tr } from "framer-motion/client";
const exerciseData = [
  { id: "b1", src: img1, correctAnswer: "✓" },
  { id: "b2", src: img2, correctAnswer: "✓" },
  { id: "b3", src: img3, correctAnswer: "✓" },
  { id: "b4", src: img4, correctAnswer: "✘" },
  { id: "b5", src: img5, correctAnswer: "✓" },
];

const WB_Unit6_Page38_Q2 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);
  const stopAtSecond = 10;
  const handleBoxClick = (qId, value) => {
    if (showResults) return;

    setSelections((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };
  const getBoxClass = (qId) => {
    const isSelected = !!selections[qId];

    if (showResults) {
      const isCorrect =
        selections[qId] ===
        exerciseData.find((q) => q.id === qId).correctAnswer;

      return isCorrect
        ? "border-green-500 bg-green-50"
        : "border-red-500 bg-red-50";
    }

    if (isSelected) return "border-blue-500";
    return "border-gray-400";
  };

  const isWrongAnswer = (qId) => {
    if (!showResults) return false;
    if (!selections[qId]) return false;

    const question = exerciseData.find((q) => q.id === qId);
    return selections[qId] !== question.correctAnswer;
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    exerciseData.forEach((q) => {
      correctSels[q.id] = q.correctAnswer;
    });
    setSelections(correctSels);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = exerciseData.filter((q) => !selections[q.id]);

    if (unanswered.length > 0) {
      ValidationAlert.info("Please answer all items before checking.");
      return;
    }

    setShowResults(true);

    let score = 0;
    exerciseData.forEach((q) => {
      if (selections[q.id] === q.correctAnswer) score++;
    });

    if (score === exerciseData.length) {
      ValidationAlert.success(`Score: ${score} / ${exerciseData.length}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${exerciseData.length}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${exerciseData.length}`);
    }
  };
  const captions = [
    { start: 0.52, end: 3.24, text: "Page 38, phonics exercise C." },

    {
      start: 4.54,
      end: 9.32,
      text: "Does it have a long I? Listen and write check or X.",
    },

    { start: 10.46, end: 12.06, text: "1.bike." },

    { start: 13.22, end: 14.98, text: "2.write." },

    { start: 16.06, end: 18.12, text: "3.nine." },

    { start: 19.14, end: 21.1, text: "4.neat." },
    { start: 21.15, end: 23.46, text: "5.pipe." },
  ];

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"50px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">C</span>Does it have long i? Listen and
          write <span className="text-blue-900">✓</span> or{" "}
          <span className="text-blue-900">✕</span>.
        </h1>

        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="flex gap-6 items-center justify-center">
          {exerciseData.map((item, index) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
              <div className="flex items-start">
                <span className="font-bold text-blue-600">{index + 1}</span>
                <img
                  src={item.src}
                  style={{ height: "120px", width: "auto" }}
                />
              </div>
              <div className="relative">
                <div className="flex gap-2">
                  {/* ✅ YES BOX */}
                  <div className="relative">
                    <div
                      onClick={() => handleBoxClick(item.id, "✓")}
                      className={`w-12 h-12 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
        ${
          selections[item.id] === "✓"
            ? "border-blue-900"
            : "border-gray-400 hover:border-blue-900"
        }
        ${
          showResults &&
          selections[item.id] === "✓" &&
          selections[item.id] !== item.correctAnswer
            ? "border-red-500 bg-red-50"
            : ""
        }
      `}
                    >
                      <span className="text-green-600 text-2xl font-bold">
                        <img src={trueIcon} style={{ height: "25px" }} />
                      </span>
                    </div>

                    {/* ❌ error on YES */}
                    {showResults &&
                      selections[item.id] === "✓" &&
                      selections[item.id] !== item.correctAnswer && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>

                  {/* ❌ NO BOX */}
                  <div className="relative">
                    <div
                      onClick={() => handleBoxClick(item.id, "✘")}
                      className={`w-12 h-12 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all
        ${
          selections[item.id] === "✘"
            ? "border-blue-900"
            : "border-gray-400 hover:border-blue-900"
        }
        ${
          showResults &&
          selections[item.id] === "✘" &&
          selections[item.id] !== item.correctAnswer
            ? "border-red-500 bg-red-50"
            : ""
        }
      `}
                    >
                      <span className="text-red-600 text-2xl font-bold">
                        {" "}
                        <img src={falseIcon} style={{ height: "25px" }} />
                      </span>
                    </div>

                    {/* ❌ error on NO */}
                    {showResults &&
                      selections[item.id] === "✘" &&
                      selections[item.id] !== item.correctAnswer && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit6_Page38_Q2;
