const mongoose = require('mongoose');
const ImageMetadata = require('../models/image.model');
const { createModel } = require('mongoose-gridfs');
const crypto = require('crypto');
const zlib = require('zlib');
const stream = require('stream');

const File = createModel({
    modelName: 'File',
    connection: mongoose.connection
});

class ImageMetadataService {

    async createMetadata(metadata, file) {
        const encryptedBuffer = this.encrypt(file.buffer, 'sample_key');
        const compressedBuffer = await this.compressStream(encryptedBuffer);

        const uploadStream = File.write({
            filename: file.originalname,
            contentType: file.mimetype,
        }, compressedBuffer);

        metadata.fileId = uploadStream.id;
        const newMetadata = new ImageMetadata(metadata);
        await newMetadata.save();
        return newMetadata;
    }

    async getMetadata(id) {
        const metadata = await ImageMetadata.findById(id);
        if (metadata) {
            const file = await File.findById(metadata.fileId);
            const decompressedBuffer = await this.decompressStream(file.buffer);
            const decryptedBuffer = this.decrypt(decompressedBuffer, 'sample_key');
            return {
                metadata,
                file: decryptedBuffer
            };
        }
        return null;
    }

    async updateMetadata(id, updateData, file) {
        const metadata = await ImageMetadata.findById(id);
        if (!metadata) return null;

        if (file) {
            const encryptedBuffer = this.encrypt(file.buffer, 'sample_key');
            const compressedBuffer = await this.compressStream(encryptedBuffer);
            await File.unlink({ _id: metadata.fileId });  // Delete old file

            const uploadStream = File.write({
                filename: file.originalname,
                contentType: file.mimetype,
            }, compressedBuffer);

            updateData.fileId = uploadStream.id;
        }

        for (let key in updateData) {
            metadata[key] = updateData[key];
        }

        await metadata.save();
        return metadata;
    }

    async deleteMetadata(id) {
        const metadata = await ImageMetadata.findById(id);
        if (!metadata) return null;

        metadata.isDeleted = true;
        await metadata.save();
        return metadata;
    }

    async listImages(filters, page = 1, limit = 10) {
        // Removing unwanted fields from filters
        const cleanFilters = _.pickBy(filters, _.identity);

        // Use the 'isDeleted' flag for soft deletion check
        cleanFilters.isDeleted = false;

        // Pagination
        const skip = (page - 1) * limit;

        const metadataList = await ImageMetadata.find(cleanFilters)
            .sort({ createdAt: -1 })  // Sorting by creation date
            .skip(skip)
            .limit(limit)
            .exec();

        const totalDocuments = await ImageMetadata.countDocuments(cleanFilters);

        return {
            totalPages: Math.ceil(totalDocuments / limit),
            currentPage: page,
            metadataList
        };
    }

    async compressStream(buffer) {
        return new Promise((resolve, reject) => {
            const input = new stream.Readable();
            input._read = () => {};
            input.push(buffer);
            input.push(null);

            const chunks = [];
            const gzip = zlib.createGzip();
            input.pipe(gzip).on('data', chunk => chunks.push(chunk)).on('end', () => {
                resolve(Buffer.concat(chunks));
            }).on('error', reject);
        });
    }

    async decompressStream(buffer) {
        return new Promise((resolve, reject) => {
            const input = new stream.Readable();
            input._read = () => {};
            input.push(buffer);
            input.push(null);

            const chunks = [];
            const gunzip = zlib.createGunzip();
            input.pipe(gunzip).on('data', chunk => chunks.push(chunk)).on('end', () => {
                resolve(Buffer.concat(chunks));
            }).on('error', reject);
        });
    }

    encrypt(data, key) {
        const cipher = crypto.createCipher('aes-256-cbc', key);
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }

    decrypt(data, key) {
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        return Buffer.concat([decipher.update(data), decipher.final()]);
    }
}

module.exports = new ImageMetadataService();
