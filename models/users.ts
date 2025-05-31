import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  subscription: {
    type: Object,
    required: false
  }
});

userSchema.index({ identifier: 1 });

const User = mongoose.model('User', userSchema);

export default User;