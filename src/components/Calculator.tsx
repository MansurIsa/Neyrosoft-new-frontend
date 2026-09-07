"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { useI18n } from "@/i18n/client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  TOTAL_STEPS,
  fetchEstimate,
  loadConfig,
  nextStep,
  previousStep,
  resetCalculator,
  selectProjectType,
  setDesignLevel,
  setLanguageCount,
  setPageCount,
  setTimeline,
  submitPriceRequest,
  toggleFeature,
} from "@/store/slices/calculatorSlice";

import { IconCheck, ProjectTypeIcon } from "./Icons";

/* -------------------------------------------------------------------------
   Small building blocks
------------------------------------------------------------------------- */

function OptionButton({
  selected,
  onClick,
  title,
  description,
  meta,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  meta?: string;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-signal bg-signal-soft shadow-card"
          : "border-line bg-surface hover:border-line-strong hover:shadow-card"
      }`}
    >
      {icon !== undefined && (
        <span
          className={`icon-plate h-11 w-11 ${selected ? "" : "icon-plate-ink"}`}
        >
          <ProjectTypeIcon name={icon} width={22} height={22} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="text-body block font-semibold">{title}</span>
        {description && (
          <span className="text-muted mt-1 block text-sm leading-relaxed">
            {description}
          </span>
        )}
      </span>
      {meta && (
        <span className="text-body shrink-0 text-sm font-semibold tabular-nums">
          {meta}
        </span>
      )}
    </button>
  );
}

function CheckOption({
  checked,
  onChange,
  title,
  description,
  meta,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description?: string;
  meta?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 ${
        checked
          ? "border-signal bg-signal-soft shadow-card"
          : "border-line bg-surface hover:border-line-strong hover:shadow-card"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked ? "border-signal bg-signal text-white" : "border-line-strong"
        }`}
      >
        {checked && <IconCheck width={13} height={13} strokeWidth={2.5} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-body block font-semibold">{title}</span>
        {description && (
          <span className="text-muted mt-1 block text-sm">{description}</span>
        )}
      </span>
      {meta && (
        <span className="text-signal shrink-0 text-sm font-semibold tabular-nums">
          {meta}
        </span>
      )}
    </label>
  );
}

function NumberStepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <label className="text-body font-semibold" htmlFor={`n-${label}`}>
          {label}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(value - 1)}
            disabled={value <= min}
            aria-label="−"
            className="bg-surface-2 text-body hover:bg-line h-9 w-9 rounded-full text-lg transition-colors disabled:opacity-40"
          >
            −
          </button>
          <input
            id={`n-${label}`}
            type="number"
            inputMode="numeric"
            value={value}
            min={min}
            max={max}
            onChange={(event) => onChange(Number(event.target.value) || min)}
            className="text-body h-9 w-14 border-none bg-transparent text-center font-semibold tabular-nums"
          />
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            disabled={value >= max}
            aria-label="+"
            className="bg-surface-2 text-body hover:bg-line h-9 w-9 rounded-full text-lg transition-colors disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
      <p className="text-muted mt-2 text-sm">{hint}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------
   The estimate panel — sticky on desktop so the number is always in view
------------------------------------------------------------------------- */

function EstimatePanel() {
  const { dict } = useI18n();
  const { estimate, estimateStatus, config } = useAppSelector((state) => state.calculator);
  const currency = estimate?.currency ?? config?.currency ?? "AZN";

  return (
    <aside className="card h-fit p-6 lg:sticky lg:top-28">
      <p className="text-muted text-sm">{dict.calculator.estimate}</p>

      <p
        className="text-body font-display mt-2 text-3xl leading-none font-semibold tabular-nums sm:text-4xl"
        aria-live="polite"
      >
        {estimate ? (
          <>
            {Number(estimate.price_min).toLocaleString()}–
            {Number(estimate.price_max).toLocaleString()}{" "}
            <span className="text-muted text-xl font-normal">{currency}</span>
          </>
        ) : (
          <span className="text-muted text-xl font-normal">
            {estimateStatus === "loading" ? dict.calculator.recalculating : "—"}
          </span>
        )}
      </p>

      {estimate && (
        <>
          <p className="border-line text-muted mt-5 border-t pt-5 text-sm">
            {dict.calculator.duration}
          </p>
          <p className="text-body mt-1 text-lg font-medium tabular-nums">
            ≈ {estimate.duration_days} {dict.calculator.days}
          </p>

          <div className="border-line mt-5 border-t pt-5">
            <p className="text-muted mb-3 text-sm">{dict.calculator.breakdown}</p>
            <ul className="space-y-2">
              {estimate.breakdown.map((line, index) => (
                <li
                  key={`${line.label}-${index}`}
                  className="flex items-baseline justify-between gap-4 text-sm"
                >
                  <span className="text-muted min-w-0 flex-1 truncate">{line.label}</span>
                  <span className="text-body shrink-0 tabular-nums">
                    {Number(line.amount) > 0 ? "+" : ""}
                    {Number(line.amount).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {estimateStatus === "failed" && (
        <p className="text-signal mt-4 text-sm">{dict.common.loadError}</p>
      )}
    </aside>
  );
}

/* -------------------------------------------------------------------------
   Contact step, shown once the visitor has an estimate they like
------------------------------------------------------------------------- */

function RequestForm() {
  const { dict, locale } = useI18n();
  const dispatch = useAppDispatch();
  const submitStatus = useAppSelector((state) => state.calculator.submitStatus);

  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone: "",
    company: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (form.name.trim().length < 2) found.name = dict.validation.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      found.email = dict.validation.email;
    }
    if (!/^[+\d][\d\s()-]{7,19}$/.test(form.telephone.trim())) {
      found.telephone = dict.validation.phone;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    void dispatch(submitPriceRequest({ locale, contact: form }));
  };

  if (submitStatus === "sent") {
    return (
      <div className="card p-6 sm:p-8">
        <span className="icon-plate mb-4">
          <IconCheck width={22} height={22} strokeWidth={2} />
        </span>
        <h3 className="text-body text-xl">{dict.calculator.successTitle}</h3>
        <p className="text-muted mt-2.5 max-w-md leading-relaxed">
          {dict.calculator.successLead}
        </p>
        <button
          type="button"
          onClick={() => dispatch(resetCalculator())}
          className="btn btn-outline mt-6"
        >
          {dict.calculator.startOver}
        </button>
      </div>
    );
  }

  const input = (
    name: keyof typeof form,
    label: string,
    type = "text",
    optional = false,
  ) => (
    <label className="block">
      <span className="text-body mb-1.5 block text-sm font-medium">
        {label}
        {optional && (
          <span className="text-muted font-normal"> ({dict.calculator.optional})</span>
        )}
      </span>
      <input
        type={type}
        value={form[name]}
        onChange={(event) => {
          setForm((current) => ({ ...current, [name]: event.target.value }));
          setErrors((current) => ({ ...current, [name]: "" }));
        }}
        aria-invalid={errors[name] ? "true" : undefined}
        className="field"
      />
      {errors[name] && <span className="text-signal mt-1.5 block text-xs">{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
      <h3 className="text-body text-xl">{dict.calculator.requestTitle}</h3>
      <p className="text-muted mt-2 max-w-md text-sm leading-relaxed">
        {dict.calculator.requestLead}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {input("name", dict.contact.name)}
        {input("telephone", dict.contact.phone, "tel")}
        {input("email", dict.contact.email, "email")}
        {input("company", dict.calculator.company, "text", true)}
      </div>

      <label className="mt-5 block">
        <span className="text-body mb-1.5 block text-sm font-medium">
          {dict.calculator.note}
          <span className="text-muted font-normal"> ({dict.calculator.optional})</span>
        </span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
          placeholder={dict.calculator.notePlaceholder}
          className="field resize-y"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitStatus === "sending"}
          className="btn btn-primary"
        >
          {submitStatus === "sending" ? dict.calculator.sending : dict.calculator.send}
        </button>
        {submitStatus === "failed" && (
          <p role="alert" className="text-signal text-sm">
            {dict.calculator.error}
          </p>
        )}
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------
   The calculator itself
------------------------------------------------------------------------- */

export default function Calculator() {
  const { dict, locale, t } = useI18n();
  const dispatch = useAppDispatch();
  const { config, configStatus, selection, step } = useAppSelector(
    (state) => state.calculator,
  );
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (configStatus === "idle") void dispatch(loadConfig(locale));
  }, [configStatus, locale, dispatch]);

  // Re-price on every change, debounced so dragging the page count doesn't
  // fire a request per keystroke.
  useEffect(() => {
    if (selection.projectType === null) return;
    const timer = window.setTimeout(() => {
      void dispatch(fetchEstimate(locale));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [selection, locale, dispatch]);

  const currency = config?.currency ?? "AZN";

  const availableFeatures = useMemo(
    () =>
      (config?.features ?? []).filter(
        (feature) =>
          selection.projectType !== null &&
          feature.project_types.includes(selection.projectType),
      ),
    [config, selection.projectType],
  );

  const move = (direction: "next" | "back") => {
    dispatch(direction === "next" ? nextStep() : previousStep());
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (configStatus === "loading" || configStatus === "idle") {
    return (
      <div className="card p-8" aria-busy="true">
        <div className="bg-surface-2 h-5 w-40 animate-pulse rounded-full" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="bg-surface-2 h-16 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (configStatus === "failed" || !config) {
    return (
      <div className="card p-8">
        <p className="text-body">{dict.common.loadError}</p>
        <button
          type="button"
          onClick={() => dispatch(loadConfig(locale))}
          className="btn btn-outline mt-4"
        >
          {dict.common.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <div ref={stepRef} className="scroll-mt-24">
        {/* Steps are a real sequence, so numbering them carries information. */}
        <ol className="mb-7 flex gap-1.5" aria-label={t(dict.calculator.step, { current: step, total: TOTAL_STEPS })}>
          {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((index) => (
            <li
              key={index}
              aria-current={index === step ? "step" : undefined}
              className={`h-1.5 flex-1 rounded-full transition-colors ${index <= step ? "bg-signal" : "bg-line"}`}
            />
          ))}
        </ol>
        <p className="text-muted mb-5 text-sm tabular-nums">
          {t(dict.calculator.step, { current: step, total: TOTAL_STEPS })}
        </p>

        {step === 1 && (
          <section>
            <h2 className="text-body text-2xl">{dict.calculator.stepTypeTitle}</h2>
            <div className="mt-6 space-y-3">
              {config.project_types.map((type) => (
                <OptionButton
                  key={type.id}
                  selected={selection.projectType === type.id}
                  onClick={() => dispatch(selectProjectType(type.id))}
                  title={type.title}
                  description={type.description}
                  icon={type.icon}
                  meta={`${Number(type.base_price).toLocaleString()} ${currency}+`}
                />
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-body text-2xl">{dict.calculator.stepScopeTitle}</h2>
            <div className="mt-6 space-y-3">
              <NumberStepper
                label={dict.calculator.pages}
                hint={dict.calculator.pagesHint}
                value={selection.pageCount}
                min={1}
                max={60}
                onChange={(next) => dispatch(setPageCount(next))}
              />
              <NumberStepper
                label={dict.calculator.languages}
                hint={dict.calculator.languagesHint}
                value={selection.languageCount}
                min={1}
                max={6}
                onChange={(next) => dispatch(setLanguageCount(next))}
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-body text-2xl">{dict.calculator.stepFeaturesTitle}</h2>
            <div className="mt-6 space-y-3">
              {availableFeatures.map((feature) => (
                <CheckOption
                  key={feature.id}
                  checked={selection.features.includes(feature.id)}
                  onChange={() => dispatch(toggleFeature(feature.id))}
                  title={feature.title}
                  description={feature.description || undefined}
                  meta={`+${Number(feature.price).toLocaleString()} ${currency}`}
                />
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-8">
            <div>
              <h2 className="text-body text-2xl">{dict.calculator.stepDeliveryTitle}</h2>
              <h3 className="text-muted mt-6 mb-3 text-sm font-medium">
                {dict.calculator.designTitle}
              </h3>
              <div className="space-y-3">
                {config.design_levels.map((level) => (
                  <OptionButton
                    key={level.id}
                    selected={selection.designLevel === level.id}
                    onClick={() => dispatch(setDesignLevel(level.id))}
                    title={level.title}
                    description={level.description}
                    meta={`×${Number(level.price_multiplier)}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-muted mb-3 text-sm font-medium">
                {dict.calculator.timelineTitle}
              </h3>
              <div className="space-y-3">
                {config.timelines.map((option) => (
                  <OptionButton
                    key={option.id}
                    selected={selection.timeline === option.id}
                    onClick={() => dispatch(setTimeline(option.id))}
                    title={option.title}
                    description={option.description}
                    meta={`×${Number(option.price_multiplier)}`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 flex items-center gap-3">
          {step > 1 && (
            <button type="button" onClick={() => move("back")} className="btn btn-outline">
              {dict.calculator.back}
            </button>
          )}
          {step < TOTAL_STEPS && (
            <button
              type="button"
              onClick={() => move("next")}
              disabled={selection.projectType === null}
              className="btn btn-primary"
            >
              {dict.calculator.next}
            </button>
          )}
        </div>

        {step === TOTAL_STEPS && (
          <div className="mt-10">
            <RequestForm />
          </div>
        )}
      </div>

      <EstimatePanel />
    </div>
  );
}
