import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const title = req.body.title || file.originalname;
    const cleanTitle = title.replace(/\.[^/.]+$/, ''); // remove extension if present
    cb(null, cleanTitle); // Save as filename with no extension
  },
});

const upload = multer({ storage });
export default upload;

// ---------- Image Upload Middleware for Profile Pictures ----------
export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
      const title = req.body.title || file.originalname;
      const cleanTitle = title.replace(/\.[^/.]+$/, '');
      cb(null, `${cleanTitle}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for profile pics
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  },
});
