import React from "react";

import backgroundImage from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 1.svg";
import grandmaSound from "../../../assets/audio/ClassBook/U 1/Page 4/Grandma and Grandpa.mp3";
import FindQuestion from "../../FindQuestion";

const TARGET_NAME = "Grandma and Grandpa";

// تحويل من left/top/width/height إلى x1/y1/x2/y2
// x2 = 36 + 12 = 48 ، y2 = 18.5 + 15.5 = 34
const targetArea = {
  x1: 36,
  y1: 18.5,
  x2: 48,
  y2: 34,
};

const Page4_Interactive1 = () => {
  return (
    <FindQuestion
      title={`I need your help. Can you help me find ${TARGET_NAME} in the picture?`}
      subtitle={`Scan the scene carefully, then tap, click, or press Enter or Space on ${TARGET_NAME}.`}
      image={backgroundImage}
      targetAudio={grandmaSound}
      imageAlt="A family gathered in a living room: a man and a boy enter through the open door, a woman serves a tray of juice glasses, two children play on the floor with a doll and a teddy bear, and an older woman and man sit on a green sofa beside a coffee table with two glasses of juice."
      targetName={TARGET_NAME}
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="70vh"
      highlightTop="18.5%"
      highlightLeft="36%"
      highlightWidth="12%"
      highlightHeight="15.5%"
      targetAriaLabel={`Select ${TARGET_NAME}`}
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage={`${TARGET_NAME} selected. Use Check Answer to check your answer.`}
      correctAnnouncement={`Correct. You found ${TARGET_NAME}.`}
      correctAlertMessage={`You found ${TARGET_NAME}! 🏆`}
      wrongAnnouncement={`That is not ${TARGET_NAME}. Try again.`}
      wrongAlertMessage={`This is not ${TARGET_NAME}. Try again!`}
      resetAnnouncement={`Activity reset. Find ${TARGET_NAME} in the scene.`}
      showAnswerAnnouncement={`${TARGET_NAME} are highlighted.`}
    />
  );
};

export default Page4_Interactive1;