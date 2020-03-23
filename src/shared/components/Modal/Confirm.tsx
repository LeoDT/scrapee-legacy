import * as React from 'react';

import Button from '../Button';
import BaseModal from './BaseModal';

export interface Props {
  children: React.ReactNode;
  danger?: boolean;

  onConfirm: () => void;
  onCancel?: () => void;
}

export default function Confirm({
  children,
  danger = false,
  onConfirm,
  onCancel
}: Props): JSX.Element {
  return (
    <BaseModal>
      <div className="modal-body mb-4">{children}</div>

      <div className="modal-footer flex justify-end">
        <Button
          onClick={() => {
            if (onCancel) onCancel();
          }}
        >
          Cancel
        </Button>
        <Button
          primary={!danger}
          danger={danger}
          className="ml-4"
          onClick={() => {
            onConfirm();
          }}
        >
          Confirm
        </Button>
      </div>
    </BaseModal>
  );
}
