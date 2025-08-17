import React, { useState } from 'react';
import { Edit2, Save, X, Plus, Award, TrendingUp, Users, Target, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import './Profile.css';
import Header from '../../Components/Header/Header';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('experience');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    title: 'Senior Frontend Developer',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123 4567',
    location: 'San Francisco, CA',
    about: 'Passionate frontend developer with 5+ years of experience in React, TypeScript, and modern web technologies. Always eager to learn and tackle new challenges.',
    profileImage: null,
    skills: [
      { name: 'React/Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'AWS/Cloud', level: 70 },
      { name: 'System Design', level: 65 }
    ],
    socialMedia: [
      { platform: 'Github', url: 'https://github.com/johndoe', icon: Github },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: Linkedin },
      { platform: 'Twitter', url: 'https://twitter.com/johndoe', icon: Twitter }
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        duration: '2022 - Present',
        description: 'Led development of user-facing features using React and TypeScript. Collaborated with cross-functional teams to deliver high-quality products.'
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        duration: '2020 - 2022',
        description: 'Built responsive web applications and improved user experience across multiple platforms.'
      },
      {
        title: 'Junior Developer',
        company: 'WebSolutions Co.',
        duration: '2019 - 2020',
        description: 'Developed and maintained client websites using HTML, CSS, and JavaScript.'
      }
    ],
    education: [
      {
        degree: 'Master of Computer Science',
        institution: 'Stanford University',
        duration: '2017 - 2019',
        description: 'Specialized in Human-Computer Interaction and Software Engineering. Graduated with honors, GPA: 3.8/4.0'
      },
      {
        degree: 'Bachelor of Computer Engineering',
        institution: 'UC Berkeley',
        duration: '2013 - 2017',
        description: 'Core coursework in algorithms, data structures, and software development. Dean\'s List for 3 consecutive semesters.'
      },
      {
        degree: 'Certifications',
        institution: 'Various Providers',
        duration: '2018 - 2024',
        description: '• AWS Certified Developer Associate\n• Google Cloud Professional Cloud Architect\n• React Developer Certification'
      }
    ],
    performanceStats: {
      overallScore: 88,
      technical: 92,
      communication: 85,
      improvement: 15
    }
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillChange = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const addSkill = () => {
    setEditData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 50 }]
    }));
  };

  const removeSkill = (index) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSocialMediaChange = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((social, i) => 
        i === index ? { ...social, [field]: value } : social
      )
    }));
  };

  const addSocialMedia = () => {
    setEditData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: '', url: '', icon: Github }]
    }));
  };

  const removeSocialMedia = (index) => {
    setEditData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setEditData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setEditData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', duration: '', description: '' }]
    }));
  };

  const removeEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditData(prev => ({
          ...prev,
          profileImage: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const currentData = isEditing ? editData : profileData;

  return (
    <>
    <Header/>
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <div>
              <h1 className="header-title">Profile</h1>
              <p className="header-subtitle">Manage your account and track your progress</p>
            </div>
            <div className="header-actions">
              {!isEditing ? (
                <button onClick={handleEdit} className="edit-button">
                  <Edit2 size={14} />
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-button">
                    <Save size={14} />
                    Save
                  </button>
                  <button onClick={handleCancel} className="cancel-button">
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Profile Card */}
            <div className="profile-card">
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  {currentData.profileImage ? (
                    <img 
                      src={currentData.profileImage} 
                      alt="Profile" 
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      {currentData.name.charAt(0)}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="image-upload-button">
                    <Edit2 size={12} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                  </label>
                )}
              </div>
              
              {isEditing ? (
                <div className="profile-edit-fields">
                  <input
                    type="text"
                    value={currentData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="name-input"
                    placeholder="Your Name"
                  />
                  <input
                    type="text"
                    value={currentData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="title-input"
                    placeholder="Your Title"
                  />
                </div>
              ) : (
                <div className="profile-info">
                  <h2 className="profile-name">{currentData.name}</h2>
                  <p className="profile-title">{currentData.title}</p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="contact-card">
              <h3 className="section-title">
                <Mail size={20} />
                Contact Information
              </h3>
              <div className="contact-fields">
                {isEditing ? (
                  <>
                    <div className="contact-field">
                      <Mail size={16} className="contact-icon" />
                      <input
                        type="email"
                        value={currentData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="contact-input"
                        placeholder="Email"
                      />
                    </div>
                    <div className="contact-field">
                      <Phone size={16} className="contact-icon" />
                      <input
                        type="tel"
                        value={currentData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="contact-input"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="contact-field">
                      <MapPin size={16} className="contact-icon" />
                      <input
                        type="text"
                        value={currentData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="contact-input"
                        placeholder="Location"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="contact-field">
                      <Mail size={16} className="contact-icon" />
                      <span className="contact-text">{currentData.email}</span>
                    </div>
                    <div className="contact-field">
                      <Phone size={16} className="contact-icon" />
                      <span className="contact-text">{currentData.phone}</span>
                    </div>
                    <div className="contact-field">
                      <MapPin size={16} className="contact-icon" />
                      <span className="contact-text">{currentData.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="social-card">
              <div className="section-header">
                <h3 className="section-title">Social Media</h3>
                {isEditing && (
                  <button onClick={addSocialMedia} className="add-button">
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="social-fields">
                {currentData.socialMedia.map((social, index) => (
                  <div key={index} className="social-field">
                    <social.icon size={16} className="social-icon" />
                    {isEditing ? (
                      <div className="social-inputs">
                        <div className="social-input-row">
                          <input
                            type="text"
                            value={social.platform}
                            onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                            className="social-platform-input"
                            placeholder="Platform"
                          />
                          <button
                            onClick={() => removeSocialMedia(index)}
                            className="remove-button"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                          className="social-url-input"
                          placeholder="URL"
                        />
                      </div>
                    ) : (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        {social.platform}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="skills-card">
              <div className="section-header">
                <h3 className="section-title">Technical Skills</h3>
                {isEditing && (
                  <button onClick={addSkill} className="add-button">
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="skills-list">
                {currentData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    {isEditing ? (
                      <div className="skill-edit-row">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          className="skill-name-input"
                          placeholder="Skill name"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => handleSkillChange(index, 'level', parseInt(e.target.value))}
                          className="skill-level-input"
                        />
                        <button
                          onClick={() => removeSkill(index)}
                          className="remove-button"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                    )}
                    <div className="skill-progress-bar">
                      <div
                        className="skill-progress-fill"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Performance Report Card */}
            <div className="performance-card">
              <div className="performance-header">
                <div>
                  <h3 className="performance-title">Performance Report Card</h3>
                  <p className="performance-subtitle">Your comprehensive interview performance summary</p>
                </div>
                <div className="performance-actions">
              
                  <button className="perform-action-button">
                    Share
                  </button>
                  <button className="perform-action-button">
                    Export
                  </button>
                </div>
              </div>
              <div className="performance-stats">
                <div className="performance-stat">
                  <div className="stat-value">{currentData.performanceStats.overallScore}%</div>
                  <div className="stat-label">Overall Score</div>
                </div>
                <div className="performance-stat">
                  <div className="stat-value">{currentData.performanceStats.technical}%</div>
                  <div className="stat-label">Technical</div>
                </div>
                <div className="performance-stat">
                  <div className="stat-value">{currentData.performanceStats.communication}%</div>
                  <div className="stat-label">Communication</div>
                </div>
                <div className="performance-stat">
                  <div className="stat-value improvement">+{currentData.performanceStats.improvement}%</div>
                  <div className="stat-label">Improvement</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="achievements-card">
              <h3 className="section-title">
                <Award size={20} />
                Achievements
              </h3>
              <div className="achievements-grid">
                <div className="achievement-item">
                  <div className="achievement-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="achievement-title">Interview Master</div>
                    <div className="achievement-description">Completed 50+ mock interviews</div>
                  </div>
                </div>
                <div className="achievement-item">
                  <div className="achievement-icon">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="achievement-title">Quick Learner</div>
                    <div className="achievement-description">Improved score by 20% in 2 months</div>
                  </div>
                </div>
                <div className="achievement-item">
                  <div className="achievement-icon">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="achievement-title">Consistent Performer</div>
                    <div className="achievement-description">90%+ success rate maintained</div>
                  </div>
                </div>
                <div className="achievement-item">
                  <div className="achievement-icon">
                    <Target size={20} />
                  </div>
                  <div>
                    <div className="achievement-title">Top Scorer</div>
                    <div className="achievement-description">Ranked in top 10% this month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="about-card">
              <h3 className="section-title">About Me</h3>
              {isEditing ? (
                <textarea
                  value={currentData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  className="about-textarea"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="about-text">{currentData.about}</p>
              )}
            </div>

            {/* Experience & Education Tabs */}
            <div className="tabs-card">
              <div className="tabs-header">
                <div className="tabs-container">
                  <button 
                    className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('experience')}
                  >
                    Experience
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                  >
                    Education
                  </button>
                </div>
                {isEditing && (
                  <button
                    onClick={activeTab === 'experience' ? addExperience : addEducation}
                    className="add-button"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="tabs-content">
                {activeTab === 'experience' ? (
                  <>
                    {currentData.experience.map((exp, index) => (
                      <div key={index} className="experience-item">
                        {isEditing ? (
                          <div className="experience-edit-fields">
                            <div className="experience-input-row">
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                className="experience-title-input"
                                placeholder="Job Title"
                              />
                              <button
                                onClick={() => removeExperience(index)}
                                className="remove-button"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="experience-input-row">
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                className="experience-company-input"
                                placeholder="Company"
                              />
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                className="experience-duration-input"
                                placeholder="Duration"
                              />
                            </div>
                            <textarea
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                              className="experience-description-input"
                              rows="3"
                              placeholder="Description"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="experience-title">{exp.title}</h4>
                            <p className="experience-meta">{exp.company} • {exp.duration}</p>
                            <p className="experience-description">{exp.description}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {currentData.education.map((edu, index) => (
                      <div key={index} className="education-item">
                        {isEditing ? (
                          <div className="education-edit-fields">
                            <div className="education-input-row">
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                className="education-degree-input"
                                placeholder="Degree/Certification"
                              />
                              <button
                                onClick={() => removeEducation(index)}
                                className="remove-button"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="education-input-row">
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                className="education-institution-input"
                                placeholder="Institution"
                              />
                              <input
                                type="text"
                                value={edu.duration}
                                onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
                                className="education-duration-input"
                                placeholder="Duration"
                              />
                            </div>
                            <textarea
                              value={edu.description}
                              onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                              className="education-description-input"
                              rows="3"
                              placeholder="Description"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="education-degree">{edu.degree}</h4>
                            <p className="education-meta">{edu.institution} • {edu.duration}</p>
                            <p className="education-description">{edu.description}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;