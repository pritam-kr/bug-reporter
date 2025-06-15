import React from 'react'




interface PreviewActionsProps {
  handleCancel: () => void;
  handleRemove: () => void;
  handleUse: () => void;
  isMediaUsed?: boolean;
}

 const previewActions: React.FC<PreviewActionsProps> = ({ handleCancel, handleRemove, handleUse, isMediaUsed }) => {
  return (
    <div style={styles.buttonContainer}>
    <button onClick={handleCancel} style={styles.secondaryButton}>Cancel</button>
    <button onClick={handleRemove} style={styles.secondaryButton}>Remove</button>
   { !isMediaUsed && <button onClick={handleUse} style={styles.primaryButton}>Use</button>}
  </div>
  )
}


const styles = {
    buttonContainer: {
        display: 'flex',
        gap: '10px',
      },
      primaryButton: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: '600',
        ':hover': {
          backgroundColor: '#0056b3',
          transform: 'translateY(-1px)',
        }
      },
      secondaryButton: {
        padding: '8px 16px',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        color: '#6c757d',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
          backgroundColor: '#f8f9fa',
          borderColor: '#adb5bd',
        }
      }
}



export default previewActions;