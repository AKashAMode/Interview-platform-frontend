import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Clock } from 'lucide-react';
import './MockInterview.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = 'https://interview-platform-backend-2.onrender.com/api';

export default function MockInterview() {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state || {};
  

  if (!config.interviewId || !config.questions) {
    toast.error('Interview data not found. Please start a new interview.');
    navigate('/interview');
    return null;
  }

  const initialTimeLimit = config.timeLimit ? config.timeLimit * 60 : 45 * 60;
  const [timeRemaining, setTimeRemaining] = useState(initialTimeLimit);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [realtimeConfig, setRealtimeConfig] = useState(null);
  const [socket, setSocket] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [audioProcessor, setAudioProcessor] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState('idle');
  const [partialTranscript, setPartialTranscript] = useState('');
  
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const audioStreamRef = useRef(null);


  const questions = config.questions || [];


  useEffect(() => {
    initializeTranscription();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    console.log('Cleaning up transcription service...');
    

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close(1000, 'Component unmounting');
    }
    
 
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const initializeTranscription = async () => {
    try {
      setTranscriptionStatus('initializing');
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Requesting real-time configuration...');
      const response = await axios.get(`${API_BASE_URL}/transcription/realtime-config`, { headers });
      console.log('Got real-time config response:', response.data);
      
      setRealtimeConfig(response.data);
      setTranscriptionStatus('idle');
      
      toast.success('Voice transcription ready!');
    } catch (error) {
      console.error('Error getting real-time config:', error);
      setTranscriptionStatus('error');
      toast.error('Failed to initialize voice transcription service');
    }
  };


  const convertFloat32ToInt16 = (buffer) => {
    const l = buffer.length;
    const buf = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      buf[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7FFF;
    }
    return buf;
  };

  const startRecording = async () => {
    if (!realtimeConfig) {
      toast.error('Transcription service not ready');
      return;
    }

    if (transcriptionStatus === 'connecting') {
      toast.error('Please wait, connecting to transcription service...');
      return;
    }

    try {
      setTranscriptionStatus('connecting');
      
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: realtimeConfig.sample_rate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('Got microphone access');
      audioStreamRef.current = stream;
      setAudioStream(stream);

   
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: realtimeConfig.sample_rate
      });
      audioContextRef.current = audioCtx;
      setAudioContext(audioCtx);
      console.log('Creating WebSocket connection to:', realtimeConfig.websocket_url);

      const wsUrl = `${realtimeConfig.websocket_url}?sample_rate=${realtimeConfig.sample_rate}`;
      
      const ws = new WebSocket(wsUrl, ['token', realtimeConfig.api_key]);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setTranscriptionStatus('connected');
        toast.success('Voice recording started!');
        setupAudioProcessing(stream, audioCtx, ws);
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.message_type === 'PartialTranscript') {
            if (data.text && data.text.trim()) {
              console.log('Partial transcript:', data.text);
              setPartialTranscript(data.text);
            }
          } else if (data.message_type === 'FinalTranscript') {
            if (data.text && data.text.trim()) {
              console.log('Final transcript:', data.text);
              
              setAnswer(prev => {
                const newText = prev + (prev && !prev.endsWith(' ') && !prev.endsWith('.') ? ' ' : '') + data.text;
                return newText;
              });
              setPartialTranscript('');
            }
          } else if (data.error) {
            console.error('WebSocket error message:', data.error);
            toast.error('Transcription error: ' + data.error);
            setTranscriptionStatus('error');
          }
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Transcription connection error');
        setTranscriptionStatus('error');
        setIsRecording(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        setTranscriptionStatus('idle');
        setPartialTranscript('');
        
        if (event.code !== 1000 && event.code !== 1001) {
          if (event.code === 4008) {
            toast.error('Invalid API key. Please check your configuration.');
          } else if (event.code === 4001) {
            toast.error('Authentication failed. Please refresh and try again.');
          } else if (isRecording) {
            toast.error('Transcription connection lost');
          }
        }
        setIsRecording(false);
      };

      setSocket(ws);
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      setTranscriptionStatus('error');
      setIsRecording(false);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone permission denied. Please allow microphone access.');
      } else {
        toast.error('Failed to start recording: ' + error.message);
      }
    }
  };

  const setupAudioProcessing = (stream, audioContext, websocket) => {
    try {
      console.log('Setting up audio processing...');
      const source = audioContext.createMediaStreamSource(stream);
  
      const bufferSize = 4096; 
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      audioProcessorRef.current = processor;
      setAudioProcessor(processor);

      processor.onaudioprocess = (event) => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          const inputBuffer = event.inputBuffer.getChannelData(0);
          const int16Buffer = convertFloat32ToInt16(inputBuffer);
          const arrayBuffer = int16Buffer.buffer;
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
          const audioMessage = {
            audio_data: base64
          };
          
          try {
            websocket.send(JSON.stringify(audioMessage));
          } catch (sendError) {
            console.error('Error sending audio data:', sendError);
          }
        }
      };
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      console.log('Audio processing setup complete');
      
    } catch (error) {
      console.error('Error setting up audio processing:', error);
      toast.error('Failed to setup audio processing');
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending end of stream message');
      try {
        const endMessage = {
          terminate_session: true
        };
        wsRef.current.send(JSON.stringify(endMessage));
        
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close(1000, 'Recording stopped by user');
          }
        }, 100);
      } catch (error) {
        console.error('Error sending end message:', error);
        if (wsRef.current) {
          wsRef.current.close();
        }
      }
    }
    
    if (audioProcessorRef.current) {
      console.log('Disconnecting audio processor');
      audioProcessorRef.current.disconnect();
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      console.log('Closing audio context');
      audioContextRef.current.close();
    }

    if (audioStreamRef.current) {
      console.log('Stopping audio stream');
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    setIsRecording(false);
    setAudioContext(null);
    setAudioProcessor(null);
    setSocket(null);
    setAudioStream(null);
    setPartialTranscript('');
  };

  const handleMicrophoneToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveCurrentAnswer = () => {
    const currentAnswer = {
      question: questions[currentQuestionIndex],
      answer: answer.trim() || 'Skipped'
    };

    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = currentAnswer;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (isRecording) {
      stopRecording();
    }

    saveCurrentAnswer();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
    } else {
      handleEndInterview();
    }
  };

  const handleSkip = () => {
    if (isRecording) {
      stopRecording();
    }
    
    setAnswer('Skipped');
    setTimeout(() => {
      handleNextQuestion();
    }, 100);
  };

  const handleEndInterview = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    }


    saveCurrentAnswer();

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const finalAnswers = [...answers];
      if (answer.trim()) {
        finalAnswers[currentQuestionIndex] = {
          question: questions[currentQuestionIndex],
          answer: answer.trim()
        };
      }
      for (let i = 0; i < questions.length; i++) {
        if (!finalAnswers[i]) {
          finalAnswers[i] = {
            question: questions[i],
            answer: 'Skipped'
          };
        }
      }

      const requestBody = {
        interviewId: config.interviewId,
        timeElapsed: timeElapsed,
        answers: finalAnswers
      };

      const response = await axios.post(
        `${API_BASE_URL}/interview/complete`,
        requestBody,
        { headers }
      );

      if (response.data) {
        toast.success('Interview completed successfully!');
        
        navigate('/mockinterview/interviewResult', {
          state: {
            config,
            interviewId: config.interviewId,
            answers: finalAnswers,
            timeElapsed,
            overallScore: response.data.overallScore,
            status: response.data.status
          }
        });
      }

    } catch (error) {
      console.error('Error completing interview:', error);
      toast.error('Failed to submit interview. Please try again.');
      navigate('/mockinterview/interviewResult', {
        state: {
          config,
          answers: answers.length > 0 ? answers : [{ question: questions[currentQuestionIndex], answer }],
          timeElapsed,
          error: 'Failed to submit to server'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [config, currentQuestionIndex, answer, answers, timeElapsed, isRecording, navigate]);

  if (questions.length === 0) {
    return (
      <div className="mock-interview-container">
        <div className="loading-screen">
          <h2>No questions available</h2>
          <p>Please start a new interview.</p>
        </div>
      </div>
    );
  }
  const displayText = answer + (partialTranscript ? (answer ? ' ' : '') + partialTranscript : '');

  return (
    <div className="mock-interview-container">
      <div className="mock-interview-wrapper">
        <div className="mock-interview-grid">
          <div className="left-panel">
            <div className="time-progress-card">
              <div className="time-progress-header">
                <Clock className="time-progress-icon" />
                <h3 className="time-progress-title">Time & Progress</h3>
              </div>
              
              <div className="time-progress-content">
                <div className="time-display">
                  <div className="time-remaining">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="time-label">Time Remaining</div>
                </div>
                
                <div className="time-display">
                  <div className="time-elapsed">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="time-label">Elapsed</div>
                </div>
                
                <div className="progress-container">
                  <div className="progress-header">
                    <span className="progress-title">Progress</span>
                    <span className="progress-count">
                      {currentQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="main-content">
            <div className="question-card">
              <div className="question-header">
                <div className="question-marker">
                  <div className="question-bullet"></div>
                  <h2 className="question-number">
                    Question {currentQuestionIndex + 1}
                  </h2>
                </div>
                <div className="question-meta">
                  <span className="question-difficulty">
                    {config.difficulty || 'Intermediate'}
                  </span>
                  <span className="question-count">
                    {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
              </div>

              <div className="question-category">
                {config.role || 'Developer'} • {config.questionType}
              </div>

              <div className="question-container">
                <h3 className="question-prompt">Interview Question:</h3>
                <p className="question-text">
                  {questions[currentQuestionIndex]}
                </p>
              </div>

              <div className="answer-section">
                <h3 className="answer-title">Your Answer</h3>
                <div className="transcription-status">
                  {transcriptionStatus === 'initializing' && (
                    <span className="status-indicator connecting">Initializing voice service...</span>
                  )}
                  {transcriptionStatus === 'connecting' && (
                    <span className="status-indicator connecting">Connecting to voice service...</span>
                  )}
                  {transcriptionStatus === 'connected' && isRecording && (
                    <span className="status-indicator connected">🎤 Listening and transcribing...</span>
                  )}
                  {transcriptionStatus === 'idle' && !isRecording && realtimeConfig && (
                    <span className="status-indicator idle">Voice service ready</span>
                  )}
                  {transcriptionStatus === 'error' && (
                    <span className="status-indicator error">Voice service error - typing available</span>
                  )}
                  {partialTranscript && (
                    <span className="partial-transcript">Processing: "{partialTranscript}"</span>
                  )}
                </div>
                <div className='text-box-contain'>
                  <button 
                    onClick={handleMicrophoneToggle}
                    className={`control-button ${isRecording ? 'recording' : ''} mutedmic`}
                    disabled={
                      isSubmitting || 
                      transcriptionStatus === 'initializing' || 
                      transcriptionStatus === 'connecting' ||
                      !realtimeConfig
                    }
                    title={
                      transcriptionStatus === 'initializing' ? 'Initializing transcription service...' :
                      transcriptionStatus === 'connecting' ? 'Connecting to transcription service...' :
                      transcriptionStatus === 'error' ? 'Transcription service error' :
                      !realtimeConfig ? 'Transcription service not ready' :
                      isRecording ? 'Click to stop recording' : 'Click to start recording'
                    }
                  >
                    {isRecording ? <Mic className='control-icon'/> : <MicOff className='control-icon'/>}
                  </button> 
                  <textarea
                    value={displayText}
                    onChange={(e) => {
                      if (!isRecording) {
                        setAnswer(e.target.value);
                      }
                    }}
                    placeholder={
                      transcriptionStatus === 'initializing' ? 'Initializing voice transcription...' :
                      transcriptionStatus === 'connecting' ? 'Connecting to transcription service...' :
                      transcriptionStatus === 'error' ? 'Voice transcription error - you can still type your answer' :
                      !realtimeConfig ? 'Loading voice service...' :
                      isRecording ? 'Listening... Speak now or continue typing' : 'Click microphone to start speaking or type your answer'
                    }
                    className="answer-textarea"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex >= questions.length - 1 || isSubmitting}
                  className="next-button"
                >
                  {currentQuestionIndex >= questions.length - 1 ? 'Last Question' : 'Next Question'}
                </button>
                <button
                  onClick={handleSkip}
                  className="skip-button"
                  disabled={isSubmitting}
                >
                  Skip
                </button>
                <button
                  onClick={handleEndInterview}
                  className="end-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'End Interview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}