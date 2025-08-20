import Header from "../../Components/Header/Header";
import "./DashBoard.css";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = 'https://interview-platform-backend-2.onrender.com/api';

function DashBoard() {
    const [interviewData, setInterviewData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [overallScore, setOverallScore] = useState(0);

    useEffect(() => {
        fetchInterviewHistory();
    }, []);

    const fetchInterviewHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get token from localStorage
            const token = localStorage.getItem("token") || localStorage.getItem("Authorization");
            
            if (!token) {
                throw new Error("No authorization token found. Please login again.");
            }

            // Make API call using axios
            const response = await axios.get(`${API_BASE_URL}/interview/history`, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;

            if (data.error) {
                throw new Error(data.error);
            }

            setInterviewData(data.interviews || []);

            // Calculate overall score
            if (data.interviews && data.interviews.length > 0) {
                const totalScore = data.interviews.reduce((sum, interview) => 
                    sum + (interview.overallScore || 0), 0);
                const averageScore = totalScore / data.interviews.length;
                setOverallScore(averageScore.toFixed(1));
            }

        } catch (err) {
            console.error('Error fetching interview history:', err);
            
            if (err.response) {
                // Server responded with error status
                setError(err.response.data?.error || `Server error: ${err.response.status}`);
            } else if (err.request) {
                // Request made but no response received
                setError("Network error. Please check your connection.");
            } else {
                // Something else happened
                setError(err.message || "An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return '✓';
            case 'in-progress':
                return '⏳';
            case 'failed':
                return '✗';
            default:
                return '•';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        if (score >= 40) return 'average';
        return 'poor';
    };

    const retryFetch = () => {
        fetchInterviewHistory();
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="dashboard-container">
                    <div className="dashboard-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading interview history...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="dashboard-container">
                    <div className="dashboard-error">
                        <div className="error-icon">⚠️</div>
                        <h2>Oops! Something went wrong</h2>
                        <p>{error}</p>
                        <button onClick={retryFetch} className="retry-button">
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Interview Performance Dashboard</h1>
                        <p className="header-subtitle">Track your progress and improve your skills</p>
                    </div>
                    
                    <div className="stats-overview">
                        <div className="stat-card">
                            <div className="stat-value">{interviewData.length}</div>
                            <div className="stat-label">Total Interviews</div>
                        </div>
                        
                        <div className="stat-card overall-score-card">
                            <div className={`score-circle ${getScoreColor(overallScore)}`}>
                                <span className="score-value">{overallScore}</span>
                                <span className="score-suffix">%</span>
                            </div>
                            <div className="stat-label">Average Score</div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-value">
                                {interviewData.filter(i => i.status?.toLowerCase() === 'completed').length}
                            </div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>

                <div className="interview-history">
                    <div className="section-header">
                        <h2>Recent Interviews</h2>
                        <button onClick={retryFetch} className="refresh-button">
                            🔄 Refresh
                        </button>
                    </div>
                    
                    {interviewData.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No interviews yet</h3>
                            <p>Start your first interview to see your performance history here.</p>
                        </div>
                    ) : (
                        <div className="interview-grid">
                            {interviewData.map(interview => (
                                <div key={interview.id} className="interview-card">
                                    <div className="card-header">
                                        <div className="role-info">
                                            <h3 className="interview-role">{interview.role}</h3>
                                            <span className="interview-difficulty">
                                                {interview.difficulty}
                                            </span>
                                        </div>
                                        <div className={`status-badge ${interview.status?.toLowerCase()}`}>
                                            <span className="status-icon">
                                                {getStatusIcon(interview.status)}
                                            </span>
                                            {interview.status}
                                        </div>
                                    </div>
                                    
                                    <div className="card-body">
                                        <div className="score-section">
                                            <div className={`score-badge ${getScoreColor(interview.overallScore)}`}>
                                                {interview.overallScore || 0}%
                                            </div>
                                        </div>
                                        
                                        <div className="interview-meta">
                                            <div className="meta-item">
                                                <span className="meta-icon">📅</span>
                                                <span className="meta-value">
                                                    {new Date(interview.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            
                                            {interview.completedAt && (
                                                <div className="meta-item">
                                                    <span className="meta-icon">⏱️</span>
                                                    <span className="meta-value">
                                                        {new Date(interview.completedAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default DashBoard;