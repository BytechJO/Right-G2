import React from "react";

import find_img from "../../../assets/imgs/Right 2 Unit 6 Helens Day/G4_U6_Pg_46_47.png"; //======= should change ==========
import MySVG from "../../../assets/imgs/Interactive Svg un 6.svg";
import FindQuestion from "../../FindQuestion";

// ⚠️ ما في ملف صوت لهاد السؤال. إذا أضفتيه، فعّلي الاستيراد وعدّلي المسار
// import targetAudio from "../../../assets/audio/ClassBook/U 6/Page 1/helen.mp3";

const targetAudio = "";

// المنطقة الصحيحة (بالنسب المئوية)
const targetArea = {
  x1: 10.6,
  y1: 47.02,
  x2: 26,
  y2: 65,
};

const Unit6_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find Helen stretching her arms in one of the pictures?"
      subtitle="Wait for the full scene to load, scan it carefully, then tap the helen stretching her arms."
      image={find_img}
      targetAudio={targetAudio}
      // ⚠️ عدّليه ليطابق الصفحة، وخليه بدون ما يحدد مكان Helen وهي بتتمطّى
      imageAlt="Several pictures showing Helen's day."
      targetName="Helen stretching her arms"
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="75vh"
      highlightTop="48%"
      highlightLeft="11.5%"
      highlightWidth="14%"
      highlightHeight="16%"
      targetAriaLabel="Select Helen stretching her arms"
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Helen stretching her arms selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found Helen stretching her arms."
      correctAlertMessage="You found Helen stretching her arms! 🏆"
      wrongAnnouncement="That is not Helen stretching her arms. Try again."
      wrongAlertMessage="This is not Helen stretching her arms. Try again!"
      resetAnnouncement="Activity reset. Find Helen stretching her arms."
      showAnswerAnnouncement="Helen stretching her arms is highlighted."
    />
  );
};

export default Unit6_Page1_find;