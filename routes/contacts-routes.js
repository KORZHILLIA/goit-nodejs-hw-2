const express = require("express");
const contactsCtrlr = require("../controllers");
const { createTryCatchWrapper } = require("../helpers");

const router = express.Router();

router.get("/", createTryCatchWrapper(contactsCtrlr.getAllContacts));

router.get("/:contactId", createTryCatchWrapper(contactsCtrlr.getContactById));

router.post("/", createTryCatchWrapper(contactsCtrlr.addNewContact));

router.delete(
  "/:contactId",
  createTryCatchWrapper(contactsCtrlr.deleteContact)
);

router.put("/:contactId", createTryCatchWrapper(contactsCtrlr.updateContact));

router.patch(
  "/:contactId/favorite",
  createTryCatchWrapper(contactsCtrlr.updateFavorite)
);

module.exports = router;
