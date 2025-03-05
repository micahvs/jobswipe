"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: number
  message: string
  description?: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  toast: (message: string, options?: { description?: string; type?: ToastType }) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, options?: { description?: string; type?: ToastType }) => {
    const id = toastId++
    const newToast: Toast = {
      id,
      message,
      description: options?.description,
      type: options?.type || "info",
    }
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
