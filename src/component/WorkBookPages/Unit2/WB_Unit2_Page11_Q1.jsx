import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 11/Ex E 5.svg";

import "./WB_Unit2_Page11_Q1.css"

// بيانات التمرين
const exerciseData = [
  {
    id: 1,
    questionText: "Is that a duck?",
    correctQuestion: "yes, it is.",
    correctOption: "option1",
    src: img1,
  },
  {
    id: 2,
    questionText: "Is that a bird?",
    correctQuestion: "No, it isn't",
    correctOption: "option2",
    src: img2,
  },
  {
    id: 3,
    questionText: "Is that a sun?",
    correctQuestion: "No, it isn't",
    correctOption: "option1",
    src: img3,
  },
  {
    id: 4,
    questionText: "Is that a flower?",
    correctQuestion: "No, it isn't",
    correctOption: "option2",
    src: img4,
  },
  {
    id: 5,
    questionText: "Is that a pond?",
    correctQuestion: "yes, it is.",
    correctOption: "option1",
    src: img5,
  },
];

const WB_Unit2_Page11_Q1 = () => {
  const [userAnswers, setUserAnswers] = useState(
    exerciseData.reduce((acc, item) => {
      acc[item.id] = { question: "", selectedOption: null };
      return acc;
    }, {}),
  );
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  // Function للتحقق من الإجابات
  const checkAnswers = () => {
    // ✅ تحقق إذا في سؤال بدون إجابة
    const unanswered = exerciseData.some(
      (item) => !userAnswers[item.id].question,
    );

    if (unanswered) {
      ValidationAlert.info("Please answer all questions first!");
      return;
    }

    // 🔹 إذا كلهم متجاوبين، كمل التصحيح
    let correctCount = 0;
    let totalItems = exerciseData.length;

    exerciseData.forEach((item) => {
      const userAns = userAnswers[item.id];

      if (
        userAns.question.trim().toLowerCase() ===
        item.correctQuestion.trim().toLowerCase()
      ) {
        correctCount++;
      }
    });

    setChecked(true);

    if (correctCount === totalItems) {
      ValidationAlert.success(`Score: ${correctCount}/${totalItems}`);
    } else if (correctCount > 0) {
      ValidationAlert.warning(`Score: ${correctCount}/${totalItems}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${totalItems}`);
    }
  };
  const handleShowAnswer = () => {
    const answers = {};
    exerciseData.forEach((item) => {
      answers[item.id] = {
        question: item.correctQuestion,
        selectedOption: item.correctOption,
      };
    });
    setUserAnswers(answers);
    setChecked(true);
  };

  const handleTryAgain = () => {
    setUserAnswers(
      exerciseData.reduce((acc, item) => {
        acc[item.id] = { question: "", selectedOption: null };
        return acc;
      }, {}),
    );
    setChecked(false);
    setLocked(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall">
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">E</span>Look and answer the questions.
        </h1>

        {exerciseData.map((item) => {
          const isWrong =
            checked &&
            userAnswers[item.id].question &&
            userAnswers[item.id].question.trim().toLowerCase() !==
              item.correctQuestion.trim().toLowerCase();
          return (
            <div
              key={item.id}
              className="mb-6 flex items-center gap-4"
              style={{ justifyContent: "space-around" }}
            >
              <div className="relative">
                <label className="block text-lg font-medium mb-2">
                  {item.id}. {item.questionText}
                </label>
                <select
                  disabled={locked}
                  value={userAnswers[item.id].question}
                  onChange={(e) =>
                    setUserAnswers({
                      ...userAnswers,
                      [item.id]: {
                        ...userAnswers[item.id],
                        question: e.target.value,
                      },
                    })
                  }
                  className="relative w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ border: "1px solid" }}
                >
                 
                  <option value="" style={{ color: "gray", opacity: "0.5" }}>
                    -- Select answer --
                  </option>
                  <option value="yes, it is">Yes, it is</option>
                  <option value="no, it isn't">No, it isn't</option>
                </select>
                 {/* ❌ علامة الخطأ */}
                  {isWrong && (
                    <div className="wrong-icon-unit2-page11-q1">
                      ✕
                    </div>
                  )}
              </div>
              <img
                src={item.src}
                className="max-w-25 max-h-20 object-contain "
              />
            </div>
          );
        })}
        <div className="mt-12 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleTryAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page11_Q1;
