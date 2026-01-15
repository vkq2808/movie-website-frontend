"use client";
import React, { createContext, useState, ReactNode } from "react";

export interface OverlayState {
  isOpen: boolean;
  title?: string | ReactNode;
  content?: ReactNode;
  closable?: boolean;
}

export interface OverlayContextType {
  state: OverlayState;
  open: (config: Omit<OverlayState, "isOpen">) => void;
  close: () => void;
}

export const OverlayContext = createContext<OverlayContextType | undefined>(
  undefined
);
