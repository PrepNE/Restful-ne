import { IVehicle, ParkingLot } from "@/types";


export const dummyLots: ParkingLot[] = [
  {
    id: "1",
    name: "Kigali Convention Lot",
    location: "KG 5 Ave, Kigali",
    capacity: 100,
    hourlyRate: 500,
    currentOccupancy: 75,
  },
  {
    id: "2",
    name: "Downtown Parking",
    location: "KN 3 Rd, Kigali City Center",
    capacity: 60,
    hourlyRate: 400,
    currentOccupancy: 60,
  },
  {
    id: "3",
    name: "Remera Stadium Lot",
    location: "RN3, Remera",
    capacity: 80,
    hourlyRate: 300,
    currentOccupancy: 20,
  },
];

export const dummyVehicles: IVehicle[] = [
  {
    id: "v1",
    plateNumber: "RAB123A",
    manufacturer: "Toyota",
    model: "Corolla",
    color: "White",
  },
  {
    id: "v2",
    plateNumber: "RAD456B",
    manufacturer: "Honda",
    model: "Civic",
    color: "Black",
  },
  {
    id: "v3",
    plateNumber: "RAC789C",
    manufacturer: "Ford",
    model: "Focus",
    color: "Blue",
  },
  {
    id: "v4",
    plateNumber: "RAE321D",
    manufacturer: "Nissan",
    model: "Altima",
    color: "Red",
  },
  {
    id: "v5",
    plateNumber: "RAF654E",
    manufacturer: "Volkswagen",
    model: "Golf",
    color: "Silver",
  },
];

