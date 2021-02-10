import openpgp from "openpgp";

export const generatePGPKeys = async (name, email, passphrase) => {
  const data = await openpgp.generateKey({
    userIds: [{ name, email }], // you can pass multiple user IDs
    curve: "ed25519", // ECC curve name
    passphrase, // protects the private key
  });
  return data;
};
