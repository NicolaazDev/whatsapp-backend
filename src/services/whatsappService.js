const client = require("../libs/whatsapp");
const Agent = require("../models/Agent");

const saveUser = async () => {
  client.on("authenticated", () => {
    console.log("Autenticado com sucesso!");
  });

  client.on("ready", async () => {
    const user = await client.info;
    // const existingUser = await Agent.findOne({ phoneNumber: user.id.user });

    // console.log("Database User", existingUser);
    console.log("Client User", user);
  });

  client.initialize();
};

module.exports = {
  saveUser,
};
