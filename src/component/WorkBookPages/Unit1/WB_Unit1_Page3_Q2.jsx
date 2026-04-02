import React, { useState, useRef } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 3/Ex B 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./WB_Unit1_Page3_Q2.css";

const WB_Unit1_Page3_Q2 = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  let startPoint = null;
  const [wrongImages, setWrongImages] = useState([]);
  // ⭐⭐ NEW: قفل الرسم بعد Check Answer
  const [locked, setLocked] = useState(false); //  ← إضافة جديدة
  const [firstDot, setFirstDot] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrongWords, setWrongWords] = useState([]);
  const [userInputs, setUserInputs] = useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const initialQuestions = [
    {
      id: 1,
      matchWord: "tisesr",
      correctSentence: "sister",
      scrambled: ["t", "i", "s", "e", "s", "r"].map((char, index) => ({
        id: `1-${char}-${index}`,
        value: char,
      })),
      image: img4,
    },
    {
      id: 2,
      matchWord: "aftreh",
      correctSentence: "father",
      scrambled: ["a", "f", "t", "r", "e", "h"].map((char, index) => ({
        id: `2-${char}-${index}`,
        value: char,
      })),
      image: img3,
    },
    {
      id: 3,
      matchWord: "lapy",
      correctSentence: "play",
      scrambled: ["l", "a", "p", "y"].map((char, index) => ({
        id: `3-${char}-${index}`,
        value: char,
      })),
      image: img1,
    },
    {
      id: 4,
      matchWord: "thomer",
      correctSentence: "mother",
      scrambled: ["t", "h", "o", "m", "e", "r"].map((char, index) => ({
        id: `4-${char}-${index}`,
        value: char,
      })),
      image: img2,
    },
  ];
  const correctMatches = [
    { word: "sister", image: "img3" },
    { word: "father", image: "img4" },
    { word: "play", image: "img2" },
    { word: "mother", image: "img1" },
  ];
  const [questionsState, setQuestionsState] = useState(
    initialQuestions.map((q) => ({
      ...q,
      currentLetters: [...q.scrambled],
    })),
  );

  const onDragEnd = (result) => {
    if (!result.destination || locked || showAnswer) return;

    const { source, destination } = result;
    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    if (!sourceId.startsWith("bank-") || !destId.startsWith("sentence-"))
      return;

    const qId = destId.split("-")[1];
    if (!qId) return;

    const question = questionsState.find((q) => String(q.id) === String(qId));
    if (!question) return;

    const availableLetters = question.scrambled.filter(
      (letter) => !userInputs[qId].some((item) => item.id === letter.id),
    );

    const draggedItem = availableLetters[source.index];
    if (!draggedItem) return;

    setUserInputs((prev) => ({
      ...prev,
      [qId]: [...prev[qId], draggedItem],
    }));
  };
  const images = [
    { id: "img1", src: img1 },
    { id: "img2", src: img2 },
    { id: "img3", src: img3 },
    { id: "img4", src: img4 },
  ];

  // ============================
  // 1️⃣ الضغط على النقطة الأولى (start-dot)
  // ============================
  const handleStartDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل إذا مغلق

    const rect = containerRef.current.getBoundingClientRect();

    const wordId = e.target.dataset.wordId;
    const image = e.target.dataset.image || null;

    // ⭐⭐ NEW: منع رسم أكثر من خط من نفس الصورة (image)
    const alreadyUsed = lines.some((line) => line.wordId === wordId);

    if (alreadyUsed) return; // ← إضافة جديدة

    setFirstDot({
      wordId,

      x: e.target.getBoundingClientRect().left - rect.left + 8,
      y: e.target.getBoundingClientRect().top - rect.top + 8,
    });
  };

  // ============================
  // 2️⃣ الضغط على النقطة الثانية (end-dot)
  // ============================
  const handleEndDotClick = (e) => {
    if (showAnswer || locked) return; // ⭐⭐ NEW: منع التوصيل إذا مغلق
    if (!firstDot) return;

    const rect = containerRef.current.getBoundingClientRect();

    const endWord = e.target.dataset.word || null;
    const endImage = e.target.dataset.image || null;

    const newLine = {
      x1: firstDot.x,
      y1: firstDot.y,
      x2: e.target.getBoundingClientRect().left - rect.left + 8,
      y2: e.target.getBoundingClientRect().top - rect.top + 8,

      wordId: firstDot.wordId,
      image: endImage,
    };

    setLines((prev) => [...prev, newLine]);
    setFirstDot(null);
  };
  // ============================
  // 3️⃣ Check Answers
  // ============================
  const checkAnswers2 = () => {
    if (showAnswer || locked) return;

    const allWordsSolved = questionsState.every(
      (q) =>
        userInputs[q.id].map((item) => item.value).join("") ===
        q.correctSentence,
    );

    if (!allWordsSolved) {
      ValidationAlert.info(
        "Oops!",
        "Please arrange all the words correctly first.",
      );
      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info(
        "Oops!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let correctCount = 0;
    let wrong = [];

    lines.forEach((line) => {
      const isCorrect = correctMatches.some(
        (pair, index) =>
          `word-${index + 1}` === line.wordId && pair.image === line.image,
      );

      if (isCorrect) {
        correctCount++;
      } else {
        wrong.push(line.wordId);
      }
    });

    setWrongImages(wrong);

    const total = correctMatches.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
      Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    if (correctCount === total) ValidationAlert.success(scoreMessage);
    else if (correctCount === 0) ValidationAlert.error(scoreMessage);
    else ValidationAlert.warning(scoreMessage);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
            gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="page7-q2-container2">
            <h5 className="WB-header-title-page8">
              {" "}
              <span style={{ marginRight: "20px" }} className="WB-ex-A">
                {" "}
                B{" "}
              </span>
              Read and match.
            </h5>

            <div className="CB-review3-p1-q2-wrapper" ref={containerRef}>
              {/* الجمل */}
              <div className="CB-review3-p1-q2-words-row">
                {/* الصف الأول */}
                {questionsState.map((q, i) => (
                  <div className="WB-unit1-p3-q2-row" key={q.id}>
                    <div>
                      <div className="CB-unit5-p6-q1-word-with-dot">
                        <span className="CB-unit5-p6-q1-number">{q.id}</span>

                        <span
                          className={`CB-unit5-p6-q1-word-text ${
                            locked || showAnswer
                              ? "CB-unit5-p6-q1-disabled-word"
                              : ""
                          }`}
                          onClick={() =>
                            document.getElementById(`dot-word-${q.id}`).click()
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {q.matchWord}
                        </span>

                        {wrongWords.includes(q.matchWord) && (
                          <span className="CB-unit5-p6-q1-error-mark">✕</span>
                        )}
                      </div>

                      {/* Word Bank */}
                      <Droppable
                        droppableId={`bank-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="WB-unit1-p3-q2-word-bank"
                          >
                            {q.scrambled
                              .filter(
                                (letterObj) =>
                                  !userInputs[q.id].some(
                                    (item) => item.id === letterObj.id,
                                  ),
                              )
                              .map((letterObj, i) => (
                                <Draggable
                                  key={letterObj.id}
                                  draggableId={letterObj.id}
                                  index={i}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="WB-unit1-p3-q2-word-box"
                                      style={{
                                        textAlign: "center",
                                        cursor: "grab",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {letterObj.value}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* Sentence */}
                      <Droppable
                        droppableId={`sentence-${q.id}`}
                        direction="horizontal"
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`WB-unit1-p3-q2-unscramble-input ${
                              snapshot.isDraggingOver
                                ? "CB-unit5-p6-q1-active-drop"
                                : ""
                            }`}
                          >
                            {userInputs[q.id]
                              .map((item) => item.value)
                              .join("")}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                    <div className="CB-unit5-p6-q1-dot-wrapper">
                      <div
                        className="CB-unit5-p6-q1-dot CB-unit5-p6-q1-dot-start"
                        id={`dot-word-${q.id}`}
                        data-word-id={`word-${q.id}`}
                        onClick={handleStartDotClick}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* الصور */}
              <div className="CB-review3-p1-q2-images-row">
                {images.map((img) => (
                  <div key={img.id} className="CB-review3-p1-q2-img-box">
                    <img
                      src={img.src}
                      alt=""
                      className={`CB-review3-p1-q2-image ${
                        locked || showAnswer
                          ? "CB-review3-p1-q2-disabled-hover"
                          : ""
                      }`}
                      onClick={() =>
                        document.getElementById(`${img.id}-dot`).click()
                      }
                    />

                    <div
                      className="CB-review3-p1-q2-dot CB-review3-p1-q2-end-dot"
                      data-image={img.id}
                      id={`${img.id}-dot`}
                      onClick={handleEndDotClick}
                    ></div>
                  </div>
                ))}
              </div>

              {/* الخطوط */}
              <svg className="lines-layer">
                {lines.map((l, i) => (
                  <line
                    key={i}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke="red"
                    strokeWidth="3"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setLines([]);
              setWrongImages([]);
              setFirstDot(null);
              setShowAnswer(false);
              setLocked(false); // ⭐⭐ NEW: السماح بالرسم مجدداً
              setUserInputs({
                1: [],
                2: [],
                3: [],
                4: [],
              });
              setQuestionsState(
                initialQuestions.map((q) => ({
                  ...q,
                  currentLetters: [...q.scrambled],
                })),
              );
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          {/* Show Answer */}
          <button
            onClick={() => {
              const rect = containerRef.current.getBoundingClientRect();

              const getDotPosition = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return { x: 0, y: 0 };
                const r = el.getBoundingClientRect();
                return {
                  x: r.left - rect.left + 8,
                  y: r.top - rect.top + 8,
                };
              };

              const finalLines = correctMatches.map((line, index) => ({
                x1: getDotPosition(`[data-word-id="word-${index + 1}"]`).x,
                y1: getDotPosition(`[data-word-id="word-${index + 1}"]`).y,
                x2: getDotPosition(`[data-image="${line.image}"]`).x,
                y2: getDotPosition(`[data-image="${line.image}"]`).y,
                wordId: `word-${index + 1}`,
                image: line.image,
              }));

              const solvedInputs = {};
              initialQuestions.forEach((q) => {
                solvedInputs[q.id] = q.correctSentence
                  .split("")
                  .map((char, index) => ({
                    id: `answer-${q.id}-${char}-${index}`,
                    value: char,
                  }));
              });

              setUserInputs(solvedInputs);
              setLines(finalLines);
              setWrongImages([]);
              setWrongWords([]);
              setShowAnswer(true);
              setLocked(true);
            }}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers2} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page3_Q2;
