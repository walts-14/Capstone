    import express from 'express';
    import cors from 'cors';
    import { createUser} from '../controllers/user.controller.js';
    import { loginUser } from '../controllers/user.controller.js';

    export const router = express.Router();

    router.use(
        cors({     
            withCredentials: true,
            origin: 'http://localhost:5173',
        })
    )

    router.post('/signup', createUser);
    router.post('/login', loginUser);
    


    export default router;