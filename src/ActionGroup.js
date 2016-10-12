/**
 * Action Group Class
 */
export class ActionGroup {
  constructor(name, parentPath, parentKind) {
    this.parentPath = parentPath;
    this.name = name;
    this.children = {};
    this.actions = {};
    this.actionNames = {};
    this.kinds = Object.create(parentKind);
  }
}
