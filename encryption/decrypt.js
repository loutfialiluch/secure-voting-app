import openpgp from "openpgp";

export const decryptWithKey = async (prKey, passphrase, data) => {
  const privateKey = (await openpgp.key.readArmored([prKey])).keys[0];
  await privateKey.decrypt(passphrase);
  const decryptedData = await openpgp.decrypt({
    message: await openpgp.message.readArmored(data),
    privateKeys: [privateKey],
  });
  return decryptedData;
};
