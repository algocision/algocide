import { MenuId } from '../util/menuTraverse';

//   const [cursorPointer, setCursorPointer] = useState<boolean>(false);
//   const [modalActive, setModalActive] = useState<boolean>(false);
//   const [stateInc, setStateInc] = useState<number>(0);
//   const [activeBlink, setActiveBlink] = useState<boolean>(false);
//   const [menuId, setMenuId] = useState<MenuId>('-1');
//   const [triggerLoginReset, setTriggerLoginReset] = useState<number>(0);

export default interface IAppContext {
  cursorPointer: boolean;
  modalActive: boolean;
  stateInc: number;
  activeBlink: boolean;
  menuId: MenuId;
  triggerLoginReset: number;
  emailFlowActive: boolean;
  menuIndex: number;
}

export const IAppContextInit: IAppContext = {
  cursorPointer: false,
  modalActive: false,
  stateInc: 0,
  activeBlink: false,
  menuId: '-1',
  triggerLoginReset: 0,
  emailFlowActive: false,
  menuIndex: 0,
};
