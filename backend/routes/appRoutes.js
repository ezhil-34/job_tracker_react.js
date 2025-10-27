const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all applications for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const apps = await Application.find({ user: req.user._id });
  res.json(apps);
});

// Add new application
router.post("/", authMiddleware, async (req, res) => {
  const { company, role, status, date } = req.body;
  const app = await Application.create({ user: req.user._id, company, role, status, date });
  res.status(201).json(app);
});

// Update application
router.put("/:id", authMiddleware, async (req, res) => {
  const { company, role, status, date } = req.body;
  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { company, role, status, date },
    { new: true }
  );
  res.json(app);
});

// Delete application
router.delete("/:id", authMiddleware, async (req, res) => {
  await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Application deleted" });
});

module.exports = router;
