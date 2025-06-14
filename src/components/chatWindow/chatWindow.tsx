import React, { useState } from 'react'
import UploadMedia from './subComponents/uploadMedia';
import TakeScreenshot from './subComponents/takeScreenshot';
import VideoRecord from './subComponents/recordVideo';

 interface ChatWindow {
    isOpen: boolean;
    onChatWindowClose: () => void;
 }

 interface MediaOptions {
  uploadMedia: "📁 Upload Media";
  takeScreenshot: "📸 Take Screenshot";
  recordVideo: "🎥 Record Video";
 }

 const MEDIA_OPTIONS: MediaOptions = {
  uploadMedia: "📁 Upload Media",
  takeScreenshot: "📸 Take Screenshot",
  recordVideo: "🎥 Record Video"
 }


const ChatWindow: React.FC<ChatWindow> = ({ onChatWindowClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string>(MEDIA_OPTIONS.takeScreenshot);


  const [mediaFile, setMediaFile] = useState<File | null>(null);

  

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
 
  }

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
          {selectedMedia === MEDIA_OPTIONS.takeScreenshot && <TakeScreenshot onChatWindowClose={() => onChatWindowClose()} />}
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
            <button type="button" style={styles.micButton}>🎤</button>
          </div>
          <button type="submit" style={styles.sendButton}>Send</button>
        </form>
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
    width: '400px',
    height: '600px',
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
  micButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px'
  },
  sendButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  }
}