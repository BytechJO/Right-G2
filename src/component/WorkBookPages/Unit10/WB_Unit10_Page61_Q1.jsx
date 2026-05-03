// ExerciseH.jsx — Look and write sentences

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 1.svg";
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
const wordBank = [
  "making",
  "searching",
  "writing",
  "watching",
  "drawing",
  "reading",
];

const questions = [
  { id: 1, subject: "She", correct: "She is writing." },
  { id: 2, subject: "She", correct: "She is watching." },
  { id: 3, subject: "He", correct: "He is making." },
  { id: 4, subject: "She", correct: "She is reading" },
  { id: 5, subject: "He", correct: "He is drawing." },
  { id: 6, subject: "He", correct: "He is searching." },
];

const correctAnswers = {
  1: "writing",
  2: "watching",
  3: "making",
  4: "reading",
  5: "drawing",
  6: "searching",
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
      // style={style}
        style={{padding:"9px 22px"}}
      className={`WB-word-bank touch-none
        ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white cursor-grab hover:bg-blue-50 border-blue-900 text-blue-900"
        }
      `}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, value, correct, showResult, subject }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `${id}` });

  const isWrong = showResult && value && value !== correct;

  return (
    <div
      ref={setNodeRef}
      className={`relative border-b-2 pb-1 mb-3 min-h-[38px] flex items-center gap-1 transition-all duration-300
      
      ${!showResult || !value ? "border-gray-300" : ""}
      ${showResult && value === correct ? "border-gray-400" : ""}
      
      // 🔥 hover أثناء السحب
      ${isOver ? "bg-blue-100 scale-105 border-blue-600 shadow-md" : ""}
      
      // ❌ خطأ
      ${isWrong ? "border-red-500 bg-white" : ""}
      `}
    >
      {isWrong && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      <span className="text-gray-900 text-lg font-semibold">
        {subject} is
      </span>



      {value && (
        <span className="font-bold text-lg ml-1 text-blue-900">
          {value}.
        </span>
      )}
    </div>
  );
};
export default function ExerciseH() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [activeWord, setActiveWord] = useState(null);
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
      ValidationAlert.info(
        "Please complete all sentences before checking your answers.",
      );
      return;
    }

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === correctAnswers[q.id]) correct++;
    });

    setScore(correct);
    setShowResult(true);
    const total = questions.length;

    const msg = `Score: ${correct} / ${total}`;
    if (correct === total) ValidationAlert.success(msg);
    else if (correct > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
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
    setSelectedWord(null);
  };

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
        <div className="div-forall"  style={{gap:"35px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">H</span>Look and write sentences.
          </h1>

        <div className="flex flex-col gap-5">
            <img src={img} alt="exercise" style={{ height: "240px" }} />
        
         <div className="flex flex-col gap-5">
          {/* Global Word Bank */}
          <div className="flex flex-wrap justify-center gap-2 rounded-lg p-3">
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

          <div className="space-y-6">
            {/* الجملة الأولى ثابتة */}

            {questions.map((q) => (
              <div key={q.id} className="flex items-start gap-3">
                <span className="text-blue-900 text-xl font-bold w-5 shrink-0 pt-2">
                  {q.id}
                </span>

                <div className="flex-1">
                  <DropZone
                    id={q.id}
                    value={answers[q.id]}
                    correct={correctAnswers[q.id]}
                    showResult={showResult}
                    subject={q.subject}
                  />
                </div>
              </div>
            ))}
          </div>
          </div></div>
          <DragOverlay>
            {activeWord && (
              <div className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl font-semibold">
                {activeWord}
              </div>
            )}
          </DragOverlay>
          <div >
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
