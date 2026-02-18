import React, { useState ,useRef,useEffect} from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review4_Page2_Q3.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Review4_Page2_Q3 = () => {
  const items = [
    { img: img1, correct: "a_e", correctInput: "lake", option: ["ay", "a_e"] },
    {
      img: img2,
      correct: "ai",
      correctInput: "rain",
      option: ["ai", "a_e"],
    },
    {
      img: img3,
      correct: "ay",
      correctInput: "play",
      option: ["ay", "a_e"],
    },
    {
      img: img4,
      correct: "a_e",
      correctInput: "cake",
      option: ["a_e", "ai"],
    },
  ];

  const [selected, setSelected] = useState(["", "", "", ""]);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [locked, setLocked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const value = draggableId.replace("word-", "").replace("filled-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = value;
      return updated;
    });

    setShowResult(false);
  };

  const handleSelect = (value, index) => {
    if (locked) return; // 🔒 لا تعديل بعد show answer
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setShowResult(false);
  };

  const resetAll = () => {
    setSelected(["", "", "", ""]);
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowResult(false);
    setLocked(false); // 🔒 قفل كل شيء
  };
  const showAnswers = () => {
    // حط الدوائر الصح
    const correctCircles = items.map((item) => item.correct);

    // حط الكتابة الصحيحة
    const correctTexts = items.map((item) => item.correctInput);

    setSelected(correctCircles);
    setAnswers(correctTexts);
    setWrongInputs([]);
    setShowResult(false);

    setLocked(true); // 🔒 قفل كل شيء
  };

  const checkAnswers = () => {
    if (locked) return;
    // 1) التشييك إذا في دائرة مش مختارة
    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }

    // 2) التشييك إذا في input فاضي
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let wrong = [];
    let score = 0;
    setLocked(true);
    items.forEach((item, i) => {
      const circleCorrect = selected[i] === item.correct;
      const inputCorrect =
        answers[i].trim().toLowerCase() === item.correctInput.toLowerCase();

      // نقطة للدائرة + نقطة للكتابة
      if (circleCorrect) score++;
      if (inputCorrect) score++;

      if (!circleCorrect || !inputCorrect) {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowResult(true);

    const total = items.length * 2; // 8 نقاط
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>F</span> Circle and write.
          </h5>
       
          <Droppable droppableId="bank" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.correctInput}
                    draggableId={`word-${item.correctInput}`}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.correctInput}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="question-grid-CB-review2-p2-q3">
            {items.map((item, i) => (
              <div className="question-box-CB-review2-p2-q3" key={i}>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: "#1d4f7b",
                  }}
                >
                  {i + 1}
                </span>

                <div className="img-option-CB-review2-p2-q3">
                  <img
                    src={item.img}
                    className="q-img-CB-review2-p2-q3"
                    style={{ height: "auto", width: "200px" }}
                  />

                  {/* f / v choices */}
                  <div className="choices-CB-review2-p2-q3">
                    {item.option.map((op, index) => (
                      <div className="circle-wrapper" key={index}>
                        <div
                          className={`circle-choice-CB-review2-p2-q3 ${
                            selected[i] === `${op}` ? "active" : ""
                          }`}
                          onClick={() => !locked && handleSelect(op, i)}
                        >
                          {op}
                        </div>

                        {showResult &&
                          selected[i] === `${op}` &&
                          selected[i] !== item.correct && (
                            <div className="wrong-mark-CB-review2-p2-q3 ">
                              ✕
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* writing input */}
                <div className="input-wrapper-CB-review2-p2-q3">
                  {item.input}

                  <Droppable droppableId={`slot-${i}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`write-input-CB-review2-p2-q3 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[i] && (
                          <Draggable
                            draggableId={`filled-${answers[i]}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[i]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {showResult &&
                    answers[i].trim() !== "" &&
                    answers[i].trim().toLowerCase() !==
                      item.correctInput.toLowerCase() &&
                    wrongInputs.includes(i) && (
                      <div className="wrong-mark-CB-review2-p2-q3 ">✕</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review4_Page2_Q3;
