import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";

interface AuthCardProps {
  shell: AuthShellView;
  children: ReactNode;
}

const widthStyle = (width: number | string | undefined): CSSProperties | undefined => {
  if (width === undefined) return undefined;
  const value = typeof width === "number" ? `${width}px` : width;
  return { "--gdy-auth-width": value } as CSSProperties;
};

export const AuthCard = ({ shell, children }: AuthCardProps) => {
  const { display, texts } = shell;
  const Heading = display.titleAs ?? "h1";
  return (
    <div
      className={cn("gdy-scope gdy-auth", display.className, display.classNames?.root)}
      data-form={shell.kind}
      style={widthStyle(display.width)}
    >
      <div className="gdy-auth-header">
        <Heading className={cn("gdy-auth-title", display.classNames?.title)}>{texts.title}</Heading>
        {texts.subtitle && (
          <p className={cn("gdy-auth-subtitle", display.classNames?.subtitle)}>{texts.subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
};
