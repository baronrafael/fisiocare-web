import { Injectable, signal } from '@angular/core';
import { SessionTemplate } from '../../core/models/template.model';
import { MOCK_TEMPLATES } from '../data/templates.mock';

@Injectable({ providedIn: 'root' })
export class TemplatesRepository {
  private readonly templatesSignal = signal<SessionTemplate[]>(MOCK_TEMPLATES);

  readonly templates = this.templatesSignal.asReadonly();

  findById(templateId: string): SessionTemplate | undefined {
    return this.templatesSignal().find((item) => item.id === templateId);
  }

  create(payload: Omit<SessionTemplate, 'id'>): string {
    const id = this.nextId();
    this.templatesSignal.update((items) => [{ id, ...payload }, ...items]);
    return id;
  }

  update(templateId: string, payload: Omit<SessionTemplate, 'id'>): void {
    this.templatesSignal.update((items) =>
      items.map((item) => (item.id === templateId ? { id: templateId, ...payload } : item))
    );
  }

  remove(templateId: string): void {
    this.templatesSignal.update((items) => items.filter((item) => item.id !== templateId));
  }

  private nextId(): string {
    const total = this.templatesSignal().length + 1;
    return `t-${String(total).padStart(3, '0')}`;
  }
}
