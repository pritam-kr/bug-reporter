import React, { useState } from 'react'
import ImagePreviewer from '../../mediaPreviewer/imagePreviewer';
import VideoPreViewer from '../../mediaPreviewer/videoPreViewer';
import PreviewActions from './previewActions';
import UploadBox from './uploadBox';

interface UploadMediaProps {
  setMediaFile: (file: File | null) => void;
  mediaFile: File | null;
  onChatWindowClose: () => void;
}

const UploadMedia: React.FC<UploadMediaProps> = ({setMediaFile, mediaFile, onChatWindowClose}) => {
  const [selectedMediaType, setSelectedMediaType] = useState<string>("image");
  const [isMediaUsed, setIsMediaUsed] = useState<boolean>(false);

  const handleCancel = () => {
    setMediaFile(null);
    onChatWindowClose();
    setIsMediaUsed(false);
  };

  const handleRemove = () => {
    setMediaFile(null);
  };

  const handleUse = () => {
    setIsMediaUsed(true);
    console.log('Using media file:', mediaFile);
  };



  const renderPreview = () => {
    if (!mediaFile) return null;

    return (
      <div style={styles.previewContainer}>
        <div style={styles.previewWrapper}>
          {selectedMediaType === "image" ? <ImagePreviewer mediaFile={mediaFile} /> : <VideoPreViewer mediaFile={mediaFile} />}
        </div>
     
          <PreviewActions handleCancel={handleCancel} handleRemove={handleRemove} handleUse={handleUse} isMediaUsed={isMediaUsed} />
  
      </div>
    );
  };

  return mediaFile ? renderPreview() : (
    <div style={styles.container}>
      <div style={styles.uploadSection}>
        <UploadBox mediaType="image" title="Image" subtitle="PNG, JPG" onClick={() => {
          setSelectedMediaType("image");
          document.getElementById('imageUpload')?.click();
        }} onFileChange={(file) => {
          setMediaFile(file);
        }} />

        <UploadBox mediaType="video_upload" title="Video" subtitle="MP4, MOV" onClick={() => {
          setSelectedMediaType("video");
          
          document.getElementById('videoUpload')?.click();
        }} onFileChange={(file) => {
          setMediaFile(file);
        }} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '10px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
  },
  uploadBox: {
    width: '120px',
    height: '120px',
    backgroundColor: '#f8f9fa',
    border: '1px dashed #dee2e6',
    borderRadius: '50%',
    padding: '15px 10px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '5px',
    ':hover': {
      borderColor: '#007bff',
      backgroundColor: '#e9ecef',
    }
  },
  icon: {
    fontSize: '1.5rem',
    marginBottom: '5px',
  },
  title: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#212529',
    fontWeight: '600',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.7rem',
    color: '#6c757d',
  },
  previewContainer: {
    // width: '100%',
    // height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  previewWrapper: {
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  preview: {
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
  },
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

export default UploadMedia