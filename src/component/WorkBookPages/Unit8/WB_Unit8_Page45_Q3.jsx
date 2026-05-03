import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor, // 🔧
  MouseSensor, // 🔧
  DragOverlay,
  useDroppable, // 🔧
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import p1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 7.svg";
import p2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 8.svg";
import p3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 9.svg";
import p4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 10.svg";
import p5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 11.svg";
import p6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 45/Ex B 12.svg";

const SENTENCES = [
  { id: "s1", text: "He has a tie." },
  { id: "s2", text: "She has a dress." },
  { id: "s3", text: "She has shoes." },
  { id: "s4", text: "He has a shirt." },
  { id: "s5", text: "He has a jacket." },
  { id: "s6", text: "She has a skirt." },
];

const CORRECT_C = {
  d1: "s1",
  d2: "s2",
  d3: "s3",
  d4: "s4",
  d5: "s5",
  d6: "s6",
};

// ================= Draggable =================
function DraggableSentence({ s, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: s.id,

    // ✅ FIX 1: لا يبدأ drag إلا بعد حركة حقيقية
    activationConstraint: {
      distance: 8,
    },

    // ✅ FIX 2: تعطيل إذا مستخدم
    disabled: isUsed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isUsed ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // ✅ FIX 4: منع أي click behavior
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // 🔥 مهم جداً
      }}
      className={`p-3 md:p-2 bg-white border-2 border-blue-100 rounded-lg shadow-sm cursor-grab text-blue-700 text-base md:text-lg font-medium touch-none select-none ${
        isUsed
          ? "bg-gray-100 text-gray-400 pointer-events-none"
          : "hover:border-blue-400"
      }`}
    >
      {s.text}
    </div>
  );
}

// ================= Drop =================
function DropZone({ id, imgSrc, content, isCorrect, isSubmitted }) {
  const { setNodeRef, isOver } = useDroppable({ id }); // 🔧

  const isWrong = isSubmitted && content && !isCorrect;

  const borderColor = isWrong
    ? "border-red-500 bg-red-50"
    : isSubmitted
      ? "border-blue-500 bg-blue-50"
      : isOver
        ? "border-blue-400 bg-blue-50"
        : "border-gray-300";

  return (
    <div className="relative flex items-center gap-4 p-2 rounded-xl border border-gray-100">
      <img
        src={imgSrc}
        alt="person"
        className="rounded-full border"
        style={{ height: "100px", width: "100px" }}
      />

      <div
        ref={setNodeRef}
        className={`flex-1 h-10 border-b-2 flex items-center px-2 transition-all ${borderColor}`}
      >
        {content ? (
          <span className="font-bold text-lg text-blue-900">
            {SENTENCES.find((s) => s.id === content).text}
          </span>
        ) : (
          <span className="text-gray-300 text-sm italic">drop sentence...</span>
        )}
      </div>

      {isWrong && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
          ✕
        </div>
      )}
    </div>
  );
}

// ================= Main =================
const WB_Unit8_Page45_Q3 = () => {
  const [placed, setPlaced] = useState({
    d1: null,
    d2: null,
    d3: null,
    d4: null,
    d5: null,
    d6: null,
  });

  const [activeId, setActiveId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // 🔧 Sensors optimized (drag only)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // 🔥 زودناها شوي
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180, // 🔥 زودناها شوي
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor),
  );
  const checkAnswers = () => {
    if (showResults) return;
    const unanswered = Object.keys(CORRECT_C).filter((id) => !placed[id]);

    if (unanswered.length > 0) {
      ValidationAlert.info("Please fill all answers!");
      return;
    }

    setShowResults(true);

    let score = 0;
    let total = Object.keys(CORRECT_C).length;

    Object.keys(CORRECT_C).forEach((id) => {
      if (placed[id] === CORRECT_C[id]) score++;
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={(e) => {
        const { active, over } = e;

        // ✅ FIX 1: إذا ما في drop حقيقي → لا تعمل أي إشي
        if (!over || !over.id.startsWith("d")) {
          setActiveId(null);
          return;
        }

        setPlaced((prev) => {
          const next = { ...prev };

          // ✅ FIX 2: إزالة العنصر من مكانه القديم
          Object.keys(next).forEach((k) => {
            if (next[k] === active.id) next[k] = null;
          });

          // ✅ FIX 3: وضعه بالمكان الجديد
          next[over.id] = active.id;

          return next;
        });

        setActiveId(null);
      }}
    >
      <div className="main-container-component">
        <div className="div-forall"  style={{gap:"35px"}}>
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">C</span>
            Look and write.
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* DROP ZONES */}
            <div className="flex-1 grid grid-cols-1 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <DropZone
                  key={n}
                  id={`d${n}`}
                  imgSrc={[p1, p2, p3, p4, p5, p6][n - 1]}
                  content={placed[`d${n}`]}
                  isCorrect={placed[`d${n}`] === CORRECT_C[`d${n}`]}
                  isSubmitted={showResults}
                />
              ))}
            </div>

            {/* WORD BANK */}
            <div className="w-full md:w-64 bg-blue-50 p-4 rounded-xl border-2 border-blue-100 h-fit">
              <h3 className="font-bold text-blue-800 mb-4 text-center">
                Sentences Bank
              </h3>

              <div className="flex flex-col gap-2">
                <SortableContext items={SENTENCES.map((s) => s.id)}>
                  {SENTENCES.map((s) => (
                    <DraggableSentence
                      key={s.id}
                      s={s}
                      isUsed={Object.values(placed).includes(s.id)}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              handleShowAnswer={() => {
                setPlaced(CORRECT_C);
                setShowResults(true);
              }}
              handleStartAgain={() => {
                setPlaced({
                  d1: null,
                  d2: null,
                  d3: null,
                  d4: null,
                  d5: null,
                  d6: null,
                });
                setShowResults(false);
              }}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>

      {/* Drag Preview */}
      <DragOverlay>
        {activeId ? (
          <div className="p-3 bg-white border-2 border-blue-500 rounded-lg shadow-xl text-blue-700 font-bold text-base">
            {SENTENCES.find((s) => s.id === activeId).text}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit8_Page45_Q3;
