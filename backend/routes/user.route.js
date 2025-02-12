    import express from 'express';
    import cors from 'cors';
    import { createUser} from '../controllers/user.controller.js';

    const router = express.Router();

    router.use(
        cors({     
            withCredentials: true,
            origin: 'http://localhost:5173/signup',
        })
    )

    router.post('/signup', createUser);

    export default router;