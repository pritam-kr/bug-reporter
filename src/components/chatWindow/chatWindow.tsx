import React, { useState, useRef } from 'react'
import UploadMedia from './subComponents/uploadMedia';
import TakeScreenshot from './subComponents/takeScreenshot';
import VideoRecord from './subComponents/recordVideo';
import { FaPaperPlane } from 'react-icons/fa';

 interface ChatWindow {
    isOpen: boolean;
    onChatWindowClose: () => void;
 }

 interface MediaOptions {
  uploadMedia: "📁 Upload Media";
  takeScreenshot: "📸 Take Screenshot";
  recordVideo: "🎥 Record Video";
  recordVoice: "🎤 Record Voice";
 }

 const MEDIA_OPTIONS: MediaOptions = {
  uploadMedia: "📁 Upload Media",
  takeScreenshot: "📸 Take Screenshot",
  recordVideo: "🎥 Record Video",
  recordVoice: "🎤 Record Voice"
 }


const ChatWindow: React.FC<ChatWindow> = ({ onChatWindowClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string>(MEDIA_OPTIONS.takeScreenshot);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

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
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
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

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  const handleMediaUsed = (media: string) => {
    setSelectedMedia(media);
    if(mediaFile) setMediaFile(null);
    if(audioBlob) setAudioBlob(null);
  }

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.chatWindow as React.CSSProperties}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Chat</h3>
          <button onClick={onChatWindowClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.messagesContainer as React.CSSProperties}>
          {selectedMedia === MEDIA_OPTIONS.recordVideo && <VideoRecord />}
          {selectedMedia === MEDIA_OPTIONS.uploadMedia && (
            <UploadMedia 
              onChatWindowClose={() => onChatWindowClose()} 
              setMediaFile={setMediaFile} 
              mediaFile={mediaFile} 
            />
          )}
          {selectedMedia === MEDIA_OPTIONS.takeScreenshot && <TakeScreenshot onChatWindowClose={() => onChatWindowClose()} onCapture={(dataUrl) => {
            console.log(dataUrl, 'dataUrl')
          }} />}
        </div>

        {/* Media Options */}
        <div style={styles.mediaOptions}>
          <button 
            style={{
              ...styles.mediaButton,
              border: selectedMedia === MEDIA_OPTIONS.uploadMedia ? '2px solid #007bff' : '1px solid #ccc'
            }} 
            onClick={() => handleMediaUsed(MEDIA_OPTIONS.uploadMedia)}
          >
            📁 Upload Media
          </button>
          <button 
            style={{
              ...styles.mediaButton,
              border: selectedMedia === MEDIA_OPTIONS.takeScreenshot ? '2px solid #007bff' : '1px solid #ccc'
            }} 
            onClick={() => handleMediaUsed(MEDIA_OPTIONS.takeScreenshot)}
          >
            📸 Take Screenshot
          </button>
          <button 
            style={{
              ...styles.mediaButton,
              border: selectedMedia === MEDIA_OPTIONS.recordVideo ? '2px solid #007bff' : '1px solid #ccc'
            }} 
            onClick={() => handleMediaUsed(MEDIA_OPTIONS.recordVideo)}
          >
            🎥 Record Video
          </button>
        </div>

        <form onSubmit={handleSendMessage} style={styles.form}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
            />
            <div style={styles.recordingControls}>
              {isRecording && (
                <div style={styles.recordingInfo}>
                  <span style={styles.recordingDot}>●</span>
                  {formatTime(recordingTime)}
                </div>
              )}
              {audioBlob && !isRecording && (
                <div style={styles.audioControls}>
                  <button
                    type="button"
                    onClick={togglePlayback}
                    style={{
                      ...styles.playButton,
                      backgroundColor: isPlaying ? '#dc3545' : '#28a745'
                    }}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRecording}
                    style={styles.deleteButton}
                    title="Delete recording"
                  >
                    🗑️
                  </button>
                </div>
              )}
              <button 
                type="button" 
                style={{
                  ...styles.micButton,
                  backgroundColor: isRecording ? '#dc3545' : 'transparent'
                }}
                onClick={isRecording ? stopRecording : startRecording}
              >
                🎤
              </button>
            </div>
          </div>
          <button type="submit" style={styles.sendButton}>
            <FaPaperPlane />
          </button>
        </form>
        <audio 
          ref={audioRef} 
          onEnded={handleAudioEnded}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default ChatWindow;

const styles = {
  container: {
    position: 'fixed',
    bottom: '90px',
    right: '40px'
  },
  chatWindow: {
    width: '350px',
    height: '450px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  message: {
    backgroundColor: '#e9ecef',
    padding: '8px 12px',
    borderRadius: '15px',
    maxWidth: '80%',
    alignSelf: 'flex-start'
  },
  mediaOptions: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  mediaButton: {
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  form: {
    padding: '10px',
    borderTop: '1px solid #eee',
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  inputContainer: {
    display: 'flex',
    flex: 1,
    gap: '10px',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '20px',
    padding: '0 10px'
  },
  input: {
    flex: 1,
    padding: '8px',
    border: 'none',
    outline: 'none',
    background: 'transparent'
  },
  recordingControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  recordingInfo: {
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
  micButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'background-color 0.3s'
  },
  playButton: {
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px'
  },
  audioControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  deleteButton: {
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    transition: 'background-color 0.3s',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    '&:hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  sendButton: {
    padding: '8px',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  }
}