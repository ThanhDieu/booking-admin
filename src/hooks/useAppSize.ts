import { LAYOUT_FOOTER_HEIGHT, LAYOUT_HEADER_HEIGHT, PAGE_HEADER_HEIGHT } from 'constant/size';
import { useEffect, useMemo, useState } from 'react';

// type ResizeWindowListenerType = (this: Window, ev: UIEvent) => any;

function useAppSize() {
  const [appHeight, setAppHeight] = useState<number>(window.innerHeight);

  const heightWithFooterHeader = useMemo(
    () => appHeight - LAYOUT_FOOTER_HEIGHT - LAYOUT_HEADER_HEIGHT,
    [appHeight]
  );
  const heightWithHeader = useMemo(() => appHeight - LAYOUT_HEADER_HEIGHT, [appHeight]);
  const heightWithFooter = useMemo(() => appHeight - LAYOUT_FOOTER_HEIGHT, [appHeight]);
  const innerAppHeight = useMemo(
    () => heightWithFooterHeader - PAGE_HEADER_HEIGHT,
    [heightWithFooterHeader]
  );

  useEffect(() => {
    function resizeListener(this: Window) {
      setAppHeight(this.innerHeight);
    }

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener, true);
    };
  }, []);

  return {
    heightWithFooterHeader,
    heightWithFooter,
    heightWithHeader,
    innerAppHeight
  };
}

export default useAppSize;
