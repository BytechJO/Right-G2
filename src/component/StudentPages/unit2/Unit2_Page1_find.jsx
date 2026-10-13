import React from "react";

import backgroundImage from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 2.svg";
import kiteSound from "../../../assets/audio/ClassBook/U 2/Page 10/a kite.mp3";
import FindQuestion from "../../FindQuestion";

const TARGET_NAME = "kite";

// تحويل من left/top/width/height إلى x1/y1/x2/y2
// x2 = 51 + 12 = 63 ، y2 = 13.5 + 14.5 = 28
const targetArea = {
  x1: 51,
  y1: 13.5,
  x2: 63,
  y2: 28,
};

const Unit2_Page1_find = () => {
  return (
    <FindQuestion
      title={`I need your help. Can you help me find a ${TARGET_NAME} in the picture?`}
      subtitle={`Scan the scene carefully, then tap, click, or press Enter or Space on the ${TARGET_NAME}.`}
      image={backgroundImage}
      targetAudio={kiteSound}
      // ⚠️ عدّليه حسب الصورة الفعلية، وخليه بدون ما يحدد مكان الطيارة الورقية
      imageAlt="A park scene with children and families playing."
      targetName={TARGET_NAME}
      targetArea={targetArea}
      answerHighlight={MySVG}
      imageHeight="70vh"
      highlightTop="13.5%"
      highlightLeft="51%"
      highlightWidth="12%"
      highlightHeight="14.5%"
      targetAriaLabel={`Select the ${TARGET_NAME}`}
      pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
      keyboardSelectedMessage={`${TARGET_NAME} selected. Use Check Answer to check your answer.`}
      correctAnnouncement={`Correct. You found the ${TARGET_NAME}.`}
      correctAlertMessage={`You found the ${TARGET_NAME}! 🏆`}
      wrongAnnouncement={`That is not the ${TARGET_NAME}. Try again.`}
      wrongAlertMessage={`This is not the ${TARGET_NAME}. Try again!`}
      resetAnnouncement={`Activity reset. Find the ${TARGET_NAME} in the scene.`}
      showAnswerAnnouncement={`The correct ${TARGET_NAME} is highlighted.`}
    />
  );
};

export default Unit2_Page1_find;