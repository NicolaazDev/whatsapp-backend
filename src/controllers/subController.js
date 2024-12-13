const Sub = require("../models/Sub");

const registerSub = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário já existe
    const existingSub = await Sub.findOne({ username });
    if (existingSub) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }

    const newSub = new Sub({ username, password });
    await newSub.save();

    res
      .status(201)
      .json({ message: "Sub registrado com sucesso!", sub: newSub });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar Sub!", error });
  }
};

const loginSub = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário existe
    const sub = await Sub.findOne({ username });
    if (!sub) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    // Verifica a senha
    const isMatch = sub.password === password;

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    res.status(200).json({ message: "Login realizado com sucesso!", sub });
  } catch (error) {
    res.status(500).json({ message: "Erro ao realizar login!", error });
  }
};

const toggleSubDesativated = async (req, res) => {
  try {
    const { subId } = req.params;

    const sub = await sub.findById(subId);

    if (!sub) {
      return res.status(404).json({ message: "sub não encontrado!" });
    }

    sub.desativated = !sub.desativated;
    await sub.save();

    res
      .status(200)
      .json({ message: "sub status atualizado com sucesso!", sub });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar status do sub!", error });
  }
};

module.exports = { registerSub, loginSub, toggleSubDesativated };
