
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
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";

import backend from "../api/backend";
import Navbar from "../components/navbar";
import { AuthContext } from "../utils/AuthContext";
import { useRouter } from "next/router";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [bookObject, setBookObject] = useState(null);
  const { token, setToken } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const getAllBooks = async (page = 1) => {
    setLoading(true);
    setCurrentPage(page);
    try {
      const res = await backend.get(`/api/books?page=${page}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = res.data;

      console.log(data);
      setBooks(data.books.data);
      setTotalPages(data.books.last_page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getBookById = async (book_id) => {
    try {
      const res = await backend.get(`/api/books/${book_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      const res = await backend.get("/api/user", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      const res = await backend.delete("/api/user/logout", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      setToken(null);
      setUser(null);

      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleCreate = async () => {
    try {
      const res = await backend.post(
        `/api/books/add`,
        JSON.stringify(bookObject),
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      alert(res.data.message);
      setIsAddModalOpen(false);
      getAllBooks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetail = async (book_id) => {
    const book = await getBookById(book_id);

    setBookObject(book);
    setIsDetailModalOpen(true);
  };

  const handleEdit = async (book_id) => {
    const book = await getBookById(book_id);

    setBookObject(book);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await backend.put(
        `/api/books/${bookObject.id}/edit`,
        JSON.stringify(bookObject),
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      const res = await backend.delete(`/api/books/${book_id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
    if (!token) {
      router.push("/login");
      return;
    }
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
        <Flex alignItems="end" justifyContent="end">
          <Button colorScheme="green" mr={3} onClick={() => handleAdd()}>
            Add Book
          </Button>
        </Flex>

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
                    <Td>{(currentPage - 1) * 10 + index + 1}</Td>
                    <Td>{book.isbn}</Td>
                    <Td>{book.title}</Td>
                    <Td>{book.author}</Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        ml={2}
                        mr={3}
                        onClick={() => handleDetail(book.id)}
                      >
                        Detail
                      </Button>
                      <Button
                        colorScheme="yellow"
                        mr={3}
                        onClick={() => handleEdit(book.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        mr={2}
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Book</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="isbn">
                <FormLabel>ISBN</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, isbn: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, title: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="subtitle">
                <FormLabel>Subtitle</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, subtitle: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="author">
                <FormLabel>Author</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, author: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="published">
                <FormLabel>Published</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, published: e.target.value })
                  }
                />
                <FormHelperText>
                  Format: yyyy-MM-dd HH:mm:ss (example: 2024-01-01 00:00:00)
                </FormHelperText>
              </FormControl>

              <FormControl id="publisher">
                <FormLabel>Publisher</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({
                      ...bookObject,
                      publisher: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl id="pages">
                <FormLabel>Pages</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, pages: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({
                      ...bookObject,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl id="website">
                <FormLabel>Website</FormLabel>
                <Input
                  type="text"
                  onChange={(e) =>
                    setBookObject({ ...bookObject, website: e.target.value })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => handleCreate()}>
                Create
              </Button>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detail Book</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>ISBN: {bookObject?.isbn}</p>
              <p>Title: {bookObject?.title}</p>
              <p>Subtitle: {bookObject?.subtitle}</p>
              <p>Author: {bookObject?.author}</p>
              <p>Published: {bookObject?.published}</p>
              <p>Publisher: {bookObject?.publisher}</p>
              <p>Pages: {bookObject?.pages}</p>
              <p>Description: {bookObject?.description}</p>
              <p>Website: {bookObject?.website}</p>
            </ModalBody>
            <ModalFooter></ModalFooter>
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
                  value={bookObject?.isbn || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, isbn: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.title || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, title: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="subtitle">
                <FormLabel>Subtitle</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.subtitle || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, subtitle: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="author">
                <FormLabel>Author</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.author || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, author: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="published">
                <FormLabel>Published</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.published || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, published: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="publisher">
                <FormLabel>Publisher</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.publisher || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, publisher: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="pages">
                <FormLabel>Pages</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.pages || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, pages: e.target.value })
                  }
                />
              </FormControl>

              <FormControl id="description">
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.description || ""}
                  onChange={(e) =>
                    setBookObject({
                      ...bookObject,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl id="website">
                <FormLabel>Website</FormLabel>
                <Input
                  type="text"
                  value={bookObject?.website || ""}
                  onChange={(e) =>
                    setBookObject({ ...bookObject, website: e.target.value })
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

        <Flex alignItems="center" justifyContent="center" pt={6}>
          <Button
            mr={10}
            isDisabled={loading}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              getAllBooks(currentPage - 1);
            }}
            isDisabled={currentPage === 1 || loading}
          >
            Previous Page
          </Button>
          <Text fontSize="lg" fontWeight="semibold">
            {currentPage}
          </Text>
          <Button
            ml={10}
            isDisabled={loading}
            onClick={() => {
              setCurrentPage(currentPage + 1);
              getAllBooks(currentPage + 1);
            }}
            isDisabled={currentPage === totalPages || loading}
          >
            Next Page
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
