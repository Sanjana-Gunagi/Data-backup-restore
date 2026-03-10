router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.get(
  "/files",
  authMiddleware,
  getBackups
);

router.get(
  "/restore/:id",
  authMiddleware,
  restoreFile
);