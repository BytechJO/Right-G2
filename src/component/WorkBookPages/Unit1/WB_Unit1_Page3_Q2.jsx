import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";
import { useRef, useEffect } from "react";

const WB_Unit1_Page3_Q2 = () => {
  const [userWords, setUserWords] = useState({ 1: "", 2: "", 3: "", 4: "" });
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);

  const containerRef = useRef(null);
  const wordRefs = useRef({});
  const imageRefs = useRef({});
  const [lines, setLines] = useState([]);

  const data = {
    words: [
      { id: 1, scrambled: "tisesr", correct: "sister" },
      { id: 2, scrambled: "aftreh", correct: "father" },
      { id: 3, scrambled: "lapy", correct: "play" },
      { id: 4, scrambled: "thomer", correct: "mother" },
    ],
    images: [
      { id: 1, img: img, matchId: 3 }, // play (children playing)
      { id: 2, img: img, matchId: 4 }, // mother
      { id: 3, img: img, matchId: 1 }, // sister
      { id: 4, img: img, matchId: 2 }, // father
    ],
  };

  const handleWordChange = (id, value) => {
    setUserWords({ ...userWords, [id]: value });
  };

  const handleWordClick = (id) => {
    setSelectedWord(id);
  };

  const handleImageClick = (imageId) => {
    if (selectedWord) {
      setMatches({ ...matches, [selectedWord]: imageId });
      setSelectedWord(null);
    }
  };

  const checkAnswers = () => {
    // 1️⃣ Validation
    for (let w of data.words) {
      if (!userWords[w.id] || !userWords[w.id].trim()) {
        ValidationAlert.warning("Please write all words before checking.");
        return;
      }

      if (!matches[w.id]) {
        ValidationAlert.warning("Please match all words with images before checking.");
        return;
      }
    }

    // 2️⃣ حساب النتيجة
    let currentScore = 0;

    data.words.forEach((w) => {
      const correctImageId = data.images.find(
        (imgObj) => imgObj.matchId === w.id
      )?.id;

      const isWordCorrect =
        userWords[w.id]?.toLowerCase().trim() ===
        w.correct.toLowerCase().trim();

      const isMatchCorrect =
        matches[w.id] === correctImageId;

      if (isWordCorrect) currentScore += 1;
      if (isMatchCorrect) currentScore += 1;
    });

    setScore(currentScore);
    setShowResults(true);

    // 3️⃣ Alert بالنتيجة
    const maxScore = data.words.length * 2;

    if (currentScore === maxScore) {

      ValidationAlert.success(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:green;">Score: ${currentScore} / ${maxScore}</b>
        </div>
      `);
    } else {
      ValidationAlert.error(`
        <div style="font-size:20px;text-align:center;">
          <b style="color:red;">Score: ${currentScore} / ${maxScore}</b>
        </div>
      `);
    }
  };

  const handleShowAnswer = () => {
    const correctWords = {};
    const correctMatches = {};
    data.words.forEach((w) => {
      correctWords[w.id] = w.correct;
      const targetImg = data.images.find(imgObj => imgObj.matchId === w.id);
      correctMatches[w.id] = targetImg.id;
    });
    setUserWords(correctWords);
    setMatches(correctMatches);
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserWords({ 1: "", 2: "", 3: "", 4: "" });
    setMatches({});
    setSelectedWord(null);
    setShowResults(false);
    setShowAnswers(false);
    setScore(0);
  };
  useEffect(() => {
    const newLines = [];

    Object.entries(matches).forEach(([wordId, imageId]) => {
      const wordEl = wordRefs.current[wordId];
      const imageEl = imageRefs.current[imageId];

      if (wordEl && imageEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const wordRect = wordEl.getBoundingClientRect();
        const imageRect = imageEl.getBoundingClientRect();

        newLines.push({
          x1: wordRect.left + wordRect.width / 2 - containerRect.left,
          y1: wordRect.top + wordRect.height / 2 - containerRect.top,
          x2: imageRect.left + imageRect.width / 2 - containerRect.left,
          y2: imageRect.top + imageRect.height / 2 - containerRect.top,
        });
      }
    });

    setLines(newLines);
  }, [matches]);
  return (
    <div
  ref={containerRef}
  className="relative flex flex-col items-center p-8 bg-white rounded-3xl max-w-5xl mx-auto"
>
      <div className="w-full flex items-center gap-4 mb-12">
        <div className="ex-A">B</div>
        <h1 className="header-title-page8">Unscramble, write, and match.</h1>
      </div>

      <div className="grid grid-cols-4 gap-8 w-full lg:mb-35">
        {data.words.map((w) => (
          <div key={w.id} className="flex flex-col items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="font-bold text-blue-900 text-xl">{w.id}</span>
              <span className="text-xl text-gray-700">{w.scrambled}</span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={userWords[w.id]}
                onChange={(e) => handleWordChange(w.id, e.target.value)}
                className={`w-full border-b-2 border-gray-400 text-center text-xl outline-none py-1 focus:border-blue-500 transition-colors ${showAnswers ? 'text-green-600 font-bold' : ''}`}
                placeholder="......"
              />
              {/* نقطة التوصيل العلوية */}
              <div
                ref={(el) => (wordRefs.current[w.id] = el)}
                onClick={() => handleWordClick(w.id)}
                className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full cursor-pointer transition-all ${selectedWord === w.id ? 'bg-blue-500 scale-125 ring-4 ring-blue-200' : 'bg-[#eb533c] hover:scale-110'}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* مساحة لرسم الخطوط أو عرض التوصيلات */}
      <div className="grid grid-cols-4 gap-8 w-full mt-12">
        {data.images.map((imgObj) => (
          <div key={imgObj.id} className="flex flex-col items-center gap-6 relative">
            {/* نقطة التوصيل السفلية */}
            <div
              ref={(el) => (imageRefs.current[imgObj.id] = el)}
              onClick={() => handleImageClick(imgObj.id)}
              className={`w-4 h-4 rounded-full cursor-pointer mb-4 transition-all ${Object.values(matches).includes(imgObj.id) ? 'bg-green-500' : 'bg-[#eb533c] hover:scale-110'}`}
            />
            <div className="max-w-32 max-h-32 flex items-center justify-center overflow-hidden rounded-xl border-2 border-transparent hover:border-gray-200 transition-all">
              <img src={imgObj.img} alt="match" className="max-w-full max-h-full object-contain" />
            </div>

           
          </div>
        ))}
      </div>

      <div className="mt-16 w-full flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
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
      strokeWidth="3"
    />
  ))}
</svg>
    </div>
  );
};

export default WB_Unit1_Page3_Q2;