import { LOCATION_LABELS } from '../../lib/constants';

export default function BirdStockTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for this date
      </div>
    );
  }

  const totals = data.reduce((acc, item) => ({
    totalBirds: acc.totalBirds + (item.totalBirds || 0),
    mortality: acc.mortality + (item.mortality || 0),
    production: acc.production + (item.production || 0)
  }), { totalBirds: 0, mortality: 0, production: 0 });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Age (weeks)</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Total Birds</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Mortality</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Production</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.location} className={item.hasData === false ? 'bg-gray-50 text-gray-400' : ''}>
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {LOCATION_LABELS[item.location] || item.location}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.age?.toFixed(1)}</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold">{item.totalBirds}</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-red-600">{item.mortality}</td>
              <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{item.production}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-50 font-bold">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td className="border border-gray-300 px-4 py-2 text-right">-</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{totals.totalBirds}</td>
            <td className="border border-gray-300 px-4 py-2 text-right text-red-600">{totals.mortality}</td>
            <td className="border border-gray-300 px-4 py-2 text-right text-green-600">{totals.production}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
