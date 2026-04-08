import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 6.svg";

const questions = [
  {
    id: 1,
    text: "In Picture A, Mom has sunglasses.",
    img: img3,
    correctAnswer: "A",
  },
  {
    id: 2,
    text: "In Picture B, Mom doesn’t have sunglasses.",
    img: img4,
    correctAnswer: "B",
  },
  {
    id: 3,
    text: "In Picture A, all of us have hats.",
    img: img5,
    correctAnswer: "A",
  },
  {
    id: 4,
    text: "In Picture B, we don’t have hats.",
    img: img6,
    correctAnswer: "B",
  },
];

const LookAndFind = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId, choice) => {
    if (showResults) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  };

  const checkAnswers = () => {
    const unanswered = questions.some((q) => !answers[q.id]);

    if (unanswered) {
      ValidationAlert.info("Please answer all questions first.");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score++;
    });

    setShowResults(true);

    const message = `Score: ${score} / ${questions.length}`;

    if (score === questions.length) {
      ValidationAlert.success(message);
    } else if (score > 0) {
      ValidationAlert.warning(message);
    } else {
      ValidationAlert.error(message);
    }
  };
  const handleShowAnswer = () => {
    const correct = {};

    questions.forEach((q) => {
      correct[q.id] = q.correctAnswer;
    });

    setAnswers(correct);
    setShowResults(true);
  };
  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const getImageClass = (questionId, choice) => {
    const selected = answers[questionId] === choice;

    let base = "w-40 h-8 border-2 rounded-lg cursor-pointer transition-all";

    if (!showResults) {
      return selected
        ? `${base} border-blue-500 scale-105`
        : `${base} border-gray-300 hover:scale-105`;
    }

    const isCorrect =
      choice === questions.find((q) => q.id === questionId).correctAnswer;

    if (selected && isCorrect) return `${base} border-blue-500`;
    if (selected && !isCorrect) return `${base} border-red-500`;

    return `${base} border-gray-300 opacity-70`;
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        {" "}
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">H</span> Look and find. Say.{" "}
        </h1>
        {/* الصور */}
        <div className="flex justify-center gap-10">
          <div className="text-center">
            <p className="font-bold mb-2">A</p>
            <div className=" flex items-center justify-center">
              {/* حطي SVG تبعك هون */}

              <img
                src={img1}
                style={{ height: "190px", width: "200px" }}
                className=" flex items-center justify-center text-lg font-bold  cursor-pointer transition-all"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="font-bold mb-2">B</p>
            <div className=" flex items-center justify-center">
              {/* حطي SVG تبعك هون */}

              <img
                src={img2}
                style={{ height: "190px", width: "200px" }}
                className=" flex items-center justify-center text-lg font-bold  cursor-pointer transition-all"
              />
            </div>
          </div>
        </div>
        {/* الأسئلة */}
        <div className="mt-8 space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="text-center">
              <div className="flex items-center gap-4">
                <img
                  src={q.img}
                  className="w-10 h-10 object-contain mb-2"
                  style={{ height: "90px" }}
                />{" "}
                <p className="w-100 mb-3 text-lg border-2 border-gray-300 rounded-lg p-3">
                  {q.text}
                </p>
              </div>
              <div className="flex justify-center gap-6">
                <div className="relative">
                  <div
                    onClick={() => handleSelect(q.id, "A")}
                    className={getImageClass(q.id, "A")}
                  >
                    A
                  </div>

                  {showResults &&
                    answers[q.id] === "A" &&
                    q.correctAnswer !== "A" && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-sm font-bold flex items-center justify-center rounded-full border-2 border-white">
                        ✕{" "}
                      </div>
                    )}
                </div>

                <div className="relative">
                  <div
                    onClick={() => handleSelect(q.id, "B")}
                    className={getImageClass(q.id, "B")}
                  >
                    B
                  </div>

                  {showResults &&
                    answers[q.id] === "B" &&
                    q.correctAnswer !== "B" && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-sm font-bold flex items-center justify-center rounded-full border-2 border-white">
                        ✕{" "}
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* الأزرار */}
        <div className="mt-8">
          <Button
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
            handleShowAnswer={handleShowAnswer}
          />
        </div>
      </div>
    </div>
  );
};

export default LookAndFind;
