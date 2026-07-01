const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true, index: true }, // room slug
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    color: String,
    text: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
