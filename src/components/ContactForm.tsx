"use client";

import { useState, type FormEvent } from "react";

import { useI18n } from "@/i18n/client";
import { apiPost } from "@/lib/api";
import type { ContactPayload } from "@/lib/types";

type FieldName = keyof ContactPayload;
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,19}$/;

const empty: ContactPayload = {
  name: "",
  surname: "",
  telephone: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const { dict, locale, t } = useI18n();
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const set = (field: FieldName) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = dict.validation.name;
    if (values.surname.trim().length < 2) next.surname = dict.validation.surname;
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = dict.validation.email;
    if (!PHONE_PATTERN.test(values.telephone.trim())) next.telephone = dict.validation.phone;
    if (values.subject.trim().length < 2) next.subject = dict.validation.subject;
    if (values.message.trim().length < 10) {
      next.message = t(dict.validation.minChars, { n: 10 });
    }
    return next;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    const { ok } = await apiPost("/contact-create/", values, locale);
    if (ok) {
      setStatus("sent");
      setValues(empty);
    } else {
      setStatus("failed");
    }
  };

  const field = (
    name: FieldName,
    label: string,
    type: "text" | "email" | "tel" = "text",
  ) => (
    <label className="block">
      <span className="text-body mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type={type}
        name={name}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className="field"
        autoComplete={
          name === "email" ? "email" : name === "telephone" ? "tel" : "on"
        }
      />
      {errors[name] && (
        <span id={`${name}-error`} className="text-signal mt-1.5 block text-xs">
          {errors[name]}
        </span>
      )}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
      <h2 className="text-body text-xl font-semibold">{dict.contact.formTitle}</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {field("name", dict.contact.name)}
        {field("surname", dict.contact.surname)}
        {field("email", dict.contact.email, "email")}
        {field("telephone", dict.contact.phone, "tel")}
      </div>

      <div className="mt-5">{field("subject", dict.contact.subject)}</div>

      <label className="mt-5 block">
        <span className="text-body mb-1.5 block text-sm font-medium">
          {dict.contact.message}
        </span>
        <textarea
          name="message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="field resize-y"
        />
        {errors.message && (
          <span id="message-error" className="text-signal mt-1.5 block text-xs">
            {errors.message}
          </span>
        )}
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary">
          {status === "sending" ? dict.contact.submitting : dict.contact.submit}
        </button>
        {status === "sent" && (
          <p role="status" className="text-body text-sm">
            {dict.contact.success}
          </p>
        )}
        {status === "failed" && (
          <p role="alert" className="text-signal text-sm">
            {dict.contact.error}
          </p>
        )}
      </div>
    </form>
  );
}
