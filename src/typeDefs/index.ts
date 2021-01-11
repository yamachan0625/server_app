import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type RefreshToken {
    hash: String!
    expiry: Date!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    refreshTokens: RefreshToken!
  }

  type Auth {
    userId: ID!
    token: String!
    refreshToken: String!
  }

  type SkillName {
    TypeScript: Int!
    JavaScript: Int!
    React: Int!
    Angular: Int!
    VueJs: Int!
    NodeJs: Int!
    NextJs: Int!
    NuxtJs: Int!
    ReactNative: Int!
    Flutter: Int!
    Electron: Int!
    Graphql: Int!
    Redux: Int!
    VueX: Int!
    Jest: Int!
    Cypress: Int!
    Webpack: Int!
  }

  type Job {
    siteName: String!
    jobData: SkillName!
    date: Date!
  }

  type JobData {
    siteName: String!
    skillName: [String]!
    jobVacancies: [Int]!
    chartColor: [String]!
    chartBorderColor: [String]!
  }

  type BarChartResponse {
    scrapingDate: Date!
    minDate: Date!
    jobData: [JobData]!
  }

  type LineChartSkillData {
    label: String!
    data: [Int]!
    borderColor: String!
  }

  type LineChartJobData {
    siteName: String!
    skillData: [LineChartSkillData!]!
  }

  type LineChartResponse {
    rangeDate: [Date!]!
    jobData: [LineChartJobData!]!
  }

  type Query {
    user: User
    jobs: [Job]
    getBarChartList(date: Date!, sortOrder: String!): BarChartResponse!
    getLineChartList(dateRange: String!, skills: [String]!): LineChartResponse!
  }

  type Mutation {
    signup(email: String!, password: String!): Auth!
    login(email: String!, password: String!): Auth!
    changePassword(
      currentPassword: String!
      newPassword: String!
      confirmNewPassword: String!
    ): User!
  }
`;
