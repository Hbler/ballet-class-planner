import { FormHTMLAttributes, ReactNode } from "react";
import { StyledAccess } from "./style";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const AccessForm = ({ children, ...rest }: FormProps) => {
  return <StyledAccess {...rest}>{children}</StyledAccess>;
};

export const InternalForm = ({ children, ...rest }: FormProps) => {
  return <form {...rest}>{children}</form>;
};
