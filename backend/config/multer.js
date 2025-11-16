import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const title = req.body.title || file.originalname;
    const cleanTitle = title.replace(/\.[^/.]+$/, ''); // remove extension if present
    // keep original extension for default storage
    const ext = path.extname(file.originalname) || '';
    cb(null, `${cleanTitle}${ext}`);
  },
});

const upload = multer({ storage });

// ---------- Image Upload Middleware for Profile Pictures ----------
// ensure uploads/images directory exists
try {
  fs.mkdirSync('uploads/images', { recursive: true });
} catch (e) {
  // ignore
}

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

// default export: profile picture middleware (used by routes expecting uploadImage as default)
export default uploadImage;
