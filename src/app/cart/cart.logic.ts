import { CartLine, Product, SelectedOptions } from '../core/models';

export const MAX_QTY = 10;

/** Stable key: same product + same options → same line; any option difference → new line. */
export function lineKey(productId: string, options: SelectedOptions): string {
  const parts = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`);
  return parts.length ? `${productId}|${parts.join('&')}` : productId;
}

export type OptionError = { optionId: string; message: string };

/** Returns problems that block adding this product with these options. */
export function validateSelection(product: Product, options: SelectedOptions): OptionError[] {
  const errors: OptionError[] = [];
  if (product.availability === 'sold-out') {
    errors.push({ optionId: '*', message: 'This piece is currently sold out.' });
    return errors;
  }
  for (const opt of product.options) {
    const chosen = options[opt.id];
    const value = opt.values.find((v) => v.value === chosen);
    if (!chosen) errors.push({ optionId: opt.id, message: `Select a ${opt.label.toLowerCase()}.` });
    else if (!value) errors.push({ optionId: opt.id, message: `That ${opt.label.toLowerCase()} doesn't exist.` });
    else if (!value.available) errors.push({ optionId: opt.id, message: `${value.label} is unavailable.` });
  }
  const known = new Set(product.options.map((o) => o.id));
  for (const id of Object.keys(options)) {
    if (!known.has(id)) errors.push({ optionId: id, message: 'Unknown option.' });
  }
  return errors;
}

export const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n) || 1));

export function addLine(lines: CartLine[], productId: string, options: SelectedOptions, qty = 1): CartLine[] {
  const key = lineKey(productId, options);
  const existing = lines.find((l) => l.key === key);
  if (existing) {
    return lines.map((l) => (l.key === key ? { ...l, quantity: clampQty(l.quantity + qty) } : l));
  }
  return [...lines, { key, productId, options: { ...options }, quantity: clampQty(qty) }];
}

export function setQuantity(lines: CartLine[], key: string, qty: number): CartLine[] {
  if (qty <= 0) return removeLine(lines, key);
  return lines.map((l) => (l.key === key ? { ...l, quantity: clampQty(qty) } : l));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => l.key !== key);
}

/** Subtotal in minor units. Lines whose product is unknown contribute nothing. */
export function subtotal(lines: CartLine[], priceOf: (productId: string) => number | undefined): number {
  return lines.reduce((sum, l) => sum + (priceOf(l.productId) ?? 0) * l.quantity, 0);
}

export const itemCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);

export function isCartLines(v: unknown): v is CartLine[] {
  return (
    Array.isArray(v) &&
    v.every(
      (l) =>
        l &&
        typeof l.key === 'string' &&
        typeof l.productId === 'string' &&
        typeof l.quantity === 'number' &&
        l.options &&
        typeof l.options === 'object',
    )
  );
}
