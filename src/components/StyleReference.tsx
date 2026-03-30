"use client";

import { useRef } from "react";

interface Props {
  stylePreview: string | null;
  onStyleChange: (dataUrl: string) => void;
}

export default function StyleReference({ stylePreview, onStyleChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onStyleChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-num n1">1</div>
        <span className="card-title">Style Reference</span>
        <span className="tag tag-green" style={{ marginLeft: "auto" }}>
          BRAND
        </span>
      </div>
      <div className="card-body">
        <div
          className="img-upload-zone"
          onClick={() => fileRef.current?.click()}
        >
          <img
            className="style-ref-img"
            src={stylePreview || "/caracter.png"}
            alt="Style reference"
          />
          <div className="img-overlay">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c8ff00"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Replace Image</span>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        <div className="style-label">
          MAXXED Character &bull; <span>3D Cartoon Style</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="flex-gap">
            <span className="tag tag-green">3D Render</span>
            <span className="tag tag-green">Cartoon</span>
            <span className="tag tag-green">X-Eyes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
