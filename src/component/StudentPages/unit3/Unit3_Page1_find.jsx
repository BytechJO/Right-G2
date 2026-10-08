import React from "react";

import find_img from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 3.svg";
import FindQuestion from "../../FindQuestion";
import targetAudio from "../../../assets/audio/ClassBook/U 3/Page 22/camera.mp3"
// ⚠️ لازم تضيفي ملف صوت "camera" (مثل ملف الولد اللي بيسكّر الشباك بالمثال)
// import targetAudio from "../../../assets/unit3/Page 22/camera.mp3";

const targetArea = {
  x1: 40,
  y1: 49,
  x2: 52,
  y2: 87,
};

const Unit3_Page1_find = () => {
  return (
    <FindQuestion
      title="I need your help. Can you help me find the camera in the picture?"
      subtitle="Wait for the full scene to load, scan it carefully, then tap the the camera."
      image={find_img}
      // targetAudio={targetAudio}
      imageAlt="A picnic scene with people and things outdoors."
      targetName="camera"
      targetArea={targetArea}
      answerHighlight={MySVG}
      targetAudio={targetAudio}
      imageHeight="75vh"
      highlightTop="48%"
      highlightLeft="40.2%"
      highlightHeight="42%"
      targetAriaLabel="Select the camera"
      pointerSelectedMessage="A point in the picnic scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage="Camera selected. Use Check Answer to check your answer."
      correctAnnouncement="Correct. You found the camera."
      correctAlertMessage="You found the camera! 🏆"
      wrongAnnouncement="That is not the camera. Try again."
      wrongAlertMessage="This is not the camera. Try again!"
      resetAnnouncement="Activity reset. Find the camera."
      showAnswerAnnouncement="The camera is highlighted."
    />
  );
};

export default Unit3_Page1_find;