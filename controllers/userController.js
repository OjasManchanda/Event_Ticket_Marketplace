const User = require("../models/user");
const passport = require("passport");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signupUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("Registration attempt:", { username, email, role });

    const user = new User({ email, username, role });
    const registeredUser = await User.register(user, password);

    console.log(
      "User registered successfully:",
      registeredUser.username,
      registeredUser.role
    );

    // Log in user after registration
    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Error logging in user after registration:", err);
        req.flash(
          "error",
          "Registration successful, but login failed. Please log in manually."
        );
        return res.redirect("/users/login");
      }

      console.log(
        "User logged in successfully:",
        req.user.username,
        req.user.role
      );

      req.flash(
        "success",
        `Welcome to Event Ticket Marketplace, ${req.user.username}!`
      );

      // Redirect based on role
      if (req.user.role === "admin" || req.user.role === "seller") {
        console.log("Redirecting seller/admin to /tickets/new");
        return res.redirect("/tickets/new");
      } else {
        console.log("Redirecting buyer to /tickets");
        return res.redirect("/tickets");
      }
    });
  } catch (e) {
    console.error("Error during user registration:", e);
    req.flash("error", e.message);
    res.redirect("/users/signup");
  }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// Handle login
module.exports.loginUser = (req, res) => {
  console.log("Login function called");

  if (!req.user) {
    req.flash("error", "Login failed. Please try again.");
    return res.redirect("/users/login");
  }

  console.log("User logged in:", req.user.username, req.user.role);

  req.flash("success", "Welcome back!");

  // Redirect based on role
  if (req.user.role === "admin" || req.user.role === "seller") {
    const redirectUrl = req.session.returnTo || "/tickets/new";
    delete req.session.returnTo;
    return res.redirect(redirectUrl);
  } else {
    const redirectUrl = req.session.returnTo || "/tickets";
    delete req.session.returnTo;
    return res.redirect(redirectUrl);
  }
};

// Logout
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/");
  });
};
