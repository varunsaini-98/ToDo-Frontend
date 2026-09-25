import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/axiosInstance.js";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import TodoForm from "../components/todo/TodoForm.jsx";
import Header from "../components/layout/Header.jsx";

const HomePage = ({ searchTerm }) => {
  const { user, loading: authLoading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("DESC");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(6);

  // Modal State for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, searchTerm, sort, page]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/todo?search=${searchTerm}&sort=${sort}&page=${page}&limit=${limit}`,
      );
      setTodos(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTodo = async (formData) => {
    try {
      if (editingTodo) {
        await API.put(`/todo/update/${editingTodo._id}`, formData);
      } else {
        await API.post("/todo/add", formData);
      }
      fetchTodos();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/todo/delete/${id}`);
      fetchTodos();
    } catch (err) {
      alert("Error deleting todo");
    }
  };

  const handleToggleStatus = async (todo) => {
    try {
      await API.put(`/todo/update/${todo._id}`, {
        isCompleted: !todo.isCompleted,
      });
      fetchTodos();
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (authLoading) {
    return <p className="state-message">Verifying session...</p>;
  }

  // ============================================================
  // 1. UNAUTHENTICATED VIEW (Shown when user is NOT logged in)
  // ============================================================
  if (!user) {
    return (
      <div className="landing-container">
        <Header
          title="Welcome to ToDo App"
          subtitle="Streamline your workflow, track task completion, and organize your daily goals."
        />
        <div className="landing-auth-prompt">
          <p className="prompt-text">
            Please log in or create an account to view and manage your todo
            list.
          </p>
          <div className="landing-buttons">
            <Link to="/login">
              <Button variant="primary" className="btn-large">
                Login to Your Account
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="btn-large">
                Register New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. AUTHENTICATED DASHBOARD VIEW (Shown ONLY after login)
  // ============================================================
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="page-container">
      <Header
        title={`Welcome back, ${user.name}! 👋`}
        subtitle="Here is your personal task management overview."
      />

      <div className="dashboard-controls">
        <Button
          variant="primary"
          onClick={() => {
            setEditingTodo(null);
            setIsModalOpen(true);
          }}
        >
          ➕ Add New Task
        </Button>

        <div className="sort-control">
          <label>Sort By Date: </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="state-message">Loading your tasks...</p>
      ) : todos.length === 0 ? (
        <p className="state-message">
          No tasks found. Click "Add New Task" to create one!
        </p>
      ) : (
        <div className="todo-grid">
          {todos.map((todo) => (
            <Card
              key={todo._id}
              todo={todo}
              onEdit={(item) => {
                setEditingTodo(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteTodo}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>

      {/* Add / Edit Modal Form */}
      <TodoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTodo}
        initialData={editingTodo}
      />
    </div>
  );
};

export default HomePage;
