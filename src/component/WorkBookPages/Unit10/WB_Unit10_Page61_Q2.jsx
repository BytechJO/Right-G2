import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 3.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 5.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 6.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 7.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 61/SVG/Asset 8.svg";
import Button from "../Button";

/* 🔹 Draggable */
function DraggableWord({ word, disabled }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: word,
    disabled, // 👈 هذا المهم
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{style ,padding:"9px 22px"}}
      className={`WB-word-bank touch-none
        ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            : "cursor-pointer hover:scale-105"
        }
      `}
    >
      {word}
    </div>
  );
}

/* 🔹 Drop */
function DropInput({ id, value, submitted, isWrong, activeWord }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 relative transition-all duration-200
        ${isOver ? "scale-105" : ""}
      `}
    >
      <input
        type="text"
        value={value}
        readOnly
        placeholder="Drop here..."
        className={`w-full px-4 py-2 border-2 rounded-lg font-semibold transition-all
          
          ${
            isOver
              ? "border-blue-600 bg-blue-50 shadow-lg"
              : "border-gray-300 bg-white"
          }

          ${
            activeWord && !value
              ? "animate-pulse border-dashed border-blue-400"
              : ""
          }

          ${submitted && isWrong ? "border-red-500 bg-red-50" : ""}
        `}
      />

      {/* ❌ */}
      {isWrong && (
        <div className="absolute -top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 border-white shadow">
          ✕
        </div>
      )}
    </div>
  );
}

const DrawAndAnswerQuestion = () => {
  const words = ["reading", "wearing", "watching", "carrying"];

  const images = [
    {
      id: 1,
      src: img1,
      question: "What's he reading?",
      correctAnswer: "a book",
      hint: "reading",
    },
    {
      id: 2,
      src: img2,
      question: "What's he wearing?",
      correctAnswer: "a hat",
      hint: "wearing",
    },
    {
      id: 3,
      src: img3,
      question: "What's he watching?",
      correctAnswer: "a computer",
      hint: "watching",
    },
    {
      id: 4,
      src: img4,
      question: "What's he carrying?",
      correctAnswer: "a bag",
      hint: "carrying",
    },
  ];

  const canvasRefs = useRef({});
  const [isDrawing, setIsDrawing] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
const [activeWord, setActiveWord] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    }),
  );
  /* ================= CANVAS ================= */

  useEffect(() => {
    Object.keys(canvasRefs.current).forEach((id) => {
      const canvas = canvasRefs.current[id];
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = images.find((i) => i.id === parseInt(id))?.src;
        img.onload = () => {
          canvas.width = 200;
          canvas.height = 180;
          ctx.drawImage(img, 0, 0, 200, 180);
        };
      }
    });
  }, []);

  const handleMouseDown = (e, imageId) => {
    setIsDrawing({ ...isDrawing, [imageId]: true });
    const canvas = canvasRefs.current[imageId];
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e, imageId) => {
    if (!isDrawing[imageId]) return;

    const canvas = canvasRefs.current[imageId];
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FF6B6B";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => setIsDrawing({});

  const clearCanvas = (imageId) => {
    const canvas = canvasRefs.current[imageId];
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = images.find((i) => i.id === imageId)?.src;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 200, 180);
    };
  };

  /* ================= DND ================= */

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const word = active.id;
    const dropId = over.id.split("-")[1];

    setAnswers((prev) => ({
      ...prev,
      [dropId]: word,
    }));
  };

  /* ================= CHECK ================= */

  const handleCheckAnswers = () => {
    if (submitted || showAnswers) return;
    // 🔴 VALIDATION
    if (Object.keys(answers).length < images.length) {
      ValidationAlert.info(
        "Please complete all answers before checking your answers.",
      );
      return;
    }

    let correct = 0;

    images.forEach((img) => {
      const user = answers[img.id]?.toLowerCase().trim();
      const correctAnswer = img.correctAnswer.toLowerCase();

      if (user === correctAnswer) correct++;
    });

    setSubmitted(true); // 👈 عشان يشتغل ❌

    const msg = `Score: ${correct} / ${images.length}`;

    if (correct === images.length) ValidationAlert.success(msg);
    else if (correct > 0) ValidationAlert.warning(msg);
    else ValidationAlert.error(msg);
  };
  /* ================= SHOW ANSWER ================= */

  const handleShowAnswer = () => {
    const correctAnswers = {};

    images.forEach((img) => {
      correctAnswers[img.id] = img.hint; // 👈 بس الكلمة
    });

    setAnswers(correctAnswers);
    setShowAnswers(true);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setFeedback({});
    setSubmitted(false);
    setShowAnswers(false);

    Object.keys(canvasRefs.current).forEach((id) => clearCanvas(parseInt(id)));
  };
  const usedWords = Object.values(answers);
  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveWord(active.id)}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveWord(null);
      }}
    >
      <div className="main-container-component">
        <div
          className="div-forall flex flex-row"
          style={{ marginBottom: "10px" ,gap:"20px"}}
        >
          {/* Header */}

          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">I</span>Draw, and then ask and answer.
          </h1>

          <div className="flex flex-col gap-5">
            {/* Word Bank */}
            <div>
              <div className="bg-white rounded-2xl p-2 inline-block w-full">
                <div className="flex gap-4 flex-wrap flex justify-center items-center">
                  {images.map((word) => (
                    <DraggableWord
                      key={word.correctAnswer}
                      word={word.correctAnswer}
                      disabled={usedWords.includes(word.correctAnswer)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Drawing + Questions */}
        <div className="grid grid-cols-3 gap-8 mb-8">
  {images.map((image) => (
    <div key={image.id} className="w-full">
      {/* Canvas */}
      <div className="mb-4 flex justify-center">
        <canvas
          ref={(el) => (canvasRefs.current[image.id] = el)}
          onMouseDown={(e) => handleMouseDown(e, image.id)}
          onMouseMove={(e) => handleMouseMove(e, image.id)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          height={150}
          width={200}
          className="border-2 border-gray-300 rounded-lg cursor-crosshair"
        />
      </div>

      {/* Input */}
      <div>
        <p className="text-base font-bold text-gray-800 mb-3">
          {image.question}
        </p>

        <div className="flex gap-2">
          <DropInput
            id={image.id}
            value={answers[image.id] || ""}
            submitted={submitted}
            activeWord={activeWord}
            isWrong={
              submitted &&
              !showAnswers &&
              answers[image.id]?.trim() &&
              answers[image.id].toLowerCase().trim() !==
                image.correctAnswer.toLowerCase()
            }
          />
        </div>
      </div>
    </div>
  ))}

  {/* ⭐ الصورة الخامسة */}
  <div className="col-span-2 flex justify-center">
    <img src={img5} className="object-contain"style={{height:"200px"}} />
  </div>
</div>
           
          </div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleReset}
            checkAnswers={handleCheckAnswers}
          />
        </div>
      </div>
    </DndContext>
  );
};

export default DrawAndAnswerQuestion;
