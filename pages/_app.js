import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import customTheme from "../styles/themes";
import { AuthContext } from "../utils/AuthContext";

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{token, setToken}}>
      <ChakraProvider theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthContext.Provider>
  );
}

export default MyApp;
