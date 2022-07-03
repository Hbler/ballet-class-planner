import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "../../components/input";
import { ContextUser } from "../../providers/userProvider";
import Select from "../../components/select";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  type: string;
};

interface newUser {
  name: string;
  email: string;
  password: string;
  type: string;
  [k: string]: any;
}

export default function SignUp() {
  const { signUp } = ContextUser();

  const formSchema = yup.object().shape({
    name: yup.string().required("Ops! Faltou seu nome"),
    email: yup.string().email().required("Ops! Esqueceu do email"),
    password: yup
      .string()
      .required("Ops! Faltou a senha")
      .matches(
        new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9]).{8}$"),
        "Precisa de: 1 char especial, 1 letra maiúscula, 2 números, pelo menos 8 chars"
      ),
    confirmPassword: yup
      .string()
      .required("Preencha a confirmação")
      .oneOf([yup.ref("password"), null], "A senha está diferente"),
    type: yup.string().required("escolha o tipo de usuário"),
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
    const { name, email, password, type } = data;

    const user: newUser = {
      name,
      email,
      password,
      type,
    };

    type === "teacher" ? (user.students = []) : (user.teachers = []);

    signUp(user);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="name"
          placeholder="Nome"
          type="text"
          register={register}
          errors={errors?.name?.message}
        />
        <Input
          name="email"
          placeholder="Email"
          type="email"
          register={register}
          errors={errors?.email?.message}
        />
        <Input
          name="password"
          placeholder="Senha"
          type="password"
          register={register}
          errors={errors?.password?.message}
        />
        <Input
          name="confirmPassword"
          placeholder="Confirmar Senha"
          type="password"
          register={register}
          errors={errors?.confirmPassword?.message}
        />
        <Select
          name="type"
          options={["Professor(a)", "Aluno(a)"]}
          register={register}
          errors={errors?.type?.message}
        />
        <button type="submit">Entrar</button>
      </form>
    </>
  );
}
