"use client";

import {formatNL} from "./toolsEngine";

type SelectOption = {
  id: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
};

/** Dropdown die zijn opties automatisch uit een config-array rendert. */
export function SelectField({id, label, value, onChange, options, placeholder}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-brand-ink" htmlFor={id}>
        {label}
      </label>
      <select
        className="mt-2 h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-base text-brand-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {placeholder ? (
          <option disabled value="">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type SliderFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  eenheid?: string;
};

/** Slider met de huidige waarde groot zichtbaar, prettig te bedienen met een duim op mobiel. */
export function SliderField({id, label, value, onChange, min, max, step = 1, eenheid = ""}: SliderFieldProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-bold text-brand-ink" htmlFor={id}>
          {label}
        </label>
        <span className="text-lg font-extrabold text-brand-orange">
          {formatNL(value, step < 1 ? 1 : 0)}
          {eenheid}
        </span>
      </div>
      <input
        className="mt-3 h-3 w-full cursor-pointer appearance-none rounded-full bg-brand-soft accent-brand-orange"
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <div className="mt-1 flex justify-between text-xs font-semibold text-neutral-500">
        <span>
          {formatNL(min)}
          {eenheid}
        </span>
        <span>
          {formatNL(max)}
          {eenheid}
        </span>
      </div>
    </div>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  step?: number;
  placeholder?: string;
};

/** Vrij invoerveld voor een getal (bijvoorbeeld m2), met decimalen toegestaan. */
export function NumberField({id, label, value, onChange, min = 0, step = 0.1, placeholder}: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-brand-ink" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-2 h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-base text-brand-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
        id={id}
        inputMode="decimal"
        min={min}
        onChange={(event) => {
          const raw = event.target.value;
          onChange(raw === "" ? undefined : Number(raw.replace(",", ".")));
        }}
        placeholder={placeholder}
        step={step}
        type="number"
        value={value ?? ""}
      />
    </div>
  );
}

type CheckboxOption = {
  id: string;
  label: string;
};

type CheckboxGroupProps = {
  legend: string;
  options: CheckboxOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
};

/** Groep aanvinkbare extra opties, automatisch gerenderd uit een config-array. */
export function CheckboxGroup({legend, options, selectedIds, onChange}: CheckboxGroupProps) {
  if (!options.length) return null;

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selected) => selected !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-bold text-brand-ink">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <label
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                checked
                  ? "border-brand-orange bg-brand-orange/10 text-brand-ink"
                  : "border-black/15 bg-white text-neutral-700 hover:border-brand-orange/50"
              }`}
              key={option.id}
            >
              <input
                checked={checked}
                className="h-5 w-5 shrink-0 accent-brand-orange"
                onChange={() => toggle(option.id)}
                type="checkbox"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
};

/** Vrij tekst- of datumveld. */
export function TextField({id, label, value, onChange, placeholder, type = "text"}: TextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-brand-ink" htmlFor={id}>
        {label}
      </label>
      <input
        className="mt-2 h-12 w-full rounded-lg border border-black/15 bg-white px-4 text-base text-brand-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export function TextAreaField({id, label, value, onChange, placeholder, rows = 3}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-brand-ink" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base text-brand-ink focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </div>
  );
}

type ToggleFieldProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  jaLabel?: string;
  neeLabel?: string;
};

/** Ja/nee knoppenpaar, gebruikt voor booleans buiten een wizard-stap om. */
export function ToggleField({label, value, onChange, jaLabel = "Ja", neeLabel = "Nee"}: ToggleFieldProps) {
  return (
    <div>
      <p className="text-sm font-bold text-brand-ink">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <button
          className={`min-h-12 rounded-lg border px-4 text-sm font-bold transition ${
            value ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"
          }`}
          onClick={() => onChange(true)}
          type="button"
        >
          {jaLabel}
        </button>
        <button
          className={`min-h-12 rounded-lg border px-4 text-sm font-bold transition ${
            !value ? "border-brand-orange bg-brand-orange text-white" : "border-black/15 bg-white text-brand-ink"
          }`}
          onClick={() => onChange(false)}
          type="button"
        >
          {neeLabel}
        </button>
      </div>
    </div>
  );
}

type SingleCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function SingleCheckbox({id, label, checked, onChange}: SingleCheckboxProps) {
  return (
    <label
      className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-brand-ink"
      htmlFor={id}
    >
      <input
        checked={checked}
        className="h-5 w-5 shrink-0 accent-brand-orange"
        id={id}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
}

type ButtonGroupProps = {
  legend?: string;
  options: {id: string; label: string}[];
  value: string;
  onChange: (id: string) => void;
};

/** Rij grote keuzeknoppen, gebruikt in de vergunning-wizard voor duimvriendelijke bediening. */
export function ButtonGroup({legend, options, value, onChange}: ButtonGroupProps) {
  return (
    <fieldset>
      {legend ? <legend className="sr-only">{legend}</legend> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            className={`min-h-14 rounded-lg border px-5 py-3 text-left text-base font-bold transition ${
              value === option.id
                ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-orange-500/20"
                : "border-black/15 bg-white text-brand-ink hover:border-brand-orange/60"
            }`}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
