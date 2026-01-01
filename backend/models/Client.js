import mongoose from "mongoose";
import CLIENT_STATUS from "../config/clientStatus.js";

const remarkSchema = new mongoose.Schema(
  {
    remark: { type: String, required: true },
    byRole: {
      type: String,
      enum: ["ASSOCIATE", "CA", "ADMIN"],
      required: true,
    },
    byUser: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const documentSchema = new mongoose.Schema(
  { name: String, url: String },
  { timestamps: true }
);

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String, required: true },
    panNumber: { type: String, required: true, uppercase: true, index: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Associate",
      required: true,
    },
    assignedCA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CA",
      default: null,
    },
    handledByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    documents: [documentSchema],
    formDraft: { type: String, default: null },
    remarks: [remarkSchema],

    billingAmount: { type: Number, default: null },
    billingAmountCollectedDate: {
      type: Date,
      default: null,
    },
    formSigned: { type: Boolean, default: false },

    status: {
      type: String,
      enum: Object.values(CLIENT_STATUS),
      default: CLIENT_STATUS.PENDING,
      index: true,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    is_deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

clientSchema.index({ status: 1, createdBy: 1 });
clientSchema.index({ status: 1, assignedCA: 1 });

export default mongoose.model("Client", clientSchema);
