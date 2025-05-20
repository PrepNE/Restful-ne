/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import SearchInput from "@/components/shared/SearchInput";
import { Button, Tag, Checkbox } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import EditModal from "@/components/modals/EditModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import CreateModal from "@/components/modals/CreateModal";
import DataTable from "@/components/tables/DataTable";
import { ParkingLot } from "@/types";
import useParkingLots from "@/hooks/useParkingLots";

const ParkingLots = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const { parkingLots, createParkingLot } = useParkingLots();

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (id: string) => {
    // logic to delete parking lot
  };

  const handleEdit = async (updatedLot: ParkingLot) => {
    // logic to edit parking lot
  };

  const handleCreateParkingLot = async (newLot: ParkingLot) => {
    try {
      await createParkingLot(newLot);
      setShowCreateModal(false); // Close modal after creation
    } catch (error) {
      console.error("Error creating parking lot:", error);
    }
  };

  const parkingLotFields: {
    name: keyof ParkingLot;
    label: string;
    inputType?: "number" | "text" | "email";
    placeholder?: string;
    rules?: any[];
  }[] = [
    {
      name: "name",
      label: "Lot Name",
      placeholder: "e.g. Lot A1",
      rules: [{ required: true, message: "Lot name is required" }],
    },
    {
      name: "hourlyRate",
      label: "Hourly Rate",
      inputType: "number",
      placeholder: "Enter hourly rate",
      rules: [{ required: true, message: "Hourly rate is required" }],
    },
    {
      name: "location",
      label: "Location",
      placeholder: "e.g. Ground Floor",
      rules: [{ required: true, message: "Location is required" }],
    },
    {
      name: "capacity",
      label: "Capacity",
      inputType: "number",
      placeholder: "Enter total capacity",
      rules: [{ required: true, message: "Capacity is required" }],
    }
  ];

  const columns = (
    selectedKey: string | null,
    handleEditRow: (lot: ParkingLot) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, item: ParkingLot) => void
  ) => {
    const baseColumns = [
      {
        title: "",
        key: "checkbox",
        render: (_: any, record: ParkingLot) => (
          <Checkbox
            checked={record.id === selectedKey}
            onChange={() =>
              handleCheckBoxChange(record.id.toString(), record)
            }
          />
        ),
      },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Occupancy",
        key: "occupancy",
        render: (_: any, record: ParkingLot) => (
          <Tag
            color={
              record.currentOccupancy < record.capacity ? "green" : "red"
            }
          >
            {`${record.currentOccupancy} / ${record.capacity}`}
          </Tag>
        ),
      },
      {
        title: "Hourly Rate (RWF)",
        dataIndex: "hourlyRate",
        key: "hourlyRate",
      },
      { title: "Location", dataIndex: "location", key: "location" },
    ];

    const actionColumn = {
      title: "Action",
      key: "action",
      render: (_: any, record: ParkingLot) =>
        record.id === selectedKey ? (
          <span className="flex flex-1 flex-row gap-x-4">
            <Button onClick={() => handleEditRow(record)}>
              <EditOutlined /> Edit
            </Button>
            <Button danger onClick={handleDeleteRow}>
              <DeleteOutlined /> Delete
            </Button>
          </span>
        ) : null,
    };

    return selectedKey ? [...baseColumns, actionColumn] : baseColumns;
  };

  return (
    <div className="bg-white px-10 py-6 rounded-lg">
      <div className="flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6">
        <div>
          <h1 className="text-base font-medium">Manage Parking Lots</h1>
          <p className="text-gray-500 text-[14px]">
            View, create, edit, and delete your parking lots below.
          </p>
        </div>
        <div className="flex flex-row gap-x-2">
          <SearchInput
            searchQueryValue={searchValue}
            handleSearchQueryValue={handleSearchQueryChange}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-[40px]"
            onClick={() => setShowCreateModal(true)}
          >
            New Parking Lot
          </Button>
        </div>
      </div>

      <DataTable<ParkingLot>
        data={parkingLots}
        searchQuery={searchValue}
        onDelete={handleDelete}
        onEdit={handleEdit}
        columns={columns}
        rowKey="id"
        EditModalComponent={EditModal}
        DeleteModalComponent={DeleteConfirmationModal}
        modalTitle="Edit Parking Lot"
        editFields={parkingLotFields}
      />

      {showCreateModal && (
        <CreateModal<ParkingLot>
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          item={null}
          title="Create New Parking Lot"
          fields={parkingLotFields}
          onSubmit={handleCreateParkingLot}
        />
      )}
    </div>
  );
};

export default ParkingLots;
