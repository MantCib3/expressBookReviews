const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated; // Adjust path if needed
const genl_routes = require('./router/general.js').general; // Adjust path if needed

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Session middleware for /customer routes
app.use("/customer", session({
  secret: "fingerprint_customer", // Use env variable in production
  resave: false, // Don’t save session if unmodified
  saveUninitialized: false // Don’t create session until something is stored
}));

// Authentication middleware for protected routes under /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
  // Check for JWT in Authorization header or session
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authorization token provided" });
  }

  // Expect token format: "Bearer <token>"
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, 'your-secret-key'); // Match secret with auth_users.js
    req.user = decoded; // Attach user info to request
    next(); // Proceed to the route
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
});
// Mount routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running on port 5000"));