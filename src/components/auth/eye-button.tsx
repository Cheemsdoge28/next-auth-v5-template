import React, { FC } from 'react';
import { Button } from '@/components/ui/button'; // Replace with the actual path of your Button component
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'; // Replace with the actual path of your icons

type EyeButtonProps = {
  visible: boolean;
  onClick: () => void;
};

export const EyeButton: FC<EyeButtonProps> = ({ visible, onClick }) => {
  return (
    <Button onClick={onClick} variant="secondary">
      {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
    </Button>
  );
};
