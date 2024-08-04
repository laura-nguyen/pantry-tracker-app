"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  boxShadow,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  border: "2px solid #0d0d0d",
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredPantry(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPantry(inventory);
    } else {
      const filteredItems = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPantry(filteredItems);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      bgcolor="#4d4d4d"
      paddingBottom="2rem"
    >
      <Box
        width="100%"
        height="15vh"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bgcolor="#0d0d0d"
        color="white"
        sx={{
          padding: { xs: "0 2.7%", sm: "0 6%", md: "0 15%", lg: "0 19%" },
        }}
      >
        <Link href="/" passHref style={{ textDecoration: "none" }}>
          <Typography
            variant="h1"
            sx={{
              color: "white",
              textDecoration: "none",
              fontSize: { xs: "1rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" },
            }}
            onClick={() => window.location.reload()}
          >
            Pantry Tracker
          </Typography>
        </Link>

        <Link
          href="https://lauranguyen.me"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "white",
              textDecoration: "none",
              fontSize: {
                xs: "0.8rem",
                sm: "1.3rem",
                md: "1.6rem",
                lg: "1.6rem",
              },
            }}
          >
            Laura Nguyen
          </Typography>
        </Link>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              border={"2px solid #0d0d0d"}
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              style={{
                backgroundColor: "#0d0d0d",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              sx={{
                fontSize: {
                  xs: ".5rem",
                  sm: ".7rem",
                  md: ".7rem",
                  lg: ".8rem",
                },
              }}
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box
        border={"3px solid #0d0d0d"}
        sx={{
          width: { xs: "95%", sm: "90%", md: "75%", lg: "65%" },
        }}
      >
        <Stack
          direction={"row"}
          width={"100%"}
          spacing={2}
          padding="10px"
          bgcolor={"white"}
        >
          <TextField
            border={"2px solid #0d0d0d"}
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            style={{
              backgroundColor: "#0d0d0d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
            sx={{
              width: { xs: "20px", sm: "5%", md: "10%", lg: "15%" },
              padding: { md: "10px 20px" },
            }}
          >
            <SearchIcon />
          </Button>

          <Button
            style={{
              backgroundColor: "#0d0d0d",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
            sx={{
              fontSize: {
                xs: ".6rem",
                sm: ".7rem",
                md: ".7rem",
                lg: ".8rem",
              },
              width: { xs: "50%", sm: "28%", md: "20%", lg: "25%" },
              padding: { md: "10px 10px" },
            }}
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Stack>
        <Box
          height="80px"
          width={"100%"}
          bgcolor={"#0d0d0d"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          marginBottom="20px"
        >
          <Typography
            variant="h3"
            style={{
              color: "#fff",
              textAlign: "center",
            }}
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.3rem",
                md: "1.6rem",
                lg: "2rem",
              },
            }}
          >
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="50vh" spacing={2} overflow={"auto"}>
          {filteredPantry.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              sx={{
                flexDirection: { xs: "column", sm: "row", md: "row" },
                gap: { xs: "8px", sm: "8px" },
              }}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"white"}
              paddingX={5}
              paddingY={2}
            >
              <Typography
                variant="h3"
                width={"25%"}
                style={{
                  color: "#0d0d0d",

                  fontWeight: "500",
                }}
                sx={{
                  fontSize: {
                    xs: "1.3rem",
                    sm: "1.5rem",
                    md: "1.6rem",
                    lg: "2rem",
                  },
                  textAlign: { xs: "center", sm: "left", md: "left" },
                }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3"
                style={{
                  color: "#0d0d0d",
                  textAlign: "center",
                  fontWeight: "500",
                }}
                sx={{
                  fontSize: {
                    xs: "1.3rem",
                    sm: "1.5rem",
                    md: "1.6rem",
                    lg: "2rem",
                  },
                }}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  style={{
                    backgroundColor: "#0d0d0d",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  sx={{
                    fontSize: {
                      xs: ".5rem",
                      sm: ".7rem",
                      md: ".7rem",
                      lg: ".8rem",
                    },
                  }}
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  className="button"
                  style={{
                    backgroundColor: "#0d0d0d",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  sx={{
                    fontSize: {
                      xs: ".5rem",
                      sm: ".7rem",
                      md: ".7rem",
                      lg: ".8rem",
                    },
                  }}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
