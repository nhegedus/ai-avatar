"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  selfiePreview: string | null;
  onSelfieChange: (dataUrl: string | null) => void;
  onStatus: (msg: string, type: "info" | "success" | "error") => void;
}

export default function SelfieCapture({
  selfiePreview,
  onSelfieChange,
  onStatus,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  async function toggleCamera() {
    if (cameraActive) {
      stopCamera();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 640 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      onStatus("Camera access denied. Please upload a photo instead.", "error");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onSelfieChange(dataUrl);
    stopCamera();
    onStatus("Selfie captured — ready to generate!", "success");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const reader = new FileReader();
    reader.onload = (ev) => {
      onSelfieChange(ev.target?.result as string);
      onStatus("Photo loaded — ready to generate!", "success");
    };
    reader.readAsDataURL(file);
  }

  function retake() {
    onSelfieChange(null);
  }

  const showPreview = !!selfiePreview && !cameraActive;
  const showPlaceholder = !selfiePreview && !cameraActive;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-num n2">2</div>
        <span className="card-title">Your Selfie</span>
        <span className="tag tag-blue" style={{ marginLeft: "auto" }}>
          FACE
        </span>
      </div>
      <div className="card-body">
        <div className="camera-area">
          {showPlaceholder && (
            <div className="camera-placeholder">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <p>Open camera or upload a photo</p>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ display: cameraActive ? "block" : "none" }}
            className="camera-video"
          />

          {showPreview && (
            <img
              src={selfiePreview}
              alt="Your selfie"
              className="selfie-preview"
            />
          )}

          {cameraActive && (
            <div className="face-guide">
              <div className="face-guide-oval" />
            </div>
          )}
        </div>

        <div className="camera-btns">
          {!selfiePreview ? (
            <>
              <button className="btn btn-secondary" onClick={toggleCamera}>
                {cameraActive ? "STOP" : "CAMERA"}
              </button>
              <button
                className="btn btn-primary"
                onClick={capturePhoto}
                disabled={!cameraActive}
              >
                SNAP
              </button>
            </>
          ) : (
            <button className="btn btn-danger" onClick={retake}>
              RETAKE
            </button>
          )}
        </div>
        <div style={{ marginTop: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ width: "100%", fontSize: 12, padding: 9 }}
            onClick={() => fileRef.current?.click()}
          >
            UPLOAD PHOTO INSTEAD
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}
