import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date

  type Director {
    id: ID!
    name: String
    age: Int
  }

  type Movie {
    id: ID!
    name: String
    genre: String
    directorId: String
  }

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

  type Query {
    user: User
    users: [User]
    movie(id: ID): Movie
    director: Director
    movies: [Movie]
    directors: [Director]
  }

  type Mutation {
    signup(email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addMovoie(name: String!, genre: String!, directorId: ID): Movie!
    updateMovie(id: ID!, name: String, genre: String, directorId: Int): Movie!
    deleteMovie(id: ID!): Movie!
    addDirector(name: String, age: Int): Director!
  }
`;
