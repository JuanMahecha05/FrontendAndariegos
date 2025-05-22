import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

console.log("API Gateway URL:", process.env.NEXT_PUBLIC_API_GATEWAY_URL);
const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/graphql`, // Cambia a la URL de tu backend
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
