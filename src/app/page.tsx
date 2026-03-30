"use client";

import { useState, useCallback } from "react";
import SelfieCapture from "@/components/SelfieCapture";
import ResultCard from "@/components/ResultCard";

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export default function Home() {
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
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
    if (!selfiePreview) {
      showStatus("Capture a selfie first.", "error");
      return;
    }

    setLoading(true);
    setResultUrl(null);

    try {
      setLoadingStep("Uploading face image...");
      showStatus("Uploading selfie...", "info");
      const faceUrl = await uploadImage(selfiePreview, "selfie.jpg");

      setLoadingStep("Generating avatar...");
      showStatus("Generating avatar...", "info");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceImageUrl: faceUrl,
          prompt,
        }),
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

  const canGenerate = !!selfiePreview && !loading;

  return (
    <div className="wrap">
      {/* Hero */}
      <div className="hero">
        <h1>
          YOUR FACE.
          <br />
          <em>MAXXED OUT.</em>
        </h1>
      </div>

      {/* Selfie */}
      <SelfieCapture
        selfiePreview={selfiePreview}
        onSelfieChange={setSelfiePreview}
        onStatus={showStatus}
      />

      {/* Prompt */}
      <div className="generate-section" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-num n3">2</div>
            <span className="card-title">Style Prompt</span>
            <span className="tag tag-red" style={{ marginLeft: "auto" }}>
              OPTIONAL
            </span>
          </div>
          <div className="card-body">
            <textarea
              className="prompt-input"
              rows={2}
              placeholder="3D cartoon avatar, Maxxed casino style, vibrant colors, X eyes, bold style, high quality render..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        className="generate-btn-sm"
        disabled={!canGenerate}
        onClick={generate}
      >
        Generate
      </button>

      {/* Status Bar */}
      {status && (
        <div className={`status-bar ${status.type}`} style={{ display: "flex" }}>
          {status.msg}
        </div>
      )}

      {/* Result */}
      <div style={{ marginTop: 16 }}>
        <ResultCard
          imageUrl={resultUrl}
          loading={loading}
          loadingStep={loadingStep}
          onRegenerate={generate}
        />
      </div>
    </div>
  );
}
