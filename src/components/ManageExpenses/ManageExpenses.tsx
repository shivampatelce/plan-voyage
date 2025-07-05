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

import {
  Pencil,
  Plus,
  DollarSign,
  AlertTriangle,
  Trash2,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import SetBudgetDialog from './SetBudgetDialog';
import type { Trip, TripUsers } from '@/types/Trip';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import { appBadgeBackgroundColors } from '@/util/appColors';
import { useNavigate, useParams } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import AddExpense from './AddExpense';
import type {
  Expense,
  ExpenseData,
  ExpenseReq,
  NewSettlement,
  Settlement,
  SettlementActivity,
} from '@/types/Expense';
import DeleteExpenseConfirmationDialog from './DeleteExpenseConfirmationDialog';
import { toast } from 'sonner';
import keycloak from '@/keycloak-config';
import SettlementDialog from './SettlementDialog';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import DeleteActivityConfirmationDialog from './DeleteActivityConfirmationDialog';

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
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [settlementActivities, setSettlementActivities] = useState<
    SettlementActivity[]
  >([]);
  const [showDeleteActivityDialog, setShowDeleteActivityDialog] =
    useState(false);
  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
  const [expandedExpenses, setExpandedExpenses] = useState<
    Record<string | number, boolean>
  >({});
  const [isSettlementDialogOpen, setIsSettlementDialogOpen] = useState(false);
  const [settlementPayee, setSettlementPayee] = useState<TripUsers>();
  const [settlementPayer, setSettlementPayer] = useState<TripUsers>();
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
        fetchSettlements(trip.tripUsers, tripId || '');
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
      )) as {
        data: {
          totalBudget: number;
          expenses: Expense[];
          settlements: SettlementActivity[];
        };
      };

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

        const settlements = data.settlements.map((settlement) => {
          const payerDetail = tripUsers.find(
            (user) => user.userId === settlement.payer
          );

          const payeeDetail = tripUsers.find(
            (user) => user.userId === settlement.payee
          );

          return { ...settlement, payerDetail, payeeDetail };
        });

        setSettlementActivities(settlements);
        setBudget(totalBudget);
        setExpenses(expenses);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching budget:', error);
      setIsLoading(false);
    }
  };

  const fetchSettlements = async (tripUsers: TripUsers[], tripId: string) => {
    try {
      const { data } = (await apiRequest<
        { userId: string; tripId: string },
        unknown
      >(API_PATH.GET_SETTLEMENTS, {
        method: 'POST',
        body: {
          userId: keycloak.subject!,
          tripId: tripId!,
        },
      })) as { data: Settlement[] };

      const settlementList = data.map((settlement) => {
        const userDetails = tripUsers.find(
          (user) => user.userId === settlement.userId
        );
        return {
          ...settlement,
          userDetails,
        };
      });

      setSettlements(settlementList);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching settlements:', error);
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

      if (trip?.tripUsers) {
        fetchBudget(trip?.tripUsers);
        fetchSettlements(trip.tripUsers, tripId || '');
      }
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

      if (trip?.tripUsers) {
        fetchBudget(trip?.tripUsers);
        fetchSettlements(trip.tripUsers, tripId || '');
      }
      toast.success('A expense has been deleted.');
      setIsLoading(false);
    } catch (error) {
      console.error('Error while deleting expense:', error);
      setIsLoading(false);
    }
    setDeleteExpenseId(null);
  };

  const deleteActivity = async () => {
    try {
      await apiRequest<void, void>(
        `${API_PATH.DELETE_ACTIVITY}/${deleteActivityId}`,
        {
          method: 'DELETE',
        }
      );

      if (trip?.tripUsers) {
        fetchBudget(trip?.tripUsers);
        fetchSettlements(trip.tripUsers, tripId || '');
      }
      toast.success('A expense has been deleted.');
      setIsLoading(false);
    } catch (error) {
      console.error('Error while deleting settlement activity:', error);
      setIsLoading(false);
    }
    setDeleteActivityId(null);
  };

  const handleShowDeleteDialog = () => {
    setShowDeleteDialog(!showDeleteDialog);
  };

  const handleShowDeleteActivityDialog = () => {
    setShowDeleteActivityDialog(!showDeleteActivityDialog);
  };

  const toggleExpense = (expenseId: string) => {
    setExpandedExpenses((prev) => ({
      ...prev,
      [expenseId]: !prev[expenseId],
    }));
  };

  const handleSettlementButtonClick = (settlement: Settlement) => {
    const currentUser = trip?.tripUsers.find(
      (user) => user.userId === keycloak.subject
    );
    if (settlement.settlementAmount < 0 && currentUser) {
      setSettlementPayee(settlement.userDetails);
      setSettlementPayer(currentUser);
    } else {
      setSettlementPayee(currentUser);
      setSettlementPayer(settlement.userDetails);
    }
    setIsSettlementDialogOpen(true);
  };

  const handleSettlement = async (
    payee: TripUsers,
    payer: TripUsers,
    amount: number
  ) => {
    try {
      const settlement: NewSettlement = {
        tripId: tripId!,
        payee: payee.userId,
        payer: payer.userId,
        amount,
      };
      await apiRequest<NewSettlement, void>(API_PATH.NEW_SETTLEMENT, {
        method: 'POST',
        body: settlement,
      });

      if (trip?.tripUsers) {
        fetchBudget(trip?.tripUsers);
        fetchSettlements(trip.tripUsers, tripId || '');
      }
      setIsSettlementDialogOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while setting budget:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CustomSkeleton />;
  }

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
            <CardTitle className="text-xl">Settlements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <>
            <div className="space-y-3">
              {settlements.map((settlement) => (
                <div
                  key={settlement.userId}
                  className="flex items-center justify-between border rounded-lg hover:bg-gray-50 transition-colors p-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-10 h-10 ${
                        settlement.userDetails?.color || 'bg-gray-700'
                      } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {settlement.userDetails?.firstName[0]}
                      {settlement.userDetails?.lastName[0]}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {settlement.userDetails?.firstName}{' '}
                        {settlement.userDetails?.lastName}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={
                            settlement.settlementAmount < 0
                              ? 'destructive'
                              : 'default'
                          }
                          className="text-xs">
                          {settlement.settlementAmount < 0 ? 'Owes' : 'Owed'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-lg font-semibold ${
                        settlement.settlementAmount < 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}>
                      ${Math.abs(settlement.settlementAmount).toFixed(2)}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => handleSettlementButtonClick(settlement)}>
                      <DollarSign className="w-4 h-4 mr-1" />
                      Settle Up
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {settlements.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">All settled up!</p>
                    <p className="text-sm">
                      No outstanding balances to settle.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
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
                  className="border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
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
                          -${Math.abs(expense.amount).toFixed(2)}
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
                        <Button
                          onClick={() => toggleExpense(expense.expenseId)}
                          variant="ghost"
                          size="sm">
                          {expandedExpenses[expense.expenseId] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {expandedExpenses[expense.expenseId] && (
                    <div className="px-4 pb-4 border-t bg-gray-50">
                      <div className="pt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Split Details:
                        </h4>
                        {expense.splitDetails.map(
                          ({ userDetails, amount, userId }, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center align-baseline p-3 bg-white border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div
                                  className={`w-10 h-10 ${
                                    userDetails?.color || 'bg-gray-700'
                                  } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                                  {userDetails?.firstName[0]}
                                  {userDetails?.lastName[0]}
                                </div>
                                <div className="flex-1 min-w-0 ml-3">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {userDetails?.firstName}{' '}
                                    {userDetails?.lastName}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {expense.paidBy === userId && (
                                  <Badge className="bg-green-600">
                                    Paid By {userDetails?.firstName}
                                  </Badge>
                                )}
                                <span className="font-semibold text-red-600">
                                  -${Math.abs(amount).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settlement Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Settlement Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settlementActivities.length === 0 ? (
              <div className="flex items-center justify-center flex-col">
                <h4 className="text-2xl p-8">No settlement activity yet.</h4>
              </div>
            ) : (
              settlementActivities.map((settlement) => (
                <div
                  key={settlement.settlementId}
                  className="border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 ${
                          settlement.payeeDetail?.color || 'bg-gray-700'
                        } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {settlement.payeeDetail?.firstName[0]}
                        {settlement.payeeDetail?.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0 ml-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {settlement.payeeDetail?.firstName}{' '}
                          {settlement.payeeDetail?.lastName}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 ${
                          settlement.payerDetail?.color || 'bg-gray-700'
                        } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {settlement.payerDetail?.firstName[0]}
                        {settlement.payerDetail?.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0 ml-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {settlement.payerDetail?.firstName}{' '}
                          {settlement.payerDetail?.lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex font-semibold gap-3 items-center">
                    <span>${settlement.amount}</span>
                    <Button
                      variant="ghost"
                      size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteActivityId(settlement.settlementId);
                        setShowDeleteActivityDialog(true);
                      }}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
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

      <DeleteActivityConfirmationDialog
        showDeleteDialog={showDeleteActivityDialog}
        setShowDeleteDialog={handleShowDeleteActivityDialog}
        deleteActivity={deleteActivity}
      />

      <AddExpense
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={handleAddExpense}
        tripUsers={trip?.tripUsers || []}
      />

      <SettlementDialog
        open={isSettlementDialogOpen}
        close={() => setIsSettlementDialogOpen(false)}
        payee={settlementPayee!}
        payer={settlementPayer!}
        handleSettlement={handleSettlement}
      />
    </div>
  );
};

export default ManageExpenses;
