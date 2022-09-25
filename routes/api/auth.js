const express = require("express");
const { createTryCatchWrapper } = require("../../helpers");
const { authenticate } = require("../../middlewares");
const { authCtrlr } = require("../../controllers");

const router = express.Router();

router.post("/signup", createTryCatchWrapper(authCtrlr.register));

router.post("/login", createTryCatchWrapper(authCtrlr.login));

router.get(
  "/current",
  authenticate,
  createTryCatchWrapper(authCtrlr.getCurrentUser)
);

router.post("/logout", authenticate, createTryCatchWrapper(authCtrlr.logout));

module.exports = router;
