import {
  Building2,
  Dices,
  Grid3X3,
  LineChart,
  Map,
  TrendingUp,
  Triangle,
} from "lucide-react";

const ICONS = {
  building: Building2,
  curve: LineChart,
  triangle: Triangle,
  grid: Grid3X3,
  dice: Dices,
  tangent: TrendingUp,
} as const;

export type BarrioIconKey = keyof typeof ICONS;

export function BarrioIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = ICONS[iconKey as BarrioIconKey] ?? Map;
  return <Icon className={className} aria-hidden="true" strokeWidth={2.1} />;
}
