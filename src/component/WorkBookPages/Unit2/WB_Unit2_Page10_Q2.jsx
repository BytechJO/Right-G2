import React, { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 10/Ex D 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const exerciseData = [
  {
    id: 1,
    scrambled: "this/ a/ Is/ bird?",
    correctQuestion: "Is this a bird?",
    options: ["Yes, it is.", "No, it isn't."],
    correctOption: "No, it isn't.",
    image: img1,
  },
  {
    id: 2,
    scrambled: "these /Are /dogs?",
    correctQuestion: "Are these dogs?",
    options: ["Yes, they are.", "No, they aren't."],
    correctOption: "No, they aren't.",
    image: img2,
  },
  {
    id: 3,
    scrambled: "clouds /those /Are?",
    correctQuestion: "Are those clouds?",
    options: ["Yes, they are.", "No, they aren't."],
    correctOption: "Yes, they are.",
    image: img3,
  },
  {
    id: 4,
    scrambled: "pond /a /that/ Is?",
    correctQuestion: "Is that a pond?",
    options: ["Yes, it is.", "No, it isn't."],
    correctOption: "No, it isn't.",
    image: img4,
  },
];

const buildQuestionFromWords = (words) => {
  return words
    .map((w) => w.text)
    .join(" ")
    .replace(/\s+\?/g, "?")
    .trim();
};

const createInitialState = () =>
  exerciseData.reduce((acc, item) => {
    acc[item.id] = {
      arrangedWords: [],
      wordBank: item.scrambled
        .split("/")
        .map((w) => w.trim())
        .filter(Boolean)
        .map((word, index) => ({
          id: `${item.id}-word-${index}`,
          text: word,
          isUsed: false, // ✅ added
        })),
      selectedOption: null,
    };
    return acc;
  }, {});

const WB_Unit2_Page10_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState(createInitialState());
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleOptionClick = (id, option) => {
    if (locked) return;
    setUserAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], selectedOption: option },
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { source, destination } = result;
    const [, sourceItemId] = source.droppableId.split("-");
    const [, destItemId] = destination.droppableId.split("-");

    if (sourceItemId !== destItemId) return;

    const itemId = sourceItemId;

    setUserAnswers((prev) => {
      const current = { ...prev };
      const itemState = { ...current[itemId] };

      const sourceList = source.droppableId.startsWith("bank-")
        ? [...itemState.wordBank]
        : [...itemState.arrangedWords];

      const destList = destination.droppableId.startsWith("bank-")
        ? [...itemState.wordBank]
        : [...itemState.arrangedWords];

      let movedItem;

      if (source.droppableId.startsWith("bank-")) {
        movedItem = sourceList[source.index];
        sourceList[source.index] = { ...movedItem, isUsed: true }; // ✅ disable instead of remove
      } else {
        [movedItem] = sourceList.splice(source.index, 1);
      }

      destList.splice(destination.index, 0, movedItem);

      if (source.droppableId.startsWith("bank-")) {
        itemState.wordBank = sourceList;
      } else {
        itemState.arrangedWords = sourceList;
      }

      if (destination.droppableId.startsWith("bank-")) {
        itemState.wordBank = destList;
      } else {
        itemState.arrangedWords = destList;
      }

      current[itemId] = itemState;
      return current;
    });
  };

  const checkAnswers = () => {
    const allCompleted = exerciseData.every((item) => {
      return (
        userAnswers[item.id].arrangedWords.length > 0 &&
        userAnswers[item.id].selectedOption !== null
      );
    });

    if (!allCompleted) {
      ValidationAlert.info("Please complete all answers!");
      return;
    }

    let correctCount = 0;
    const totalItems = exerciseData.length * 2;

    exerciseData.forEach((item) => {
      const userAns = userAnswers[item.id];
      const builtQuestion = buildQuestionFromWords(userAns.arrangedWords);

      if (builtQuestion.toLowerCase() === item.correctQuestion.toLowerCase()) {
        correctCount++;
      }

      if (userAns.selectedOption === item.correctOption) {
        correctCount++;
      }
    });

    setChecked(true);
    setLocked(true);

    if (correctCount === totalItems) {
      ValidationAlert.success(`Score: ${correctCount}/${totalItems}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${totalItems}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};

    exerciseData.forEach((item) => {
      answers[item.id] = {
        arrangedWords: item.correctQuestion.split(" ").map((word, index) => ({
          id: `${item.id}-answer-${index}`,
          text: word,
        })),
        wordBank: [],
        selectedOption: item.correctOption,
      };
    });

    setUserAnswers(answers);
    setChecked(true);
    setLocked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers(createInitialState());
    setChecked(false);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        <div className="div-forall">
          <h1 className="WB-header-title-page8">
            <span className="WB-ex-A">D</span> Unscramble, look, write, and
            answer.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {exerciseData.map((item) => {
            const builtQuestion = buildQuestionFromWords(
              userAnswers[item.id].arrangedWords,
            );
            const questionCorrect =
              builtQuestion.toLowerCase() ===
              item.correctQuestion.toLowerCase();

            return (
              <div key={item.id} className="flex flex-col gap-4 relative">
                <div className="flex items-start gap-3">
                  <span className="text-blue-700 font-bold text-xl">
                    {item.id}
                  </span>

                  <div className="flex flex-col gap-3">
                    <Droppable
                      droppableId={`bank-${item.id}`}
                      direction="horizontal"
                      isDropDisabled={true}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[56px] w-full border border-dashed border-gray-400 rounded-lg p-3 flex flex-wrap gap-2 bg-gray-50"
                        >
                          {userAnswers[item.id].wordBank.map((word, index) => (
                            <Draggable
                              key={word.id}
                              draggableId={word.id}
                              index={index}
                              isDragDisabled={locked || word.isUsed} // ✅ updated
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`px-3 py-1 border rounded-md text-lg
                                    ${
                                      word.isUsed
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white cursor-grab"
                                    }`}
                                  style={provided.draggableProps.style}
                                >
                                  {word.text}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    <Droppable
                      droppableId={`answer-${item.id}`}
                      direction="horizontal"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[56px] w-full border-2 rounded-lg p-3 flex flex-wrap gap-2 bg-white
                          ${
                            checked
                              ? questionCorrect
                                ? "border-green-400"
                                : "border-red-400"
                              : "border-gray-300"
                          }`}
                        >
                          {userAnswers[item.id].arrangedWords.map(
                            (word, index) => (
                              <Draggable
                                key={word.id}
                                draggableId={word.id}
                                index={index}
                                isDragDisabled={locked}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-md text-lg"
                                    style={provided.draggableProps.style}
                                  >
                                    {word.text}
                                  </div>
                                )}
                              </Draggable>
                            ),
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {checked && (
                      <span className="text-lg">
                        {questionCorrect ? "" : "✕"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col gap-2">
                    {item.options.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleOptionClick(item.id, option)}
                        className={`cursor-pointer px-4 py-1 rounded-full border-2 transition-all text-lg
                          ${
                            userAnswers[item.id].selectedOption === option
                              ? "border-gray-500 bg-gray-50"
                              : "border-transparent hover:bg-gray-50"
                          }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>

                  <div className="w-32 h-32 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt="exercise"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit2_Page10_Q2;