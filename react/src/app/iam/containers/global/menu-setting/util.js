

function defineProperty(obj, property, value) {
  Object.defineProperty(obj, property, {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export function hasDirChild({ subMenus }) {
  if (subMenus) {
    return subMenus.some(record => record.type !== 'menu_item');
  }
  return false;
}

export function isChild(parent, child) {
  if (parent.subMenus) {
    return parent.subMenus.some(menu => menu === child || isChild(menu, child));
  }
  return false;
}

export function findParent(menus, record) {
  const index = menus.indexOf(record);
  let result = null;
  if (index === -1) {
    menus.some((data) => {
      const { subMenus } = data;
      if (subMenus) {
        const ret = findParent(subMenus, record);
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
      index,
    };
  }
}

export function deleteNode(menus, record) {
  const { parent, index, parentData } = findParent(menus, record);
  parent.splice(index, 1);
  if (!parent.length && parentData) {
    parentData.subMenus = null;
  }
}

export function canDelete({ subMenus }) {
  if (subMenus) {
    return subMenus.every(menu => menu.type === 'menu' && canDelete(menu));
  }
  return true;
}

export function defineLevel(obj, level) {
  defineProperty(obj, '__level__', level);
}

export function defineParentName(obj, name) {
  defineProperty(obj, '__parent_name__', name);
}

export function normalizeMenus(menus, level = -1, parentName) {
  level += 1;
  menus.forEach((menu) => {
    const { subMenus, name } = menu;
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

export function adjustSort(data) {
  data.forEach((value, index) => {
    value.sort = index;
    if (value.subMenus) {
      adjustSort(value.subMenus);
    }
  });
  return data;
}
