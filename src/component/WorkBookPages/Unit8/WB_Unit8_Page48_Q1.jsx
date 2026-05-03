import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 4.svg";

export default function SpotTheDifference() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      img: img3,
      statements: [
        "In Picture A, Mom has sunglasses.",
        "In Picture B, Mom has sunglasses.",
      ],
      correct: 0,
    },
    {
      id: 2,
      img: img4,
      statements: [
        "In Picture A, all of us have hats.",
        "In Picture B, all of us have hats.",
      ],
      correct: 0,
    },
    {
      id: 3,
      img: img3,
      statements: [
        "In Picture A, we don't have hats.",
        "In Picture B, we don't have hats.",
      ],
      correct: 1,
    },
  ];

  const handleSelect = (id, index) => {
    if (!submitted) {
      setAnswers({ ...answers, [id]: index });
    }
  };

  const handleSubmit = () => {
    if (submitted) return;

    // 🔴 تحقق إنو كل الأسئلة مجاوبة
    const keys = questions.map((q) => q.id);

    if (keys.some((k) => answers[k] === undefined)) {
      ValidationAlert.info("Please answer all questions!");
      return;
    }

    // ✅ حساب السكور
    let score = 0;

    keys.forEach((k) => {
      const question = questions.find((q) => q.id === k);
      if (answers[k] === question.correct) score++;
    });

    const msg = `Score: ${score} / ${keys.length}`;

    // 🎯 نفس الديزاين تبعك
    if (score === keys.length) {
      ValidationAlert.success(msg);
    } else if (score > 0) {
      ValidationAlert.warning(msg);
    } else {
      ValidationAlert.error(msg);
    }

    setSubmitted(true);
  };
  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };
  const handleShowAnswer = () => {
    const correctAnswers = {};
    questions.forEach((q) => {
      correctAnswers[q.id] = q.correct;
    });

    setAnswers(correctAnswers);
    setSubmitted(true);
  };
  return (
    <div className="main-container-component mb-10">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">H</span>Look and find. Say.
        </h1>
       <div className="flex flex-col gap-5">
        {/* Pictures */}
        <div className="grid grid-cols-2 gap-6" style={{justifyItems:"center"}}>
          <div className="rounded-lg">
            <div className="text-center font-bold text-2xl mb-4">Picture A</div>
            <div className="text-6xl text-center">
              <img src={img1} className="rounded-lg" style={{ height: "350px", width: "auto" ,borderRadius:"9px"}} />
            </div>
          </div>
          <div className="rounded-lg">
            <div className="text-center font-bold text-2xl mb-4">Picture B</div>
            <div className="text-6xl text-center">
              <img src={img2} style={{ height: "350px", width: "auto" }} />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white p-4 rounded-lg border-2 border-gray-200"
            >
              <p className="font-semibold mb-3">Question {q.id}</p>
              <div className="relative space-y-2">
                {q.statements.map((stmt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, idx)}
                    disabled={submitted}
                    className={`relative w-full p-3 text-left rounded-lg border-2 transition ${
                      answers[q.id] === idx
                        ? idx === q.correct && submitted
                          ? "bg-gray-100 border-blue-900"
                          : idx !== q.correct && submitted
                            ? "border-red-500 bg-red-50"
                            : "bg-gray-100 border-blue-900"
                        : "bg-gray-100 border-gray-300 hover:border-blue-900"
                    }`}
                  >
                    {stmt}

                    {/* ❌ Wrong */}
                    {submitted &&
                      answers[q.id] === idx &&
                      idx !== q.correct && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          ✕
                        </div>
                      )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
</div>
        {/* Buttons */}
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleReset}
          checkAnswers={handleSubmit}
        />
      </div>
    </div>
  );
}
