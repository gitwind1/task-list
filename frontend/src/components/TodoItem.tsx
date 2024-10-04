import React, { useState } from 'react';
import { CheckIcon, Cog8ToothIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggleComplete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(todo.id, text);
    }
    setIsEditing(!isEditing);
    setIsSettingsOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-black-100">
      <div className="flex items-center">
        <button onClick={toggleSettings} className="p-1 rounded hover:bg-black-200">
          <Cog8ToothIcon className="h-5 w-5 text-black-600" />
        </button>

        {isSettingsOpen && (
          <>
            <button
              onClick={handleEdit}
              className="p-1 rounded hover:bg-black-200"
            >
              <PencilSquareIcon className="h-5 w-5 text-blue-500" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1 rounded hover:bg-black-200"
            >
              <TrashIcon className="h-5 w-5 text-red-500" />
            </button>
          </>
        )}

        <div className={`flex ${isSettingsOpen ? 'ml-4' : 'ml-2'}`}>
          {isEditing ? (
            <input
              className="border-b border-black-300 focus:outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit();
              }}
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className={`cursor-pointer ${todo.completed ? 'line-through text-black-500' : ''}`}
            >
              {todo.text}
            </span>
          )}
        </div>
      </div>
      <button onClick={() => onToggleComplete(todo.id)} className="mr-2">
        {todo.completed ? (
          <CheckIcon className="h-5 w-5 text-green-500" />
        ) : (
          <div className="h-5 w-5 border border-black-300 rounded"></div>
        )}
      </button>
    </div>
  );
};

export default TodoItem;