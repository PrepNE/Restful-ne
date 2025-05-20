import { CheckInDTO, CheckOutDTO } from "../dtos/parking.dto";
import { ServiceAPIResponse } from "../types/service-auth-response";
import { sanitizeBigInt } from "../utils";
import AppError from "../utils/AppError";
import prisma from "../utils/client";

export default class ParkingRecordService {
  public static checkIn = async (
    data: CheckInDTO
  ): Promise<ServiceAPIResponse<any>> => {
    const lot = await prisma.parkingLot.findUnique({
      where: {
        id: data.parkingLotId,
      },
    });

    if (!lot) {
      throw new AppError("Parking Lot not found!", 404);
    }

    const occupancy = await prisma.parkingRecord.count({
      where: {
        parkingLotId: data.parkingLotId,
        checkOutTime: null,
      },
    });

    if (occupancy >= lot.capacity) {
      throw new AppError("Parking lot is full", 400);
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: data.plateNumber },
    });

    if (!vehicle) throw new AppError("Vehicle not found", 404);

    const existingSession = await prisma.parkingRecord.findFirst({
      where: {
        vehicleId: vehicle.id,
        checkOutTime: null,
      },
    });
    if (existingSession) {
      throw new AppError("Vehicle is already checked in", 400);
    }


    const record = await prisma.parkingRecord.create({
      data: {
        vehicleId: vehicle.id,
        parkingLotId: data.parkingLotId,
        checkInTime: new Date(),
      },
      include: { parkingLot: true, vehicle: true },
    });

    return {
      body: sanitizeBigInt(record),
      message: "Vehicle checked in successfully",
      success: true,
    };
  };

  public static checkOut = async (
    data: CheckOutDTO
  ): Promise<ServiceAPIResponse<any>> => {
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        plateNumber: data.plateNumber,
      },
    });

    if (!vehicle) throw new AppError("Vehicle not found", 404);

    const record = await prisma.parkingRecord.findFirst({
      where: {
        vehicleId: vehicle.id,
        checkOutTime: null,
      },
      include: { parkingLot: true },
    });

    if (!record) throw new AppError("No active parking session found", 400);
    const now = new Date();
    const durationInMilliseconds = now.getTime() - record.checkInTime.getTime();
    const durationInHours = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60)
    );

    if (!record.parkingLot) {
      throw new AppError("No parking lot found", 404);
    }

    const amount = durationInHours * record.parkingLot.hourlyRate;

    try {
      const updated = await prisma.parkingRecord.update({
        where: { id: record.id },
        data: {
          checkOutTime: now,
          duration: durationInHours,
          amountPaid: amount,
        },
      });

      return {
        body: {
          record: sanitizeBigInt(updated),
          bill: {
            durationInHours,
            totalAmount: amount,
          },
        },
        message: "Vehicle checked out successfully",
        success: true,
      };
    } catch (error: any) {
      if (error.message.includes("ConversionError")) {
        throw new AppError(
          "Failed to check out vehicle: Invalid data type used (e.g., timestamp too large).",
          400
        );
      }
      throw new AppError("Unexpected error during check-out", 500);
    }
  };

  public static getVehicleHistory = async (
    plateNumber: string
  ): Promise<ServiceAPIResponse<any[]>> => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (!vehicle) throw new AppError("Vehicle not found", 404);

    const records = await prisma.parkingRecord.findMany({
      where: { vehicleId: vehicle.id },
      include: { parkingLot: true, vehicle: true },
    });

    return {
      body: sanitizeBigInt(records),
      message: "Parking history retrieved successfully",
      success: true,
    };
  };

  public static searchRecords = async (filter: {
    plateNumber?: string;
    nationalId?: string;
    parkingLotId?: string;
  }): Promise<ServiceAPIResponse<any[]>> => {
    const records = await prisma.parkingRecord.findMany({
      where: {
        ...(filter.parkingLotId && { parkingLotId: filter.parkingLotId }),
        ...(filter.plateNumber || filter.nationalId
          ? {
              vehile: {
                ...(filter.plateNumber && { plateNumber: filter.plateNumber }),
                ...(filter.nationalId && {
                  owner: {
                    nationalId: filter.nationalId,
                  },
                }),
              },
            }
          : {}),
      },
      include: { vehicle: true, parkingLot: true },
    });

    return {
      body: sanitizeBigInt(records),
      message: "Search completed successfully",
      success: true,
    };
  };

  public static getAllRecords = async (): Promise<ServiceAPIResponse<any[]>> => {
    const records = await prisma.parkingRecord.findMany({
      include: { vehicle: true, parkingLot: true },
    });

    return {
      body: sanitizeBigInt(records),
      message: "All records retrieved successfully",
      success: true,
    };
  }

  public static async getEnteredCarsBetween({ startDate, endDate }: { startDate: string, endDate: string }) {
  const records = await prisma.parkingRecord.findMany({
    where: {
      checkInTime: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: { vehicle: true, parkingLot: true },
  });

  return { success: true, data: records };
}

public static async getExitedCarsBetween({ startDate, endDate }: { startDate: string, endDate: string }) {
  const records = await prisma.parkingRecord.findMany({
    where: {
      checkOutTime: {
        not: null,
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: { vehicle: true, parkingLot: true },
  });

  return { success: true, data: records };
}

}