import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; //to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err)); //delete the file
};

export { clearImage };
