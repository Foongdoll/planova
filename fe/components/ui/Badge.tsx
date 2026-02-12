'use client';

import { STATUS_COLORS, STATUS_LABELS } from '@/lib/utils/constants';

interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const color = STATUS_COLORS[status] ?? '#E7DDCB';
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium border"
      style={{ backgroundColor: color + '30', borderColor: color }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
