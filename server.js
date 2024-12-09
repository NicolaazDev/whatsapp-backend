const app = require("./src/app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(5000, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
