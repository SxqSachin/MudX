import React from "react";

type ProgressBarParam = {
  max: number;
  cur: number;
  direction?: 'left' | 'right';
} & React.HTMLAttributes<HTMLDivElement>;
export function ProgressBar({ max, cur, direction, className }: ProgressBarParam) {
  !className && (className = '');
  !direction && (direction = 'left');

  const directionClass = (direction === 'left' ? 'float-left' : 'float-right');
  const textDirectionClass = (direction === 'left' ? 'float-right' : 'float-left');

  const percent = Math.max(0, (cur / max) * 100);

  return (
    <div className={className + " w-full h-6 border border-black relative"}>
      <div className={directionClass + " inline-block h-full bg-gray-200"} style={{width: `${Math.min(percent, 100)}%`}}>
      </div>
      <span className={textDirectionClass + " absolute"} style={{[direction]: 0}}> {cur}/{max} </span>
    </div>
  );
}