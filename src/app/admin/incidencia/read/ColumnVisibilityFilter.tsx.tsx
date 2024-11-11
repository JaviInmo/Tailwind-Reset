import React from "react";

interface Column {
  label: string;
  key: string;
}

interface ColumnVisibilityFilterProps {
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  toggleColumnVisibility: (key: string) => void;
}

export default function ColumnVisibilityFilter({
  columns,
  visibleColumns,
  toggleColumnVisibility,
}: ColumnVisibilityFilterProps) {
  return (
    <div className="absolute left-0 z-10 mt-2 bg-white shadow-lg rounded-lg p-4 w-52 transition-transform duration-600 transform origin-top scale-y-100">
      <h4 className="mb-2 text-sm font-semibold">Seleccionar columnas</h4>
      <ul className="space-y-1">
        {columns.map(({ label, key }) => (
          <li key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={visibleColumns[key]}
              onChange={() => toggleColumnVisibility(key)}
              className="cursor-pointer"
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
