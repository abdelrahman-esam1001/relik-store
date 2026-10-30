import { Product } from '../core/models';
import { MAX_QTY, addLine, itemCount, lineKey, removeLine, setQuantity, subtotal, validateSelection } from './cart.logic';

const ring: Product = {
  id: 'r1', slug: 'r1', name: 'Ring', category: 'rings', description: '', details: [],
  price: 14500, currency: 'USD', images: [], availability: 'in-stock', featured: null,
  options: [{ id: 'size', label: 'Ring size', values: [
    { value: '7', label: '7', available: true },
    { value: '8', label: '8', available: true },
    { value: '11', label: '11', available: false },
  ] }],
};
const pendant: Product = { ...ring, id: 'p1', slug: 'p1', price: 12550, options: [] };
const prices: Record<string, number> = { r1: ring.price, p1: pendant.price };
const priceOf = (id: string) => prices[id];

describe('cart logic', () => {
  describe('variants', () => {
    it('keys lines by product and options, independent of option order', () => {
      expect(lineKey('r1', { size: '7', finish: 'a' })).toBe(lineKey('r1', { finish: 'a', size: '7' }));
      expect(lineKey('r1', { size: '7' })).not.toBe(lineKey('r1', { size: '8' }));
      expect(lineKey('p1', {})).toBe('p1');
    });

    it('treats different options as separate lines and merges identical ones', () => {
      let lines = addLine([], 'r1', { size: '7' });
      lines = addLine(lines, 'r1', { size: '8' });
      lines = addLine(lines, 'r1', { size: '7' }, 2);
      expect(lines.length).toBe(2);
      expect(lines.find((l) => l.options['size'] === '7')!.quantity).toBe(3);
      expect(lines.find((l) => l.options['size'] === '8')!.quantity).toBe(1);
    });
  });

  describe('validation', () => {
    it('requires every option', () => {
      expect(validateSelection(ring, {}).map((e) => e.optionId)).toEqual(['size']);
    });
    it('rejects unavailable and unknown values', () => {
      expect(validateSelection(ring, { size: '11' })[0].message).toContain('unavailable');
      expect(validateSelection(ring, { size: '99' }).length).toBe(1);
      expect(validateSelection(ring, { size: '7', color: 'x' }).length).toBe(1);
    });
    it('accepts a complete valid selection and option-less products', () => {
      expect(validateSelection(ring, { size: '8' })).toEqual([]);
      expect(validateSelection(pendant, {})).toEqual([]);
    });
    it('blocks sold-out products', () => {
      expect(validateSelection({ ...pendant, availability: 'sold-out' }, {}).length).toBe(1);
    });
  });

  describe('quantities', () => {
    it('clamps to the max and removes at zero', () => {
      let lines = addLine([], 'p1', {}, MAX_QTY + 5);
      expect(lines[0].quantity).toBe(MAX_QTY);
      lines = setQuantity(lines, 'p1', 3);
      expect(lines[0].quantity).toBe(3);
      expect(setQuantity(lines, 'p1', 0)).toEqual([]);
    });
    it('removes only the targeted line', () => {
      const lines = addLine(addLine([], 'r1', { size: '7' }), 'r1', { size: '8' });
      const left = removeLine(lines, lineKey('r1', { size: '7' }));
      expect(left.map((l) => l.options['size'])).toEqual(['8']);
    });
  });

  describe('totals', () => {
    it('computes subtotal in minor units without float drift', () => {
      let lines = addLine([], 'r1', { size: '7' }, 2); // 2 × 145.00
      lines = addLine(lines, 'p1', {}, 3); // 3 × 125.50
      expect(subtotal(lines, priceOf)).toBe(2 * 14500 + 3 * 12550);
      expect(itemCount(lines)).toBe(5);
    });
    it('ignores lines whose product is unknown', () => {
      const lines = addLine([], 'ghost', {}, 2);
      expect(subtotal(lines, priceOf)).toBe(0);
    });
  });
});
