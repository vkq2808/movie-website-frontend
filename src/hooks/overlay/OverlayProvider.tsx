"use client";
import React, { useState } from "react";
import {
  OverlayContext,
  OverlayState,
  OverlayContextType,
} from "./OverlayContext";
import { OverlayContainer } from "./OverlayContainer";

export const OverlayProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<OverlayState>({ isOpen: false });

  const open = (config: Omit<OverlayState, "isOpen">) => {
    setState({ isOpen: true, ...config });
  };

  const close = () => {
    setState({ isOpen: false });
  };

  const contextValue: OverlayContextType = {
    state,
    open,
    close,
  };

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
      <OverlayContainer />
    </OverlayContext.Provider>
  );
};
