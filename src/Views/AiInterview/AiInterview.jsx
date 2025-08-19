import React, { useState } from 'react';
import { Play, Settings, Shield, Activity } from 'lucide-react';
import "./AiInterview.css";
import Header from "../../Components/Header/Header";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://interview-platform-backend-2.onrender.com/api';

export default function Interview() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState({
    role: '',
    difficulty: 'Intermediate',
    questionCount: 5, 
    timeLimit: 10,
    language: 'JavaScript',
    questionType: 'Behavioral Only' 
  });


  const roles = [
    'Frontend Developer',
    'Backend Developer',
  ];

  const difficulties = ['Beginner', 'Intermediate'];
  const questionCounts = [2, 3, 4, 5]; 
  const timeLimits = [5, 10, 15];
  const languages = ['JavaScript', 'Java', 'React'];
  const questionTypes = ['Technical Only', 'Behavioral Only'];

  const handleInputChange = (field, value) => {
  
    if (field === 'questionCount' || field === 'timeLimit') {
      value = parseInt(value);
    }
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return null;
    }
    return {
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    };
  };

  const startInterview = async () => {
    if (!config.role) {
      toast.error('Please select a role to continue');
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    setIsCreating(true);

    try {
      // Create interview in backend
      const response = await axios.post(
        `${API_BASE_URL}/interview/create`,
        config,
        { headers }
      );

      if (response.data && response.data.interviewId) {
        toast.success('Interview created successfully!');
        
        // Navigate to mock interview with backend data
        navigate("/mockinterview", {
          state: {
            ...config,
            interviewId: response.data.interviewId,
            questions: response.data.questions
          }
        });
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create interview';
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="interview-container">
      <div className="interview-wrapper">

        <div className="config-card">
          
          <div className="form-grid">
            {/* Select Role */}
            <div className="form-group">
              <label className="form-label">
                Select Role <span className="required">*</span>
              </label>
              <select
                value={config.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="form-select"
                disabled={isCreating}
              >
                <option value="">Choose your target role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                value={config.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="form-select"
                disabled={isCreating}
              >
                {difficulties.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Programming Language */}
            <div className="form-group">
              <label className="form-label">Programming Language</label>
              <select
                value={config.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="form-select"
                disabled={isCreating}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Question Count */}
            <div className="form-group">
              <label className="form-label">Question Count</label>
              <select
                value={config.questionCount}
                onChange={(e) => handleInputChange('questionCount', e.target.value)}
                className="form-select"
                disabled={isCreating}
              >
                {questionCounts.map(count => (
                  <option key={count} value={count}>{count} Questions</option>
                ))}
              </select>
            </div>

            {/* Time Limit */}
            <div className="form-group">
              <label className="form-label">Time Limit</label>
              <select
                value={config.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                className="form-select"
                disabled={isCreating}
              >
                {timeLimits.map(time => (
                  <option key={time} value={time}>{time} Minutes</option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div className="form-group">
              <label className="form-label">Question Type</label>
              <select
                value={config.questionType}
                onChange={(e) => handleInputChange('questionType', e.target.value)}
                className="form-select"
                disabled={isCreating}
              >
                {questionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats Display */}
          <div className="stats-grid">
            <div className="stat-card stat-questions">
              <div className="stat-number">{config.questionCount}</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-card stat-minutes">
              <div className="stat-number">{config.timeLimit}</div>
              <div className="stat-label">Minutes</div>
            </div>
            <div className="stat-card stat-ai">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
            </div>
            <div className="stat-card stat-monitored">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Monitored</div>
            </div>
          </div>

          {/* Start Button */}
          <div className="start-section">
            <button 
              onClick={startInterview} 
              className="start-button"
              disabled={isCreating || !config.role}
            >
              <Play className="start-icon" />
              {isCreating ? 'Creating Interview...' : 'Start AI Interview'}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon feature-analysis">
              <Activity />
            </div>
            <h3 className="feature-title">Real-time Analysis</h3>
            <p className="feature-description">Get instant feedback on your responses and performance metrics</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-secure">
              <Shield />
            </div>
            <h3 className="feature-title">Secure Environment</h3>
            <p className="feature-description">Advanced proctoring ensures authentic interview experience</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-custom">
              <Settings />
            </div>
            <h3 className="feature-title">Customizable</h3>
            <p className="feature-description">Tailor the interview to match your specific role and skill level</p>
          </div>
        </div>
      </div>
    </div>
      <ToastContainer/>          
    </>
  );
}