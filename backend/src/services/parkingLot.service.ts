import { ServiceAPIResponse } from "../types/service-auth-response";
import { IParkingLot } from "../types/types";
import {  generateUniqueParkingCode } from "../utils";
import AppError from "../utils/AppError";
import prisma from "../utils/client";
import { validateParkingLot } from "../types/validator";

export default class ParkingLotService {
    public static createParkingLot = async (
    data: IParkingLot
  ): Promise<ServiceAPIResponse<IParkingLot>> => {
    const parkingLot = validateParkingLot(data);
    const existing = await prisma.parkingLot.findFirst({
      where: {
        name: data.name,
        location: data.location,
      },
    });

    if (existing) {
      throw new AppError("Parking Lot already exists at location ", 400);
    }

    const code = await generateUniqueParkingCode()

    const newParkingLot = await prisma.parkingLot.create({
      data: {...parkingLot , code},
    });

    return {
        success: true,
        message: "Parking Lot created successfully!",
        body: newParkingLot
    }
  };


  public static getAllParkingLots = async(): Promise<ServiceAPIResponse<IParkingLot[]>> => {
     const parkingLots = await prisma.parkingLot.findMany();
     return {
        success: true,
        message: "Parking Lots retrieved successfully",
        body: parkingLots
     }
  }


  public static updateParkingLot = async(id: string, data: Partial<IParkingLot>): Promise<ServiceAPIResponse<IParkingLot>> => {
    const parkingLot = await prisma.parkingLot.findUnique({
        where: {
            id
        }
    })

    if(!parkingLot){
        throw new AppError(`Parking Lot with id: ${id} not found`, 404);
    }


    const updatedLot = await prisma.parkingLot.update({
      where: { id },
      data,
    });

    return {
        success: true,
        message: "Parking Lot updated successfully!",
        body: updatedLot
    }
    
  }
  
  public static deleteParkingLot = async (
    id: string
  ): Promise<ServiceAPIResponse<null>> => {
    await prisma.parkingLot.delete({
      where: { id },
    });

    return {
      body: null,
      message: "Parking lot deleted successfully",
      success: true,
    };
  };

  public static getOccupancy = async (
    parkingLotId: string
  ): Promise<ServiceAPIResponse<{ occupiedSpots: number }>> => {
    const count = await prisma.parkingRecord.count({
      where: {
        parkingLotId,
        checkOutTime: null, 
      },
    
    });

    return {
      body: { occupiedSpots: count },
      message: "Current occupancy retrieved successfully",
      success: true,
    };
  };
}
