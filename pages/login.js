import { useContext, useState } from "react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  VStack,
  useColorModeValue,
  FormLabel,
  Text,
  Link,
  Icon,
} from "@chakra-ui/react";

import { BiIdCard, BiLockAlt, BiShow, BiHide } from "react-icons/bi";
import { useRouter } from "next/router";
import backend from "../api/backend";
import { AuthContext } from "../utils/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // changed from 'nim' to 'email'
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext);

  const router = useRouter();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const loginHandler = async (e) => {
    e.preventDefault();
    const user = {
      email, 
      password,
    };

    try {
      const res = await backend.post("/login", JSON.stringify(user), {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: false,
      });

      if (email === "" || password === "") {
        alert("Email and Password cannot be empty");
        return;
      }

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      setToken(res.data.token);

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Heading fontSize="4xl">Sign in to your account</Heading>

        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          p={8}
          boxShadow="lg"
        >
          <form onSubmit={loginHandler}>
            <Stack spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    children={
                      <Icon as={BiIdCard} w="6" h="6" color="gray.300" />
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Email" 
                    value={email}  
                    onChange={(e) => setEmail(e.target.value)} // changed from 'setNim' to 'setEmail'
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    children={
                      <Icon as={BiLockAlt} w="6" h="6" color="gray.300" />
                    }
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h="full">
                    <Button variant="ghost" onClick={handleShowPassword}>
                      {showPassword ? (
                        <Icon as={BiShow} />
                      ) : (
                        <Icon as={BiHide} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  value="submit"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align="center">
                  Don't have an account?{" "}
                  <Link color="blue.400" href="./register">
                    register
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
