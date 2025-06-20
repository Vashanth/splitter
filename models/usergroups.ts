import mongoose from 'mongoose';

const userGroupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

export default UserGroup;
