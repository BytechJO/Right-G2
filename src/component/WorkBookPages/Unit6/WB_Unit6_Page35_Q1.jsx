import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 35/Asset 41.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 35/Asset 42.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 35/Asset 43.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 35/Asset 44.svg";

const SENTENCES = [
  { id: "s1", text: "John goes to school at eight o'clock in the morning." },
  { id: "s2", text: "John comes home at 2:30 in the afternoon." },
  { id: "s3", text: "John does his homework at 4:00 in the afternoon." },
  { id: "s4", text: "John goes to bed at 8:30 in the evening." },
];

const CORRECT_ANSWERS = {
  drop_school: "s1",
  drop_home: "s2",
  drop_homework: "s3",
  drop_bed: "s4",
};

function DraggableSentence({ sentence, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sentence.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isUsed ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white border-2 border-blue-100 rounded-xl shadow-sm touch-none cursor-grab text-blue-800 font-medium text-sm transition-all ${
        isUsed
          ? "bg-gray-100 text-gray-400 border-gray-200 pointer-events-none"
          : "hover:border-blue-400 hover:shadow-md"
      }`}
    >
      {sentence.text}
    </div>
  );
}

function PictureDropZone({
  id,
  imgSrc,
  title,
  content,
  isCorrect,
  isSubmitted,
}) {
  const { setNodeRef, isOver } = useSortable({ id });
  const isWrong = isSubmitted && content && !isCorrect;

  return (
    <div className="relative flex flex-col items-center space-y-3 p-4 w-[90%]">
      <div className="relative h-40 w-full">
        <div className="w-full h-40 flex items-center justify-center">
          <img
            src={imgSrc}
            style={{
              width: "auto",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        

        {isWrong && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
            <span className="text-white text-lg font-bold leading-none">✕</span>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`w-[90%] min-h-[60px] border-2 border-dashed rounded-xl flex items-center justify-center p-2 text-center transition-all ${isWrong && "border-red-500"}`}
      >
        {content ? (
          <span className="text-blue-900 font-bold text-sm leading-tight">
            {SENTENCES.find((s) => s.id === content).text}
          </span>
        ) : (
          <span className="text-gray-300 text-xs italic">
            Drag the correct sentence here...
          </span>
        )}
      </div>
    </div>
  );
}

const WB_Unit6_Page35_Q1 = () => {
  const [placed, setPlaced] = useState({
    drop_school: null,
    drop_home: null,
    drop_homework: null,
    drop_bed: null,
  });
  const [activeId, setActiveId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && over.id.startsWith("drop")) {
      setPlaced((prev) => ({ ...prev, [over.id]: active.id }));
    }
    setActiveId(null);
  };

  const checkAnswers = () => {
    if (isSubmitted) return;
    const hasEmpty = Object.values(placed).some((value) => value === null);
    if (hasEmpty) {
      ValidationAlert.info("Please complete all answers before checking.");
      return;
    }

    let currentScore = 0;
    Object.keys(CORRECT_ANSWERS).forEach((key) => {
      if (placed[key] === CORRECT_ANSWERS[key]) currentScore++;
    });

    const total = Object.keys(CORRECT_ANSWERS).length;
    const scoreMessage = `Score: ${currentScore} / ${total}`;

    if (currentScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (currentScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setPlaced({
      drop_school: null,
      drop_home: null,
      drop_homework: null,
      drop_bed: null,
    });
    setIsSubmitted(false);
  };

  const handleShowAnswer = () => {
    setPlaced(CORRECT_ANSWERS);
    setIsSubmitted(true);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">E</div>Look, read, and write.
        </h1>

        <DndContext
          sensors={sensors}
          onDragStart={(e) => setActiveId(e.active.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="max-w-6xl font-sans">
            <div className="flex lg:flex-row gap-10">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-1 gap-6">
                <PictureDropZone
                  id="drop_school"
                  imgSrc={img1}
                  // title="morning"
                  content={placed.drop_school}
                  isCorrect={placed.drop_school === CORRECT_ANSWERS.drop_school}
                  isSubmitted={isSubmitted}
                />
                <PictureDropZone
                  id="drop_home"
                  imgSrc={img2}
                  title="afternoon"
                  content={placed.drop_home}
                  isCorrect={placed.drop_home === CORRECT_ANSWERS.drop_home}
                  isSubmitted={isSubmitted}
                />
                <PictureDropZone
                  id="drop_homework"
                  imgSrc={img3}
                  title="afternoon"
                  content={placed.drop_homework}
                  isCorrect={
                    placed.drop_homework === CORRECT_ANSWERS.drop_homework
                  }
                  isSubmitted={isSubmitted}
                />
                <PictureDropZone
                  id="drop_bed"
                  imgSrc={img4}
                  title="evening"
                  content={placed.drop_bed}
                  isCorrect={placed.drop_bed === CORRECT_ANSWERS.drop_bed}
                  isSubmitted={isSubmitted}
                />
              </div>

              <div className="w-full lg:w-80">
                <div className="sticky top-6 bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 shadow-sm">
                  <h3 className="font-black text-blue-900 mb-5 text-center uppercase tracking-wider">
                    Sentences Bank
                  </h3>
                  <div className="flex flex-col gap-3">
                    <SortableContext items={SENTENCES.map((s) => s.id)}>
                      {SENTENCES.map((sentence) => (
                        <DraggableSentence
                          key={sentence.id}
                          sentence={sentence}
                          isUsed={Object.values(placed).includes(sentence.id)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                  <p className="mt-6 text-xs text-blue-400 text-center font-medium italic">
                    Drag the sentences to match John's activities!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center">
              <Button
                handleShowAnswer={handleShowAnswer}
                handleStartAgain={handleReset}
                checkAnswers={checkAnswers}
              />
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              <div className="p-4 bg-white border-2 border-blue-500 rounded-2xl shadow-2xl text-blue-900 font-bold text-sm scale-105 rotate-2">
                {SENTENCES.find((s) => s.id === activeId).text}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default WB_Unit6_Page35_Q1;
