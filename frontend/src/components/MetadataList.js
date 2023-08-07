import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageListComponent = () => {
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchImages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/metadata?page=${page}&limit=${limit}`);
            setImages(response.data);
            // Assuming the backend also sends the total count of images, we can calculate the total pages
            const totalCount = response.headers['x-total-count'];
            setTotalPages(Math.ceil(totalCount / limit));
        } catch (error) {
            setErrorMessage('Error fetching images. Please try again.');
        }
    };

    useEffect(() => {
        fetchImages();
    }, [page, limit]);

    return (
        <div className="container mt-5">
            <h2>Image List</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map(image => (
                        <tr key={image.id}>
                            <td>{image.title}</td>
                            <td>{image.description}</td>
                            <td>{image.category}</td>
                            <td>{image.tags.join(', ')}</td>
                            <td>
                                <button className="btn btn-info btn-sm mr-2">View</button>
                                <button className="btn btn-warning btn-sm">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                    </li>
                    {[...Array(totalPages)].map((_, idx) => (
                        <li className={`page-item ${idx + 1 === page ? 'active' : ''}`} key={idx}>
                            <button className="page-link" onClick={() => setPage(idx + 1)}>{idx + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ImageListComponent;
