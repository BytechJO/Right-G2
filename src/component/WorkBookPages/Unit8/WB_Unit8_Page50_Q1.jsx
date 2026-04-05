import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/p50q1.mp3";

import imgElephant from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 1.svg";
import imgTube from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 2.svg";
import imgGlue from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 3.svg";
import imgBlue from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 4.svg";
import imgCube from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 5.svg";
import imgTune from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 50/Ex A 6.svg";

const CORRECT_A = {
  q1_1: "u",
  q1_2: "e",
  q2_1: "u",
  q2_2: "e",
  q3_1: "u",
  q3_2: "e",
  q4_1: "u",
  q4_2: "e",
  q5_1: "u",
  q5_2: "e",
  q6_1: "u",
  q6_2: "e",
};

const OPTIONS = ["u", "e", "o", "a", "i"];

const WORD_PARTS = [
  { before: "h", middle: "g", after: "" },
  { before: "t", middle: "b", after: "" },
  { before: "gl", middle: "", after: "" },
  { before: "bl", middle: "", after: "" },
  { before: "c", middle: "b", after: "" },
  { before: "t", middle: "n", after: "" },
];

const IMGS = [imgElephant, imgTube, imgGlue, imgBlue, imgCube, imgTune];

const INITIAL_STATE = {
  q1_1: "",
  q1_2: "",
  q2_1: "",
  q2_2: "",
  q3_1: "",
  q3_2: "",
  q4_1: "",
  q4_2: "",
  q5_1: "",
  q5_2: "",
  q6_1: "",
  q6_2: "",
};

const WB_Unit8_Page50_Q1 = () => {
  const [answers, setAnswers] = useState({ ...INITIAL_STATE });
  const [showResults, setShowResults] = useState(false);

  const checkAnswers = () => {
    const allKeys = Object.keys(INITIAL_STATE);
    const unanswered = allKeys.filter((k) => !answers[k]);
    if (unanswered.length > 0) {
      ValidationAlert.info();
      return;
    }

    setShowResults(true); // 👈 مهم

    let score = 0;
    const total = allKeys.length;
    allKeys.forEach((k) => {
      if (answers[k] === CORRECT_A[k]) score++;
    });

    const msg = `Score: ${score} / ${total}`;
    if (score === total) ValidationAlert.success(msg);
    else if (score > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleReset = () => {
    setAnswers({ ...INITIAL_STATE });
    setShowResults(false);
  };
  const captions = [
    { start: 0.56, end: 3.18, text: "Page 50, Phonics Exercise A." },

    { start: 4.34, end: 6.34, text: "Listen and write the missing letters." },

    { start: 7.46, end: 9.32, text: "1.huge." },
    { start: 10.22, end: 12.14, text: "2.tube." },

    { start: 13.2, end: 15.21, text: "3.glue" },
    { start: 16, end: 18, text: "4.blue." },

    { start: 18.78, end: 21.39, text: "5.cube." },
    { start: 22, end: 23.96, text: "6.tune." },
  ];

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "10px", marginBottom: "50px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span> Listen and write the missing
          letters.
        </h1>
        <QuestionAudioPlayer src={sound} captions={captions} stopAtSecond={6.35} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((num, idx) => {
            const parts = WORD_PARTS[idx];
            const key1 = `q${num}_1`;
            const key2 = `q${num}_2`;

            return (
              <div key={num} className="flex flex-col items-center gap-3 p-4">
                <div className="flex gap-4 justify-center items-center">
                  <span className="self-start font-bold text-blue-900 text-lg">
                    {num}
                  </span>
                  <img
                    src={IMGS[idx]}
                    alt="phonics"
                    className="max-w-50 max-h-40 object-contain"
                  />
                </div>

                <div className="flex items-center gap-2 text-xl font-bold text-gray-600">
                  <span>{parts.before}</span>

                  {/* select 1 */}
                  <div className="relative">
                    <select
                      value={answers[key1]}
                      onChange={(e) =>
                        setAnswers({ ...answers, [key1]: e.target.value })
                      }
                      className="border-b-2 cursor-pointer pr-6"
                    >
                      <option value=""></option>
                      {OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {showResults &&
                      answers[key1] &&
                      answers[key1] !== CORRECT_A[key1] && (
                        <span className="absolute right-0 top-3 -translate-y-1/2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
                          ✕
                        </span>
                      )}
                  </div>

                  {parts.middle && <span>{parts.middle}</span>}

                  {/* select 2 */}
                  <div className="relative">
                    <select
                      value={answers[key2]}
                      onChange={(e) =>
                        setAnswers({ ...answers, [key2]: e.target.value })
                      }
                      className="border-b-2 cursor-pointer pr-6"
                    >
                      <option value=""></option>
                      {OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    {showResults &&
                      answers[key2] &&
                      answers[key2] !== CORRECT_A[key2] && (
                        <span className="absolute right-0 top-3 -translate-y-1/2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
                          ✕
                        </span>
                      )}
                  </div>

                  {parts.after && <span>{parts.after}</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={() => {
              setAnswers({ ...CORRECT_A });
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

export default WB_Unit8_Page50_Q1;
