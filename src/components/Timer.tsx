import React, { useState, useEffect } from 'react';

interface TimerProps {
  startTime: number | null;
  endTime?: number | null;
}

export const Timer: React.FC<TimerProps> = ({ startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!startTime || endTime) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!startTime) {
    return (
      <div className="text-sm text-gray-600">
        <span className="font-semibold">Time:</span>
        <span className="ml-2 font-mono">00:00</span>
      </div>
    );
  }

  const elapsed = Math.floor(((endTime || currentTime) - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-sm text-gray-600">
      <span className="font-semibold">Time:</span>
      <span className="ml-2 font-mono text-blue-600 font-semibold">
        {formatTime(minutes, seconds)}
      </span>
    </div>
  );
};