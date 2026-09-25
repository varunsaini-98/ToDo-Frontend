import React, { useState, useEffect } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";

const TodoForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>{initialData ? "Edit Todo Task" : "Add New Todo Task"}</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learn Node.js REST API"
            required
          />

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="input-field textarea-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add optional notes or details..."
              rows="4"
            />
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {initialData ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
