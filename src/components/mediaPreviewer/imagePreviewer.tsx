import React from "react";

interface ImagePreviewerProps {
  mediaFile?: File;
  isBobUrl?: boolean | string;
}

const ImagePreviewer = ({ mediaFile, isBobUrl=false }: ImagePreviewerProps) => {
  return (
    <img
      src={typeof isBobUrl === 'string' ? isBobUrl : mediaFile ? URL.createObjectURL(mediaFile) : ''}
      alt="Preview"
      style={styles.preview as React.CSSProperties}
    />
  );
};

const styles = {
  preview: {
    width: "100%",
    height: "300px",
    objectFit: "contain",
  },
};

export default ImagePreviewer;
