import { diskStorage } from "multer";


export const multerOptions = {
  storage: diskStorage({
    destination: './uploads', 
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
};
