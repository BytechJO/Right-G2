// ExerciseA.jsx — Look, listen, and write (Select version)

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound from "../../../assets/audio/WorkBook/p56q1.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 56/Ex A 6.svg";

import {
  DndContext,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay,
} from "@dnd-kit/core";
const questions = [
  { id: 1, src: img1, correct: "cap" },
  { id: 2, src: img2, correct: "game" },
  { id: 3, src: img3, correct: "may" },
  { id: 4, src: img4, correct: "sad" },
  { id: 5, src: img5, correct: "pain" },
  { id: 6, src: img6, correct: "man" },
];

const wordBank = ["game","cap", "pain",  "sad", "man", "may"];

const correctAnswers = {
  1: "cap",
  2: "game",
  3: "may",
  4: "sad",
  5: "pain",
  6: "man",
};

const DraggableWord = ({ word, disabled }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    data: { word },
    disabled,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{style ,padding:"5px 22px"}}
      className={`WB-word-bank touch-none
        ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white cursor-grab hover:bg-blue-50 border-blue-900"
        }
      `}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, value, correct, showResult }) => {
  const { setNodeRef } = useDroppable({ id: `${id}` });

  const isWrong = showResult && value && value !== correct;

  return (
    <div
      ref={setNodeRef}
      className="relative w-full text-center border-b-2 border-gray-400 pb-1 min-h-[28px]"
    >
      {value ? (
        <span className="font-bold text-base text-blue-900">{value}</span>
      ) : (
        <span className="text-gray-300 text-sm">_ _ _</span>
      )}

      {isWrong && (
        <span className="absolute -top-2 right-0 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
          ✕
        </span>
      )}
    </div>
  );
};

export default function ExerciseA() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const [activeWord, setActiveWord] = useState(null);
  // الكلمات المستخدمة (عشان ما تنتخب نفس الكلمة لسؤالين)
  const usedWords = Object.values(answers);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || showResult) return;

    const word = active.data.current.word;
    const id = Number(over.id);

    setAnswers((prev) => {
      const updated = { ...prev };

      // 🔁 remove from old place
      Object.keys(updated).forEach((key) => {
        if (updated[key] === word) {
          delete updated[key];
        }
      });

      updated[id] = word;
      return updated;
    });
  };
  const checkAnswers = () => {
    if (showResult) return;
    if (Object.keys(answers).length < questions.length) {
      ValidationAlert.info("Please answer all questions before checking.");
      return;
    }
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });
    setScore(correct);
    setShowResult(true);
    if (correct === questions.length) {
      ValidationAlert.success(`Score: ${correct}/${questions.length}`);
    } else if (correct > 0) {
      ValidationAlert.warning(`Score: ${correct}/${questions.length}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    }
  };

  const handleShowAnswer = () => {
    setAnswers({ ...correctAnswers });
    setShowResult(true);
    setScore(questions.length);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResult(false);
    setScore(null);
    setResetKey((k) => k + 1);
  };

  const getCardClass = (qId) => {
    if (!showResult || !answers[qId])
      return "rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-transparent";
    return answers[qId] === correctAnswers[qId]
      ? "rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-gray-400"
      : "rounded-2xl p-4 flex flex-col items-center gap-3 border-2 border-red-400";
  };
  const captions = [
    {
      start: 0.6,
      end: 3.38,
      text: "Page 56, phonics exercise A.",
    },
    {
      start: 4.24,
      end: 6,
      text: "Look, listen, and write.",
    },
    {
      start: 6.5,
      end: 8.56,
      text: "1.cap.",
    },
    {
      start: 9.72,
      end: 11.6,
      text: "2.game.",
    },
    {
      start: 11.7,
      end: 14.1,
      text: "3.may.",
    },
    { start: 14.8, end: 16.88, text: "4.sad." },
    { start: 17.9, end: 20.04, text: "5.pain." },
    { start: 21.1, end: 22.96, text: "6.man." },
  ];
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveWord(active.data.current.word)}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setActiveWord(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"25px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">A</span>Look, listen, and write.
          </h1>
   <QuestionAudioPlayer
            src={sound}
            captions={captions}
            stopAtSecond={6.1}
          />
          <div className="flex flex-col gap-5">
          <div className="flex flex-wrap justify-center gap-8 rounded-lg p-4">
            {wordBank.map((word) => {
              const isUsed = usedWords.includes(word);

              return (
                <DraggableWord
                  key={word}
                  word={word}
                  disabled={isUsed || showResult}
                />
              );
            })}
          </div>
       
          {/* Questions grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {questions.map((q) => (
              <div key={q.id} className={getCardClass(q.id)}>
                {/* Number */}
                <span className="text-xl font-bold text-blue-900 self-start">
                  {q.id}
                </span>

                <img
                  src={q.src}
                  alt=""
                  srcset=""
                  className="max-w-24 max-h-24"
                />

                {/* Answer line */}
                <DropZone
                  id={q.id}
                  value={answers[q.id]}
                  correct={correctAnswers[q.id]}
                  showResult={showResult}
                />
              </div>
            ))}
          </div>
</div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DndContext>
  );
}
