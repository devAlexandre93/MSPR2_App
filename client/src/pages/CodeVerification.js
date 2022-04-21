import '../style/App.css';
import axios from "axios";
import React, { useState } from "react";

function CodeVerification() {

    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    const handleCodeVerification = (event) => {
        event.preventDefault();
        const authMessage = document.querySelector(".authMessage");

        axios({
            method: "post",
            url: "http://localhost:3001/auth/loginWithCode",
            data: { username, code }
        })
            .then((res) => {
                if (res.data.errorCode) {
                    authMessage.innerHTML = res.data.errorLogin
                } else {
                    window.location = '/home';
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
            <form onSubmit={handleCodeVerification}>
                <h3 className="name"> Clinique Le Chatelet </h3>
                <h3> Bienvenue !</h3>

                <label htmlFor="username">Veuillez confirmer votre nom d'utilisateur</label>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    id="username"
                    onChange={(event) => {
                        setUsername(event.target.value);
                    }}
                />

                <label htmlFor="code">Code de vérification</label>
                <input
                    type="code"
                    placeholder="Code de vérification" id="code"
                    onChange={(event) => {
                        setCode(event.target.value);
                    }}
                />

                <div className="authMessage"></div>

                <button type="submit">Connexion</button>
            </form>
        </div >
    );
}

export default CodeVerification;
