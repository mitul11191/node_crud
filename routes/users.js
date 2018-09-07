var express = require('express');
var router = express.Router();
var config = require('../util/connections/connection');
var jwt = require('jsonwebtoken');
var userModel = require('../model/userCtl');
var multer = require('multer');
var fs = require("fs");
var path = require('path');
var appDir = path.dirname(require.main.filename);
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, appDir + '/../public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({ storage: storage }).fields([
    { name: 'file', maxCount: 1 }
]);




/* GET users listing. */
router.post('/signup', function (req, res) {
    if (!req.body.name || !req.body.city || !req.body.pincode || !req.body.uname || !req.body.pass) {
        return res.status(400).json({ "message": "User Error" });
    }

    userModel.saveUser(req.body.name, req.body.city, req.body.pincode, function (err, user) {
        console.log("Sign up error", err);
        if (err) {
            console.log("Error into save user...");
            return res.status(500).json({ "message": "Server Error" });
        }
        console.log("User saved successfully...");
        var userId = user.insertId;

        userModel.saveUserCredential(req.body.uname, req.body.pass, userId, function (err, userCredential) {
            if (err) {
                console.log("Error into save user credential...");
                return res.status(500).json({ "message": "Srever Error" });
            }
            console.log("User Credential saved successfully...");
            return res.status(200).json({ "success": "You have registered successfully.", user });
        });
    });
});

router.post('/login', function (req, res) {

    if (!req.body.uname || !req.body.pass) {
        return res.status(400).json({ "message": "User Error" });
    }

    userModel.authenticateUser(req.body.uname, req.body.pass, function (err, userSucess) {
        if (err) {
            return res.status(500).json({ "message": "Serever Error" });
        }
        if (userSucess.length > 0) {
            console.log("user login successfully...");

            //Generaet gwt token
            var token = jwt.sign({ id: userSucess.id, uname: req.body.uname }, config.secret);
            var user = {
                id: userSucess.id,
                uname: req.body.uname,
                token: token
            };
            return res.json(
                { "status": 200, "success": "login sucessfull", user }
            )
        } else {
            console.log("user login failed...");
            return res.json(
                { "status": 404, "reject": "Username and password does not match" }
            );
        }
    });
});

router.get('/users', function (req, res) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.header['x-access-token'] || req.headers['authorization'];
    
    if (token) {
        //verify token
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(403).json({ 'message': "Invalid token" });
            }
            userModel.getAllUsers(function (err, users) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ "message": "Serever Error" });
                }
                console.log("User list...");
                return res.status(200).json(users);
            });
        });
    } else {
        // if there is no token
        return res.status(403).json({ 'message': "Invalid token" });
    }
});

router.post('/imageupload', upload, function (req, res) {
    console.log(req.files);
    if (!req.files || !req.files.file) {
        res.send('No files were uploaded.');
        return;
    }
    var __dirname = "/home/trt/nodeJsProject/NodeFirstProject/images";
    var file = __dirname + '/' + req.filename;
    res.status(200).json({ 'message': "File uploaded successfully", 'filename': file.filename });
    // fs.rename(req.file.path, file, function(err) {
    //     if (err) {
    //       	console.log(err);
    //       	res.send(500);
    //     } else {
    //       	res.json({'message' : 'File uploaded successfully',
    // 	        filename: req.file.filename
    //     	});
    //     }
    //  	});
});

router.put('/update', function (req, res) {

    if (!req.body.name || !req.body.city || !req.body.pincode || !req.body.id) {
        return res.status(400).json({ "message": "User Error" });
    }

    userModel.updateUser(req.body.name, req.body.city, req.body.pincode, req.body.id, function (err, updateUser) {
        if (err) {
            console.log("Error into update user");
            return res.status(500).json({ "message": "Update Error" });
        }
        console.log("User has baan update...");
        return res.status(200).json(updateUser);
    });
});

router.delete('/delete', function (req, res) {
    if (!req.body.id) {
        return res.status(400).json({ "message": "User Error" });
    }
    userModel.deleteUser(req.body.id, function (err, userDeleted) {
        if (err) {
            return res.status(500).json({ "message": "Delete Error" });
        }
        console.log("User Deleted");
        return res.status(200).json({ "message": "User has baan deleted" });
    });
});

module.exports = router;
