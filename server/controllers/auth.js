// Imports

const { Users } = require("../models");
const uaParser = require('ua-parser-js');
const nodemailer = require("nodemailer");
const ip = require('ip');

// Const to send an email
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "servicelechatelet@gmail.com",
        pass: "mspr2alex",
    },
});

// Generate validationToken
function generateToken() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    };
    return token;
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
    const { username } = req.body;
    var parser = new uaParser;
    var ua = req.headers['user-agent'];
    var browserName = parser.setUA(ua).getBrowser().name;
    var ipA = ip.address();

    try {
        const user = await Users.findOne({ where: { username: username } });

        // If credentials incorrect
        if (!user) {
            res.status(200).send({ errorLogin: "Nom d'utilisateur ou mot de passe incorrect !" });

        // If credentials incorrect
        } else {
            res.status(200).send({ authSuccess: "Un email de confirmation vous a été envoyé ! " });
            var token = generateToken();

            // Send email for first login and update empty field
            if (user.mainWebBrowser == null && user.ipAddress == null && user.validationToken == null) {
                await user.update({ mainWebBrowser: browserName, ipAddress: ipA, validationToken : token });
                transport.sendMail({
                    from: "support@lechatelet.fr",
                    to: user.email,
                    subject: "Confirmation de connexion",
                    html: `<h1>Bonjour ${username},</h1>
                        <p>Veuillez confirmez votre connexion en cliquant sur le lien ci-dessous:</p>
                        <a href=http://localhost:3000/confirm/${token}> Lien de confirmation</a>
                        </div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                        </div>`,
                }).catch(err => console.log(err));
            }

            // Send email when IP address doesn't match with the one of the database
            else if (user.ipAddress != ipA && user.ipAddress != null) {
                await user.update({ validationToken : token });
                transport.sendMail({
                    from: "support@lechatelet.fr",
                    to: user.email,
                    subject: "Connexion depuis un autre appareil",
                    html: `<h1>Bonjour ${username},</h1>
                        <p>Quelqu'un s'est connecté depuis un autre appareil <br/><b>${browserName} : ${ipA}</b><br/>Confirmez cette connexion en cliquant sur le lien ci-dessous:</p>
                        <a href=http://localhost:3000/confirm/${token}> Lien de confirmation</a>
                        <p>Si ce n'est pas vous ne cliquez pas</>
                        </div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                        </div>`,
                }).catch(err => console.log(err));
            }

            // Send email when the main web browser doesn't match with the one of the database
            else if (user.mainWebBrowser != browserName && user.mainWebBrowser != "") {
                await user.update({ validationToken : token });
                transport.sendMail({
                    from: "support@lechatelet.fr",
                    to: user.email,
                    subject: "Confirmation de connexion depuis un autre navigateur",
                    html: `<h1>Bonjour ${username},</h1>
                        <p>Vous vous êtes connecté depuis un autre navigateur <br/><b>${browserName}<br/>Confirmez votre connexion en cliquant sur le lien ci-dessous:</p>
                        <a href=http://localhost:3000/confirm/${token}> Lien de confirmation</a>
                        </div>
                        <p>Clinique Le Chatelet <br/>53 rue des Potiers <br/>0143286335</p>
                        </div>`,
                }).catch(err => console.log(err));
            }

        }
    } catch (error) {
        console.log(error)
    }
};