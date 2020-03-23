import { remote, MenuItemConstructorOptions, PopupOptions, Menu } from 'electron';

function buildMenu(items: MenuItemConstructorOptions[]): Menu {
  const menu = new remote.Menu();

  items.forEach(options => {
    menu.append(new remote.MenuItem(options));
  });

  return menu;
}

export function showContextMenu(items: MenuItemConstructorOptions[], options?: PopupOptions): Menu {
  const menu = buildMenu(items);

  menu.popup(options);

  return menu;
}
