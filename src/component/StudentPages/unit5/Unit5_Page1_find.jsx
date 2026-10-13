import React from "react";

import find_img from "../../../assets/imgs/Right 2 Unit 5 Yummy I Like It/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 5.svg";
import FindQuestion from "../../FindQuestion";

// ⚠️ لازم تضيفي ملف صوت "jello" وتعدّلي المسار حسب مكانه الفعلي
// import targetAudio from "../../../assets/audio/ClassBook/U 5/Page 1/jello.mp3";

const targetAudio =""
const targetArea = {
  x1: 48.21,
  y1: 46.5,
  x2: 54.56,
  y2: 52.99,
};


const Unit5_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the jello in the picture?"
      subtitle="Wait for the full scene to load, scan it carefully, then tap the the jello."
      image={find_img}
      targetAudio={targetAudio}
      // ⚠️ عدّليه ليطابق المشهد، وخليه بدون ما يحدد مكان الجيلو
      imageAlt="A busy scene with food, people and a restaurant."
      targetName="jello"
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="75vh"
      highlightTop="48%"
      highlightLeft="47.5%"
      highlightHeight="7%"
      targetAriaLabel="Select the jello"
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Jello selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the jello."
      correctAlertMessage="You found the jello! 🏆"
      wrongAnnouncement="That is not the jello. Try again."
      wrongAlertMessage="This is not the jello. Try again!"
      resetAnnouncement="Activity reset. Find the jello."
      showAnswerAnnouncement="The jello is highlighted."
    />
  );
};

export default Unit5_Page1_find;