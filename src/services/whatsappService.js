const client = require("../libs/whatsapp");
const Agent = require("../models/Agent");

const saveUser = async () => {
  client.on("authenticated", () => {
    console.log("Autenticado com sucesso!");
  });

  client.on("ready", async () => {
    const user = await client.info;
    // const existingUser = await Agent.findOne({ phoneNumber: user.id.user });

    console.log(user);

    if (!user) {
      console.log(`Usuário ${user.id.user} leu o qrcode`);
      console.log("Usuário salvo no banco de dados:", newUser);
    } else {
      console.log("Usuário já existe no banco de dados.");
    }
  });

  client.initialize();
};

module.exports = {
  saveUser,
};
