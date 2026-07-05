import multer from "multer";

export const charityDocumentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed =
      file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
    if (allowed) {
      cb(null, true);
      return;
    }
    cb(new Error("Only images and PDF files are allowed."));
  },
});
