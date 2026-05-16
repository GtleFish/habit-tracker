// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Database errors
  if (err.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({
      error: "Duplicate entry",
      message: "This record already exists",
    });
  }

  if (err.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      error: "Invalid reference",
      message: "Referenced record does not exist",
    });
  }

  if (err.code === "22P02") {
    // Invalid input syntax
    return res.status(400).json({
      error: "Invalid input",
      message: "Invalid data format",
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.url} not found`,
  });
};
