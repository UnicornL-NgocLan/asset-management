import { useState } from 'react';
import Header from './Header.tsx';
import { myColor } from 'color';
import AssetTransferList from './AssetTransferList.tsx';

const AssetAudit = () => {
  return (
    <div
      style={{
        backgroundColor: myColor.backgroundColor,
        height: '100vh',
        overflow: 'auto',
        width: '100vw',
      }}
    >
      <Header />
      <AssetTransferList />
    </div>
  );
};

export default AssetAudit;
