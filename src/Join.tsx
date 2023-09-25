import { useState } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  Name: string;
  Email: string;
  Password: string;
  Tel: string;
}

function Join() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IForm>({
    defaultValues: {
      Email: "@naver.com",
    },
  });

  console.log(errors);

  const onValid = (data: IForm) => {
    if (data.Password.length < 10) {
      setError(
        "Password",
        { message: "password is too short" },
        { shouldFocus: true }
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onValid)}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          {...register("Name", {
            required: true,
            validate: (value) =>
              value.includes("yon") ? "You can't write yon" : true,
          })}
          placeholder="Write Name"
        />
        <span>{errors?.Name?.message}</span>
        <input
          {...register("Email", { required: true })}
          placeholder="Write email"
        />
        <input
          {...register("Password", {
            required: "password is required",
          })}
          placeholder="Write Password"
        />
        <span>{errors?.Password?.message}</span>
        <input
          {...register("Tel", { required: true })}
          placeholder="Write Tel"
        />
        <button>ADD</button>
      </form>
    </div>
  );
}

export default Join;
