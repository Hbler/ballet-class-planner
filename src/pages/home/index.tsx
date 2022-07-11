import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Btn from "../../components/buttons";
import Header from "../../components/header";
import Input from "../../components/input";
import { SelectParent } from "../../components/select";
import Exercise from "../../models/Exercise";
import { Teacher } from "../../models/User";
import { ContextUser } from "../../providers/userProvider";

type classForm = {
  className: string;
};

type exerciseForm = {
  classId: number;
  exerciseName: string;
};

type sequenceForm = {
  exerciseId: number;
  sequence: string;
  musicName?: string;
  album?: string;
  artist?: string;
  url?: string;
};

export default function Home() {
  const { user, classes } = ContextUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [update, updateState] = useState<{}>();

  const forceUpdate = useCallback(() => updateState({}), []);

  const newClassFormSchema = yup.object().shape({
    className: yup.string().required("Ops! A aula precisa de um nome"),
  });

  const {
    register: classRegister,
    handleSubmit: classSubmit,
    formState: { errors: classErrors },
    resetField: clearClass,
  } = useForm<classForm>({
    resolver: yupResolver(newClassFormSchema),
    reValidateMode: "onSubmit",
  });

  const submitClass = (data: classForm) => {
    const { className } = data;

    console.log(Object.getPrototypeOf(user));

    user instanceof Teacher && user.addClass(className);

    clearClass("className");
  };

  const newExerciseFormSchema = yup.object().shape({
    classId: yup.number(),
    exerciseName: yup.string().required("Ops! O exercício precisa de um nome"),
  });

  const {
    register: exerciseRegister,
    handleSubmit: exerciseSubmit,
    formState: { errors: exerciseErrors },
    resetField: clearExercise,
  } = useForm<exerciseForm>({
    resolver: yupResolver(newExerciseFormSchema),
    reValidateMode: "onSubmit",
  });

  const submitExercise = (data: exerciseForm) => {
    const { classId, exerciseName } = data;
    const toClass = classes.find((cl) => (cl.id = classId));

    toClass?.addExercise(exerciseName);

    clearExercise("exerciseName");
  };

  const newSequenceFormSchema = yup.object().shape({
    exerciseId: yup.number(),
    sequence: yup.string().required("Ops! Faltou escrever a sequência!"),
    musicName: yup.string(),
    album: yup.string(),
    artist: yup.string(),
    url: yup.string().url("Ops! Tem que ser uma url"),
  });

  const {
    register: sequenceRegister,
    handleSubmit: sequenceSubmit,
    formState: { errors: sequenceErrors },
    resetField: clearSequence,
  } = useForm<sequenceForm>({
    resolver: yupResolver(newSequenceFormSchema),
    reValidateMode: "onSubmit",
  });

  const submitSequence = (data: sequenceForm) => {
    const { exerciseId, sequence, musicName, album, artist, url } = data;

    const sequenceLines = sequence.split(";");

    const toExercise = exercises.find((ex) => (ex.id = exerciseId));
    toExercise?.addSequence(sequenceLines, musicName, album, artist, url);

    clearSequence("sequence");
    clearSequence("musicName");
    clearSequence("album");
    clearSequence("artist");
    clearSequence("url");
  };

  useEffect(() => {
    const exerciseList: Exercise[] = [];

    classes?.forEach((cl) => {
      exerciseList.push(...cl.exercises);
    });

    setExercises([...exerciseList]);
  }, [classes, update]);

  return (
    <>
      <Header username={user.name.split(" ")[0]} />
      <section>
        {classes.length > 0 ? (
          <>
            <h3> Suas Aulas:</h3>
            <ul>
              {classes.map((cl) => (
                <li key={cl.name + cl.id}>{cl.name}</li>
              ))}
            </ul>
          </>
        ) : (
          <h3>Crie uma Aula {user.name.split(" ")[0]}</h3>
        )}
      </section>
      <Btn color="pink" onClick={forceUpdate}>
        Atualizar Página
      </Btn>
      {user.type === "teacher" && (
        <section>
          <form onSubmit={classSubmit(submitClass)}>
            <Input
              label="Criar uma Aula:"
              name="className"
              placeholder="Digite o nome da aula"
              type="text"
              register={classRegister}
              errors={classErrors?.className?.message}
            />
            <Btn type="submit">Criar</Btn>
          </form>
          <form onSubmit={exerciseSubmit(submitExercise)}>
            <h3>Criar um exercício:</h3>
            <SelectParent
              label="Para qual aula?"
              name="classId"
              options={[...classes]}
              register={exerciseRegister}
            />
            <Input
              name="exerciseName"
              placeholder="Digite o nome do exercício"
              type="text"
              register={exerciseRegister}
              errors={exerciseErrors?.exerciseName?.message}
            />
            <Btn type="submit">Criar</Btn>
          </form>
          {exercises.length > 0 && (
            <form onSubmit={sequenceSubmit(submitSequence)}>
              <h3>Adicionar sequencia:</h3>
              <SelectParent
                label="Em qual exercício?"
                name="exerciseId"
                options={[...exercises]}
                register={sequenceRegister}
              />
              <Input
                name="sequence"
                label="Digite a sequência"
                placeholder="Utilize ; para iniciar uma nova linha"
                type="text"
                register={sequenceRegister}
                errors={sequenceErrors?.sequence?.message}
              />
              <Input
                name="musicName"
                placeholder="Qual é o nome da música dessa sequência?"
                type="text"
                register={sequenceRegister}
              />
              <Input
                name="album"
                placeholder="Qual é o nome do album da música?"
                type="text"
                register={sequenceRegister}
              />
              <Input
                name="artist"
                placeholder="Qual é o nome do artista da música?"
                type="text"
                register={sequenceRegister}
              />
              <Input
                name="url"
                placeholder="Adicione um link para a música"
                type="url"
                register={sequenceRegister}
                errors={sequenceErrors?.url?.message}
              />
            </form>
          )}
        </section>
      )}
    </>
  );
}
