import { useState } from "react";
import { useRef } from "react";
import UploadBox from "./uploadBox";
import { VideoPreViewer } from "../../mediaPreviewer/videoPreViewer";

const VideoRecord = () => {

    const streamRef = useRef<MediaStream | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<BlobPart[]>([])
    const timerRef = useRef<number | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)

    const [mediaFile, setMediaFile] = useState< string>('')

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    console.log(recordingTime, 'recordingTime')


    const onRecordingComplete = (url: string) => {
        console.log("Recording complete", url)
    }
 
    const startRecording = async () => {

        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "always" },
            audio: false,
          })
    
          streamRef.current = stream
          const mediaRecorder = new MediaRecorder(stream)
          mediaRecorderRef.current = mediaRecorder
    
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunksRef.current.push(e.data)
            }
          }
    
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" })
            const url = URL.createObjectURL(blob)
            onRecordingComplete(url)
            setMediaFile(url)
    
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
          }
    
          // Start recording
          mediaRecorder.start(200)
          setIsRecording(true)
    
          // Start timer
          timerRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1)
          }, 1000)
    
          // Handle stream ending (user clicks "Stop sharing")
          stream.getVideoTracks()[0].onended = () => {
            stopRecording()
          }
        } catch (error: any) {
          console.error("Error starting screen recording:", error)
    
          if (error.name === "NotAllowedError") {
            alert("Screen recording permission was denied. Please allow screen sharing to continue.")
          } else {
            alert("Failed to start screen recording. Please try again.")
          }
        }
      }
    
      const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
    
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
          }
    
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }
    
      const togglePause = () => {
        if (!mediaRecorderRef.current) return
    
        if (isPaused) {
          mediaRecorderRef.current.resume()
          timerRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1)
          }, 1000)
        } else {
          mediaRecorderRef.current.pause()
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
    
        setIsPaused(!isPaused)
      }

  return (
    <div style={styles.container}>
        {isRecording && (
            <div style={styles.toast}>
                <div style={styles.timeDisplay}>
                    {formatTime(recordingTime)}
                </div>
                <div style={styles.controls}>
                    <button 
                        onClick={togglePause}
                        style={styles.controlButton}
                    >
                        {isPaused ? '▶️' : '⏸️'}
                    </button>
                    <button 
                        onClick={stopRecording}
                        style={styles.controlButton}
                    >
                        💾
                    </button>
                </div>
            </div>
        )}
       

        {mediaFile ?  
        
        <div style={styles.previewContainer}> 
        <div style={styles.previewWrapper}>
        <VideoPreViewer isBobUrl={mediaFile}  /> 
        </div>
       
       </div>
        
        :  <UploadBox
            mediaType="video_recording"
            title="Record Video"
            subtitle="Ready to record your screen"
            onClick={() => startRecording()}
        />}
    </div>
  );
};

const styles = {

    
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
  container: {
    padding: "10px",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  toast: {
    position: "fixed" as const,
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(17, 17, 17, 0.95)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    minWidth: "180px",
  },
  timeDisplay: {
    fontSize: "0.9rem",
    fontWeight: "600",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "0.5px",
    color: "#fff",
    opacity: 0.9,
  },
  controls: {
    display: "flex",
    gap: "8px",
    marginLeft: "4px",
  },
  controlButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "6px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transform: "scale(1.05)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
};

export default VideoRecord;
