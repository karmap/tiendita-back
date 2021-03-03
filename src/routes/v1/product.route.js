const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const { upload } = require('../../middlewares/s3');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageProducts'),
    upload.single('image'),
    validate(productValidation.createProduct),
    productController.createProduct
  )
  .get(auth(), validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(auth('getProducts'), validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * path:
 *  /products:
 *    post:
 *      summary: Create a product
 *      description: Only admins can create other products.
 *      tags: [Products]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - description
 *                - type
 *                - price
 *                - count
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                type:
 *                  type: string
 *                color:
 *                  type: string
 *                  required: false
 *                price:
 *                  type: number
 *                count:
 *                  type: number
 *                isSoldOut:
 *                  type: boolean
 *                tags:
 *                  type: array
 *                  items:
 *                    type: string
 *                rating:
 *                  type: number
 *                  required: false
 *                categories:
 *                  type: array
 *                  items:
 *                    type: string
 *                    required: true
 *                _id:
 *                  type: string
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                image:
 *                  type: string
 *                  format: binary
 *              example:
 *                name: fake name
 *                email: fake@example.com
 *                password: password1
 *                role: product
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Product'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *
 *    get:
 *      summary: Get all products
 *      description: Only admins can retrieve all products.
 *      tags: [Products]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *          description: Product name
 *        - in: query
 *          name: role
 *          schema:
 *            type: string
 *          description: Product role
 *        - in: query
 *          name: sortBy
 *          schema:
 *            type: string
 *          description: sort by query in the form of field:desc/asc (ex. name:asc)
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of products
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  results:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Product'
 *                  page:
 *                    type: integer
 *                    example: 1
 *                  limit:
 *                    type: integer
 *                    example: 10
 *                  totalPages:
 *                    type: integer
 *                    example: 1
 *                  totalResults:
 *                    type: integer
 *                    example: 1
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /products/{id}:
 *    get:
 *      summary: Get a product
 *      description: Logged in products can fetch only their own product information. Only admins can fetch other products.
 *      tags: [Products]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Product id
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Product'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    patch:
 *      summary: Update a product
 *      description: Logged in products can only update their own information. Only admins can update other products.
 *      tags: [Products]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Product id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                name: fake name
 *                email: fake@example.com
 *                password: password1
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Product'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 *
 *    delete:
 *      summary: Delete a product
 *      description: Logged in products can delete only themselves. Only admins can delete other products.
 *      tags: [Products]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Product id
 *      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
