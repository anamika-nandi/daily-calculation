import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import EggStockForm from '../components/forms/EggStockForm';
import EggStockTable from '../components/tables/EggStockTable';
import { useAllLocationsEggStock, useCreateOrUpdateEggStock } from '../hooks/useEggStock';
// Egg stock only for layer sheds (no chick shed)
const EGG_LOCATIONS = ['L1', 'L2', 'L3', 'L4'];
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

export default function EggStock() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState('table');

  const { data: eggData, isLoading, refetch, isRefetching } = useAllLocationsEggStock(selectedDate);
  const createOrUpdateMutation = useCreateOrUpdateEggStock();

  const handleDateChange = (days) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(format(currentDate, 'yyyy-MM-dd'));
  };

  const handleSubmit = async (formData) => {
    try {
      await createOrUpdateMutation.mutateAsync({
        date: selectedDate,
        ...formData
      });
      refetch();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save data');
    }
  };

  const locationData = eggData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Egg Stock</h2>
          <p className="text-gray-500">Track egg production across all locations</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
          />
          <Button variant="outline" size="icon" onClick={() => handleDateChange(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="table">Summary Table</TabsTrigger>
          <TabsTrigger value="entry">Data Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>
                Egg Stock for {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <EggStockTable data={locationData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entry">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EGG_LOCATIONS.map((location) => {
                const locData = locationData.find(d => d.location === location);
                return (
                  <EggStockForm
                    key={location}
                    location={location}
                    data={locData}
                    onSubmit={handleSubmit}
                    isLoading={createOrUpdateMutation.isPending}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
