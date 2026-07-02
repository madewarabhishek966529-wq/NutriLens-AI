interface RingDatum {
  label: string;
  value: number;
  target: number;
  color: string;
}

function Ring({ radius, stroke, value, target, color, offset }: {
  radius: number;
  stroke: number;
  value: number;
  target: number;
  color: string;
  offset: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  const dash = circumference * pct;

  return (
    <>
      <circle
        cx={110}
        cy={110}
        r={radius}
        stroke={color}
        strokeOpacity={0.15}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={110}
        cy={110}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(-90 110 110)`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
        strokeDashoffset={0}
        opacity={1}
      />
    </>
  );
}

export default function MacroRing({
  calories,
  caloriesTarget,
  rings,
}: {
  calories: number;
  caloriesTarget: number;
  rings: RingDatum[];
}) {
  const radii = [95, 76, 57];

  return (
    <div className="flex items-center gap-6">
      <svg width={220} height={220} viewBox="0 0 220 220">
        {rings.map((r, i) => (
          <Ring key={r.label} radius={radii[i]} stroke={12} value={r.value} target={r.target} color={r.color} offset={0} />
        ))}
        <text x="110" y="104" textAnchor="middle" className="fill-ink-900 dark:fill-white" fontFamily="Fraunces" fontSize="34" fontWeight="600">
          {Math.round(calories)}
        </text>
        <text x="110" y="128" textAnchor="middle" className="fill-ink-500 dark:fill-pine-100/60" fontFamily="IBM Plex Mono" fontSize="12">
          / {Math.round(caloriesTarget) || 0} kcal
        </text>
      </svg>
      <div className="flex flex-col gap-3">
        {rings.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
            <span className="text-sm text-ink-700 dark:text-pine-100/80">
              {r.label} <span className="font-mono text-ink-500">{Math.round(r.value)}/{Math.round(r.target)}g</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
