import app from "./src/app.js";
import connect from "./src/config/database.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });
