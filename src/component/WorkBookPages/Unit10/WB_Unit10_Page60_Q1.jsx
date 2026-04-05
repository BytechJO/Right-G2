import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgRun from "../../../assets/imgs/test6.png";
import imgDrink from "../../../assets/imgs/test6.png";
import imgListen from "../../../assets/imgs/test6.png";
import imgWatch from "../../../assets/imgs/test6.png";
import imgWork from "../../../assets/imgs/test6.png";

const WB_Unit10_Page60_Q1 = () => {
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q1_num: "",
    q2_num: "",
    q3_num: "",
    q4_num: "",
    q5_num: "",
  });

  const [showResults, setShowResults] = useState(false);

  const CORRECT_F = {
    q1: "running",
    q2: "drinking",
    q3: "listening",
    q4: "watching",
    q5: "working",
  };

  // عدلي الأرقام هون إذا المطابقة الحقيقية مختلفة
  const CORRECT_F_NUM = {
    q1_num: "1",
    q2_num: "2",
    q3_num: "3",
    q4_num: "4",
    q5_num: "5",
  };

  const ALL_CORRECT = { ...CORRECT_F, ...CORRECT_F_NUM };

  const OPTIONS = [
    "running",
    "drinking",
    "listening",
    "watching",
    "working",
    "eating",
    "sleeping",
  ];

  const QUESTIONS = [
    { id: "q1", img: imgRun, num: "1", prefix: "They're (run) ", suffix: "." },
    {
      id: "q2",
      img: imgDrink,
      num: "2",
      prefix: "It's (drink) ",
      suffix: " milk.",
    },
    {
      id: "q3",
      img: imgListen,
      num: "3",
      prefix: "He's (listen) ",
      suffix: " to the radio.",
    },
    {
      id: "q4",
      img: imgWatch,
      num: "4",
      prefix: "I'm (watch) ",
      suffix: " a movie.",
    },
    {
      id: "q5",
      img: imgWork,
      num: "5",
      prefix: "We're (work) ",
      suffix: " on the computer.",
    },
  ];

  const checkAnswers = () => {
    const unanswered = Object.keys(ALL_CORRECT).filter((id) => !answers[id]);

    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true);

    let score = 0;
    Object.keys(ALL_CORRECT).forEach((id) => {
      if (answers[id] === ALL_CORRECT[id]) score++;
    });

    const total = Object.keys(ALL_CORRECT).length;
    const msg = `Score: ${score} / ${total}`;

    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleReset = () => {
    setAnswers({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q1_num: "",
      q2_num: "",
      q3_num: "",
      q4_num: "",
      q5_num: "",
    });
    setShowResults(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "30px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">F</span>Complete. Look and match.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="relative group">
              <img
                src={q.img}
                alt="activity"
                className="max-w-full max-h-32 object-cover rounded-xl border-2 border-gray-100 group-hover:border-blue-200 transition-all"
              />

              {/* ❌ للأرقام فوق الصور */}
              {showResults &&
                answers[`${q.id}_num`] &&
                answers[`${q.id}_num`] !== CORRECT_F_NUM[`${q.id}_num`] && (
                  <div className="absolute -top-2 -right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
                    ✕
                  </div>
                )}

              <select
                value={answers[`${q.id}_num`]}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [`${q.id}_num`]: e.target.value,
                  })
                }
                disabled={showResults}
                className={`cursor-pointer absolute top-0 right-0 bg-white text-black w-10 h-10 rounded-md font-bold text-lg shadow-md border-2 ${
                  showResults
                    ? answers[`${q.id}_num`] === CORRECT_F_NUM[`${q.id}_num`]
                      ? "border-gray-300"
                      : "border-red-500"
                    : "border-blue-500"
                }`}
              >
                <option value="">-</option>
                {QUESTIONS.map((opt) => (
                  <option key={opt.id} value={opt.num}>
                    {opt.num}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="space-y-4 max-w-full">
          {QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="flex items-center text-lg p-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <span className="font-bold text-blue-800 w-8 text-2xl">
                {q.num}
              </span>

              <div className="flex-1 flex items-center flex-wrap">
                <span className="text-gray-700 text-2xl">{q.prefix}</span>

                <div className="relative inline-block mx-2">
                  {/* ❌ للكلمات داخل الجمل */}
                  {showResults &&
                    answers[q.id] &&
                    answers[q.id] !== CORRECT_F[q.id] && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow z-10">
                        ✕
                      </div>
                    )}

                  <select
                    value={answers[q.id]}
                    onChange={(e) =>
                      setAnswers({ ...answers, [q.id]: e.target.value })
                    }
                    disabled={showResults}
                    className={`cursor-pointer p-1 border-b-2 bg-transparent focus:outline-none transition-all font-bold ${
                      showResults
                        ? answers[q.id] === CORRECT_F[q.id]
                          ? "border-gray-300"
                          : "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">...</option>
                    {OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-gray-700 text-2xl">{q.suffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={() => {
              setAnswers({ ...CORRECT_F, ...CORRECT_F_NUM });
              setShowResults(true);
            }}
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit10_Page60_Q1;