import STATUS_CODE from "../constants/statusCodes.js";
import { readUsersFromFile, writeUsersToFile } from "../models/bankingModel.js";

// @des     Get all the users
// @route   GET api/v1/banking/users
// @access  Public
export const getAllUsers = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    res.status(STATUS_CODE.OK).send(users);
  } catch (error) {
    next(error);
  }
};

// @des     Get a certain user
// @route   GET api/v1/banking/users/:id
// @access  Public
export const getUserById = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    const user = users.find((u) => u.id === req.params.id);

    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
};

// @des     Create a new user
// @route   POST api/v1/banking/users
// @access  Public
export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, passportNumber } = req.body;

    if (!firstName || !lastName || !passportNumber) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(
        "All fields (firstName, lastName, passportNumber) are required."
      );
    }

    const users = readUsersFromFile();

    // Check if user with same passport number exists
    if (users.some((user) => user.passportNumber === String(passportNumber))) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("User with same passport number already exists");
    }

    const newUser = {
      // id: uuidv4(),
      firstName,
      lastName,
      passportNumber: String(passportNumber),
      cash: 0,
      credit: 0,
      isActive: true,
    };

    users.push(newUser);

    writeUsersToFile(users);

    res.status(STATUS_CODE.CREATED).send(newUser);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

// @des     Delete User
// @route   DELETE api/v1/banking/users/:id
// @access  Public
export const deleteUser = async (req, res, next) => {
  try {
    const users = readUsersFromFile();

    const userToDelete = users.find((user) => user.id === req.params.id);

    if (!userToDelete) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User was not found");
    }

    if (userToDelete.isActive) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("Cannot delete an active user");
    }

    const newUsersList = users.filter((user) => user.id !== req.params.id);

    // if(users.length === newUsersList.length){
    //   res.status(STATUS_CODE.NOT_FOUND)
    //   throw new Error("User was not found");
    // }

    writeUsersToFile(newUsersList);
    res
      .status(STATUS_CODE.OK)
      .send(`User with id:${req.params.id} was successfully deleted`);
  } catch (error) {
    next(error);
  }
};

// @des     Update user credit
// @route   PATCH api/v1/banking/users/:id/credit
// @access  Public
export const updateUserCredit = async (req, res, next) => {
  try {
    const { credit } = req.body;

    if (!credit) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You must insert credit amount to update credit");
    }

    const users = readUsersFromFile();

    // const userToUpdateCredit = users.find(user => user.id === req.params.id);
    const userIndex = users.findIndex((user) => user.id === req.params.id);

    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }

    if (!users[userIndex].isActive) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("User inactive - cannot update credit");
    }

    const updatedUser = {
      ...users[userIndex],
      credit: (users[userIndex].credit += credit),
    };

    users[userIndex] = updatedUser;

    writeUsersToFile(users);
    res.status(STATUS_CODE.OK).send(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @des     Deposit money
// @route   PATCH api/v1/banking/users/:id/deposit
// @access  Public
export const depositMoney = async (req, res, next) => {
  try {
    const { cash } = req.body;

    if (!cash) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You must insert cash amount to deposit cash");
    }

    const users = readUsersFromFile();

    const userIndex = users.findIndex((user) => user.id === req.params.id);

    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }

    if (!users[userIndex].isActive) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error("User inactive - cannot deposit cash");
    }

    const updatedUser = {
      ...users[userIndex],
      cash: (users[userIndex].cash += cash),
    };

    users[userIndex] = updatedUser;

    writeUsersToFile(users);
    res.status(STATUS_CODE.OK).send(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @des     Money transaction between two users
// @route   PATCH api/v1/banking/users/:from/transact/:to
// @access  Public
export const transactMoney = async (req, res, next) => {
  try {
    const { cash } = req.body;

    if (!cash) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You must insert a valid cash amount to transact");
    }

    const users = readUsersFromFile();

    const fromUserIndex = users.findIndex(
      (user) => user.id === req.params.from
    );
    const toUserIndex = users.findIndex((user) => user.id === req.params.to);

    if (fromUserIndex === -1 || toUserIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("At least one user not found");
    }

    if (!users[fromUserIndex].isActive || !users[toUserIndex].isActive) {
      res.status(STATUS_CODE.FORBIDDEN);
      throw new Error(
        "At least one user is not active - cannot transact with inactive users"
      );
    }

    if (users[fromUserIndex].cash - cash < users[fromUserIndex].credit * -1) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("Not enough money for transaction");
    }

    const updatedFromUser = {
      ...users[fromUserIndex],
      cash: users[fromUserIndex].cash - cash,
    };

    const updatedToUser = {
      ...users[toUserIndex],
      cash: users[toUserIndex].cash + cash,
    };

    users[fromUserIndex] = updatedFromUser;
    users[toUserIndex] = updatedToUser;

    writeUsersToFile(users);
    res.status(STATUS_CODE.OK).send("TRANSACTION SUCCESSFUL");
  } catch (error) {
    next(error);
  }
};

// @des     Update user Status
// @route   PATCH api/v1/banking/users/:id/active
// @access  Public
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (isActive === null || typeof(isActive) !== "boolean") {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("You must insert a boolean value for status");
    }

    const users = readUsersFromFile();

    const userIndex = users.findIndex(user => user.id === req.params.id);

    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }

    const updatedUser = {
      ...users[userIndex],
      isActive: isActive
    }

    users[userIndex] = updatedUser;

    writeUsersToFile(users);
    res.status(STATUS_CODE.OK).send(users[userIndex]);

  } catch (error) {
    next(error);
  }
};

    // @des     Gets list of all users with X amount of cash 
    // @route   GET api/v1/banking/users/filter/cash/:amount
    // @access  Public
    export const filterByAmountOfCash = async (req, res, next) => {
      try {
        const { amount } = req.params;

        // Check if the amount is a valid number
        if (isNaN(amount)) {
          res.status(STATUS_CODE.BAD_REQUEST);
          throw new Error("Invalid amount");
        }
    
        const users = readUsersFromFile();
    
        // Filter users based on the specified amount of cash
        const filteredUsers = users.filter(user => user.cash === parseFloat(amount));
    
        res.status(STATUS_CODE.OK).send(filteredUsers);
      } catch (error) {
        next(error)
      }
    }