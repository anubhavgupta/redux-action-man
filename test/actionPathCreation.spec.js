import { getActionManFor, ROOT_ACTION_GROUP } from '../src/index';

describe('Action Path Creation:', () => {
  it('should be a valid function', () => {
    expect(typeof getActionManFor).toBe('function');
  });

  it('should return an object when executed with a valid path',()=>{
    const objs = [
      getActionManFor('app'),
      getActionManFor('app/test'),
      getActionManFor('app/test/test1'),
      getActionManFor('com/test'),
      getActionManFor(' app/test1 ')
    ];
    for(let obj of objs) {
      expect(typeof obj).toBe('object');

      // object structure
      expect(obj.actions).toBeDefined();
      expect(obj.actionNames).toBeDefined();
      expect(obj.defineAction).toBeDefined();
      expect(obj.actionHandler).toBeDefined();
      expect(obj.kind).toBeDefined();
      expect(obj.kind.defineKind).toBeDefined();
      expect(obj.kind.kinds).toBeDefined();
    }
  });

  it('should throw when invalid path is passed',()=>{

    const paths = [
      '/',
      '/app',
      '/',
      'app/',
      'app//test',
      'app/test/',
      'app/test//',
      ''
    ];

    for(let path of paths) {
      expect(()=>{
        getActionManFor(path);
      }).toThrow();
    }

  });

  it('should create correct parent child structure on defining different paths',()=>{
    getActionManFor('app');
    expect(ROOT_ACTION_GROUP.children.app).toBeDefined();
  });

  it('should create correct parent child structure on defining different paths[nested]',()=>{
    getActionManFor('com/path/check');
    expect(ROOT_ACTION_GROUP.children.com).toBeDefined();
    expect(ROOT_ACTION_GROUP.children.com.children.path).toBeDefined();
    expect(ROOT_ACTION_GROUP.children.com.children.path.children.check).toBeDefined();
  });

  it('should create correct parent child structure on defining different paths[nested siblings]',()=>{
    getActionManFor('com/path/check');
    getActionManFor('com/path1/check1');
    expect(ROOT_ACTION_GROUP.children.com).toBeDefined();
    expect(ROOT_ACTION_GROUP.children.com.children.path).toBeDefined();
    expect(ROOT_ACTION_GROUP.children.com.children.path1).toBeDefined();
    expect(ROOT_ACTION_GROUP.children.com.children.path.children.check).toBeDefined();
    expect(ROOT_ACTION_GROUP.children.com.children.path1.children.check1).toBeDefined();
  });
});
