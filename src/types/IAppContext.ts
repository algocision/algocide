import { MenuId } from '../util/menuTraverse';

export default interface IAppContext {
  authenticated: boolean;
  token: string;
  cursorPointer: boolean;
  modalActive: boolean;
  stateInc: number;
  activeBlink: boolean;
  menuId: MenuId;
  triggerLoginReset: number;
  emailFlowActive: boolean;
  menuIndex: number;
  text1: { x?: number; y?: number | string; width?: number; height?: number };
}

export const IAppContextInit: IAppContext = {
  authenticated: false,
  token: '',
  cursorPointer: false,
  modalActive: false,
  stateInc: 0,
  activeBlink: false,
  menuId: '-1',
  triggerLoginReset: 0,
  emailFlowActive: false,
  menuIndex: 0,
  text1: {},
};
