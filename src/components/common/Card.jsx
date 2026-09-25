import React from "react";
import Button from "./Button.jsx";

const Card = ({ todo, onEdit, onDelete, onToggleStatus }) => {
  const formattedDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`todo-card ${todo.isCompleted ? "completed" : ""}`}>
      <div className="card-header">
        <h3 className="card-title">{todo.title}</h3>
        <span
          className={`status-badge ${todo.isCompleted ? "badge-done" : "badge-pending"}`}
        >
          {todo.isCompleted ? "Completed" : "Pending"}
        </span>
      </div>

      <p className="card-description">
        {todo.description || "No description provided."}
      </p>

      <div className="card-footer">
        <span className="card-date">📆 {formattedDate}</span>
        <div className="card-actions">
          <Button variant="secondary" onClick={() => onToggleStatus(todo)}>
            {todo.isCompleted ? "Undo" : "Complete"}
          </Button>
          <Button variant="edit" onClick={() => onEdit(todo)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(todo._id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
