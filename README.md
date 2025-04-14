# Audio Hub

[![PyPI - Version](https://img.shields.io/pypi/v/app.svg)](https://pypi.org/project/app)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/app.svg)](https://pypi.org/project/app)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

---

## Project Overview

This project implements the backend of a full-stack web application using **FastAPI**. It includes user authentication, CRUD operations for users and audio files, and email verification using SendGrid. The backend is built following best practices and includes unit tests for key functionality.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd nba-sports-tracker
   ```

2. **Set Up Hatch Environment**:
   Install `hatch` if you don’t already have it:
   ```bash
   pip install hatch
   ```

3. **Create and Activate the Environment**:
   Use `hatch` to create and activate the environment:
   ```bash
   hatch env create
   hatch shell
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following content:
   ```env
   DATABASE_URL=sqlite:///test_db.db
   SECRET_KEY=your_secret_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

---

## Project Structure

```
nba-sports-tracker/
├── app/
│   ├── main.py               # Entry point for the application
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas for validation
│   ├── services/             # CRUD operations
│   ├── routes/               # API endpoints
│   ├── core/                 # Core utilities (auth, config, database)
│   ├── dependencies.py       # Dependency injection
├── tests/                    # Postman collections and unit tests
├── .env                      # Environment variables
├── pyproject.toml            # Project configuration
└── README.md                 # Project documentation
```

---

## Running the Application

1. **Start the Development Server**:
   Use the following command to start the FastAPI server:
   ```bash
   hatch run dev
   ```

2. **Access the API**:
   Open your browser and navigate to:
   - API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - ReDoc Documentation: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## API Endpoints

### User Endpoints
- **POST** `/auth/make_user`: Create a new user.
- **POST** `/auth/token`: Login and generate an access token.
- **PUT** `/auth/user/update/{user_id}`: Update user information.
- **PUT** `/auth/user/update/username/{user_id}`: Update username.
- **PUT** `/auth/user/update/password/{user_id}`: Update password.
- **PUT** `/auth/user/update/email/{user_id}`: Update email.
- **DELETE** `/auth/user/delete/{user_id}`: Delete a user.

### Audio Endpoints
- **POST** `/auth/audio/create/{user_id}`: Create a new audio record.
- **GET** `/auth/audio/get_audios/{user_id}`: Get all audio records for a user.
- **PUT** `/auth/audio/update/{audio_id}`: Update an audio record.
- **DELETE** `/auth/audio/delete/{audio_id}`: Delete an audio record.

### Verification Endpoints
- **PUT** `/auth/user/verify/{user_id}`: Verify a user using a verification code.
- **PUT** `/auth/user/verify/newcoderequest/{user_id}`: Request a new verification code.

---

## Testing

### Postman Collections
Postman collections for testing the API are located in the `tests/` directory:
- `PostRequests.postman_collection.json`
- `PutRequests.postman_collection.json`
- `GetRequests.postman_collection.json`
- `DeleteRequests.postman_collection.json`

### Running Tests
1. **Import Postman Collections**:
   - Open Postman and import the collections from the `tests/` folder.
   - Set the `localhost` variable to `http://127.0.0.1:8000`.

2. **Run the Tests**:
   - Use the Postman Collection Runner to execute the tests.

---

## License

This project is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
