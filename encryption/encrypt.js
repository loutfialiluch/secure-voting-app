import openpgp from "openpgp";

export const encryptWithKey = async (object, key) => {
  const encrypted = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(object)),
    publicKeys: (await openpgp.key.readArmored(key)).keys,
  });
  return encrypted.data;
};
