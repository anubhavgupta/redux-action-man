import { ROOT_ACTION_GROUP, constants } from './vars';
import { getOrCreateActionsGroup } from './createActionGroup';
import { createAction } from 'redux-actions';

function checkIfPathIsValid(path) {
  const actionPath = path.trim();
  return (
    actionPath &&
    !~actionPath.split(constants.SEPARATOR).indexOf('') &&
    !actionPath.endsWith(constants.SEPARATOR) &&
    !actionPath.startsWith(constants.SEPARATOR)
  );
}

export function getActionManFor(actionsPath) {
  var actionGroup = ROOT_ACTION_GROUP;
  if (checkIfPathIsValid(actionsPath)) {
    var nameArr = actionsPath.trim().split(constants.SEPARATOR);
    actionGroup = getOrCreateActionsGroup(nameArr, ROOT_ACTION_GROUP, 0);
    return {
      actions: actionGroup.actions,
      actionNames: actionGroup.actionNames,

      defineAction: function defineAction(actionName, ...restArgs) {
        //can't have constants.SEPARATOR in action name
        // convert actionName name here to full path
        let fullActionName;
        if (actionGroup.parentPath) {
          fullActionName = actionGroup.parentPath + constants.SEPARATOR + actionGroup.name + constants.ACTION_SEPARATOR+ actionName;
        } else {
          fullActionName = actionGroup.name + constants.ACTION_SEPARATOR+ actionName;
        }
        actionGroup.actionNames[actionName] = fullActionName;
        const action = createAction(fullActionName, ...restArgs);
        action.ofKind = function (kind) {
          if (!(typeof kind === 'object' && kind !== null)) {
            throw new Error('kind is not defined')
          }
          //
          const subActionNames = {};
          let executed;
          for (let key in kind) {
            if (kind.hasOwnProperty(key)) {
              executed = true;
              subActionNames[key] = kind[key](fullActionName);
            }
          }

          if (executed) {
            actionGroup.actionNames[actionName] = {
              toString: function () {
                return fullActionName;
              },
              valueOf: function () {
                return fullActionName;
              },
              ...subActionNames
            };
          }
          return this;
        };
        return actionGroup.actions[actionName] = action;
      },
      // returns reducer
      actionHandler: function (reducerHandlerObj, initialState) {
        return function (state = initialState, action) {
          if (!action || action && !action.type) {
            return state;
          }

          let parentPath = actionGroup.parentPath + constants.ACTION_SEPARATOR;

          if (actionGroup.parentPath) {
            parentPath = actionGroup.parentPath + constants.SEPARATOR + actionGroup.name + constants.ACTION_SEPARATOR;
          } else {
            parentPath = actionGroup.name + constants.ACTION_SEPARATOR;
          }

          // search parentName in action
          var index = action.type.indexOf(parentPath);
          var actionName;
          if (index === 0) {
            // can be an event of this reducer
            // action = actionName - parentName
            actionName = action.type.slice(parentPath.length, action.type.length);
          } else {
            actionName = action.type;
          }

          if (!actionName) {
            throw `ACTION NAME "${actionName}" is illegal`;// case empty name
          }

          const reducer = reducerHandlerObj[actionName] || reducerHandlerObj[action.type] || reducerHandlerObj[constants.OTHERWISE];

          if (reducer) { // reducer found, execute and return new state
            return reducer(state, action);
          } else { // desired reducer not found particular action, return original state
            return state;
          }

        }
      },
      kind: {
        defineKind: function (kindName, kindOptions) {
          actionGroup.kinds[kindName] = kindOptions;
        },
        kinds: actionGroup.kinds
      }
    };
  } else {
    throw new Error('Action Path is invalid');
  }
}

