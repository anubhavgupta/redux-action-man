import { ActionGroup } from './ActionGroup';

//=========================//
//       VARIABLES         //
//=========================//
export const constants = {
  SEPARATOR: '/',
  ACTION_SEPARATOR: ':',
  OTHERWISE: '*'
};

const ROOT_NAME = '$ROOT';

// root ActionGroup
export const ROOT_ACTION_GROUP = new ActionGroup(ROOT_NAME, undefined, null);
