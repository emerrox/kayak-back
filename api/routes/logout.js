import cookieParser from 'cookie-parser';
import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  res
  .clearCookie('access_token', {
    secure: true, 
    sameSite: 'None',
  })
  .clearCookie('user_email', {
    secure: true, 
    sameSite: 'None',
  })
  .status(200).json({ message: 'Cierre de sesión exitoso' });
});

export default router;
