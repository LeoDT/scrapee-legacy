import * as React from 'react';
import { Observer } from 'mobx-react-lite';
import { AnimatePresence } from 'framer-motion';

import { useCommonStores } from '../../stores';

import Confirm from './Confirm';
import Alert from './Alert';

export default function ModalManager(): JSX.Element {
  const { ui } = useCommonStores();

  return (
    <Observer>
      {() => (
        <div className="modals">
          <AnimatePresence>
            {ui.modal.modals.map(m => {
              switch (m.type) {
                case 'confirm':
                  return (
                    <Confirm key={m.id} onConfirm={m.onConfirm} onCancel={m.onCancel}>
                      {m.text}
                    </Confirm>
                  );

                case 'alert':
                  return (
                    <Alert key={m.id} onClose={m.onClose}>
                      {m.text}
                    </Alert>
                  );

                default:
                  break;
              }

              return null;
            })}
          </AnimatePresence>
        </div>
      )}
    </Observer>
  );
}
