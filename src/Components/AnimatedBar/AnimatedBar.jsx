import React, { useState, useEffect } from 'react';
import './AnimatedBar.css';

const AnimatedBar = ({ percentage, color, bgColor, title, icon, delay = 0 }) => {
  const [progress, setProgress] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setProgress(percentage);
    }, delay);

    // Animate the number counting up
    const duration = 2000;
    const steps = 50;
    const increment = percentage / steps;
    let currentStep = 0;

    const numberTimer = setInterval(() => {
      currentStep++;
      setDisplayValue(Math.round(increment * currentStep));
      
      if (currentStep >= steps) {
        clearInterval(numberTimer);
        setDisplayValue(percentage);
        setIsComplete(true);
      }
    }, duration / steps);

    return () => {
      clearTimeout(timer);
      clearInterval(numberTimer);
    };
  }, [percentage, delay]);

  const getColorClasses = (color) => {
    switch(color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          bgLight: 'bg-blue-50'
        };
      case 'green':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600',
          bgLight: 'bg-green-50'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-600',
          bgLight: 'bg-purple-50'
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          bgLight: 'bg-blue-50'
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className={`animated-bar-container ${colors.bgLight} ${visible ? 'animate-in' : 'animate-out'} hover-scale hover-shadow`} 
         style={{ transitionDelay: `${delay}ms` }}>
      <div className="animated-bar-header">
        <div className="animated-bar-title">
          <div className={`animated-bar-icon ${colors.text}`}>
            {icon}
          </div>
          <h3>{title}</h3>
        </div>
        <div className={`animated-bar-value ${isComplete ? 'scale-110' : 'scale-100'}`}>
          {displayValue}%
        </div>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="animated-bar-progress">
        <div className="animated-bar-bg">
          <div
            className={`animated-bar-fill ${colors.bg}`}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="animated-bar-shimmer"></div>
            
            {/* Moving highlight */}
            <div className="animated-bar-highlight"></div>
            
            {/* End indicator */}
            {progress > 0 && (
              <div className="animated-bar-end"></div>
            )}
          </div>
          
          {/* Completion sparkle */}
          {progress > 95 && (
            <div className="animated-bar-sparkle">
              <div className="animated-bar-sparkle-dot"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedBar;