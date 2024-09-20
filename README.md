https://api.postman.com/collections/37963166-abca3157-8584-43df-ab27-eea1d79f59cb?access_key=PMAT-01J886VCQXX4GJJK0D5Z9G9BPP

🎬 Movie Booking App
This project is a movie booking system built with Node.js, Express, PostgreSQL, and Sequelize ORM. It allows users to book seat, check seat availability, and manage seat bookings. Redis is used for caching seat availability data.

🚀 Features
Seat Management: View and book seats for different screens.
Booking Management: Book and update seat status (available/booked).
Redis Caching: Caches hall seating arrangements for optimized performance.

🛠️ Tech Stack
Backend: Node.js, Express.js
Database: PostgreSQL
ORM: Sequelize
Cache: Redis
Package Manager: NPM

📝 Installation
Requirements
Node.js v14+
PostgreSQL
Redis
Steps

# Clone the repository: 
git clone https://github.com/your-repo/movie-booking-app.git
cd movie-booking-app

# Install dependencies:
npm install

# Set up environment variables:
-> Create a .env file in the root directory and add the following:
APP_PORT=3000
JWT_SECRET=3wzxmoDsmQteZ3LKLndsJRDKVjHKgzHRQbfjTeugLzyvSaQDfN2q2qJjcackKPTgd279bu2zMCx3VbRbvS9vpF5AJjG4YqZxw3ukWqr5zX9hZo
DB_NAME=movie_booking
DB_USERNAME=postgres
DB_SECRET=your_db_password
DB_HOST=127.0.0.1
DB_PORT=5432
REDIS_HOST=127.0.0.1
REDIS_PORT=6379


# Start the development server:
npm run dev

🎯 API Documentation
Base URL
bash
Copy code
http://localhost:3000/api
Endpoints