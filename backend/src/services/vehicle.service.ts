import { Vehicle } from "../generated/prisma";
import { ServiceAPIResponse } from "../types/service-auth-response";
import { IVehicle } from "../types/types";
import AppError from "../utils/AppError";
import prisma from "../utils/client";
import { validatedVehicle } from "../types/validator";



export class VehicleService{

   public static registerVehicle = async (
    data: IVehicle,
    userId: string
  ): Promise<ServiceAPIResponse<IVehicle>> => {
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        plateNumber: data.plateNumber,
      },
    });

    if (existingVehicle) {
      throw new AppError("Vehicle with that plate number already exists", 400);
    }

    const validateVehicle = validatedVehicle(data);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...validateVehicle,
        userId,
      },
    });

    return {
      body: vehicle,
      message: "Vehicle registered successfully",
      success: true,
    };
  };


  public static getUserVehicles = async (
    userId: string
  ): Promise<ServiceAPIResponse<IVehicle[]>> =>{
      const vehicles = await prisma.vehicle.findMany({
        where: {
            userId
        }
      })

      return {
        body: vehicles,
        message: "User vehicles retrieved successfully!",
        success: true,
      }
  }

  public static getVehicleByPlate = async (
    plateNumber: string
  ): Promise<ServiceAPIResponse<IVehicle>> => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (!vehicle) {
      return {
        body: null,
        message: "Vehicle not found",
        success: false,
      };
    }

    return {
      body: vehicle,
      message: "Vehicle retrieved successfully",
      success: true,
    };
  };

  public static getAllVehicles = async(): Promise<ServiceAPIResponse<IVehicle[]>> => {
     const vehicles = await prisma.vehicle.findMany();

      return {
      body: vehicles,
      message: "Vehicle retrieved successfully",
      success: true,
    };
  }
}