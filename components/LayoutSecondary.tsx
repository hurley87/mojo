import { ReactNode } from 'react';

import LayoutMeta from './LayoutMeta';

type Props = {
  children?: ReactNode;
};

const LayoutSecondary = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <LayoutMeta />
      <div className="container lg:w-1/2 mx-auto lg:px-4 pt-4 pb-20">
        {children}
      </div>
    </div>
  );
};

export default LayoutSecondary;
