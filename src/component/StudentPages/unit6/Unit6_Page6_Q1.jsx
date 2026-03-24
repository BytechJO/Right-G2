import React, { useState, useRef } from "react";
import "./Unit6_Page6_Q1.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import pencilCursor from "../../../assets/imgs/pen_96740.png";
import eraserCursor from "../../../assets/imgs/gui_eraser_icon_157160.png";
import img1 from "../../../assets/imgs/clock1.png";

const Unit6_Page6_Q1 = () => {
  const [locked, setLocked] = useState(false);
  const questions = [
    { id: 1, text: "I brush my teeth at six thirty.", img: img1 },
    { id: 2, text: "I wash my face at seven o’clock.", img: img1 },
    { id: 3, text: "I comb my hair at seven thirty.", img: img1 },
    { id: 4, text: "I eat my breakfast at eight o’clock.", img: img1 },
    { id: 5, text: "I go to school at eight thirty.", img: img1 },
  ];
  const correctTimes = {
    1: { h: 6, m: 30 },
    2: { h: 7, m: 0 },
    3: { h: 7, m: 30 },
    4: { h: 8, m: 0 },
    5: { h: 8, m: 30 },
  };
  const [tool, setTool] = useState("pen");

  const canvasRefs = useRef({});

  const startDrawing = (e, id) => {
    if (locked) return;
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");

    ctx.isDrawing = true;
    ctx.lineCap = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 3;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lastX = (e.clientX || e.touches[0].clientX) - rect.left;
    ctx.lastY = (e.clientY || e.touches[0].clientY) - rect.top;
  };

  const draw = (e, id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    if (!ctx.isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(ctx.lastX, ctx.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lastX = x;
    ctx.lastY = y;
  };

  const stopDrawing = (id) => {
    const canvas = canvasRefs.current[id];
    const ctx = canvas.getContext("2d");
    ctx.isDrawing = false;
  };

  const resetCanvas = () => {
    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    setLocked(false);
  };
  const drawCorrectTime = (canvas, hour, minute) => {
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    // minute hand
    const minuteAngle = (minute * Math.PI) / 30 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(minuteAngle) * radius,
      centerY + Math.sin(minuteAngle) * radius,
    );
    ctx.stroke();

    // hour hand
    const hourAngle =
      ((hour % 12) * Math.PI) / 6 + (minute * Math.PI) / 360 - Math.PI / 2;

    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(hourAngle) * radius * 0.6,
      centerY + Math.sin(hourAngle) * radius * 0.6,
    );
    ctx.stroke();
  };
  const checkAnswers = () => {
    questions.forEach((q) => {
      const canvas = canvasRefs.current[q.id];
      const time = correctTimes[q.id];

      drawCorrectTime(canvas, time.h, time.m);
    });

    setLocked(true);
  };
  return (
    <div
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
          display: "flex",
          flexDirection: "column",
          // gap: "20px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span style={{ marginRight: "15px" }} className="ex-A">
            D
          </span>
          Read and then draw the time.{" "}
        </h5>
        {/* TOOLS */}
        <div className="flex gap-3 mb-8 mt-6">
          <button
            onClick={() => setTool("pen")}
            className={`px-4 py-1 rounded-md ${
              tool === "pen" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            ✏️ Pen
          </button>

          <button
            onClick={() => setTool("eraser")}
            className={`px-4 py-1 rounded-md ${
              tool === "eraser" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            🧽 Eraser
          </button>
        </div>

        {/* MAIN */}
        <div className="flex flex-col gap-8 mt-6">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between">
              {/* TEXT */}
              <div className="flex gap-3 text-[18px] w-[70%]">
                <span className="font-bold">{q.id}</span>
                <span>{q.text}</span>
              </div>

              {/* CLOCK */}
              <canvas
                ref={(el) => (canvasRefs.current[q.id] = el)}
                width={90}
                height={90}
                style={{
                  backgroundImage: `url(${q.img})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  cursor:
                    tool === "eraser"
                      ? `url(${eraserCursor}) 12 12, auto`
                      : `url(${pencilCursor}) 4 28, auto`,
                }}
                className="shrink-0"
                onMouseDown={(e) => startDrawing(e, q.id)}
                onMouseMove={(e) => draw(e, q.id)}
                onMouseUp={() => stopDrawing(q.id)}
                onMouseLeave={() => stopDrawing(q.id)}
                onTouchStart={(e) => startDrawing(e, q.id)}
                onTouchMove={(e) => {
                  e.preventDefault();
                  draw(e, q.id);
                }}
                onTouchEnd={() => stopDrawing(q.id)}
              />
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button onClick={resetCanvas} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Show Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unit6_Page6_Q1;
