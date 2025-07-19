require("dotenv").config();
const express = require("express");
const pool = require("./database");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Route: Scan ticket via ticket_id from QR code
app.get("/scan", (req, res) => {
  const ticketId = req.query.ticket_id;

  if (!ticketId) {
    return res.status(400).send("❌ Missing ticket ID in QR code URL.");
  }

  pool.query(
    "SELECT table_number FROM ticket WHERE ticket_id = ? AND ticket_status = 'available'",
    [ticketId],
    (err, results) => {
      if (err) {
        console.error("❌ DB error:", err);
        return res.status(500).send("❌ Internal server error.");
      }

      if (results.length === 0) {
        return res.status(404).send("❌ Ticket not found or already used.");
      }

      const { table_number } = results[0];

      pool.query(
        "UPDATE ticket SET ticket_status = 'used' WHERE ticket_id = ?",
        [ticketId],
        (updateErr) => {
          if (updateErr) {
            console.error("❌ Failed to update status:", updateErr);
            return res.status(500).send("❌ Could not mark ticket as used.");
          }

          res.send(`
            <h1>✅ Ticket Verified</h1>
            <p><strong>Table Number:</strong> ${table_number}</p>
          `);
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}/scan?ticket_id=1`);
});
