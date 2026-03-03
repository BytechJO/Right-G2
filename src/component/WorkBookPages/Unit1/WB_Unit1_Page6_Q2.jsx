import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

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

  const data = [
    { id: 1, img: img, pronouns: ["She's", "He's"], relations: ["uncle.", "aunt."], correctPronoun: "He's", correctRelation: "uncle." },
    { id: 2, img: img, pronouns: ["I'm", "He's"], relations: ["sister.", "brother."], correctPronoun: "He's", correctRelation: "brother." },
    { id: 3, img: img, pronouns: ["They're", "He's"], relations: ["mother and father.", "uncle and aunt."], correctPronoun: "They're", correctRelation: "mother and father." },
    { id: 4, img: img, pronouns: ["She's", "He's"], relations: ["sister.", "brother."], correctPronoun: "She's", correctRelation: "sister." },
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
    let currentScore = 0;
    const totalQuestions = data.length * 2; // لأن كل سؤال له pronoun + relation

    data.forEach((item) => {
      const userItem = userSelections[item.id] || {};

      // حماية من القيم الفارغة
      if (userItem.pronoun?.trim().toLowerCase() === item.correctPronoun.toLowerCase()) {
        currentScore += 1;
      }
      if (userItem.relation?.trim().toLowerCase() === item.correctRelation.toLowerCase()) {
        currentScore += 1;
      }
    });

    setScore(currentScore);

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.warning("No correct answers. Try again!");
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    data.forEach(item => {
      answers[item.id] = { pronoun: item.correctPronoun, relation: item.correctRelation };
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
  };

  return (
    <div className="p-8 bg-white rounded-3xl max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="ex-A">I</div>
        <h1 className="header-title-page8">Look, read, and circle.</h1>
      </div>

      <div className="grid grid-cols-2 gap-x-20 gap-y-16">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-6">
            <div className="flex items-start gap-4 max-w-full">
              <span className="font-bold text-blue-900 text-2xl">{item.id}</span>
              <img src={item.img} alt="" className="max-w-24 max-h-24 object-contain rounded-xl grayscale" />
            </div>

            <div className="flex flex-col items-center gap-4 text-xl text-gray-800">
              <div className="flex gap-4">
                {item.pronouns.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelect(item.id, "pronoun", p)}
                    className={`px-4 py-1 rounded-full border-2 transition-all ${userSelections[item.id].pronoun === p
                        ? 'border-red-500 bg-red-50'
                        : 'border-transparent hover:border-gray-300'
                      } ${showAnswers && p === item.correctPronoun ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <span className="font-bold">my</span>
              <div className="flex gap-4">
                {item.relations.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSelect(item.id, "relation", r)}
                    className={`px-4 py-1 rounded-full border-2 transition-all ${userSelections[item.id].relation === r
                        ? 'border-red-500 bg-red-50'
                        : 'border-transparent hover:border-gray-300'
                      } ${showAnswers && r === item.correctRelation ? 'border-green-500 bg-green-50' : ''}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
      </div>

      {showResults && <ValidationAlert score={score} total={8} onClose={() => setShowResults(false)} />}
    </div>
  );
};

export default WB_Unit1_Page6_Q2;