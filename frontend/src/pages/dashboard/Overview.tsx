import ParkingLotCard from "@/components/cards/ParkingLotCard";
import StatsCard from "@/components/cards/StatCards";
import useAuth from "@/hooks/useAuth";
import useParkingLots from "@/hooks/useParkingLots";
import useVehicles from "@/hooks/useVehicles";
import { Helmet } from "react-helmet";

export default function Overview() {
  const { user } = useAuth();
  const { vehicles } = useVehicles(user ? user : undefined);
  const { parkingLots } = useParkingLots();


  return (
    <>
      <Helmet>
        <title>Overview</title>
      </Helmet>
      <div className="w-full flex flex-col gap-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-gray-500">
            Hello there! here is a summary for you
          </p>
        </div>
        <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user?.role === "ADMIN" && (
            <StatsCard title="Slots" value={parkingLots.length} link="/dashboard/slots" />
          )}
          <StatsCard
            title="Vehicles"
            value={vehicles?.length ?? 0}
            link="/dashboard/vehicles"
          />
        </div>

        <div className="pt-5">
          <h1 className="font-bold text-xl">Parking Lot Overview</h1>
          <div className="mt-10 w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parkingLots.map((lot, idx) => (
              <ParkingLotCard key={idx} {...lot} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
