import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DropBox = ({ id, value, isWrong }) => (
  <Droppable droppableId={id}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`WB-unit1-p8-q3-input ${
          snapshot.isDraggingOver ? "drag-over-cell" : ""
        }`}
        style={{
          position: "relative",
          background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
          fontSize: "25px",
          fontWeight: "600",
        }}
      >
        {value}

        {isWrong && <div className="wrong-icon-unit1-page8-q3">✕</div>}

        {provided.placeholder}
      </div>
    )}
  </Droppable>
);
const WB_Unit1_Page8_Q3 = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [wrongAnswers, setWrongAnswers] = useState({});
  const lettersBank = ["r", "l"].map((letter, i) => ({
    id: `l-${i}`,
    value: letter,
  }));
  const [showAnswer, setShowAnswer] = useState(false); // ⭐ NEW
  const [answers, setAnswers] = useState({
    sentence1a: null,
    sentence1b: null,
    sentence2: null,
    sentence3: null,
  });
  const correctAnswers = {
    sentence1a: "r",
    sentence1b: "r",
    sentence2: "l",
    sentence3: "l",
  };

  const handleShowAnswer = () => setAnswers(correctAnswers);
  const handleStartAgain = () => {
    setAnswers({
      sentence1a: null,
      sentence1b: null,
      sentence2: null,
      sentence3: null,
    });
    setWrongAnswers({});
    setShowAlert(false);
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const letter = lettersBank.find((l) => l.id === result.draggableId).value;
    const field = result.destination.droppableId;

    setAnswers((prev) => ({
      ...prev,
      [field]: letter,
    }));

    setWrongAnswers((prev) => ({
      ...prev,
      [field]: false,
    }));
  };
  const checkAnswers = () => {
    const allFilled = Object.values(answers).every((answer) => answer !== null);

    if (!allFilled) {
      ValidationAlert.info("Please fill in all answers!");
      return;
    }

    let correct = 0;
    const total = 4;

    const newWrongAnswers = {
      sentence1a: answers.sentence1a !== correctAnswers.sentence1a,
      sentence1b: answers.sentence1b !== correctAnswers.sentence1b,
      sentence2: answers.sentence2 !== correctAnswers.sentence2,
      sentence3: answers.sentence3 !== correctAnswers.sentence3,
    };

    if (!newWrongAnswers.sentence1a) correct++;
    if (!newWrongAnswers.sentence1b) correct++;
    if (!newWrongAnswers.sentence2) correct++;
    if (!newWrongAnswers.sentence3) correct++;

    setWrongAnswers(newWrongAnswers);
    setScore({ correct, total });

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct > 0) {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          {" "}
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">C</span>Listen. Write and read the
            sentences.
          </h1>
          <Droppable droppableId="letters" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  marginTop: "20px",
                  justifyContent: "center",
                  width: "100%",
                  // justifyContent: "center",
                }}
              >
                {lettersBank.map((l, i) => (
                  <Draggable
                    key={l.id}
                    draggableId={l.id}
                    index={i}
                    isDragDisabled={showAnswer}
                  >
                    {(provided) => (
                      <div
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
                          fontSize: "22px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {l.value}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div
            className="family-completion-activity p-6 max-w-4xl mx-auto"
            dir="ltr"
          >
            <div className="flex items-start gap-8">
              <div className="sentences flex-1">
                <div className="flex items-center gap-4 p-5 rounded-xl ">
                  <div className="flex-1">
                    <p className="text-xl text-gray-800">
                      <span className="font-semibold text-blue-600 mr-2">
                        1.
                      </span>
                      "Look There's a
                      <DropBox
                        id="sentence1a"
                        value={answers.sentence1a}
                        isWrong={wrongAnswers.sentence1a}
                      />
                      abbit on the
                      <DropBox
                        id="sentence1b"
                        value={answers.sentence1b}
                        isWrong={wrongAnswers.sentence1b}
                      />
                      oad.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-xl ">
                  <div className="flex-1">
                    <p className="text-xl text-gray-800">
                      <span className="font-semibold text-blue-600 mr-2">
                        2.
                      </span>
                      Larry has long
                      <DropBox
                        id="sentence2"
                        value={answers.sentence2}
                        isWrong={wrongAnswers.sentence2}
                      />
                      egs.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-xl ">
                  <div className="flex-1">
                    <p className="text-xl text-gray-800">
                      <span className="font-semibold text-blue-600 mr-2">
                        3.
                      </span>
                      There is a
                      <DropBox
                        id="sentence3"
                        value={answers.sentence3}
                        isWrong={wrongAnswers.sentence3}
                      />
                      amp on the table.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-64">
                <img
                  src={img}
                  alt="Rabbit"
                  className="rounded-xl shadow-lg max-w-100 max-h-75 object-cover"
                />
              </div>
            </div>

            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
            {showAlert && (
              <ValidationAlert
                correct={score.correct}
                total={score.total}
                onClose={() => setShowAlert(false)}
              />
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page8_Q3;
