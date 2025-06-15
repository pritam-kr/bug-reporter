import React, { useState, useRef } from 'react';

interface VoiceRecordProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const VoiceRecord: React.FC<VoiceRecordProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.recordingInfo}>
        {isRecording && (
          <div style={styles.timer}>
            <span style={styles.recordingDot}>●</span>
            {formatTime(recordingTime)}
          </div>
        )}
      </div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        style={{
          ...styles.recordButton,
          backgroundColor: isRecording ? '#dc3545' : '#007bff'
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '10px',
    gap: '10px'
  },
  recordingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
    color: '#666'
  },
  recordingDot: {
    color: '#dc3545',
    animation: 'blink 1s infinite'
  },
  recordButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  }
};

export default VoiceRecord; 