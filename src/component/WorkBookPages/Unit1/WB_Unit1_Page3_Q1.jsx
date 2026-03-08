import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page3_Q1 = () => {
  const questions = [
    {
      id: 1,
      question: "Who's he?",
      image: img,
      answer: "He's my father",
      isQuestionReadOnly: true,
    },
    {
      id: 2,
      question: "Who are they?",
      image: img,
      answer: "They're my father and mother",
      isQuestionReadOnly: false,
    },
  ];

  const [userAnswers, setUserAnswers] = useState({});
  const [userQuestions, setUserQuestions] = useState({});
  const [results, setResults] = useState({});

  const handleAnswerChange = (id, value) => {
    setUserAnswers({ ...userAnswers, [id]: value });
  };

  const handleQuestionChange = (id, value) => {
    setUserQuestions({ ...userQuestions, [id]: value });
  };

  const checkAnswers = () => {
  // 1️⃣ تحقق من الحقول الفارغة
  for (let q of questions) {
    if (!q.isQuestionReadOnly) {
      if (!userQuestions[q.id]?.trim()) {
        ValidationAlert.warning("Please write the question first.");
        return;
      }
    }

    if (!userAnswers[q.id]?.trim()) {
      ValidationAlert.warning("Please write all answers before checking.");
      return;
    }
  }

  // 2️⃣ حساب النتائج
  let correctCount = 0;
  const newResults = {};

  questions.forEach((q) => {
    const isAnswerCorrect =
      userAnswers[q.id]?.toLowerCase().trim() ===
      q.answer.toLowerCase().trim();

    let isQuestionCorrect = true;

    if (!q.isQuestionReadOnly) {
      isQuestionCorrect =
        userQuestions[q.id]?.toLowerCase().trim() ===
        q.question.toLowerCase().trim();
    }

    const isCorrect = isAnswerCorrect && isQuestionCorrect;
    newResults[q.id] = isCorrect;

    if (isCorrect) correctCount++;
  });

  setResults(newResults);

  // 3️⃣ عرض النتيجة
  if (correctCount === questions.length) {
    ValidationAlert.success(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:green;">Score: ${correctCount} / ${questions.length}</b>
        </div>
      `);
  } else {
    ValidationAlert.error(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:red;">Score: ${correctCount} / ${questions.length}</b>
        </div>
      `);
  }
};
  const handleStartAgain = () => {
    setUserAnswers({});
    setUserQuestions({});
    setResults({});
  };
  const handleShowAnswer = () => {
  const filledAnswers = {};
  const filledQuestions = {};

  questions.forEach((q) => {
    // تعبئة الجواب
    filledAnswers[q.id] = q.answer;

    // تعبئة السؤال إذا لم يكن readonly
    if (!q.isQuestionReadOnly) {
      filledQuestions[q.id] = q.question;
    }
  });

  setUserAnswers(filledAnswers);
  setUserQuestions(filledQuestions);
};
  return (
    <div className="relative flex flex-col items-center p-8 bg-white rounded-3xl max-w-5xl mx-auto">
      <div className="w-full flex items-center gap-4 mb-12">
        <div className="ex-A">A</div>
        <h1 className="header-title-page8">Look and Write</h1>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-5 rounded-2xl flex items-start gap-6"
          >
            <img
              src={q.image}
              alt="question"
              className="max-w-32 max-h-32 object-cover rounded-xl"
            />

            <div className="flex flex-col gap-6 w-full">
              {/* حقل السؤال */}
              <input
                type="text"
                value={q.isQuestionReadOnly ? q.question : (userQuestions[q.id] || "")}
                readOnly={q.isQuestionReadOnly}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                placeholder={q.isQuestionReadOnly ? "" : "Write the question here..."}
                className={`bg-transparent border-b-2 text-lg font-semibold outline-none transition ${q.isQuestionReadOnly ? "border-gray-500" : "border-blue-400 focus:border-blue-600"
                  }`}
              />

              {/* حقل الإجابة */}
              <input
                type="text"
                value={userAnswers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="bg-transparent border-b-2 border-gray-400 outline-none text-lg transition focus:border-[#eb533c]"
                placeholder="Write your answer..."
              />
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
  );
};

export default WB_Unit1_Page3_Q1;