import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { restrictTo } from "../middleware/admin.middleware";
import ParkingLotController from "../controllers/parkingLot.controller";


const router = Router();

router.post("/", isAuthenticated, restrictTo("ADMIN") , ParkingLotController.create)
router.get("/", isAuthenticated, ParkingLotController.findAllLots)
router.patch("/:id",isAuthenticated , ParkingLotController.updateParkingLot)
router.delete("/:id", isAuthenticated, restrictTo("ADMIN") , ParkingLotController.deleteParkingLot)
router.get("/:id/occupancy", isAuthenticated, ParkingLotController.getOccupancy)

const parkingLotRoutes = router;
export default parkingLotRoutes