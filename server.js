require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB ", err);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/users", async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

app.post("/users", async (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

app.put ("/users/:id", async (req, res) => {
    try {
        const user = await User.findOneAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User deleted"});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
});