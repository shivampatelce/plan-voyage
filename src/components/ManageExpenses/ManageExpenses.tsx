import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { Pencil, Plus, DollarSign, AlertTriangle, Trash2 } from 'lucide-react';
import SetBudgetDialog from './SetBudgetDialog';
import type { Trip, TripUsers } from '@/types/Trip';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import { appBadgeBackgroundColors } from '@/util/appColors';
import { useNavigate, useParams } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import AddExpense from './AddExpense';
import type { Expense, ExpenseData, ExpenseReq } from '@/types/Expense';
import DeleteExpenseConfirmationDialog from './DeleteExpenseConfirmationDialog';
import { toast } from 'sonner';

const ManageExpenses: React.FC = () => {
  const [trip, setTrip] = useState<Trip>();
  const [budget, setBudget] = useState(0);
  const [editingBudget, setEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { tripId } = useParams<{ tripId: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const expensePercentage = Math.min((totalExpenses / budget) * 100, 100);
  const remainingBudget = budget - totalExpenses;

  useEffect(() => {
    const fetchTripOverview = async () => {
      setIsLoading(true);
      try {
        const { data } = (await apiRequest<unknown, { data: Trip }>(
          API_PATH.TRIP_OVERVIEW + `/${tripId}`,
          {
            method: 'GET',
          }
        )) as { data: Trip };

        const trip: Trip = {
          ...data,
          tripUsers: data.tripUsers.map((user, index) => ({
            ...user,
            color: `bg-${
              appBadgeBackgroundColors[index % appBadgeBackgroundColors.length]
            }-500`,
          })),
        };

        setTrip(trip);
        fetchBudget(trip.tripUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching trip overview:', error);
        setIsLoading(false);
      }
    };
    fetchTripOverview();
  }, [tripId]);

  const fetchBudget = async (tripUsers: TripUsers[]) => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
        API_PATH.GET_BUDGET + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: { totalBudget: number; expenses: Expense[] } };

      if (data) {
        const { totalBudget } = data;

        const expenses = data.expenses.map((expense) => ({
          ...expense,
          splitDetails: expense.splitDetails.map((detail) => {
            const userDetails = tripUsers.find(
              (user) => user.userId === detail.userId
            );
            return {
              ...detail,
              userDetails,
            };
          }),
        }));

        setBudget(totalBudget);
        setExpenses(expenses);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching budget:', error);
      setIsLoading(false);
    }
  };

  const handleBudgetSave = async () => {
    const budgetValue = parseFloat(newBudget);
    if (!isNaN(budgetValue) && budgetValue > 0) {
      try {
        const setBudgetReq = {
          tripId: tripId!,
          budget: budgetValue,
        };
        const { data } = (await apiRequest<
          { budget: number; tripId: string },
          { data: { totalBudget: number } }
        >(budget === 0 ? API_PATH.SET_BUDGET : API_PATH.UPDATE_BUDGET, {
          method: 'POST',
          body: setBudgetReq,
        })) as { data: { totalBudget: number } };

        const { totalBudget } = data;
        setBudget(totalBudget);

        setIsLoading(false);
      } catch (error) {
        console.error('Error while setting budget:', error);
        setIsLoading(false);
      }
      setEditingBudget(false);
    }
  };

  const handleBudgetCancel = () => {
    setNewBudget(budget.toString());
    setEditingBudget(false);
  };

  const openDialog = () => {
    setEditingBudget(true);
  };

  const handleAddExpense = async (expenseData: ExpenseData) => {
    const expenseReq: ExpenseReq = { ...expenseData, tripId: tripId! };
    try {
      await apiRequest<ExpenseReq, Expense>(API_PATH.ADD_EXPENSE, {
        method: 'POST',
        body: expenseReq,
      });

      if (trip?.tripUsers) fetchBudget(trip?.tripUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while setting budget:', error);
      setIsLoading(false);
    }
  };

  const deleteExpense = async () => {
    try {
      await apiRequest<void, void>(
        `${API_PATH.DELETE_EXPENSE}/${deleteExpenseId}`,
        {
          method: 'DELETE',
        }
      );

      if (trip?.tripUsers) fetchBudget(trip?.tripUsers);
      toast.success('A expense has been deleted.');
      setIsLoading(false);
    } catch (error) {
      console.error('Error while setting budget:', error);
      setIsLoading(false);
    }
    setDeleteExpenseId(null);
  };

  const handleShowDeleteDialog = () => {
    setShowDeleteDialog(!showDeleteDialog);
  };

  if (budget === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="w-5 h-5" />
                Budget
              </CardTitle>
              <CardDescription>Track your trip budget</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex justify-center flex-col">
            <h2 className="text-center text-2xl">
              Set Budget To Start Manage Your Expense
            </h2>
            <div className="flex justify-center">
              <Button
                size="sm"
                onClick={openDialog}
                className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Set Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        <SetBudgetDialog
          editingBudget={editingBudget}
          newBudget={newBudget}
          setNewBudget={(budget) => setNewBudget(budget)}
          handleBudgetCancel={handleBudgetCancel}
          handleBudgetSave={handleBudgetSave}
          setEditingBudget={(value) => setEditingBudget(value)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900">Manage Expenses</h2>
      </div>

      {/* Budget Overview Card */}
      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="w-5 h-5" />
                Budget Overview
              </CardTitle>
              <CardDescription>Track your trip budget</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingBudget(true);
                setNewBudget(budget.toString());
              }}
              className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Amount Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-600">Total Budget</p>
              <p className="text-2xl font-bold text-blue-900">
                ${budget.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-600">Total Spent</p>
              <p className="text-2xl font-bold text-red-900">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-600">Remaining</p>
              <p
                className={`text-2xl font-bold ${
                  remainingBudget >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                ${Math.abs(remainingBudget).toLocaleString()}
                {remainingBudget < 0 && ' over'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Budget Progress</Label>
              <span className="text-sm text-gray-600">
                {expensePercentage.toFixed(1)}% used
              </span>
            </div>
            <Progress
              value={expensePercentage}
              className="h-3"
            />
            {expensePercentage >= 90 && (
              <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                <AlertTriangle className="w-4 h-4" />
                {expensePercentage >= 100
                  ? 'You have exceeded your budget!'
                  : 'You are approaching your budget limit!'}
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto">
              {/* Stats Bar */}
              <div className="bg-gradient-to-r bg-gray-200 rounded-lg p-4 mb-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Total Members:
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-800 font-semibold">
                      {trip?.tripUsers.length}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/${ROUTE_PATH.INVITE}/${tripId}`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Users
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Users</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4"></div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Expenses</CardTitle>
              <CardDescription>Your latest spending activities</CardDescription>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowAddExpense(true)}>
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <div className="flex items-center justify-center flex-col">
                <h4 className="text-2xl p-8">Add Your First Expense</h4>
                <div className="flex justify-center">
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => setShowAddExpense(true)}>
                    <Plus className="w-4 h-4" />
                    Add Expense
                  </Button>
                </div>
              </div>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.expenseId}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{expense.title}</p>
                          <p className="text-sm text-gray-600">
                            {expense.category} •{' '}
                            {new Date(expense.date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-red-600">
                        -${expense.amount}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteExpenseId(expense.expenseId);
                          setShowDeleteDialog(true);
                        }}
                        variant="ghost"
                        size="sm">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  {expense.splitDetails.map(
                    ({ userDetails, amount }, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center align-baseline p-2 border rounded-lg my-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-10 h-10 ${
                              userDetails?.color || 'bg-gray-700'
                            } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                            {userDetails?.firstName[0]}
                            {userDetails?.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0 ml-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {userDetails?.firstName} {userDetails?.lastName}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-red-600">
                          -${amount}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <SetBudgetDialog
        editingBudget={editingBudget}
        newBudget={newBudget}
        setNewBudget={(budget) => setNewBudget(budget)}
        handleBudgetCancel={handleBudgetCancel}
        handleBudgetSave={handleBudgetSave}
        setEditingBudget={(value) => setEditingBudget(value)}
      />

      <DeleteExpenseConfirmationDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={handleShowDeleteDialog}
        deleteExpense={deleteExpense}
      />

      <AddExpense
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={handleAddExpense}
        tripUsers={trip?.tripUsers || []}
      />
    </div>
  );
};

export default ManageExpenses;
