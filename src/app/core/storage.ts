import { Injectable } from '@angular/core';

/** localStorage wrapper that never throws (private mode, quota, blocked storage). */
@Injectable({ providedIn: 'root' })
export class SafeStorage {
  read<T>(key: string, fallback: T, guard: (v: unknown) => v is T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return guard(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: state stays in memory for this session */
    }
  }
}
