import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LOCATION_LABELS } from '../../lib/constants';

export default function FeedStockForm({ location, data, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    opening: '',
    received: '',
    used: '',
    notes: ''
  });

  const [closing, setClosing] = useState(0);

  useEffect(() => {
    if (data) {
      setFormData({
        opening: data.opening?.toString() || '0',
        received: data.received?.toString() || '0',
        used: data.used?.toString() || '0',
        notes: data.notes || ''
      });
    }
  }, [data]);

  useEffect(() => {
    const opening = parseInt(formData.opening) || 0;
    const received = parseInt(formData.received) || 0;
    const used = parseInt(formData.used) || 0;
    const calculatedClosing = opening + received - used;
    setClosing(calculatedClosing);
  }, [formData.opening, formData.received, formData.used]);

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
      received: parseInt(formData.received) || 0,
      used: parseInt(formData.used) || 0,
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
              <Label htmlFor={`opening-${location}`}>Opening (kg)</Label>
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
              <Label htmlFor={`received-${location}`}>Received (kg)</Label>
              <Input
                id={`received-${location}`}
                type="number"
                min="0"
                value={formData.received}
                onChange={(e) => handleChange('received', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`used-${location}`}>Used (kg)</Label>
              <Input
                id={`used-${location}`}
                type="number"
                min="0"
                value={formData.used}
                onChange={(e) => handleChange('used', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`closing-${location}`}>Closing (kg)</Label>
              <Input
                id={`closing-${location}`}
                type="number"
                value={closing}
                readOnly
                className={`bg-gray-100 font-bold ${closing < 0 ? 'text-red-500 border-red-500' : 'text-green-600'}`}
              />
              <p className="text-xs text-gray-500">Opening + Received - Used</p>
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
