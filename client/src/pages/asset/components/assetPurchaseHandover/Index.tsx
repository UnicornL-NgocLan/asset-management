import Header from './Header.tsx';
import { myColor } from 'color';
import AssetPurchaseHandoverList from './AssetPurchaseHandoverList.tsx';

const AssetPurchaseHandover = () => {
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
      <AssetPurchaseHandoverList />
    </div>
  );
};

export default AssetPurchaseHandover;
