import React from 'react';
import { Spin } from 'antd';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default () => (
  <div style={{
    padding: 120,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Spin size="large" />
  </div>
);
