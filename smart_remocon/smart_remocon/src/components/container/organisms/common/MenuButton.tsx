import * as React from 'react';

import { Drawer, IconButton } from '@material-ui/core';

import { Menu } from '@material-ui/icons';
import MenuList from './MenuList';

/** サイドメニュー表示ボタン */
const MenuButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        ref={menuButtonRef}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <MenuList></MenuList>
      </Drawer>
      <input />
    </>
  );
};

export default MenuButton;
