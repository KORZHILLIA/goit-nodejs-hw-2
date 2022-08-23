const express = require("express");
const Joi = require("joi");
const router = express.Router();
const contactsHandlers = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  const contacts = await contactsHandlers.listContacts();
  res.status(200).json({ contacts, message: "success" });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = (await contactsHandlers.getContactById(contactId))
    .requiredContact;
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({
    contact,
    message: "success",
  });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    const argsArray = Object.keys(req.body);
    const fullArgsArray = ["name", "email", "phone"];
    const absendFieldsArr = fullArgsArray.filter(
      (field) => !argsArray.includes(field)
    );
    const absendFields = absendFieldsArr.join(" and ");
    return res.status(400).json({
      message: `Missing required ${absendFields} ${
        absendFieldsArr.length > 1 ? "fields" : "field"
      }`,
    });
  }
  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp("^[A-Z]{1}[a-z]+\\s[A-Z]{1}[a-z]+$")),
    email: Joi.string().email(),
    phone: Joi.string().pattern(new RegExp("^\\(\\d{3}\\)\\s\\d{3}[-]\\d{4}$")),
  });
  const message = joiValidate(schema, req.body);
  if (message) {
    return res.status(400).json({
      message,
    });
  }
  const newContact = await contactsHandlers.addContact({ name, email, phone });
  res.status(201).json({ contact: newContact, message: "New contact created" });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const bool = await contactsHandlers.removeContact(contactId);
  return bool
    ? res.status(200).json({ message: "Contact deleted" })
    : res.status(404).json({ message: "Not found" });
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  if (!Object.keys(req.body).length) {
    return res.status(404).json({ message: "Not found" });
  }

  const schema = Joi.object({
    name: Joi.string().pattern(new RegExp("^[A-Z]{1}[a-z]+\\s[A-Z]{1}[a-z]+$")),
    email: Joi.string().email(),
    phone: Joi.string().pattern(new RegExp("^\\(\\d{3}\\)\\s\\d{3}[-]\\d{4}$")),
  });
  const message = joiValidate(schema, req.body);
  if (message) {
    return res.status(400).json({
      message,
    });
  }
  const updatedContact = await contactsHandlers.updateContact(
    contactId,
    req.body
  );
  res.status(200).json({
    updatedContact,
  });
});

function joiValidate(schema, reqBody) {
  const validationResult = schema.validate(reqBody);
  if (validationResult.error) {
    const { details } = validationResult.error;
    const [{ message }] = details;
    return message;
  }
}

module.exports = router;
