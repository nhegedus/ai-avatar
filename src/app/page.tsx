"use client";

import { useState, useCallback } from "react";
import PhotoRequirements from "@/components/PhotoRequirements";
import PhotoUpload from "@/components/PhotoUpload";
import ResultCard from "@/components/ResultCard";
import UploadDrawer from "@/components/UploadDrawer";
import CodeGate from "@/components/CodeGate";

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(
    "3D cartoon avatar in Maxxed casino brand style, colorful hair, X eyes, bold expressive face, glossy 3D render, black background, high quality"
  );
  const [status, setStatus] = useState<{
    msg: string;
    type: "info" | "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [codeGateOpen, setCodeGateOpen] = useState(false);

  const showStatus = useCallback(
    (msg: string, type: "info" | "success" | "error") => {
      setStatus({ msg, type });
    },
    []
  );

  async function uploadImage(dataUrl: string, filename: string) {
    const blob = await dataUrlToBlob(dataUrl);
    const formData = new FormData();
    formData.append("file", blob, filename);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    const data = await res.json();
    return data.url;
  }

  async function generate() {
    if (!photo) return;

    setLoading(true);
    setResultUrl(null);

    try {
      setLoadingStep("Uploading...");
      const faceUrl = await uploadImage(photo, "selfie.jpg");

      setLoadingStep("Generating avatar...");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faceImageUrl: faceUrl, prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setResultUrl(data.imageUrl);
      showStatus("Avatar generated successfully!", "success");
    } catch (err) {
      showStatus(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  // If we have a result, show result screen
  if (resultUrl && !loading) {
    return (
      <div className="page-wrap">
        <ResultCard
          imageUrl={resultUrl}
          loading={false}
          loadingStep=""
          onRegenerate={generate}
        />
        <div className="bottom-actions">
          <button
            className="btn-reupload"
            onClick={() => {
              setPhoto(null);
              setResultUrl(null);
              setStatus(null);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            New Photo
          </button>
          <button className="btn-generate" onClick={() => setCodeGateOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Regenerate
          </button>
        </div>
        <CodeGate
          open={codeGateOpen}
          onClose={() => setCodeGateOpen(false)}
          onAuthorized={() => {
            setCodeGateOpen(false);
            generate();
          }}
        />
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div className="page-wrap">
        <div className="page-header">
          <h1 className="page-title">
            Generating<span> avatar</span>
          </h1>
          <p className="page-subtitle">Please wait while we create your avatar</p>
        </div>
        <div className="loading-container">
          <div className="loader-ring" />
          <div className="loading-label">
            Generating your avatar<span>...</span>
          </div>
          <div className="loading-step">{loadingStep}</div>
        </div>
        {status && (
          <div className={`status-bar ${status.type}`}>{status.msg}</div>
        )}
      </div>
    );
  }

  const hasPhoto = !!photo;

  return (
    <div className="page-wrap">
      {/* Hero */}
      <div className="page-header">
        <h1 className="page-title">
          YOUR FACE.<br />
          <span>MAXXED OUT.</span>
        </h1>
      </div>

      {/* Main content */}
      <div className="main-layout">
        {/* Photo Requirements - desktop only */}
        <div className="requirements-col">
          <PhotoRequirements variant="desktop" />
        </div>

        {/* Upload / Preview */}
        <div className="upload-col">
          <PhotoUpload photo={photo} onPhotoChange={setPhoto} />
        </div>
      </div>

      {/* Photo Requirements - mobile only */}
      <PhotoRequirements variant="mobile" />

      {/* Style Prompt */}
      <div className="style-prompt-section">
        <div className="style-prompt-card">
          <div className="style-prompt-header">
            <div className="style-prompt-num">2</div>
            <span className="style-prompt-title">STYLE PROMPT</span>
            <span className="style-prompt-tag">OPTIONAL</span>
          </div>
          <div className="style-prompt-body">
            <textarea
              className="style-prompt-input"
              rows={2}
              placeholder="3D cartoon avatar, Maxxed casino style, vibrant colors, X eyes, bold style, high quality render..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      {hasPhoto && (
        <div className="bottom-actions">
          <button className="btn-reupload" onClick={() => setPhoto(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Re-upload
          </button>
          <button className="btn-generate" onClick={() => setCodeGateOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Generate
          </button>
        </div>
      )}


      {/* Mobile: fixed bottom upload button when no photo */}
      {!hasPhoto && (
        <div className="mobile-upload-btn-wrap">
          <button
            className="btn-generate full-width"
            onClick={() => setDrawerOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload photo
          </button>
        </div>
      )}

      {/* Upload drawer - mobile */}
      <UploadDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onPhotoSelected={setPhoto}
      />

      {/* Code Gate Modal */}
      <CodeGate
        open={codeGateOpen}
        onClose={() => setCodeGateOpen(false)}
        onAuthorized={() => {
          setCodeGateOpen(false);
          generate();
        }}
      />

      {/* Status */}
      {status && (
        <div className={`status-bar ${status.type}`}>{status.msg}</div>
      )}
    </div>
  );
}
