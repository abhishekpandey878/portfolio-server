import mongoose from 'mongoose';

const sectionTitlesSchema = new mongoose.Schema(
  {
    about: { type: String, default: 'Professional Snapshot' },
    skills: { type: String, default: 'Core Stack' },
    links: { type: String, default: 'Professional Profiles' },
    experience: { type: String, default: 'Professional Experience' },
    projects: { type: String, default: 'Selected Work' },
    education: { type: String, default: 'Academic Background' },
    contact: { type: String, default: "Let's Build Something Meaningful" }
  },
  { _id: false }
);

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    role: String,
    company: String,
    period: String,
    description: String
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: String,
    stack: [String],
    description: String,
    link: String
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    period: String
  },
  { _id: true }
);

const profileSchema = new mongoose.Schema(
  {
    name: String,
    headline: String,
    location: String,
    email: String,
    phone: String,
    summary: String,
    profilePhoto: String,
    resumePath: String,
    socialLinks: [linkSchema],
    highlights: [String],
    skills: [String],
    sectionTitles: { type: sectionTitlesSchema, default: () => ({}) },
    experience: [experienceSchema],
    projects: [projectSchema],
    education: [educationSchema]
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
