import React from "react";

const CircularChart = ({ percentage, color, strokeWidth = 8 }) => {
  const radius = 50; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference formula
  const offset = circumference - (percentage / 100) * circumference || ""; // To calculate the progress

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke="#e6e6e6"
        strokeWidth={strokeWidth} // Background stroke width
      />
      {/* Progress Circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth} // Customize stroke width here
        strokeDasharray={circumference}
        strokeDashoffset={percentage == "-" ? 0 : offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)" // Rotates to start progress at the top
      />
      {/* Center Text */}
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dy="0.3em"
        fontSize="16px"
        style={{ fill: "var(--text-color)" }}
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default CircularChart;
