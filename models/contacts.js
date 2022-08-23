const fs = require("fs/promises");
const path = require("path");
const coreContactsPath = path.resolve(__dirname, "contacts.json");

const listContacts = async () => {
  const allContacts = await fs.readFile(coreContactsPath, "utf-8");
  return JSON.parse(allContacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const requiredContact = contacts.find((contact) => contact.id === contactId);
  if (!requiredContact) {
    return { contacts, requiredContact: null };
  }
  return { contacts, requiredContact };
};

const removeContact = async (contactId) => {
  const { contacts, requiredContact } = await getContactById(contactId);
  if (!requiredContact) {
    return false;
  }
  const requiredIdx = contacts.indexOf(requiredContact);
  if (requiredIdx === -1) {
    return false;
  }
  contacts.splice(requiredIdx, 1);
  await reWriteFile(contacts);
  return true;
};

const addContact = async ({ name, email, phone }) => {
  const allContacts = await listContacts();
  const lastId = parseInt(allContacts[allContacts.length - 1].id);
  const id = String(lastId + 1);
  const newContact = {
    id,
    name,
    email,
    phone,
  };
  allContacts.push(newContact);
  await reWriteFile(allContacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const { contacts, requiredContact } = await getContactById(contactId);
  if (!requiredContact) {
    return false;
  }
  const array = Object.keys(body);
  array.forEach((field) => (requiredContact[field] = body[field]));
  await reWriteFile(contacts);
  return requiredContact;
};

async function reWriteFile(entity) {
  const serialisedEntity = JSON.stringify(entity);
  await fs.writeFile(coreContactsPath, serialisedEntity, "utf-8");
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
