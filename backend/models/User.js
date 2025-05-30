const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already taken'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin"],
            message: '{VALUE} is not a valid role. Allowed roles are user and admin.'
        },
        required: [true, 'Role is required']
    }
});
  

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        // console.log("Hashing password...");
        this.password = await bcrypt.hash(this.password.trim(), 10); // Generate fresh salt
        // console.log("Password hashed:", this.password);
        next();
    } catch (error) {
        console.log("Error in hashing password:", error);
        next(error);
    }
});

// Compare password
UserSchema.methods.comparePassword = async function (password) {
    // console.log("Password entered:", password);
    try {
        // console.log("Stored password:", this.password);
        const isMatch = await bcrypt.compare(password.trim(), this.password.trim());
        // console.log("Password comparison result:", isMatch);
        return isMatch;
    } catch (error) {
        console.log("Error in password comparison:", error);
        throw error;
    }
};

module.exports = mongoose.model("User", UserSchema);
