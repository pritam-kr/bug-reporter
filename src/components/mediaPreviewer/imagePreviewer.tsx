import React from "react";

interface ImagePreviewerProps {
  mediaFile: File;
}

export const ImagePreviewer = ({ mediaFile }: ImagePreviewerProps) => {
  return (
    <img
      src={URL.createObjectURL(mediaFile)}
      alt="Preview"
      style={styles.preview as React.CSSProperties}
    />
  );
};

const styles = {
  preview: {
    maxWidth: "100%",
    maxHeight: "300px",
    objectFit: "cover",
  },
};

export default ImagePreviewer;
