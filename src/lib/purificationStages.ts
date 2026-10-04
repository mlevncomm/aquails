/** Specification key that holds a product's real purification stages. */
export const STAGES_SPEC_KEY = 'Arıtma Aşamaları';

export interface PurificationStage {
  title: string;
  detail: string;
}

/**
 * Parses stages stored as `"Başlık: açıklama | Başlık: açıklama"`.
 * Returns an empty list when the product has no stage data, so callers can hide the block.
 */
export function parsePurificationStages(specifications: Record<string, string> | null | undefined): PurificationStage[] {
  const raw = specifications?.[STAGES_SPEC_KEY];
  if (!raw) return [];
  return raw
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf(':');
      if (idx === -1) return { title: part, detail: '' };
      return { title: part.slice(0, idx).trim(), detail: part.slice(idx + 1).trim() };
    });
}
