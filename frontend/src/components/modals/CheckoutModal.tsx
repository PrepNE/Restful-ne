// components/modals/CheckOutModal.tsx
import React, { useState } from "react";
import {
  Modal,
  Typography,
  Form,
  Button,
  Alert,
  message,
} from "antd";
import useParkingRecords from "@/hooks/useParkingRecords";

const { Title, Paragraph } = Typography;

interface Props {
  open: boolean;
  plateNumber: string | null;
  onClose: () => void;
  onSuccess?: (billData?: any) => void;
}

const CheckOutModal: React.FC<Props> = ({
  open,
  plateNumber,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkOut } = useParkingRecords();

  const handleSubmit = async () => {
    if (!plateNumber) return;

    setIsSubmitting(true);
    const data = await checkOut({ plateNumber });

    if (data.success) {
      message.success(`${plateNumber} checked out successfully!`);
      onSuccess?.(data.body);
      onClose();
    }
    setIsSubmitting(false);
    return data;

  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      title={<Title level={4} className="mb-0">Confirm Check-Out</Title>}
    >
      {plateNumber ? (
        <>
          <Paragraph>
            Are you sure you want to check out vehicle <strong>{plateNumber}</strong>?
          </Paragraph>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
              >
                {isSubmitting ? "Checking out..." : `Check Out ${plateNumber}`}
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Alert
          type="error"
          message="No vehicle selected"
          description="Please select a vehicle to proceed with check-out."
        />
      )}
    </Modal>
  );
};

export default CheckOutModal;
