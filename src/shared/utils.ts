// src/shared/utils.ts
export function generateUniqueId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
