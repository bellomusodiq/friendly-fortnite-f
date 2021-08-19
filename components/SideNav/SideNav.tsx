import React from 'react';
import { Divider, Typography } from 'antd';
import { useRouter } from 'next/router';

type Props = {
  closeSideNav: () => void;
};

export const SideNavItem: React.FC<Props> = ({ closeSideNav }) => {
  const router = useRouter();

  const navigate = (path: string, as: string) => {
    router.push(path, as);
    closeSideNav();
  };

  return (
    <>
      <div onClick={() => navigate('/', '/')} className="SideNavItem">
        <Typography.Text>Home</Typography.Text>
      </div>
      <Divider style={{ margin: 7.5 }} />
      <div
        onClick={() => navigate('/digit-recognizer', '/digit-recognizer')}
        className="SideNavItem"
      >
        <Typography.Text>Digit Recognizer</Typography.Text>
      </div>
    </>
  );
};

const SideNav = () => {
  return (
    <div className="SideNav">
      <SideNavItem closeSideNav={() => {}} />
    </div>
  );
};

export default SideNav;
