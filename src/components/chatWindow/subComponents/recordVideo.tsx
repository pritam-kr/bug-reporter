import UploadBox from "./uploadBox";

const VideoRecord = () => {
  return (
    <div style={styles.container}>
      <UploadBox
        mediaType="video_recording"
        title="Record Video"
        subtitle="Ready to record your screen"
        onClick={() => ""}
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
