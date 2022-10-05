import { useState } from 'react';

const useActiveState = () => {
  const [emailFlowActive, setEmailFlowActive] = useState<boolean>(false);

  return {
    emailFlowActive,
    setEmailFlowActive,
  };
};
export default useActiveState;
