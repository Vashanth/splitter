import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifier: {
    type: String,
    required: true
  }
});

userSchema.index({ identifier: 1 });

const User = mongoose.model('User', userSchema);

export default User;