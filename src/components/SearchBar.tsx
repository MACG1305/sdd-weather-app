import { type FormEvent, useId, useRef, useState } from 'react';

export interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [city, setCity] = useState('');
  const [hasError, setHasError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;

    const query = city.trim();
    if (!query) {
      setHasError(true);
      inputRef.current?.focus();
      return;
    }

    setHasError(false);
    onSearch(query);
  }

  return (
    <form
      role="search"
      aria-label="Buscar cidade"
      onSubmit={handleSubmit}
      className="w-full font-sans"
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
        Cidade
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id={inputId}
          name="city"
          type="search"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setHasError(false);
          }}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          placeholder="Buscar cidade"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/40 bg-white/5 px-4 py-3 text-white backdrop-blur-md placeholder:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          className="min-h-11 shrink-0 rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-medium text-white backdrop-blur-md hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buscar
        </button>
      </div>
      {hasError && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-sun">
          Digite uma cidade.
        </p>
      )}
    </form>
  );
}
