import {rootActionGroup, separator, actionSeparator, otherwise} from './vars';
import {getOrCreateActionsGroup} from './createActionGroup';
import {createAction} from 'redux-actions';

function checkIfPathIsValid(path){
  const actionPath = path.trim();
  return (
    actionPath &&
    !~actionPath.split(separator).indexOf('') &&
    !actionPath.endsWith(separator) &&
    !actionPath.startsWith(separator)
  );
}

export function getActionManFor(actionsPath) {
  var actionGroup = rootActionGroup;
  if (checkIfPathIsValid(actionsPath)) {
    var nameArr = actionsPath.trim().split(separator);
    actionGroup = getOrCreateActionsGroup(nameArr, rootActionGroup, 0);
    return {
      actions: actionGroup.actions,
      actionNames: actionGroup.actionNames,

      defineAction: function defineAction(actionName, ...restArgs) {
        //can't have separator in action name
        // convert actionName name here to full path
        let fullActionName;
        if (actionGroup.parentPath) {
          fullActionName = actionGroup.parentPath + separator + actionGroup.name + actionSeparator + actionName;
        } else {
          fullActionName = actionGroup.name + actionSeparator + actionName;
        }
        actionGroup.actionNames[actionName] = fullActionName;
        const action = createAction(fullActionName, ...restArgs);
        action.ofKind = function (kind) {
          if (!(typeof kind === 'object' && kind !== null)) {
            throw new Error("kind is not defined")
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

          let parentPath = actionGroup.parentPath + actionSeparator;

          if (actionGroup.parentPath) {
            parentPath = actionGroup.parentPath + separator + actionGroup.name + actionSeparator;
          } else {
            parentPath = actionGroup.name + actionSeparator;
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

          const reducer = reducerHandlerObj[actionName] || reducerHandlerObj[action.type] || reducerHandlerObj[otherwise];

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



