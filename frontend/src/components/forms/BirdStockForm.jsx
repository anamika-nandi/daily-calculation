import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LOCATION_LABELS } from '../../lib/constants';

export default function BirdStockForm({ location, data, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    age: '',
    totalBirds: '',
    mortality: '',
    production: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        age: data.age?.toString() || '0',
        totalBirds: data.totalBirds?.toString() || '0',
        mortality: data.mortality?.toString() || '0',
        production: data.production?.toString() || '0'
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      location,
      age: parseFloat(formData.age) || 0,
      totalBirds: parseInt(formData.totalBirds) || 0,
      mortality: parseInt(formData.mortality) || 0,
      production: parseInt(formData.production) || 0
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
              <Label htmlFor={`age-${location}`}>Age (weeks)</Label>
              <Input
                id={`age-${location}`}
                type="number"
                min="0"
                step="0.1"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`totalBirds-${location}`}>Total Birds</Label>
              <Input
                id={`totalBirds-${location}`}
                type="number"
                min="0"
                value={formData.totalBirds}
                onChange={(e) => handleChange('totalBirds', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`mortality-${location}`}>Mortality</Label>
              <Input
                id={`mortality-${location}`}
                type="number"
                min="0"
                value={formData.mortality}
                onChange={(e) => handleChange('mortality', e.target.value)}
              />
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : data?.hasData ? 'Update' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
