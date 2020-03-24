import { remote, MenuItemConstructorOptions, PopupOptions, Menu } from 'electron';

export function showContextMenu(items: MenuItemConstructorOptions[], options?: PopupOptions): Menu {
  const menu = remote.Menu.buildFromTemplate(items);

  menu.popup(options);

  return menu;
}
