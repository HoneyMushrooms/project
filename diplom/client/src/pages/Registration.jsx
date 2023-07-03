import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../router.js";

export default function Register() {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const [values, setValues] = useState({
    name: "",
    surname: "",
    cardId: "",
    password: "",
    group: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { name, surname, cardId, password, group } = values;
    if (name === "" || surname === "" || cardId === "" || password === "" || group === "") {
      toast.info(
        "Заполните все поля!",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { name, surname, cardId, password, group } = values;
      const { data } = await axios.post(registerRoute, {
        name: name.trim(),
        surname: surname.trim(),
        cardId,
        password,
        group
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.cardId)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
          </div>
          <input
            type="text"
            placeholder="Имя"
            name="name"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Фамилия"
            name="surname"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Личный идентификатор"
            name="cardId"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Пароль"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Номер группы"
            name="group"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Создать</button>
          <span>
            Есть аккаунт ? <Link to="/login">Войти</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div` 
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  hr {
    border: none;
    border-top: 0.13rem solid #778899;
  }
  .brand {
    background-color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 7rem;
      margin-bottom: 10px;
    }
  }
  form {
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border: 0.15rem solid #778899;
    border-radius: 2rem;
    padding: 2rem 3rem 1.9rem 3rem;
  }
  input {
    backgound-color: #E8F0FE;
    padding: 1rem;
    border: 0.14rem solid #778899;
    border-radius: 0.4rem;
    font-size: 1rem;
  }
  button {
    background-color: #0F6FC5;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #00416A;
    }
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
`;