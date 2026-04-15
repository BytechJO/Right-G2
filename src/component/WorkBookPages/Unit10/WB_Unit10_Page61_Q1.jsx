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
  { id: 3, subject: "She", correct: "She is making." },
  { id: 4, subject: "She", correct: "She is reading" },
  { id: 5, subject: "He", correct: "He is drawing." },
  { id: 6, subject: "He", correct: "He is searching." },
];

const correctAnswers = {
  1: "writing",
  2: "searching",
  3: "making",
  4: "watching",
  5: "drawing",
  6: "reading",
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
      className={`px-4 py-2 rounded-lg border-2 font-semibold touch-none
        ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white cursor-grab hover:bg-blue-50 border-blue-500 text-blue-700"
        }
      `}
    >
      {word}
    </div>
  );
};

const DropZone = ({ id, value, correct, showResult, subject }) => {
  const { setNodeRef } = useDroppable({ id: `${id}` });

  const isWrong = showResult && value && value !== correct;

  return (
    <div
      ref={setNodeRef}
      className={`relative border-b-2 pb-1 mb-3 min-h-[38px] flex items-center gap-1
        ${!showResult || !value ? "border-gray-300" : ""}
        ${showResult && value === correct ? "border-gray-400" : ""}
        ${isWrong ? "border-red-500" : ""}
      `}
    >
      {isWrong && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      <span className="text-gray-700 text-lg font-semibold">{subject} is</span>

      {value && (
        <span className="font-bold text-lg ml-1 text-blue-600">{value}.</span>
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
        <div className="div-forall" style={{ gap: "10px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">H</span>Look and write sentences.
          </h1>

          <div className="max-w-full max-h-48 flex items-center justify-center mb-6 text-gray-400 text-sm">
            <img src={img} alt="exercise" style={{ height: "240px" }} />
          </div>

          {/* Global Word Bank */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 shadow-sm">
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
                <span className="text-blue-600 font-bold w-5 shrink-0 pt-2">
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
          <DragOverlay>
            {activeWord && (
              <div className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg shadow-xl font-semibold">
                {activeWord}
              </div>
            )}
          </DragOverlay>
          <div className="mt-18">
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
