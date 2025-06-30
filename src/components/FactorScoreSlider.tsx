
import React from 'react';

interface FactorScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const FactorScoreSlider: React.FC<FactorScoreSliderProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => !disabled && onChange(score)}
            disabled={disabled}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              score <= value
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-gray-300 hover:border-blue-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          >
            <span className={`text-sm font-bold ${score <= value ? 'text-white' : 'text-gray-500'}`}>
              {score}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  );
};

export default FactorScoreSlider;
