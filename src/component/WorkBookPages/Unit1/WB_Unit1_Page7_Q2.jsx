import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 7/Ex L 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 7/Ex L 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 7/Ex L 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 7/Ex L 4.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit1_Page7_Q2 = () => {
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnswers, setShowAnswers] = useState(false);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState({
    sentence1a: "",
    sentence1b: "",
    sentence2b: "",
    sentence2: "",
    sentence3: "",
    sentence4: "",
  });

  const correctAnswers = {
    sentence1a: "sister",
    sentence1b: "cousin",
    sentence2b: "play",
    sentence2: "aunt",
    sentence3: "brother",
    sentence4: "uncle",
  };

  const words = ["play", "aunt", "uncle", "sister", "brother", "cousin"];

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === "words") return;

    setAnswers((prev) => ({
      ...prev,
      [destination.droppableId]: draggableId,
    }));
  };

  const checkAnswers = () => {
    const allFilled = Object.values(answers).every(
      (answer) => answer.trim() !== "",
    );

    if (!allFilled) {
      ValidationAlert.info("Please fill in all answers first.");
      return;
    }

    let correct = 0;
    const total = 6;

    if (answers.sentence1a.toLowerCase().trim() === correctAnswers.sentence1a)
      correct++;
    if (answers.sentence1b.toLowerCase().trim() === correctAnswers.sentence1b)
      correct++;
    if (answers.sentence2b.toLowerCase().trim() === correctAnswers.sentence2b)
      correct++;
    if (answers.sentence2.toLowerCase().trim() === correctAnswers.sentence2)
      correct++;
    if (answers.sentence3.toLowerCase().trim() === correctAnswers.sentence3)
      correct++;
    if (answers.sentence4.toLowerCase().trim() === correctAnswers.sentence4)
      correct++;

    setScore({ correct, total });
    setChecked(true);

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setShowAnswers(true);
    setChecked(false);
  };

  const handleStartAgain = () => {
    setAnswers({
      sentence1a: "",
      sentence1b: "",
      sentence2b: "",
      sentence2: "",
      sentence3: "",
      sentence4: "",
    });
    setShowAnswers(false);
    setChecked(false);
  };

  const renderDropZone = (field, width = "w-32") => {
    const isWrong =
      checked &&
      answers[field]?.trim() &&
      answers[field].toLowerCase().trim() !==
        correctAnswers[field].toLowerCase().trim();

    return (
      <div className="relative inline-flex">
        {isWrong && (
          <div className="absolute -top-2 -right-2 z-10 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
            ✕
          </div>
        )}

        <Droppable droppableId={field}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`inline-flex mx-3 px-2 min-h-[44px] ${width} items-center justify-center border-b-2 text-center text-lg align-middle ${
                snapshot.isDraggingOver
                  ? "bg-yellow-100 border-yellow-400"
                  : "border-gray-400"
              }`}
            >
              <span>{answers[field] || ""}</span>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
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
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">L</span> Look, read, and complete. Use the
            words from the box.
          </h1>

          <div className="family-completion-activity p-6" dir="ltr">
            <Droppable droppableId="words" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="words-box mb-8 p-4 border-2 border-blue-200 rounded-xl flex flex-wrap justify-center items-center gap-2"
                >
                  {words.map((word, index) => {
                    const isUsed = Object.values(answers).includes(word);
                    return (
                      <Draggable
                        key={word}
                        draggableId={word}
                        index={index}
                        isDragDisabled={isUsed} // 🔥 هذا المهم
                      >
                        {(provided) => (
                          <span
                            ref={provided.innerRef}{...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="px-4 py-2 bg-white rounded text-blue-700 font-medium shadow-sm"
                              style={{
    ...provided.draggableProps.style, // 🔥 هذا أهم سطر
    background: isUsed ? "#ccc" : "white",
    opacity: isUsed ? 0.5 : 1,
    cursor: isUsed ? "not-allowed" : "grab",
    padding: "8px 16px",
    borderRadius: "6px",
  }}
                            
                          >
                            {word}
                          </span>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="sentences">
              <div className="flex items-center gap-4 rounded-xl">
                <div className="flex-1">
                  <p className="text-xl text-gray-800 leading-loose">
                    <span className="font-semibold text-blue-600 mr-2">1.</span>
                    My
                    {renderDropZone("sentence1a")}
                    and
                    {renderDropZone("sentence1b")}
                    <br />
                    {renderDropZone("sentence2b")}
                    all day, Stella says.
                  </p>
                </div>
                <img
                  src={img1}
                  alt="sentence1"
                  className="max-w-16 max-h-16 object-contain"
                />
              </div>

              <div className="flex items-center gap-4 rounded-xl">
                <div className="flex-1">
                  <p className="text-xl text-gray-800 leading-loose">
                    <span className="font-semibold text-blue-600 mr-2">2.</span>
                    I'm Stella's
                    {renderDropZone("sentence2")}.
                  </p>
                </div>
                <img
                  src={img2}
                  alt="sentence2"
                  className="max-w-16 max-h-16 object-contain"
                />
              </div>

              <div className="flex items-center gap-4 rounded-xl">
                <div className="flex-1">
                  <p className="text-xl text-gray-800 leading-loose">
                    <span className="font-semibold text-blue-600 mr-2">3.</span>
                    He's my
                    {renderDropZone("sentence3")}.
                  </p>
                </div>
                <img
                  src={img3}
                  alt="sentence3"
                  className="max-w-16 max-h-16 object-contain"
                />
              </div>

              <div className="flex items-center gap-4 rounded-xl">
                <div className="flex-1">
                  <p className="text-xl text-gray-800 leading-loose">
                    <span className="font-semibold text-blue-600 mr-2">4.</span>
                    I'm Stella's
                    {renderDropZone("sentence4")}.
                  </p>
                </div>
                <img
                  src={img4}
                  alt="sentence4"
                  className="max-w-16 max-h-16 object-contain"
                />
              </div>
            </div>

            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit1_Page7_Q2;
