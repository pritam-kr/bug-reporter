

import React from 'react'

interface VideoPreViewerProps {
  mediaFile: File;
}

export const VideoPreViewer = ({mediaFile}: VideoPreViewerProps) => {
  return (
    <video 
    src={URL.createObjectURL(mediaFile)} 
    controls 
    style={styles.preview as React.CSSProperties}
  />
  )
}

const styles = {
  preview: {
    maxWidth: "100%",
    maxHeight: "300px",
    objectFit: "cover",
  },
}

export default VideoPreViewer;