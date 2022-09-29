import Frame from './_core/Frame';
import styles from './index.module.css';

interface Props {
  modalActive: boolean;
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorPointer: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNavIndex: React.Dispatch<React.SetStateAction<number>>;
  setSubNavIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedNavIndex: number;
  subNavIndex: number;
  activeBlink: boolean;
  subNavItems: Record<number, string[]>;
  navItems: string[];
}
export const Modal: React.FC<Props> = ({
  modalActive,
  setModalActive,
  setCursorPointer,
  setSelectedNavIndex,
  selectedNavIndex,
  setSubNavIndex,
  subNavIndex,
  activeBlink,
  subNavItems,
  navItems,
}) => {
  return (
    <>
      {modalActive && (
        <Frame
          loading={false}
          header={navItems[selectedNavIndex]}
          setIsOpen={setModalActive}
          setCursorPointer={setCursorPointer}
          content={
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {subNavItems[selectedNavIndex].map(
                  (item: string, index: number) => {
                    return (
                      <div
                        key={item}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            width: `150px`,
                            padding: 10,
                          }}
                          onMouseEnter={() => {
                            setCursorPointer(true);
                          }}
                          onMouseLeave={() => {
                            setCursorPointer(false);
                          }}
                          onClick={() => {
                            setSubNavIndex(index);
                            setModalActive(true);
                            setCursorPointer(false);
                          }}
                        >
                          {subNavIndex === index && (
                            <div
                              className={styles.navItem}
                              style={{ marginRight: 6, marginLeft: -14 }}
                            >
                              {`>`}
                            </div>
                          )}
                          <div className={styles.navItem}>{item}</div>
                          {subNavIndex === index && (
                            <div className={styles.navItem}>
                              {activeBlink ? '_' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              {/* <div
                    style={{ display: 'flex', width: `100px`, padding: 10 }}
                    onMouseEnter={() => {
                      setCursorPointer(true);
                    }}
                    onMouseLeave={() => {
                      setCursorPointer(false);
                    }}
                    onClick={() => {
                      setSelectedNavIndex(1);
                      setModalActive(true);
                      setCursorPointer(false);
                    }}
                  >
                    {subNavIndex === 1 && (
                      <div
                        className={styles.navItem}
                        style={{ marginRight: 6, marginLeft: -14 }}
                      >
                        {`>`}
                      </div>
                    )}
                    <div className={styles.navItem}>{`sign in`}</div>
                    {subNavIndex === 1 && (
                      <div className={styles.navItem}>
                        {activeBlink ? '_' : ''}
                      </div>
                    )}
                  </div> */}
            </>
          }
        />
      )}
    </>
  );
};

export default Modal;
