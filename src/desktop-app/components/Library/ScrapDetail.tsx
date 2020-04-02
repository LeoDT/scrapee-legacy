import * as React from 'react';
import { cx } from 'emotion';

import PreviewHTML from 'shared/components/PreviewHTML';
import { Sticky } from 'shared/components/Sticky';

import { Scrap } from 'core/client-types';
import { useMutationToggleScrap } from 'core/client/mutations';

interface Props {
  scrap: Scrap;
}

export default function ScrapDetail({ scrap }: Props): JSX.Element {
  const [toggleScrap] = useMutationToggleScrap();

  return (
    <div className="scrap-detail">
      <Sticky
        className={cx(
          'flex px-4 py-2 cursor-pointer items-center',
          scrap.expanded ? 'text-gray-600 bg-gray-100' : 'text-black bg-white'
        )}
        onClick={() => {
          toggleScrap({ variables: { id: scrap.id } });
        }}
      >
        <h5>{scrap.title}</h5>
        <div className="ml-auto text-sm">{scrap.createdAt.toRelative()}</div>
      </Sticky>

      {scrap.expanded ? (
        <div className="px-4 py-2">
          {scrap.content ? (
            <div className="select-text">
              <PreviewHTML html={scrap.content.map(c => c.value).join('\n')} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
