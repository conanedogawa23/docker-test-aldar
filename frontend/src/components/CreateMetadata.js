import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadComponent = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('tags', JSON.stringify(tags));
        formData.append('image', image);

        try {
            const response = await axios.post('/metadata', formData);
            setSuccessMessage('Image uploaded successfully!');
            // You can reset the form or navigate to another page if needed
        } catch (error) {
            setErrorMessage('Error uploading image. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Upload Image</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input type="text" className="form-control" id="category" value={category} onChange={e => setCategory(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
                    <input type="text" className="form-control" id="tags" onChange={e => setTags(e.target.value.split(','))} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" className="form-control" id="image" onChange={e => setImage(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default ImageUploadComponent;
