import React from 'react'
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks'
import { HttpLink } from 'apollo-link-http';

const graphqlLink = new HttpLink({uri: 'https://lychee-pudding-66431.herokuapp.com/https://covidtracking.com/api/graphql'})

const client = new ApolloClient({
    link: graphqlLink,
    cache: new InMemoryCache()
});

const MainApolloProvider = ({ children }) => (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
)


export default MainApolloProvider