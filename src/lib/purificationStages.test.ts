import { describe, expect, it } from 'vitest';
import { parsePurificationStages, STAGES_SPEC_KEY } from '@/lib/purificationStages';

describe('parsePurificationStages', () => {
  it('returns empty when the product has no stage data', () => {
    expect(parsePurificationStages({ Marka: 'Aquails' })).toEqual([]);
    expect(parsePurificationStages(undefined)).toEqual([]);
  });

  it('splits stages and their details', () => {
    const stages = parsePurificationStages({
      [STAGES_SPEC_KEY]: 'PP Sediment: Tortu ve pası tutar | GAC Karbon: Kloru azaltır |  80 GPD Membran ',
    });
    expect(stages).toEqual([
      { title: 'PP Sediment', detail: 'Tortu ve pası tutar' },
      { title: 'GAC Karbon', detail: 'Kloru azaltır' },
      { title: '80 GPD Membran', detail: '' },
    ]);
  });
});
