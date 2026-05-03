import { useState } from "react";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex H 1.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const WB_Unit1_Page6_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [checked, setChecked] = useState(false);
  const words = [
    "Stella",
    "he is",
    "is",
    "uncle",
    "she is stella's",
    "is stella's",
    "she is",
    "sister",
    "stella's mother",
  ];
  const correctAnswers = {
    1: "Stella",
    2: "he is",
    3: "is",
    4: "uncle",
    5: "she is stella's",
    6: "is stella's",
    7: "she is",
    8: "sister",
    9: "stella's mother",
  };
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const inputId = destination.droppableId;

    setUserAnswers((prev) => ({
      ...prev,
      [inputId]: draggableId,
    }));
  };

  const checkAnswers = () => {
     if (showAnswers ||checked ||showResults) return;
    const hasEmptyInputs = Object.values(userAnswers).some(
      (value) => !value || value.trim() === "",
    );

    if (hasEmptyInputs) {
      ValidationAlert.info("Please complete all answers first.");
      return;
    }

    let currentScore = 0;
    const totalQuestions = Object.keys(correctAnswers).length;

    Object.keys(correctAnswers).forEach((id) => {
      const userAnswer = userAnswers[id]?.toLowerCase().trim();
      const correctAnswer = correctAnswers[id].toLowerCase();

      if (userAnswer === correctAnswer) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setChecked(true); // ⭐ هنا

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 1) {
      ValidationAlert.warning(
        `Score: ${currentScore} / ${totalQuestions}`,
      );
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {
      1: "Stella",
      2: "he is",
      3: "is",
      4: "uncle",
      5: "she is stella's",
      6: "is stella's",
      7: "she is",
      8: "sister",
      9: "stella's mother",
    };
    setShowResults(true);
    setShowAnswers(true);
    setUserAnswers(answers);
  };

  const handleStartAgain = () => {
    setUserAnswers({
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
    });
    setShowResults(false);
    setShowAnswers(false);
    setChecked(false)
  };

  const isWrongAnswer = (id) =>
    checked &&
    userAnswers[id] &&
    userAnswers[id].toLowerCase().trim() !== correctAnswers[id].toLowerCase();

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
          className="div-forall" style={{gap:"25px"}}
       
        >
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">H</span>Look, read, and complete.
          </h1>
          <div className="flex flex-col gap-5">
          <Droppable droppableId="words" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  // border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {words.map((word, index) => {
                  const isUsed = Object.values(userAnswers).includes(word);
                  return (
                    <Draggable
                      key={word}
                      draggableId={word}
                      index={index}
                      isDragDisabled={checked || showAnswers || isUsed}
                      className="touch-none"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="WB-word-bank"
                          style={{
                            
                            background: isUsed ? "#ccc" : "white",
                            opacity: isUsed ? 0.6 : 1,
                            cursor: isUsed ? "not-allowed" : "grab",
                            // fontSize: "17px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {word}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Family Image with Numbers */}
            <div className="relative overflow-hidden">
              <img src={img} className="max-w-full max-h-87" />
              {/* Simplified representation of numbers on image */}
              <div className="absolute inset-0 pointer-events-none"></div>
            </div>

            {/* Sentences */}
            <div className="flex-1 bg-white border-2 border-gray-300 rounded-2xl p-6 space-y-4 text-xl">
              <div className="flex items-center gap-2">
                <span>1. She is</span>
                <Droppable droppableId="1">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(1) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[1] &&
                        userAnswers[1].toLowerCase().trim() !==
                          correctAnswers[1].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[1]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>2.</span>
                <Droppable droppableId="2">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(2) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[2] &&
                        userAnswers[2].toLowerCase().trim() !==
                          correctAnswers[2].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[2]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>is John.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex w-[50px]">3. He</span>
                <Droppable droppableId="3">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(3) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[3] &&
                        userAnswers[3].toLowerCase().trim() !==
                          correctAnswers[3].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[3]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>Stella's</span>
                <Droppable droppableId="4">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(4) ? "border-red-500" : "border-gray-400"}`}
                      style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[4] &&
                        userAnswers[4].toLowerCase().trim() !==
                          correctAnswers[4].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[4]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <div className="flex items-center gap-2">
                <span>4.</span>
                <Droppable droppableId="5">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(5) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[5] &&
                        userAnswers[5].toLowerCase().trim() !==
                          correctAnswers[5].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[5]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>aunt.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>5. He</span>
                <Droppable droppableId="6">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(6) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[6] &&
                        userAnswers[6].toLowerCase().trim() !==
                          correctAnswers[6].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[6]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>dad.</span>
              </div>
              <div className="flex items-center gap-2  relative">
                <span>6.</span>
                <Droppable droppableId="7">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(7) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[7] &&
                        userAnswers[7].toLowerCase().trim() !==
                          correctAnswers[7].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[7]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>Stella's.</span>
                <Droppable droppableId="8">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(8) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[8] &&
                        userAnswers[8].toLowerCase().trim() !==
                          correctAnswers[8].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[8]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              <div className="flex items-center gap-2 relative">
                <span>7. She is</span>
                <Droppable droppableId="9">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`relative border-b-2 w-30 text-center min-h-[30px] ${
                        snapshot.isDraggingOver ? "bg-yellow-100" : ""
                      } ${isWrongAnswer(9) ? "border-red-500" : "border-gray-400"}`}
                       style={{whiteSpace:"nowrap"}}
                    >
                      {checked &&
                        userAnswers[9] &&
                        userAnswers[9].toLowerCase().trim() !==
                          correctAnswers[9].toLowerCase() && (
                          <div className="wb-wrong-icon-unit1-page6-q1">✕</div>
                        )}
                      {userAnswers[9]}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <span>.</span>
              </div>
            </div>
          </div>
</div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page6_Q1;
