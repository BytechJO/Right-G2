import Page8_Q1 from "./unit1/Page8_Q1";
import Page8_Q2 from "./unit1/Page8_Q2";
import Page8_Q3 from "./unit1/Page8_Q3";
import Page8_Q4 from "./unit1/Page8_Q4";
import Page9_Q1 from "./unit1/Page9_Q1";
import Page9_Q2 from "./unit1/Page9_Q2";

import Unit2_Page5_Q1 from "./unit2/Unit2_Page5_Q1";
import Unit2_Page5_Q2 from "./unit2/Unit2_Page5_Q2";
import Unit2_Page5_Q3 from "./unit2/Unit2_Page5_Q3";
import Unit2_Page6_Q1 from "./unit2/Unit2_Page6_Q1";
import Unit2_Page6_Q2 from "./unit2/Unit2_Page6_Q2";

import Review1_Page1_Q1 from "./review1&2/Review1_Page1_Q1";
import Review1_Page1_Q2 from "./review1&2/Review1_Page1_Q2";
import Review1_Page2_Q1 from "./review1&2/Review1_Page2_Q1";
import Review1_Page2_Q2 from "./review1&2/Review1_Page2_Q2";
import Review1_Page2_Q3 from "./review1&2/Review1_Page2_Q3";

import Review2_Page1_Q1 from "./review1&2/Review2_Page1_Q1";
import Review2_Page1_Q2 from "./review1&2/Review2_Page1_Q2";
import Review2_Page1_Q3 from "./review1&2/Review2_Page1_Q3";
import Review2_Page1_Q4 from "./review1&2/Review2_Page1_Q4";
import Review2_Page2_Q1 from "./review1&2/Review2_Page2_Q1";
import Review2_Page2_Q2 from "./review1&2/Review2_Page2_Q2";
import Review2_Page2_Q3 from "./review1&2/Review2_Page2_Q3";

import Unit3_Page5_Q1 from "./unit3/Unit3_Page5_Q1";
import Unit3_Page5_Q2 from "./unit3/Unit3_Page5_Q2";
import Unit3_Page5_Q3 from "./unit3/Unit3_Page5_Q3";
import Unit3_Page5_Q4 from "./unit3/Unit3_Page5_Q4";
import Unit3_Page6_Q1 from "./unit3/Unit3_Page6_Q1";
import Unit3_Page6_Q2 from "./unit3/Unit3_Page6_Q2";

import Unit4_Page5_Q1 from "./unit4/Unit4_Page5_Q1";
import Unit4_Page5_Q2 from "./unit4/Unit4_Page5_Q2";
import Unit4_Page5_Q3 from "./unit4/Unit4_Page5_Q3";
import Unit4_Page5_Q4 from "./unit4/Unit4_Page5_Q4";
import Unit4_Page6_Q1 from "./unit4/Unit4_Page6_Q1";
import Unit4_Page6_Q2 from "./unit4/Unit4_Page6_Q2";

export const lessons = [
  // UNIT 1
  { component: Page8_Q1, unit: 1 },
  { component: Page8_Q2, unit: 1 },
  { component: Page8_Q3, unit: 1 },
  { component: Page8_Q4, unit: 1 },
  { component: Page9_Q1, unit: 1 },
  { component: Page9_Q2, unit: 1, lastOfUnit: true }, //5

  { component: Unit2_Page5_Q1, unit: 2 },
  { component: Unit2_Page5_Q2, unit: 2 },
  { component: Unit2_Page5_Q3, unit: 2 },
  { component: Unit2_Page6_Q1, unit: 2 },
  { component: Unit2_Page6_Q2, unit: 2 }, //10

  { component: Review1_Page1_Q1, unit: 1, isReview: true },
  { component: Review1_Page1_Q2, unit: 1, isReview: true },
  { component: Review1_Page2_Q1, unit: 1, isReview: true },
  { component: Review1_Page2_Q2, unit: 1, isReview: true },
  { component: Review1_Page2_Q3, unit: 1, isReview: true },
  { component: Review2_Page1_Q1, unit: 2, isReview: true },
  { component: Review2_Page1_Q2, unit: 2, isReview: true },
  { component: Review2_Page1_Q3, unit: 2, isReview: true },
  { component: Review2_Page1_Q4, unit: 2, isReview: true },
  { component: Review2_Page2_Q1, unit: 2, isReview: true },
  { component: Review2_Page2_Q2, unit: 2, isReview: true },
  { component: Review2_Page2_Q3, unit: 2, isReview: true }, //22

  { component: Unit3_Page5_Q1, unit: 3 }, //23
  { component: Unit3_Page5_Q2, unit: 3 }, //24
  { component: Unit3_Page5_Q3, unit: 3 }, //25
  { component: Unit3_Page5_Q4, unit: 3 }, //26
  { component: Unit3_Page6_Q1, unit: 3 }, //27
  { component: Unit3_Page6_Q2, unit: 3 }, //28

  { component: Unit4_Page5_Q1, unit: 4 }, //29
  { component: Unit4_Page5_Q2, unit: 4 }, //30
  { component: Unit4_Page5_Q3, unit: 4 }, //31
  { component: Unit4_Page5_Q4, unit: 4 },//32
  { component: Unit4_Page6_Q1, unit: 4 },//33
  { component: Unit4_Page6_Q2, unit: 4 },//33
];
