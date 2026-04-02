import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import sandwichImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 1.svg";
import drumImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 2.svg";
import bikeImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 3.svg";
import kiteImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 17/Ex E 4.svg";



import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

// بيانات التمرين
const circleQuestions = [
  {
    id: "q1",
    img: sandwichImg,
    options: ["make", "take"],
    phrase: "a sandwich",
    correctAnswer: "make",
  },
  {
    id: "q2",
    img: drumImg,
    options: ["paint", "play"],
    phrase: "the drum",
    correctAnswer: "play",
  },
  {
    id: "q3",
    img: bikeImg,
    options: ["fly", "ride"],
    phrase: "a bike",
    correctAnswer: "ride",
  },
  {
    id: "q4",
    img: kiteImg,
    options: ["play", "fly"],
    phrase: "a kite",
    correctAnswer: "fly",
  },
];

const WB_Unit3_Page17_Q1 = () => {
  // حالة لتخزين الفعل المختار لكل سؤال
  const [selections, setSelections] = useState({});
  // حالة لتخزين الإجابات المكتوبة
  const [writtenAnswers, setWrittenAnswers] = useState({});
  // حالة لإظهار النتائج
  const [showResults, setShowResults] = useState(false);

  // دالة لتحديث الاختيار والكتابة معاً
  const handleSelect = (qId, choice) => {
    setSelections((prev) => ({ ...prev, [qId]: choice }));
    const question = circleQuestions.find((q) => q.id === qId);
    setWrittenAnswers((prev) => ({
      ...prev,
      [qId]: `${choice} ${question.phrase}`,
    }));
    setShowResults(false);
  };

  // دالة لتحديث النص المكتوب يدوياً
  const handleTextChange = (qId, value) => {
    setWrittenAnswers((prev) => ({ ...prev, [qId]: value }));
    setShowResults(false);
  };

  // دالة لتحديد تنسيق الأزرار (الدائرة)
  const getButtonClass = (qId, choice) => {
    const isSelected = selections[qId] === choice;

    return isSelected
      ? "border-blue-500 bg-blue-100 text-blue-700"
      : "border-gray-300 bg-white";
  };

  const handleShowAnswer = () => {
    const correctSels = {};
    const correctWrites = {};
    circleQuestions.forEach((q) => {
      correctSels[q.id] = q.correctAnswer;
      correctWrites[q.id] = `${q.correctAnswer} ${q.phrase}`;
    });
    setSelections(correctSels);
    setWrittenAnswers(correctWrites);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setSelections({});
    setWrittenAnswers({});
    setShowResults(false);
  };

  const checkAnswers = () => {
    const hasEmptyFields = circleQuestions.some(
      (q) =>
        !selections[q.id] ||
        !writtenAnswers[q.id] ||
        writtenAnswers[q.id].trim() === "",
    );

    if (hasEmptyFields) {
      ValidationAlert.info("Please complete all answers first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    circleQuestions.forEach((q) => {
      const fullCorrectAnswer = `${q.correctAnswer} ${q.phrase}`.toLowerCase();

      if (
        selections[q.id] === q.correctAnswer &&
        writtenAnswers[q.id]?.trim().toLowerCase() === fullCorrectAnswer
      ) {
        score++;
      }
    });

    if (score === circleQuestions.length) {
      ValidationAlert.success(`Score: ${score} / ${circleQuestions.length}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${circleQuestions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${circleQuestions.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">E</span>Look, read and circle. Write.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {circleQuestions.map((q, index) => (
            <div key={q.id} className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600">{index + 1}</span>
                <img
                  src={q.img}
                  alt={q.phrase}
                  className="max-w-24 max-h-24 rounded-lg shadow-sm"
                />
                <div className="flex flex-col items-start gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`px-4 py-1 border-2 rounded-full font-semibold transition-all ${getButtonClass(q.id, opt)}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <span className="text-gray-700">{q.phrase}</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={writtenAnswers[q.id] || ""}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  className="w-full bg-transparent border-b-2 pb-1 focus:outline-none transition-colors"
                />

                {/* ✕ */}
                {showResults &&
                  writtenAnswers[q.id] &&
                  writtenAnswers[q.id].trim().toLowerCase() !==
                    `${q.correctAnswer} ${q.phrase}`.toLowerCase() && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                      ✕
                    </div>
                  )}
              </div>
            </div>
          ))}
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

export default WB_Unit3_Page17_Q1;
