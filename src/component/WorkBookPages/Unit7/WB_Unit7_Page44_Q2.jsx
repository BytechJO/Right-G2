import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import coatImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 1.svg";
import boneImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 2.svg";
import bowImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 44/Ex B 3.svg";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
const exerciseBWords = [
  "row",
  "goat",
  "globe",
  "note",
  "grow",
  "home",
  "soap",
  "road",
  "snow",
];

const exerciseBColumns = [
  {
    id: "oa",
    title: "coat",
    image: coatImg,
    correctWords: ["goat", "soap", "road"],
  },
  {
    id: "o-e",
    title: "bone",
    image: boneImg,
    correctWords: ["globe", "note", "home"],
  },
  {
    id: "ow",
    title: "bow",
    image: bowImg,
    correctWords: ["row", "grow", "snow"],
  },
];
const DraggableWord = ({
  word,
  used,
  locked,
  fromColumn,
  slotIndex,
  onReturn,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${word}-${fromColumn || "pool"}`,
    data: {
      word,
      fromColumn,
    },
    disabled: locked || used,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px,0)`
      : undefined,

    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();

        if (fromColumn && onReturn) {
          onReturn(fromColumn, slotIndex);
        }
      }}
      style={style}
      className={`WB-word-bank
    ${used ? "text-gray-400 opacity-60" : "cursor-grab hover:text-blue-600"}
  `}
    >
      {word}
    </div>
  );
};

const DropSlot = ({ columnId, index, children, isWrong }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${columnId}__${index}`,
  });
  return (
    <div
      ref={setNodeRef}
      className={`relative h-12 border-b-2 flex items-center justify-center text-xl italic
      ${
        isWrong
          ? "border-red-500"
          : children
            ? "border-gray-500"
            : "border-gray-300"
      }
      ${isOver ? "bg-blue-100" : ""}
    `}
    >
      {children}
    </div>
  );
};

const WB_Unit7_Page44_Q2 = () => {
  const [columnsB, setColumnsB] = useState({ oa: [], "o-e": [], ow: [] });
  const [draggedWord, setDraggedWord] = useState(null);
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  // 🔒 هل الكلمة مستخدمة؟
  const isUsed = (word) => {
    return Object.values(columnsB).some((col) => col.includes(word));
  };
  const handleDragStart = (event) => {
    setActiveItem(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over || locked) return;

    const { word, fromColumn } = active.data.current;

    // رجوع للبنك
    if (over.id === "pool") {
      if (!fromColumn) return;

      setColumnsB((prev) => ({
        ...prev,
        [fromColumn]: prev[fromColumn].filter((w) => w !== word),
      }));

      return;
    }

    const [toColumn, slotIndex] = over.id.split("__");

    setColumnsB((prev) => {
      const updated = {
        oa: [...prev.oa],
        "o-e": [...prev["o-e"]],
        ow: [...prev.ow],
      };

      // حذف من مكانه القديم
      if (fromColumn) {
        updated[fromColumn] = updated[fromColumn].filter((w) => w !== word);
      }

      updated[toColumn][Number(slotIndex)] = word;

      return updated;
    });
  };

  const returnWordToBank = (columnId, slotIndex) => {
    if (locked) return;

    setColumnsB((prev) => {
      const updated = {
        oa: [...prev.oa],
        "o-e": [...prev["o-e"]],
        ow: [...prev.ow],
      };

      updated[columnId][slotIndex] = undefined;

      return updated;
    });
  };
  const areAllFilled = () => {
    const totalPlaced = Object.values(columnsB).reduce(
      (sum, col) => sum + col.filter(Boolean).length,
      0,
    );

    return totalPlaced === exerciseBWords.length;
  };
  const checkAnswers = () => {
    if (locked || checked) return;

    // 🔴 الفاليديشن
    if (!areAllFilled()) {
      ValidationAlert.info("Please place all the words first!");
      return;
    }

    let correct = 0;
    let total = exerciseBWords.length;

    exerciseBColumns.forEach((col) => {
      (columnsB[col.id] || []).forEach((word) => {
        if (col.correctWords.includes(word)) correct++;
      });
    });

    setChecked(true);
    setLocked(true);

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct === 0) {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    }
  };

  const handleShowAnswer = () => {
    const correct = { oa: [], "o-e": [], ow: [] };
    exerciseBColumns.forEach((col) => (correct[col.id] = col.correctWords));
    setColumnsB(correct);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setColumnsB({ oa: [], "o-e": [], ow: [] });
    setChecked(false);
    setLocked(false);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-container-component">
        {" "}
        <div className="div-forall" style={{ gap: "25px" }}>
          {" "}
          <h2 className="WB-header-title-page8">
            {" "}
            <span className="WB-ex-A">B</span>
            Look, read, and write the words under the correct column.{" "}
          </h2>
          <div className="flex flex-col gap-2">
            {/* WORD BANK */}
            <div className="rounded-full px-8 py-4 flex flex-wrap justify-center gap-4">
              {exerciseBWords.map((word) => {
                const used = isUsed(word);

                return (
                  <DraggableWord
                    key={word}
                    word={word}
                    used={used}
                    locked={locked}
                  />
                );
              })}
            </div>
            {/* COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {exerciseBColumns.map((col) => (
                <div key={col.id} className="flex flex-col items-center">
                  <img
                    src={col.image}
                    className="max-w-32 max-h-24 object-contain"
                  />

                  <span className="font-bold text-2xl text-gray-700">
                    {col.title}
                  </span>

                  <div className="w-full flex flex-col gap-3 min-h-[180px] p-4">
                    {[0, 1, 2].map((idx) => {
                      const word = columnsB[col.id][idx];
                      const isWrong =
                        checked &&
                        word &&
                        !exerciseBColumns
                          .find((c) => c.id === col.id)
                          .correctWords.includes(word);
                      return (
                        <DropSlot
                          columnId={col.id}
                          index={idx}
                          isWrong={isWrong}
                        >
                          {word && (
                            <div className="relative">
                            <button
                            // key={`answer-${word}-${i}`}
                               onClick={() => returnWordToBank(col.id, idx)}
                            className="cursor-pointer hover:bg-red-50"
                          >
                            {word}
                          </button>
                            </div>
                          )}
                        </DropSlot>
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
      <DragOverlay>
        {activeItem ? (
          <div className="WB-word-bank px-4 py-2 shadow-lg bg-white">
            {activeItem.word}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit7_Page44_Q2;
