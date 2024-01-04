import express from "express";
import {
  createUser,
  deleteUser,
  depositMoney,
  filterByAmountOfCash,
  getAllUsers,
  getUserById,
  transactMoney,
  updateUserCredit,
  updateUserStatus,
} from "../controllers/bankingController.js";

const router = express.Router();

// Route to get all details of all the users
router.get("/users", getAllUsers);

// Route to get a single user by ID
router.get("/users/:id", getUserById);

// Route to create a new user
router.post("/users", createUser);

// Route to update user credit
router.patch("/users/:id/credit", updateUserCredit);

// Route to deposit money in user's account
router.patch("/users/:id/deposit", depositMoney);

// Route to transfer money
router.patch("/users/:from/transact/:to", transactMoney);

// Route to DELETE user
router.delete("/users/:id", deleteUser);

// Route to filter the users by amount of cash
router.get("/users/filter/cash/:amount", filterByAmountOfCash)

// EXTRA: Route to update account status "active" || "inActive
router.patch("/users/:id/active", updateUserStatus);

export default router;