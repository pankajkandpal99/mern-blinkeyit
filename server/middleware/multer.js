import multer from "multer";

// This storage is for only temporary purposes.
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
