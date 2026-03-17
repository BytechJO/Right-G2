import React, { useState } from 'react';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

const exerciseDataN = {
    story: `"What time is it?" Tina asked her mom one day. "It is eleven o'clock in the morning," replied Mom. "We are going to the store at twelve thirty. When we are finished shopping, we will go to your grandmother's house. I told your grandfather that we would be there at two o'clock. We should get home by seven o'clock in the evening," said her mom while looking at a checklist of things to do. "When will we have dinner?" asked Tina. Her mom replied, "We will have dinner at a quarter to eight. We'll stop by the pizza place at a quarter past six and pick up some pizza on the way home." "Yummy, I can't wait!"`,
    events: [
        { id: 'n1', text: 'Tina and her mom will get home at 7:00 p.m.', correctNumber: 4 },
        { id: 'n2', text: 'Tina and her mom will go to the store at 12:30 p.m.', correctNumber: 2 },
        { id: 'n3', text: 'They are going to pick up pizza at 6:15 p.m.', correctNumber: 6 },
        { id: 'n4', text: "Tina's mom told her it was 11:00 a.m.", correctNumber: 1 },
        { id: 'n5', text: 'They will have dinner at 7:45 p.m.', correctNumber: 5 },
        { id: 'n6', text: 'They will visit Grandma at 2:00 p.m.', correctNumber: 3 },
    ],
};

const WB_Unit7_Page41_Q2 = () => {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleSelectNumber = (eventId, number) => {
        if (showResults) return;
        setAnswers((prev) => ({ ...prev, [eventId]: number }));
    };

    const checkAnswers = () => {
        const unanswered = exerciseDataN.events.filter(
            (e) => !answers[e.id]
        );

        if (unanswered.length > 0) {
            ValidationAlert.info();
            return;
        }

        setShowResults(true);
        let score = 0;
        let total = exerciseDataN.events.length;

        exerciseDataN.events.forEach((event) => {
            if (answers[event.id] === event.correctNumber) {
                score++;
            }
        });

        if (score === total) {
            ValidationAlert.success(`Score: ${score} / ${total}`);
        } else if (score > 0) {
            ValidationAlert.warning(`Score: ${score} / ${total}`);
        } else {
            ValidationAlert.error(`Score: ${score} / ${total}`);
        }
    };

    const handleShowAnswer = () => {
        const correctAnswers = {};
        exerciseDataN.events.forEach((event) => {
            correctAnswers[event.id] = event.correctNumber;
        });
        setAnswers(correctAnswers);
        setShowResults(true);
    };

    const handleStartAgain = () => {
        setAnswers({});
        setShowResults(false);
    };

    const getSelectClass = (eventId) => {
        if (!showResults) {
            return 'border-2 border-gray-300 focus:border-blue-500 focus:outline-none px-3 py-2 rounded-lg font-semibold w-16 text-center';
        }

        const event = exerciseDataN.events.find((e) => e.id === eventId);
        const isCorrect = answers[eventId] === event?.correctNumber;

        if (isCorrect) {
            return 'border-2 border-green-500 bg-green-50 px-3 py-2 rounded-lg font-semibold w-16 text-center text-green-800';
        }
        return 'border-2 border-red-500 bg-red-50 px-3 py-2 rounded-lg font-semibold w-16 text-center text-red-800';
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg">
            <div className="flex items-center gap-3 mb-6">
                <div className="ex-A">F</div>
                <h1 className="header-title-page8">Look, read, and number the events in the story.</h1>
            </div>

            {/* Story */}
            <div className=" p-6 rounded-lg mb-8">
                <p className="text-black text-l">
                    {exerciseDataN.story}
                </p>
            </div>

            {/* Events */}
            <div className="space-y-4 mb-8">
                {exerciseDataN.events.map((event, idx) => (
                    <div key={event.id} className="flex items-center gap-4">
                        <span className="font-bold text-lg text-gray-700 w-6">{String.fromCharCode(97 + idx)}.</span>
                        <p className="text-lg text-gray-700 flex-1">{event.text}</p>
                        <select
                            value={answers[event.id] || ''}
                            onChange={(e) => handleSelectNumber(event.id, parseInt(e.target.value))}
                            disabled={showResults}
                            className={getSelectClass(event.id)}
                        >
                            <option value="">-</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <Button
                handleStartAgain={handleStartAgain}
                handleShowAnswer={handleShowAnswer}
                checkAnswers={checkAnswers}
            />
        </div>
    );
}

export default WB_Unit7_Page41_Q2;