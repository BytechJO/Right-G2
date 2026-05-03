import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import sound from "../../../assets/audio/WorkBook/p44q1.mp3";
import boatImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 1.svg";
import snowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 2.svg";
import examImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 3.svg";
import bowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex A 4.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import trueIcon from "../../../assets/imgs/true.svg";
const exerciseAData = [
  { id: 1, image: boatImg, options: ["o-e", "oa", "ow"], correct: "oa" },
  { id: 2, image: snowImg, options: ["o-e", "oa", "ow"], correct: "ow" },
  { id: 3, image: examImg, options: ["ow", "oa", "o-e"], correct: "o-e" },
  { id: 4, image: bowImg, options: ["ow", "oa", "o-e"], correct: "ow" },
];

const WB_Unit7_Page44_Q1 = () => {
  const [answersA, setAnswersA] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleSelectA = (id, option) => {
    if (checked || locked) return;
    setAnswersA((prev) => ({ ...prev, [id]: option }));
  };
  const areAllAnswered = () => {
    return Object.values(answersA).every((val) => val !== null);
  };
  const checkAnswers = () => {
    if (checked || locked) return;

    // 🔴 الفاليديشن
    if (!areAllAnswered()) {
      ValidationAlert.info("Please answer all questions first!");
      return;
    }

    let correctA = 0;
    exerciseAData.forEach((item) => {
      if (answersA[item.id] === item.correct) correctA++;
    });

    setChecked(true);
    setLocked(true);

    if (correctA === exerciseAData.length) {
      ValidationAlert.success(`Score: ${correctA}/${exerciseAData.length}`);
    } else if (correctA > 0) {
      ValidationAlert.warning(`Score: ${correctA}/${exerciseAData.length}`);
    } else {
      ValidationAlert.error(`Score: ${correctA}/${exerciseAData.length}`);
    }
  };

  const handleShowAnswer = () => {
    const correctA = {};
    exerciseAData.forEach((item) => (correctA[item.id] = item.correct));
    setAnswersA(correctA);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setAnswersA({ 1: null, 2: null, 3: null, 4: null });
    setChecked(false);
    setLocked(false);
  };

  const stopAtSecond = 6.15;

  const captions = [
    {
      start: 0,
      end: 3.48,
      text: "Page 44, phonics exercise A.",
    },
    {
      start: 3.5,
      end: 6.14,
      text: "Listen and write ✓.",
    },
    { start: 6.3, end: 7.12, text: "Boat." },
    { start: 7.5, end: 8.89, text: "snow." },
    { start: 10.16, end: 10.56, text: "note." },
    { start: 11.76, end: 12.24, text: "bow." },
  ];

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h2 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>
          Listen and write <span className="text-blue-900">✓</span>.
        </h2>
        <div className="flex flex-col gap-5">
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
          {exerciseAData.map((item) => (
            <div key={item.id} className="flex items-center gap-10 p-3">
              <div className="w-[120px] h-[100px] flex items-center justify-center">
                <img
                  src={item.image}
                  className="object-contain"
                  style={{ height: "120px" }}
                />
              </div>
              <div className="flex flex-col gap-3">
                {item.options.map((opt) => {
                  const isSelected = answersA[item.id] === opt;
                  const isWrong = checked && isSelected && opt !== item.correct;

                  return (
                    <div key={opt} className="flex items-center gap-4">
                      <span className="w-10 text-right font-bold text-lg text-gray-700">
                        {opt}
                      </span>

                      <div className="relative">
                        <div
                          onClick={() => handleSelectA(item.id, opt)}
                          className={`w-10 h-10 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all
  ${
    isWrong
      ? "border-red-500"
      : isSelected
        ? "border-blue-900"
        : "border-gray-400 hover:border-blue-900"
  }
`}
                        >
                          {isSelected && (
                            <span className="text-2xl font-bold text-blue-600">
                              <img src={trueIcon} style={{ height: "25px" }} />
                            </span>
                          )}
                        </div>

                        {/* ❌ Wrong Icon */}
                        {isWrong && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
</div>
        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit7_Page44_Q1;
