import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Egg, Wheat, Bird, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useDashboardSummary, useLocationSummary } from '../hooks/useReports';
import { LOCATION_LABELS } from '../lib/constants';

export default function Dashboard() {
  const [selectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: summaryData, isLoading, refetch, isRefetching } = useDashboardSummary();
  const { data: locationData, isLoading: isLoadingLocations } = useLocationSummary(selectedDate);

  const summary = summaryData?.data || {
    eggs: { production: 0, closing: 0 },
    feed: { closing: 0 },
    birds: { total: 0, mortality: 0, production: 0 }
  };

  const cards = [
    {
      title: "Today's Egg Production",
      value: summary.eggs.production,
      subtitle: `Stock: ${summary.eggs.closing}`,
      icon: Egg,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Feed Stock',
      value: `${summary.feed.closing} kg`,
      subtitle: 'Current closing',
      icon: Wheat,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Birds',
      value: summary.birds.total,
      subtitle: `Production: ${summary.birds.production}`,
      icon: Bird,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: "Today's Mortality",
      value: summary.birds.mortality,
      subtitle: 'Across all locations',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const locations = locationData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">Overview of your farm operations - {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Overview</CardTitle>
            <CardDescription>Stock status across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLocations ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {locations.map((loc) => (
                  <div key={loc.location} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {LOCATION_LABELS[loc.location] || loc.location}
                      </span>
                      {loc.birds.hasData || loc.eggs.hasData || loc.feed.hasData ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Data entered</span>
                      ) : (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">No data</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Birds: </span>
                        <span className="font-medium">{loc.birds.totalBirds}</span>
                      </div>
                      {loc.location !== 'C' && (
                        <div>
                          <span className="text-gray-500">Eggs: </span>
                          <span className="font-medium">{loc.eggs.production}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Feed: </span>
                        <span className="font-medium">{loc.feed.closing} kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Entry</CardTitle>
            <CardDescription>Add today's data quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/eggs" className="block p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Egg className="h-5 w-5 text-orange-600" />
                  <div>
                    <span className="font-medium text-orange-900">Enter Egg Stock</span>
                    <p className="text-xs text-orange-700">Track production and sales</p>
                  </div>
                </div>
              </a>
              <a href="/feed" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Wheat className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-medium text-green-900">Enter Feed Stock</span>
                    <p className="text-xs text-green-700">Track received and used</p>
                  </div>
                </div>
              </a>
              <a href="/birds" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Bird className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-blue-900">Enter Birds Stock</span>
                    <p className="text-xs text-blue-700">Track mortality and totals</p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
