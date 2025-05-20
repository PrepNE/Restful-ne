import { User } from "../generated/prisma";
import { JwtPayload } from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IVehicle {
  plateNumber: string;
  manufacturer: string;
  model: string;
  color: string;
}

export interface IParkingLot {
  name: string;
  location: string;
  code?: string;
  capacity: number;
  hourlyRate: number;
}


export type SafeUser = Omit<User, "password" | "role">;
