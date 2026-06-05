import { Button, Group, Modal, Text } from "@mantine/core";

interface ConfirmDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  title?: string;
  message?: string;
  busy?: boolean;
}

export function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  itemName,
  title = "Confirm delete",
  message,
  busy = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<div style={{ fontWeight: 600 }}>{title}</div>}
      radius="md"
      size="sm"
      centered
    >
      <Text size="sm" mb="lg">
        {message ?? (
          <>
            Delete <strong>{itemName}</strong>? This cannot be undone.
          </>
        )}
      </Text>
      <Group justify="flex-end">
        <Button
          data-testid="confirm-delete-cancel"
          variant="default"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          data-testid="confirm-delete-confirm"
          color="red"
          onClick={onConfirm}
          loading={busy}
        >
          Delete
        </Button>
      </Group>
    </Modal>
  );
}

export default ConfirmDeleteModal;
