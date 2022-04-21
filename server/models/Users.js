module.exports = (sequelize, Datatypes) => {

    const Users = sequelize.define("Users", {
        username: {
            type: Datatypes.STRING,
            allowNull: false
        },
        email: {
            type: Datatypes.STRING,
            allowNull: true
        },
        validationCode: { 
            type: Datatypes.STRING, 
            unique: true ,
            allowNull: true
        },
        ipAddress: {
            type: Datatypes.STRING,
            allowNull: true
        },
        mainWebBrowser: {
            type: Datatypes.STRING,
            allowNull: true
        }
    });

    return Users;
};