import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ["student", "faculty", "admin"], required: true },
  passwordHash: { type: String, required: true },
}, {
  timestamps: true,
});

// Optional method
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// ✅ Create and export model
const User = mongoose.model("User", userSchema);
export default User;
