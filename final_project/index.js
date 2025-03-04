const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session"); // For session management
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set up session middleware
app.use(
    session({
        secret: "my-session-secret", // Replace with a strong secret in production
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set to true if using HTTPS in production
    })
);

// JWT secret key (should be stored in environment variables in production)
const JWT_SECRET = "my_jwt_secret_123";

// Sample user data (replace with database in real app)
const users = [
    { id: 1, username: "testuser", password: "password123" }
];

// Middleware to authenticate JWT for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    const authData = req.session.authorization;
    if (!authData || !authData.accessToken) {
        return res.status(403).json({ message: "No token provided. Please log in." });
    }

    // Verify JWT token
    jwt.verify(authData.accessToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
        }
        req.user = decoded; // Attach decoded user data to request
        next(); // Proceed to the next handler
    });
});

// Login endpoint
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in: Username or password missing" });
    }

    // Authenticate user
    const user = authenticatedUser(username, password);
    if (user) {
        // Generate JWT access token
        let accessToken = jwt.sign(
            { id: user.id, username: user.username }, // Payload with user data
            JWT_SECRET,
            { expiresIn: "1h" } // 1 hour expiration
        );

        // Store access token and username in session
        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});
// Sample authentication function (replace with database query in production)
function authenticatedUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Example protected route
app.get("/customer/auth/profile", (req, res) => {
    res.status(200).json({ message: "Welcome to your profile", user: req.user });
});
// Start the server
app.listen(5000, () => {
    console.log("Server running on port 3000");
});
