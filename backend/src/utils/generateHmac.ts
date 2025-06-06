import crypto from "crypto";

/**
 * Genera un HMAC MD5 para transferencias normales (por número de cuenta).
 * Compatible con el código Python.
 * @param accountNumber Número de cuenta del remitente
 * @param timestamp Timestamp ISO 8601
 * @param transactionId UUID de la transacción
 * @param amount Monto numérico de la transferencia
 * @returns HMAC en formato hexadecimal
 */
export function generateHmacForAccountTransfer(
  accountNumber: string,
  timestamp: string,
  transactionId: string,
  amount: number
): string {
  const secret = "supersecreta123"; // Debe coincidir con la clave del Python

  const amountFormatted = amount.toFixed(2); // Igual que en Python: "{:.2f}".format(amount)

  const message = `${accountNumber}${timestamp}${transactionId}${amountFormatted}`;

  return crypto
    .createHmac("md5", secret)
    .update(message, "utf8") // especificar codificación
    .digest("hex");
}

/**
 * Genera un HMAC MD5 para SINPE Móvil (por número de teléfono).
 * Compatible con el código Python.
 * @param phoneNumber Número de teléfono del remitente
 * @param timestamp Timestamp ISO 8601
 * @param transactionId UUID de la transacción
 * @param amount Monto numérico de la transferencia
 * @returns HMAC en formato hexadecimal
 */
export function generateHmacForPhoneTransfer(
  phoneNumber: string,
  timestamp: string,
  transactionId: string,
  amount: number
): string {
  const secret = "supersecreta123"; // Debe coincidir con la clave del Python

  const amountFormatted = amount.toFixed(2); // aseguramos compatibilidad

  const message = `${phoneNumber}${timestamp}${transactionId}${amountFormatted}`;

  return crypto
    .createHmac("md5", secret)
    .update(message, "utf8") // especificar codificación
    .digest("hex");
}
