"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Drawer } from "vaul";

interface Props {
  open: boolean;
  onClose: () => void;
  onAuthorized: () => void;
}

export default function CodeGate({ open, onClose, onAuthorized }: Props) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setError("");
      setVerifying(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [open]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;

      const next = [...digits];
      next[index] = value;
      setDigits(next);
      setError("");

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 3);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  const submit = useCallback(async () => {
    const code = digits.join("");
    if (code.length < 4) {
      setError("Enter all 4 digits");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        onAuthorized();
      } else {
        setError("Wrong code. Try again.");
        setDigits(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Verification failed. Try again.");
    } finally {
      setVerifying(false);
    }
  }, [digits, onAuthorized]);

  return (
    <Drawer.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Drawer.Portal>
        <Drawer.Overlay className="codegate-overlay" />
        <Drawer.Content className="codegate-content">
          <img src="/character-up.png" alt="" className="codegate-character-img" />
          <Drawer.Title className="sr-only">Verification</Drawer.Title>
          <Drawer.Description className="sr-only">Enter the 4-digit code to generate your avatar</Drawer.Description>
          <div className="codegate-drawer-handle" />

          <h2 className="codegate-title">Verification</h2>
          <p className="codegate-subtitle">
            Enter the 4-digit code to<br />generate your avatar
          </p>

          <div className="codegate-digits" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`codegate-digit ${d ? "filled" : ""}`}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          {error && <p className="codegate-error">{error}</p>}

          <button
            className="btn-generate full-width"
            onClick={submit}
            disabled={verifying || digits.join("").length < 4}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            {verifying ? "Verifying..." : "Generate"}
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
