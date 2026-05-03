import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex F 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Asset 1.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialWords = [
  { id: "birds", text: "birds", isUsed: false },
  { id: "clock", text: "clock", isUsed: false },
  { id: "clouds", text: "clouds", isUsed: false },
  { id: "ducks", text: "ducks", isUsed: false },
  { id: "apples", text: "apples", isUsed: false },
];

const correctAnswers = {
  sentence1: "apples",
  sentence2: "birds",
  sentence3: "ducks",
  sentence4: "clock",
  sentence5: "clouds",
};

const sentenceData = [
  {
    id: "sentence1",
    textBefore: "Those are",
    textAfter: "in the tree.",
    img: img1,
  },
  {
    id: "sentence2",
    textBefore: "Those are",
    textAfter: "in the sky.",
    img: img2,
  },
  {
    id: "sentence3",
    textBefore: "Those are",
    textAfter: "in the pond.",
    img: img3,
  },
  { id: "sentence4", textBefore: "That is a", textAfter: ".", img: img5 },
  { id: "sentence5", textBefore: "Those are dark", textAfter: ".", img: img4 },
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
  setWordBank((prev) =>
    prev.map((word) => ({
      ...word,
      isUsed: true,
    })),
  );
  setChecked(true);
};

  const checkAnswers = () => {
    if(checked)return
    const allFilled = Object.values(answers).every(
      (answer) => answer.trim() !== "",
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
    } else if (correct > 0) {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  const onDragEnd = (result) => {
     if (checked) return;

  const { source, destination } = result;

  if (!destination) return;

  const sourceDroppable = source.droppableId;
  const destinationDroppable = destination.droppableId;

  if (sourceDroppable === destinationDroppable) return;
    // من صندوق الكلمات إلى جملة
    if (sourceDroppable === "wordBank" && destinationDroppable !== "wordBank") {
      const draggedWord = wordBank[source.index];
      if (!draggedWord || draggedWord.isUsed) return;

      const existingWord = answers[destinationDroppable];
      const newWordBank = [...wordBank];

      newWordBank[source.index] = { ...draggedWord, isUsed: true };

      if (existingWord) {
        const existingIndex = newWordBank.findIndex(
          (w) => w.text === existingWord,
        );

        if (existingIndex !== -1) {
          newWordBank[existingIndex] = {
            ...newWordBank[existingIndex],
            isUsed: false,
          };
        }
      }

      setWordBank(newWordBank);
      setAnswers((prev) => ({
        ...prev,
        [destinationDroppable]: draggedWord.text,
      }));
      return;
    }

    // من جملة إلى صندوق الكلمات
    if (sourceDroppable !== "wordBank" && destinationDroppable === "wordBank") {
      const draggedWord = answers[sourceDroppable];
      if (!draggedWord) return;

      const newWordBank = [...wordBank];
      const existingIndex = newWordBank.findIndex((w) => w.text === draggedWord);

      if (existingIndex !== -1) {
        newWordBank[existingIndex] = {
          ...newWordBank[existingIndex],
          isUsed: false,
        };
      }

      setWordBank(newWordBank);
      setAnswers((prev) => ({
        ...prev,
        [sourceDroppable]: "",
      }));
      return;
    }

    // من جملة إلى جملة ثانية
    if (sourceDroppable !== "wordBank" && destinationDroppable !== "wordBank") {
      const sourceWord = answers[sourceDroppable];
      const destinationWord = answers[destinationDroppable];

      const newWordBank = [...wordBank];

      if (destinationWord) {
        const destinationIndex = newWordBank.findIndex(
          (w) => w.text === destinationWord,
        );

        if (destinationIndex !== -1) {
          newWordBank[destinationIndex] = {
            ...newWordBank[destinationIndex],
            isUsed: false,
          };
        }
      }

      if (sourceWord) {
        const sourceIndex = newWordBank.findIndex((w) => w.text === sourceWord);

        if (sourceIndex !== -1) {
          newWordBank[sourceIndex] = {
            ...newWordBank[sourceIndex],
            isUsed: true,
          };
        }
      }

      setWordBank(newWordBank);
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
      <div className="div-forall"  style={{gap:"20px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">F</span>
    Look, read, and complete. Use the words from the box.
        </h1>

        <div
          className="family-completion-activity"
          dir="ltr"
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided) => (
                <div
                  className="words-box mb-5 rounded-xl flex flex-wrap gap-5 justify-center items-center min-h-[65px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {wordBank.map((word, index) => (
                    <Draggable
                      key={word.id}
                      draggableId={word.id}
                      index={index}
                      isDragDisabled={word.isUsed}
                    >
                      {(provided, snapshot) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          className={`WB-word-bank  ${
                            word.isUsed
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : snapshot.isDragging
                                ? "bg-blue-50 text-blue-900 border-blue-900 cursor-grab"
                                : "bg-white text-blue-900 border-blue-900 cursor-grab hover:bg-blue-50"
                          }`}
                        >
                          {word.text}
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
                  className="flex items-center gap-4 rounded-xl"
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
                            className={`relative inline-flex items-center justify-center w-[100px] h-[40px] px-2 py-2 border-b-2 ${
                              snapshot.isDraggingOver
                                ? "border-blue-500 bg-blue-50"
                                : isWrongAnswer(sentence.id)
                                  ? "border-red-500"
                                  : "border-gray-300"
                            }`}
                          >
                            {answers[sentence.id] && (
                              <Draggable
                                draggableId={`${sentence.id}-${answers[sentence.id]}`}
                                index={0}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={provided.draggableProps.style}
                                    className="text-lg font-medium text-gray-800 cursor-grab whitespace-nowrap"
                                  >
                                    {answers[sentence.id]}
                                  </span>
                                )}
                              </Draggable>
                            )}

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
                      src={sentence.img}
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