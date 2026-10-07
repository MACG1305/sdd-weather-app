import { CircleAlert, RotateCcw } from 'lucide-react';

export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-4 font-sans text-white backdrop-blur-md sm:p-6">
      <div className="flex min-w-0 items-start gap-3">
        <CircleAlert aria-hidden="true" className="h-6 w-6 shrink-0 text-sun" />
        <p role="alert" className="min-w-0 break-words text-sm">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRetry()}
        className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>Tentar novamente</span>
      </button>
    </div>
  );
}
