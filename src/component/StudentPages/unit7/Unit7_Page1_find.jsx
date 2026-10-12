import React from "react";

import find_img from "../../../assets/imgs/Right 2 Unit 7 Its Boarding Time/P58.png"; //======= should change ==========
import MySVG from "../../../assets/imgs/Interactive Svg un 7.svg";
import FindQuestion from "../../FindQuestion";

// ⚠️ ما في ملف صوت لهاد السؤال. إذا أضفتيه، فعّلي الاستيراد وعدّلي المسار
// import targetAudio from "../../../assets/audio/ClassBook/U 7/Page 1/ticket.mp3";

const targetAudio = "";

// المنطقة الصحيحة (بالنسب المئوية)
const targetArea = {
  x1: 49.56,
  y1: 43.25,
  x2: 65.41,
  y2: 90.08,
};

const Unit7_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the person holding a ticket in the pictures?"
      subtitle="Scan the whole picture first, then tap the the person holding a ticket."
      image={find_img}
      targetAudio={targetAudio}
      // ⚠️ عدّليه ليطابق الصفحة، وخليه بدون ما يحدد مكان الشخص اللي ماسك التذكرة
      imageAlt="A busy boarding scene with many people."
      targetName="the person holding a ticket"
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="75vh"
      highlightTop="45.5%"
      highlightLeft="50.6%"
      highlightHeight="41%"
      targetAriaLabel="Select the person holding a ticket"
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="The person holding a ticket selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the person holding a ticket."
      correctAlertMessage="You found the person holding a ticket! 🏆"
      wrongAnnouncement="That is not the person holding a ticket. Try again."
      wrongAlertMessage="This is not the person holding a ticket. Try again!"
      resetAnnouncement="Activity reset. Find the person holding a ticket."
      showAnswerAnnouncement="The person holding a ticket is highlighted."
    />
  );
};

export default Unit7_Page1_find;