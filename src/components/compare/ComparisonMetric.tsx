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
    <tr className="border-b border-gray-100">
      <td className="whitespace-nowrap bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600">
        {label}
      </td>
      {values.map((value, i) => (
        <td
          key={i}
          className={`px-4 py-2 text-center text-sm ${
            i === bestIndex
              ? "font-bold text-green-600"
              : "text-gray-700"
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}
