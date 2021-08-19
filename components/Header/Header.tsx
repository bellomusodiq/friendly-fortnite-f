import React, { useState } from 'react';
import { Row, Col, Typography, Drawer } from 'antd';
import { SideNavItem } from '../SideNav/SideNav';

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Drawer
        title="Navigation"
        placement={'left'}
        closable={true}
        onClose={() => setOpenDrawer(false)}
        visible={openDrawer}
        key={'left'}
      >
        <SideNavItem closeSideNav={() => setOpenDrawer(false)} />
      </Drawer>
      <Row className="Header" align="middle" gutter={5}>
        <Col className="MobileMenu">
          <div onClick={() => setOpenDrawer(true)} className="menu">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </Col>
        <Col flex={1} className="Logo">
          <Typography.Title style={{ color: 'white' }} level={3}>
            Mayowa Bello
          </Typography.Title>
        </Col>
      </Row>
    </>
  );
};

export default Header;
