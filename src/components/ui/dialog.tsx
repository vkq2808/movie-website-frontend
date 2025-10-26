"use client";
import * as React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg w-full max-w-lg mx-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ✅ Sửa: thêm className & props
export function DialogHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-b p-4 flex justify-between items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ✅ Sửa: thêm className & props
export function DialogContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

// ✅ Sửa: thêm className & props
export function DialogTitle({
  children,
  onClose,
  className,
  ...props
}: { onClose?: () => void } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)} {...props}>
      <h2 className="text-lg font-semibold">{children}</h2>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      )}
    </div>
  );
}
