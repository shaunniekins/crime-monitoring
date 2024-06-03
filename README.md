# Crime Monitoring

This project uses MySQL for the database, Express for the backend, and React for the frontend.

## Deployment

### MySQL
We use [Clever Cloud](https://www.clever-cloud.com) for MySQL hosting. To set up:

1. Create an add-on.
2. Choose MySQL.
3. Select the plan that suits your needs (Dev for development).
4. Name your MySQL add-on (e.g., `crime-monitoring`).
5. Choose the location for your add-on.

### Express
We use [Render](https://https://render.com/) for Express hosting.

For local development, create a `.env` file with the following environment variable:

```env
DB_HOST_SECRET=<host> # e.g., localhost
DB_NAME_SECRET=<db_name>
DB_USER_SECRET=<user> # e.g., root
DB_PASSWORD_SECRET=<password>
DB_PORT_SECRET=<port> # e.g., 3306 (default MySQL port)

ACCESS_TOKEN_SECRET=<access_token> # for JWT
```

### React
We use [Vercel](https://vercel.com) for React hosting.

For local development, create a `.env` file with the following environment variable:

```env
REACT_APP_GOOGLE_API_KEY=<google-api-key>
```

### Local Development
- Frontend: http://localhost:3000
- Express server: http://localhost:3001

#### Note
> In both the `camClient` (React) and `camServer` (Express) directories, there are `urlConfig` files that define the appropriate URLs for the server and client applications based on the environment (production or development). These URLs are used for communication between the client and server.