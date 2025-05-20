import { ParkingLot } from "@/types";
import { Card } from "antd";
import { MapPin } from "lucide-react";




const ParkingLotCard = ({
  id,
  name,
  location,
  capacity,
  hourlyRate,
  currentOccupancy,
}: ParkingLot) => {
  const occupancyPercent = (currentOccupancy / capacity) * 100;
  const isFull = currentOccupancy >= capacity;
  return (
    <Card
      key={id}
      title={<div className="text-lg">{name}</div>}
      className="overflow-hidden"
      headStyle={{ backgroundColor: "#f0f5ff", paddingBottom: 8 }}
    >
      <div className="flex items-center mb-4 text-gray-500 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        {location}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm text-gray-500">Capacity</h1>
        <h1 className="text-base font-medium">{capacity} spots</h1>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-sm text-gray-500">Hourly Rate</h1>
        <h1 className="text-base font-medium">{hourlyRate} RWF</h1>
      </div>

       <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Occupancy</span>
        <span className="font-medium">{currentOccupancy} / {capacity}</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${occupancyPercent}%` }}
        />
      </div>
    </Card>
  );
};

export default ParkingLotCard;
