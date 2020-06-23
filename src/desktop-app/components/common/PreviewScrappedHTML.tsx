import * as path from 'path';
import * as React from 'react';

import PreviewHTML from 'shared/components/PreviewHTML';
import { useMainStore } from '../store';

interface Props {
  html: string;
  bucketId: string;
}

export default function PreviewScrappedHTML({ html, bucketId }: Props): JSX.Element {
  const mainStore = useMainStore();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      const imgs = ref.current.querySelectorAll<HTMLImageElement>('img[data-filename]');

      imgs.forEach((img) => {
        const filename = img.dataset.filename;
        if (filename) {
          const filepath = path.resolve(mainStore.appConfig.rootPath, bucketId, filename);

          img.src = `file://${filepath}`;
        }
      });
    }
  }, [html]);

  return (
    <div className="preview-scrapped-html" ref={ref}>
      <PreviewHTML html={html} />
    </div>
  );
}
