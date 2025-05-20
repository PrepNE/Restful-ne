/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Card,
  Typography,
  Select,
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Descriptions,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import useVehicles from "@/hooks/useVehicles";
import useParkingRecords, { ParkingRecord } from "@/hooks/useParkingRecords";
import CheckOutModal from "@/components/modals/CheckoutModal"; // ✅ Ensure correct path
import DataTable from "@/components/tables/DataTable";
import useAuth from "@/hooks/useAuth";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleString() : "N/A";

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0 ? `${hours}h ${remainingMinutes}min` : `${remainingMinutes}min`;
};

const History = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [selectedPlate, setSelectedPlate] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [selectedForCheckOut, setSelectedForCheckOut] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [bill, setBill] = useState<any>(null);

  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const {
    history: parkingRecords,
    isLoading: recordsLoading,
    mutate,
  } = useParkingRecords(selectedPlate);

  const totalSpent = parkingRecords?.reduce(
    (sum, r) => sum + (r.amountPaid || 0),
    0
  ) || 0;

  const columns = (
    selectedKey: string | null,
    handleEditRow: (record: ParkingRecord) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, item: ParkingRecord) => void
  ) => {
    const baseColumns = [
      {
        title: "Vehicle",
        dataIndex: "vehicle",
        key: "plateNumber",
        render: (vehicle: any) => vehicle?.plateNumber || "N/A",
      },
      {
        title: "Parking Location",
        dataIndex: "parkingLot",
        key: "parkingLotName",
        render: (parkingLot: any) => (
          <Space>
            <EnvironmentOutlined style={{ color: "#888" }} />
            {parkingLot?.name || "Unknown"}
          </Space>
        ),
      },
      {
        title: "Check-in Time",
        dataIndex: "checkInTime",
        key: "checkInTime",
        render: (time: string) => formatDate(time),
      },
      {
        title: "Check-out Time",
        dataIndex: "checkOutTime",
        key: "checkOutTime",
        render: (time: string | null) =>
          time ? (
            formatDate(time)
          ) : (
            <Tag color="blue">Active</Tag>
          ),
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        render: (duration: number | null) =>
          duration ? (
            formatDuration(duration)
          ) : (
            <Space>
              <ClockCircleOutlined style={{ color: "#1677ff" }} spin />
              In progress
            </Space>
          ),
      },
      {
        title: "Amount",
        dataIndex: "amountPaid",
        key: "amountPaid",
        align: "right" as const,
        render: (amount: number | null) => (amount ? `${amount} RWF` : "-"),
      },
      {
        title: "Action",
        key: "action",
        render: (_: any, record: any) =>
          !record.checkOutTime ? (
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setSelectedForCheckOut(record.vehicle?.plateNumber);
                setShowModal(true);
              }}
            >
              Check Out
            </Button>
          ) : (
            <Tag color="green">Completed</Tag>
          ),
      },
    ];
    return baseColumns;
  }

  console.log("🚀 ~ file: History.tsx:88 ~ History ~ parkingRecords:", parkingRecords);


  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="w-full">
        <Title level={2}>Parking History</Title>

        <Card style={{ marginBottom: 24 }} title="Filter Records">
          <Paragraph type="secondary">Select a vehicle to filter records</Paragraph>
          <div style={{ maxWidth: 400, width: "100%" }}>
            <Select
              placeholder="All vehicles"
              onChange={(val) => setSelectedPlate(val)}
              value={selectedPlate}
              style={{ width: "100%" }}
              allowClear
              loading={vehiclesLoading}
            >
              {vehicles?.map((vehicle) => (
                <Option key={vehicle.plateNumber} value={vehicle.plateNumber} >
                  {vehicle.plateNumber} - {vehicle.manufacturer} {vehicle.model}
                </Option>
              ))}
            </Select>
          </div>
        </Card>

        <Card title="Parking Records">
          {recordsLoading ? (
            <Paragraph>Loading records...</Paragraph>
          ) : parkingRecords && parkingRecords.length > 0 ? (
            <>
              {/* <Table
                columns={columns}
                dataSource={parkingRecords}
                rowKey="id"
                pagination={false}
              /> */}
              <DataTable
                data={parkingRecords}
                columns={columns}
                rowKey="id"
                searchQuery={searchValue}
              />
              <div style={{ textAlign: "right", marginTop: 16 }}>
                <Text>Total Spent: </Text>
                <Text strong>{totalSpent} RWF</Text>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <Paragraph>No parking records found</Paragraph>
              <Paragraph type="secondary">
                {selectedPlate
                  ? "Try selecting a different vehicle or check-in your vehicle first."
                  : "Your parking history will appear here once you have parked your vehicle."}
              </Paragraph>
            </div>
          )}
        </Card>
      </div>

      <CheckOutModal
        open={showModal}
        plateNumber={selectedForCheckOut}
        onClose={() => {
          setShowModal(false);
          setSelectedForCheckOut(null);
        }}
        onSuccess={(billData: any) => {
          setShowModal(false);
          setBillModalVisible(true);
          setSelectedForCheckOut(null);
          setBill(billData); 
          mutate();
          console.log("🚀 ~ file: History.tsx:138 ~ History ~ billData:", billData);
        }}
      />

      <Modal
        title="Bill Details"
        visible={billModalVisible}
        onCancel={() => setBillModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setBillModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {bill && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Ticket ID">
              {bill.record.id}
            </Descriptions.Item>
      
            <Descriptions.Item label="Check-in Time">
              {formatDate(bill.record.checkInTime)}
            </Descriptions.Item>
            <Descriptions.Item label="Check-out Time">
              {formatDate(bill.record.checkOutTime)}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {formatDuration(bill.record.duration)}
            </Descriptions.Item>
            <Descriptions.Item label="Amount Paid">
              {bill.record.amountPaid} RWF
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </div>
  );
};

export default History;
