"use client";

interface Props {
  imageUrl: string | null;
  loading: boolean;
  loadingStep: string;
  onRegenerate: () => void;
}

export default function ResultCard({
  imageUrl,
  loading,
  loadingStep,
  onRegenerate,
}: Props) {
  function download() {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "maxxed-avatar.png";
    a.click();
  }

  return (
    <div className="result-card">
      <div className="card-header">
        <span className="card-title">Generated Avatar</span>
        {imageUrl && (
          <span className="tag tag-green" style={{ marginLeft: "auto" }}>
            READY
          </span>
        )}
      </div>
      <div className="result-body">
        {!loading && !imageUrl && (
          <div className="result-placeholder">
            <div className="big-icon">🎭</div>
            <p>Your MAXXED avatar will appear here after generation</p>
          </div>
        )}

        {loading && (
          <div className="loading-overlay" style={{ display: "flex" }}>
            <div className="loader-ring" />
            <div className="loading-label">
              Generating your avatar<span>...</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {loadingStep}
            </div>
          </div>
        )}

        {!loading && imageUrl && (
          <div className="result-image-wrap" style={{ display: "block" }}>
            <img src={imageUrl} alt="Generated Avatar" />
            <div className="result-actions">
              <button className="btn btn-primary" onClick={download}>
                DOWNLOAD
              </button>
              <button className="btn btn-secondary" onClick={onRegenerate}>
                REGENERATE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
