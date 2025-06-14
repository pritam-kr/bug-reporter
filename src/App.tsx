import { useState } from 'react';
import './App.css'
import { IoChatbubble } from "react-icons/io5";
import ChatWindow from './components/chatWindow/chatWindow';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleChatOpen = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div style={styles.container as React.CSSProperties}>
      {isChatOpen && <ChatWindow isOpen={isChatOpen} onChatWindowClose={handleChatOpen} />}
      
      <div style={styles.buttonContainer as React.CSSProperties}>
        <button style={styles.chatButton as React.CSSProperties}>
          <IoChatbubble size={20} onClick={handleChatOpen} />
        </button>
      </div>
    </div>
  )
}

export default App



const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  },
  buttonContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
  },
  chatButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  }
}