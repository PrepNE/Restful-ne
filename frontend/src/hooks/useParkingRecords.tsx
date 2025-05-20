/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "@/lib/axios.config";
import useSWR from "swr";
import { notification } from "antd";


export interface CheckInDTO {
  plateNumber: string;
  parkingLotId: string;
}

export interface CheckOutDTO {
  plateNumber: string;
}

export interface ParkingRecord {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  duration: number | null;
  amountPaid: number | null;
  parkingLotId: string;
  vehicleId: string;
  vehicle?: any;
  parkingLot?: any;
}

const useParkingRecords = (plateNumber?: string) => {
  const {
    data: history,
    isLoading,
    error,
    mutate,
  } = useSWR<ParkingRecord[]>(
    plateNumber ? `/parking-records/history/${plateNumber}` : null,
    async (url: string) => {
      const response = await axios.get(url);
      return response.data.body;
    }
  );

  const checkIn = async (dto: CheckInDTO): Promise<any> => {
    try {
      const { data } = await axios.post("/parking-records/check-in", dto);
      notification.success({
        message: "Checked In",
        description: "Vehicle successfully checked into the parking lot.",
      });

      mutate();
      return data;
    } catch (err: any) {
      notification.error({
        message: "Check-In Failed",
        description: err?.response?.data?.message || "Unable to check in.",
      });
      return false;
    }
  };

  const checkOut = async (dto: CheckOutDTO): Promise<any> => {
    try {
      const { data } = await axios.post("/parking-records/check-out", dto);
      notification.success({
        message: "Checked Out",
        description: "Vehicle successfully checked out.",
      });
      mutate();
      return data;
    } catch (err: any) {
      notification.error({
        message: "Check-Out Failed",
        description: err?.response?.data?.message || "Unable to check out.",
      });
    }
  };

  const searchRecords = async (query: {
    plateNumber?: string;
    nationalId?: string;
    parkingLotId?: string;
  }): Promise<ParkingRecord[] | null> => {
    try {
      const response = await axios.get("/parking-records/search", {
        params: query,
      });
      notification.success({
        message: "Records Found",
        description: "Parking records were successfully retrieved.",
      });
      return response.data.body;
    } catch (err: any) {
      notification.error({
        message: "Search Failed",
        description: err?.response?.data?.message || "Could not search records.",
      });
      return null;
    }
  };

  const getAllRecords = async () => {
    try {
      const response = await axios.get("/parking-records");
      return response.data.body;
    } catch (err: any) {
      notification.error({
        message: "Error",
        description: err?.response?.data?.message || "Unable to fetch records.",
      })
    }
  }

  return {
    history,
    isLoading,
    error,
    checkIn,
    checkOut,
    searchRecords,
    getAllRecords,
    mutate,
  };
};

export default useParkingRecords;
