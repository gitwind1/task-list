import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import { PlusIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type Filter = "all" | "pending" | "completed";

interface TodoListProps {
  initialTodos?: Todo[];
  listId?: string;
  updating: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  initialTodos = [],
  listId,
  updating,
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTodo, setNewTodo] = useState("");
  const apiUrl = "http://localhost:3000/lists/";

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const handleAdd = () => {
    updating();
    if (newTodo.trim() === "") return;
    fetch(apiUrl + listId + "/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uuidv4(),
        text: newTodo.trim(),
        completed: false,
      }),
    });
    setNewTodo("");
  };

  const handleDelete = (id: string) => {
    updating();
    fetch(apiUrl + listId + "/todos/" + id, {
      method: "DELETE",
    });
  };

  const handleToggleComplete = (id: string) => {
    updating();
    todos.map((todo) => {
      if (todo.id == id) {
        fetch(apiUrl + listId + "/todos/" + id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo: { completed: !todo.completed } }),
        });
      }
    });
  };

  const handleEdit = (id: string, newText: string) => {
    updating();
    fetch(apiUrl + listId + "/todos/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo: { text: newText } }),
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "pending") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <input
          className="flex-1 border p-2 rounded mr-2"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") {
              setNewTodo("");
            }
          }}
          placeholder="Enter new todo"
          autoFocus
        />
        <button
          onClick={handleAdd}
          className="flex items-center p-2 bg-blue-500 text-white rounded"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Todo
        </button>
      </div>

      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-black-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded ${
            filter === "pending" ? "bg-blue-500 text-white" : "bg-black-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-black-200"
          }`}
        >
          Completed
        </button>
      </div>
      <div>
        {filteredTodos.length === 0 ? (
          <p className="text-center text-black-500">No todos here!</p>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
