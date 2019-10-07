module.exports = new class AuthorizationManager {
    CheckPermission(type, command, username, channel) {
        switch (type) {
            case "cahilertem":
                return username === "cokceken" || "#" + username === channel;
            default:
                return false;
        }
    }
};
