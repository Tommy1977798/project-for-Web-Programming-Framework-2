import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileSlug: { type: String, unique: true, sparse: true }, // 可選，唯一
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
