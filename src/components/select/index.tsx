import { SelectHTMLAttributes } from "react";
import { v4 as uuidv4 } from "uuid";

import Class from "../../models/Class";
import Exercise from "../../models/Exercise";
import { ContextUser } from "../../providers/userProvider";
import { SelectContainer } from "./style";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  register: any;
  options: string[];
  label?: string;
  errors?: any;
}

interface SelectParentProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  register: any;
  options: Class[] | Exercise[];
  label?: string;
  errors?: any;
}

export const Select = ({
  name,
  options,
  label,
  register,
  errors,
  ...rest
}: SelectProps) => {
  return (
    <SelectContainer>
      {!!label && <label htmlFor={name}>{label}</label>}
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
      {!!errors && <small>{errors}</small>}
    </SelectContainer>
  );
};

export const SelectParent = ({
  name,
  options,
  label,
  register,
  ...rest
}: SelectParentProps) => {
  const { classes } = ContextUser();

  const classNames: string[] = [];

  classes.forEach((cl) => {
    classNames[cl.id] = cl.name;
  });

  return (
    <SelectContainer>
      {!!label && <label htmlFor={name}>{label}</label>}
      <select name={name} id={name} {...register(name)} {...rest}>
        {options.map((pr) => (
          <option key={uuidv4()} value={pr.id}>
            {pr.name}
            {pr instanceof Exercise && " - " + classNames[pr.classId]}
          </option>
        ))}
      </select>
    </SelectContainer>
  );
};
