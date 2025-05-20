import prisma from "./client";
import AppError from "./AppError";
export function sanitizeBigInt(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeBigInt);
  }

  if (obj && typeof obj === 'object') {
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    const newObj: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'bigint') {
        newObj[key] = Number(value); 
      } else if (value instanceof Date) {
        newObj[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = sanitizeBigInt(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  }

  return obj;
}

export function generateParkingCode(prefix = "KPA", length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}



export const generateUniqueParkingCode = async (): Promise<string> => {
  let code: string;
  let attempts = 0;
  const maxAttempts = 10

  do {
    code = generateParkingCode();
    const existingCode = await prisma.parkingLot.findUnique({
      where: { code },
    });
    if (!existingCode) return code;
    attempts++;
  } while (attempts < maxAttempts);

  throw new AppError("Failed to generate a unique parking code", 500);
};
