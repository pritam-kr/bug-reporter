 
interface UploadBoxProps {
  mediaType: "image" | "video_recording" | "screenshot" | "video_upload" ;
  title: string;
  subtitle: string;
  onClick: () => void;
  onFileChange?: (file: File) => void;
}

const ICON_MAP = {
    image: "📷",
    video_recording: "📹",
    screenshot: "📸",
    video_upload: "📤",
}

const UploadBox = ({mediaType,title, subtitle, onClick, onFileChange}: UploadBoxProps) => {
  return (
        <div style={styles.uploadBox} onClick={onClick}>
        <span style={styles.icon}>{ICON_MAP[mediaType]}</span>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.subtitle}>{subtitle}</p>
        <input 
          type="file" 
          id="imageUpload" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileChange?.(file);
            }
          }}
        />
      </div>
  )
}

const styles = {

    uploadBox: {
        width: '100px',
        height: '100px',
        backgroundColor: '#f8f9fa',
        border: '1px dashed #dee2e6',
        borderRadius: '50%',
        padding: '10px 10px',
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
        fontSize: '1.2rem',
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
}

export default UploadBox