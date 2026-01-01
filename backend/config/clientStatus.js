const CLIENT_STATUS = Object.freeze({
  PENDING: "PENDING",                 // Associate added client
  FILED: "FILED",                     // Associate uploaded XML + form filled
  PENDING_REVIEW: "PENDING_REVIEW",   // Visible to CA
  CA_APPROVED: "CA_APPROVED",         // CA approved with remark
  BILLED: "BILLED",                   // Associate submitted bill + signed
  ADMIN_APPROVED: "ADMIN_APPROVED",   // Admin approved billing
  COMPLETED: "COMPLETED" ,            // Payment done
  CLOSED: "CLOSED"                    // Closed
});

export default CLIENT_STATUS;
