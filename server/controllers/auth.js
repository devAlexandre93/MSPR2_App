// Imports

const { Users } = require("../models");
const uaParser = require('ua-parser-js');
const nodemailer = require("nodemailer");
const ip = require('ip');
const ActiveDirectory = require('activedirectory');

// Var to configure ActiveDirectory
var config = {
    url: 'ldap://192.168.43.219:389',
    baseDN: 'dc=lechatelet,dc=local',
    username: 'Administrator@lechatelet.local',
    password: 'Rootroot2022'
}
var ad = new ActiveDirectory(config);

// Const to send an email
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "servicelechatelet@gmail.com",
        pass: "mspr2alex",
    },
});

// Generate validationCode
function generateCode() {
    const characters = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    };
    return code;
};

// Create an user
exports.signUp = async (req, res) => {
    const { username } = req.body;
    await Users.create({
        username: username
    });
    res.json("User successfully created")
};

// Log in an user with username
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    var parser = new uaParser;
    var ua = req.headers['user-agent'];
    var browserName = parser.setUA(ua).getBrowser().name;
    var ipA = ip.address();

    try {

        ad.authenticate(username, password, function (err, auth) {
            if (err) {
                console.log('ERROR: ' + JSON.stringify(err));
                return;
            }
            if (auth) {
                // If credentials are correct
                console.log('Authenticated!');
                res.status(200).send({ authSuccess: "Un email contenant un code de confirmation vous a été envoyé ! " });
                var code = generateCode();

                // Send email for first login and update empty field
                if (user.mainWebBrowser == null && user.ipAddress == null && user.validationCode == null) {
                    user.update({ mainWebBrowser: browserName, ipAddress: ipA, validationCode: code });
                    transport.sendMail({
                        from: "support@lechatelet.fr",
                        to: user.email,
                        subject: "Connectez-vous à votre portail !",
                        html: `<h1>Bonjour ${username},</h1>
                    <p>Veuillez confirmez votre connexion en renseignant votre code de validation : <b>${code}</b> </p>
                    <p> <a href=http://localhost:3000/confirm> Cliquez ici</a> puis renseigner votre code de validation </p>
                    <div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                    </div>`,
                    }).catch(err => console.log(err));
                }

                // Send email when IP address and web browser doesn't match with the one of the database
                else if (user.ipAddress != ipA && user.mainWebBrowser != browserName) {
                    user.update({ validationCode: code });
                    transport.sendMail({
                        from: "support@lechatelet.fr",
                        to: user.email,
                        subject: "Tentative de connexion depuis une autre adresse IP et un autre navigateur",
                        html: `<h1>Bonjour ${username},</h1>
                    <p>Quelqu'un s'est connecté depuis un autre appareil et un navigateur différent<br/><b> ${ipA} : ${browserName}</b><br/>Veuillez confirmez votre connexion en renseignant votre code de validation : <b>${code}</p>
                    <p> <a href=http://localhost:3000/confirm> Cliquez ici</a> puis renseigner votre code de validation </p>
                    <p>Si vous n'avez pas tenté de vous connecter, veuillez ignorer ce message</>
                    <div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                    </div>`,
                    }).catch(err => console.log(err));
                }

                // Send email when IP address doesn't match with the one of the database
                else if (user.ipAddress != ipA && user.ipAddress != null) {
                    user.update({ validationCode: code });
                    transport.sendMail({
                        from: "support@lechatelet.fr",
                        to: user.email,
                        subject: "Tentative de connexion depuis une autre adresse IP",
                        html: `<h1>Bonjour ${username},</h1>
                    <p>Quelqu'un s'est connecté depuis un autre appareil <br/><b>${browserName} : ${ipA}</b><br/>Veuillez confirmez votre connexion en renseignant votre code de validation : <b>${code}</p>
                    <p> <a href=http://localhost:3000/confirm> Cliquez ici</a> puis renseigner votre code de validation </p>
                    <p>Si vous n'avez pas tenté de vous connecter, veuillez ignorer ce message</>
                    <div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                    </div>`,
                    }).catch(err => console.log(err));
                }

                // Send email when the main web browser doesn't match with the one of the database
                else if (user.mainWebBrowser != browserName && user.mainWebBrowser != "") {
                    user.update({ validationCode: code });
                    transport.sendMail({
                        from: "support@lechatelet.fr",
                        to: user.email,
                        subject: "Tentative de connexion depuis un autre navigateur",
                        html: `<h1>Bonjour ${username},</h1>
                    <p>Vous vous êtes connecté depuis un autre navigateur <br/><b>${browserName}</b><br/>Veuillez confirmez votre connexion en renseignant votre code de validation : <b>${code}</p>
                    <p> <a href=http://localhost:3000/confirm> Cliquez ici</a> puis renseigner votre code de validation </p>
                    <p>Si vous n'avez pas tenté de vous connecter, veuillez ignorer ce message</>
                    <div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                    </div>`,
                    }).catch(err => console.log(err));

                    // Send email when there is no problem
                } else {
                    user.update({ validationCode: code });
                    transport.sendMail({
                        from: "support@lechatelet.fr",
                        to: user.email,
                        subject: "Confirmation de connexion",
                        html: `<h1>Bonjour ${username},</h1>
                    <p>Veuillez confirmez votre connexion en renseignant votre code de validation : <b>${code}</b> </p>
                    <p> <a href=http://localhost:3000/confirm> Cliquez ici</a> puis renseigner votre code de validation </p>
                    <p>Si vous n'avez pas tenté de vous connecter, veuillez ignorer ce message</>
                    <div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                    </div>`,
                    }).catch(err => console.log(err));
                }
            }
            else {
                // If credentials are correct
                console.log('Authentication failed!');
                res.status(200).send({ errorLogin: "Nom d'utilisateur ou mot de passe incorrect !" });
            }
        });

    } catch (error) {
        console.log(error)
    }
};

// Log in an user with username
exports.loginWithCode = async (req, res) => {
    const { username, code } = req.body;

    try {
        const user = await Users.findOne({ where: { username: username } });

        // If credentials are incorrect
        if (!user || user.validationCode != code) {
            res.status(200).send({ errorLoginWithCode: "Nom d'utilisateur ou code de vérification incorrect !" });

            // If credentials are correct
        } else {
            res.status(200).send({ authSuccess: "Success !" });
            user.update({ validationCode: "" });
        }
    } catch (error) {
        console.log(error)
    }
};