"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import React from "react";

interface ReduxToolKitProvidersProps {
  children: React.ReactNode;
}

export function ReduxToolKitProviders({ children }: ReduxToolKitProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
