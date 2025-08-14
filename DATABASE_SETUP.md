# Database Setup Guide

## The Issue
The signup page is not working because the rides API is failing to connect to the database. This happens when:
1. The database is not running
2. The database connection string is missing
3. The database tables haven't been created yet

## Quick Fix Steps

### 1. Create Environment Variables
Create a `.env` file in the root directory with:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/carpooling_db"
DIRECT_URL="postgresql://username:password@localhost:5432/carpooling_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install and Start PostgreSQL
```bash
# On Windows (using Chocolatey)
choco install postgresql

# On macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# On Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE carpooling_db;

# Create user (optional)
CREATE USER carpooling_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE carpooling_db TO carpooling_user;

# Exit
\q
```

### 4. Generate Prisma Client
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push
```

### 5. Alternative: Use SQLite for Development
If PostgreSQL is too complex, you can use SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env`:
```bash
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
```

3. Run:
```bash
npm run db:generate
npm run db:push
```

## Testing the Fix

After setting up the database:

1. Restart your development server:
```bash
npm run dev
```

2. Try to access the signup page
3. Check the browser console for any remaining errors
4. Test the rides API endpoint: `http://localhost:3000/api/rides`

## Common Issues

### "Database connection error"
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env file
- Ensure database exists

### "Table doesn't exist"
- Run `npm run db:push` to create tables
- Check if Prisma schema is correct

### "Authentication failed"
- Verify database username/password
- Check if user has proper permissions

## Need Help?

If you're still having issues:
1. Check the terminal for error messages
2. Verify database connection with `psql`
3. Ensure all environment variables are set
4. Try using SQLite for simpler development setup
