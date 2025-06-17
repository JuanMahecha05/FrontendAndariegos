import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Desencripta un token encriptado del backend
 * @param encryptedToken - Token encriptado en base64
 * @returns Token desencriptado
 */
export function decryptToken(encryptedToken: string): string {
  try {
    // Decodificar de base64
    const decoded = atob(encryptedToken);
    
    // Si el token ya es un JWT válido (contiene puntos), retornarlo directamente
    if (decoded.includes('.')) {
      return decoded;
    }
    
    // Si no, intentar desencriptar usando una clave simple
    // Nota: En producción, esto debería usar la misma clave que el backend
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'andariegos-secret-key-2024';
    const keyBytes = new TextEncoder().encode(key);
    
    // Convertir el token decodificado a bytes
    const tokenBytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      tokenBytes[i] = decoded.charCodeAt(i);
    }
    
    // XOR simple con la clave (esto es solo un ejemplo, en producción usar AES)
    const decryptedBytes = new Uint8Array(tokenBytes.length);
    for (let i = 0; i < tokenBytes.length; i++) {
      decryptedBytes[i] = tokenBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    // Convertir de vuelta a string
    return new TextDecoder().decode(decryptedBytes);
  } catch (error) {
    console.error('Error desencriptando token:', error);
    // Si falla la desencriptación, retornar el token original
    return encryptedToken;
  }
}

/**
 * Verifica si un string es un JWT válido
 * @param token - Token a verificar
 * @returns true si es un JWT válido
 */
export function isValidJWT(token: string): boolean {
  try {
    const parts = token.split('.');
    return parts.length === 3 && 
           parts.every(part => part.length > 0) &&
           /^[A-Za-z0-9+/=]+$/.test(parts[0]) &&
           /^[A-Za-z0-9+/=]+$/.test(parts[1]) &&
           /^[A-Za-z0-9+/=]+$/.test(parts[2]);
  } catch {
    return false;
  }
}
