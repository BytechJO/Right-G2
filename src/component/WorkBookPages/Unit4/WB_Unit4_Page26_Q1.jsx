import React, { useState, useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/p26q1.mp3";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page26/Ex A 6.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const exerciseData = [
  {
    id: "a1",
    img: img1,
    word: "rain",
    options: ["ay", "ai"],
    correctAnswer: "ai",
    audioSrc: "/audio/rain.mp3",
  },
  {
    id: "a2",
    img: img2,
    word: "play",
    options: ["a-e", "ay"],
    correctAnswer: "ay",
    audioSrc: "/audio/play.mp3",
  },
  {
    id: "a3",
    img: img3,
    word: "cake",
    options: ["ay", "a-e"],
    correctAnswer: "a-e",
    audioSrc: "/audio/cake.mp3",
  },
  {
    id: "a4",
    img: img4,
    word: "paint",
    options: ["ai", "ay"],
    correctAnswer: "ai",
    audioSrc: "/audio/paint.mp3",
  },
  {
    id: "a5",
    img: img5,
    word: "May",
    options: ["ay", "a-e"],
    correctAnswer: "ay",
    audioSrc: "/audio/may.mp3",
  },
  {
    id: "a6",
    img: img6,
    word: "lake",
    options: ["a-e", "ai"],
    correctAnswer: "a-e",
    audioSrc: "/audio/lake.mp3",
  },
];

const WB_Unit4_Page26_Q1 = () => {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const stopAtSecond = 8;

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 3.7,
      text: "Page 26, phonics, exercise A.  ",
    },
    {
      start: 4.28,
      end: 7.92,
      text: "Listen and circle the correct long A sound.  ",
    },
    { start: 9.06, end: 10.721, text: "1-rain." },
    { start: 10.72, end: 12.08, text: "2-play." },
    { start: 14.38, end: 15.68, text: "3-cake." },
    { start: 16.5, end: 18.49, text: "4-paint." },
    { start: 19.5, end: 21.8, text: "5-may." },
    { start: 22.5, end: 24.92, text: "6-lake." },
  ];

  const handleSelect = (qId, option) => {
    if (showResults) return;
    setSelections((prev) => ({ ...prev, [qId]: option }));
  };

  const getButtonClass = (qId, option) => {
    const isSelected = selections[qId] === option;

    if (isSelected) return "border-blue-900";
    return "border-gray-300 bg-white hover:border-blue-900";
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
    // ✅ تحقق أن كل الأسئلة فيها اختيار
    const hasEmpty = exerciseData.some((q) => !selections[q.id]);

    if (hasEmpty) {
      ValidationAlert.info("Please choose an answer for all questions first.");
      return; // ⛔ وقف
    }

    // ✅ إذا كله مختار → كمل
    setShowResults(true);

    let score = 0;
    exerciseData.forEach((q) => {
      if (selections[q.id] === q.correctAnswer) score++;
    });

    if (score === exerciseData.length)
      ValidationAlert.success(`Score: ${score} / ${exerciseData.length}`);
    else if (score === 0)
      ValidationAlert.error(`Score: ${score} / ${exerciseData.length}`);
    else ValidationAlert.warning(`Score: ${score} / ${exerciseData.length}`);
  };
  const isWrong = (qId, option) => {
    if (!showResults) return false;
    if (!selections[qId]) return false;

    const question = exerciseData.find((q) => q.id === qId);
    return selections[qId] === option && option !== question.correctAnswer;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Listen and circle the correct long a
          sound.
        </h1>

        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-15">
          {exerciseData.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center text-center gap-2"
            >
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-900 text-xl">{index + 1}</span>
                <img
                  src={item.img}
                  alt={item.word}
                  className="object-contain rounded-lg p-1"
                   style={{height:"120px",width:"100px"}}
                />
              </div>
              <div className="flex flex-col justify-center gap-4">
                {item.options.map((opt) => (
                  <div className="relative">
                    <button
                      key={opt}
                      onClick={() => handleSelect(item.id, opt)}
                      className={`w-16 h-10 flex items-center justify-center text-lg font-semibold rounded-full border-2 transition-all ${getButtonClass(item.id, opt)} ${isWrong(item.id, opt) && "border-red-500 bg-white"}`}
                    >
                      {opt}
                    </button>

                    {/* ❌ Wrong Icon */}
                    {isWrong(item.id, opt) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
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

export default WB_Unit4_Page26_Q1;
