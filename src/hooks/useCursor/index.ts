import { useEffect, useState } from 'react';
const useCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('pointermove', e => update(e));
    return () => {
      window.removeEventListener('pointermove', e => update(e));
    };
  }, []);

  return {
    cursorX: mousePos.x,
    cursorY: mousePos.y,
  };
};

export default useCursor;
