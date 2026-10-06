const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const PORT = 3000;


// MongoDB Connection String
const MONGO_URI ="mongodb://user_455986q43:p455986q43@db01.dbhost.dev:5050/db_455986q43?authSource=db_455986q43";


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve index.html from the SAME src folder
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});


// MongoDB Connection
mongoose.connect(MONGO_URI)

    .then(() => {

        console.log("MongoDB connected successfully");

    })

    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error.message
        );

    });


// Member Schema
const memberSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    club: {
        type: String,
        required: true
    }

});


// Create Model
const Member = mongoose.model("Member", memberSchema);


// ===============================
// ADD MEMBER
// ===============================

app.post("/members", async (req, res) => {

    try {

        console.log("Received data:", req.body);

        const member = new Member({

            name: req.body.name,

            email: req.body.email,

            department: req.body.department,

            year: req.body.year,

            club: req.body.club

        });

        await member.save();

        console.log("Member added:", member);

        res.status(201).json({

            message: "Member added successfully",

            member: member

        });

    }

    catch (error) {

        console.log(
            "Error adding member:",
            error.message
        );

        res.status(500).json({

            message: "Error adding member",

            error: error.message

        });

    }

});


// ===============================
// GET ALL MEMBERS
// ===============================

app.get("/members", async (req, res) => {

    try {

        const members = await Member.find();

        res.json(members);

    }

    catch (error) {

        console.log(
            "Error fetching members:",
            error.message
        );

        res.status(500).json({

            message: "Error fetching members",

            error: error.message

        });

    }

});


// ===============================
// UPDATE MEMBER
// ===============================

app.put("/members/:id", async (req, res) => {

    try {

        const member =
            await Member.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!member) {

            return res.status(404).json({

                message: "Member not found"

            });

        }

        res.json({

            message: "Member updated successfully",

            member: member

        });

    }

    catch (error) {

        console.log(
            "Error updating member:",
            error.message
        );

        res.status(500).json({

            message: "Error updating member",

            error: error.message

        });

    }

});


// ===============================
// DELETE MEMBER
// ===============================

app.delete("/members/:id", async (req, res) => {

    try {

        const member =
            await Member.findByIdAndDelete(req.params.id);

        if (!member) {

            return res.status(404).json({

                message: "Member not found"

            });

        }

        res.json({

            message: "Member deleted successfully"

        });

    }

    catch (error) {

        console.log(
            "Error deleting member:",
            error.message
        );

        res.status(500).json({

            message: "Error deleting member",

            error: error.message

        });

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});