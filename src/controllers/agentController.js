const Agent = require("../models/Agent");

const fs = require("fs-extra");
const path = require("path");
const PDFDocument = require("pdfkit");

const multer = require("multer");
const archiver = require("archiver");

const createAgent = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, appId } = req.body;

    const existingAgent = await Agent.findOne({ username });
    if (existingAgent) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }

    const urlConnection = `${process.env.CLIENT_URL}/${appId}/agent/${username}`;

    const newAgent = new Agent({
      username,
      password,
      urlConnection,
      qrCode: "qrCode",
      phoneNumbers: [phoneNumber],
      email,
    });
    await newAgent.save();

    res.status(201).json({ agent: newAgent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao registrar Agent!", error: error.message });
  }
};

const addPhoneNumber = async (req, res) => {
  try {
    const { agentId, phoneNumber } = req.body;

    // Verifica se o agente existe
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agente não encontrado!" });
    }

    // Verifica se o número já existe no array
    if (agent.phoneNumbers.includes(phoneNumber)) {
      return res.status(400).json({ message: "Número já adicionado!" });
    }

    // Adiciona o número ao array
    agent.phoneNumbers.push(phoneNumber);

    // Salva as alterações
    await agent.save();

    res.status(200).json({ message: "Número adicionado com sucesso!", agent });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao adicionar número!",
      error: error.message,
    });
  }
};

const loginAgent = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário existe
    const agent = await Agent.findOne({ username });
    if (!agent) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Verifica a senha
    const isMatch = password === agent.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    res.status(200).json({ message: "Login realizado com sucesso!", agent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao realizar login!", error: error.message });
  }
};

const getAgentsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    // Verifica se o array de IDs foi passado e é válido
    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "IDs devem ser um array válido." });
    }

    // Busca administradores no banco de dados com base nos IDs
    const agents = await Agent.find({ _id: { $in: ids } });

    // Retorna os administradores encontrados
    res.status(200).json({ agents });
  } catch (error) {
    console.error("Erro ao buscar administradores:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getAgentById = async (req, res) => {
  try {
    const { username } = req.params;

    // Busca o agente no banco de dados
    const agent = await Agent.findOne({ username });

    // Verifica se o agente foi encontrado
    if (!agent) {
      return res.status(404).json({ message: "Agente não encontrado." });
    }

    // Retorna o agente encontrado
    res.status(200).json({ agent });
  } catch (error) {
    console.error("Erro ao buscar agente:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getAgentID = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o agente no banco de dados
    const agent = await Agent.findById(id);
    // Verifica se o agente foi encontrado
    if (!agent) {
      return res.status(404).json({ message: "Agente não encontrado." });
    }

    // Retorna o agente encontrado
    res.status(200).json({ agent });
  } catch (error) {
    console.error("Erro ao buscar agente:", error.message);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getAgentBackup = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o agente no banco de dados
    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({ message: "Agente não encontrado." });
    }

    // Define o diretório temporário para o backup
    const tempDir = path.join(__dirname, "../temp");
    const agentDir = path.join(tempDir, `agent_${agent.phoneNumbers[0]}`);
    const zipPath = path.join(
      tempDir,
      `backup_agent_${agent.phoneNumbers[0]}.zip`
    );

    await fs.ensureDir(agentDir); // Garante que a pasta do agente exista

    // Cria o documento PDF
    const pdfDoc = new PDFDocument();
    const pdfPath = path.join(agentDir, "backup_messages.pdf");
    const writeStream = fs.createWriteStream(pdfPath);

    pdfDoc.pipe(writeStream);

    // Adiciona o título do PDF
    pdfDoc
      .fontSize(16)
      .text(`Backup de mensagens - Agente: ${agent.username}\n\n`);

    // Itera sobre as mensagens e adiciona ao PDF
    for (const [index, message] of agent.messages.entries()) {
      const messageDate = new Date(message.timestamp);
      const formattedDate = messageDate.toLocaleString();

      if (message.type === "text") {
        pdfDoc.fontSize(12);
        pdfDoc.text(`Mensagem ${index + 1}:`);
        pdfDoc.text(`De: ${message.from}`);
        pdfDoc.text(`Para: ${message.to}`);
        pdfDoc.text(`Mensagem: ${message.content}`);
        pdfDoc.text(`Status: ${message.status}`);
        pdfDoc.text(`Timestamp: ${formattedDate}\n`);
        pdfDoc.text("----------------------------------\n");
      } else if (message.type === "image" || message.type === "audio") {
        const extension = message.type === "image" ? "png" : "ogg";
        const fileName = `message_${index + 1}.${extension}`;
        const filePath = path.join(agentDir, fileName);
        const base64Data = message.content.replace(/^data:.+;base64,/, ""); // Remove o prefixo base64

        // Salva o arquivo
        await fs.writeFile(filePath, base64Data, "base64");

        // Adiciona informações sobre o arquivo no PDF
        pdfDoc.fontSize(12);
        pdfDoc.text(`Mensagem ${index + 1}:`);
        pdfDoc.text(`De: ${message.from}`);
        pdfDoc.text(`Para: ${message.to}`);
        pdfDoc.text(`Tipo: ${message.type}`);
        pdfDoc.text(`Arquivo: ${fileName}`);
        pdfDoc.text(`Status: ${message.status}`);
        pdfDoc.text(`Timestamp: ${formattedDate}\n`);
        pdfDoc.text("----------------------------------\n");
      }
    }

    // Finaliza o PDF
    pdfDoc.end();
    await new Promise((resolve) => writeStream.on("finish", resolve));

    // Compacta a pasta em um arquivo ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      console.log(`Arquivo ZIP criado com ${archive.pointer()} bytes.`);

      // Envia o arquivo ZIP para o cliente
      res.download(
        zipPath,
        `backup_agent_${agent.phoneNumbers[0]}.zip`,
        async (err) => {
          if (err) {
            console.error("Erro ao enviar o arquivo ZIP:", err);
          }

          // Remove arquivos temporários após o download
          await fs.remove(tempDir);
        }
      );
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);

    // Adiciona a pasta do agente ao ZIP
    archive.directory(agentDir, `agent_${agent.phoneNumber}`);
    await archive.finalize();
  } catch (error) {
    console.error("Erro ao gerar backup:", error.message);
    res
      .status(500)
      .json({ message: "Erro ao gerar o backup.", error: error.message });
  }
};

const uploadDir = path.join(__dirname, "../uploads/backups");
fs.ensureDirSync(uploadDir); // Certifica-se de que o diretório de uploads existe

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Salva os arquivos na pasta de uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const getMultipleAgentBackups = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "IDs inválidos ou vazios." });
    }

    console.log("Iniciando o processo de backup...");

    const tempDir = path.join(__dirname, "../temp"); // Diretório temporário para armazenar backups
    const zipPath = path.join(tempDir, "backups.zip");

    await fs.ensureDir(tempDir);

    for (const id of ids) {
      console.log(`Processando agente com ID: ${id}`);

      const agent = await Agent.findById(id);
      if (!agent) {
        console.log(`Agente com ID ${id} não encontrado.`);
        return res
          .status(404)
          .json({ message: `Agente com ID ${id} não encontrado.` });
      }

      const agentDir = path.join(tempDir, `agent_${agent.phoneNumbers[0]}`);
      await fs.ensureDir(agentDir);

      console.log(`Criando PDF para agente ${agent.username}...`);
      const pdfDoc = new PDFDocument();
      const pdfPath = path.join(agentDir, "backup_messages.pdf");
      const writeStream = fs.createWriteStream(pdfPath);

      pdfDoc.pipe(writeStream);

      pdfDoc
        .fontSize(16)
        .text(`Backup de mensagens - Agente: ${agent.username}\n\n`);

      for (const [index, message] of agent.messages.entries()) {
        const messageDate = new Date(message.timestamp);
        const formattedDate = messageDate.toLocaleString();

        if (message.type === "text") {
          pdfDoc.fontSize(12);
          pdfDoc.text(`Mensagem ${index + 1}:`);
          pdfDoc.text(`De: ${message.from}`);
          pdfDoc.text(`Para: ${message.to}`);
          pdfDoc.text(`Mensagem: ${message.content}`);
          pdfDoc.text(`Status: ${message.status}`);
          pdfDoc.text(`Timestamp: ${formattedDate}\n`);
          pdfDoc.text("----------------------------------\n");
        } else if (message.type === "image" || message.type === "audio") {
          const extension = message.type === "image" ? "png" : "ogg";
          const fileName = `message_${index + 1}.${extension}`;
          const filePath = path.join(agentDir, fileName);
          const base64Data = message.content.replace(/^data:.+;base64,/, "");

          await fs.writeFile(filePath, base64Data, "base64");

          pdfDoc.fontSize(12);
          pdfDoc.text(`Mensagem ${index + 1}:`);
          pdfDoc.text(`De: ${message.from}`);
          pdfDoc.text(`Para: ${message.to}`);
          pdfDoc.text(`Tipo: ${message.type}`);
          pdfDoc.text(`Arquivo: ${fileName}`);
          pdfDoc.text(`Status: ${message.status}`);
          pdfDoc.text(`Timestamp: ${formattedDate}\n`);
          pdfDoc.text("----------------------------------\n");
        }
      }

      pdfDoc.end();
      await new Promise((resolve) => writeStream.on("finish", resolve));
    }

    // Cria o arquivo ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`Arquivo ZIP criado com ${archive.pointer()} bytes.`);
      res.download(zipPath, "backups.zip", async (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo ZIP:", err);
        }

        // Remove arquivos temporários após o download
        await fs.remove(tempDir);
      });
    });

    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);

    // Adiciona as pastas dos agentes ao ZIP
    const agentDirs = await fs.readdir(tempDir);
    for (const dir of agentDirs) {
      const dirPath = path.join(tempDir, dir);
      if ((await fs.stat(dirPath)).isDirectory()) {
        archive.directory(dirPath, dir);
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Erro ao gerar backups ZIP:", error.message);
    res
      .status(500)
      .json({ message: "Erro ao gerar os backups.", error: error.message });
  }
};

const toggleAgentDesativated = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({ message: "agent não encontrado!" });
    }

    agent.desativated = !agent.desativated;
    await agent.save();

    res
      .status(200)
      .json({ message: "agent status atualizado com sucesso!", agent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar status do agent!", error });
  }
};

module.exports = {
  createAgent,
  loginAgent,
  getAgentsByIds,
  getAgentById,
  getAgentBackup,
  getMultipleAgentBackups,
  toggleAgentDesativated,
  addPhoneNumber,
  getAgentID,
};
