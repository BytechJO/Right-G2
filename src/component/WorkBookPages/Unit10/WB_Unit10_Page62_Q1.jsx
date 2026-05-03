import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 62/SVG/Asset 8.svg";

const wordImages = {
  sleep: img1,
  feet: img2,
  ten: img3,
  bed: img4,
  net: img5,
  read: img6,
  bread: img7,
  green: img8,
};

const wordBank = [
  "sleep",
  "feet",
  "ten",
  "bed",
  "net",
  "read",
  "bread",
  "green",
];

const fixedWords = { ee: [], e: [], ea: [] };

const correctAnswers = {
  ee: ["green", "sleep", "feet"],
  e: ["ten", "bed", "net"],
  ea: ["read", "bread"],
};

const columns = [
  { id: "ee", label: "ee" },
  { id: "e", label: "e" },
  { id: "ea", label: "ea" },
];

function DraggableWord({ id, word, disabled, className, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled,
      data: {
        word,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    touchAction: "none",
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      onClick={onClick}
      className={className}
      {...listeners}
      {...attributes}
    >
      {word}
    </button>
  );
}

function DroppableColumn({ id, className, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${id}`,
    data: {
      columnId: id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "border-blue-900 bg-blue-50/60" : ""}`}
    >
      {children}
    </div>
  );
}

export default function WB_Unit10_Page62_Q1() {
  const [placed, setPlaced] = useState({ ee: [], e: [], ea: [] });
  const [showResult, setShowResult] = useState(false);
  const [activeWord, setActiveWord] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 8,
      },
    }),
  );

  const usedWords = Object.values(placed).flat();

  const moveWordToColumn = (word, columnId) => {
    if (!word || !columnId || showResult) return;

    setPlaced((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).map(([key, words]) => [
          key,
          words.filter((item) => item !== word),
        ]),
      );

      updated[columnId] = [...updated[columnId], word];
      return updated;
    });
  };

  const handleDragStart = ({ active }) => {
    setActiveWord(active.data.current?.word || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveWord(null);
    if (!over || showResult) return;

    const draggedWord = active.data.current?.word;
    const targetColumnId = over.data.current?.columnId;

    moveWordToColumn(draggedWord, targetColumnId);
  };

  const handleDragCancel = () => {
    setActiveWord(null);
  };

  const checkAnswers = () => {
    if (showResult) return;

    const totalPlaced = placed.ee.length + placed.e.length + placed.ea.length;

    if (totalPlaced < wordBank.length) {
      ValidationAlert.info(
        "Please place all words before checking your answers.",
      );
      return;
    }

    let correct = 0;

    columns.forEach((col) => {
      const userSorted = [...placed[col.id]].sort().join(",");
      const rightSorted = [...correctAnswers[col.id]].sort().join(",");

      if (userSorted === rightSorted) correct++;
    });

    setShowResult(true);

    const msg = `Score: ${correct} / ${columns.length}`;

    if (correct === columns.length) ValidationAlert.success(msg);
    else if (correct > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };

  const handleShowAnswer = () => {
    setActiveWord(null);
    setPlaced({
      ee: [...correctAnswers.ee],
      e: [...correctAnswers.e],
      ea: [...correctAnswers.ea],
    });
    setShowResult(true);
  };

  const handleStartAgain = () => {
    setActiveWord(null);
    setPlaced({ ee: [], e: [], ea: [] });
    setShowResult(false);
  };

  const getPlacedWordClass = (colId, word) => {
    const base =
      "px-3 py-1 rounded-lg text-lg w-20 font-semibold border-2 transition-all ";

    if (!showResult) {
      return `${base}text-blue border-blue-900 cursor-grab active:cursor-grabbing hover:bg-blue-100`;
    }

    return correctAnswers[colId].includes(word)
      ? `${base}text-blue border-blue-500 cursor-default`
      : `${base}text-blue border-red-400 cursor-default`;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="main-container-component">
        <div
          className="div-forall"
          style={{ marginBottom: "30px", gap: "15px" }}
        >
          <h1
            className="WB-header-title-page8"
            style={{ alignItems: "flex-start" }}
          >
            <span className="WB-ex-A">A</span>
            <span style={{ whiteSpace: "wrap" }}>
              What are the middle letters of these words? Look and write the
              words in the correct place.
            </span>
          </h1>

          <div className="grid grid-cols-4 gap-2 border-blue-100 rounded-xl mb-6">
            {wordBank.map((word) => {
              const isUsed = usedWords.includes(word);

              return (
                <div key={word} className="flex flex-col items-center gap-1">
                  <img
                    src={wordImages[word]}
                    alt={word}
                    className="object-contain pointer-events-none"
                    style={{ height: "90px", width: "90px" }}
                  />

                  <DraggableWord
                    id={`bank-${word}`}
                    word={word}
                    disabled={isUsed || showResult}
                    className={`WB-word-bank  ${
                      isUsed
                        ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white text-gray-600 border-blue-900 cursor-grab active:cursor-grabbing hover:bg-blue-50"
                    }`}
                    style={{ width: "20px", padding: "9px 22px" }}
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {columns.map((col) => {
              const isWrong =
                showResult &&
                JSON.stringify([...placed[col.id]].sort()) !==
                  JSON.stringify([...correctAnswers[col.id]].sort());

              return (
                <DroppableColumn
                  key={col.id}
                  id={col.id}
                  className="relative border-2 border-gray-400 rounded-2xl p-4 min-h-[160px]"
                >
                  {isWrong && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow">
                      ✕
                    </div>
                  )}

                  <div className="flex justify-center mb-3">
                    <span className="px-4 py-1 w-15 text-center rounded-lg border-2 border-gray-400 text-gray-800 font-bold text-lg bg-white">
                      {col.label}
                    </span>
                  </div>

                  {fixedWords[col.id].map((w) => (
                    <p
                      key={w}
                      className="text-center text-green-500 font-semibold underline text-lg mb-1"
                    >
                      {w}
                    </p>
                  ))}

                  <div className="flex flex-col items-center gap-2 mb-3">
                    {placed[col.id].map((word) => (
                      <DraggableWord
                        id={`placed-${col.id}-${word}`}
                        key={word}
                        word={word}
                        disabled={showResult}
                        onClick={() => {
                          if (showResult) return;

                          setPlaced((prev) => ({
                            ...prev,
                            [col.id]: prev[col.id].filter((w) => w !== word),
                          }));
                        }}
                        className={getPlacedWordClass(col.id, word)}
                      />
                    ))}
                  </div>
                </DroppableColumn>
              );
            })}
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      <DragOverlay adjustScale={false}>
        {activeWord ? (
          <div className="px-3 py-1 rounded-lg text-lg w-20 font-semibold border-2 text-blue border-blue-500 bg-white shadow-lg touch-none">
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
