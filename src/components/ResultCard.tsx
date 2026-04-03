"use client";

import Image from "next/image";

interface Props {
  imageUrl: string | null;
  loading: boolean;
  loadingStep: string;
  onRegenerate: () => void;
}

export default function ResultCard({ imageUrl, loading, loadingStep }: Props) {
  async function download() {
    if (!imageUrl) return;

    // For data URLs (Gemini), create blob directly
    if (imageUrl.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = "maxxed-avatar.jpg";
      a.click();
      return;
    }

    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "maxxed-avatar.jpg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="result-card">
      <div className="result-body">
        {!loading && !imageUrl && (
          <div className="result-placeholder">
            <div className="big-icon">🎭</div>
            <p>Your avatar will appear here after generation</p>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loader-ring" />
            <div className="loading-label">
              Generating your avatar<span>...</span>
            </div>
            <div className="loading-step">{loadingStep}</div>
          </div>
        )}

        {!loading && imageUrl && (
          <div className="result-image-wrap">
            {imageUrl.startsWith("data:") ? (
              <img src={imageUrl} alt="Generated Avatar" />
            ) : (
              <Image
                src={imageUrl}
                alt="Generated Avatar"
                width={300}
                height={300}
                unoptimized={false}
              />
            )}
            <div className="result-actions">
              <button className="btn-download" onClick={download}>
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
