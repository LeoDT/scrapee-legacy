import { compact } from 'lodash';
import * as React from 'react';
import ShadowRoot from 'react-shadow';

import { DOMInspector } from 'shared/dom-inspector';

import { DOMInspectorContext } from './context';
import MainPanel from './MainPanel';

const styles = process.env.COSMOS === '1' ? '' : require('../style.css?string');

interface Props {
  ignoreRoot?: HTMLElement;
}

export default function Clipper({ ignoreRoot }: Props): JSX.Element {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [bodyHeightPlaceHolder] = React.useState<HTMLDivElement>(() =>
    document.createElement('div')
  );
  const [inspector] = React.useState(() => new DOMInspector(window.document));

  React.useEffect(() => {
    inspector.updateOptions({
      ignoreRoots: compact<HTMLElement>([bodyHeightPlaceHolder, ignoreRoot ?? rootRef.current])
    });
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (panelRef.current) {
        bodyHeightPlaceHolder.style.height = `${panelRef.current.offsetHeight}px`;
      }
    }, 3000);

    document.body.appendChild(bodyHeightPlaceHolder);

    return () => {
      document.body.removeChild(bodyHeightPlaceHolder);
      clearInterval(interval);
    };
  }, [bodyHeightPlaceHolder]);

  const Wrapper = process.env.COSMOS === '1' ? 'div' : ShadowRoot.div;

  return (
    <DOMInspectorContext.Provider value={inspector}>
      <Wrapper ref={rootRef} data-scrapee-ignore>
        <style type="text/css">{styles}</style>
        <div
          ref={panelRef}
          className="clipper fixed left-0 bottom-0 w-full bg-gray-100 border-t shadow-inner shadow-xs"
          style={{ zIndex: 2147483637 }}
        >
          <MainPanel />
        </div>
      </Wrapper>
    </DOMInspectorContext.Provider>
  );
}
