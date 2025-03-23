'use client';

import React, { useState } from "react";

interface SwitcherProps {
  onChange?: (value: boolean) => void;
  initialValue?: boolean;
}

const Switcher = ({ onChange, initialValue = false }: SwitcherProps) => {
  const [isOn, setIsOn] = useState(initialValue);

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <button
      onClick={toggleSwitch}
      style={{
        width: "40px",
        height: "24px",
        borderRadius: "15px",
        backgroundColor: isOn ? "green" : "gray",
        border: "none",
        cursor: "pointer",
        position: "relative",
        outline: "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "2px",
          left: isOn ? "16px" : "3px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s ease"
        }}
      />
    </button>
  );
};

export default Switcher;
