module.exports = new class AuthorizationManager {
    CheckPermission(type, command, username, channel) {
        console.log("CheckPermission", type, username, channel);
        switch (type) {
            case "cahilertem":
                return username === "cokceken" || username === "piadam";
            case "hipnoz":
                return username === "cokceken" || username === "piadam";
            case "hadioradan":
                return username === "cokceken" || username === "piadam";
            default:
                return false;
        }
    }
};
