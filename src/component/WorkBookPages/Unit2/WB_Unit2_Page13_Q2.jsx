import React, { useState } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 5.svg";
import trueIcon from "../../../assets/imgs/true.svg"
// بيانات التمرين: الأسئلة، الصور، والإجابات الصحيحة
const exerciseQuestions = [
  { id: "q1", text: "Those are birds.", img: img1, correctAnswer: false }, // الصورة لطائر واحد، والجملة تقول "birds"
  { id: "q2", text: "This is a fox.", img: img2, correctAnswer: true },
  { id: "q3", text: "These are clocks.", img: img3, correctAnswer: true },
  { id: "q4", text: "This is a duck.", img: img4, correctAnswer: true },
  { id: "q5", text: "Those are clouds.", img: img5, correctAnswer: true },
];

const WB_Unit2_Page13_Q2 = () => {
  // حالة لتخزين إجابات المستخدم (true, false, or null)
  const [userAnswers, setUserAnswers] = useState({});
  // حالة لتحديد ما إذا كان يجب إظهار النتائج
  const [showResults, setShowResults] = useState(false);
  // حالة لتخزين النتيجة
  const [score, setScore] = useState(null);

  // دالة لتحديث إجابة المستخدم عند النقر على مربع الاختيار
  const handleSelectAnswer = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    // إخفاء النتائج عند أي تعديل جديد
    if (showResults) {
      setShowResults(false);
      setScore(null);
    }
  };

  // دالة لإظهار الإجابات الصحيحة
  const handleShowAnswer = () => {
    const correct = {};
    exerciseQuestions.forEach((q) => {
      correct[q.id] = q.correctAnswer;
    });
    setUserAnswers(correct);
    setShowResults(true); // إظهار التلوين الصحيح
  };

  // دالة لإعادة التمرين
  const handleStartAgain = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(null);
  };

  const checkAnswers = () => {
    if (showResults) return;
    if (Object.keys(userAnswers).length < exerciseQuestions.length) {
      ValidationAlert.info("Please answer all questions before checking.");
      return;
    }

    setShowResults(true);

    let correctCount = 0;
    exerciseQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore({ correct: correctCount, total: exerciseQuestions.length });

    if (correctCount === exerciseQuestions.length) {
      ValidationAlert.success(
        `Score: ${correctCount}/${exerciseQuestions.length}`,
      );
    } else if (correctCount > 0) {
      ValidationAlert.warning(
        `Score: ${correctCount}/${exerciseQuestions.length}`,
      );
    } else {
      ValidationAlert.error(
        `Score: ${correctCount}/${exerciseQuestions.length}`,
      );
    }
  };

  // دالة مساعدة لتحديد شكل مربع الاختيار بناءً على الحالة
  const getCheckboxClass = (questionId, option) => {
    const isSelected = userAnswers[questionId] === option;

    if (showResults) {
      const isCorrect =
        exerciseQuestions.find((q) => q.id === questionId).correctAnswer ===
        option;
     
      if (isSelected && !isCorrect) {
        // إذا اختاره المستخدم وكان خطأ، لونه بالأحمر
        return "border-red-500";
      }
    }

    // الحالة الافتراضية أو عند الاختيار قبل التحقق
    return isSelected
      ? "border-blue-500 bg-blue-100"
      : "border-gray-300 bg-white";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span>.
        </h1>

        <div className="flex flex-col justify-start" >
          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="w-66 flex items-center justify-center">
                {/* الصورة */}
                <img
                  src={question.img}
                  alt={`Question ${index + 1}`}
                  className="object-contain"
                  style={{ height: "80px" }}
                />
              </div>
              {/* النص */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-xl">
                  {index + 1}
                </span>
                <p className="text-xl text-gray-800">{question.text}</p>
              </div>

              {/* مربعات الاختيار (True/False) */}
              <div className="flex items-center gap-x-4 relative">
                {showResults &&
                  userAnswers[question.id] !== undefined &&
                  userAnswers[question.id] !== question.correctAnswer && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-white text-xs font-bold"> ✕</span>
                    </div>
                  )}
                {/* True */}
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-gray-600 mb-1">
                      True
                    </span>
                  )}
                  <div
                    onClick={() => handleSelectAnswer(question.id, true)}
                    className={`w-10 h-10 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, true)}`}
                  >
                    {userAnswers[question.id] === true && (
                      <img src={trueIcon} style={{height:"25px"}}/>
                   
                    )}
                  </div>
                </div>
                {/* False */}
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-gray-600 mb-1">
                      False
                    </span>
                  )}
                  <div
                    onClick={() => handleSelectAnswer(question.id, false)}
                    className={`w-10 h-10 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, false)}`}
                  >
                    {userAnswers[question.id] === false && (
                                          <img src={trueIcon} style={{height:"25px"}}/>

                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* أزرار التحكم */}
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

export default WB_Unit2_Page13_Q2;
