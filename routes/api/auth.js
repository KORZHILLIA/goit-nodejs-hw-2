const express = require("express");
const { createTryCatchWrapper } = require("../../helpers");
const { authenticate, upload } = require("../../middlewares");
const { authCtrlr } = require("../../controllers");

const router = express.Router();

router.post("/signup", createTryCatchWrapper(authCtrlr.register));

router.get(
  "/verify/:verificationToken",
  createTryCatchWrapper(authCtrlr.sendVerifyEmail)
);

router.post("/verify", createTryCatchWrapper(authCtrlr.resendVerifyEmail));

router.post("/login", createTryCatchWrapper(authCtrlr.login));

router.get(
  "/current",
  authenticate,
  createTryCatchWrapper(authCtrlr.getCurrentUser)
);

router.post("/logout", authenticate, createTryCatchWrapper(authCtrlr.logout));

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  createTryCatchWrapper(authCtrlr.updateAvatar)
);

module.exports = router;
