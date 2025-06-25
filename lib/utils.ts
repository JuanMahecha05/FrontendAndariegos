import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Desencripta un token encriptado del backend
 * @param encryptedToken - Token encriptado en base64
 * @returns Token desencriptado
 */
export function decryptToken(encryptedToken: string): string {
  try {
    if (!encryptedToken || typeof encryptedToken !== 'string') {
      throw new Error("Token vacío o no válido");
    }

    // Limpiar caracteres no válidos y ajustar padding Base64
    let base64 = encryptedToken.replace(/-/g, "+").replace(/_/g, "/");
    base64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");

    const decoded = atob(base64);

    // Si el resultado tiene formato de JWT, retornarlo directamente
    if (isValidJWT(decoded)) {
      return decoded;
    }

    // Si no es JWT, intentar desencriptarlo con clave XOR simple
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "andariegos-secret-key-2024";
    const keyBytes = new TextEncoder().encode(key);

    const tokenBytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      tokenBytes[i] = decoded.charCodeAt(i);
    }

    const decryptedBytes = new Uint8Array(tokenBytes.length);
    for (let i = 0; i < tokenBytes.length; i++) {
      decryptedBytes[i] = tokenBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return new TextDecoder().decode(decryptedBytes);
  } catch (error) {
    console.error("Error desencriptando token:", error);
    return encryptedToken; // fallback para evitar crash
  }
}

/**
 * Verifica si un string es un JWT válido
 * @param token - Token a verificar
 * @returns true si es un JWT válido
 */
export function isValidJWT(token: string): boolean {
  try {
    const parts = token.split(".");
    return (
      parts.length === 3 &&
      parts.every(part => /^[A-Za-z0-9\-_+/=]+$/.test(part))
    );
  } catch {
    return false;
  }
}