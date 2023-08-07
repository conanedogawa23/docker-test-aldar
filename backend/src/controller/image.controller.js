const express = require('express');
const { celebrate, Joi } = require('celebrate');
const busboy = require('connect-busboy');
const ImageMetadataService = require('../services/image.service');

class ImageMetadataController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(busboy());

    const createMetadataValidation = celebrate({
        [Segments.BODY]: Joi.object({
          title: Joi.string().required(),
          description: Joi.string(),
          category: Joi.string().required(),
          tags: Joi.array().items(Joi.string())
        }),
        [Segments.FILES]: Joi.object({
          image: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            mimetype: Joi.string().required(),
            buffer: Joi.binary().required()
          }).required()
        })
      });

    this.router.post(
      '/metadata',
      createMetadataValidation,
      this.createMetadataWithImage.bind(this)
    );

    const updateMetadataValidation = celebrate({
        [Segments.BODY]: Joi.object({
          title: Joi.string().required(),
          description: Joi.string(),
          category: Joi.string().required(),
          tags: Joi.array().items(Joi.string())
        }),
        [Segments.PARAMS]: Joi.object({
          id: Joi.string().hex().length(24).required()
        }),
        [Segments.FILES]: Joi.object({
          image: Joi.object({
            fieldname: Joi.string().required(),
            originalname: Joi.string().required(),
            mimetype: Joi.string().required(),
            buffer: Joi.binary().required()
          }).required()
        })
      });

    this.router.get(
      '/metadata/:id',
      this.getMetadata.bind(this)
    );

    this.router.put(
      '/metadata/:id',
      updateMetadataValidation,
      this.updateMetadataWithImage.bind(this)
    );

    this.router.delete(
      '/metadata/:id',
      this.softDeleteMetadata.bind(this)
    );

    this.router.get(
      '/metadata',
      this.listMetadata.bind(this)
    );
  }

  async createMetadataWithImage(req, res, next) {
    try {
      req.pipe(req.busboy);

      let metadata = {};
      let file;

      req.busboy.on('field', (key, value) => {
        metadata[key] = value;
      });

      req.busboy.on('file', (fieldname, filestream, filename, encoding, mimetype) => {
        const buffers = [];
        filestream.on('data', (data) => {
          buffers.push(data);
        });

        filestream.on('end', async () => {
          const buffer = Buffer.concat(buffers);
          file = {
            fieldname,
            originalname: filename,
            mimetype,
            buffer
          };
        });
      });

      req.busboy.on('finish', async () => {
        try {
          const createdMetadata = await ImageMetadataService.createMetadata(metadata, file);
          res.status(201).json(createdMetadata);
        } catch (error) {
          console.error(`Error creating metadata: ${error.message}`);
          res.status(500).json({ error: 'Something went wrong while creating metadata.' });
        }
      });
    } catch (error) {
      console.error(`Error parsing request: ${error.message}`);
      res.status(400).json({ error: 'Error parsing request.' });
    }
  }

  async getMetadata(req, res, next) {
    try {
      const metadata = await ImageMetadataService.getMetadata(req.params.id);
      if (metadata) {
        res.status(200).json(metadata);
      } else {
        res.status(404).json({ message: 'Metadata not found.' });
      }
    } catch (error) {
      console.error(`Error fetching metadata: ${error.message}`);
      res.status(500).json({ error: 'Something went wrong while fetching metadata.' });
    }
  }

  async updateMetadataWithImage(req, res, next) {
    try {
      req.pipe(req.busboy);

      let metadata = {};
      let file;

      req.busboy.on('field', (key, value) => {
        metadata[key] = value;
      });

      req.busboy.on('file', (fieldname, filestream, filename, encoding, mimetype) => {
        const buffers = [];
        filestream.on('data', (data) => {
          buffers.push(data);
        });

        filestream.on('end', async () => {
          const buffer = Buffer.concat(buffers);
          file = {
            fieldname,
            originalname: filename,
            mimetype,
            buffer
          };
        });
      });

      req.busboy.on('finish', async () => {
        try {
          const updatedMetadata = await ImageMetadataService.updateMetadata(req.params.id, metadata, file);
          if (updatedMetadata) {
            res.status(200).json(updatedMetadata);
          } else {
            res.status(404).json({ message: 'Metadata not found.' });
          }
        } catch (error) {
          console.error(`Error updating metadata: ${error.message}`);
          res.status(500).json({ error: 'Something went wrong while updating metadata.' });
        }
      });
    } catch (error) {
      console.error(`Error parsing request: ${error.message}`);
      res.status(400).json({ error: 'Error parsing request.' });
    }
  }

  async softDeleteMetadata(req, res, next) {
    try {
      const metadata = await ImageMetadataService.softDeleteMetadata(req.params.id);
      if (metadata) {
        res.status(200).json({ message: 'Metadata soft-deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Metadata not found.' });
      }
    } catch (error) {
      console.error(`Error soft-deleting metadata: ${error.message}`);
      res.status(500).json({ error: 'Something went wrong while soft-deleting metadata.' });
    }
  }

  async listMetadata(req, res, next) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);
      const metadataList = await ImageMetadataService.listImages(filters, parsedPage, parsedLimit);
      res.status(200).json(metadataList);
    } catch (error) {
      console.error(`Error listing metadata: ${error.message}`);
      res.status(500).json({ error: 'Something went wrong while listing metadata.' });
    }
  }
}

module.exports = ImageMetadataController;
