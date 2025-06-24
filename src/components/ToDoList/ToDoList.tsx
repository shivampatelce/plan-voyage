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
import keycloak from '@/keycloak-config';
import type { AddTaskReq, ToDoList } from '@/types/ToDoList';

const ToDoList: React.FC = () => {
  const [todos, setTodos] = useState<ToDoList[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [trip, setTrip] = useState<Trip>();
  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams<{ tripId: string }>();

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [tripId]);

  const fetchTripDetails = async (tripId: string) => {
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
        tripUsers: data.tripUsers.map((user, index) => {
          const color =
            appBadgeBackgroundColors[index % appBadgeBackgroundColors.length];
          return {
            ...user,
            color: color,
            badgeBgColor: `bg-${color}-500`,
          };
        }),
      };

      setTrip(trip);
      fetchToDoList(tripId, trip);
    } catch (error) {
      console.error('Error while fetching trip details:', error);
      setIsLoading(false);
    }
  };

  const fetchToDoList = async (tripId: string, trip: Trip) => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<unknown, unknown>(
        API_PATH.TO_DO_LIST + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: ToDoList[] };

      const toDoList: ToDoList[] = data.map((todo) => {
        const user = trip.tripUsers.find((u) => u.userId === todo.createdBy);
        return {
          ...todo,
          bgColor: `bg-${user?.color}-100`,
          textColor: `text-${user?.color}-800`,
        };
      });

      setTodos(toDoList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching trip details:', error);
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() !== '' && tripId && keycloak.subject) {
      try {
        const task: AddTaskReq = {
          taskTitle: inputValue.trim(),
          tripId,
          createdBy: keycloak.subject,
        };

        await apiRequest<AddTaskReq, unknown>(API_PATH.ADD_TO_DO_TASK, {
          method: 'POST',
          body: task,
        });

        if (trip) fetchToDoList(tripId, trip);
      } catch (error) {
        console.error('Error while fetching trip details:', error);
        setIsLoading(false);
      }

      setInputValue('');
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.taskId === id ? { ...todo, completed: !todo.markedDoneBy } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.taskId !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim() !== '') {
      setTodos(
        todos.map((todo) =>
          todo.taskId === id ? { ...todo, text: editValue.trim() } : todo
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
                    key={todo.taskId}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {editingId === todo.taskId ? (
                      // Edit mode
                      <>
                        <Input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) =>
                            handleKeyPress(e, () => saveEdit(todo.taskId))
                          }
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => saveEdit(todo.taskId)}
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
                          variant={todo.markedDoneBy ? 'secondary' : 'default'}
                          className={`flex-1 justify-start px-3 py-2 text-sm ${
                            todo.markedDoneBy
                              ? 'line-through text-gray-500 bg-gray-100'
                              : `${todo.bgColor} ${todo.textColor}`
                          }`}>
                          {todo.taskTitle}
                        </Badge>

                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={todo.markedDoneBy ? 'default' : 'outline'}
                            onClick={() => toggleComplete(todo.taskId)}
                            className="h-8 w-8 p-0"
                            title={
                              todo.markedDoneBy
                                ? 'Mark as incomplete'
                                : 'Mark as complete'
                            }>
                            <Check
                              className={`w-4 h-4 ${
                                todo.markedDoneBy
                                  ? 'text-white'
                                  : 'text-gray-600'
                              }`}
                            />
                          </Button>

                          {todo.createdBy === keycloak.subject && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                startEditing(todo.taskId, todo.taskTitle)
                              }
                              className="h-8 w-8 p-0"
                              title="Edit todo">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}

                          {todo.createdBy === keycloak.subject && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteTodo(todo.taskId)}
                              className="h-8 w-8 p-0"
                              title="Delete todo">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
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
                {todos.filter((t) => t.markedDoneBy).length} | Remaining:{' '}
                {todos.filter((t) => !t.markedDoneBy).length}
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
                        user.badgeBgColor || 'bg-gray-500'
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
