



export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
}


export interface IVehicle {
    id: string;
    plateNumber: string;
    manufacturer: string;
    model: string;
    color: string;
}



export interface ParkingLot {
  id: string;
  name: string;
  location: string;
  capacity: number;
  hourlyRate: number;
  currentOccupancy: number;
}