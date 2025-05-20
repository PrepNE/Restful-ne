import axios from "@/lib/axios.config";
import useSWR from "swr";
import { notification } from "antd";
import { useEffect, useState } from "react";

export interface ParkingLot {
  id: string;
  name: string;
  capacity: number;
  location:string;
  hourlyRate: number;
  currentOccupancy: number;
}

const fetcher = async (url: string) => {
  const { data } = await axios.get(url);
  return data.body;
};

const useParkingLots = () => {
  const { data: lots, isLoading, error, mutate } = useSWR("/parking-lots", fetcher);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);


  const createParkingLot = async (lot: Omit<ParkingLot, "id" | "currentOccupancy">) => {
    try {
      const { data } = await axios.post("/parking-lots", lot);
      notification.success({
        message: "Parking Lot Created",
        description: "The parking lot has been successfully created.",
      });
      mutate();
      return data.body;

    }catch (err: any) {
      notification.error({
        message: "Failed to create parking lot",
        description: err?.response?.data?.message || "An error occurred while creating the parking lot.",
      });
    }
  }

  const getOccupancy = async (id: string) => {
    const { data } = await axios.get(`/parking-lots/${id}/occupancy`);
    return data.body.occupiedSpots;
  };

  useEffect(() => {
    const loadOccupancies = async () => {
      if (!lots) return;

      const lotsWithOccupancy = await Promise.all(
        lots.map(async (lot: Omit<ParkingLot, "currentOccupancy">) => {
          const occupied = await getOccupancy(lot.id);
          return {
            ...lot,
            currentOccupancy: occupied,
          };
        })
      );

      setParkingLots(lotsWithOccupancy);
    };

    loadOccupancies();
  }, [lots]);

  if (error) {
    notification.error({
      message: "Failed to load parking lots",
      description: error.message,
    });
  }

  return {
    parkingLots,
    createParkingLot,
    getOccupancy,
    isLoading,
    error,
    mutate,
  };
};

export default useParkingLots;
