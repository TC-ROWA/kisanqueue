export default function DataTable({ columns, rows, keyField = 'id' }) {
  if (!rows?.length) return null;
  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-charcoal/50 border-b border-cream-300">
            {columns.map((c) => (
              <th key={c.key} className="py-2.5 pr-4 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[keyField] || i} className="border-b border-cream-100 last:border-0">
              {columns.map((c) => (
                <td key={c.key} className="py-3 pr-4">{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
