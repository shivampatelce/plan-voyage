import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Edit3, Trash2, Plus, X } from 'lucide-react';
import type { Trip } from '@/types/Trip';
import { useParams } from 'react-router';
import { API_PATH } from '@/consts/ApiPath';
import { apiRequest } from '@/util/apiRequest';
import { appBadgeBackgroundColors } from '@/util/appColors';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [trip, setTrip] = useState<Trip>();
  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams<{ tripId: string }>();

  useEffect(() => {
    fetchTripDetails();
  }, []);

  const fetchTripDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
        API_PATH.TRIP_OVERVIEW + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: Trip };

      const trip: Trip = {
        ...data,
        tripUsers: data.tripUsers.map((user, index) => ({
          ...user,
          color: `bg-${appBadgeBackgroundColors[index % 10]}-500`,
        })),
      };

      setTrip(trip);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching trip details:', error);
      setIsLoading(false);
    }
  };

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id: number) => {
    if (editValue.trim() !== '') {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editValue.trim() } : todo
        )
      );
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              To-Do List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Todo Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new todo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTodo)}
                className="flex-1"
              />
              <Button
                onClick={addTodo}
                className="px-4"
                disabled={!inputValue.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Todo List */}
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No todos yet. Add one above to get started!
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {editingId === todo.id ? (
                      // Edit mode
                      <>
                        <Input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) =>
                            handleKeyPress(e, () => saveEdit(todo.id))
                          }
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => saveEdit(todo.id)}
                          disabled={!editValue.trim()}
                          className="h-8 w-8 p-0">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                          className="h-8 w-8 p-0">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      // Display mode
                      <>
                        <Badge
                          variant={todo.completed ? 'secondary' : 'default'}
                          className={`flex-1 justify-start px-3 py-2 text-sm ${
                            todo.completed
                              ? 'line-through text-gray-500 bg-gray-100'
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                          {todo.text}
                        </Badge>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={todo.completed ? 'default' : 'outline'}
                            onClick={() => toggleComplete(todo.id)}
                            className="h-8 w-8 p-0"
                            title={
                              todo.completed
                                ? 'Mark as incomplete'
                                : 'Mark as complete'
                            }>
                            <Check
                              className={`w-4 h-4 ${
                                todo.completed ? 'text-white' : 'text-gray-600'
                              }`}
                            />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(todo.id, todo.text)}
                            className="h-8 w-8 p-0"
                            title="Edit todo">
                            <Edit3 className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTodo(todo.id)}
                            className="h-8 w-8 p-0"
                            title="Delete todo">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {todos.length > 0 && (
              <div className="text-center text-sm text-gray-600 border-t pt-4">
                Total: {todos.length} | Completed:{' '}
                {todos.filter((t) => t.completed).length} | Remaining:{' '}
                {todos.filter((t) => !t.completed).length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {trip?.tripUsers.map((user, index) => (
                <div
                  key={index}
                  className="m-2 group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-black-300 transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-10 h-10 ${
                        user.color || 'bg-gray-500'
                      } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ToDoList;
