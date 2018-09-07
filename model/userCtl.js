var conn = require('../util/connections/connection');

exports.saveUser = function (name, city, pincode, callback) {
    var userObj = {
        "name": name,
        "city": city,
        "pincode": pincode
    };
    conn.connection.query("INSERT INTO user SET ?", [userObj], callback);

};

exports.saveUserCredential = function (uname, pass, userId, callback) {
    var userCredentialObject = {
        "uname": uname,
        "pass": pass,
        "user_id": userId
    };
    conn.connection.query("INSERT INTO login SET ?", [userCredentialObject], callback);
};

exports.authenticateUser = function (uname, pass, callback) {
    conn.connection.query("SELECT * FROM login WHERE uname = ? AND pass = ?", [uname, pass], callback);
};

exports.getAllUsers = function (callback) {
    conn.connection.query("SELECT * FROM user", callback);
};

exports.updateUser = function (name, city, pincode, id, callback) {
    conn.connection.query("UPDATE  user SET  name = ?, city = ?, pincode = ? WHERE  id =?", [name, city, pincode, id], callback);
};

exports.deleteUser = function (id, callback) {
    conn.connection.query("DELETE FROM user where id = ?", id, callback);
};