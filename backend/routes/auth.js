import express from 'express';
import passport from '../config/passport.js';
import {
  login,
  getMe,
  logout,
  changePassword,
  refreshAccessToken,
  oauthCallback,
  sendOtp,
  verifyOtp,
  sendMagicLink,
  verifyMagicLink
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ─── Local Auth ──────────────────────────────────────────────────
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

// ─── Email OTP ───────────────────────────────────────────────────
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);

// ─── Magic Link ──────────────────────────────────────────────────
router.post('/magic-link/send', sendMagicLink);
router.post('/magic-link/verify', verifyMagicLink);

// ─── Google OAuth ────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  oauthCallback
);

// ─── GitHub OAuth ────────────────────────────────────────────────
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  oauthCallback
);

export default router;
