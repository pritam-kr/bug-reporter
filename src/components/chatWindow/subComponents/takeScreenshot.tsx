import React, { useCallback, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

interface TakeScreenshotProps {
  onChatWindowClose: () => void;
}

const TakeScreenshot: React.FC<TakeScreenshotProps> = ({ onChatWindowClose }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);
    const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
          if (!showOverlay) return
    
          e.preventDefault()
          e.stopPropagation()
    
          setIsSelecting(true)
          setHasSelection(false)
    
          // Get mouse position relative to viewport
          const x = e.clientX
          const y = e.clientY
    
          setStartPos({ x, y })
          setSelectionRect({ x, y, width: 0, height: 0 })
        },
        [showOverlay],
    )
    
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
          if (!isSelecting || !showOverlay) return
    
          e.preventDefault()
          e.stopPropagation()
    
          // Get current mouse position relative to viewport
          const currentX = e.clientX
          const currentY = e.clientY
    
          const width = currentX - startPos.x
          const height = currentY - startPos.y
    
          setSelectionRect({
            x: width > 0 ? startPos.x : currentX,
            y: width > 0 ? startPos.y : currentY,
            width: Math.abs(width),
            height: Math.abs(height),
          })
        },
        [isSelecting, startPos, showOverlay],
    )
    
    const handleMouseUp = useCallback(() => {
        if (isSelecting) {
          setIsSelecting(false)
          if (selectionRect.width > 10 && selectionRect.height > 10) {
            setHasSelection(true)
          }
        }
      }, [isSelecting, selectionRect])

    const resetSelection = () => {
        setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
        setHasSelection(false)
        if (showOverlay) {
          // Keep overlay open but reset selection
          setIsSelecting(false)
        } else {
          setShowOverlay(false)
        }
      }
    
      const cancelSelection = () => {
        setShowOverlay(false)
        setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
        setHasSelection(false)
        setIsSelecting(false)
      }

      const handleCapture = () => {
       
      }

  return (
    <React.Fragment>
    <div style={styles.container}>
      <div style={styles.uploadSection}>
        <div style={styles.uploadBox} onClick={() => {
            setShowOverlay(true)
            // onChatWindowClose()
        }}>
          <span style={styles.icon}>
            <FaCamera />
          </span>
          <h3 style={styles.title}>Take Screenshot</h3>
          <p style={styles.subtitle}>Ready to take a screenshot</p>
        </div>
      </div>
    </div>

    {showOverlay && (
    <div
      ref={overlayRef}
      style={styles.overlay as React.CSSProperties}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Selection rectangle */}
      {selectionRect.width > 0 && selectionRect.height > 0 && (
        <div
          style={{
            ...styles.selectionRect as React.CSSProperties,
            borderColor: hasSelection ? '#22c55e' : '#3b82f6',
            backgroundColor: hasSelection ? 'rgba(220, 252, 231, 0.2)' : 'rgba(219, 234, 254, 0.2)',
            left: `${selectionRect.x}px`,
            top: `${selectionRect.y}px`,
            width: `${selectionRect.width}px`,
            height: `${selectionRect.height}px`,
          }}
        >
          {/* Corner handles */}
          <div style={{...styles.cornerHandle as React.CSSProperties, top: '-4px', left: '-4px', backgroundColor: hasSelection ? '#22c55e' : '#3b82f6'}}></div>
          <div style={{...styles.cornerHandle as React.CSSProperties, top: '-4px', right: '-4px', backgroundColor: hasSelection ? '#22c55e' : '#3b82f6'}}></div>
          <div style={{...styles.cornerHandle as React.CSSProperties, bottom: '-4px', left: '-4px', backgroundColor: hasSelection ? '#22c55e' : '#3b82f6'}}></div>
          <div style={{...styles.cornerHandle as React.CSSProperties, bottom: '-4px', right: '-4px', backgroundColor: hasSelection ? '#22c55e' : '#3b82f6'}}></div>

          {/* Size indicator */}
          <div style={{...styles.sizeIndicator as React.CSSProperties, backgroundColor: hasSelection ? '#22c55e' : '#3b82f6'}}>
            {Math.round(selectionRect.width)} × {Math.round(selectionRect.height)}
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div style={styles.instructions as React.CSSProperties}>
        {hasSelection
          ? "Selection ready! Press ENTER or click Capture button"
          : "Click and drag to select area • Press ESC to cancel"}
      </div>

      {/* Close button in overlay */}
      <button
        onClick={cancelSelection}
        style={styles.closeButton as React.CSSProperties}
      >
        Cancel
      </button>

      <button
        onClick={resetSelection}
        style={styles.captureButton as React.CSSProperties}
      >
        Capture
      </button>
      

    </div>
  )
}
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
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    cursor: 'crosshair',
    zIndex: 50
  },
  selectionRect: {
    position: 'absolute',
    border: '2px solid',
  },
  cornerHandle: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '9999px'
  },
  sizeIndicator: {
    position: 'absolute',
    top: '-32px',
    left: 0,
    color: 'white',
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  instructions: {
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem'
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    // backgroundColor: '#ef4444',
    // color: 'white',
    borderRadius: '9999px',
    padding: '8px 16px',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    border: 'none',
    zIndex: 1000
  },
  captureButton: {
    position: 'absolute',
    top: '16px',
    right: '100px',
    backgroundColor: '#22c55e',
    color: 'white',
    borderRadius: '9999px',
    padding: '8px 16px',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    border: 'none',
    zIndex: 1000
  },
  closeIcon: {
    height: '16px',
    width: '16px'
  }
};

export default TakeScreenshot;
