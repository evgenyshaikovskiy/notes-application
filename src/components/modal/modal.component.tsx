import { ReactNode } from "react";
import classes from "./modal.module.css";

type ModalWindowProps = {
  children: ReactNode;
  visible: boolean;
  setVisible: (value: boolean) => void;
};

export const ModalWindow = ({
  children,
  visible,
  setVisible,
}: ModalWindowProps) => {
  const rootClasses = [classes.appModal];

  if (visible) {
    rootClasses.push(classes.active);
  }

  const hideOnClick = () => setVisible(false);

  return (
    <div className={rootClasses.join(" ")} onClick={hideOnClick}>
      <div
        className={classes.appModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
