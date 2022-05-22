const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  resetLink: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  gogle_user_id: {
    type: String,
  },
  login_type: {
    type: String,
  },
  profilePic: [
    {
      url: String,
      filename: String,
    },
  ],
});
// Create Hash Salt Password ..
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
// Compare Password ...
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
