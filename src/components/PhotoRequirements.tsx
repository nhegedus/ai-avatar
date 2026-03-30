"use client";

const badExamples = [
  { src: "/examples/covered-face.jpg", label: "Covered face" },
  { src: "/examples/side-shot.webp", label: "Side shot" },
  { src: "/examples/group-shot.webp", label: "Group shot" },
  { src: "/examples/small-face.webp", label: "Small face" },
  { src: "/examples/blurry-photo.webp", label: "Blurry photo" },
  { src: "/examples/bad-exposure.webp", label: "Bad exposure" },
];

export default function PhotoRequirements({ variant }: { variant: "desktop" | "mobile" }) {
  if (variant === "mobile") {
    return (
      <div className="photo-req-mobile">
        <p className="photo-req-label">Photo Requirements</p>
        <div className="photo-req-scroll">
          <div className="photo-req-thumb good">
            <img src="/examples/good-photo.webp" alt="Good example" />
            <span className="photo-req-badge good">✓</span>
            <p>Front &amp; clear photo</p>
          </div>
          <div className="photo-req-thumb bad">
            <img src="/examples/group-shot.webp" alt="Group shot" />
            <span className="photo-req-badge bad">✕</span>
            <p>No group shots</p>
          </div>
          <div className="photo-req-thumb bad">
            <img src="/examples/side-shot.webp" alt="Avoid side shots" />
            <span className="photo-req-badge bad">✕</span>
            <p>Avoid side shots</p>
          </div>
          <div className="photo-req-thumb bad">
            <img src="/examples/blurry-photo.webp" alt="No blurry photos" />
            <span className="photo-req-badge bad">✕</span>
            <p>No blurry photos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-req-desktop">
      <div className="photo-req-title-row">
        <div className="photo-req-num">1</div>
        <h3 className="photo-req-title">PHOTO REQUIREMENTS</h3>
      </div>
      <div className="photo-req-grid">
        {/* Good example */}
        <div className="photo-req-good-card">
          <div className="photo-req-good-label">
            <span className="badge-green">✓</span> Good photo example
          </div>
          <div className="photo-req-good-img">
            <img src="/examples/good-photo.webp" alt="Good photo example" />
          </div>
          <p className="photo-req-good-desc">
            Single person, front-facing, with a clean background.
          </p>
        </div>

        {/* Bad examples */}
        <div className="photo-req-bad-card">
          <div className="photo-req-bad-label">
            <span className="badge-red">✕</span> bad photo = bad headshot
          </div>
          <div className="photo-req-bad-grid">
            {badExamples.map((ex) => (
              <div key={ex.label} className="photo-req-bad-item">
                <div className="photo-req-bad-img-wrap">
                  <img src={ex.src} alt={ex.label} />
                  <span className="photo-req-badge bad">✕</span>
                </div>
                <p>{ex.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
