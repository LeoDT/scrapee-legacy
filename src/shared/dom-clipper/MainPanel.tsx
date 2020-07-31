import * as React from 'react';
import { Observer } from 'mobx-react-lite';

import Button from 'shared/components/Button';
import Toggle from 'shared/components/Toggle';
import { Dimmer, Dimmable } from 'shared/components/Dimmer';

import { useDOMInspector, useStore } from './context';

import BucketSelector from './BucketSelector';
import ScrapContent from './ScrapContent';

export default function MainPanel(): JSX.Element {
  const store = useStore();
  const inspector = useDOMInspector();
  const [inspectorEnabled, setInspectorEnabled] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const onSelect = React.useCallback((el: HTMLElement): void => {
    store.addScrapContent(el);
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
    <Dimmable className="main-panel py-2" dimmed={saving}>
      {saving ? <Dimmer>Saving...</Dimmer> : null}

      <div className="flex items-center px-2">
        <Toggle
          checked={inspectorEnabled}
          label="Inspector On"
          onClick={() => setInspectorEnabled(!inspectorEnabled)}
        />
        <div className="ml-auto">
          <BucketSelector />
          <Observer>
            {() => (
              <Button
                className="ml-2"
                disabled={store.scrapContents.length === 0 || saving}
                onClick={async () => {
                  setSaving(true);

                  try {
                    await store.saveScrap();
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Save!
              </Button>
            )}
          </Observer>
        </div>
      </div>

      <Observer>
        {() => (
          <div className="overflow-auto mt-2" style={{ maxHeight: 400 }}>
            {store.scrapContents.map((s, i) => (
              <ScrapContent scrapContent={s} index={i} key={s.key || i} />
            ))}
          </div>
        )}
      </Observer>
    </Dimmable>
  );
}
