'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, type ButtonProps } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const INTROSPECT_BLURB =
  "A short questionnaire about your business — who you are, what you do, and how you'd like your site to feel. We use your answers to build a preview of your website."

const TIP_WIDTH = 288
const TIP_GAP = 12
const VIEW_PAD = 12

type PopoverSide = 'top' | 'bottom' | 'left' | 'right'

type IntrospectButtonProps = Omit<ButtonProps, 'children'> & {
  children?: ReactNode
  /** Preferred side; flips automatically if it would leave the viewport */
  popoverSide?: PopoverSide
  /** Horizontal alignment relative to the button (for top/bottom) */
  popoverAlign?: 'start' | 'center'
}

type TipPos = { top: number; left: number; side: PopoverSide }

export function IntrospectButton({
  children = 'Introspect',
  className,
  popoverSide = 'bottom',
  popoverAlign = 'center',
  href = '/introspect',
  onClick,
  ...props
}: IntrospectButtonProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [tipPos, setTipPos] = useState<TipPos | null>(null)
  const tipId = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  const fillsWidth = Boolean(className && /\bw-full\b/.test(className))

  useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = () => {
    const anchor = wrapRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const tipHeight = tipRef.current?.offsetHeight ?? 120
    const spaceBelow = window.innerHeight - rect.bottom - VIEW_PAD
    const spaceAbove = rect.top - VIEW_PAD
    const spaceLeft = rect.left - VIEW_PAD
    const spaceRight = window.innerWidth - rect.right - VIEW_PAD
    const minFit = tipHeight * 0.85

    let side: PopoverSide = popoverSide

    if (popoverSide === 'left' || popoverSide === 'right') {
      const preferLeft = popoverSide === 'left'
      const primary = preferLeft ? spaceLeft : spaceRight
      const alternate = preferLeft ? spaceRight : spaceLeft
      if (primary < TIP_WIDTH + TIP_GAP && alternate > primary) {
        side = preferLeft ? 'right' : 'left'
      } else if (primary < TIP_WIDTH + TIP_GAP && spaceBelow >= minFit) {
        side = 'bottom'
      } else if (primary < TIP_WIDTH + TIP_GAP && spaceAbove >= minFit) {
        side = 'top'
      }
    } else if (popoverSide === 'bottom') {
      if (spaceBelow < minFit && spaceAbove > spaceBelow) side = 'top'
    } else if (spaceAbove < minFit && spaceBelow > spaceAbove) {
      side = 'bottom'
    }

    let left = 0
    let top = 0

    if (side === 'left' || side === 'right') {
      left =
        side === 'left'
          ? rect.left - TIP_WIDTH - TIP_GAP
          : rect.right + TIP_GAP
      // Vertically center on the button; keep fully in viewport
      top = rect.top + rect.height / 2 - tipHeight / 2
      top = Math.max(
        VIEW_PAD,
        Math.min(top, window.innerHeight - tipHeight - VIEW_PAD)
      )
      left = Math.max(
        VIEW_PAD,
        Math.min(left, window.innerWidth - TIP_WIDTH - VIEW_PAD)
      )
    } else {
      left =
        popoverAlign === 'start'
          ? rect.left
          : rect.left + rect.width / 2 - TIP_WIDTH / 2
      left = Math.max(
        VIEW_PAD,
        Math.min(left, window.innerWidth - TIP_WIDTH - VIEW_PAD)
      )

      top =
        side === 'bottom'
          ? rect.bottom + TIP_GAP
          : rect.top - tipHeight - TIP_GAP

      if (side === 'bottom' && top + tipHeight > window.innerHeight - VIEW_PAD) {
        top = Math.max(
          rect.bottom + TIP_GAP,
          window.innerHeight - tipHeight - VIEW_PAD
        )
      }
      if (side === 'top' && top < VIEW_PAD) {
        if (spaceBelow >= minFit || spaceBelow >= spaceAbove) {
          side = 'bottom'
          top = rect.bottom + TIP_GAP
        } else {
          top = VIEW_PAD
        }
      }
    }

    setTipPos({ top, left, side })
  }

  useLayoutEffect(() => {
    if (!open) {
      setTipPos(null)
      return
    }
    updatePosition()
    const raf = requestAnimationFrame(() => updatePosition())
    const onReposition = () => updatePosition()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, popoverSide, popoverAlign])

  return (
    <span
      ref={wrapRef}
      className={cn('relative inline-flex', fillsWidth && 'w-full')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false)
        }
      }}
    >
      <Button
        href={href}
        className={cn('cursor-pointer', className)}
        aria-describedby={open ? tipId : undefined}
        onClick={(e) => {
          if (window.matchMedia('(hover: none)').matches && !open) {
            e.preventDefault()
            setOpen(true)
            return
          }
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={tipRef}
                id={tipId}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.98, x: tipPos?.side === 'left' ? 6 : tipPos?.side === 'right' ? -6 : 0 }}
                animate={{ opacity: tipPos ? 1 : 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                style={{
                  position: 'fixed',
                  top: tipPos?.top ?? -9999,
                  left: tipPos?.left ?? 0,
                  width: TIP_WIDTH,
                  maxWidth: `calc(100vw - ${VIEW_PAD * 2}px)`,
                }}
                className="z-[100] rounded-lg border border-gray-200 bg-paper px-3.5 py-3 text-left shadow-lg pointer-events-none"
              >
                <p className="text-xs font-semibold tracking-wide uppercase text-primary-700 mb-1.5">
                  What is Introspect?
                </p>
                <p className="text-sm text-gray-700 leading-snug">{INTROSPECT_BLURB}</p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </span>
  )
}
