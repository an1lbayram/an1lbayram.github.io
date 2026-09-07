import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { EASE } from '../lib/motion'

const Toast = ({ message, type = 'success', onClose }) => {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), 5000)
    return () => clearTimeout(timer)
  }, [])

  const isSuccess = type === 'success'

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={`fixed bottom-6 left-4 right-4 z-[60] flex items-center gap-3 rounded-lg border-l-4 bg-popover
                  px-5 py-4 text-popover-foreground shadow-xl sm:right-auto sm:left-6 sm:max-w-md
                  ${isSuccess ? 'border-l-[hsl(var(--success))]' : 'border-l-destructive'}`}
      role="status"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white
                    ${isSuccess ? 'bg-[hsl(var(--success))]' : 'bg-destructive'}`}
        data-testid="toast-icon"
        data-variant={isSuccess ? 'success' : 'error'}
      >
        {isSuccess ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </span>
      <p className="text-sm font-medium">{message}</p>
      <button
        className="ml-auto rounded p-1 opacity-50 transition-opacity hover:opacity-100"
        onClick={onClose}
        aria-label="Kapat"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export default Toast
