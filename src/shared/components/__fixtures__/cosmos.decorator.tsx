import '../../style.css';

import * as React from 'react';

export default function CosmosDecorator({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="p-5">{children}</div>;
}
