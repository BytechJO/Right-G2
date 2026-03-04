import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ValidationAlert from '../../Popup/ValidationAlert';
import Button from '../button';

import img from "../../../assets/imgs/test6.png";
const ALL_IMAGES = [
  { id: 'rat', src: img, letter: 'r' },
  { id: 'rabbit', src: img, letter: 'r' },
  { id: 'robot', src: img, letter: 'r' },
  { id: 'rose', src: img, letter: 'r' },
  { id: 'lamp', src: img, letter: 'l' },
  { id: 'lemon', src: img, letter: 'l' },
  { id: 'leaf', src: img, letter: 'l' },
];

// مكون الصورة القابلة للسحب
function DraggableImage({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <img
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      src={item.src}
      alt={item.id}
      className="max-w-24 max-h-24 object-contain bg-white border rounded-md shadow-sm cursor-grab active:cursor-grabbing"
    />
  );
}

// مكون الصندوق (منطقة الإفلات)
function DropZone({ id, items, letter }) {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full sm:w-64 min-h-[200px] border-4 border-dashed rounded-lg flex flex-col items-center p-4 transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-400'
        }`}
    >
      <span className="font-bold text-5xl text-gray-500 mb-4">
        {letter.toUpperCase()}
      </span>

      <SortableContext items={items.map(i => i.id)}>
        <div className="flex flex-wrap justify-center gap-2">
          {items.map(item => (
            <DraggableImage key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// المكون الرئيسي
const WB_Unit1_Page8_Q2_DND = () => {
  const [containers, setContainers] = useState({
    available: ALL_IMAGES,
    r: [],
    l: [],
  });
  const [activeItem, setActiveItem] = useState(null);
  const [validation, setValidation] = useState({ show: false, score: 0, total: ALL_IMAGES.length });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const findContainer = (id) => {
    if (id in containers) return id;
    return Object.keys(containers).find(key => containers[key].find(item => item.id === id));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const item = ALL_IMAGES.find(i => i.id === active.id);
    setActiveItem(item);
    setValidation({ show: false, score: 0, total: ALL_IMAGES.length });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const fromContainer = findContainer(active.id);
    const toContainer = over.id;

    if (fromContainer === toContainer) {
      setActiveItem(null);
      return;
    }

    // تأكد أن الهدف صندوق فعلي
    if (!containers[toContainer]) {
      setActiveItem(null);
      return;
    }

    setContainers(prev => {
      const newContainers = { ...prev };

      // إزالة العنصر من الصندوق الأصلي
      newContainers[fromContainer] = newContainers[fromContainer].filter(
        item => item.id !== active.id
      );

      // منع التكرار قبل الإضافة
      const alreadyExists = newContainers[toContainer].some(
        item => item.id === active.id
      );

      if (!alreadyExists) {
        const movedItem = ALL_IMAGES.find(i => i.id === active.id);
        newContainers[toContainer] = [...newContainers[toContainer], movedItem];
      }

      return newContainers;
    });

    setActiveItem(null);
  };

  const handleCheckAnswers = () => {
    // إذا لم يتم توزيع كل الصور
    if (containers.available.length > 0) {
      ValidationAlert.warning("Please drag all images into the boxes!");
      return;
    }

    let correctCount = 0;

    // احسب الصح في صندوق r
    correctCount += containers.r.filter(img => img.letter === "r").length;

    // احسب الصح في صندوق l
    correctCount += containers.l.filter(img => img.letter === "l").length;

    const total = ALL_IMAGES.length;

    if (correctCount === total) {
      ValidationAlert.success(`Score: ${correctCount}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correctCount}/${total}`);
    }
  };

  const handleReset = () => {
    setContainers({ available: ALL_IMAGES, r: [], l: [] });
    setValidation({ show: false, score: 0, total: ALL_IMAGES.length });
  };

  const handleShowAnswer = () => {
    const correctContainers = { available: [], r: [], l: [] };
    ALL_IMAGES.forEach(img => correctContainers[img.letter].push(img));
    setContainers(correctContainers);
    setValidation({ show: false, score: 0, total: ALL_IMAGES.length });
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="max-w-4xl mx-auto p-6 font-sans">
        <div className="flex items-center gap-4 mb-10">
          <div className="ex-A">B</div>
          <h1 className="header-title-page8">What are they? Write the words in the correct places.</h1>
        </div>
        {/* منطقة الصور المتاحة */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8 p-4 min-h-[120px] bg-gray-100 rounded-lg border-2 border-dashed">
          <SortableContext items={containers.available.map(i => i.id)}>
            {containers.available.map(item => <DraggableImage key={item.id} item={item} />)}
          </SortableContext>
          {containers.available.length === 0 && <span className="text-gray-400">All images have been placed!</span>}
        </div>

        {/* الصناديق */}
        <div className="flex flex-col sm:flex-row gap-10 justify-center mb-6">
          <DropZone id="r" items={containers.r} letter="r" />
          <DropZone id="l" items={containers.l} letter="l" />
        </div>

        {validation.show && <ValidationAlert score={validation.score} total={validation.total} />}

        <div className="mt-6">
          <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleReset} checkAnswers={handleCheckAnswers} />
        </div>
      </div>

      <DragOverlay>
        {activeItem ? <img src={activeItem.src} alt={activeItem.id} className="max-w-24 max-h-24 object-contain bg-white border rounded-md shadow-lg" /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit1_Page8_Q2_DND;
