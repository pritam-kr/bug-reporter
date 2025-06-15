

import React from 'react'

interface VideoPreViewerProps {
  mediaFile?: File;
  isBobUrl?: boolean | string;
}

export const VideoPreViewer = ({mediaFile, isBobUrl=false}: VideoPreViewerProps) => {
  return (
    <video 
    src={typeof isBobUrl === 'string' ? isBobUrl : mediaFile ? URL.createObjectURL(mediaFile) : ''} 
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