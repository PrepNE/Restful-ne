import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { VehicleService } from "../services/vehicle.service";
import { IVehicle } from "../types/types";

export default class VehicleController {
  public static registerVehicle = catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.user.sub;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: user not authenticated",
          body: null,
        });
      }

      const { plateNumber, manufacturer, model, color } = req.body;

      const vehicleData: IVehicle = {
        plateNumber,
        manufacturer,
        model,
        color,
      };

      const result = await VehicleService.registerVehicle(vehicleData, userId);

      res.status(result.success ? 201 : 400).json(result);
    }
  );


  public static getUserVehicles = catchAsync(async(req: Request , res: Response) => {
    const userId = req.user?.sub;

    const result = await VehicleService.getUserVehicles(userId);
    
    res.status(result.success ? 200 : 400).json(result);
  })

  public static getVehicleByPlateNumber = catchAsync(async(req: Request , res: Response) => {
    const { plateNumber } = req.params;

    const result = await VehicleService.getVehicleByPlate(plateNumber);
    res.status(result.success ? 200: 400).json(result);
  })

  public static getAllVehicles = catchAsync(async( req: Request , res: Response) => {
    const result = await VehicleService.getAllVehicles();
    res.status(result.success ? 200: 400).json(result);
  })
}
