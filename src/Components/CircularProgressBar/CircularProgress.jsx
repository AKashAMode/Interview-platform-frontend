
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import './CircularProgress.css';

const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "blue", title, subtitle, delay = 0 }) => {
  const [progress, setProgress] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setVisible(true);
    }, delay);

    const progressTimer = setTimeout(() => {
      setProgress(percentage);
    }, delay + 300);

    // Animate the number counting up
    const numberTimer = setTimeout(() => {
      const duration = 1500;
      const steps = 50;
      const increment = percentage / steps;
      let currentStep = 0;

      const counter = setInterval(() => {
        currentStep++;
        setDisplayValue(Math.round(increment * currentStep));
        
        if (currentStep >= steps) {
          clearInterval(counter);
          setDisplayValue(percentage);
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay + 300);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(progressTimer);
      clearTimeout(numberTimer);
    };
  }, [percentage, delay]);

  const getProgressColor = (colorName) => {
    switch(colorName) {
      case "blue": return "#4F46E5";
      case "green": return "#10B981";
      case "purple": return "#8B5CF6";
      case "yellow": return "#F59E0B";
      case "red": return "#EF4444";
      default: return "#4F46E5";
    }
  };

  const progressColor = getProgressColor(color);

  return (
    <div className={`circular-progress-container ${visible ? 'animate-in' : 'animate-out'}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="circular-progress-wrapper">
        <svg width={size} height={size} className="circular-progress-svg">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="circular-progress-circle"
          />
        </svg>
        
        {/* Center content */}
        <div className="circular-progress-content">
          <div className="circular-progress-value">
            {title === "Overall Score" ? `${displayValue}%` : subtitle}
          </div>
        </div>
      </div>
      
      {/* Title */}
      <div className="circular-progress-title">
        <h3>{title}</h3>
        {title === "Overall Score" && (
          <p className="circular-progress-rating">
            {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;