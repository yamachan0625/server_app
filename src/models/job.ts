import mongoose from 'mongoose';

const Scema = mongoose.Schema;

const jobSchema = new Scema({
  siteName: String,
  jobData: {
    TypeScript: Number,
    JavaScript: Number,
    React: Number,
    Angular: Number,
    VueJs: Number,
    NodeJs: Number,
    NextJs: Number,
    NuxtJs: Number,
    ReactNative: Number,
    Flutter: Number,
    Electron: Number,
    Graphql: Number,
    Redux: Number,
    VueX: Number,
    Jest: Number,
    Cypress: Number,
    Webpack: Number,
  },
  date: Date,
});

export const Job = mongoose.model('Job', jobSchema);
