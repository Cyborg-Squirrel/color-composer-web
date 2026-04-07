import type { ReactNode } from "react";
import { IsLightModeContext, isLightModeUi } from "./IsLightModeContext";
import { IsMobileContext, isMobileUi } from "./IsMobileContext";

function UiContext({ children }: { children: ReactNode }) {
  const isMobile = isMobileUi();
  const isLightMode = isLightModeUi();
  return (<IsMobileContext value={isMobile}>
    <IsLightModeContext value={isLightMode}>
      {children}
    </IsLightModeContext>
  </IsMobileContext>);
};

export default UiContext;