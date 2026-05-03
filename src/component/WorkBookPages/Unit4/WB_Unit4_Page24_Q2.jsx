import React, { useState } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 4.svg";

// بيانات التمرين
const chartData = [
  { name: "Steve", job: "pilot" },
  { name: "Janice", job: "graphic designer" },
  { name: "Larry", job: "teacher" },
  { name: "Philip", job: "vet" },
];

const questions = [
  {
    id: "h1",
    question: "What's Larry's job?",
    correctAnswer: "Larry is a teacher.",
  },
  {
    id: "h2",
    question: "What's Janice's job?",
    correctAnswer: "Janice is a graphic designer.",
  },
  {
    id: "h3",
    question: "What's Philip's job?",
    correctAnswer: "Philip is a vet.",
  },
  {
    id: "h4",
    question: "What's Steve's job?",
    correctAnswer: "Steve is a pilot.",
  },
];

const jobImages = [
  { job: "pilot", img: img1 },
  { job: "teacher", img: img2 },
  { job: "vet", img: img3 },
  { job: "graphic designer", img: img4 },
];
const answerOptions = [
  "Larry is a teacher.",
  "Janice is a graphic designer.",
  "Philip is a vet.",
  "Steve is a pilot.",
];
const ReadChartAndAnswer = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    setShowResults(false);
  };

  const isWrong = (q) => {
    if (!showResults) return false;
    if (!answers[q.id]) return false;

    const user = answers[q.id];
    return user !== q.correctAnswer;
  };
  const handleSelectChange = (qId, value) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    setShowResults(false);
  };

  const getSelectClass = (qId, correctAnswer) => {
    if (!showResults || !answers[qId]) return "border-gray-300";
    return answers[qId] === correctAnswer
      ? "border-gray-300"
      : "border-red-500";
  };
  const handleShowAnswer = () => {
    const correctAns = {};
    questions.forEach((q) => {
      correctAns[q.id] = q.correctAnswer;
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
    // ✅ أول شي تأكد كل الأسئلة فيها إجابة
    for (let q of questions) {
      if (!answers[q.id]) {
        ValidationAlert.warning("Please answer all questions first.");
        return; // ⛔ وقف
      }
    }

    // ✅ إذا كله معبّي → كمل
    setShowResults(true);

    let score = 0;

    questions.forEach((q) => {
      const userAnswer = (answers[q.id] || "")
        .trim()
        .toLowerCase()
        .replace(".", "");

      const correctAnswer = q.correctAnswer.toLowerCase().replace(".", "");

      if (userAnswer === correctAnswer) {
        score++;
      }
    });

    if (score === questions.length) {
      ValidationAlert.success(`Score: ${score} / ${questions.length}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${questions.length}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${questions.length}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">H</span> Read the chart. Answer the
          questions.
        </h1>

        <div className="flex flex-col gap-2">
          {/* الجزء الأيسر: الجدول والصور */}
          <div className="flex gap-8 space-y-6">
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <tbody>
                {chartData.map((person, index) => (
                  <tr
                    key={person.name}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3 border border-gray-200 font-semibold text-lg">
                      {person.name}
                    </td>
                    <td className="p-3 border border-gray-200 text-lg">
                      {person.job}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {jobImages.map((job) => (
                <img
                  key={job.job}
                  src={job.img}
                  alt={job.job}
                  className="max-w-full max-h-24 object-contain "
                />
              ))}
            </div>
          </div>

          {/* الجزء الأيمن: الأسئلة والأجوبة */}
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={q.id} className="flex gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-blue-600">{index + 1}</span>
                  <p className="text-lg">{q.question}</p>
                </div>
                <div className="relative">
                  <select
                    value={answers[q.id] || ""}
                    onChange={(e) => handleSelectChange(q.id, e.target.value)}
                    className={`cursor-pointer w-full mb-5  pb-1 text-lg border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${getSelectClass(q.id, q.correctAnswer)}`}
                  >
                    <option value="" disabled>
                   
                    </option>
                    {answerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {isWrong(q) && (
                    <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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

export default ReadChartAndAnswer;
