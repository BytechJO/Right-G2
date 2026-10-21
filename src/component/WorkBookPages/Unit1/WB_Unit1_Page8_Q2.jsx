/* eslint-disable react-refresh/only-export-components -- Keep drag controls local to this exercise. */
import { createPortal } from "react-dom";
import ExerciseHeader from "../../ExerciseHeader";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex B 7.svg";

// Keep the score dialog's return focus on an enabled action in this exercise.
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({
      preventScroll: true,
    });
  }
  ValidationAlert[kind](...messages);
}
const IMAGE_DESCRIPTIONS = {
  [img1]: "A young sheep with white curly wool.",
  [img2]: "A blue measuring tool with numbered markings.",
  [img3]: "A brown animal with long upright ears.",
  [img4]: "A table light with a beige shade.",
  [img5]: "A bare lower leg below blue shorts.",
  [img6]: "A brown animal with whiskers and a long thin tail.",
  [img7]: "A child moving quickly with bent arms and raised feet.",
};
const ALL_IMAGES = [
  {
    id: "lamb",
    src: img1,
    letter: "l",
  },
  {
    id: "ruler",
    src: img2,
    letter: "r",
  },
  {
    id: "rabbit",
    src: img3,
    letter: "r",
  },
  {
    id: "lamp",
    src: img4,
    letter: "l",
  },
  {
    id: "leg",
    src: img5,
    letter: "l",
  },
  {
    id: "rat",
    src: img6,
    letter: "r",
  },
  {
    id: "run",
    src: img7,
    letter: "r",
  },
];
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
// ⭐ Draggable Image
// ⭐ Draggable Image
function DraggableImage({ item, isDisabled, picked, tileProps, tileRef }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: isDisabled,
  });
  const style = {
    position: "relative",
    ...(picked
      ? {
          outline: "4px solid #2563eb",
          outlineOffset: 2,
          backgroundColor: "#dbeafe",
        }
      : {}),
    opacity: isDisabled ? 0.4 : isDragging ? 0 : 1,
    height: "100px",
    width: "100px",
    touchAction: "none",
    cursor: isDisabled ? "not-allowed" : "grab",
  };
  return (
    <img
      ref={(el) => {
        setNodeRef(el);
        tileRef(el);
      }}
      style={style}
      {...(!isDisabled ? attributes : {})}
      {...(!isDisabled ? listeners : {})}
      {...tileProps}
      src={item.src}
      alt={IMAGE_DESCRIPTIONS[item.src] || ""}
      className={`object-contain bg-white border rounded-md shadow-sm ${focusClass}`}
    />
  );
}

// ⭐ Drop Zone

// ⭐ Drop Zone
function DropZone({
  id,
  items,
  letter,
  onRemoveItem,
  results,
  groupProps,
  groupRef,
}) {
  const { setNodeRef, isOver } = useSortable({
    id,
  });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        groupRef(el);
      }}
      {...groupProps}
      className={`${focusClass} w-full sm:w-88 min-h-[250px] border-3 border-dashed rounded-lg flex flex-col items-center p-4 ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-400"}`}
    >
      <span className="font-bold text-5xl text-gray-500 mb-4">
        {letter.toUpperCase()}
      </span>

      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item) => {
          const isWrong = results[item.id] === "wrong";
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              data-placed-id={item.id}
              aria-label={`${IMAGE_DESCRIPTIONS[item.src]}${results[item.id] === "correct" ? " Correct and locked." : " Return to the bank."}`}
              aria-disabled={results[item.id] === "correct"}
              className={focusClass}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.key !== " ") return;
                e.preventDefault();
                e.stopPropagation();
                if (!e.repeat) onRemoveItem(item, id);
              }}
              onKeyUp={release}
              style={{
                position: "relative",
                borderRadius: "6px",
                ...(results[item.id]
                  ? {
                      boxShadow: `0 0 0 2px ${results[item.id] === "correct" ? "#16a34a" : "#ef4444"}`,
                    }
                  : {}),
              }}
              onClick={() => onRemoveItem(item, id)}
            >
              <img
                src={item.src}
                alt={IMAGE_DESCRIPTIONS[item.src] || ""}
                className="w-24 h-24 object-contain bg-white border rounded-md shadow cursor-pointer"
                style={{
                  height: "100px",
                  width: "100px",
                }}
              />

              {/* ❌ أيقونة الخطأ */}
              {isWrong && <div className="wrong-icon-wb-unit1-p8-q2">✕</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ⭐ Main Component
const WB_Unit1_Page8_Q2_DND = () => {
  const rootRef = useRef(null);
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (
      !completedCheckRef.current ||
      (button?.style && completedCheckRef.current.button !== button)
    ) {
      completedCheckRef.current = {
        button,
        cursor: button?.style?.cursor,
        aria: button?.getAttribute?.("aria-disabled"),
      };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null)
        previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };
  const [containers, setContainers] = useState({
    available: ALL_IMAGES,
    r: [],
    l: [],
  });
  const [usedItems, setUsedItems] = useState([]); // ⭐ الجديد
  const [activeItem, setActiveItem] = useState(null);
  const [dragSize, setDragSize] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState({}),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const tileRefs = useRef({}),
    groupRefs = useRef({}),
    frame = useRef(null);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      get()?.focus();
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragStart = (event) => {
    cancelFocus();
    setPicked(null);
    const { active } = event;
    const item = ALL_IMAGES.find((i) => i.id === active.id);
    setActiveItem(item);
    // Match the visible bank tile, including the Book's current scale.
    // The sensor's initial rect can still be unavailable at drag start.
    const rect = tileRefs.current[active.id]?.getBoundingClientRect()
      || active.rect?.current?.initial;
    setDragSize({
      width: rect?.width > 0 ? rect.width : 100,
      height: rect?.height > 0 ? rect.height : 100,
    });
  };
  const handleRemoveItem = (item, fromContainer) => {
    if (showAnswer || results[item.id] === "correct") return;
    setResults((prev) => ({
      ...prev,
      [item.id]: null,
    }));
    setMessage("Image returned to the bank.");
    // حذف من الصندوق
    setContainers((prev) => ({
      ...prev,
      [fromContainer]: prev[fromContainer].filter((i) => i.id !== item.id),
    }));

    // رجّعها available (شيلها من used)
    setUsedItems((prev) => prev.filter((id) => id !== item.id));
  };
  const place = (itemId, toContainer, keyboard = false) => {
    const movedItem = ALL_IMAGES.find((i) => i.id === itemId);
    if (
      !movedItem ||
      showAnswer ||
      results[itemId] === "correct" ||
      usedItems.includes(itemId) ||
      !["r", "l"].includes(toContainer)
    )
      return;
    setContainers((prev) => ({
      ...prev,
      [toContainer]: [...prev[toContainer], movedItem],
    }));
    setUsedItems((prev) => [...prev, itemId]);
    setResults((prev) => ({
      ...prev,
      [itemId]: null,
    }));
    setPicked(null);
    setMessage("Image placed in " + toContainer.toUpperCase() + ".");
    if (keyboard) {
      const next = ALL_IMAGES.find(
        (item) => item.id !== itemId && !usedItems.includes(item.id),
      );
      focus(() => tileRefs.current[next?.id || itemId]);
    }
  };
  const handleDragEnd = ({ active, over }) => {
    if (over) place(active.id, over.id);
    setActiveItem(null);
  };
  const cancel = () => {
    if (picked) focus(() => tileRefs.current[picked]);
    setPicked(null);
    setMessage("Selection cancelled.");
  };
  const tileProps = (item) => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "data-image-id": item.id,
    "aria-label": "Choose image: " + IMAGE_DESCRIPTIONS[item.src],
    "aria-pressed": picked === item.id,
    "aria-disabled": showAnswer || usedItems.includes(item.id),
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat || showAnswer || usedItems.includes(item.id)) return;
      setPicked(item.id);
      setMessage("Image chosen. Select R or L with Enter or Space.");
      focus(() => groupRefs.current.r);
    },
    onKeyUp: release,
  });
  const groupProps = (id) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": id.toUpperCase() + " category",
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && picked) place(picked, id, true);
    },
    onKeyUp: release,
  });
  const handleCheckAnswers = (checkEvent) => {
    if (completedCheckRef.current) {
      completeCheck(checkEvent);
      return;
    }
    if (showAnswer) return;
    cancelFocus();
    setPicked(null);
    setActiveItem(null);
    if (usedItems.length !== ALL_IMAGES.length) {
      ValidationAlert.info("Please drag all images!");
      setMessage("Please drag all images!");
      return;
    }
    cancelFocus();
    setPicked(null);
    setActiveItem(null);
    const nextResults = Object.fromEntries(
      ["r", "l"].flatMap((id) =>
        containers[id].map((item) => [
          item.id,
          item.letter === id ? "correct" : "wrong",
        ]),
      ),
    );
    setResults(nextResults);
    let correctCount = 0;
    correctCount += containers.r.filter((img) => img.letter === "r").length;
    correctCount += containers.l.filter((img) => img.letter === "l").length;
    const total = ALL_IMAGES.length;
    setMessage(
      `Score ${correctCount} out of ${total}. Correct images are locked; wrong images can be returned to the bank.`,
    );
    if (correctCount === total) {
      (completeCheck(checkEvent),
        showCheckFeedback(
          rootRef.current,
          "success",
          `Score: ${correctCount}/${total}`,
        ));
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${total}`);
    }
  };
  const handleReset = () => {
    cancelFocus();
    setPicked(null);
    setActiveItem(null);
    setResults({});
    setMessage("Exercise reset.");
    setContainers({
      available: ALL_IMAGES,
      r: [],
      l: [],
    });
    setUsedItems([]);
    setShowAnswer(false);
  };
  const handleShowAnswer = () => {
    cancelFocus();
    setPicked(null);
    setActiveItem(null);
    setResults(
      Object.fromEntries(ALL_IMAGES.map((item) => [item.id, "correct"])),
    );
    setMessage("Correct answers shown and locked.");
    const correctContainers = {
      available: ALL_IMAGES,
      r: [],
      l: [],
    };
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
      onDragCancel={() => setActiveItem(null)}
    >
      <div
        ref={rootRef}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            gap: "50px",
          }}
        >
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {message}
          </div>
          <ExerciseHeader
            isWorkbook
            sectionLetter="B"
            title={"What are they? Write the words in the correct places."}
            subTitle={
              "Say each picture word first, then place it under l or r by its beginning sound."
            }
          />

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
                  isDisabled={showAnswer || usedItems.includes(item.id)}
                  picked={picked === item.id}
                  tileProps={tileProps(item)}
                  tileRef={(el) => {
                    tileRefs.current[item.id] = el;
                  }}
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
              results={results}
              groupProps={groupProps("r")}
              groupRef={(el) => {
                groupRefs.current.r = el;
              }}
            />

            <DropZone
              id="l"
              items={containers.l}
              letter="l"
              onRemoveItem={handleRemoveItem}
              results={results}
              groupProps={groupProps("l")}
              groupRef={(el) => {
                groupRefs.current.l = el;
              }}
            />
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={(checkEvent) => {
              resetCompletedCheck();
              handleReset(checkEvent);
            }}
            checkAnswers={handleCheckAnswers}
          />

          {/* ⭐ Drag Preview */}
          {createPortal(
            <DragOverlay dropAnimation={null} zIndex={2147483647}>
              {activeItem ? (
                <img
                  src={activeItem.src}
                  alt={IMAGE_DESCRIPTIONS[activeItem.src] || ""}
                  style={{
                    width: dragSize?.width ?? 100,
                    height: dragSize?.height ?? 100,
                    boxSizing: "border-box",
                    objectFit: "contain",
                    display: "block",
                    margin: 0,
                  }}
                  className="object-contain bg-white border rounded-md shadow-sm"
                />
              ) : null}
            </DragOverlay>,
            document.fullscreenElement || document.body,
          )}
        </div>
      </div>
    </DndContext>
  );
};
export default WB_Unit1_Page8_Q2_DND;
