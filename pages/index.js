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
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";

import backend from "../api/backend";
import Navbar from "../components/navbar";
import { AuthContext } from "../utils/AuthContext";

export default function Home() {
  const [mahasiswas, setMahasiswas] = useState([]);
  const [user, setUser] = useState(null);
  const { token, setToken } = useContext(AuthContext);

  async function getAllMahasiswa() {
    try {
      const res = await backend.get(`/mahasiswa`);
      const data = res.data;

      console.log(data.mahasiswa);
      setMahasiswas(data.mahasiswa);
    } catch (error) {
      console.log(error);
    }
  }

  const hasUserLogedIn = async () => {
    try {
      const res = await backend.get('/mahasiswa/profile', {
        headers: {
          token,
          validateStatus: false,
        },
      })

      if (res.status !== 200) {
        alert(res.data.message);
        return;
      }

      return setUser(res.data.mahasiswa);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  }

  const handleDelete = async (nim) => {
    try {
      const res = await backend.delete(`/mahasiswa/${nim}`, {
        headers: {
          token,
          validateStatus: false,
        },
      });

      const data = res.data;
      console.log(data);
      getAllMahasiswa();
      handleLogout();
      alert('mahasiswa deleted');
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    hasUserLogedIn();
    getAllMahasiswa();
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
                <Th>NIM</Th>
                <Th>Nama</Th>
                <Th>Angkatan</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mahasiswas &&
                mahasiswas.map((mahasiswa, index) => (
                  <Tr key={mahasiswa.nim}>
                    <Td>{index + 1}</Td>
                    <Td>{mahasiswa.nim}</Td>
                    <Td>{mahasiswa.nama}</Td>
                    <Td>{mahasiswa.angkatan}</Td>
                    <Td>
                      <Button onClick={() => handleDelete(mahasiswa.nim)}>
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
