import React, { useState } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 6.svg";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

const OPTIONS = ["These", "Those"];

const questions = [
  { key: "sentence1", img: img1, text: "are ducks." },
  { key: "sentence2", img: img2, text: "are flowers." },
  { key: "sentence3", img: img3, text: "are butterflies." },
  { key: "sentence4", img: img4, text: "are birds." },
  { key: "sentence5", img: img5, text: "are rabbits." },
  { key: "sentence6", img: img6, text: "are dogs." },
];

const correctAnswers = {
  sentence1: "Those",
  sentence2: "These",
  sentence3: "Those",
  sentence4: "These",
  sentence5: "Those",
  sentence6: "Those",
};

const initialAnswers = Object.fromEntries(questions.map((q) => [q.key, ""]));

const QuestionItem = ({
  index,
  question,
  answers,
  handleAnswerChange,
  checked,
  isWrong,
}) => {
  return (
    <div className="flex items-center gap-4 p-2 rounded-xl">
      <div className="flex items-start gap-4 p-2 rounded-xl">
      <span className="font-semibold text-blue-900 text-xl">{index + 1}.</span>

      <img
        src={question.img}
        className="object-contain"
        style={{ height: "100px", width: "140px" }}
        alt=""
      />
</div>
      <p className="relative text-xl text-gray-800 w-full">
        <select
          value={answers[question.key]}
          onChange={(e) => handleAnswerChange(question.key, e.target.value)}
          className="mx-3 p-2 w-80 text-center text-lg border-b-2"
        >
          <option value="" disabled>
            select the answer
          </option>
          {OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {checked && isWrong(question.key) && (
          <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
            ✕
          </div>
        )}

        {question.text}
      </p>
    </div>
  );
};

const WB_Unit2_Page12_Q1 = () => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAlert, setShowAlert] = useState(false);

  const handleAnswerChange = (field, value) => {
     if (checked) return;
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const isWrong = (key) => {
    return answers[key] && answers[key] !== correctAnswers[key];
  };

  const handleShowAnswer = () => {
    setChecked(true);
    setAnswers(correctAnswers);
  };

  const handleStartAgain = () => {
    setAnswers(initialAnswers);
    setChecked(false);
    setShowAlert(false);
  };

  const checkAnswers = () => {
    if (checked) return;
    const allFilled = Object.values(answers).every((a) => a.trim() !== "");

    if (!allFilled) {
      ValidationAlert.info("Please fill in all answers!");
      return;
    }

    const correct = Object.keys(answers).filter(
      (key) => answers[key] === correctAnswers[key],
    ).length;

    const total = Object.keys(answers).length;

    setScore({ correct, total });
    setChecked(true);

    const method =
      correct === total ? "success" : correct > 0 ? "warning" : "error";
    ValidationAlert[method](`Score: ${correct}/${total}`);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span> Look and write.
        </h1>

        <div className="family-completion-activity" dir="ltr">
          <div className="sentences">
            {questions.map((q, index) => (
              <QuestionItem
                key={q.key}
                index={index}
                question={q}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                checked={checked}
                isWrong={isWrong}
              />
            ))}
          </div>

          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>

          {showAlert && (
            <ValidationAlert
              correct={score.correct}
              total={score.total}
              onClose={() => setShowAlert(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page12_Q1;
