import {
  Box,
  Table,
  TableContainer,
  Thead,
  useColorModeValue,
  Button,
  Tbody,
  Td,
  Th,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";

import backend from "../api/backend";
import Navbar from "../components/navbar";
import { AuthContext } from "../utils/AuthContext";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const { token, setToken } = useContext(AuthContext);

  async function getAllBooks() {
    try {
      const res = await backend.get(`/books`, {
        headers: {
          Accept: "application/json",
          token,
        },
      });
      const data = res.data;

      console.log(data);
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getBookById = async (book_id) => {
    try {
      const res = await backend.get(`/books/${book_id}`, {
        headers: {
          Accept: "application/json",
          token,
        },
      });

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      const book = res.data.book;
      return book;
    } catch (error) {
      console.log(error);
    }
  };

  const hasUserLoggedIn = async () => {
    try {
      const res = await backend.get("/user", {
        headers: {
          Accept: "application/json",
          token,
        },
      });

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      return setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await backend.delete("/user/logout", {
        headers: {
          Accept: "application/json",
          token,
        },
      });

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      setToken(null);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetail = async (book_id) => {
    const book = await getBookById(book_id);

    setBookToEdit(book);
    setIsEditModalOpen(true);
  };

  const handleEdit = async (book_id) => {
    const book = await getBookById(book_id);

    setBookToEdit(book);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await backend.put(`/books/${bookToEdit.id}`, JSON.stringify(bookToEdit), {
        headers: {
          Accept: "application/json",
          token,
        },
      });

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      alert(res.data.message);
      setIsEditModalOpen(false);
      getAllBooks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (book_id) => {
    try {
      const res = await backend.delete(`/books/${book_id}`, {
        headers: {
          Accept: "application/json",
          token,
        },
      });

      const data = res.data;
      console.log(data);
      getAllBooks();
      alert(res.data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    hasUserLoggedIn();
    getAllBooks();
  }, [token]);

  return (
    <Box
      justify="center"
      align="center"
      minH="100vh"
      bg={useColorModeValue("`gray.50", "gray.800")}
      pt={5}
      pb={10}
      px={10}
    >
      <Navbar user={user} handleLogout={handleLogout} />
      <Box
        rounded="lg"
        bg={useColorModeValue("white", "gray.700")}
        p={8}
        boxShadow="lg"
      >
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>ISBN</Th>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {books &&
                books.map((book, index) => (
                  <Tr key={book.id}>
                    <Td>{index + 1}</Td>
                    <Td>{book.isbn}</Td>
                    <Td>{book.title}</Td>
                    <Td>{book.author}</Td>
                    <Td>
                      <Button onClick={() => handleDetail(book.id)}>Detail</Button>
                      <Button onClick={() => handleEdit(book.id)}>Edit</Button>
                      <Button onClick={() => handleDelete(book.id)}>
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detail Book</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <p>ISBN: {bookToEdit?.isbn}</p>
                <p>Title: {bookToEdit?.title}</p>
                <p>Author: {bookToEdit?.author}</p>
                <p>Published: {bookToEdit?.published}</p>
                <p>Publisher: {bookToEdit?.publisher}</p>
                <p>Pages: {bookToEdit?.pages}</p>
                <p>Description: {bookToEdit?.description}</p>
                <p>Website: {bookToEdit?.website}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Book</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="isbn">
                <FormLabel>ISBN</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.isbn || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, isbn: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.title || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, title: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="author">
                <FormLabel>Author</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.author || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, author: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="published">
                <FormLabel>Published</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.published || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, published: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="publisher">
                <FormLabel>Publisher</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.publisher || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, publisher: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="pages">
                <FormLabel>Pages</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.pages || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, pages: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.description || ""}
                  onChange={(e) =>
                    setBookToEdit({
                      ...bookToEdit,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl id="website">
                <FormLabel>Website</FormLabel>
                <Input
                  type="text"
                  value={bookToEdit?.website || ""}
                  onChange={(e) =>
                    setBookToEdit({ ...bookToEdit, website: e.target.value })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => handleUpdate()}>
                Save
              </Button>
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
