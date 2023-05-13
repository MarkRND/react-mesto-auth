import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import auth from "../utils/auth";
import Header from "./Header";

function Login({ handleInfoMessage, onLogin, setEmail }) {
  const defaultValues = {
    email: "",
    password: "",
  };
  const [inputs, setInputs] = useState(defaultValues);

  const navigate = useNavigate();

  const handleChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    setInputs((state) => ({ ...state, [name]: value }));
  };
  const resetForm = () => {
    setInputs({ ...defaultValues });
  };
  const handleAuthorizeSubmit = (evt) => {
    evt.preventDefault();
    auth
      .authorize(inputs)
      .then((res) => {
        if (res.token) localStorage.setItem("token", res.token);
        resetForm();
        onLogin();
        navigate("/");
        setEmail(inputs.email);
      })
      .catch((err) => {
        const text = err.message || "Что-то пошло не так! Попробуйте еще раз.";
        handleInfoMessage({
          text: text,
          isSuccess: false,
        });
      });
  };

  return (
    <>
      <Header>
        <Link
          to="/sign-up"
          className="header__menu-component header__menu-component_ent"
        >
          Регистрация
        </Link>
      </Header>

      <main>
        <div className="login">
          <h2 className="login__name">Вход</h2>
          <form className="login__form" onSubmit={handleAuthorizeSubmit}>
            <input
              type="email"
              className="login__input"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="login__input"
              placeholder="Пароль"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              required
            />
            <button className="login__save-button" type="submit">
              Войти
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
