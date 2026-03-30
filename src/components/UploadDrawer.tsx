"use client";

import { useRef } from "react";
import { Drawer } from "vaul";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoSelected: (dataUrl: string) => void;
}

export default function UploadDrawer({ open, onOpenChange, onPhotoSelected }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onPhotoSelected(ev.target?.result as string);
      onOpenChange(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="drawer-overlay" />
        <Drawer.Content className="drawer-content">
          <Drawer.Title className="sr-only">Upload photo</Drawer.Title>
          <div className="drawer-handle" />
          <div className="drawer-options">
            <button
              className="drawer-option"
              onClick={() => cameraRef.current?.click()}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>Camera</span>
            </button>
            <button
              className="drawer-option"
              onClick={() => fileRef.current?.click()}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Photos</span>
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
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
