import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";

const Navbar = ({ user, handleLogout }) => {
  return (
    <Box px={10}>
      <Flex my={5} h={16} alignItems="center" justifyContent="space-between">
        <Heading as="h2" size="md">
          Front-End - Pre-Screening Test
        </Heading>

        <Stack spacing={8} alignItems="center">
          <Heading as="h3" size="lg">
            My Books
          </Heading>
        </Stack>

        <Flex alignItems="center" gridColumnGap={4}>
          {user ? (
            <>
              <Text fontSize="lg">{user.name}</Text>
              <Menu m={0}>
                <MenuButton minW={0} rounded="full">
                  <Avatar size="sm" />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    _hover={{ bg: "red.500", color: "white" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Link href="./login">
              <Button>Login</Button>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
