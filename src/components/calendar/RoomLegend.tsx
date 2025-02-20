```tsx
import React from 'react';

export const RoomLegend = () => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 rounded bg-green-100 border border-green-500" />
        <span className="text-sm text-gray-600">Disponible</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 rounded bg-red-100 border border-red-500" />
        <span className="text-sm text-gray-600">Ocupada</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 rounded bg-yellow-100 border border-yellow-500" />
        <span className="text-sm text-gray-600">En mantenimiento</span>
      </div>
    </div>
  );
};
```