import { getActionManFor, configure, ROOT_ACTION_GROUP } from '../src/index';

describe('Configuration test Suit:', () => {

  describe('when both SEPARATOR and ACTION_SEPARATOR are set to same value', function () {

    beforeEach(function () {
      // set default values
      configure({
        SEPARATOR: '/',
        ACTION_SEPARATOR: ':',
        OTHERWISE: '*'
      });
    });

    afterEach(function () {
      // set default values
      configure({
        SEPARATOR: '/',
        ACTION_SEPARATOR: ':',
        OTHERWISE: '*'
      });
    });

    it('should throw and error when `SEPARATOR` and `ACTION_SEPARATOR` are same',()=>{
      expect(()=>{
        configure({
          SEPARATOR: ':'
        });
      }).toThrow();
    });

    it('should throw and error when `SEPARATOR` and `ACTION_SEPARATOR` are same',()=>{
      expect(()=>{
        configure({
          ACTION_SEPARATOR: '/'
        });
      }).toThrow();
    });

    it('should throw and error when `SEPARATOR` and `ACTION_SEPARATOR` are same',()=>{
      expect(()=>{
        configure({
          SEPARATOR: '_',
          ACTION_SEPARATOR: '_'
        });
      }).toThrow();
    });

  });


  describe('when separator is changed',function () {
    it('should be possible to change separator [_]', () => {
      configure({
        SEPARATOR:'_'
      });
      getActionManFor('app_test_test1');
      expect(ROOT_ACTION_GROUP.children.app).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.app.children.test).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.app.children.test.children.test1).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.app.children.test.children.test1.parentPath).toBe('app_test');

    });

    it('should be possible to change separator [\\]', () => {

      configure({
        SEPARATOR:'\\'
      });
      getActionManFor('com\\gamer\\test');
      expect(ROOT_ACTION_GROUP.children.com).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.com.children.gamer).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.com.children.gamer.children.test).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.com.children.gamer.children.test.parentPath).toBe('com\\gamer');

    });

    it('should be possible to change separator [.]', () => {

      configure({
        SEPARATOR:'.'
      });
      getActionManFor('src.test.test1');
      expect(ROOT_ACTION_GROUP.children.src).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.src.children.test).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.src.children.test.children.test1).toBeDefined();
      expect(ROOT_ACTION_GROUP.children.src.children.test.children.test1.parentPath).toBe('src.test');

    });
  });

  describe('when action separator is changed',function () {

  });


  it('should be possible to change action separator', () => {

  });

  describe('otherwise symbol config change:',function () {

    describe('when `otherwise` handler is present in the reducer ',function () {
      let reducer;
      const {
        defineAction,
        actionHandler,
        actions,
        actionNames
      } = getActionManFor('app/test');

      beforeEach(function () {
        configure({
          OTHERWISE:'&&'
        });

        defineAction('TEST_ACTION');

        reducer = actionHandler({
          [actionNames.TEST_ACTION]: function (state, action) {
            return 'TEST_ACTION_TRIGGERED_' + action.payload;
          },
          '&&': function (state, action) {
            return 'UNKNOWN_ACTION_' + action.payload
          }
        });
      });

      it('should should return correct response when a registered action is dispatched', () => {
        expect(reducer(null, actions.TEST_ACTION(10))).toBe('TEST_ACTION_TRIGGERED_10');
      });

      it('should handle an action when a generic action handler is defined and direct handler of the triggered action is not present',()=>{
        expect(reducer(null, {
          type:'TEST_&&_ACTION',
          payload: 10
        })).toBe('UNKNOWN_ACTION_10');
      });
    });

    describe('when `otherwise` handler is not present',function () {
      let reducer;
      const {
        defineAction,
        actionHandler,
        actions,
        actionNames
      } = getActionManFor('app/test');

      beforeEach(function () {
        configure({
          OTHERWISE:'&&'
        });

        defineAction('TEST_ACTION');

        reducer = actionHandler({
          [actionNames.TEST_ACTION]: function (state, action) {
            return 'TEST_ACTION_TRIGGERED_' + action.payload;
          }
        });
      });

      it('should should return correct response when a handled action is dispatched', () => {
        expect(reducer(null, actions.TEST_ACTION(10))).toBe('TEST_ACTION_TRIGGERED_10');
      });

      it('should return original state when both `otherwise` handler and action handler is not present',()=>{
        expect(reducer('ORIGINAL_STATE', {
          type:'TEST_&&_ACTION',
          payload: 10
        })).toBe('ORIGINAL_STATE');
      });
    });

  });


});
