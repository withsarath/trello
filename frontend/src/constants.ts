export const LABELS = {
  design: {
    name: 'Design',
    color: 'bg-amber-500/20 text-amber-800 border-amber-500/40',
    dot: 'bg-amber-500',
  },
  backend: {
    name: 'Backend',
    color: 'bg-sky-500/20 text-sky-800 border-sky-500/40',
    dot: 'bg-sky-500',
  },
  urgent: {
    name: 'Urgent',
    color: 'bg-rose-500/20 text-rose-800 border-rose-500/40',
    dot: 'bg-rose-500',
  },
  polish: {
    name: 'Polish',
    color: 'bg-emerald-500/20 text-emerald-800 border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
} as const;

export type LabelId = keyof typeof LABELS;