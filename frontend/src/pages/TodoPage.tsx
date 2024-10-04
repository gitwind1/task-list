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
  if(currentPath == "" || !uuidValidate(currentPath.substring(1))){
    window.history.replaceState({}, '', window.location.origin + '/' + uuidv4());
  }

  const listId: string = currentPath.substring(1);
  const [todos, setTodos] = useState<Todo[]>([]);
  console.log(listId)

  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: 'TodoListChannel', list_id: listId },
      {
        received: (data: Todo[]) => {
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
      <TodoList initialTodos={todos} />
    </div>
  );
};

export default TodoPage;
