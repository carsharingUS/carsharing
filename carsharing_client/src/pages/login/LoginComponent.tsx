import React, { FormEvent, useEffect, useState } from "react";
import { registerRequest, loginRequest } from "../../api/UserService";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import "../login/Login.css";

const Login = () => {
  interface CustomError extends Error {
    response?: {
      data?: any;
    };
  }

  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const setToken = useAuthStore((state) => state.setToken);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");
  const [activeForm, setActiveForm] = useState(
    localStorage.getItem("activeForm") || "login"
  );

  useEffect(() => {
    const container = document.getElementById("container");

    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    const handleRegisterClick = () => {
      container?.classList.add("active");
      setActiveForm("register");
      localStorage.setItem("activeForm", "register");
    };

    const handleLoginClick = () => {
      container?.classList.remove("active");
      setActiveForm("login");
      localStorage.setItem("activeForm", "login");
    };

    const storedForm = localStorage.getItem("activeForm");
    if (storedForm && (storedForm === "register" || storedForm === "login")) {
      setActiveForm(storedForm);
      container?.classList.toggle("active", storedForm === "register");
    } else {
      setActiveForm("login");
      container?.classList.remove("active");
    }

    registerBtn?.addEventListener("click", handleRegisterClick);
    loginBtn?.addEventListener("click", handleLoginClick);

    return () => {
      // Limpiar los event listeners cuando el componente se desmonta
      registerBtn?.removeEventListener("click", handleRegisterClick);
      loginBtn?.removeEventListener("click", handleLoginClick);
    };
  }, []);

  const registerMutation = useMutation({
    mutationFn: () =>
      registerRequest(username, email, name, last_name, password),
    onSuccess: () => {
      toast.success("Por favor, compruebe su correo y verifique su cuenta.");
      setActiveForm("login");
    },
    onError: (error: CustomError) => {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        console.log(errorMessage);
        if (errorMessage.includes("Duplicate entry")) {
          // Si el mensaje de error contiene "Duplicate entry", es un error de usuario duplicado
          toast.error("El usuario ya existe.");
        } else {
          // Si no, es un error en el servidor al crear
          toast.error(
            "¡Error en el registro! Por favor, compruebe los campos del formulario."
          );
        }
      } else {
        // Si no hay un mensaje de error específico del servidor, es un error por campos incorrectos
        toast.error("¡Error en el registro! Por favor, inténtelo de nuevo.");
      }
    },
  });

  const handleMatch = () => password === re_password;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!handleMatch()) {
      toast.error("Las contraseñas deben coincidir.");
    } else {
      registerMutation.mutate();
    }
  };

  // Handle login mutation
  const loginMutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (response) => {
      setToken(response.data.access, response.data.refresh);
      toast.success("¡Login exitoso!");
      navigate("/home");
    },
    onError: (error) => {
      toast.error("Ha habido un error, porfavor intentelo de nuevo.");
      console.error(error.message);
    },
  });

  const handleSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  /* if (registerMutation.isPending) return <p>Pending...</p> */
  /* if (loginMutation.isPending) return <p>Pending...</p> */
  if (isAuth) return <Navigate to="/home" />;

  return (
    <div className="bodyLogin">
      <div
        className={`containerLogin ${
          activeForm === "register" ? "active" : ""
        }`}
        id="container"
      >
        <div className="form-containerLogin sign-upLogin">
          <form onSubmit={handleSubmit}>
            <h1>Crear cuenta</h1>
            {/* <div className='social-iconsLogin'>
                            <a href="#" className="iconLogin"><i className="fa-brands fa-google-plus-g"></i><img src="/googleIcon.svg" alt="GoogleLogo" /></a>
                        </div> */}

            <input
              type="username"
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="last_name"
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              id="re_password"
              name="re_password"
              placeholder="********"
              value={re_password}
              onChange={(e) => setRePassword(e.target.value)}
            />

            {handleMatch() ? (
              false
            ) : (
              <p className="text-sm font-medium text-red-500">
                Las contraseñas deben coincidir
              </p>
            )}

            <button>Registrarse</button>
          </form>
        </div>

        <div className="form-containerLogin sign-inLogin">
          <form onSubmit={handleSubmitLogin}>
            <h1>Iniciar sesión</h1>
            {/* <div className='social-iconsLogin'>
                            <a href="#" className="iconLogin"><i className="fa-brands fa-google-plus-g"></i><img src="/googleIcon.svg" alt="GoogleLogo" /></a>
                        </div> */}
            <input
              type="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button>Iniciar sesión</button>
          </form>
        </div>

        <div className="toggle-containerLogin">
          <div className="toggleLogin">
            <div className="toggle-panelLogin toggle-leftLogin">
              <h1>Bienvenido de vuelta!</h1>
              <p>Inicia sesión para usar todas las funcionalidades.</p>
              <button className="hiddenLogin" id="login">
                Iniciar sesión
              </button>
            </div>
            <div className="toggle-panelLogin toggle-rightLogin">
              <h1>Hola, Amigo!</h1>
              <p>
                Regístrate para usar todas las funcionalidades de la aplicación.
              </p>
              <button className="hiddenLogin" id="register">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
