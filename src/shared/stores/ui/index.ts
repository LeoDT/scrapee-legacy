import ModalStore from './modal';

export default class UI {
  modal: ModalStore;

  constructor() {
    this.modal = new ModalStore();
  }
}
