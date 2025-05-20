import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import VehicleController from "../controllers/vehicle.controller";
import { restrictTo } from "../middleware/admin.middleware";



const router = Router();


router.post("/" , isAuthenticated , VehicleController.registerVehicle);
router.get("/" , isAuthenticated, restrictTo("ADMIN") , VehicleController.getAllVehicles);
router.get("/user", isAuthenticated , VehicleController.getUserVehicles);
router.get("/:plateNumber", isAuthenticated, VehicleController.getVehicleByPlateNumber);

const vehicleRoutes = router;
export default vehicleRoutes;