"use client"

import { useEffect, useState } from 'react'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0)
  const [label, setLabel] = useState('')
  
  useEffect(() => {
    // Calculate password strength
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1 // Has uppercase
    if (/[a-z]/.test(password)) score += 1 // Has lowercase
    if (/[0-9]/.test(password)) score += 1 // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // Has special character
    
    // Normalize to 0-4 scale
    const normalizedScore = Math.min(4, Math.floor(score / 1.5))
    setStrength(normalizedScore)
    
    // Set label based on score
    switch (normalizedScore) {
      case 0:
        setLabel('Muy débil')
        break
      case 1:
        setLabel('Débil')
        break
      case 2:
        setLabel('Aceptable')
        break
      case 3:
        setLabel('Fuerte')
        break
      case 4:
        setLabel('Muy fuerte')
        break
      default:
        setLabel('')
    }
  }, [password])
  
  // Map strength to color
  const getColor = () => {
    switch (strength) {
      case 0:
        return 'bg-red-500'
      case 1:
        return 'bg-orange-500'
      case 2:
        return 'bg-yellow-500'
      case 3:
        return 'bg-green-500'
      case 4:
        return 'bg-green-600'
      default:
        return 'bg-gray-200'
    }
  }
  
  return (
    <div className="mt-2 space-y-1">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`transition-all duration-300 ${getColor()}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        />
      </div>
      {label && (
        <p className="text-xs text-muted-foreground">
          Fortaleza: <span className="font-medium">{label}</span>
        </p>
      )}
    </div>
  )
}