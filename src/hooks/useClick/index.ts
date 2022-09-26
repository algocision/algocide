import { useEffect, useState } from 'react';
const useClick = () => {
  const [clickActive, setClickActive] = useState<boolean>(false);

  useEffect(() => {
    const update = (e: MouseEvent) => {
      if (e.type === 'mousedown') {
        setClickActive(true);
        return;
      }
      if (e.type === 'mouseup') {
        setClickActive(false);
        return;
      }
    };

    window.addEventListener('mousedown', e => update(e));
    window.addEventListener('mouseup', e => update(e));
    return () => {
      window.removeEventListener('mousedown', e => update(e));
      window.addEventListener('mouseup', e => update(e));
    };
  }, []);

  return {
    clickActive,
  };
};

export default useClick;
