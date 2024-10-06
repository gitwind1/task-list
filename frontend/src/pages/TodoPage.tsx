import React, { useEffect, useState } from 'react';
import TodoList from '../components/TodoList';
import cable from '../cable';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoPage: React.FC = () => {
  const currentPath = window.location.pathname
  if (currentPath.length < 3 || currentPath.substring(1).includes("/")) {
    window.history.replaceState({}, "", window.location.origin + "/" + uuidv4().substring(26));
  }

  const listId: string = currentPath.substring(1);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const disconnect = () => {
    setIsConnected(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  };

  useEffect(() => {
    fetch('http://localhost:3000/lists/' + listId + '/todos')
      .then(response => response.json())
      .then(data => {
        setTodos(data)
        setIsConnected(true)
      })

    const subscription = cable.subscriptions.create(
      { channel: 'TodoListChannel', list_id: listId },
      {
        received: (data: Todo[]) => {
          setIsConnected(true)
          setTodos(data);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [listId]);

  return (
    <div style={{ height: "650px" }} >
      <div className="p-2 bg-gray-100 rounded-md space-y-1">
        <p className="text-gray-600 text-sm font-medium">
          Share this link with a friend to collaborate and see updates in real time!
        </p>
        <div className="flex items-center bg-white p-2 rounded-md shadow-sm">
          <span className="text-gray-600 text-sm break-all flex-grow">{window.location.href}</span>
          <button
            onClick={handleCopy}
            className="ml-3 flex items-center px-3 py-1 text-sm text-white bg-blue-500 rounded-md focus:outline-none">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div className="flex justify-end items-center mt-3">
        <span className="mr-2 font-low">{isConnected ? 'Connected' : 'Updating'}</span>
        <div className={'w-3 h-3 rounded-full ' + (isConnected ? 'bg-green-500' : 'bg-orange-500')}></div>
      </div>
      <TodoList initialTodos={todos} listId={listId} updating={disconnect} />
    </div>
  );
};

export default TodoPage;
