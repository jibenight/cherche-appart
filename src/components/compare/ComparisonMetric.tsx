"use client";

interface ComparisonMetricProps {
  label: string;
  values: (string | number)[];
  bestIndex: number | null;
}

/** Single row in comparison table with best-value highlighting */
export function ComparisonMetric({
  label,
  values,
  bestIndex,
}: ComparisonMetricProps) {
  return (
    <tr className="border-b border-slate-50 last:border-0">
      <td className="whitespace-nowrap bg-slate-50/80 px-5 py-3 text-xs font-semibold text-slate-500">
        {label}
      </td>
      {values.map((value, i) => (
        <td
          key={i}
          className={`px-5 py-3 text-center text-sm ${
            i === bestIndex
              ? "font-bold text-emerald-600"
              : "text-slate-700"
          }`}
        >
          {i === bestIndex && (
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
          {value}
        </td>
      ))}
    </tr>
  );
}
