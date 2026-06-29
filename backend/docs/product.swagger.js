/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product CRUD APIs
 */
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create Product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new product with image upload.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully.
 */
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get All Products
 *     tags: [Products]
 *     description: Retrieve all products.
 *     responses:
 *       200:
 *         description: List of all products.
 */
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get Product By ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found successfully.
 *       404:
 *         description: Product not found.
 */
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update Product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 */
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete Product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 */