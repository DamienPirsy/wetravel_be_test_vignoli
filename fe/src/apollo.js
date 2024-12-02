import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

const httpLink = createHttpLink({
  uri: 'http://localhost:3333/graphql', // Replace with your GraphQL server URL
})

const cache= new InMemoryCache()


const apolloClient = new ApolloClient({
  link: httpLink,
  cache: cache
})

export default apolloClient