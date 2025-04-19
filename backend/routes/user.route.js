    import express from 'express';
    import cors from 'cors';
    import { createUser, loginUser, uploadProfilePicture, deleteProfilePicture} from '../controllers/user.controller.js';
    import { verifyToken } from '../middlewares/auth.js';
    import uploadImage from '../config/multer.js';

    export const router = express.Router();

    router.use(
        cors({     
            withCredentials: true,
            origin: 'http://localhost:5173',
        })
    )

    router.post('/signup', createUser);
    router.post('/login', loginUser);

// Profile picture routes (protected)
router.post('/upload-profile-pic', verifyToken, uploadImage.single('image'), uploadProfilePicture);
router.delete('/delete-profile-pic', verifyToken, deleteProfilePicture);

export default router;