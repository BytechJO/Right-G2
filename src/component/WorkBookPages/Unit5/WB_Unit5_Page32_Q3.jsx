// ExerciseC.jsx

import { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex C 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex C 2.svg";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
const wordBank = [
  "bee",
  "leaf",
  "sheep",
  "sleep",
  "tree",
  "meat",
  "beach",
  "read",
];

const correctAnswers = {
  feet: ["bee", "sheep", "sleep", "tree"],
  beak: ["leaf", "meat", "beach", "read"],
};

const DraggableWord = ({ word, source, disabled, className }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${word}-${source}`,
    data: {
      word,
      source,
    },
    disabled,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px,${transform.y}px,0)`
      : undefined,
    touchAction: "none",
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={className}
    >
      {word}
    </button>
  );
};

const DropZone = ({ id, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className}
      ${isOver ? "bg-blue-50" : ""}
    `}
    >
      {children}
    </div>
  );
};

export default function WB_Unit5_Page32_Q3() {
  const [columns, setColumns] = useState({ feet: [], beak: [] });
  // const [remaining, setRemaining] = useState([...wordBank]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const [activeItem, setActiveItem] = useState(null);
  const addWordToColumn = (col, word) => {
    if (showResult) return;
    if (!word) return;

    setColumns((prev) => {
      if (prev[col].includes(word)) return prev;
      return {
        ...prev,
        [col]: [...prev[col], word],
      };
    });
  };

  const moveWordBetweenColumns = (fromCol, toCol, word) => {
    if (showResult) return;
    if (!word || fromCol === toCol) return;

    setColumns((prev) => {
      if (prev[toCol].includes(word)) return prev;

      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((w) => w !== word),
        [toCol]: [...prev[toCol], word],
      };
    });
  };

  const returnWordToBank = (fromCol, word) => {
    if (showResult) return;
    if (!word) return;

    setColumns((prev) => ({
      ...prev,
      [fromCol]: prev[fromCol].filter((w) => w !== word),
    }));
  };

  const handleDndStart = (event) => {
    setActiveItem(event.active.data.current);
  };

  const handleDndEnd = (event) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over || showResult) return;

    const { word, source } = active.data.current;

    const target = over.id;

    // للبنك
    if (target === "bank") {
      if (source === "feet" || source === "beak") {
        returnWordToBank(source, word);
      }
      return;
    }

    // من البنك للعمود
    if (source === "bank") {
      addWordToColumn(target, word);
      return;
    }

    // بين الأعمدة
    if (source === "feet" || source === "beak") {
      moveWordBetweenColumns(source, target, word);
    }
  };
  const checkAnswers = () => {
    if (showResult) return;

    const totalPlaced = columns.feet.length + columns.beak.length;

    if (totalPlaced < wordBank.length) {
      ValidationAlert.info(
        "Please place all words before checking your answers.",
      );
      return;
    }

    let correct = 0;
    let total = wordBank.length;

    ["feet", "beak"].forEach((col) => {
      columns[col].forEach((word) => {
        if (correctAnswers[col].includes(word)) {
          correct++;
        }
      });
    });

    setScore(correct);
    setShowResult(true);

    if (correct === total) {
      return ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct === 0) {
      return ValidationAlert.error(`Score: ${correct}/${total}`);
    } else {
      return ValidationAlert.warning(`Score: ${correct}/${total}`);
    }
  };

  const handleShowAnswer = () => {
    setShowResult(true);
    setColumns({
      feet: [...correctAnswers.feet],
      beak: [...correctAnswers.beak],
    });
    setRemaining([]);

    setScore(2);
  };

  const handleStartAgain = () => {
    setColumns({ feet: [], beak: [] });
    setShowResult(false);
    setScore(null);
   setActiveItem(null);
    setResetKey((k) => k + 1);
  };
  const isWordWrong = (col, word) => {
    if (!showResult) return false;

    return !correctAnswers[col].includes(word);
  };
  const isWordUsed = (word) => {
    return columns.feet.includes(word) || columns.beak.includes(word);
  };
  const getWordClass = (col, word) => {
    const base =
      "px-3 py-2 rounded-lg text-lg font-semibold cursor-move transition-all border-2 ";

    if (!showResult) {
      return base + "border-blue-900 hover:bg-blue-100";
    }

    const isCorrect = correctAnswers[col].includes(word);

    return (
      base +
      (isCorrect
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-blue-500 text-white border-red-500") // 🔴 غلط
    );
  };

  const getColClass = (col) => {
    const base =
      "border-2 border-dashed border-gray-300 rounded-xl p-4 min-h-[160px] transition-all";

    if (!showResult) {
      return base + "border-gray-300 bg-white hover:border-blue-400";
    }

    const userSorted = [...columns[col]].sort().join(",");
    const rightSorted = [...correctAnswers[col]].sort().join(",");

    return userSorted === rightSorted
      ? base + "border-gray-300 bg-white"
      : base + "border-gray-300 bg-white";
  };

  return (
    <DndContext onDragStart={handleDndStart} onDragEnd={handleDndEnd}>
      <div key={resetKey} className="main-container-component">
        <div className="div-forall" style={{ gap: "40px" }}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">C</span> Write the words in the correct
            column.
          </h1>

          {/* Word Bank */}
          <div>
            <DropZone
              id="bank"
              className="flex flex-wrap gap-3 p-4 rounded-xl min-h-[80px] justify-between"
            >
              {wordBank.map((word) => {
                const used = isWordUsed(word);

                return (
                  <DraggableWord
                    word={word}
                    source="bank"
                    disabled={showResult || used}
                    className={`WB-word-bank
  ${
    used
      ? "bg-gray-100 text-gray-400 opacity-60"
      : "bg-white border-gray-300 hover:bg-blue-50"
  }`}
                  />
                );
              })}
            </DropZone>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {[
              { key: "feet", img: img1 },
              { key: "beak", img: img2 },
            ].map((col, id) => (
              <div key={id}>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={col.img}
                    alt={col.key}
                    style={{ height: "120px" }}
                  />

                  <span className="font-bold text-gray-700 text-xl">
                    {col.key}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({col.key === "feet" ? "ee" : "ea"})
                  </span>
                </div>

                <DropZone id={col.key} className={getColClass(col.key)}>
                  <div className="flex flex-wrap gap-2">
                    {columns[col.key].map((word) => (
                      <div key={word} className="relative">
                        <DraggableWord
                          word={word}
                          source={col.key}
                          disabled={showResult}
                          className={getWordClass(col.key, word)}
                        />

                        {/* ✕ فوق الكلمة الغلط */}
                        {isWordWrong(col.key, word) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow border-2 border-white">
                            <span className="text-white text-sm font-bold">
                              ✕
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {columns[col.key].length === 0 && (
                    <div className="text-gray-400 text-sm mt-2">
                      Drag words here
                    </div>
                  )}
                </DropZone>
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
      <DragOverlay>
        {activeItem ? (
          <div className="WB-word-bank px-4 py-2 bg-white shadow-lg">
            {activeItem.word}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
