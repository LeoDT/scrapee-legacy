import * as React from 'react';

export function createContextNoNullCheck<T>(defaults?: T): [() => T, React.Context<T | undefined>] {
  const context = React.createContext<T | undefined>(defaults);

  function useContext(): T {
    const c = React.useContext(context);

    if (typeof c === 'undefined') {
      throw new Error('useContext must be inside a Provider with a value');
    }

    return c;
  }

  return [useContext, context];
}

export function useTextSizer(text: string): [number, JSX.Element] {
  const ref = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      setSize(ref.current.scrollWidth + 2);
    }
  }, [text]);

  return [
    size,
    React.createElement(
      'div',
      {
        ref,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          visibility: 'hidden',
          height: 0,
          overflow: 'scroll',
          whiteSpace: 'pre',
        },
      },
      text
    ),
  ];
}
