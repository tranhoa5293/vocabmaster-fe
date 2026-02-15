
import React from 'react';
import { SessionStep } from '../types';

interface SessionProgressProps {
  steps: SessionStep[];
  currentIndex: number;
}

const SessionProgress: React.FC<SessionProgressProps> = ({ steps, currentIndex }) => {
  if (steps.length <= 1) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Session Progress: Step {currentIndex + 1} of {steps.length}
        </span>
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
          {steps[currentIndex].title}
        </span>
      </div>
      <div className="flex gap-2">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx < currentIndex ? 'bg-emerald-500' : 
              idx === currentIndex ? 'bg-indigo-600 pulse' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SessionProgress;
