const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Director {
    id: ID
    name: String
    age: Int
  }

  type Movie {
    id: ID
    name: String
    genre: String
    directorId: String
  }

  type User {
    id: ID
    email: String
    password: String
  }

  type Query {
    users: [User]
    movie(id: ID): Movie
    director: Director
    movies: [Movie]
    directors: [Director]
  }

  type Mutation {
    signup(email: String, password: String): User!
    login(email: String, password: String): User!
    addMovoie(name: String!, genre: String!, directorId: ID): Movie!
    updateMovie(id: ID!, name: String, genre: String, directorId: Int): Movie!
    deleteMovie(id: ID!): Movie!
    addDirector(name: String, age: Int): Director!
  }
`;

module.exports = typeDefs;
