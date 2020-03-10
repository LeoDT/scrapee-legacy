import * as React from 'react';

import Select from '../Select';

const options = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' }
];

export default {
  Normal: <Select options={options} disabled={false} />
};
