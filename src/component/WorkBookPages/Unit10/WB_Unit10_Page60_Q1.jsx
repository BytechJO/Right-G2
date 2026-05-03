import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import imgRun from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 1.svg";
import imgDrink from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 2.svg";
import imgListen from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 3.svg";
import imgWatch from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 4.svg";
import imgWork from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 5.svg";

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

  const CORRECT_F_NUM = {
    q1_num: "3",
    q2_num: "1",
    q3_num: "4",
    q4_num: "5",
    q5_num: "2",
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

  // ⭐ positions لكل صورة (عدليهم حسب مكان المربع الأبيض)
  const positions = {
    q1: { top: "15%", left: "88%" },
    q2: { top: "15%", left: "88%" },
    q3: { top: "15%", left: "88%" },
    q4: { top: "15%", left: "88%" },
    q5: { top: "15%", left: "89%" },
  };

  const checkAnswers = () => {
    if (showResults) return;

    const unanswered = Object.keys(ALL_CORRECT).filter((id) => !answers[id]);

    if (unanswered.length > 0) {
      ValidationAlert.info("Please complete all answers!");
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
      <div className="div-forall" style={{ gap: "35px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">F</span>Complete. Look and match.
        </h1>

        <div className="flex flex-col gap-5">
          {/* ⭐ الصور */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {QUESTIONS.map((q) => {
              const pos = positions[q.id];

              return (
                <div key={q.id} className="relative">
                  <div className="relative w-fit">
                    <img
                      src={q.img}
                      alt="activity"
                      className="object-contain"
                      style={{height:"120px"}}
                    />

                    {/* ⭐ select داخل الصورة */}
                    <div
                      className="absolute"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <select
                        value={answers[`${q.id}_num`]}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [`${q.id}_num`]: e.target.value,
                          })
                        }
                        disabled={showResults}
                        className={`text-center w-7 rounded-md font-bold
                          focus:outline-none focus:ring-0
                          ${
                            showResults
                              ? answers[`${q.id}_num`] ===
                                CORRECT_F_NUM[`${q.id}_num`]
                                ? "border-gray-300"
                                : "border-red-500"
                              : "border-blue-900"
                          }`}
                      >
                        <option value=""></option>
                        {QUESTIONS.map((opt) => (
                          <option key={opt.id} value={opt.num}>
                            {opt.num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* الجمل */}
          <div className="space-y-4 max-w-full">
            {QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="flex items-center text-lg p-2 rounded-lg hover:bg-gray-50"
              >
                <span className="font-bold text-blue-800 w-8 text-2xl">
                  {q.num}
                </span>

                <div className="flex-1 flex items-center flex-wrap">
                  <span className="text-gray-700 text-2xl">{q.prefix}</span>

                  <div className="relative inline-block mx-2">
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
                      className={`p-1 border-b-2 bg-transparent font-bold
                        focus:outline-none focus:ring-0
                        ${
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