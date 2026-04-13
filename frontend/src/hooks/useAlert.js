import { useState } from 'react'

export function useAlert() {
    const [alert, setAlert] = useState(null)

    const showAlert = (type, message) => {
        setAlert({ type, message, key: Date.now() })
    }

    const success = (message) => showAlert('success', message)
    const error = (message) => showAlert('error', message)
    const warning = (message) => showAlert('warning', message)
    const info = (message) => showAlert('info', message)
    const clear = () => setAlert(null)

    return { alert, success, error, warning, info, clear }
}