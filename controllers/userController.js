// backend/controllers/userController.js (MODIFICADO)

// ...existing code...
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isWholesaler } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    isWholesaler: isWholesaler || false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isWholesaler: user.isWholesaler,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data received');
  }
});

/**
 * @desc    Autenticar un usuario y obtener token
 * @route   POST /api/users/login
 * @access  Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isWholesaler: user.isWholesaler,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Obtener datos del perfil de usuario
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isWholesaler: user.isWholesaler,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, authUser, getUserProfile };
// ...existing code...

// backend/routes/userRoutes.js (MODIFICADO - Añadir rutas 2FA)

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { send2FACode, verify2FACode } = require('../controllers/auth2FAController'); // Importar nuevo controlador

// ... (rutas /, /login, /profile) ...

// Rutas de 2FA
router.post('/2fa/send', protect, send2FACode);
router.post('/2fa/verify', protect, verify2FACode);

module.exports = router;
