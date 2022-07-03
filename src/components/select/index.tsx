import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  register: any;
  options: string[];
  label?: string;
  errors?: any;
}

export default function Select({
  name,
  options,
  label,
  register,
  errors,
  ...rest
}: SelectProps) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...register(name)} {...rest}>
        {options.map((value) => (
          <option
            key={value.toLowerCase()}
            value={value === "Professor(a)" ? "teacher" : "student"}
          >
            {value}
          </option>
        ))}
      </select>
      <small>{errors}</small>
    </div>
  );
}
