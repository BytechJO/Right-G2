import React from "react";

import find_img from "../../../assets/imgs/Right 2 Unit 4 Helens Uncle is a Photographer/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 4.svg";
import FindQuestion from "../../FindQuestion";

// ⚠️ لازم تضيفي ملف صوت "taxi" وتعدّلي المسار حسب مكانه الفعلي، وبعدها فكّي التعليق
import targetAudio from "../../../assets/audio/ClassBook/U 4/Page 28/taxi.mp3";

const targetArea = {
  x1: 25,
  y1: 52,
  x2: 36,
  y2: 66,
};

const Unit4_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the taxi in the photographer picture?"
      subtitle="Wait for the full scene to load, scan it carefully, then tap the the taxi."
      image={find_img}
      targetAudio={targetAudio}
      // ⚠️ عدّليه ليطابق المشهد، وخليه بدون ما يحدد مكان التاكسي
      imageAlt="A street scene with people, vehicles and buildings."
      targetName="taxi"
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="75vh"
      highlightTop="52%"
      highlightLeft="25%"
      highlightWidth="10%"
      highlightHeight="14%"
      targetAriaLabel="Select the taxi"
      pointerSelectedMessage="A point in the street scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Taxi selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the taxi."
      correctAlertMessage="You found the taxi! 🏆"
      wrongAnnouncement="That is not the taxi. Try again."
      wrongAlertMessage="This is not the taxi. Try again!"
      resetAnnouncement="Activity reset. Find the taxi."
      showAnswerAnnouncement="The taxi is highlighted."
    />
  );
};

export default Unit4_Page1_find;