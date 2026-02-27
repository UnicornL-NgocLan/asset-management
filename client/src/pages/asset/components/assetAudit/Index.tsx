import { useState } from 'react';
import Header from './Header';
import { myColor } from 'color';
import AuditList from './AuditList';

const AssetAudit = () => {
  const [state, setState] = useState(0);

  return (
    <div
      style={{
        backgroundColor: myColor.backgroundColor,
        height: '100vh',
        overflow: 'auto',
        width: '100vw',
      }}
    >
      <Header setState={setState} />
      <AuditList state={state} />
    </div>
  );
};

export default AssetAudit;
