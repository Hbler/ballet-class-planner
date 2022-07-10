import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

import Btn from "../../components/buttons";
import { AccessForm } from "../../components/form";
import Header from "../../components/header";
import Input from "../../components/input";
import { ContextUser } from "../../providers/userProvider";
import { AccessMain } from "../../styles/global";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
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
    login(email, password, navigate);
  };

  return (
    <>
      <Header />
      <AccessMain>
        <div className="container">
          <div>
            <h2>Login</h2>
            <p>
              Para a professora ou professor o jeito mais fácil de planejar
              aulas. Crie aulas com diversos exercícios, exercícios com diversas
              sequencias, e sequencias com detalhes e música recomendada.
            </p>
            <p>
              Para as alunas e alunos o jeito mais fácil de se preparar para as
              aulas, saiba quais são os exercícios da sua próxima aula e o que
              você vai precisar fazer em cada um.
            </p>
          </div>
          <AccessForm onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="email"
              placeholder="Digite seu email"
              type="email"
              register={register}
              errors={errors?.email?.message}
            />
            <Input
              name="password"
              placeholder="Digite sua senha"
              type="password"
              register={register}
              errors={errors?.password?.message}
            />
            <Btn type="submit">Entrar</Btn>
            <p>
              Ainda não tem uma conta? <wbr />
              <Link to="/signup">Cadastre-se</Link>
            </p>
          </AccessForm>
        </div>
      </AccessMain>
    </>
  );
}
