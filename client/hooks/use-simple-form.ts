import { useState, type FormEvent } from "react";

export type Validator = (value: string) => string | undefined;
export type Errors<K extends string> = Partial<Record<K, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const required =
  (label: string): Validator =>
  (v) =>
    v.trim() ? undefined : `Please enter your ${label}.`;

export const email: Validator = (v) =>
  !v.trim()
    ? "Please enter your email address."
    : EMAIL_RE.test(v.trim())
      ? undefined
      : "That email address doesn’t look right. Check for typos.";

export const minLength =
  (n: number, label: string): Validator =>
  (v) =>
    v.trim().length >= n
      ? undefined
      : `Your ${label} should be at least ${n} characters.`;

/** Runs each field's validators and returns the first error per field. */
export function validate<K extends string>(
  values: Record<K, string>,
  rules: Record<K, Validator[]>,
): Errors<K> {
  const errors: Errors<K> = {};
  for (const key of Object.keys(rules) as K[]) {
    for (const rule of rules[key]) {
      const msg = rule(values[key] ?? "");
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  }
  return errors;
}

/**
 * Minimal form helper: validates on submit, then re-validates a field as the
 * user edits it, and focuses the first invalid field.
 */
export function useSimpleForm<K extends string>(
  rules: Record<K, Validator[]>,
  onValid: (values: Record<K, string>, form: HTMLFormElement) => void,
) {
  const [errors, setErrors] = useState<Errors<K>>({});
  const [submitted, setSubmitted] = useState(false);

  const read = (form: HTMLFormElement) => {
    const fd = new FormData(form);
    return Object.fromEntries(
      (Object.keys(rules) as K[]).map((k) => [k, String(fd.get(k) ?? "")]),
    ) as Record<K, string>;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = read(form);
    const next = validate(values, rules);
    setErrors(next);
    setSubmitted(true);
    const first = Object.keys(next)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    onValid(values, form);
  };

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    if (!submitted) return;
    setErrors(validate(read(e.currentTarget), rules));
  };

  /** Props to spread on an input for accessible error wiring. */
  const field = (name: K) => ({
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return { errors, onSubmit, onChange, field, setErrors };
}
