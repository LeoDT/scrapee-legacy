import * as React from 'react';

import Button from 'shared/components/Button';
import Toggle from 'shared/components/Toggle';
import { Dimmer, Dimmable } from 'shared/components/Dimmer';

import { useDOMInspector, useStore } from './context';

import BucketSelector from './BucketSelector';
import PreviewHTMLElements from './PreviewHTMLElements';

export default function MainPanel(): JSX.Element {
  const store = useStore();
  const inspector = useDOMInspector();
  const [selectedEls, setSelectedEls] = React.useState<HTMLElement[]>([]);
  const [inspectorEnabled, setInspectorEnabled] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const onSelect = React.useCallback((el: HTMLElement): void => {
    setSelectedEls(els => [...els, el]);
  }, []);

  React.useEffect(() => {
    if (inspectorEnabled) {
      inspector.mount();
      inspector.emitter.on('select', onSelect);
    } else {
      inspector.unmount();
      inspector.emitter.off('select', onSelect);
    }

    return () => {
      inspector.unmount();
      inspector.emitter.off('select', onSelect);
    };
  }, [inspector, inspectorEnabled, onSelect]);

  return (
    <Dimmable className="main-panel p-2" dimmed={saving}>
      {saving ? <Dimmer>Saving...</Dimmer> : null}

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
            disabled={selectedEls.length === 0 || saving}
            onClick={async () => {
              setSaving(true);

              try {
                const res = await store.saveScrap(selectedEls);

                if (res.success) {
                  setSelectedEls([]);
                }
              } finally {
                setSaving(false);
              }
            }}
          >
            Save!
          </Button>
        </div>
      </div>

      {selectedEls.length ? <PreviewHTMLElements els={selectedEls} /> : null}
    </Dimmable>
  );
}
