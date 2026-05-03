import { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 5/Ex G 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit1_Page5_Q2 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: { q: "", a: "" },
    2: { q: "", a: "" },
    3: { q: "", a: "" },
    4: { q: "", a: "" },
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [checked, setChecked] = useState(false);
  const words = [
    { id: "she", text: "she" },
    { id: "he", text: "he" },
    { id: "shes", text: "She's" },
    { id: "hes", text: "He's" },
  ];
  const correctAnswers = {
    1: { q: "she", a: "She's" },
    2: { q: "she", a: "She's" },
    3: { q: "he", a: "He's" },
    4: { q: "he", a: "He's" },
  };
const WORD_LIMITS = {
  she: 2,
  he: 2,
  "She's": 2,
  "He's": 2,
};

const getWordUsageCount = (word) => {
  let count = 0;

  Object.values(userAnswers).forEach((item) => {
    if (item.q === word) count++;
    if (item.a === word) count++;
  });

  return count;
};
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    const [id, field] = destination.droppableId.split("-");

    handleInputChange(id, field, draggableId);
  };
  const handleInputChange = (id, field, value) => {
    setUserAnswers({
      ...userAnswers,
      [id]: { ...userAnswers[id], [field]: value },
    });
  };
  const checkAnswers = () => {
     if (showAnswers ||checked) return;
    const hasEmptyInputs = Object.values(userAnswers).some(
      (item) => !item.q?.trim() || !item.a?.trim(),
    );

    if (hasEmptyInputs) {
      ValidationAlert.info("Please complete all answers first.");
      return;
    }

    let currentScore = 0;
    const totalQuestions = Object.keys(correctAnswers).length * 2;

    Object.keys(correctAnswers).forEach((id) => {
      const userQ = userAnswers[id]?.q?.toLowerCase().trim();
      const correctQ = correctAnswers[id]?.q?.toLowerCase().trim();

      const userA = userAnswers[id]?.a?.toLowerCase().trim();
      const correctA = correctAnswers[id]?.a?.toLowerCase().trim();

      if (userQ === correctQ) currentScore++;
      if (userA === correctA) currentScore++;
    });

    setScore(currentScore);
    setChecked(true);

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  const handleShowAnswer = () => {
    setUserAnswers(correctAnswers);
    setShowAnswers(true);
    setChecked(false);
  };

  const handleStartAgain = () => {
    setUserAnswers({
      1: { q: "", a: "" },
      2: { q: "", a: "" },
      3: { q: "", a: "" },
      4: { q: "", a: "" },
    });

    setShowResults(false);
    setShowAnswers(false);
    setChecked(false);
  };
  const data = [
    { id: 1, img: img1, name: "Stella." },
    { id: 2, img: img2, name: "Sarah." },
    { id: 3, img: img3, name: "John." },
    { id: 4, img: img4, name: "Jack." },
  ];

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
         style={{gap:"20px"}}
        >
          <h1 className="WB-header-title-page8">
            <div className="WB-ex-A">G</div>Look, read, and complete.
          </h1>
          
          <div >
          <div className="flex justify-center">
            <Droppable
              droppableId="words"
              direction="horizontal"
              isDragDisabled={false}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "30px",
                    padding: "10px",
                    // border: "2px dashed #ccc",
                    borderRadius: "10px",
                    marginBottom: "30px",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80%",
                  
                  }}
                >
                  {words.map((word, index) => {
                    const usageCount = getWordUsageCount(word.text);
const isUsed = usageCount >= WORD_LIMITS[word.text];
                    return (
                      <Draggable
                        key={word.id}
                        draggableId={word.text}
                        index={index}
                        isDragDisabled={checked || showAnswers || isUsed}
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
                              ...provided.draggableProps.style,
                            }}
                          >
                            {word.text}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="grid grid-cols-2 gap-x-20 gap-y-10 lg:ml-10">
            {data.map((item) => {
              const wrongQ =
                checked &&
                userAnswers[item.id].q &&
                userAnswers[item.id].q.toLowerCase().trim() !==
                  correctAnswers[item.id].q.toLowerCase();

              const wrongA =
                checked &&
                userAnswers[item.id].a &&
                userAnswers[item.id].a.toLowerCase().trim() !==
                  correctAnswers[item.id].a.toLowerCase();
              return (
                <div key={item.id} className="flex flex-col items-center gap-6">
                  <div className="flex items-start gap-4 w-full justify-evenly ">
                    <span className="font-bold text-blue-900 text-2xl">
                      {item.id}
                    </span>
                    <img
                      src={item.img}
                      alt=""
                      style={{ height: "160px", width: "90px" }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 w-[75%] text-xl text-gray-800">
                    <div className="flex items-center gap-2 relative">
                      <span>Who's</span>
                      <Droppable droppableId={`${item.id}-q`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`WB-unit1-p5-q2-input ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {" "}
                            {wrongQ && (
                              <div className="wb-wrong-icon-unit1-page5-q2">
                                ✕
                              </div>
                            )}
                            {userAnswers[item.id].q}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <span>?</span>
                    </div>
                    <div className="flex items-center gap-2 relative">
                      <Droppable droppableId={`${item.id}-a`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`WB-unit1-p5-q2-input ${
                              snapshot.isDraggingOver ? "drag-over-cell" : ""
                            }`}
                          >
                            {" "}
                            {wrongA && (
                              <div className="wb-wrong-icon-unit1-page5-q2">
                                ✕
                              </div>
                            )}
                            {userAnswers[item.id].a}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <span>{item.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
</div>
          <div className="mt-16 flex justify-center">
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

export default WB_Unit1_Page5_Q2;
