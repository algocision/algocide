import ConnectWallet from '@/src/components/ConnectWallet';
import { NextPage } from 'next';
import { IPageProps } from './_app';

const Dev: NextPage<IPageProps> = ({}) => {
  return (
    <div style={{ cursor: 'auto' }}>
      <ConnectWallet />
    </div>
  );
};

export default Dev;
