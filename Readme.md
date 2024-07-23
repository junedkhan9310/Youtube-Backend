# Youtube-Backend

## Description

The Youtube-Backend project provides a backend system with functionalities similar to YouTube. It supports video uploads, deletions, profile creation, and integrates Twitter features.

## Features

- Video uploads and deletions
- Profile creation and management
- Twitter integration

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
    ```sh
    git clone https://github.com/junedkhan9310/Youtube-Backend.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Start the server
    ```sh
    npm start
    ```

## Usage

- To upload videos, manage profiles, and use Twitter features, follow the provided API endpoints in the documentation.

## Health Check

Ensure the server is running correctly by accessing the health check endpoint:
```sh
GET /healthcheck
```
Response:
```json
{
    "status": "OK",
    "message": "Healthcheck passed"
}
```

## Credits

This project was developed with guidance from [Hitesh Chaudhary](https://www.youtube.com/@chaiaurcode). Thank you for your valuable insights and support.
