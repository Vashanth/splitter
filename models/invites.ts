import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  inviteCode: {
    type: String,
    required: true
  }
});

inviteSchema.index({ inviteCode: 1, groupId: 1 }, { unique: true });

const Invite = mongoose.model('Invite', inviteSchema);

export default Invite;
