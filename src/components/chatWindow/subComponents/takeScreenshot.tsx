 
import html2canvas from "html2canvas";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ImagePreviewer from "../../mediaPreviewer/imagePreviewer";
import PreviewActions from "./previewActions";
import UploadBox from "./uploadBox";

interface TakeScreenshotProps {
  onChatWindowClose: () => void;
  onCapture: (dataUrl: string) => void;
}

const TakeScreenshot: React.FC<TakeScreenshotProps> = ({ onChatWindowClose, onCapture }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [hasSelection, setHasSelection] = useState(false);
    const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const bobUrl = useRef<string | null>(null);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      }
    
 

    const captureTool = async () => {
        if (!hasSelection || selectionRect.width < 10 || selectionRect.height < 10) {
            alert("Please select a larger area")
            return
          }
      
          setIsCapturing(true)
      
          try {
  
     
            // Store selection coordinates before hiding overlay
            const captureRect = { ...selectionRect }
      
            // Hide the overlay first
            setShowOverlay(false)
      
            // Hide the chat interface temporarily
            const chatInterface = document.querySelector("[data-chat-interface]")
            const originalDisplay = chatInterface ? (chatInterface as HTMLElement).style.display : ""
      
            if (chatInterface) {
              ;(chatInterface as HTMLElement).style.display = "none"
            }
      
            // Wait for UI to update
            await new Promise((resolve) => setTimeout(resolve, 300))
      
            // Capture the entire screen
            const canvas = await html2canvas(document.body, {
              useCORS: true,
              allowTaint: true,
              scale: 1,
              logging: false,
              width: window.innerWidth,
              height: window.innerHeight,
              scrollX: 0,
              scrollY: 0,
            })
      
            // Restore chat interface
            if (chatInterface) {
              ;(chatInterface as HTMLElement).style.display = originalDisplay
            }
      
            // Create cropped canvas with the selected area
            const croppedCanvas = document.createElement("canvas")
            const ctx = croppedCanvas.getContext("2d")
      
            if (!ctx) {
              throw new Error("Could not get canvas context")
            }
      
            // Set the cropped canvas size
            croppedCanvas.width = captureRect.width
            croppedCanvas.height = captureRect.height
      
            // Draw the selected portion
            ctx.drawImage(
              canvas,
              captureRect.x, // source x
              captureRect.y, // source y
              captureRect.width, // source width
              captureRect.height, // source height
              0, // destination x
              0, // destination y
              captureRect.width, // destination width
              captureRect.height, // destination height
            )
      
            const dataUrl = croppedCanvas.toDataURL("image/png", 1.0)
            bobUrl.current = dataUrl;
      
  
            // Reset state
            setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
            setHasSelection(false)
      
            onCapture(dataUrl)
          } catch (error) {
            console.error("Error capturing screenshot:", error)
            alert("Failed to capture screenshot. Please try again.")
      
            // Reset overlay state on error
            setShowOverlay(false)
            setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
            setHasSelection(false)
            bobUrl.current = null;
          } finally {
            setIsCapturing(false)
          }
    }

 
    const captureScreenshot = useCallback(async () => {
        captureTool()
    }, [hasSelection, onCapture, selectionRect])

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

      useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            if (showOverlay) {
              setShowOverlay(false)
              setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
              setHasSelection(false)
              bobUrl.current = null;
            } else {
              onChatWindowClose()
            }
          } else if (e.key === "Enter" && showOverlay && hasSelection && !isCapturing ) {
            e.preventDefault()
            captureScreenshot()
          }
        }
    
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
      }, [onChatWindowClose, showOverlay, hasSelection, isCapturing, captureScreenshot])
    
      useEffect(() => {
        return () => {
          // Clean up when component unmounts
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
          }
        }
      }, [])

    const resetSelection = () => {
        setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
        setHasSelection(false)
        bobUrl.current = null;
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
        bobUrl.current = null;
        setHasSelection(false)
        setIsSelecting(false)
      }


  return (
    <React.Fragment>
{bobUrl.current ? (
  <div style={styles.previewContainer}>
    <div style={styles.previewWrapper}>
     <ImagePreviewer isBobUrl={bobUrl.current} />
     </div>
     <PreviewActions handleCancel={() => ""} handleRemove={() => ""} handleUse={() => ""}   />
  </div>
) : (
  <div style={styles.container}>
    <div style={styles.uploadSection}>
        <UploadBox mediaType="screenshot" title="Take Screenshot" subtitle="Ready to take a screenshot" onClick={() => {
          setShowOverlay(true)
        }} />
        
    </div>
  </div>
)}

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
          ? "Selection ready! Press ENTER to capture"
          : "Click and drag to select area • Press ESC to cancel"}
      </div>

      {/* Close button in overlay */}
      <button
        onClick={cancelSelection}
        style={styles.closeButton as React.CSSProperties}
      >
        Cancel
      </button>

      {/* <button
        onClick={() => captureTool()}
        style={styles.captureButton as React.CSSProperties}
      >
        Capture
      </button>
       */}

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
    zIndex: 9999999
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
    zIndex: 9999999
  },
  closeIcon: {
    height: '16px',
    width: '16px'
  }
,
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
};

export default TakeScreenshot;
