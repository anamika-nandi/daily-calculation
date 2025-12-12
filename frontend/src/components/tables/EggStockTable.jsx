import { LOCATION_LABELS } from '../../lib/constants';

export default function EggStockTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for this date
      </div>
    );
  }

  const totals = data.reduce((acc, item) => ({
    opening: acc.opening + (item.opening || 0),
    production: acc.production + (item.production || 0),
    sell: acc.sell + (item.sell || 0),
    closing: acc.closing + (item.closing || 0)
  }), { opening: 0, production: 0, sell: 0, closing: 0 });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Opening</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Production</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Sell</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Closing</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.location} className={item.hasData === false ? 'bg-gray-50 text-gray-400' : ''}>
              <td className="border border-gray-300 px-4 py-2 font-medium">
                {LOCATION_LABELS[item.location] || item.location}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.opening}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.production}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{item.sell}</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold">{item.closing}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-50 font-bold">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{totals.opening}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{totals.production}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{totals.sell}</td>
            <td className="border border-gray-300 px-4 py-2 text-right">{totals.closing}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
