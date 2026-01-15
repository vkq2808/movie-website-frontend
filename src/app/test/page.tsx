"use client";

import React from "react";
import { OverlayProvider, useOverlay } from "@/hooks/overlay";

const TestContent: React.FC = () => {
  const { open, close } = useOverlay();

  const handleOpenSimple = () => {
    open({
      title: "Simple Notification",
      content: <p>This is a simple overlay notification.</p>,
      closable: true,
    });
  };

  const handleOpenCustom = () => {
    open({
      title: <span style={{ color: "blue" }}>Custom Title</span>,
      content: (
        <div>
          <p>Custom content with JSX elements.</p>
          <button
            onClick={close}
            style={{
              padding: "8px 16px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Close from Inside
          </button>
        </div>
      ),
      closable: false,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Overlay Component Test Page</h1>
      <p>This page demonstrates how to use the overlay component.</p>
      <button
        onClick={handleOpenSimple}
        style={{ padding: "10px 20px", marginRight: "10px" }}
      >
        Open Simple Overlay
      </button>
      <button onClick={handleOpenCustom} style={{ padding: "10px 20px" }}>
        Open Custom Overlay
      </button>
    </div>
  );
};

export default function TestPage() {
  return (
    <OverlayProvider>
      <TestContent />
    </OverlayProvider>
  );
}
