import * as React from 'react';

import Confirm from '../Modal/Confirm';
import { useEasyConfirm } from '../Modal';
import Button from '../Button';

function EasyConfirmFixture(): JSX.Element {
  const [EasyConfirm, confirm] = useEasyConfirm();

  return (
    <div>
      <Button
        onClick={async () => {
          if (await confirm()) {
            alert('sure');
          }
        }}
      >
        Confirm
      </Button>

      <EasyConfirm>Are you sure?</EasyConfirm>
    </div>
  );
}

export default {
  Confirm: (
    <Confirm danger={false} onConfirm={() => alert('sure')} onCancel={() => undefined}>
      Are you sure? Are you sure? Are you sure? Are you sure? Are you sure? Are you sure? Are you
      sure? Are you sure?
    </Confirm>
  ),
  EasyConfirm: <EasyConfirmFixture />
};
