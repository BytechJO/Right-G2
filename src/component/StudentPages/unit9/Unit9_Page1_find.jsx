import React from "react";
import find_img from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 9.svg";
import FindQuestion from "../../FindQuestion";

const targetArea = {
  x1: 50,
  y1: 25,
  x2: 73,
  y2: 60,
};

const Unit9_Page1_find = () => (
  <FindQuestion
    title="I need your help. Can you help me find the ironing board in the grandparents picture?"
    subtitle="Wait for the full scene to load, scan it carefully, then tap the the ironing board."
    image={find_img}
    imageAlt="A family at home: people cooking, using a laptop, playing chess, and doing household tasks, with children playing outside."
    targetName="the ironing board"
    targetArea={targetArea}
    answerHighlight={MySVG}
    targetAudio=""
    imageHeight="75vh"
    highlightTop="25%"
    highlightLeft="53.5%"
    highlightHeight="41.5%"
    targetAriaLabel="Select the ironing board"
    pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
    keyboardSelectedMessage="The ironing board selected. Use Check Answer to check your answer."
    correctAnnouncement="Correct. You found the ironing board."
    correctAlertMessage="You found the ironing board! 🏆"
    wrongAnnouncement="That is not the ironing board. Try again."
    wrongAlertMessage="This is not the ironing board. Try again!"
    resetAnnouncement="Activity reset. Find the ironing board."
    showAnswerAnnouncement="The ironing board is highlighted."
  />
);

export default Unit9_Page1_find;
