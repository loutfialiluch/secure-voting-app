import express from "express";
import openpgp from "openpgp";
import Voter from "./models/Voter.js";
import axios from "axios";
import { generatePGPKeys } from "./encryption/generatePGPKeys.js";
import { encryptWithKey } from "./encryption/encrypt.js";
import { decryptWithKey } from "./encryption/decrypt.js";

const router = express.Router();

const passphrase = "Hello Security";

const {
  privateKeyArmored: KprCO,
  publicKeyArmored: KpCO,
} = await generatePGPKeys("CO", "CO@gmail.com", "Hello Security");

router.get("/", (req, res) => {
  res.send(KpCO);
  res.status(200);
});

router.post("/", async (req, res) => {
  try {
    const decrypted = await decryptWithKey(
      KprCO,
      passphrase,
      req.body.objectCO
    );
    const encryptedCO = JSON.parse(decrypted.data).CO;
    const { data: stringifiedDecryptedCO } = await decryptWithKey(
      KprCO,
      passphrase,
      encryptedCO
    );
    const { firstName, lastName, birthDate, idVote } = JSON.parse(
      stringifiedDecryptedCO
    );
    const existingVoter = await Voter.findOne({ idVote });
    if (existingVoter) {
      res.json({
        success: false,
        errorMessage: "You already voted !",
      });
      res.status(403);
    } else {
      const newVoter = new Voter({
        firstName,
        lastName,
        birthDate,
        idVote,
      });

      const { data: KpDE } = await axios.get("http://localhost:5001/DE");

      const encryptedObjectToDE = await encryptWithKey(
        JSON.parse(decrypted.data),
        KpDE
      );

      const DEResponse = await axios.post("http://localhost:5001/DE", {
        encryptedObjectToDE,
      });

      if (DEResponse.data.success) {
        await newVoter.save();
        res.json({
          success: true,
          errorMessage: "",
        });
        res.status(200);
      } else {
        res.json({
          success: false,
          errorMessage: "Security issue !",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
