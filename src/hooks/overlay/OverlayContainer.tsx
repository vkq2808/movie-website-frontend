import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { OverlayContext } from "./OverlayContext";

export const OverlayContainer: React.FC = () => {
  const context = useContext(OverlayContext);
  if (!context) return null;

  const { state, close } = context;
  const { isOpen, title, content, closable = true } = state;

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closable) {
      close();
    }
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={handleOverlayClick}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={handlePanelClick}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>{title}</h2>
          {closable && (
            <button
              onClick={close}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div>{content}</div>
      </div>
    </div>,
    document.body
  );
};
