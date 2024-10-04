import React, { useEffect, useState } from 'react';
import TodoList from '../components/TodoList';
import cable from '../cable';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoPage: React.FC = () => {
  const currentPath = window.location.pathname
  if (currentPath == "" || !uuidValidate(currentPath.substring(1))) {
    window.history.replaceState({}, '', window.location.origin + '/' + uuidv4());
  }

  const listId: string = currentPath.substring(1);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const disconnect = () => {
    setIsConnected(false)
  }


  useEffect(() => {
    fetch('http://localhost:3000/lists/' + listId + '/todos')
      .then(response => response.json())
      .then(data => setTodos(data));

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
    <div>
      <h1 className="text-2xl">{listId}</h1>
      <div className="flex justify-end items-center">
        <span className="mr-2">{isConnected ? 'Connected' : 'Updating'}</span>
        <div className={'w-3 h-3 rounded-full ' + (isConnected ? 'bg-green-500' : 'bg-orange-500')}></div>
      </div>
      <TodoList initialTodos={todos} listId={listId} updating={disconnect} />
    </div>
  );
};

export default TodoPage;
