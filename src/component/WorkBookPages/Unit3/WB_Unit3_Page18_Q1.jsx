import React, { useState } from "react";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 6.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

// بيانات التمرين
const writeQuestions = [
  {
    id: "g1",
    img: img1,
    modal: "can",
    correctBefore: "I",
    correctAfter: "fly a kite.",
    beforeOptions: ["I", "It"],
    afterOptions: ["fly a kite.", "swim."],
  },
  {
    id: "g2",
    img: img2,
    modal: "can",
    correctBefore: "I",
    correctAfter: "paint a picture.",
    beforeOptions: ["I", "It"],
    afterOptions: ["paint a picture.", "ride a bike."],
  },
  {
    id: "g3",
    img: img3,
    modal: "can",
    correctBefore: "I",
    correctAfter: "climb a tree.",
    beforeOptions: ["I", "It"],
    afterOptions: ["climb a tree.", "sleep."],
  },
  {
    id: "g4",
    img: img4,
    modal: "can't",
    correctBefore: "I",
    correctAfter: "ride a bike.",
    beforeOptions: ["I", "It"],
    afterOptions: ["ride a bike.", "swim."],
  },
  {
    id: "g5",
    img: img5,
    modal: "can",
    correctBefore: "I",
    correctAfter: "sleep.",
    beforeOptions: ["I", "It"],
    afterOptions: ["sleep.", "paint a picture."],
  },
  {
    id: "g6",
    img: img6,
    modal: "can't",
    correctBefore: "It",
    correctAfter: "swim.",
    beforeOptions: ["I", "It"],
    afterOptions: ["swim.", "fly a kite."],
  },
];

const WB_Unit3_Page18_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (qId, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [field]: value,
      },
    }));
    setShowResults(false);
  };

  const isCorrect = (qId) => {
    const q = writeQuestions.find((q) => q.id === qId);
    const ans = answers[qId];

    if (!ans) return false;

    return ans.before === q.correctBefore && ans.after === q.correctAfter;
  };

  const getClass = (qId) => {
    if (!showResults || !answers[qId]) return "border-gray-50";

    if (!isCorrect(qId)) {
      return "border-red-500";
    }

    return "border-gray-50";
  };

  const handleShowAnswer = () => {
    const correctAns = {};
    writeQuestions.forEach((q) => {
      correctAns[q.id] = {
        before: q.correctBefore,
        after: q.correctAfter,
      };
    });
    setAnswers(correctAns);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const hasEmptyFields = writeQuestions.some((q) => {
      const answer = answers[q.id];
      return !answer?.before || !answer?.after;
    });

    if (hasEmptyFields) {
      ValidationAlert.info("Please answer all questions first.");
      return;
    }

    setShowResults(true);
    let score = 0;

    writeQuestions.forEach((q) => {
      if (isCorrect(q.id)) score++;
    });

    if (score === writeQuestions.length) {
      ValidationAlert.success(`Score: ${score} / ${writeQuestions.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${writeQuestions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${writeQuestions.length}`);
    }
  };
  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"30px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span>
          Look, read, and write.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-15">
          {writeQuestions.map((q, index) => {
            const isWrong = (qId) => {
              if (!showResults || !answers[qId]) return false;
              return !isCorrect(qId);
            };
            return (
              <div key={q.id} className="space-y-2 relative">
                <div className="flex items-start gap-4">
                  <span className="font-bold text-blue-600 text-xl">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-5">
                  <img
                    src={q.img}
                    alt={`Question ${index + 1}`}
                    className="w-full max-h-24 object-cover rounded-lg shadow-sm"
                  />
                  <div
                  className={`flex items-center gap-2 border-b-2 pb-1 ${getClass(q.id)}`}
                >
                  {/* before */}
                  <select
                    value={answers[q.id]?.before || ""}
                    onChange={(e) =>
                      handleChange(q.id, "before", e.target.value)
                    }
                    className="bg-transparent focus:outline-none text-[20px] border-b-2 border-gray-500 w-15"
                  >
                    <option value="" disabled>
                    
                    </option>
                    {q.beforeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* can / can't */}
                  <span className="font-semibold text-blue-700 text-xl">
                    {q.modal}
                  </span>

                  {/* after */}
                  <select
                    value={answers[q.id]?.after || ""}
                    onChange={(e) =>
                      handleChange(q.id, "after", e.target.value)
                    }
                    className="bg-transparent focus:outline-none text-[20px] border-b-2 border-gray-500 w-40"
                  >
                    <option value="" disabled>
                     
                    </option>
                    {q.afterOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {isWrong(q.id) && (
                    <div className="absolute bottom-2 -right-2 bg-red-500 font-bold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow border-2 border-white text-2xl">
                      ✕
                    </div>
                  )}
                </div>
                  </div>
                </div>

                
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
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

export default WB_Unit3_Page18_Q1;
