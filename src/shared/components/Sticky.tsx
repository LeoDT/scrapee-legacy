import * as React from 'react';
import { cx } from 'emotion';

import { createContextNoNullCheck } from '../utils/react';

interface StickyObserverListener {
  (stuck: boolean): void;
}

export class StickyObserver {
  observer: IntersectionObserver;
  listeners: WeakMap<Element, StickyObserverListener>;

  constructor(root: HTMLElement) {
    this.observer = new IntersectionObserver(this.callback, { threshold: [0], root });
    this.listeners = new WeakMap();
  }

  callback = (records: IntersectionObserverEntry[]): void => {
    for (const record of records) {
      const targetInfo = record.boundingClientRect;
      const rootBoundsInfo = record.rootBounds;

      if (rootBoundsInfo) {
        if (targetInfo.bottom < rootBoundsInfo.top) {
          this.invoke(record.target, true);
        }

        if (targetInfo.top >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.invoke(record.target, false);
        }
      }
    }
  };

  observe(el: Element, listener: StickyObserverListener): () => void {
    this.observer.observe(el);
    this.listeners.set(el, listener);

    return () => {
      this.observer.unobserve(el);
      this.listeners.delete(el);
    };
  }

  invoke(el: Element, stuck: boolean): void {
    const listener = this.listeners.get(el);

    if (listener) {
      listener(stuck);
    }
  }
}

export const [useStickyObserver, StickyObserverContext] = createContextNoNullCheck<
  StickyObserver
>();

interface StickySentinelProps extends React.HTMLProps<HTMLDivElement> {
  onStickyChange?: StickyObserverListener;
}

export function Sticky({
  children,
  className,
  onStickyChange,
  ...restProps
}: StickySentinelProps): JSX.Element {
  const observer = useStickyObserver();
  const ref = React.useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = React.useState(false);
  const stickyChange = React.useCallback(
    (stuck: boolean) => {
      setIsSticky(stuck);

      if (onStickyChange) onStickyChange(stuck);
    },
    [onStickyChange]
  );

  React.useEffect(() => {
    const div = ref.current;

    if (div) {
      return observer.observe(div, stickyChange);
    }

    return;
  }, [stickyChange]);

  return (
    <div className={cx('sticky top-0', { shadow: isSticky }, className)} {...restProps}>
      <div className="absolute left-0" ref={ref} style={{ top: -1 }} />
      {children}
    </div>
  );
}
