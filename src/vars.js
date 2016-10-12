import { ActionGroup } from './ActionGroup';

//=========================//
//       VARIABLES         //
//=========================//

export const separator = '/';
export const actionSeparator = ':';
export const rootName = '$ROOT';
export const otherwise = '*';
// root ActionGroup
export const rootActionGroup = new ActionGroup(rootName, undefined, null);
