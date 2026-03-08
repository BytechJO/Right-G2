import { useState, useRef, useEffect } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const WB_Unit3_Page15_Q1 = () => {
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [matches, setMatches] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);
    const containerRef = useRef(null);
    const leftRefs = useRef({});
    const rightRefs = useRef({});
    const [lines, setLines] = useState([]);

    const data = {
        left: [
            { id: 1, img: img },
            { id: 2, img: img },
            { id: 3, img: img },
            { id: 4, img: img },
        ],
        right: [
            { id: 1, text: "It can’t swim." },
            { id: 2, text: "He can play the drum." },
            { id: 3, text: "He can’t ride a bike." },
            { id: 4, text: "It can climb the tree." },
        ],
    };

    const correctMatches = { 1: 3, 2: 1, 3: 2, 4:4 };

    const handleLeftClick = (id) => setSelectedLeft(id);
    const handleRightClick = (id) => {
        if (selectedLeft) {
            setMatches({ ...matches, [selectedLeft]: id });
            setSelectedLeft(null);
        }
    };

    const checkAnswers = () => {
        let currentScore = 0;

        const totalQuestions = Object.keys(correctMatches).length;

        Object.keys(correctMatches).forEach((leftId) => {
            const userMatch = matches[leftId];
            const correctMatch = correctMatches[leftId];

            if (userMatch && userMatch === correctMatch) {
                currentScore += 1;
            }
        });

        if (!currentScore) {
            ValidationAlert.warning("No correct matches. Try again.");
        }
        setScore(currentScore);

        // Validation
        if (currentScore === totalQuestions) {
            ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
        }
        else if (currentScore >= 0) {
            ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
        }
    };

    const handleShowAnswer = () => {
        setMatches(correctMatches);
        setShowAnswers(true);
    };

    const handleStartAgain = () => {
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
        <div className="p-8 bg-white rounded-3xl max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <div className="ex-A">E</div>
                <h1 className="header-title-page8">Look, read, and match.</h1>
            </div>

            <div ref={containerRef} className="flex justify-between gap-20 relative">

                {/* Right Side */}
                <div className="space-y-23.5">
                    {data.right.map((item) => (
                        <div key={item.id} className="flex items-center gap-6 justify-end">
                            <span className="font-bold text-blue-900 text-xl">{item.id}</span>
                            <span className="text-xl text-gray-700 max-w-30">{item.text}</span>
                            <div
                                ref={(el) => (rightRefs.current[item.id] = el)}
                                onClick={() => handleRightClick(item.id)}
                                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${Object.values(matches).includes(item.id) ? 'bg-green-500' : 'bg-[#eb533c]'}`}
                            />

                        </div>
                    ))}
                </div>

                {/* Left Side */}
                <div className="space-y-19">
                    {data.left.map((item) => (
                        <div key={item.id} className="flex items-center gap-6">
                            <div
                                ref={(el) => (leftRefs.current[item.id] = el)}
                                onClick={() => handleLeftClick(item.id)}
                                className={`w-4 h-4 rounded-full cursor-pointer transition-all ${selectedLeft === item.id ? 'bg-blue-500 scale-125' : 'bg-[#eb533c]'}`}
                            />
                            <img src={item.img} alt="" className="max-w-16 max-h-16 rounded-full object-cover" />


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

export default WB_Unit3_Page15_Q1;