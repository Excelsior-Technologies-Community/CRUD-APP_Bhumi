
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── 2. Configure diskStorage ─────────────────────────────────────────────────
const storage = multer.diskStorage({
  // destination: where to save the file on disk
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `product-${uniqueSuffix}${ext}`;
    cb(null, safeName);
  },
});


const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

  if (isMimeValid && isExtValid) {
    cb(null, true);   
  } else {
  
    cb(
      new Error(
        `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB – prevents huge uploads from blocking the server
  },
});


const handleUpload = (req, res, next) => {
  const multerSingle = upload.single('image'); // 'image' must match the FormData field name

  multerSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
     
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
    
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  
    next();
  });
};

export { handleUpload };
