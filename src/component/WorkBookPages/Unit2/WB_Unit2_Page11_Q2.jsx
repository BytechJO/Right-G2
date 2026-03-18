import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialWords = ["birds", "clock", "clouds", "ducks", "apples"];

const correctAnswers = {
  sentence1: "apples",
  sentence2: "birds",
  sentence3: "ducks",
  sentence4: "clock",
  sentence5: "clouds",
};

const sentenceData = [
  { id: "sentence1", textBefore: "Those are", textAfter: "in the tree." },
  { id: "sentence2", textBefore: "Those are", textAfter: "in the sky." },
  { id: "sentence3", textBefore: "Those are", textAfter: "in the pond." },
  { id: "sentence4", textBefore: "That is a", textAfter: "." },
  { id: "sentence5", textBefore: "Those are dark", textAfter: "." },
];

const WB_Unit2_Page11_Q2 = () => {
  const [wordBank, setWordBank] = useState(initialWords);
  const [answers, setAnswers] = useState({
    sentence1: "",
    sentence2: "",
    sentence3: "",
    sentence4: "",
    sentence5: "",
  });

  const [checked, setChecked] = useState(false);

  const handleStartAgain = () => {
    setWordBank(initialWords);
    setAnswers({
      sentence1: "",
      sentence2: "",
      sentence3: "",
      sentence4: "",
      sentence5: "",
    });
    setChecked(false);
  };

  const handleShowAnswer = () => {
    setAnswers(correctAnswers);
    setWordBank([]);
    setChecked(true);
  };

 const checkAnswers = () => {
  const allFilled = Object.values(answers).every(
    (answer) => answer.trim() !== ""
  );

  if (!allFilled) {
    ValidationAlert.info("Please complete all blanks first!");
    return;
  }

  let correct = 0;
  const total = 5;

  Object.keys(correctAnswers).forEach((key) => {
    if (answers[key] === correctAnswers[key]) {
      correct++;
    }
  });

  setChecked(true);

  if (correct === total) {
    ValidationAlert.success(`Score: ${correct}/${total}`);
  } else if (correct >0) {
    ValidationAlert.warning(`Score: ${correct}/${total}`);
  }   else  {
    ValidationAlert.error(`Score: ${correct}/${total}`);
  }
};

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceDroppable = source.droppableId;
    const destinationDroppable = destination.droppableId;

    if (sourceDroppable === destinationDroppable) return;

    // من صندوق الكلمات إلى جملة
    if (sourceDroppable === "wordBank" && destinationDroppable !== "wordBank") {
      const draggedWord = wordBank[source.index];

      // إذا المكان فيه كلمة، رجعيها للصندوق أول
      const existingWord = answers[destinationDroppable];

      const newWordBank = [...wordBank];
      newWordBank.splice(source.index, 1);

      if (existingWord) {
        newWordBank.push(existingWord);
      }

      setWordBank(newWordBank);
      setAnswers((prev) => ({
        ...prev,
        [destinationDroppable]: draggedWord,
      }));
      return;
    }

    // من جملة إلى صندوق الكلمات
    if (sourceDroppable !== "wordBank" && destinationDroppable === "wordBank") {
      const draggedWord = answers[sourceDroppable];
      if (!draggedWord) return;

      setAnswers((prev) => ({
        ...prev,
        [sourceDroppable]: "",
      }));

      const newWordBank = [...wordBank];
      newWordBank.splice(destination.index, 0, draggedWord);
      setWordBank(newWordBank);
      return;
    }

    // من جملة إلى جملة ثانية
    if (sourceDroppable !== "wordBank" && destinationDroppable !== "wordBank") {
      const sourceWord = answers[sourceDroppable];
      const destinationWord = answers[destinationDroppable];

      setAnswers((prev) => ({
        ...prev,
        [sourceDroppable]: destinationWord || "",
        [destinationDroppable]: sourceWord || "",
      }));
    }
  };

  const isWrongAnswer = (sentenceId) => {
    return (
      checked &&
      answers[sentenceId] &&
      answers[sentenceId] !== correctAnswers[sentenceId]
    );
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">L</span>
          Look, read, and complete. Use the words from the box.
        </h1>

        <div
          className="family-completion-activity p-6 max-w-4xl mx-auto"
          dir="ltr"
        >
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Word Box */}
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided) => (
                <div
                  className="words-box mb-2 border-2 border-blue-200 rounded-xl flex flex-wrap justify-center items-center min-h-[65px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {wordBank.map((word, index) => (
                    <Draggable key={word} draggableId={word} index={index}>
                      {(provided, snapshot) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`m-1 px-4 py-2 bg-white border-2 border-blue-300 rounded-full text-blue-700 font-medium shadow-sm transition-colors cursor-grab ${
                            snapshot.isDragging
                              ? "bg-blue-50"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          {word}
                        </span>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="sentences">
              {sentenceData.map((sentence, index) => (
                <div
                  key={sentence.id}
                  className="flex items-center gap-4 p-5 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="text-xl text-gray-800 flex items-center flex-wrap gap-2">
                      <span className="font-semibold text-blue-600 mr-2">
                        {index + 1}.
                      </span>

                      <span>{sentence.textBefore}</span>

                      <Droppable droppableId={sentence.id}>
                        {(provided, snapshot) => (
                          <span
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`relative inline-flex items-center justify-center w-[100px] h-[40px] px-2 py-2 border-2 rounded-lg bg-white ${
                              snapshot.isDraggingOver
                                ? "border-blue-500 bg-blue-50"
                                : isWrongAnswer(sentence.id)
                                  ? "border-red-500"
                                  : "border-gray-300"
                            }`}
                          >
                            <Draggable
                              draggableId={answers[sentence.id]}
                              index={0}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="text-lg font-medium text-gray-800 cursor-grab whitespace-nowrap"
                                >
                                  {answers[sentence.id]}
                                </span>
                              )}
                            </Draggable>
                            {isWrongAnswer(sentence.id) && (
                              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
                                ✕
                              </div>
                            )}
                            {provided.placeholder}
                          </span>
                        )}
                      </Droppable>

                      <span>{sentence.textAfter}</span>
                    </p>
                  </div>

                  <div className="relative">
                    <img
                      src={img}
                      className="max-w-24 max-h-24 object-contain"
                      alt="exercise"
                    />
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>

          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page11_Q2;
