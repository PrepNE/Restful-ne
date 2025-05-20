import React, { useState, useEffect } from "react";
import { Tabs, Input, Button, Space, DatePicker, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import useParkingRecords from "@/hooks/useParkingRecords";
import { ParkingRecord } from "@/hooks/useParkingRecords";
import dayjs from "dayjs";
import DataTable from "@/components/tables/DataTable";

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredIncomingRecords, setFilteredIncomingRecords] = useState<ParkingRecord[]>([]);
  const [filteredOutgoingRecords, setFilteredOutgoingRecords] = useState<ParkingRecord[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("incoming");

  const { getAllRecords, isLoading } = useParkingRecords();

  const [parkingRecords, setParkingRecords] = useState<ParkingRecord[]>([]);

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    const records = await getAllRecords();
    console.log("Fetched records: ", records);
    if (records) {
      setParkingRecords(records);
    }
  };

  useEffect(() => {
    // Filter records based on search query and date range
    if (parkingRecords.length > 0) {
      const filtered = parkingRecords.filter((record) => {
        // Search query filter
        const matchesSearch =
          !searchQuery ||
          Object.values(record).some((val) => {
            if (typeof val === "string") {
              return val.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (val && typeof val === "object" && "plateNumber" in val) {
              return val.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return false;
          });

        // Date range filter
        const matchesDateRange =
          !dateRange ||
          !dateRange[0] ||
          !dateRange[1] ||
          (dayjs(record.checkInTime).isAfter(dateRange[0]) &&
            (!record.checkOutTime || dayjs(record.checkOutTime).isBefore(dateRange[1])));

        return matchesSearch && matchesDateRange;
      });

      // Incoming cars are those that have checked in but not checked out yet
      const incoming = filtered.filter((record) => !record.checkOutTime);
      setFilteredIncomingRecords(incoming);

      // Outgoing cars are those that have both checked in and checked out
      const outgoing = filtered.filter((record) => record.checkOutTime);
      setFilteredOutgoingRecords(outgoing);
    }
  }, [parkingRecords, searchQuery, dateRange]);

  const incomingColumns = (
    selectedKey: string | null,
    handleEdit: (item: ParkingRecord) => void,
    handleDelete: () => void,
    handleCheckBoxChange: (key: string, item: ParkingRecord) => void
  ) => [
    {
      title: "Plate Number",
      dataIndex: ["vehicle", "plateNumber"],
      key: "plateNumber",
      render: (text: string, record: ParkingRecord) => record.vehicle?.plateNumber || "N/A",
    },
    {
      title: "Check-In Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Parking Lot",
      dataIndex: ["parkingLot", "name"],
      key: "parkingLot",
      render: (text: string, record: ParkingRecord) => record.parkingLot?.name || "N/A",
    },
    {
      title: "Duration (so far)",
      key: "duration",
      //@ts-ignore
      render: (_, record: ParkingRecord) => {
        const now = dayjs();
        const checkIn = dayjs(record.checkInTime);
        const durationHours = now.diff(checkIn, "hour");
        const durationMinutes = now.diff(checkIn, "minute") % 60;
        return `${durationHours}h ${durationMinutes}m`;
      },
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="green">Active</Tag>,
    },
  ];

  const outgoingColumns = (
    selectedKey: string | null,
    handleEdit: (item: ParkingRecord) => void,
    handleDelete: () => void,
    handleCheckBoxChange: (key: string, item: ParkingRecord) => void
  ) => [
    {
      title: "Plate Number",
      dataIndex: ["vehicle", "plateNumber"],
      key: "plateNumber",
      render: (text: string, record: ParkingRecord) => record.vehicle?.plateNumber || "N/A",
    },
    {
      title: "Check-In Time",
      dataIndex: "checkInTime",
      key: "checkInTime",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Check-Out Time",
      dataIndex: "checkOutTime",
      key: "checkOutTime",
      render: (text: string) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "N/A"),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text: number) => (text ? `${Math.floor(text / 60)}h ${text % 60}m` : "N/A"),
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (text: number) => (text ? `$${text.toFixed(2)}` : "N/A"),
    },
    {
      title: "Parking Lot",
      dataIndex: ["parkingLot", "name"],
      key: "parkingLot",
      render: (text: string, record: ParkingRecord) => record.parkingLot?.name || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="blue">Completed</Tag>,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const handleRefresh = () => {
    fetchAllRecords();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Parking Reports</h1>
      <div className="mb-4">
        <Space direction="horizontal" size="middle" className="w-full flex justify-between flex-wrap">
          <Input
            placeholder="Search by plate number..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Space>
            <RangePicker onChange={handleDateRangeChange} />
            <Button type="primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </Space>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Incoming Cars" key="incoming">
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-4">Currently Parked Vehicles</h2>
            <DataTable<ParkingRecord>
              data={filteredIncomingRecords}
              searchQuery={searchQuery}
              columns={incomingColumns}
              rowKey="id"
            />
          </div>
        </TabPane>
        <TabPane tab="Outgoing Cars" key="outgoing">
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-lg font-semibold mb-4">Completed Parking Sessions</h2>
            <DataTable<ParkingRecord>
              data={filteredOutgoingRecords}
              searchQuery={searchQuery}
              columns={outgoingColumns}
              rowKey="id"
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Reports;