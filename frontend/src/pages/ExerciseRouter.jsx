import React from "react";
import { useParams } from "react-router-dom";
import StatMeasures from "./StatMeasures";
import StatMeasuresComp from "./StatMeasuresCompare";
import StatMeasuresComparisonEnhanced from "./StatMeasuresComparisonEnhanced";
import RangeMeasures from "./RangeMeasures";
const compareCodes = ["MD_05", "SD_05"];
const enhancedCompareCodes = ["Insights_01", "Insights_02"]; // ← Add more here as needed
const rangeCodes = ["Range_01" , "Range_02" , "Range_03"];

export default function ExerciseRouter() {
  const { code } = useParams();

  if (enhancedCompareCodes.includes(code)) {
    return <StatMeasuresComparisonEnhanced />;
  }

  if (compareCodes.includes(code)) {
    return <StatMeasuresComp />;
  }

  if (rangeCodes.includes(code)) {
    return<RangeMeasures/>;
  }

  return <StatMeasures />;
}
