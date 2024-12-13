const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");

const whatsappRoutes = require("./routes/whatsappRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aplicationRoutes = require("./routes/applicationRoutes");
const agentRoutes = require("./routes/agentRoutes");
const subRoutes = require("./routes/subRoutes");
const equipeRoutes = require("./routes/equipeRoutes");

const { saveUser } = require("./services/whatsappService");
const client = require("./libs/whatsapp");
const Agent = require("./models/Agent");
const path = require("path");

connectDatabase();

const app = express();

const uploadDir = path.join(__dirname, "../uploads/backups");
app.use("/backups", express.static(uploadDir));

app.use(cors({ origin: "*" }));

app.use(express.json());

app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/sub", subRoutes);
app.use("/api/application", aplicationRoutes);
app.use("/api/equipe", equipeRoutes);

saveUser();

const regex = /^(\d+)@/;

client.on("message_create", async (message) => {
  console.log(message);

  try {
    // Encontrar o agente pelo número de telefone
    const agent = await Agent.findOne({
      phoneNumbers: { $in: [message.from.match(/^(\d+)@/)?.[1]] },
    });

    let messageContent = message.body;

    console.log(agent);

    console.log(message);

    if (message.hasMedia) {
      const media = await message.downloadMedia();

      messageContent = media.data;
    }

    if (!agent) {
      console.error(
        "Agente não encontrado para o número:",
        message.from.match(/^(\d+)@/)?.[1]
      );
      return;
    }

    // Adicionar a mensagem ao histórico do agente
    agent.messages.push({
      from: message.from,
      to: message.to,
      type: message.type == "chat" ? "text" : message.type, // Aqui definimos como texto. Você pode adaptar para outros tipos.
      content: messageContent,
      status: message.status || "sent",
    });

    // Salvar o agente com a nova mensagem
    await agent.save();

    console.log("Mensagem salva no histórico do agente!");
  } catch (error) {
    console.error("Erro ao salvar a mensagem:", error);
  }
});

client.on("message", async (message) => {
  try {
    // Encontrar o agente pelo número de telefone
    const agent = await Agent.findOne({
      phoneNumber: message.to.match(/^(\d+)@/)?.[1],
    });

    let messageContent = message.body;

    console.log(agent);

    console.log(message);

    if (message.hasMedia) {
      const media = await message.downloadMedia();

      messageContent = media.data;
    }

    if (!agent) {
      console.error("Agente não encontrado para o número:", message.from);
      return;
    }

    // Adicionar a mensagem ao histórico do agente
    agent.messages.push({
      from: message.from,
      to: message.to,
      type: message.type == "chat" ? "text" : message.type, // Aqui definimos como texto. Você pode adaptar para outros tipos.
      content: messageContent,
      status: message.status || "sent",
    });

    // Salvar o agente com a nova mensagem
    await agent.save();

    console.log("Mensagem salva no histórico do agente!");
  } catch (error) {
    console.error("Erro ao salvar a mensagem:", error);
  }
});

module.exports = app;
