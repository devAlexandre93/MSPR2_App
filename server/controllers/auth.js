const { Users } = require ("../models")

// Create an user
exports.signUp = async (req, res) => {
    const { username } = req.body;
    await Users.create({
        username : username
    });
    res.json("User successfully created")
};

// Log in an user with username
exports.login = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await Users.findOne({ where: { username : username } });
        if (!user) {
            res.status(200).send({ errorUsername : "Ce nom d'utilisateur n'existe pas !" });       
        } else {
            res.status(200).send({ authSuccess : "Connexion réussie ! "});
        }
    } catch (error){
        console.log(error)
    }
};