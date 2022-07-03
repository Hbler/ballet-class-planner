import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register: any;
  placeholder: string;
  label?: string;
  errors?: any;
}

export default function Input({
  name,
  placeholder,
  label,
  register,
  errors,
  ...rest
}: InputProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        id={name}
        placeholder={placeholder}
        {...register(name)}
        {...rest}
      />
      <small>{errors}</small>
    </div>
  );
}
