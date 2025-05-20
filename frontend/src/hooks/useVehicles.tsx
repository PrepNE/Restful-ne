/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, IVehicle } from "@/types";
import axios from "@/lib/axios.config";
import useSWR from "swr";
import { notification } from "antd";

const fetcher = async (url: string): Promise<any> => {
  const { data } = await axios.get(url);
  return data.body;
};

const useVehicles = (user?: IUser) => {

  const {
    data: vehicles,
    isLoading,
    error,
    mutate,
  } = useSWR<IVehicle[]>(user && user.role === "ADMIN" ? "/vehicles" : "/vehicles/user", fetcher);

  const registerVehicle = async (vehicle: IVehicle): Promise<IVehicle | null> => {
    try {
      const { data } = await axios.post("/vehicles", vehicle);
      console.log("data: ", vehicle)
      notification.success({
        message: "Vehicle Registered",
        description: "Your vehicle has been successfully registered.",
      });
      mutate();
      return data.body;
    } catch (err: any) {
      notification.error({
        message: "Registration Failed",
        description: err?.response?.data?.message || "An error occurred while registering the vehicle.",
      });
      return null;
    }
  };

  const getVehicleByPlateNumber = async (
    plateNumber: string
  ): Promise<IVehicle | null> => {
    try {
      const { data } = await axios.get(`/vehicles/${plateNumber}`);
      notification.success({
        message: "Vehicle Found",
        description: `Details for vehicle with plate number ${plateNumber} loaded successfully.`,
      });

      return data.body;
    } catch (err: any) {
      notification.error({
        message: "Vehicle Not Found",
        description: err?.response?.data?.message || `No vehicle found with plate number ${plateNumber}.`,
      });
      return null;
    }
  };

    const getAllVehicles = async() => {
    try {
      const { data } = await axios.get("/vehicles");
      return data.body;
    } catch (err: any) {
      notification.error({
        message: err?.message
      })
    }
  };


  return {
    vehicles,
    isLoading,
    error,
    mutate,
    registerVehicle,
    getVehicleByPlateNumber,
    getAllVehicles
  };
};

export default useVehicles;
