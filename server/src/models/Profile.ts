import mongoose from 'mongoose';

export type ProfileDocument = {
  firstName: string;
  lastName: string;
  name: string;
  gender: string;
  location: string;
  website: string;
  picture: string;
};

export const profileSchema = new mongoose.Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },
  { timestamps: true, _id: false }
);

// profileSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function(doc, ret) {
//     delete ret._id;
//   }
// });
