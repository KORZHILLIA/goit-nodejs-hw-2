const express = require("express");
const { contactsCtrlr } = require("../controllers");
const { authenticate } = require("../middlewares");
const { createTryCatchWrapper } = require("../helpers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  createTryCatchWrapper(contactsCtrlr.getAllContacts)
);

router.get(
  "/:contactId",
  authenticate,
  createTryCatchWrapper(contactsCtrlr.getContactById)
);

router.post(
  "/",
  authenticate,
  createTryCatchWrapper(contactsCtrlr.addNewContact)
);

router.delete(
  "/:contactId",
  authenticate,
  createTryCatchWrapper(contactsCtrlr.deleteContact)
);

router.put(
  "/:contactId",
  authenticate,
  createTryCatchWrapper(contactsCtrlr.updateContact)
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  createTryCatchWrapper(contactsCtrlr.updateFavorite)
);

module.exports = router;
