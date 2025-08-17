import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, Edit3, Trash2, Bell, Search } from 'lucide-react';
import './Schedule.css';
import Header from "../../Components/Header/Header"

const Scheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'Frontend Developer Mock Interview',
      date: '2025-07-15',
      time: '10:00 AM',
      duration: '60 min',
      type: 'interview',
      level: 'Advanced',
      topics: ['React', 'JavaScript', 'System Design'],
      participants: 2,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Technical Discussion Session',
      date: '2025-07-16',
      time: '2:00 PM',
      duration: '45 min',
      type: 'discussion',
      level: 'Intermediate',
      topics: ['Node.js', 'Databases', 'APIs'],
      participants: 3,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Behavioral Interview Prep',
      date: '2025-07-18',
      time: '11:00 AM',
      duration: '30 min',
      type: 'behavioral',
      level: 'All Levels',
      topics: ['Leadership', 'Communication', 'Problem Solving'],
      participants: 1,
      status: 'upcoming'
    }
  ]);

  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const hasSessionOnDate = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.some(session => session.date === dateStr);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filterType === 'all' || session.type === filterType;
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = getDaysInMonth(currentDate);

  return (
    <>
    <Header/>
    <div className="scheduler-container">
      <div className="scheduler-inner">

        <div className="scheduler-header">
          <div className="header-text">
            <h1>Interview Session Manager</h1>
            <p>Schedule and manage your interview preparation sessions</p>
          </div>
          <button 
            className="new-session-button"
            onClick={() => setShowNewSessionModal(true)}
          >
            <Plus size={18} />
            <span>Schedule New Session</span>
          </button>
        </div>

        <div className="scheduler-grid">
          {/* Calendar Section */}
          <div className="calendar-section">
            <div className="calendar-card">
              <div className="calendar-header">
                <Calendar size={20} className="calendar-icon" />
                <h2>Calendar</h2>
              </div>
              
              {/* Calendar Navigation */}
              <div className="calendar-navigation">
                <button onClick={() => navigateMonth(-1)}>←</button>
                <h3>{formatDate(currentDate)}</h3>
                <button onClick={() => navigateMonth(1)}>→</button>
              </div>

              {/* Calendar Grid */}
              <div className="calendar-grid">
                {/* Day headers */}
                {daysOfWeek.map(day => (
                  <div key={day} className="day-header">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {monthDays.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${
                      day ? 'has-day' : ''
                    } ${
                      hasSessionOnDate(day) ? 'has-session' : ''
                    } ${
                      isToday(day) ? 'today' : ''
                    }`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-list">
                  <button>
                    <Plus size={16} />
                    Schedule New Session
                  </button>
                  <button>
                    <Users size={16} />
                    Join Live Session
                  </button>
                  <button>
                    <Bell size={16} />
                    Set Reminders
                  </button>
                </div>
              </div>

              {/* Calendar Integration */}
              <div className="calendar-integration">
                <h3>Calendar Integration</h3>
                <div className="integration-buttons">
                  <button>
                    <Calendar size={16} />
                    Google Calendar
                  </button>
                  <button>
                    <Calendar size={16} />
                    Outlook Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Section */}
          <div className="sessions-section">
            <div className="sessions-card">
              <div className="sessions-header">
                <h2>Upcoming Sessions</h2>
                <div className="sessions-controls">
                  <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="interview">Interview</option>
                    <option value="discussion">Discussion</option>
                    <option value="behavioral">Behavioral</option>
                  </select>
                </div>
              </div>

              <div className="sessions-list">
                {filteredSessions.map(session => (
                  <div key={session.id} className="session-card">
                    <div className="session-details">
                      <div className="session-title-container">
                        <h3>{session.title}</h3>
                        <div className="session-tags">
                          <span className={`session-type ${session.type}`}>
                            {session.type}
                          </span>
                          <span className="session-level">
                            {session.level}
                          </span>
                        </div>
                      </div>
                      
                      <div className="session-meta">
                        <div>
                          <Calendar size={14} />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div>
                          <Clock size={14} />
                          {session.time}
                        </div>
                        <div>
                          <Users size={14} />
                          {session.participants} participants
                        </div>
                      </div>

                      <div className="session-topics">
                        {session.topics.map(topic => (
                          <span key={topic}>{topic}</span>
                        ))}
                      </div>
                    </div>

                    <div className="session-actions">
                      <button className="join-button">
                        Join Session
                      </button>
                      <button className="edit-button">
                        <Edit3 size={16} />
                      </button>
                      <button className="delete-button">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSessions.length === 0 && (
                <div className="empty-sessions">
                  <Video size={48} className="empty-icon" />
                  <h3>No sessions found</h3>
                  <p>
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Schedule your first interview preparation session to get started'
                    }
                  </p>
                  <button onClick={() => setShowNewSessionModal(true)}>
                    Schedule New Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <p className="stat-labels">Total Sessions</p>
              <p className="stat-value">{sessions.length}</p>
            </div>
            <div className="stat-icon bg-blue">
              <Calendar size={20} />
            </div>
          </div>
          
          <div className="stat-card">
            <div>
              <p className="stat-labels">This Week</p>
              <p className="stat-value">3</p>
            </div>
            <div className="stat-icon bg-green">
              <Clock size={20} />
            </div>
          </div>
          
          <div className="stat-card">
            <div>
              <p className="stat-labels">Completed</p>
              <p className="stat-value">12</p>
            </div>
            <div className="stat-icon bg-purple">
              <Users size={20} />
            </div>
          </div>
          
          <div className="stat-card">
            <div>
              <p className="stat-labels">Success Rate</p>
              <p className="stat-value">87%</p>
            </div>
            <div className="stat-icon bg-orange">
              <Video size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Schedule New Session</h3>
            <p>Session scheduling form would go here...</p>
            <div className="modal-actions">
              <button onClick={() => setShowNewSessionModal(false)}>
                Cancel
              </button>
              <button onClick={() => setShowNewSessionModal(false)}>
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Scheduler;