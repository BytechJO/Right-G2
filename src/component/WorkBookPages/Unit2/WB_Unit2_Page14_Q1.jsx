import React, { useState, useRef, useEffect } from "react";
import { Volume2 } from "lucide-react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/p14Q1.mp3";
import clockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 1.svg";
import brickImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 2.svg";
import candyImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 3.svg";
import sockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 4.svg";
import lockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 5.svg";
import foxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 6.svg";
import mugImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 7.svg";
import featherImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 8.svg";
import queenImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 9.svg";
import boxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 10.svg";
import catImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 12.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer"
const listenQuestions = [
  {
    id: "q1",
    audioSrc: "/audio/clock.mp3",
    options: [
      { id: "opt1_1", img: clockImg, isCorrect: true },
      { id: "opt1_2", img: brickImg, isCorrect: false },
      { id: "opt1_3", img: candyImg, isCorrect: false },
    ],
  },
  {
    id: "q2",
    audioSrc: "/audio/fox.mp3",
    options: [
      { id: "opt2_1", img: sockImg, isCorrect: false },
      { id: "opt2_2", img: lockImg, isCorrect: false },
      { id: "opt2_3", img: foxImg, isCorrect: true },
    ],
  },
  {
    id: "q3",
    audioSrc: "/audio/queen.mp3",
    options: [
      { id: "opt3_1", img: mugImg, isCorrect: false },
      { id: "opt3_2", img: featherImg, isCorrect: false },
      { id: "opt3_3", img: queenImg, isCorrect: true },
    ],
  },
  {
    id: "q4",
    audioSrc: "/audio/queen.mp3",
    options: [
      { id: "opt4_1", img: boxImg, isCorrect: false },
      { id: "opt4_2", img: brickImg, isCorrect: false },
      { id: "opt4_3", img: catImg, isCorrect: true },
    ],
  },
];

const WB_Unit2_Page14_Q1 = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const stopAtSecond = 6.35;


  const handleSelectOption = (questionId, optionId) => {
    if (showResults) return;
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
    setShowResults(false);
  };

  const getCircleClass = (questionId, option) => {
    const isSelected = selectedOptions[questionId] === option.id;
    if (!isSelected) return "border-transparent";

    if (showResults) {
      return option.isCorrect ? "border-gray-500" : "border-gray-500";
    }

    return "border-blue-500";
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    listenQuestions.forEach((q) => {
      const correctOption = q.options.find((opt) => opt.isCorrect);
      if (correctOption) correctAnswers[q.id] = correctOption.id;
    });
    setSelectedOptions(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelectedOptions({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    if (Object.keys(selectedOptions).length < listenQuestions.length) {
      ValidationAlert.info("Please answer all questions before checking.");
      return;
    }
    setShowResults(true);
    let correctCount = 0;
    listenQuestions.forEach((q) => {
      const selectedId = selectedOptions[q.id];
      const selectedOption = q.options.find((opt) => opt.id === selectedId);
      if (selectedOption?.isCorrect) correctCount++;
    });
    if (correctCount === listenQuestions.length) {
      ValidationAlert.success(
        `Score: ${correctCount}/${listenQuestions.length}`,
      );
    } else if (correctCount > 0) {
      ValidationAlert.warning(
        `Score: ${correctCount}/${listenQuestions.length}`,
      );
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${listenQuestions.length}`);
    }
  };

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 6.34,
      text: "Page 14, phonics exercise A. Listen, look, and circle.",
    },
    { start: 7.52, end: 9, text: "1-clock." },
    { start: 9.5, end: 11.64, text: "2-fox." },
    { start: 12, end: 13.6, text: "3-queen." },
    { start: 14.5, end: 16.8, text: "4-cat." },
  ];



  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"45px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">A</span>Listen, look, and circle.
        </h1>
       
   
          <QuestionAudioPlayer src={sound} captions={captions} stopAtSecond={stopAtSecond}/>
        <div className="grid grid-cols-2 gap-15">
          {listenQuestions.map((question, index) => (
            <div key={question.id} className="flex items-center gap-4">
              <span className="font-bold text-blue-600 text-xl">
                {index + 1}
              </span>
              <div className="flex-1 grid grid-cols-3 gap-4">
                {question.options.map((option) => (
                  <div className="relative w-24">
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(question.id, option.id)}
                      className={`w-24 h-24 rounded-full border-4 cursor-pointer overflow-hidden transition-colors ${getCircleClass(question.id, option)}`}
                    >
                      <div
                        className="w-20 h-20 overflow-hidden bg-center bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${option.img})` }}
                      />
                    </div>{" "}
                    {showResults &&
                      selectedOptions[question.id] === option.id &&
                      !option.isCorrect && (
                        <div className="absolute -top-2 right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>
                ))}
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

export default WB_Unit2_Page14_Q1;
