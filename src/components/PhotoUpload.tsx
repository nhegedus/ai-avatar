"use client";

import { useRef } from "react";

interface Props {
  photo: string | null;
  onPhotoChange: (dataUrl: string | null) => void;
}

export default function PhotoUpload({ photo, onPhotoChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onPhotoChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  if (photo) {
    return (
      <div className="upload-zone has-photo">
        <div className="upload-photo-wrap">
          <img src={photo} alt="Your photo" className="upload-photo-img" />
          <div className="upload-photo-actions">
            <button
              className="upload-action-btn"
              onClick={() => fileRef.current?.click()}
              title="Change photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="upload-action-btn delete"
              onClick={() => onPhotoChange(null)}
              title="Delete photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
        <p className="upload-disclaimer">
          Uploaded photo is auto-deleted within 24 hours of generation.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>
    );
  }

  return (
    <div className="upload-zone empty" onClick={() => fileRef.current?.click()}>
      <div className="upload-zone-inner">
        <div className="upload-plus">+</div>
        <h3 className="upload-title">Upload 1 Photo</h3>
        <p className="upload-subtitle">
          Uploaded photo is auto-deleted within 24 hours of generation.
        </p>
        <button
          className="upload-btn desktop-only"
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload photo
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}
