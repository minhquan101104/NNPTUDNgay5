var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
    try {
        let data = await userModel.find({
            isDeleted: false
        }).populate({
            path: 'role',
            select: 'name description'
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.find({
            isDeleted: false,
            _id: id
        }).populate({
            path: 'role',
            select: 'name description'
        });
        if (result.length) {
            res.send(result[0]);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// CREATE new user
router.post('/', async function (req, res) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// UPDATE user
router.put('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        ).populate({
            path: 'role',
            select: 'name description'
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// DELETE user (soft delete)
router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findOne({
            isDeleted: false,
            _id: id
        });
        if (result) {
            result.isDeleted = true;
            await result.save();
            res.send(result);
        } else {
            res.status(404).send({
                message: "ID NOT FOUND"
            });
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        });
    }
});

// POST /enable - Enable user by email and username
router.post('/enable', async function (req, res) {
    try {
        let { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).send({
                message: "Email and username are required"
            });
        }

        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        });

        if (user) {
            user.status = true;
            await user.save();
            res.send({
                message: "User enabled successfully",
                user: user
            });
        } else {
            res.status(404).send({
                message: "User not found or credentials do not match"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// POST /disable - Disable user by email and username
router.post('/disable', async function (req, res) {
    try {
        let { email, username } = req.body;
        
        if (!email || !username) {
            return res.status(400).send({
                message: "Email and username are required"
            });
        }

        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        });

        if (user) {
            user.status = false;
            await user.save();
            res.send({
                message: "User disabled successfully",
                user: user
            });
        } else {
            res.status(404).send({
                message: "User not found or credentials do not match"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

module.exports = router;
