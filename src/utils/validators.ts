const REGEX_GMAIL = /^[^\s@]+@gmail\.com$/i;

export function esGmailValido(usuario: string): boolean {
  return REGEX_GMAIL.test(usuario.trim());
}

export function validarRegistro(usuario: string, password: string): string[] {
  const errores: string[] = [];

  if (!usuario.trim()) {
    errores.push('El usuario es requerido');
  } else if (!esGmailValido(usuario)) {
    errores.push('El usuario debe ser un email @gmail.com');
  }

  if (!password) {
    errores.push('La contraseña es requerida');
  } else if (password.length < 6) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }

  return errores;
}

export function validarMedicacion(nombre: string, hora: string): string[] {
  const errores: string[] = [];

  if (!nombre.trim()) {
    errores.push('El nombre de la medicación es requerido');
  }

  if (!hora.trim()) {
    errores.push('La hora de la medicación es requerida');
  }

  return errores;
}
