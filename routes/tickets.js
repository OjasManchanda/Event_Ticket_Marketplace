const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware");
const ticketController = require("../controllers/ticketController");

// All tickets
router.get("/", ticketController.index);

// Search tickets
router.get("/search", ticketController.searchTickets);

// My booked tickets (MOVE UP)
router.get("/my-tickets", isLoggedIn, ticketController.myBookedTickets);

// Admin routes (MOVE UP)
router.get("/admin/dashboard", isLoggedIn, isAdmin, ticketController.adminDashboard);
router.get("/admin/qr-scanner", isLoggedIn, isAdmin, ticketController.qrScanner);

// New form
router.get("/new", isLoggedIn, ticketController.renderNewForm);

// Create ticket
router.post("/", isLoggedIn, ticketController.createTicket);

// Show ticket (KEEP LAST)
router.get("/:id", ticketController.showTicket);

// Edit form
router.get("/:id/edit", isLoggedIn, ticketController.renderEditForm);

// Update ticket
router.put("/:id", isLoggedIn, ticketController.updateTicket);

// Delete ticket
router.delete("/:id", isLoggedIn, ticketController.deleteTicket);

// Book ticket
router.post("/:id/book", isLoggedIn, ticketController.bookTicket);

// Cancel ticket
router.post("/:id/cancel", isLoggedIn, ticketController.cancelTicket);

// Confirmation
router.get("/:id/confirmation", isLoggedIn, ticketController.showConfirmation);

// Download PDF
router.get("/:id/download", isLoggedIn, ticketController.downloadTicket);

module.exports = router;