"use client"

import { useToast } from "@/components/ui/use-toast"
import { X } from 'lucide-react'
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  // Add auto-dismiss functionality
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.open) {
        // Set a timeout to auto-dismiss each toast after 3 seconds
        const timer = setTimeout(() => {
          dismiss(toast.id);
        }, toast.duration || 3000);
        
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dismiss]);

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex justify-between items-start ${
            toast.type === "success"
              ? "bg-green-100 border-l-4 border-green-500"
              : toast.type === "error"
              ? "bg-red-100 border-l-4 border-red-500"
              : "bg-blue-100 border-l-4 border-blue-500"
          } animate-in slide-in-from-right fade-in duration-300`}
        >
          <div>
            {toast.title && <h4 className="font-medium text-sm">{toast.title}</h4>}
            {toast.description && <p className="text-xs mt-1 opacity-80">{toast.description}</p>}
          </div>
          <button 
            onClick={() => dismiss(toast.id)} 
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
