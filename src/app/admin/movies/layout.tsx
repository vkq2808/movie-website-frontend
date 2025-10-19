import React from "react";

export default function MovieLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <div className="main-content">{children}</div>
      {modal}
    </>
  );
}