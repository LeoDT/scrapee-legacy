import * as React from 'react';
import { css } from 'emotion';

import MainPanel from './MainPanel';

const className = css({
  backgroundColor: 'white',
  position: 'fixed',
  bottom: 0,
  right: 0,
  minHeight: 100,
  maxHeight: 300
});

export default function Clipper(): JSX.Element {
  return (
    <div className={className}>
      <MainPanel />
    </div>
  );
}
