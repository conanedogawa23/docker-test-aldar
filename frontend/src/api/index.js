import axios from 'axios';
import { Readable } from 'stream';

// Create an instance of axios with custom configuration
const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your backend API URL
  timeout: 10000, // Set request timeout to 10 seconds
});

// Intercept and handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // The request was made, but the server responded with an error status
      console.error('Server Error:', error.response.data);
      throw new Error(error.response.data.message || 'Server Error');
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No Response:', error.request);
      throw new Error('No response from the server');
    } else {
      // Something else happened while setting up the request
      console.error('Request Error:', error.message);
      throw new Error('Request Error');
    }
  }
);

// Create Metadata with Streamed File Upload
export const createMetadata = async (metadata) => {
  try {
    const formData = new FormData();
    formData.append('title', metadata.title);
    formData.append('description', metadata.description);
    formData.append('category', metadata.category);
    formData.append('tags', JSON.stringify(metadata.tags));

    // Convert file data to a Readable stream before appending to the formData
    const imageStream = Readable.from(metadata.image);
    formData.append('image', imageStream);

    const response = await api.post('/api/metadata', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get All Metadata (Paginated with Filters)
export const getAllMetadata = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await api.get('/api/metadata', {
      params: { page, limit, ...filters },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Metadata by ID
export const getMetadataById = async (id) => {
  try {
    const response = await api.get(`/api/metadata/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Metadata with Streamed File Upload
export const updateMetadata = async (id, metadata) => {
  try {
    const formData = new FormData();
    formData.append('title', metadata.title);
    formData.append('description', metadata.description);
    formData.append('category', metadata.category);
    formData.append('tags', JSON.stringify(metadata.tags));

    // Convert file data to a Readable stream before appending to the formData
    const imageStream = Readable.from(metadata.image);
    formData.append('image', imageStream);

    const response = await api.put(`/api/metadata/${id}`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete Metadata
export const deleteMetadata = async (id) => {
  try {
    const response = await api.delete(`/api/metadata/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Download File with Streamed Response
export const downloadFile = async (id) => {
  try {
    const response = await api.get(`/api/metadata/${id}/file`, {
      responseType: 'stream',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
