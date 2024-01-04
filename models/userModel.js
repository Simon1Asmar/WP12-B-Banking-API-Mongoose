import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: [true, "Must enter first name (firstName)"]
  },
  lastName:{
    type: String,
    required: [true, "Must enter last name (lastName)"]
  },
  passportNumber:{
    type: Number,
    required: [true, "Must enter a passport number for user (passportNumber)"],
    unique: [true, "User with given passport number already exists (passportNumber)"]
  }, 
  cash:{
    type: Number,
    default: 0,
  },
  credit:{
    type: Number,
    default: 0,
  },
  isActive:{
    type: Boolean,
    default: true,
  }
})

const User = mongoose.model("User", userSchema);

export default User