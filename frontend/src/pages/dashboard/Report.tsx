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
        let matchesDateRange = true;
        
        if (dateRange && dateRange[0] && dateRange[1]) {
          const startDate = dateRange[0].startOf('day');
          const endDate = dateRange[1].endOf('day');
          const checkInDate = dayjs(record.checkInTime);
          
          // Check if check-in date is within range
          matchesDateRange = checkInDate.isAfter(startDate) && checkInDate.isBefore(endDate);
          
          // For outgoing records, also check checkout time if it exists
          if (record.checkOutTime) {
            const checkOutDate = dayjs(record.checkOutTime);
            // We consider a record valid if either check-in or check-out is within range
            // Or if the parking spans across our date range
            matchesDateRange = matchesDateRange || 
              (checkOutDate.isAfter(startDate) && checkOutDate.isBefore(endDate)) ||
              (checkInDate.isBefore(startDate) && checkOutDate.isAfter(endDate));
          }
        }

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleRefresh = () => {
    fetchAllRecords();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDateRange(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Parking Reports</h1>
      <div className="mb-4">
        <Space direction="horizontal" size="middle" className="w-full flex justify-between flex-wrap">
          <Input
            placeholder="Search plate number..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Space>
            <RangePicker 
              onChange={handleDateRangeChange} 
              value={dateRange}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              placeholder={["Start Date", "End Date"]}
            />
            <Button onClick={handleClearFilters}>Clear Filters</Button>
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
            <div className="mb-2">
              {dateRange && dateRange[0] && dateRange[1] && (
                <Tag color="blue">
                  Date Filter: {dateRange[0].format('YYYY-MM-DD HH:mm')} to {dateRange[1].format('YYYY-MM-DD HH:mm')}
                </Tag>
              )}
              {filteredIncomingRecords.length > 0 && (
                <Tag color="green">Showing {filteredIncomingRecords.length} vehicles</Tag>
              )}
            </div>
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
            <div className="mb-2">
              {dateRange && dateRange[0] && dateRange[1] && (
                <Tag color="blue">
                  Date Filter: {dateRange[0].format('YYYY-MM-DD HH:mm')} to {dateRange[1].format('YYYY-MM-DD HH:mm')}
                </Tag>
              )}
              {filteredOutgoingRecords.length > 0 && (
                <Tag color="green">Showing {filteredOutgoingRecords.length} sessions</Tag>
              )}
            </div>
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