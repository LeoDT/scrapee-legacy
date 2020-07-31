import * as React from 'react';
import { Observer } from 'mobx-react-lite';

import { ScrapContentInput } from 'core/client-types';

import { useStore } from './context';
import { useTextSizer } from '../utils/react';

interface Props {
  scrapContent: ScrapContentInput;
  index: number;
}

export default function ScrapContent({ scrapContent, index }: Props): JSX.Element {
  const store = useStore();
  const [editKey, setEditKey] = React.useState(false);
  const [editKeyValue, setEditKeyValue] = React.useState(scrapContent.key?.toString() || '');
  const [keySize, keySizer] = useTextSizer(editKeyValue);
  const submitKey = React.useCallback(() => {
    const s = store.scrapContents.find((s) => s === scrapContent);

    if (s) {
      s.key = editKeyValue;
    }

    setEditKey(false);
  }, [scrapContent, editKeyValue]);

  return (
    <Observer>
      {() => (
        <div className="mb-2 mx-2">
          <div className="flex px-1 pb-1 text-gray-500">
            <div
              className="key mr-4 cursor-text px-2 bg-transparent border-b border-dashed border-gray-500 hover:border-gray-600 hover:text-gray-600"
              tabIndex={0}
              onFocus={() => {
                setEditKey(true);
              }}
              onClick={() => {
                setEditKey(true);
              }}
            >
              {editKey ? (
                <input
                  className="outline-none leading-none"
                  type="text"
                  value={editKeyValue}
                  autoFocus
                  onChange={({ target }) => {
                    setEditKeyValue(target.value);
                  }}
                  onBlur={() => {
                    submitKey();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      submitKey();
                    }
                  }}
                  style={{ width: `${keySize}px` }}
                />
              ) : (
                <span>{editKeyValue || index + 1}</span>
              )}
              {keySizer}
            </div>
            <div
              className="remove ml-auto cursor-pointer hover:text-red-600"
              onClick={() => {
                store.scrapContents.remove(scrapContent);
              }}
            >
              Remove
            </div>
          </div>
          <div
            className="preview-html border p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: scrapContent.value }}
          />
        </div>
      )}
    </Observer>
  );
}
