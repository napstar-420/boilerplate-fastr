import { builder } from '../builder';

export class FieldError extends Error {
  field: string | null = null;

  constructor(field: string, message?: string) {
    super(message ?? field);

    if (field && message) {
      this.field = field;
    }
  }
}

builder.objectType(FieldError, {
  name: 'FieldError',
  fields: t => ({
    field: t.exposeString('field', { nullable: true }),
    message: t.exposeString('message'),
  }),
});
