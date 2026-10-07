import { LoaderCircle } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-atomic="true"
      className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 font-sans text-white backdrop-blur-md sm:p-6"
    >
      <LoaderCircle
        aria-hidden="true"
        className="h-6 w-6 shrink-0 text-accent-400 motion-safe:animate-spin"
      />
      <p className="min-w-0 break-words text-sm">{message}</p>
    </div>
  );
}
