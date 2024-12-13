const client = require("../libs/whatsapp");

require("dotenv").config();

const qrcode = require("qrcode");

// const generateQRCode = async (req, res) => {
//   let qr = await new Promise((resolve, reject) => {
//     client.once("qr", async (qr) => {
//       try {
//         console.log("Recebendo QR Code para upload...");

//         const qrCodeBase64 = await qrcode.toDataURL(qr);

//         const qrCodeBuffer = Buffer.from(qrCodeBase64.split(",")[1], "base64");

//         require("fs").writeFileSync("./public/qr-code.png", qrCodeBuffer);
//         console.log("QR Code salvo na pasta public com sucesso!");

//         // const uploadResponse = await cloudinary.uploader.upload(qrCodeBase64, {
//         //   folder: "qr-codes",
//         //   public_id: `qr_${Date.now()}`,
//         //   resource_type: "image",
//         // });

//         // console.log("QR Code enviado para o Cloudinary com sucesso!");
//         // console.log("URL do QR Code:", uploadResponse.secure_url);

//         resolve(qrCodeBuffer);

//         res.json({ message: "QR Code gerado com sucesso!", qrCodeBase64 });
//       } catch (error) {
//         console.error("Erro ao gerar ou enviar o QR Code:", error);
//         reject(error);
//       }
//     });
//   });

//   return qr;
// };

const generateQRCode = async (req, res) => {
  client.once("qr", async (qr) => {
    try {
      console.log("Recebendo QR Code...");
      const qrCodeBase64 = await qrcode.toDataURL(qr);

      console.log("QR Code gerado com sucesso!");

      res.json({ message: "QR Code gerado com sucesso!", qrCodeBase64 });
    } catch (error) {
      console.error("Erro ao gerar o QR Code:", error);
      res
        .status(500)
        .json({ message: "Erro ao gerar o QR Code.", error: error.message });
    }
  });
};

module.exports = { generateQRCode };
