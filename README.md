
# Docker Test Aldar: Image Metadata Project

This project offers a comprehensive solution for handling image metadata. It encompasses a backend API, a MongoDB database, a frontend application, and a periodic backup service for the database.

## Prerequisites

1. **Docker and Docker Compose**:
   Ensure Docker and Docker Compose are installed on your machine. If not, you can get them [here](https://docs.docker.com/get-docker/) and [here](https://docs.docker.com/compose/install/), respectively.

2. **Permissions**:
   Ensure you have the necessary permissions to run Docker commands, or you can use the `sudo` command where required.

## Setup and Deployment

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/conanedogawa23/docker-test-aldar.git
   cd docker-test-aldar
   ```

2. **Environment Configuration**:

   Before deploying, ensure that you modify the default MongoDB username and password provided in the `docker-compose.yaml` file to more secure credentials suitable for a production environment.

3. **Starting the Services**:

   From the directory containing the `docker-compose.yaml` file:

   ```bash
   docker-compose up -d --build
   ```

   This will build the necessary Docker images and start all services in detached mode.

4. **Accessing the Applications**:

   - **Frontend**: Accessible via `http://<YOUR_HOST_NAME>:3000` or `http://localhost:3000` if you're running it locally.
   - **Backend**: While it communicates with the frontend and MongoDB services internally, it's not directly exposed to the host.

5. **Stopping and Cleaning Up**:

   To stop all services and remove associated Docker containers:

   ```bash
   docker-compose down
   ```

## API Endpoints

- **POST `/metadata`**: Use this endpoint to create metadata entries for images. Adhere to the schema defined within `image.controller.js` when crafting requests.

## Monitoring and Backups

- The project has a built-in backup service (`mongo_backup`) that periodically backs up the MongoDB database. Regularly check the backup location to ensure backups are successful.
- For production-grade monitoring, consider integrating tools like Prometheus and Grafana to keep an eye on the health and performance of your services.

## Security Considerations

- Always use secure credentials and consider integrating secrets management tools for production deployments.
- Implement proper input validation and error handling in the backend service to prevent potential vulnerabilities.
- Consider setting up a reverse proxy (e.g., Nginx) in front of your applications to manage SSL/TLS and enhance security.

## Maintenance and Support

For any issues, feature requests, or contributions, please raise an issue or submit a pull request on the [project's GitHub repository](https://github.com/conanedogawa23/docker-test-aldar.git).

