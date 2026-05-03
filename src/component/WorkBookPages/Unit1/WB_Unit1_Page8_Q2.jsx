import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 7.svg";

const ALL_IMAGES = [
  { id: "lamb", src: img1, letter: "l" },
  { id: "ruler", src: img2, letter: "r" },
  { id: "rabbit", src: img3, letter: "r" },
  { id: "lamp", src: img4, letter: "l" },
  { id: "leg", src: img5, letter: "l" },
  { id: "rat", src: img6, letter: "r" },
  { id: "run", src: img7, letter: "r" },
];

// ⭐ Draggable Image
function DraggableImage({ item, isDisabled }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: isDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDisabled ? 0.4 : isDragging ? 1 : 1,
    height: "100px",
    width: "100px",
    cursor: isDisabled ? "not-allowed" : "grab",
  };

  return (
    <img
      ref={setNodeRef}
      style={style}
      {...(!isDisabled ? attributes : {})}
      {...(!isDisabled ? listeners : {})}
      src={item.src}
      alt={item.id}
      className="object-contain bg-white border rounded-md shadow-sm"
    />
  );
}

// ⭐ Drop Zone
function DropZone({ id, items, letter, onRemoveItem, showAnswer }) {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full sm:w-88 min-h-[250px] border-3 border-dashed rounded-lg flex flex-col items-center p-4 ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-400"
      }`}
    >
      <span className="font-bold text-5xl text-gray-500 mb-4">
        {letter.toUpperCase()}
      </span>

      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item) => {
          const isWrong = showAnswer && item.letter !== id;

          return (
            <div
              key={item.id}
              style={{ position: "relative" }}
              onClick={() => onRemoveItem(item, id)}
            >
              <img
                src={item.src}
                alt={item.id}
                className="w-24 h-24 object-contain bg-white border rounded-md shadow cursor-pointer"
                style={{ height: "100px", width: "100px" }}
              />

              {/* ❌ أيقونة الخطأ */}
              {isWrong && (
                <div className="wrong-icon-wb-unit1-p8-q2">
                  ✕
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ⭐ Main Component
const WB_Unit1_Page8_Q2_DND = () => {
  const [containers, setContainers] = useState({
    available: ALL_IMAGES,
    r: [],
    l: [],
  });

  const [usedItems, setUsedItems] = useState([]); // ⭐ الجديد
  const [activeItem, setActiveItem] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const item = ALL_IMAGES.find((i) => i.id === active.id);
    setActiveItem(item);
  };
  const handleRemoveItem = (item, fromContainer) => {
    if (showAnswer) return;

    // حذف من الصندوق
    setContainers((prev) => ({
      ...prev,
      [fromContainer]: prev[fromContainer].filter((i) => i.id !== item.id),
    }));

    // رجّعها available (شيلها من used)
    setUsedItems((prev) => prev.filter((id) => id !== item.id));
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const toContainer = over.id;

    if (!containers[toContainer]) {
      setActiveItem(null);
      return;
    }

    const movedItem = ALL_IMAGES.find((i) => i.id === active.id);

    // ❌ منع التكرار
    if (usedItems.includes(active.id)) {
      setActiveItem(null);
      return;
    }

    setContainers((prev) => ({
      ...prev,
      [toContainer]: [...prev[toContainer], movedItem],
    }));

    setUsedItems((prev) => [...prev, active.id]);

    setActiveItem(null);
  };

  const handleCheckAnswers = () => {
    if (showAnswer) return;

    if (usedItems.length !== ALL_IMAGES.length) {
      ValidationAlert.info("Please drag all images!");
      return;
    }

    let correctCount = 0;

    correctCount += containers.r.filter((img) => img.letter === "r").length;
    correctCount += containers.l.filter((img) => img.letter === "l").length;

    const total = ALL_IMAGES.length;
    setShowAnswer(true);

    if (correctCount === total) {
      ValidationAlert.success(`Score: ${correctCount}/${total}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${total}`);
    }
  };
const isWrongPlacement = (item, containerId) => {
  return showAnswer && item.letter !== containerId;
};
  const handleReset = () => {
    setContainers({ available: ALL_IMAGES, r: [], l: [] });
    setUsedItems([]);
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    const correctContainers = { available: ALL_IMAGES, r: [], l: [] };

    ALL_IMAGES.forEach((img) => {
      correctContainers[img.letter].push(img);
    });

    setUsedItems(ALL_IMAGES.map((img) => img.id));
    setContainers(correctContainers);
    setShowAnswer(true);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall"  style={{gap:"50px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">B</span> What are they? Write the words in the correct places.
          </h1>

          {/* ⭐ Available Images */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            <SortableContext
              key={usedItems.length} // ⭐ هذا الحل
              items={containers.available.map((i) => i.id)}
            >
              {containers.available.map((item) => (
                <DraggableImage
                  key={item.id}
                  item={item}
                  isDisabled={usedItems.includes(item.id)}
                />
              ))}
            </SortableContext>
          </div>

          {/* ⭐ Drop Zones */}
          <div className="flex gap-10 mb-6 justify-center">
          <DropZone
  id="r"
  items={containers.r}
  letter="r"
  onRemoveItem={handleRemoveItem}
  showAnswer={showAnswer}
/>

<DropZone
  id="l"
  items={containers.l}
  letter="l"
  onRemoveItem={handleRemoveItem}
  showAnswer={showAnswer}
/>
           
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={handleCheckAnswers}
          />

          {/* ⭐ Drag Preview */}
          <DragOverlay>
            {activeItem ? (
              <img
                src={activeItem.src}
                alt={activeItem.id}
                style={{ height: "120px" }}
              />
            ) : null}
          </DragOverlay>
        </div>
      </div>
    </DndContext>
  );
};

export default WB_Unit1_Page8_Q2_DND;
