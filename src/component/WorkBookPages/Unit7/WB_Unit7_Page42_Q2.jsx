import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

const exerciseDataP = {
  sentences: [
    { id: 'p1', words: ['flight', 'attendant'], correct: ['flight', 'attendant'], question: 'My mom is a _______ _______.', hint: 'My mom is a flight attendant.' },
    { id: 'p2', words: ['suitcase'], correct: ['suitcase'], question: 'She can pack her _______.', hint: 'She can pack her suitcase.' },
    { id: 'p3', words: ['souvenir', 'shop'], correct: ['souvenir', 'shop'], question: 'He is looking at the things in the _______.', hint: 'He is looking at the things in the souvenir shop.' },
    { id: 'p4', words: ['arrival', 'of', 'the', 'airplane'], correct: ['arrival', 'of', 'the', 'airplane'], question: 'We saw the _______ _______ _______ _______.', hint: 'We saw the arrival of the airplane.' },
    { id: 'p5', words: ['pilot'], correct: ['pilot'], question: 'The _______ walked to the plane.', hint: 'The pilot walked to the plane.' },
  ],
};

const DropZone = ({ id, items, isCorrect }) => {
  const { setNodeRef } = useSortable({ id });

  const bgColor = isCorrect === undefined ? 'bg-gray-50' : isCorrect ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isCorrect === undefined ? 'border-gray-300' : isCorrect ? 'border-green-500' : 'border-red-500';

  return (
    <div
      ref={setNodeRef}
      className={`${bgColor} border-2 ${borderColor} rounded-lg p-4 min-h-16 flex flex-wrap gap-2 items-center justify-start`}
    >
      {items.length === 0 ? (
        <span className="text-gray-400 text-sm">Drop words here</span>
      ) : (
        items.map((item, idx) => (
          <span key={idx} className="bg-white border-2 border-gray-300 px-3 py-1 rounded font-semibold text-gray-800">
            {item}
          </span>
        ))
      )}
    </div>
  );
};

const WB_Unit7_Page42_Q2 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    if (showResults) return;
    const { active, over } = event;
    if (!over) return;

    const allSentenceIds = exerciseDataP.sentences.map(s => s.id);
    const activeSentenceId = allSentenceIds.find(id => active.id.toString().startsWith(id));
    const overSentenceId = allSentenceIds.find(id => over.id.toString().startsWith(id));
    if (activeSentenceId !== overSentenceId) return;

    const sentenceId = activeSentenceId;
    const currentAnswer = answers[sentenceId] || [];
    const activeIndex = currentAnswer.findIndex(item => item === active.id);
    const overIndex = currentAnswer.findIndex(item => item === over.id);
    if (activeIndex === -1 || overIndex === -1) return;

    const newAnswer = arrayMove(currentAnswer, activeIndex, overIndex);
    setAnswers(prev => ({ ...prev, [sentenceId]: newAnswer }));
  };

  const handleAddWord = (sentenceId, word) => {
    if (showResults) return;
    const currentAnswer = answers[sentenceId] || [];
    if (!currentAnswer.includes(word)) {
      setAnswers(prev => ({ ...prev, [sentenceId]: [...currentAnswer, word] }));
    }
  };

  const handleRemoveWord = (sentenceId, word) => {
    if (showResults) return;
    const currentAnswer = answers[sentenceId] || [];
    setAnswers(prev => ({ ...prev, [sentenceId]: currentAnswer.filter(w => w !== word) }));
  };

  const checkAnswers = () => {
    const unanswered = exerciseDataP.sentences.filter(s => !answers[s.id] || answers[s.id].length === 0);
    if (unanswered.length > 0) { ValidationAlert.info(); return; }

    setShowResults(true);
    let score = 0;
    exerciseDataP.sentences.forEach(sentence => {
      const userAnswer = answers[sentence.id] || [];
      if (JSON.stringify(userAnswer) === JSON.stringify(sentence.correct)) score++;
    });

    if (score === exerciseDataP.sentences.length) ValidationAlert.success(`Score: ${score} / ${exerciseDataP.sentences.length}`);
    else if (score > 0) ValidationAlert.warning(`Score: ${score} / ${exerciseDataP.sentences.length}`);
    else ValidationAlert.error(`Score: ${score} / ${exerciseDataP.sentences.length}`);
  };

  const handleShowAnswer = () => {
    const correctAnswers = {};
    exerciseDataP.sentences.forEach(s => { correctAnswers[s.id] = s.correct; });
    setAnswers(correctAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => { setAnswers({}); setShowResults(false); };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="ex-A">H</div>
          <h1 className="header-title-page8">
            Read and look. Unscramble the word. Rewrite the sentence.
          </h1>
        </div>

        <div className="space-y-8 mb-8">
          {exerciseDataP.sentences.map((sentence, idx) => {
            const currentAnswer = answers[sentence.id] || [];
            const isCorrect = JSON.stringify(currentAnswer) === JSON.stringify(sentence.correct);

            return (
              <div key={sentence.id} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                <p className="text-lg text-gray-700 mb-4">
                  <span className="font-bold">{idx + 1}.</span> {sentence.question}
                </p>

                <SortableContext items={currentAnswer} strategy={verticalListSortingStrategy}>
                  <DropZone id={`${sentence.id}-drop`} items={currentAnswer} isCorrect={showResults ? isCorrect : undefined} />
                </SortableContext>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sentence.words.map(word => (
                    <button
                      key={word}
                      onClick={() => currentAnswer.includes(word) ? handleRemoveWord(sentence.id, word) : handleAddWord(sentence.id, word)}
                      disabled={showResults}
                      className={`px-3 py-2 rounded-lg font-semibold cursor-pointer transition-all ${
                        currentAnswer.includes(word)
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-200 text-gray-800 border-2 border-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {showResults && (
                  <p className="text-sm text-gray-600 mt-3">
                    <span className="font-semibold">Correct answer:</span> {sentence.hint}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Button handleStartAgain={handleStartAgain} handleShowAnswer={handleShowAnswer} checkAnswers={checkAnswers} />
      </div>
    </DndContext>
  );
};

export default WB_Unit7_Page42_Q2;