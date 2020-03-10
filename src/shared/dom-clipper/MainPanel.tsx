import * as React from 'react';

import Button from 'shared/components/Button';
import Toggle from 'shared/components/Toggle';

import { useDOMInspector, useStore } from './context';

import BucketSelector from './BucketSelector';
import PreviewHTMLElements from './PreviewHTMLElements';

export default function MainPanel(): JSX.Element {
  const store = useStore();
  const inspector = useDOMInspector();
  const [selectedEls, setSelectedEls] = React.useState<HTMLElement[]>([]);
  const [inspectorEnabled, setInspectorEnabled] = React.useState(true);
  const onSelect = React.useCallback((el: HTMLElement): void => {
    setSelectedEls(els => [...els, el]);
  }, []);

  React.useEffect(() => {
    inspector.emitter.on('select', onSelect);

    return () => {
      inspector.emitter.off('select', onSelect);
    };
  }, [inspector, onSelect]);

  React.useEffect(() => {
    if (inspectorEnabled) {
      inspector.mount();
    } else {
      inspector.unmount();
    }

    return () => {
      inspector.unmount();
    };
  }, [inspector, inspectorEnabled]);

  return (
    <div className="main-panel p-2">
      <div className="flex items-center">
        <Toggle
          checked={inspectorEnabled}
          label="Inspector On"
          onClick={() => setInspectorEnabled(!inspectorEnabled)}
        />
        <div className="ml-auto">
          <BucketSelector />
          <Button
            className="ml-2"
            disabled={selectedEls.length === 0}
            onClick={() => store.saveScrap(selectedEls)}
          >
            Save!
          </Button>
        </div>
      </div>

      {selectedEls.length ? <PreviewHTMLElements els={selectedEls} /> : null}
    </div>
  );
}
