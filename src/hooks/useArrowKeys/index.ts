import { useEffect, useState } from 'react';

export interface IKeys {
  up: number;
  down: number;
  left: number;
  right: number;
}
const useArrowKeys = () => {
  const [keys, setKeys] = useState<IKeys>({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const update = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': {
          setKeys({
            up: 1,
            down: 0,
            left: 0,
            right: 0,
          });
          break;
        }
        case 'ArrowDown': {
          setKeys({
            up: 0,
            down: 1,
            left: 0,
            right: 0,
          });
          break;
        }
        case 'ArrowRight': {
          setKeys({
            up: 0,
            down: 0,
            left: 0,
            right: 1,
          });
          break;
        }
        case 'ArrowLeft': {
          setKeys({
            up: 0,
            down: 0,
            left: 1,
            right: 0,
          });
          break;
        }
        default: {
        }
      }
    };

    window.addEventListener('keydown', e => update(e));
    return () => {
      window.removeEventListener('keydown', e => update(e));
    };
  }, []);

  return {
    keys,
  };
};

export default useArrowKeys;
