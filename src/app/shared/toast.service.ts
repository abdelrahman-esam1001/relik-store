import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; link: string };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  readonly current = signal<Toast | null>(null);

  show(message: string, action?: Toast['action']): void {
    clearTimeout(this.timer);
    this.current.set({ id: ++this.seq, message, action });
    this.timer = setTimeout(() => this.current.set(null), 4200);
  }

  dismiss(): void {
    clearTimeout(this.timer);
    this.current.set(null);
  }
}
