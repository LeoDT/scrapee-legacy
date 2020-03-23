import * as React from 'react';

import Confirm, { Props as ConfirmProps } from './Confirm';

interface EasyConfirmProps extends Partial<ConfirmProps> {
  children: React.ReactNode;
}

export function useEasyConfirm(): [React.ComponentType<EasyConfirmProps>, () => Promise<boolean>] {
  const [isOpen, setIsOpen] = React.useState(false);
  const [onConfirm, setOnConfirm] = React.useState<Function>();
  const [onCancel, setOnCancel] = React.useState<Function>();
  const component = React.useCallback(
    function EasyConfirm(props: EasyConfirmProps) {
      return isOpen ? (
        <Confirm
          onCancel={() => {
            if (onCancel) onCancel();
            setIsOpen(false);
          }}
          onConfirm={() => {
            if (onConfirm) onConfirm();
            setIsOpen(false);
          }}
          {...props}
        />
      ) : null;
    },
    [onConfirm, onCancel, isOpen]
  );

  const confirm = React.useCallback(() => {
    setIsOpen(true);

    return new Promise<boolean>(resolve => {
      setOnConfirm(() => () => resolve(true));
      setOnCancel(() => () => resolve(false));
    });
  }, []);

  return [component as React.ComponentType<EasyConfirmProps>, confirm];
}
