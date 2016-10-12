import {getActionManFor} from '../src/index';

describe('Define Action:', () => {
  const {
    defineAction
  } = getActionManFor('app/test');
  
  it('should be a valid function', () => {
    expect(typeof getActionManFor).toBe('function');
  });
  
});
