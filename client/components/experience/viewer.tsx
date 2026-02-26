import React, { useEffect, useRef, useState } from "react";

const SCRIPT_URL =
  "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";

// Extend the Window type for the Sketchfab global
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Sketchfab: new (iframe: HTMLIFrameElement) => any;
  }
}

// Vendor-extended iframe element for cross-browser fullscreen support
interface FullscreenIFrameElement extends HTMLIFrameElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

// Vendor-extended document for cross-browser fullscreen exit
interface FullscreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface SketchfabModalViewerProps {
  uid: string;
}

function SketchfabModalViewer({ uid }: SketchfabModalViewerProps) {
  const iframeRef = useRef<FullscreenIFrameElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRef = useRef<any>(null);

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenHint, setShowFullscreenHint] = useState(false);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Effect 1: Load the Sketchfab API script once when the component mounts
  useEffect(() => {
    // Check if script is already on the page
    if (document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      console.log("Sketchfab API script loaded");
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Sketchfab API script");
    };

    document.body.appendChild(script);

    // Cleanup function to remove the script if the component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []); // Empty dependency array means this runs only once

  // Effect 2: Initialize the viewer when the script is loaded and the UID is ready
  useEffect(() => {
    if (!isScriptLoaded || !iframeRef.current || !uid) {
      return;
    }

    if (!window.Sketchfab) {
      console.error("Sketchfab global not found.");
      return;
    }

    const client = new window.Sketchfab(iframeRef.current);
    clientRef.current = client;

    client.init(uid, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: function onSuccess(api: any) {
        console.log("Client.init success");
        api.load();
        api.start();

        api.addEventListener("viewerready", () => {
          console.log(`Viewer is ready for model: ${uid}`);
          setIsLoading(false); // Model is loaded, show the iframe

          // Auto-enter fullscreen mode with multiple fallback methods
          setTimeout(() => {
            const iframe = iframeRef.current;
            if (iframe) {
              // Try different fullscreen methods for better browser compatibility
              const requestFullscreen =
                iframe.requestFullscreen ||
                iframe.webkitRequestFullscreen ||
                iframe.mozRequestFullScreen ||
                iframe.msRequestFullscreen;

              if (requestFullscreen) {
                requestFullscreen
                  .call(iframe)
                  .then(() => {
                    console.log("Entered fullscreen mode");
                    setIsFullscreen(true);
                  })
                  .catch((err: unknown) => {
                    console.log("Could not enter fullscreen:", err);
                    // Show hint to user that they can use the fullscreen button
                    setShowFullscreenHint(true);
                    setTimeout(() => setShowFullscreenHint(false), 5000);

                    // Try with the document as fallback
                    if (document.documentElement.requestFullscreen) {
                      document.documentElement
                        .requestFullscreen()
                        .then(() => {
                          console.log("Entered document fullscreen mode");
                          setIsFullscreen(true);
                          setShowFullscreenHint(false);
                        })
                        .catch((docErr: unknown) => {
                          console.log(
                            "Document fullscreen also failed:",
                            docErr,
                          );
                        });
                    }
                  });
              } else {
                console.log("Fullscreen not supported");
                setShowFullscreenHint(true);
                setTimeout(() => setShowFullscreenHint(false), 5000);
              }
            }
          }, 1500); // Increased delay to ensure viewer is fully loaded
        });
      },
      error: function onError() {
        console.log("Client.init error");
        setIsLoading(false);
      },
    });
  }, [isScriptLoaded, uid]); // Re-run if the script loads or the UID prop changes

  // Function to manually trigger fullscreen
  const toggleFullscreen = () => {
    const iframe = iframeRef.current;

    if (!isFullscreen && iframe) {
      const requestFullscreen =
        iframe.requestFullscreen ||
        iframe.webkitRequestFullscreen ||
        iframe.mozRequestFullScreen ||
        iframe.msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(iframe);
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      const doc = document as FullscreenDocument;
      const exitFullscreen =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;

      if (exitFullscreen) {
        exitFullscreen.call(doc);
      }
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {/* Fullscreen toggle button */}
        {!isLoading && (
          <button
            onClick={toggleFullscreen}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1000,
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        )}

        {/* Fullscreen hint notification */}
        {showFullscreenHint && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "10px",
              zIndex: 1000,
              background: "rgba(59, 130, 246, 0.9)",
              color: "white",
              borderRadius: "6px",
              padding: "10px 15px",
              fontSize: "14px",
              maxWidth: "250px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Click the Fullscreen button for the best 3D viewing experience!
          </div>
        )}

        {/* Show a loading spinner while the model is loading */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "18px",
              background: "linear-gradient(135deg, #1e293b, #374151)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid rgba(255, 255, 255, 0.3)",
                borderTop: "4px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}
            />
            <div>Loading 3D Model...</div>
            <div style={{ fontSize: "14px", opacity: 0.7, marginTop: "8px" }}>
              Preparing for fullscreen experience
            </div>
          </div>
        )}

        {/* The iframe for the viewer */}
        <iframe
          ref={iframeRef}
          src=""
          id="api-frame"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            visibility: isLoading ? "hidden" : "visible", // Hide until ready
          }}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    </>
  );
}

export default SketchfabModalViewer;
