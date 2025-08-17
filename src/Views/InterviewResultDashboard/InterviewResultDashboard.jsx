import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, User, Target, BarChart3, ArrowLeft, Download, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './InterviewResultDashboard.css';

const API_BASE_URL = 'http://localhost:9092/api';

export default function InterviewResultDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  const [detailedResults, setDetailedResults] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!resultData) {
    toast.error('No interview results found');
    navigate('/interview');
    return null;
  }

  useEffect(() => {
    fetchDetailedResults();
  }, []);

  const fetchDetailedResults = async () => {
    if (!resultData.interviewId) {
      setDetailedResults({
        interview: resultData.config,
        answers: resultData.answers || [],
        overallScore: resultData.overallScore || calculateLocalScore(),
        timeElapsed: resultData.timeElapsed || 0,
        status: resultData.status || 'COMPLETED'
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${API_BASE_URL}/interview/${resultData.interviewId}/details`,
        { headers }
      );

      if (response.data) {
        setDetailedResults({
          interview: response.data.interview,
          answers: response.data.answers,
          overallScore: response.data.interview.overallScore,
          timeElapsed: response.data.interview.timeElapsed,
          status: response.data.interview.status
        });
      }
    } catch (error) {
      console.error('Error fetching detailed results:', error);
      toast.error('Failed to fetch detailed results');
      
      // Use local data as fallback
      setDetailedResults({
        interview: resultData.config,
        answers: resultData.answers || [],
        overallScore: resultData.overallScore || calculateLocalScore(),
        timeElapsed: resultData.timeElapsed || 0,
        status: resultData.status || 'COMPLETED'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalScore = () => {
    if (!resultData.answers || resultData.answers.length === 0) return 0;
    
    const totalAnswers = resultData.answers.length;
    const answeredQuestions = resultData.answers.filter(ans => 
      ans.answer && ans.answer.trim() !== '' && ans.answer !== 'Skipped'
    ).length;
    
    return Math.round((answeredQuestions / totalAnswers) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const handleStartNewInterview = () => {
    navigate('/interview');
  };

  const handleViewHistory = () => {
    navigate('/interview-history');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2 className="loading-text">Loading Results...</h2>
        </div>
      </div>
    );
  }

  const { interview, answers, overallScore, timeElapsed, status } = detailedResults;

  return (
    <div className="result-container">
      <div className="result-content">

        <div className="result-header">
          <div className="header-top">
            <button
              onClick={() => navigate('/dashboard')}
              className="back-button"
            >
              <ArrowLeft className="button-icon" />
              Back to Dashboard
            </button>
            
            <div className="header-actions">
              <button
                onClick={handleViewHistory}
                className="history-button"
              >
                <BarChart3 className="button-icon" />
                View History
              </button>
              
              <button
                onClick={handleStartNewInterview}
                className="new-interview-button"
              >
                Start New Interview
              </button>
            </div>
          </div>

          <div className="header-center">
            <h1 className="header-title">Interview Results</h1>
            <p className="header-subtitle">
              {interview.role || 'Developer'} • {interview.difficulty || 'Intermediate'} Level
            </p>
          </div>
        </div>

        {/* Score Overview */}
        <div className="score-overview">
          <div className="score-grid">
            <div className="score-item">
              <div className={`score-value ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="score-label">Overall Score</div>
              <div className={`score-description ${getScoreColor(overallScore)}`}>
                {getScoreLabel(overallScore)}
              </div>
            </div>

            <div className="score-item">
              <div className="questions-value">
                {answers.length}
              </div>
              <div className="score-label">Questions</div>
              <div className="questions-description">Attempted</div>
            </div>

            <div className="score-item">
              <div className="time-value">
                {formatTime(timeElapsed)}
              </div>
              <div className="score-label">Time Taken</div>
              <div className="time-description">Duration</div>
            </div>

            <div className="score-item">
              <div className="status-icon">
                {status === 'COMPLETED' ? (
                  <CheckCircle className="status-icon-completed" />
                ) : (
                  <Clock className="status-icon-pending" />
                )}
              </div>
              <div className="score-label">Status</div>
              <div className="status-description">
                {status.toLowerCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="question-results">
          <h2 className="results-title">Question-wise Analysis</h2>
          
          <div className="questions-list">
            {answers.map((item, index) => (
              <div key={index} className="question-item">
                <div className="question-header">
                  <div className="question-content">
                    <h3 className="question-number">
                      Question {index + 1}
                    </h3>
                    <p className="question-text">
                      {item.question}
                    </p>
                  </div>
                  
                  <div className="question-score">
                    {item.score !== undefined ? (
                      <div className="score-container">
                        <div className={`score-display ${getScoreColor(item.score)}`}>
                          {item.score}%
                        </div>
                        <div className="score-label">Score</div>
                      </div>
                    ) : (
                      <div className="no-score">
                        <XCircle className="no-score-icon" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="answer-container">
                  <h4 className="answer-title">Your Answer:</h4>
                  <p className="answer-text">
                    {item.answer && item.answer !== 'Skipped' 
                      ? item.answer 
                      : (
                          <span className="skipped-answer">
                            This question was skipped
                          </span>
                        )
                    }
                  </p>
                </div>

                {item.answer === 'Skipped' && (
                  <div className="skipped-notice">
                    <XCircle className="skipped-icon" />
                    Question skipped - Consider revisiting this topic
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations">
          <h2 className="recommendations-title">Recommendations</h2>
          <div className="recommendations-list">
            {overallScore < 60 && (
              <p>• Consider reviewing the fundamental concepts for {interview.role}</p>
            )}
            {overallScore >= 60 && overallScore < 80 && (
              <p>• Good progress! Focus on providing more detailed answers</p>
            )}
            {overallScore >= 80 && (
              <p>• Excellent performance! You're well-prepared for {interview.role} interviews</p>
            )}
            <p>• Practice more {interview.questionType.toLowerCase()} questions</p>
            <p>• Try interviewing for different difficulty levels to broaden your skills</p>
          </div>
        </div>
      </div>
    </div>
  );
}