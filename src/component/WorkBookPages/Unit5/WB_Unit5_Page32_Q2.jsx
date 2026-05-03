// ExerciseB.jsx

import { useState, useEffect, useRef } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound from "../../../assets/audio/WorkBook/p32q2.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 12.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const questions = [
  {
    id: 1,
    word: "bee",
    sound: "ee",
    options: [
      { src: img1, label: "bed" },
      { src: img2, label: "meat" },
      { src: img3, label: "sleep" },
    ],
    correct: [1, 2],
  },
  {
    id: 2,
    word: "tree",
    sound: "ee",
    options: [
      { src: img4, label: "bread" },
      { src: img5, label: "green" },
      { src: img6, label: "feet" },
    ],
    correct: [2],
  },
  {
    id: 3,
    word: "bread",
    sound: "ea",
    options: [
      { src: img7, label: "sleep" },
      { src: img8, label: "bee" },
      { src: img9, label: "green" },
    ],
    correct: [2], // هذا السؤال لا يوجد له إجابة صحيحة
  },
  {
    id: 4,
    word: "meat",
    sound: "ea",
    options: [
      { src: img10, label: "feet" },
      { src: img11, label: "sheep" },
      { src: img12, label: "bread" },
    ],
    correct: [0,1],
  },
];

export default function WB_Unit5_Page32_Q2() {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const stopAtSecond = 9;

  const captions = [
    {
      start: 0.58,
      end: 3.26,
      text: "Page 32, Phonics Exercise B. ",
    },
    {
      start: 4.46,
      end: 8.26,
      text: "Listen and circle the pictures that have the same vowel sound.",
    },
    { start: 9.44, end: 10.88, text: "1.bee" },

    { start: 12.14, end: 16.8, text: "bed, meat, sleep." },

    { start: 16.9, end: 18.22, text: "2.tree" },

    { start: 18.14, end: 20.22, text: "bread, thread, feet." },

    { start: 21.34, end: 23.28, text: "3.bread" },

    { start: 24.42, end: 30.06, text: "sleep, bee, thread." },

    { start: 30, end: 31.34, text: "4.meat" },

    { start: 31.28, end: 33.34, text: "feet, sheep, bread." },
  ];

  const toggle = (qId, idx) => {
    if (showResult) return;

    setSelected((prev) => {
      const cur = prev[qId] || [];

      // إذا مختارة → احذفها
      if (cur.includes(idx)) {
        return {
          ...prev,
          [qId]: cur.filter((i) => i !== idx),
        };
      }

      // ❌ لا تسمح بأكثر من صورتين
      if (cur.length >= 2) {
        return prev;
      }

      return {
        ...prev,
        [qId]: [...cur, idx],
      };
    });
  };
  const checkAnswers = () => {
    if (showResult) return;

    let correct = 0;

    questions.forEach((q) => {
      const userSel = [...(selected[q.id] || [])].sort().join(",");
      const rightSel = [...q.correct].sort().join(",");

      if (userSel === rightSel) correct++;
    });

    setScore(correct);
    setShowResult(true);

    if (correct === questions.length) {
      return ValidationAlert.success(`Score: ${correct}/${questions.length}`);
    } else if (correct === 0) {
      return ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    } else {
      return ValidationAlert.warning(`Score: ${correct}/${questions.length}`);
    }
  };
  const handleShowAnswer = () => {
    const all = {};
    questions.forEach((q) => {
      all[q.id] = [...q.correct];
    });
    setSelected(all);
    setShowResult(true);
    setScore(questions.length);
  };

  const handleStartAgain = () => {
    setSelected({});
    setShowResult(false);
    setScore(null);
    // setResetKey((k) => k + 1);
  };

  const getCellClass = (qId, idx) => {
    const isSelected = (selected[qId] || []).includes(idx);
    const q = questions.find((x) => x.id === qId);
    const isCorrectOption = q.correct.includes(idx);

    if (!isSelected) {
      return "cursor-pointer rounded-xl p-2 border-2 border-transparent hover:border-blue-900 transition-all";
    }

    if (!showResult) {
      return "cursor-pointer rounded-xl p-2 border-2 border-blue-900 bg-blue-50";
    }

    return isCorrectOption
      ? "cursor-pointer rounded-xl p-2 border-2 border-blue-900 bg-blue-50"
      : "cursor-pointer rounded-xl p-2 border-2 border-red-500";
  };

  const isRowIncorrect = (q) => {
    if (!showResult) return false;

    const userSel = [...(selected[q.id] || [])].sort().join(",");
    const rightSel = [...q.correct].sort().join(",");

    return userSel !== rightSel;
  };
  const isOptionWrong = (q, idx) => {
    if (!showResult) return false;

    const isSelected = (selected[q.id] || []).includes(idx);
    const isCorrect = q.correct.includes(idx);

    return isSelected && !isCorrect;
  };
  return (
    <div key={resetKey} className="main-container-component">
      <div className="div-forall mb-10"  style={{gap:"30px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span> Listen and circle the pictures that
          have the same
          <span className="text-blue-900 font-bold"> vowel sound</span>.
        </h1>

        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />
        <div className="rounded-xl overflow-hidden border border-gray-200 mb-6">
          {questions.map((q, qi) => (
            <div
              key={q.id}
              className={`relative flex items-center gap-2 px-4 py-0 ${
                qi % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {isRowIncorrect(q) && (
                <div className="absolute top-8 left-16 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                  <span className="text-white text-sm font-bold">✕</span>
                </div>
              )}

              <div className="w-20 shrink-0">
                <span className="text-blue-900 text-xl font-bold mr-2">{q.id}</span>
                <span className="font-semibold text-gray-700 text-xl">{q.word}</span>
              </div>

              <div className="flex flex-1 justify-around">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggle(q.id, idx)}
                    className={`relative ${getCellClass(q.id, idx)}`}
                  >
                    <img
                      src={opt.src}
                      style={{ height: "80px", width: "120px" }}
                      alt={opt.label}
                    />

                    {/* ✕ فوق الصورة الغلط */}
                    {isOptionWrong(q, idx) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
                        <span className="text-white text-sm font-bold">✕</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}
