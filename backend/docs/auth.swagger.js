/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User Authentication APIs
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: User already exists or validation error.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login User
 *     tags: [Authentication]
 *     description: Login with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change Password
 *     tags: [Authentication]
 *     description: Change password for authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       401:
 *         description: Unauthorized.
 */
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [Authentication]
 *     description: Sends OTP to registered email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 */
/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Authentication]
 *     description: Verify OTP sent to email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 */
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags: [Authentication]
 *     description: Reset password after OTP verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 */