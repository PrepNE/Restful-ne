import ParkingLotService from "../services/parkingLot.service";
import { IParkingLot } from "../types/types";
import { catchAsync } from "../utils/catchAsync";
import {Request , Response} from 'express'


export default class ParkingLotController{

    public static create = catchAsync( async(req: Request, res: Response) => {
        const { name , location , capacity , hourlyRate } = req.body;

        const parkingLotData: IParkingLot = {
            name ,
            location,
            capacity,
            hourlyRate
        }

        const result = await ParkingLotService.createParkingLot(parkingLotData);
        res.status(result.success ? 201: 400).json(result);
    })

    public static findAllLots = catchAsync(async (req: Request , res: Response) => {
        const result = await ParkingLotService.getAllParkingLots();
        res.status(200).json(result);
    })


    public static updateParkingLot = catchAsync(async (req: Request , res: Response) => {
        const { id } = req.params;
        const result = await ParkingLotService.updateParkingLot(id , req.body);
        res.status(result.success ? 200 : 400);
    })

    public static deleteParkingLot = catchAsync(async (req: Request , res: Response) => {
        const { id } = req.params;
        const result = await ParkingLotService.deleteParkingLot(id)
         res.status(result.success ? 204 : 400);
    })

    public static getOccupancy = catchAsync(async (req: Request , res: Response)=> {
        const { id } = req.params;
        const result = await ParkingLotService.getOccupancy(id);
        res.status(200).json(result);
    })

   


}