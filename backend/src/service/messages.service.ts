// src/services/message.service.ts

export const processMessage = (
  message: string
): { success: boolean; received: string } => {
  console.log("📩 Mensaje recibido:", message);
  return {
    success: true,
    received: message,
  };
};
