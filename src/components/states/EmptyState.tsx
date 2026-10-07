import { MapPinOff } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export default function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Confira a grafia ou adicione a regi\u00e3o ou o pa\u00eds na busca.',
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-atomic="true"
      className="flex min-w-0 items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 font-sans text-white backdrop-blur-md sm:p-6"
    >
      <MapPinOff aria-hidden="true" className="h-6 w-6 shrink-0 text-accent-400" />
      <div className="min-w-0 space-y-2">
        <h2 className="break-words text-lg font-semibold">{title}</h2>
        <p className="break-words text-sm text-white/70">{hint}</p>
      </div>
    </div>
  );
}
