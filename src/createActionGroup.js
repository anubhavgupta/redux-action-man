import { separator } from './vars';
import { ActionGroup } from './ActionGroup';

export function getOrCreateActionsGroup(nameArr, currentGroup, index, preventCreationMode) {

  if (index < nameArr.length) {
    var child = currentGroup.children[nameArr[index]];
    if (child) {
      return getOrCreateActionsGroup(nameArr, child, ++index, preventCreationMode);
    } else if (!preventCreationMode) {
      var newGroup = new ActionGroup(nameArr[index], nameArr.slice(0, index).join(separator), currentGroup.kinds);
      currentGroup.children[nameArr[index]] = newGroup;
      return getOrCreateActionsGroup(nameArr, newGroup, ++index, preventCreationMode);
    }
  }
  else {
    return currentGroup;
  }
}
