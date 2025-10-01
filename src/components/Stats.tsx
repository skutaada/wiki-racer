import React from 'react';

interface StatsProps {
  clickCount: number;
  pathLength: number;
}

export const Stats: React.FC<StatsProps> = ({ clickCount, pathLength }) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <div>
        <span className="font-semibold">Clicks:</span>
        <span className="ml-2 font-mono text-orange-600 font-semibold">{clickCount}</span>
      </div>
      <div>
        <span className="font-semibold">Articles:</span>
        <span className="ml-2 font-mono text-purple-600 font-semibold">{pathLength}</span>
      </div>
    </div>
  );
};