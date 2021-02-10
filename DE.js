import express from "express";
import openpgp from "openpgp";
import _ from "lodash";
import Vote from "./models/Vote.js";
import { generatePGPKeys } from "./encryption/generatePGPKeys.js";
import { decryptWithKey } from "./encryption/decrypt.js";

const router = express.Router();

let receivedFromVoter = null;
const passphrase = "Hello Security";

const {
  privateKeyArmored: KprDE,
  publicKeyArmored: KpDE,
} = await generatePGPKeys("DE", "DE@gmail.com", "Hello Security");

router.get("/", (req, res) => {
  res.send(KpDE);
  res.status(200);
});

router.post("/", async (req, res) => {
  if (receivedFromVoter === null) {
    receivedFromVoter = req.body.objectDE;
    res.json({
      success: true,
      description: "checking with CO for final decision",
      errorMessage: "",
    });
    res.status(200);
  } else {
    try {
      const { data: stringifiedDecryptedObjectFromCO } = await decryptWithKey(
        KprDE,
        passphrase,
        req.body.encryptedObjectToDE
      );

      const {
        data: stringifiedDecryptedObjectFromVoter,
      } = await decryptWithKey(KprDE, passphrase, receivedFromVoter);
      const decryptedObjectFromCO = JSON.parse(
        stringifiedDecryptedObjectFromCO
      );

      const decryptedObjectFromVoter = JSON.parse(
        stringifiedDecryptedObjectFromVoter
      );
      if (_.isEqual(decryptedObjectFromCO, decryptedObjectFromVoter)) {
        const { data: stringifiedDecryptedDE } = await decryptWithKey(
          KprDE,
          passphrase,
          decryptedObjectFromCO.DE
        );

        const decryptedDE = JSON.parse(stringifiedDecryptedDE);

        const candidateVotes = await Vote.findOne({
          candidateFullName: decryptedDE.voteResult,
        });

        if (candidateVotes) {
          candidateVotes.votes += 1;
          await candidateVotes.save();
        }

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
        res.status(403);
      }
    } catch (error) {
      console.log(error);
    }
  }
});

export default router;
