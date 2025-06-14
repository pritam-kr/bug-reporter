import React, { useCallback, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const VideoRecord = () => {
 
 

  return (
    <React.Fragment>
    <div style={styles.container}>
      <div style={styles.uploadSection}>
        <div style={styles.uploadBox} onClick={() => ""}>
          <span style={styles.icon}>
            <FaCamera />
          </span>
          <h3 style={styles.title}>Record Video</h3>
          <p style={styles.subtitle}>Ready to record your screen</p>
        </div>
      </div>
    </div>

 
 
    </React.Fragment>
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
  uploadSection: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },
  uploadBox: {
    width: "120px",
    height: "120px",
    backgroundColor: "#f8f9fa",
    border: "1px dashed #dee2e6",
    borderRadius: "50%",
    padding: "15px 10px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "5px",
    ":hover": {
      borderColor: "#007bff",
      backgroundColor: "#e9ecef",
    },
  },
  icon: {
    fontSize: "1.5rem",
    marginBottom: "5px",
  },
  title: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#212529",
    fontWeight: "600",
  },
  subtitle: {
    margin: 0,
    fontSize: "0.7rem",
    color: "#6c757d",
  },
 
};

export default VideoRecord;
