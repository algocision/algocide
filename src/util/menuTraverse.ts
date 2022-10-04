export type MenuId = '-1' | '0' | '1' | '0-0';
export const MENU_IDS = ['-1', '0', '1', '0-0'];
export const OPT_IDS = ['0', '1', '0-0', '0-1', '0-2', '1-0', '1-1'];

export type MenuOpt =
  | 'connect'
  | 'explore'
  | 'connect wallet'
  | 'sign in'
  | 'sign up'
  | 'pcparttracker'
  | 'themeit'
  | 'metamask'
  | 'login w/ email'
  | 'coinbase wallet'
  | 'walletconnect'
  | 'disconnect';

export const MENU: Record<MenuId, MenuOpt[]> = {
  '-1': ['connect', 'explore'],
  '0': ['connect wallet', 'login w/ email'],
  '1': ['pcparttracker', 'themeit'],
  '0-0': ['metamask', 'coinbase wallet', 'walletconnect'],
};

// export const opt_to_id = (opt: MenuOpt) => {
//   Object.keys(MENU).map(key => {
//     console.log(
//       `${opt} = ${MENU[key as MenuId].indexOf(opt)}: ${MENU[
//         key as MenuId
//       ].includes(opt)}`
//     );
//   });
// };

export const get_opt_from_index = (
  index: number,
  current_id: MenuId
): MenuOpt => {
  return MENU[current_id][index];
};

export const back = (location: MenuId): MenuId => {
  const list = location.split('-');
  if (list.length === 1) {
    return '-1';
  }
  const next = location.substring(0, location.length - 2) as MenuId;
  return next;
};

export const next = (location: MenuId): MenuId => {
  if (MENU_IDS.includes(location + '-0')) {
    return (location + '-0') as MenuId;
  }

  return location;
};
