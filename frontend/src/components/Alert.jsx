import { useState, useEffect } from 'react'

const STYLES = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-600 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
}

function Alert({ type = 'info', message, onClose, autoClose = true, duration = 4000 }) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (!autoClose) return
        const timer = setTimeout(() => {
            setVisible(false)
            onClose?.()
        }, duration)
        return () => clearTimeout(timer)
    }, [])

    if (!visible || !message) return null

    return (
        <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${STYLES[type]} animate-fade-in`}>
            <span className="flex-shrink-0 text-base">{ICONS[type]}</span>
            <p className="flex-1">{message}</p>
            <button
                onClick={() => { setVisible(false); onClose?.() }}
                className="flex-shrink-0 opacity-50 hover:opacity-100 transition text-lg leading-none"
            >
                ×
            </button>
        </div>
    )
}

export default Alert