const services = require("../services/contacts");
const { createReqError } = require("../helpers");
const { validateReqBody } = require("../middlewares");

const getAllContacts = async (_, res) => {
  const contacts = await services.listContacts();
  if (!contacts.length) {
    throw createReqError(204, "Sorry, database is empty");
  }
  res.json({ contacts, message: "Success" });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await services.getContactById(contactId);
  if (!contact) {
    throw createReqError(404, `No contact with id ${contactId} found`);
  }
  res.json({ contact, message: "Success" });
};

const addNewContact = async (req, res) => {
  const { body } = req;
  validateReqBody(body);
  const contact = await services.addContact(body);
  res.status(201).json({ contact, message: "Contact successfully created" });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await services.removeContact(contactId);
  if (!result) {
    throw createReqError(
      404,
      `No contact with id ${contactId} found to delete`
    );
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const {
    body,
    params: { contactId },
  } = req;
  validateReqBody(body);
  const bodyLength = Object.keys(body).length;
  if (!bodyLength) {
    throw createReqError(400, "Missing fields");
  }
  const contact = await services.updateContact(contactId, body);
  if (!contact) {
    throw createReqError(
      404,
      `No contact with id ${contactId} found to update`
    );
  }
  res.json({ contact, message: "Contact successfully updated" });
};

const updateFavorite = async (req, res, next) => {
  const {
    body,
    params: { contactId },
  } = req;
  validateReqBody(body);
  const bodyArr = Object.keys(body);
  if (!bodyArr.length || !bodyArr.includes("favorite")) {
    throw createReqError(400, "Missing field 'favorite'");
  }
  if (bodyArr.length > 1) {
    for (let key of bodyArr) {
      if (key !== "favorite") {
        delete body[key];
      }
    }
  }
  const contact = await services.updateStatusContact(contactId, body);
  if (!contact) {
    throw createReqError(
      404,
      `No contact with id ${contactId} found to update`
    );
  }
  res.json({ contact, message: "Field 'favorite' successfully updated" });
};

module.exports = {
  getAllContacts,
  getContactById,
  addNewContact,
  deleteContact,
  updateContact,
  updateFavorite,
};
