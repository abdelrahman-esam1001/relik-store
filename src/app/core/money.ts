import { InjectionToken, Pipe, PipeTransform, inject } from '@angular/core';

export interface StoreCurrency {
  code: string;
  locale: string;
}

/** Single place to configure the demo currency. */
export const STORE_CURRENCY = new InjectionToken<StoreCurrency>('STORE_CURRENCY', {
  factory: () => ({ code: 'USD', locale: 'en-US' }),
});

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(minor: number, currency: StoreCurrency): string {
  const key = `${currency.locale}|${currency.code}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code });
    formatters.set(key, f);
  }
  return f.format(minor / 100);
}

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private readonly currency = inject(STORE_CURRENCY);
  transform(minor: number | null | undefined): string {
    return minor == null ? '' : formatMoney(minor, this.currency);
  }
}
