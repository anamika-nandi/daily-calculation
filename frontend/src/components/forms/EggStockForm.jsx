import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LOCATION_LABELS } from '../../lib/constants';

export default function EggStockForm({ location, data, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    opening: '',
    production: '',
    sell: '',
    notes: ''
  });

  const [closing, setClosing] = useState(0);

  useEffect(() => {
    if (data) {
      setFormData({
        opening: data.opening?.toString() || '0',
        production: data.production?.toString() || '0',
        sell: data.sell?.toString() || '0',
        notes: data.notes || ''
      });
    }
  }, [data]);

  useEffect(() => {
    const opening = parseInt(formData.opening) || 0;
    const production = parseInt(formData.production) || 0;
    const sell = parseInt(formData.sell) || 0;
    const calculatedClosing = opening + production - sell;
    setClosing(calculatedClosing);
  }, [formData.opening, formData.production, formData.sell]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (closing < 0) {
      alert('Closing stock cannot be negative. Please check your values.');
      return;
    }
    onSubmit({
      location,
      opening: parseInt(formData.opening) || 0,
      production: parseInt(formData.production) || 0,
      sell: parseInt(formData.sell) || 0,
      notes: formData.notes,
      closing
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{LOCATION_LABELS[location] || location}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`opening-${location}`}>Opening</Label>
              <Input
                id={`opening-${location}`}
                type="number"
                min="0"
                value={formData.opening}
                onChange={(e) => handleChange('opening', e.target.value)}
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Previous day closing</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`production-${location}`}>Production</Label>
              <Input
                id={`production-${location}`}
                type="number"
                min="0"
                value={formData.production}
                onChange={(e) => handleChange('production', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`sell-${location}`}>Sell</Label>
              <Input
                id={`sell-${location}`}
                type="number"
                min="0"
                value={formData.sell}
                onChange={(e) => handleChange('sell', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`closing-${location}`}>Closing</Label>
              <Input
                id={`closing-${location}`}
                type="number"
                value={closing}
                readOnly
                className={`bg-gray-100 font-bold ${closing < 0 ? 'text-red-500 border-red-500' : 'text-green-600'}`}
              />
              <p className="text-xs text-gray-500">Opening + Production - Sell</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`notes-${location}`}>Notes</Label>
            <Input
              id={`notes-${location}`}
              type="text"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Optional notes..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || closing < 0}>
            {isLoading ? 'Saving...' : data?.hasData ? 'Update' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
