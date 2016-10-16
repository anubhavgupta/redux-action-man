import { constants } from './vars';

export function configure(newConfigObj) {
  if(newConfigObj && Object.keys(newConfigObj).length) {
    for(let key in newConfigObj) {
      if(newConfigObj.hasOwnProperty(key)) {
        // overwrite property
        constants[key] = newConfigObj[key];
      }
    }
    if(constants.SEPARATOR.toString() === constants.ACTION_SEPARATOR.toString()) {
      throw new Error(`redux-action-man configuration error: SEPARATOR(${constants.SEPARATOR.toString()}) and ACTION_SEPARATOR(${constants.ACTION_SEPARATOR.toString()}) can't be same`);
    }

  } else {
    throw new Error('New configuration object is either not provided or has no keys.')
  }
  return constants;
}
