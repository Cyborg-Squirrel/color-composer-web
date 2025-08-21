import type { ReactNode } from "react";
import { IsLightModeContext, isLightModeUi } from "./IsLightModeContext";
import { IsMobileContext, isMobileUi } from "./IsMobileContext";

interface UiContextProps {
  children?: ReactNode;
}

function UiContext(props: UiContextProps) {
    const isMobile = isMobileUi();
    const isLightMode = isLightModeUi();
    return (<IsMobileContext value={isMobile}>
      <IsLightModeContext value={isLightMode}>
        {props.children}
      </IsLightModeContext>
    </IsMobileContext>);
};

export default UiContext;