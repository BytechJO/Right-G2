import { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const WB_Unit1_Page6_Q2 = () => {
  const [userSelections, setUserSelections] = useState({
    1: { pronoun: null, relation: null },
    2: { pronoun: null, relation: null },
    3: { pronoun: null, relation: null },
    4: { pronoun: null, relation: null },
  });
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [checked, setChecked] = useState(false);
  const data = [
    {
      id: 1,
      img: img1,
      pronouns: ["She's", "He's"],
      relations: ["uncle.", "aunt."],
      correctPronoun: "He's",
      correctRelation: "uncle.",
    },
    {
      id: 2,
      img: img2,
      pronouns: ["I'm", "He's"],
      relations: ["sister.", "brother."],
      correctPronoun: "He's",
      correctRelation: "brother.",
    },
    {
      id: 3,
      img: img3,
      pronouns: ["They're", "He's"],
      relations: ["mother and father.", "uncle and aunt."],
      correctPronoun: "They're",
      correctRelation: "mother and father.",
    },
    {
      id: 4,
      img: img4,
      pronouns: ["She's", "He's"],
      relations: ["sister.", "brother."],
      correctPronoun: "She's",
      correctRelation: "sister.",
    },
  ];

  const handleSelect = (id, field, option) => {
    if (!showAnswers) {
      setUserSelections({
        ...userSelections,
        [id]: { ...userSelections[id], [field]: option },
      });
    }
  };

  const checkAnswers = () => {
    if (showAnswers ||checked) return;
    const hasEmptySelections = data.some((item) => {
      const userItem = userSelections[item.id];
      return !userItem?.pronoun || !userItem?.relation;
    });

    if (hasEmptySelections) {
      ValidationAlert.info("Please complete all answers first.");
      return;
    }

    let currentScore = 0;
    const totalQuestions = data.length * 2;

    data.forEach((item) => {
      const userItem = userSelections[item.id] || {};

      if (
        userItem.pronoun?.toLowerCase().trim() ===
        item.correctPronoun.toLowerCase()
      ) {
        currentScore++;
      }

      if (
        userItem.relation?.toLowerCase().trim() ===
        item.correctRelation.toLowerCase()
      ) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setChecked(true); // ⭐ هنا

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    data.forEach((item) => {
      answers[item.id] = {
        pronoun: item.correctPronoun,
        relation: item.correctRelation,
      };
    });
    setUserSelections(answers);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({
      1: { pronoun: null, relation: null },
      2: { pronoun: null, relation: null },
      3: { pronoun: null, relation: null },
      4: { pronoun: null, relation: null },
    });
    setShowResults(false);
    setShowAnswers(false);
    setChecked(false)
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
        style={{gap:"35px"}}
       
      >
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">I</span>Look, read, and circle.
        </h1>

        <div className="grid grid-cols-2 gap-x-20 gap-y-5" style={{justifyItems:"start"}}>
          {data.map((item) => (
            <div key={item.id} className="flex flex-col gap-6 w-full">
              <div className="flex items-start gap-4 w-full">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="max-w-24 max-h-24 object-contain rounded-xl "
                />
              </div>

              <div className="flex items-center gap-4 text-xl text-gray-800">
                <div className="flex flex-col gap-4">
                  {item.pronouns.map((p) => {
                    const isWrong =
                      checked &&
                      userSelections[item.id].pronoun === p &&
                      p !== item.correctPronoun;

                    return (
                      <button
                        key={p}
                        onClick={() => handleSelect(item.id, "pronoun", p)}
                        className={`relative px-4 py-1 rounded-full border-2 text-nowrap transition-all ${
                          userSelections[item.id].pronoun === p
                            ? "border-red-500 bg-red-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        {p}

                        {isWrong && (
                          <div className="wb-wrong-icon-unit1-page6-q2">
                            ✕
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="font-bold">my</span>
                <div className="flex flex-col gap-4">
                  {item.relations.map((r) => {
                    const isWrong =
                      checked &&
                      userSelections[item.id].relation === r &&
                      r !== item.correctRelation;

                    return (
                      <button
                        key={r}
                        onClick={() => handleSelect(item.id, "relation", r)}
                        className={`relative px-4 py-1 rounded-full border-2  text-nowrap transition-all ${
                          userSelections[item.id].relation === r
                            ? "border-red-500 bg-red-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        {r}

                        {isWrong && (
                          <div className="wb-wrong-icon-unit1-page6-q2">
                            ✕
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit1_Page6_Q2;
