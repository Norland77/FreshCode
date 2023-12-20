# NestJS Project Management App

## Overview

This project is a NestJS application designed for managing project tasks. Users of the app can create project boards, which contain cards representing project tasks grouped into lists. This README provides essential information for setting up and running the project.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [PostgreSQL](https://www.postgresql.org/) (v10 or later)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Norland77/freshcode.git
    ```

2. Navigate to the project directory:

    ```bash
    cd freshcode
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Database Setup

Before starting the application, you need to set up the database.

1. Run database migrations:

    ```bash
    npm run migrate
    ```

2. Seed the database with initial data (optional):

    ```bash
    npm run seed
    ```

### Running the Application

Start the NestJS application with the following command:

```bash
npm run start
```

The application will be accessible at `http://localhost:5000`. You can change the port by modifying the configuration in `src/main.ts`.

## Usage

- Access the application in your web browser at `http://localhost:5000`.
- Create project boards and add lists and cards to manage project tasks effectively.

## Commands

- To start the application: `npm run start`
- To run database migrations: `npm run migrate`
- To seed the database: `npm run seed`

## Contributing

If you would like to contribute to the project, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

Happy coding!