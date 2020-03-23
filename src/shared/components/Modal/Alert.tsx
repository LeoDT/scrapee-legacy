import * as React from 'react';

import Button from '../Button';
import BaseModal from './BaseModal';

export interface Props {
  children: React.ReactNode;
  danger?: boolean;

  onClose: () => void;
}

export default function Alert({ children, danger = false, onClose }: Props): JSX.Element {
  return (
    <BaseModal>
      <div className="modal-body mb-4">{children}</div>

      <div className="modal-footer flex justify-end">
        <Button
          primary={!danger}
          danger={danger}
          className="ml-4"
          onClick={() => {
            onClose();
          }}
        >
          OK
        </Button>
      </div>
    </BaseModal>
  );
}
