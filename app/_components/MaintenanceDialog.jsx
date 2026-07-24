"use client";
import React, { useEffect, useState } from "react";

const DEADLINE = new Date("2025-09-05T23:59:59+05:30");

function getTimeLeft() {
  const diff = DEADLINE - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: "12px",
          padding: "10px 14px",
          minWidth: "52px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "1.6rem",
            fontWeight: "800",
            color: "#a78bfa",
            fontVariantNumeric: "tabular-nums",
            display: "block",
            lineHeight: 1,
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          fontSize: "0.65rem",
          color: "#9ca3af",
          marginTop: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: "600",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function MaintenanceDialog({ open, onClose }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-title"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(145deg, #0f0c29, #1a1060, #24243e)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "24px",
            padding: "36px 32px 32px",
            maxWidth: "480px",
            width: "100%",
            boxShadow:
              "0 0 0 1px rgba(139,92,246,0.1), 0 32px 80px -12px rgba(109,40,217,0.45), 0 0 60px -20px rgba(139,92,246,0.3)",
            animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative glow blob */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            ✕
          </button>

          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))",
                border: "1px solid rgba(139,92,246,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              🚧
            </div>
          </div>

          {/* Title */}
          <h2
            id="maintenance-title"
            style={{
              textAlign: "center",
              fontSize: "1.45rem",
              fontWeight: "800",
              color: "#f3f4f6",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            We&apos;re Rebuilding Something Great
          </h2>

          {/* Subtitle */}
          <p
            style={{
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "0.9rem",
              lineHeight: "1.6",
              margin: "0 0 20px",
            }}
          >
            We&apos;re migrating and rebuilding the AI Course Generator to deliver
            a{" "}
            <span style={{ color: "#a78bfa", fontWeight: "600" }}>
              faster, smarter experience
            </span>
            . Course creation is temporarily paused.
          </p>

          {/* Info pill */}
          <div
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "24px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                color: "#c4b5fd",
                lineHeight: "1.5",
              }}
            >
              Your existing courses are safe and accessible. You can continue
              browsing and viewing your previously created courses.
            </p>
          </div>

          {/* New platform teaser */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.04))",
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>{"🚀"}</span>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#6ee7b7", lineHeight: "1.5" }}>
              The new{" "}
              <span style={{ fontWeight: "700", color: "#34d399" }}>Seed of Code</span>{" "}
              is being deployed at{" "}
              <span style={{ fontWeight: "700", color: "#34d399" }}>seedofcode.dev</span>
              {" — a completely rebuilt, faster version of this app."}
            </p>
          </div>

          {/* Countdown */}
          {timeLeft && (
            <div style={{ marginBottom: "28px" }}>
              <p
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: "600",
                  marginBottom: "12px",
                }}
              >
                Back online in
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <TimeUnit value={timeLeft.seconds} label="Secs" />
              </div>
            </div>
          )}

          {/* Target date */}
          <div
            style={{
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(109,40,217,0.05))",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <span style={{ color: "#7c3aed", fontSize: "0.78rem", fontWeight: "600" }}>
              {"🗓 Course creation resumes: "}
            </span>
            <span style={{ color: "#c4b5fd", fontSize: "0.78rem", fontWeight: "700" }}>
              5th September 2025
            </span>
          </div>

          {/* Primary CTA — Visit new site */}
          <a
            href="https://seedofcode.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #059669, #047857)",
              border: "none",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: "700",
              cursor: "pointer",
              textDecoration: "none",
              marginBottom: "10px",
              boxShadow:
                "0 4px 24px -4px rgba(5,150,105,0.55), 0 0 0 1px rgba(16,185,129,0.2)",
              transition: "all 0.2s",
              letterSpacing: "-0.01em",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #047857, #065f46)";
              e.currentTarget.style.boxShadow =
                "0 6px 28px -4px rgba(5,150,105,0.7), 0 0 0 1px rgba(16,185,129,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #059669, #047857)";
              e.currentTarget.style.boxShadow =
                "0 4px 24px -4px rgba(5,150,105,0.55), 0 0 0 1px rgba(16,185,129,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{"🌱"}</span>
            Visit seedofcode.dev
            <span
              style={{
                fontSize: "0.65rem",
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "6px",
                padding: "2px 7px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              NEW
            </span>
          </a>

          {/* Secondary Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9ca3af",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              View My Courses
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                border: "none",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 20px -4px rgba(109,40,217,0.5)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #5b21b6)";
                e.currentTarget.style.boxShadow = "0 6px 24px -4px rgba(109,40,217,0.65)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #6d28d9)";
                e.currentTarget.style.boxShadow = "0 4px 20px -4px rgba(109,40,217,0.5)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Got It!
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
