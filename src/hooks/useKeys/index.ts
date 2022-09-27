import { useEffect, useState } from 'react';

export interface IKeys {
  enter: number;
  up: number;
  down: number;
  left: number;
  right: number;
}
const useKeys = () => {
  const [keys, setKeys] = useState<IKeys>({
    enter: 0,
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const update = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter': {
          setKeys({
            enter: 1,
            up: 0,
            down: 0,
            left: 0,
            right: 0,
          });
        }
        case 'ArrowUp': {
          setKeys({
            enter: 0,
            up: 1,
            down: 0,
            left: 0,
            right: 0,
          });
          break;
        }
        case 'ArrowDown': {
          setKeys({
            enter: 0,
            up: 0,
            down: 1,
            left: 0,
            right: 0,
          });
          break;
        }
        case 'ArrowRight': {
          setKeys({
            enter: 0,
            up: 0,
            down: 0,
            left: 0,
            right: 1,
          });
          break;
        }
        case 'ArrowLeft': {
          setKeys({
            enter: 0,
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

export default useKeys;
