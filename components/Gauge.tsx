import React from 'react';
import { Language } from '../types';

interface GaugeProps {
  score: number;
  lang: Language;
}

const Gauge: React.FC<GaugeProps> = ({ score, lang }) => {
  // SVG Math
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "text-red-500";
  if (score >= 40) color = "text-yellow-500";
  if (score >= 70) color = "text-blue-500"; // X Blue
  if (score >= 90) color = "text-green-500";

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] transition-all duration-1000 ease-out"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-800"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-slate-400">{lang === 'tr' ? 'PUAN' : 'SCORE'}</span>
      </div>
    </div>
  );
};

export default Gauge;
