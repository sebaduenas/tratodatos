// Chilean RUT (Rol Único Tributario) validation and formatting

/**
 * Clean RUT by removing all non-alphanumeric characters except 'k' or 'K'
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

/**
 * Format RUT with dots and dash (e.g., 12.345.678-9)
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;

  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);

  // Add dots every 3 digits from right to left
  let formatted = "";
  for (let i = body.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formatted = "." + formatted;
    }
    formatted = body[i] + formatted;
  }

  return `${formatted}-${verifier}`;
}

/**
 * Calculate the verification digit for a RUT body
 */
export function calculateVerifier(rutBody: string): string {
  const cleaned = rutBody.replace(/\D/g, "");
  let sum = 0;
  let multiplier = 2;

  // Sum from right to left with multipliers 2, 3, 4, 5, 6, 7, 2, 3, ...
  for (let i = cleaned.length - 1; i >= 0; i--) {
    sum += parseInt(cleaned[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const digit = 11 - remainder;

  if (digit === 11) return "0";
  if (digit === 10) return "K";
  return digit.toString();
}

/**
 * Validate a Chilean RUT
 * Returns true if the RUT is valid, false otherwise
 */
export function validateRut(rut: string): boolean {
  if (!rut || typeof rut !== "string") return false;

  const cleaned = cleanRut(rut);
  
  // Must be at least 2 characters (body + verifier)
  if (cleaned.length < 2) return false;

  // Max length check (12 digits + K)
  if (cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);

  // Body must be all digits
  if (!/^\d+$/.test(body)) return false;

  // Calculate expected verifier
  const expectedVerifier = calculateVerifier(body);

  return verifier === expectedVerifier;
}

/**
 * Validate and format RUT
 * Returns formatted RUT if valid, null if invalid
 */
export function validateAndFormatRut(rut: string): string | null {
  if (!validateRut(rut)) return null;
  return formatRut(rut);
}

/**
 * Get RUT parts (body and verifier)
 */
export function getRutParts(rut: string): { body: string; verifier: string } | null {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return null;

  return {
    body: cleaned.slice(0, -1),
    verifier: cleaned.slice(-1),
  };
}

/**
 * Check if a string looks like a RUT (basic format check)
 */
export function looksLikeRut(value: string): boolean {
  // Common RUT patterns:
  // 12345678-9
  // 12.345.678-9
  // 123456789
  // 1234567-8
  const rutPattern = /^[\d.]+[-]?[\dkK]$/i;
  return rutPattern.test(value.trim());
}

/**
 * Zod-compatible RUT validation function
 */
export function zodRutValidator(value: string, ctx: { addIssue: (issue: { code: string; message: string }) => void }): boolean {
  if (!value || value.trim() === "") {
    return true; // Let required check handle this
  }

  const cleaned = cleanRut(value);
  
  if (cleaned.length < 8) {
    ctx.addIssue({
      code: "custom",
      message: "El RUT debe tener al menos 7 dígitos",
    });
    return false;
  }

  if (!validateRut(value)) {
    ctx.addIssue({
      code: "custom", 
      message: "RUT inválido. Verifica el dígito verificador.",
    });
    return false;
  }

  return true;
}
