import '../style/App.css';
import axios from "axios";
import React, { useState } from "react";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    const authMessage = document.querySelector(".authMessage");

    axios({
      method: "post",
      url: "http://localhost:3001/auth/login",
      data: { username, password }
    })
      .then((res) => {
        if (res.data.errorLogin || res.data.errorBrute || res.data.authSuccess) {
          if (res.data.errorLogin) { authMessage.innerHTML = res.data.errorLogin }
          if (res.data.authSuccess) { authMessage.innerHTML = res.data.authSuccess }
          if (res.data.errorBrute) { authMessage.innerHTML = res.data.errorBrute }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={handleLogin}>
        <h3 className="name"> Clinique Le Chatelet</h3>
        <h3> Bienvenue !</h3>

        <label htmlFor="username">Nom d'utilisateur</label>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          id="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          placeholder="Mot de passe"
          id="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }} />

        <div className="authMessage"></div>

        <button type="submit">Connexion</button>
      </form>
    </div >
  );
}

export default Login;
