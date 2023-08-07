import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageDetailsComponent = ({ match }) => {
    const [imageDetails, setImageDetails] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const imageId = match.params.id; // Assuming you're using React Router to get the ID from the route

    const fetchImageDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/metadata/${imageId}`);
            setImageDetails(response.data);
        } catch (error) {
            setErrorMessage('Error fetching image details. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/metadata/${imageId}`);
            // You can navigate back to the list or show a success message here
        } catch (error) {
            setErrorMessage('Error deleting image. Please try again.');
        }
    };

    useEffect(() => {
        fetchImageDetails();
    }, [imageId]);

    return (
        <div className="container mt-5">
            <h2>Image Details</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div>
                <h3>{imageDetails.title}</h3>
                <p>{imageDetails.description}</p>
                <p>Category: {imageDetails.category}</p>
                <p>Tags: {imageDetails.tags?.join(', ')}</p>
                {/* Assuming there's a link to the actual image in the details */}
                <img src={imageDetails.imageUrl} alt={imageDetails.title} className="img-fluid mb-3" />
                <button className="btn btn-warning mr-2">Edit</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default ImageDetailsComponent;
