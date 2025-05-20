/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import SearchInput from "@/components/shared/SearchInput";
import { Button, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import DataTable from "@/components/tables/DataTable";
import { IVehicle } from "@/types";
import useVehicles from "@/hooks/useVehicles";
import CreateModal from "@/components/modals/CreateModal";
import useAuth from "@/hooks/useAuth";

const Vehicles = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const { user } = useAuth();
  const { vehicles, registerVehicle } = useVehicles(user ? user : undefined);


  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCreateVehicle = async (newVehicle: IVehicle) => {
    console.log("Here is new vehicle to be registered: ", newVehicle)
    try {
      await registerVehicle(newVehicle);
    } catch (error) {
      console.error("Create vehicle error:", error);
    }
  };

  const vehicleFields: {
    name: keyof IVehicle;
    label: string;
    inputType?: "text" | "number" | "email";
    rules?: any[];
    placeholder?: string;
  }[] = [
    {
      name: "plateNumber",
      label: "Plate Number",
      placeholder: "Enter plate number",
      rules: [{ required: true, message: "Plate number is required" }],
    },
    {
      name: "manufacturer",
      label: "Manufacturer",
      placeholder: "Enter manufacturer",
      rules: [{ required: true, message: "Manufacturer is required" }],
    },
    {
      name: "model",
      label: "Model",
      placeholder: "Enter model",
      rules: [{ required: true, message: "Model is required" }],
    },
    {
      name: "color",
      label: "Color",
      placeholder: "Enter color",
      rules: [{ required: true, message: "Color is required" }],
    },
  ];

  const columns = (
    selectedKey: string | null,
    handleEditRow: (vehicle: IVehicle) => void,
    handleDeleteRow: () => void,
    handleCheckBoxChange: (key: string, item: IVehicle) => void
  ) => {
    const baseColumns = [
      {
        title: "",
        key: "checkbox",
        render: (_: any, record: IVehicle) => (
          <Checkbox
            checked={record.id === selectedKey}
            onChange={() => handleCheckBoxChange(record.id.toString(), record)}
          />
        ),
      },
      {
        title: "Plate Number",
        dataIndex: "plateNumber",
        key: "plateNumber",
      },
      {
        title: "Manufacturer",
        dataIndex: "manufacturer",
        key: "manufacturer",
      },
      {
        title: "Model",
        dataIndex: "model",
        key: "model",
      },
      {
        title: "Color",
        dataIndex: "color",
        key: "color",
      },
    ];
    return baseColumns;
  };

  return (
    <div className="bg-white px-10 py-6 rounded-lg">
      <div className="flex flex-1 sm:flex-row flex-col gap-y-4 justify-between pb-6">
        <div>
          <h1 className="text-base font-medium">Manage Vehicles</h1>
          <p className="text-gray-500 text-[14px]">
            View, edit, and delete your vehicles below.
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
            New Vehicle
          </Button>
        </div>
      </div>

      <DataTable<IVehicle>
        data={vehicles ?? []}
        searchQuery={searchValue}
        columns={columns}
        rowKey="id"
        DeleteModalComponent={DeleteConfirmationModal}
        modalTitle="Edit Parking Lot"
      />

      {showCreateModal && (
        <CreateModal<IVehicle>
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          item={null}
          title="Create New Vehicle"
          fields={vehicleFields}
          onSubmit={handleCreateVehicle}
        />
      )}
    </div>
  );
};

export default Vehicles;
