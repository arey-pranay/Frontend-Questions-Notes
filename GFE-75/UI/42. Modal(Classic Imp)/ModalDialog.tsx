import type { Dispatch, SetStateAction } from "react";

export default function ModalDialog({
  children,
  title,
  isOpen,
  setIsOpen,
}: Readonly<{
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}>) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 40,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          position: "relative",
          width: "50%",
          height: "fit-content",
          padding: 20,
          borderRadius: 12,
          backgroundColor: "rgba(128, 128, 128, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={{ float: "right", cursor: "pointer" }}
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>

        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}
