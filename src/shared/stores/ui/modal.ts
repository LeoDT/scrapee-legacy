import { ReactNode } from 'react';
import { observable, IObservableArray } from 'mobx';

import uuid from '../../utils/uuid';

interface BaseModal {
  id: string;
  type: 'alert' | 'confirm';
  text: ReactNode;
}

export interface AlertModal extends BaseModal {
  type: 'alert';
  onClose: () => void;
}

export interface ConfirmModal extends BaseModal {
  type: 'confirm';
  onConfirm: () => void;
  onCancel?: () => void;
}

type Modal = AlertModal | ConfirmModal;

export default class ModalStore {
  modals: IObservableArray<Modal>;

  constructor() {
    this.modals = observable.array([], { deep: false });
  }

  add(m: Modal): void {
    this.modals.push(m);
  }

  remove(id: string): void {
    const m = this.modals.find(m => m.id === id);

    if (m) {
      this.modals.remove(m);
    }
  }

  alert(text: ReactNode): Promise<void> {
    return new Promise(resolve => {
      const id = uuid.generate();

      this.add({
        id,
        type: 'alert',
        text,
        onClose: () => {
          resolve();
          this.remove(id);
        }
      });
    });
  }

  confirm(text: ReactNode): Promise<boolean> {
    return new Promise(resolve => {
      const id = uuid.generate();

      this.add({
        id,
        type: 'confirm',
        text,
        onConfirm: () => {
          resolve(true);
          this.remove(id);
        },
        onCancel: () => {
          resolve(false);
          this.remove(id);
        }
      });
    });
  }
}
