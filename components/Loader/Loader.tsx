import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

const Loader = () => (
  <div className="backdrop">
    <Spin indicator={antIcon} />
  </div>
);

export default Loader;
