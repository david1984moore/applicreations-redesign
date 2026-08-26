'use client'

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ComboboxOption = {
  value: string
  label: string
  hint?: string
}

function filterOptions(
  options: ComboboxOption[],
  query: string,
  max: number
): ComboboxOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return options.slice(0, max)
  const starts: ComboboxOption[] = []
  const contains: ComboboxOption[] = []
  for (const opt of options) {
    const label = opt.label.toLowerCase()
    const value = opt.value.toLowerCase()
    const hint = (opt.hint ?? '').toLowerCase()
    const hit =
      label.startsWith(q) || value.toLowerCase().startsWith(q) || hint.startsWith(q)
        ? 'starts'
        : label.includes(q) || value.includes(q) || hint.includes(q)
          ? 'contains'
          : null
    if (hit === 'starts') starts.push(opt)
    else if (hit === 'contains') contains.push(opt)
    if (starts.length >= max) break
  }
  return [...starts, ...contains].slice(0, max)
}

function optionLabel(
  options: ComboboxOption[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value
}

export function LocationCombobox({
  id,
  value,
  options,
  onChange,
  placeholder,
  error,
  allowCustom = false,
  emptyMessage,
  maxResults = 80,
  openOnEmpty = true,
}: {
  id: string
  value: string
  options: ComboboxOption[]
  onChange: (value: string, option?: ComboboxOption) => void
  placeholder?: string
  error?: boolean
  allowCustom?: boolean
  emptyMessage: string
  maxResults?: number
  /** When false, the list stays closed until the user types. */
  openOnEmpty?: boolean
}) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 })

  const selectedLabel = optionLabel(options, value)
  const inputValue = query ?? (value ? selectedLabel : '')
  const filtered = useMemo(
    () => filterOptions(options, query ?? '', maxResults),
    [options, query, maxResults]
  )

  const showList = open && (openOnEmpty || (query ?? '').trim().length > 0)

  const updateMenuPos = () => {
    const el = inputRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width })
  }

  useLayoutEffect(() => {
    if (!showList) return
    updateMenuPos()
    const onWin = () => updateMenuPos()
    window.addEventListener('resize', onWin)
    window.addEventListener('scroll', onWin, true)
    return () => {
      window.removeEventListener('resize', onWin)
      window.removeEventListener('scroll', onWin, true)
    }
  }, [showList, filtered.length])

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target)) return
      const menu = document.getElementById(listId)
      if (menu?.contains(target)) return
      commitAndClose()
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close-on-outside-click
  }, [open, query, filtered, value])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, options])

  const selectOption = (opt: ComboboxOption) => {
    onChange(opt.value, opt)
    setQuery(null)
    setOpen(false)
  }

  const commitAndClose = () => {
    const typed = (query ?? inputValue).trim()
    if (query !== null) {
      const exact = options.find(
        (o) =>
          o.label.toLowerCase() === typed.toLowerCase() ||
          o.value.toLowerCase() === typed.toLowerCase() ||
          (o.hint && o.hint.toLowerCase() === typed.toLowerCase())
      )
      if (exact) {
        selectOption(exact)
        return
      }
      if (allowCustom) {
        onChange(typed)
        setQuery(null)
        setOpen(false)
        return
      }
    }
    setQuery(null)
    setOpen(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      if (open) {
        e.preventDefault()
        if (filtered[activeIndex]) selectOption(filtered[activeIndex])
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setQuery(null)
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        ref={inputRef}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined
        }
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          'flex h-11 w-full rounded-md border bg-white px-3.5 py-2 pr-10 text-base text-gray-900 placeholder:text-gray-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
          error ? 'border-error' : 'border-gray-300'
        )}
        value={inputValue}
        placeholder={placeholder}
        onFocus={(e) => {
          setOpen(true)
          e.currentTarget.select()
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          if (allowCustom) onChange(e.target.value)
        }}
        onBlur={() => {
          // Delay so option mousedown can fire first.
          window.setTimeout(() => {
            if (!rootRef.current) return
            const active = document.activeElement
            if (rootRef.current.contains(active)) return
            const menu = document.getElementById(listId)
            if (menu?.contains(active)) return
            commitAndClose()
          }, 120)
        }}
        onKeyDown={onKeyDown}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className="absolute right-0 top-0 flex h-11 w-10 items-center justify-center text-gray-500"
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen((wasOpen) => !wasOpen)
          inputRef.current?.focus()
        }}
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      {showList && typeof document !== 'undefined'
        ? createPortal(
            <ul
              id={listId}
              role="listbox"
              style={{
                position: 'fixed',
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
              }}
              className="z-[80] max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            >
              {filtered.length === 0 ? (
                <li className="px-3.5 py-2 text-sm text-gray-500">{emptyMessage}</li>
              ) : (
                filtered.map((opt, index) => {
                  const active = index === activeIndex
                  return (
                    <li
                      key={`${opt.value}-${opt.hint ?? ''}`}
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={opt.value === value}
                      className={cn(
                        'cursor-pointer px-3.5 py-2 text-sm text-gray-900',
                        active
                          ? 'bg-[oklch(96%_0.04_230)]'
                          : 'hover:bg-gray-50'
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        selectOption(opt)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <span>{opt.label}</span>
                      {opt.hint ? (
                        <span className="ml-2 text-gray-500">{opt.hint}</span>
                      ) : null}
                    </li>
                  )
                })
              )}
            </ul>,
            document.body
          )
        : null}
    </div>
  )
}
