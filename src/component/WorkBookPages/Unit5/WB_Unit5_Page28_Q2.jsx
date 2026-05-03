import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page28/Ex D 5.svg";

// بيانات التمرين
const exerciseDataD = [
  {
    id: "d1",
    img: img1,
    options: ["Does she like fish?", "Does she like chicken?"],
    correctOption: "Does she like fish?",
    correctAnswer: "No, she doesn't.",
  },
  {
    id: "d2",
    img: img2,
    options: ["Does he like stew?", "Does he like fruit?"],
    correctOption: "Does he like stew?",
    correctAnswer: "No, he doesn't.",
  },
  {
    id: "d3",
    img: img3,
    options: ["Does he like meat?", "Does he like rice?"],
    correctOption: "Does he like meat?",
    correctAnswer: "No, he doesn't.",
  },
  {
    id: "d4",
    img: img4,
    options: ["Does she like fish?", "Does she like fruit?"],
    correctOption: "Does she like fruit?",
    correctAnswer: "Yes, she does.",
  },
  {
    id: "d5",
    img: img5,
    options: ["Does she like soup?", "Does she like chicken?"],
    correctOption: "Does she like chicken?",
    correctAnswer: "Yes, she does.",
  },
];

const WB_Unit5_Page28_Q2 = () => {
  const [selections, setSelections] = useState({}); // { d1: "Does she like fish?" }
  const [answers, setAnswers] = useState({}); // { d1: "No, she doesn't." }
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId, option) => {
    if (showResults) return;
    setSelections((prev) => ({ ...prev, [qId]: option }));
  };

  const handleInputChange = (qId, value) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const getOptionClass = (qId, option, correctOption) => {
    const isSelected = selections[qId] === option;
    if (showResults) {
      if (option === correctOption)
        return "border-blue-900 ";
      if (isSelected && option !== correctOption)
        return "border-red-500";
    }
    if (isSelected) return "border-blue-900";
    return "border-gray-300 bg-white hover:border-blue-900";
  };

  const getInputClass = (qId, correctAnswer) => {
    if (!showResults || !answers[qId]) return "border-gray-300";
    const userAnswer = answers[qId].trim().toLowerCase().replace(/[?.]/g, "");
    const correct = correctAnswer.toLowerCase().replace(/[?.]/g, "");
    return userAnswer === correct ? "border-gray-300" : "border-red-500";
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    const correctAns = {};
    exerciseDataD.forEach((q) => {
      correctSels[q.id] = q.correctOption;
      correctAns[q.id] = q.correctAnswer;
    });
    setSelections(correctSels);
    setAnswers(correctAns);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setAnswers({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;

    // ✅ التحقق إنو كل الأسئلة فيها اختيار + إجابة
    const hasEmpty = exerciseDataD.some(
      (q) => !selections[q.id] || !answers[q.id],
    );

    if (hasEmpty) {
      ValidationAlert.warning("Please complete all answers first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = exerciseDataD.length * 2;

    exerciseDataD.forEach((q) => {
      if (selections[q.id] === q.correctOption) score++;

      const userAnswer = answers[q.id]
        .trim()
        .toLowerCase()
        .replace(/[?.]/g, "");

      const correctAnswer = q.correctAnswer.toLowerCase().replace(/[?.]/g, "");

      if (userAnswer === correctAnswer) score++;
    });

    if (score === total) ValidationAlert.success(`Score: ${score} / ${total}`);
    else if (score === 0) ValidationAlert.error(`Score: ${score} / ${total}`);
    else ValidationAlert.warning(`Score: ${score} / ${total}`);
  };

  const isInputWrong = (q) => {
    if (!showResults) return false;
    if (!answers[q.id]) return false;

    const userAnswer = answers[q.id].trim().toLowerCase().replace(/[?.]/g, "");

    const correct = q.correctAnswer.toLowerCase().replace(/[?.]/g, "");

    return userAnswer !== correct;
  };

  const isOptionWrong = (q, option) => {
    if (!showResults) return false;

    const selected = selections[q.id];
    if (!selected) return false;

    return selected === option && option !== q.correctOption;
  };
  return (
    <div className="main-container-component">
      <div className="div-forall" style={{marginBottom: "30px" ,gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">D</span> Look, read, and circle. Answer.
        </h1>

        <div className="space-y-6">
          {exerciseDataD.map((q, index) => (
            <div key={q.id} className="flex items-center gap-x-6 gap-y-2">
              <div className="flex gap-1 items-start">
              <span className="font-bold text-blue-900 text-xl">{index + 1}</span>
              <img
                src={q.img}
                alt={`Question ${index + 1}`}
                style={{height:"100px",width:"150px"}}
                className="object-contain"
              />
</div>
              <div className="flex gap-10 items-center space-y-2 w-full">
                <div className="flex flex-col gap-5 w-55">
                  {q.options.map((opt) => (
                    <div key={opt} className="relative">
                      <button
                        onClick={() => handleSelect(q.id, opt)}
                        className={`w-full text-left px-4 py-2 rounded-full border-2 text-[17px] transition-all ${getOptionClass(q.id, opt, q.correctOption)}`}
                      >
                        {opt}
                      </button>

                      {isOptionWrong(q, opt) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="col-start-3 relative">
                  <select
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className={`cursor-pointer w-[300px] bg-transparent border-b-2 pb-1 focus:outline-none text-lg ${getInputClass(q.id, q.correctAnswer)}`}
                  >
                    <option value="" disabled>
                      select
                    </option>
                    <option value="No, she doesn't.">No, she doesn't.</option>
                    <option value="No, he doesn't.">No, he doesn't.</option>
                    <option value="Yes, she does.">Yes, she does.</option>
                  </select>
                  {isInputWrong(q) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit5_Page28_Q2;
