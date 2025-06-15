import { useState } from "react";
import { useRef } from "react";
import UploadBox from "./uploadBox";

const VideoRecord = () => {

    const streamRef = useRef<MediaStream | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<BlobPart[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)


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
      <UploadBox
        mediaType="video_recording"
        title="Record Video"
        subtitle="Ready to record your screen"
        onClick={() => startRecording()}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: "10px",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
};

export default VideoRecord;
