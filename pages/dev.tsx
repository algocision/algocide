import ConnectWalletDev from '@/src/components/ConnectWalletDev';
import { NextPage } from 'next';
import { IPageProps } from './_app';

const Dev: NextPage<IPageProps> = ({}) => {
  return (
    <div style={{ cursor: 'auto' }}>
      <ConnectWalletDev />
    </div>
  );
};

export default Dev;
