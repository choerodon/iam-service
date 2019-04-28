'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasDirChild = hasDirChild;
exports.isChild = isChild;
exports.findParent = findParent;
exports.deleteNode = deleteNode;
exports.canDelete = canDelete;
exports.defineLevel = defineLevel;
exports.defineParentName = defineParentName;
exports.normalizeMenus = normalizeMenus;
exports.adjustSort = adjustSort;


function defineProperty(obj, property, value) {
  Object.defineProperty(obj, property, {
    value: value,
    writable: true,
    enumerable: false,
    configurable: true
  });
}

function hasDirChild(_ref) {
  var subMenus = _ref.subMenus;

  if (subMenus) {
    return subMenus.some(function (record) {
      return record.type !== 'menu';
    });
  }
  return false;
}

function isChild(parent, child) {
  if (parent.subMenus) {
    return parent.subMenus.some(function (menu) {
      return menu === child || isChild(menu, child);
    });
  }
  return false;
}

function findParent(menus, record) {
  var index = menus.indexOf(record);
  var result = null;
  if (index === -1) {
    menus.some(function (data) {
      var subMenus = data.subMenus;

      if (subMenus) {
        var ret = findParent(subMenus, record);
        if (ret) {
          result = ret;
          if (!ret.parentData) {
            result.parentData = data;
          }
          return true;
        }
      }
      return false;
    });
    return result;
  } else {
    return {
      parent: menus,
      index: index
    };
  }
}

function deleteNode(menus, record) {
  var _findParent = findParent(menus, record),
      parent = _findParent.parent,
      index = _findParent.index,
      parentData = _findParent.parentData;

  parent.splice(index, 1);
  if (!parent.length && parentData) {
    parentData.subMenus = null;
  }
}

function canDelete(_ref2) {
  var subMenus = _ref2.subMenus;

  if (subMenus) {
    return subMenus.every(function (menu) {
      return menu.type === 'dir' && canDelete(menu);
    });
  }
  return true;
}

function defineLevel(obj, level) {
  defineProperty(obj, '__level__', level);
}

function defineParentName(obj, name) {
  defineProperty(obj, '__parent_name__', name);
}

function normalizeMenus(menus) {
  var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
  var parentName = arguments[2];

  level += 1;
  menus.forEach(function (menu) {
    var subMenus = menu.subMenus,
        name = menu.name;

    defineLevel(menu, level);
    if (parentName) {
      defineParentName(menu, parentName);
    }
    if (subMenus) {
      normalizeMenus(subMenus, level, name);
    }
  });
  return menus;
}

function adjustSort(data) {
  data.forEach(function (value, index) {
    value.sort = index;
    if (value.subMenus) {
      adjustSort(value.subMenus);
    }
  });
  return data;
}