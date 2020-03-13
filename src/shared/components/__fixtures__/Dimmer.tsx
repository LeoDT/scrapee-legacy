import * as React from 'react';
import { Dimmable, Dimmer } from 'shared/components/Dimmer';

export default (
  <Dimmable>
    <Dimmer>
      <h1>ABC</h1>
    </Dimmer>

    <div className="w-64 h-64 bg-blue-400" />
  </Dimmable>
);
