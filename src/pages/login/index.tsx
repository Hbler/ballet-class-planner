import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "../../components/input";
import { ContextUser } from "../../providers/userProvider";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { login } = ContextUser();

  const formSchema = yup.object().shape({
    email: yup.string().email().required("Ops! Esqueceu do email"),
    password: yup.string().required("Ops! Esqueceu da senha"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    const { email, password } = data;
    login(email, password);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="email"
          placeholder="email"
          type="email"
          register={register}
          errors={errors?.email?.message}
        />
        <Input
          name="password"
          placeholder="senha"
          type="password"
          register={register}
          errors={errors?.password?.message}
        />
        <button type="submit">Entrar</button>
      </form>
    </>
  );
}
