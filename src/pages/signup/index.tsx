import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import Btn from "../../components/buttons";
import { AccessForm } from "../../components/form";
import Header from "../../components/header";
import Input from "../../components/input";
import Select from "../../components/select";
import { UserContext } from "../../providers/userProvider";
import { AccessMain } from "../../styles/global";

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
  const navigate = useNavigate();
  const [registered, setRegistered] = useState<boolean>(false);

  useEffect(() => {
    if (registered) {
      localStorage.removeItem("@BCPlanner:registered");
      navigate("/");
    }
  }, [navigate, registered]);

  const { signUp } = useContext(UserContext);

  const checkRegister = () => {
    const isRegistered = localStorage.getItem("@BCPlanner:registered");
    console.log(isRegistered);

    isRegistered && setRegistered(true);
  };

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
    checkRegister();
  };

  return (
    <>
      <Header />
      <AccessMain>
        <div className="container">
          <div>
            <h2>Cadastro</h2>
            <p>
              Preencha o formulário para criar sua conta e acessar o planner!
            </p>
          </div>
          <AccessForm onSubmit={handleSubmit(onSubmit)}>
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
              label="Escolha o tipo de conta:"
              options={["Professor(a)", "Aluno(a)"]}
              register={register}
              errors={errors?.type?.message}
            />
            <Btn type="submit">Cadastrar</Btn>
            <p>
              <Link to="/">Já tenho uma conta </Link>
            </p>
          </AccessForm>
        </div>
      </AccessMain>
    </>
  );
}
