"use client";

interface Props {
  imageUrl: string | null;
  loading: boolean;
  loadingStep: string;
  onRegenerate: () => void;
}

export default function ResultCard({ imageUrl, loading, loadingStep }: Props) {
  async function download() {
    if (!imageUrl) return;
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "maxxed-avatar.png";
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
            <img src={imageUrl} alt="Generated Avatar" />
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
