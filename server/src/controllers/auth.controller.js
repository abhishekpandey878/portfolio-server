import { createAuthToken } from '../utils/auth.js';

function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@portfolio.local',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  };
}

export function login(request, response) {
  const { email = '', password = '' } = request.body || {};
  const admin = getAdminCredentials();

  if (email.trim() !== admin.email || password !== admin.password) {
    return response.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createAuthToken({
    email: admin.email,
    role: 'admin',
    expiresAt: Date.now() + 1000 * 60 * 60 * 8
  });

  return response.json({
    message: 'Login successful.',
    token,
    user: {
      email: admin.email,
      role: 'admin'
    }
  });
}

export function getSession(request, response) {
  return response.json({
    user: {
      email: request.user.email,
      role: request.user.role
    }
  });
}

