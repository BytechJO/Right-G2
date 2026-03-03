import { useState, useRef, useEffect } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit1_Page4_Q1 = () => {
  const [userQuestions, setUserQuestions] = useState({ 1: "Who's he?", 2: "", 3: "", 4: "" });
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({}); // { leftId: rightId }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const [lines, setLines] = useState([]);

  const data = {
    questions: [
      { id: 1, initial: "Who's he?", correct: "Who's he?", isReadOnly: true },
      { id: 2, initial: "", correct: "Who's she?", isReadOnly: false },
      { id: 3, initial: "", correct: "Who's he?", isReadOnly: false },
      { id: 4, initial: "", correct: "Who's she?", isReadOnly: false },
    ],
    answers: [
      { id: 1, text: "She is my aunt.", img: img, matchId: 2 },
      { id: 2, text: "She is my sister.", img: img, matchId: 2 },
      { id: 3, text: "He is my father.", img: img, matchId: 3 },
      { id: 4, text: "He is my brother.", img: img, matchId: 4 },
    ],
  };
  const correctMatches = { 1: 4, 2: 2, 3: 3, 4: 1 };

  const handleQuestionChange = (id, value) => {
    setUserQuestions({ ...userQuestions, [id]: value });
  };

  const handleLeftClick = (id) => setSelectedLeft(id);
  const handleRightClick = (id) => {
    if (selectedLeft) {
      setMatches({ ...matches, [selectedLeft]: id });
      setSelectedLeft(null);
    }
  };

  const checkAnswers = () => {
    let currentScore = 0;

    data.questions.forEach((q) => {
      const userAnswer = userQuestions[q.id]?.toLowerCase().trim();
      const correctAnswer = q.correct.toLowerCase().trim();

      if (userAnswer === correctAnswer) {
        currentScore += 1;
      }

      if (matches[q.id] === correctMatches[q.id]) {
        currentScore += 1;
      }
    });

    const totalScore = data.questions.length * 2;

    setScore(currentScore);
    setShowResults(true);

    // 🔥 Validation Logic
    if (currentScore === totalScore) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalScore}`);
    }
    else if (currentScore > 1) {
      ValidationAlert.error(`Score: ${currentScore} / ${totalScore}`);
    }
    else {
      ValidationAlert.warning("No correct answers. Try again!");
    }
  };

  const handleShowAnswer = () => {
    const answers = {};
    data.questions.forEach(q => answers[q.id] = q.correct);
    setUserQuestions(answers);
    setMatches(correctMatches);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserQuestions({ 1: "Who's he?", 2: "", 3: "", 4: "" });
    setMatches({});
    setShowResults(false);
    setShowAnswers(false);
  };

  useEffect(() => {
    const newLines = [];

    Object.keys(matches).forEach((leftId) => {
      const rightId = matches[leftId];

      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];

      if (leftEl && rightEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        newLines.push({
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        });
      }
    });

    setLines(newLines);
  }, [matches]);

  return (
    <div className="p-8 bg-white rounded-3xl max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="ex-A">C</div>
        <h1 className="header-title-page8">Look, trace, read, and write.</h1>
      </div>

      <div ref={containerRef} className="flex justify-between gap-20 relative">
        {/* Left Side: Questions */}
        <div className="flex-1 space-y-12">
          {data.questions.map((q) => (
            <div key={q.id} className="flex items-center gap-4 relative">
              <span className="font-bold text-blue-900 text-xl">{q.id}</span>
              <input
                type="text"
                value={userQuestions[q.id]}
                readOnly={q.isReadOnly}
                onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                className={`flex-1 border-b-2 border-gray-400 outline-none text-xl py-1 ${q.isReadOnly ? 'text-gray-500' : 'focus:border-blue-500'}`}
                placeholder=".................................................."
              />
              <div
                ref={(el) => (leftRefs.current[q.id] = el)}
                onClick={() => handleLeftClick(q.id)}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${selectedLeft === q.id ? 'bg-blue-500 scale-125' : 'bg-[#eb533c]'}`}
              />
            </div>
          ))}
        </div>

        {/* Right Side: Answers & Images */}
        <div className="flex-1 space-y-8">
          {data.answers.map((a) => (
            <div key={a.id} className="flex items-center gap-4 justify-end relative">
              <div
                ref={(el) => (rightRefs.current[a.id] = el)}
                onClick={() => handleRightClick(a.id)}
                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${Object.values(matches).includes(a.id) ? 'bg-green-500' : 'bg-[#eb533c]'}`}
              />
              <img src={a.img} alt="" className="max-w-12 max-h-12 rounded-full object-cover" />
              <span className="text-xl text-gray-700 w-40">{a.text}</span>
            </div>
          ))}
        </div>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#3b82f6"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>


      <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
    </div>
  );
};

export default WB_Unit1_Page4_Q1;