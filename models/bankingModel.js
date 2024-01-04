import fs from "fs";
import { filePath } from "../utils/dataFilePath.js";

const initializeUsersFile = () => {
  if(!fs.existsSync(filePath)){
    fs.writeFileSync(filePath, JSON.stringify([]), "utf8");
  }
}

const readUsersFromFile = () => {
  try {
    initializeUsersFile();
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    throw new Error("Error reading from users file");
  }
};

const writeUsersToFile = (users) => {
  try {
    initializeUsersFile();
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    throw new Error("Wrror writing to the users file");
  }
};

export {readUsersFromFile, writeUsersToFile}