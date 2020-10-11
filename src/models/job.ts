import mongoose from 'mongoose';

const Scema = mongoose.Schema;

const jobSchema = new Scema({
  siteName: String,
  jobData: {
    NodeJs: Number,
    React: Number,
    Angular: Number,
    VueJs: Number,
    NextJs: Number,
    NuxtJs: Number,
    TypeScript: Number,
    JavaScript: Number,
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
