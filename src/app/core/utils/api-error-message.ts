import { HttpErrorResponse } from '@angular/common/http';

const API_MESSAGES = new Map<string, string>([
  ['Email already taken', 'El correo ya está registrado'],
  ['Incorrect email or password', 'Correo o contraseña incorrectos'],
  ['Please authenticate', 'Tu sesión expiró. Inicia sesión nuevamente'],
  ['Forbidden', 'No tienes permiso para realizar esta acción'],
  ['password must be at least 4 characters', 'La contraseña debe tener al menos 4 caracteres']
]);

const STATUS_MESSAGES = new Map<number, string>([
  [0, 'No se pudo conectar con el servidor'],
  [400, 'Revisa los datos ingresados'],
  [401, 'Tu sesión expiró. Inicia sesión nuevamente'],
  [403, 'No tienes permiso para realizar esta acción'],
  [404, 'No se encontró el recurso solicitado'],
  [429, 'Demasiados intentos. Espera un momento e inténtalo de nuevo'],
  [500, 'Error interno del servidor']
]);

export function getApiErrorMessage(error: HttpErrorResponse, fallback = 'Ocurrió un error inesperado'): string {
  const apiMessage: unknown = error.error?.message;

  if (typeof apiMessage === 'string' && API_MESSAGES.has(apiMessage)) {
    return API_MESSAGES.get(apiMessage) as string;
  }

  return STATUS_MESSAGES.get(error.status) ?? fallback;
}
