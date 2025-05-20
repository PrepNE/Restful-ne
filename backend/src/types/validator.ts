import { z } from "zod";
import { strongPasswordSchema } from "./validators/password";

export const userSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["ADMIN", "PARKING_ATTENDANT"]).default("PARKING_ATTENDANT"),
    password: strongPasswordSchema
})

export const validatedUser = (data: any) => {
   const user = userSchema.safeParse(data);
   if(!user.success){
    throw new Error(user.error.errors[0].message);
   }
   return user.data;
}



export const vehicleSchema = z.object({
    plateNumber: z.string().min(2),
    manufacturer: z.string().min(2),
    model: z.string().min(2),
    color: z.string().min(2)
})

export const validatedVehicle = (data: any) => {
    const vehicle = vehicleSchema.safeParse(data);
    if(!vehicle.success){
        throw new Error(vehicle.error.errors[0].message)
    }

    return vehicle.data;
}

export const parkingLotSchema = z.object({
    name: z.string().min(2, "name must have atleast 2 charactes"),
    location: z.string().min(2, 'Location must have atleast 2 characters'),
    code: z.string().optional(),
    capacity: z.number(),
    hourlyRate: z.number()
})

export const validateParkingLot = (data: any) => {
    const parkingLot = parkingLotSchema.safeParse(data);
    if(!parkingLot.success){
        throw new Error(parkingLot.error.errors[0].message);
    }
    return parkingLot.data;
}