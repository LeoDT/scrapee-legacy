import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

function portalRoot(name: string): HTMLDivElement {
  const div = document.createElement('div');

  div.setAttribute('id', name);

  document.body.appendChild(div);

  return div;
}

const roots = {
  modals: portalRoot('modals')
};

interface Props {
  children: ReactNode;
  root: keyof typeof roots;
}

export default function Portal({ children, root }: Props): JSX.Element {
  return createPortal(children, roots[root]);
}
