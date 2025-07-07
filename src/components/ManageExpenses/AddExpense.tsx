import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Split } from 'lucide-react';
import { format } from 'date-fns';
import type { TripUsers } from '@/types/Trip';
import type { Expense, ExpenseData } from '@/types/Expense';

interface AddExpenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseData) => void;
  tripUsers: TripUsers[];
  isEdit: boolean;
  editExpense: Expense | null;
}

const AddExpense: React.FC<AddExpenseProps> = ({
  isOpen,
  onClose,
  onSave,
  tripUsers,
  isEdit,
  editExpense,
}) => {
  const [formData, setFormData] = useState<ExpenseData>({
    title: '',
    amount: 0,
    paidBy: '',
    splitType: 'equal',
    splitDetails: [],
    date: new Date(),
    category: '',
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: string }>(
    {}
  );
  const [percentages, setPercentages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && editExpense) {
      const amount = editExpense.splitDetails[0].amount;
      let splitType: 'equal' | 'custom' | 'percentage' = 'equal';

      for (const detail of editExpense.splitDetails) {
        if (detail.amount !== amount) {
          splitType = 'custom';
          break;
        }
      }

      const customAmounts: { [key: string]: string } = {};
      if (splitType === 'custom') {
        editExpense.splitDetails.forEach((detail) => {
          customAmounts[detail.userId] = detail.amount.toString();
        });
      }

      setCustomAmounts(customAmounts);

      setFormData({
        title: editExpense.title,
        amount: editExpense.amount,
        paidBy: editExpense.paidBy,
        splitType,
        splitDetails: [],
        date: new Date(),
        category: editExpense.category,
      });

      setSelectedUsers(editExpense.splitDetails.map((detail) => detail.userId));
    }
  }, [isEdit, editExpense]);

  const categories = [
    'Food & Dining',
    'Transportation',
    'Accommodation',
    'Entertainment',
    'Shopping',
    'Activities',
    'Utilities',
    'Other',
  ];

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCustomAmountChange = (userId: string, amount: string) => {
    setCustomAmounts((prev) => ({
      ...prev,
      [userId]: amount,
    }));
  };

  const handlePercentageChange = (userId: string, percentage: string) => {
    setPercentages((prev) => ({
      ...prev,
      [userId]: percentage,
    }));
  };

  const calculateEqualSplit = () => {
    if (selectedUsers.length === 0) return 0;
    return formData.amount / selectedUsers.length;
  };

  const getTotalCustomAmount = () => {
    return Object.values(customAmounts).reduce(
      (sum, amount) => sum + (parseFloat(amount) || 0),
      0
    );
  };

  const getTotalPercentage = () => {
    return Object.values(percentages).reduce(
      (sum, percent) => sum + (parseFloat(percent) || 0),
      0
    );
  };

  const handleSave = () => {
    const splitDetails: {
      userId: string;
      amount: number;
      splitDetailId?: string;
    }[] = [];

    if (formData.splitType === 'equal') {
      const equalAmount = calculateEqualSplit();
      selectedUsers.forEach((userId) => {
        let splitDetailId: string | undefined = '';
        if (isEdit && editExpense) {
          splitDetailId = editExpense.splitDetails.find(
            (detail) => detail.userId === userId
          )?.splitDetailId;
        }

        if (splitDetailId) {
          splitDetails.push({ splitDetailId, userId, amount: equalAmount });
        } else {
          splitDetails.push({ userId, amount: equalAmount });
        }
      });
    } else if (formData.splitType === 'custom') {
      selectedUsers.forEach((userId) => {
        let splitDetailId: string | undefined = '';
        if (isEdit && editExpense) {
          splitDetailId = editExpense.splitDetails.find(
            (detail) => detail.userId === userId
          )?.splitDetailId;
        }

        if (splitDetailId) {
          splitDetails.push({
            splitDetailId,
            userId,
            amount: parseFloat(customAmounts[userId]) || 0,
          });
        } else {
          splitDetails.push({
            userId,
            amount: parseFloat(customAmounts[userId]) || 0,
          });
        }
      });
    } else if (formData.splitType === 'percentage') {
      selectedUsers.forEach((userId) => {
        const percentage = parseFloat(percentages[userId]) || 0;
        splitDetails.push({
          userId,
          amount: (formData.amount * percentage) / 100,
        });
      });
    }

    const expenseData: ExpenseData = {
      ...formData,
      splitDetails,
    };

    if (isEdit) {
      expenseData.expenseId = editExpense?.expenseId;
    }

    onSave(expenseData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      title: '',
      amount: 0,
      paidBy: '',
      splitType: 'equal',
      splitDetails: [],
      date: new Date(),
      category: '',
    });
    setSelectedUsers([]);
    setCustomAmounts({});
    setPercentages({});
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.amount > 0 &&
      formData.paidBy !== '' &&
      formData.category !== '' &&
      selectedUsers.length > 0 &&
      (formData.splitType === 'equal' ||
        (formData.splitType === 'custom' &&
          Math.abs(getTotalCustomAmount() - formData.amount) < 0.01) ||
        (formData.splitType === 'percentage' &&
          Math.abs(getTotalPercentage() - 100) < 0.01))
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Add New Expense
          </DialogTitle>
          <DialogDescription>
            Record a new expense and split it among trip members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Expense Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Dinner at restaurant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData((prev) => ({ ...prev, date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Paid By</Label>
            <Select
              value={formData.paidBy}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, paidBy: value }))
              }>
              <SelectTrigger>
                <SelectValue placeholder="Who paid for this expense?" />
              </SelectTrigger>
              <SelectContent>
                {tripUsers.map((user) => (
                  <SelectItem
                    key={user.userId}
                    value={user.userId}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Split Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Split className="w-5 h-5" />
                Split Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Select Members to Split With</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tripUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center space-x-2">
                      <Checkbox
                        id={user.userId}
                        checked={selectedUsers.includes(user.userId)}
                        onCheckedChange={() => handleUserToggle(user.userId)}
                      />
                      <Label
                        htmlFor={user.userId}
                        className="flex items-center gap-2 cursor-pointer">
                        <div
                          className={`w-6 h-6 ${
                            user.color || 'bg-gray-500'
                          } rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        {user.firstName} {user.lastName}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <>
                  <div className="space-y-3">
                    <Label>How to Split</Label>
                    <RadioGroup
                      value={formData.splitType}
                      onValueChange={(
                        value: 'equal' | 'custom' | 'percentage'
                      ) =>
                        setFormData((prev) => ({ ...prev, splitType: value }))
                      }>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="equal"
                          id="equal"
                        />
                        <Label htmlFor="equal">Split Equally</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="custom"
                          id="custom"
                        />
                        <Label htmlFor="custom">Custom Amounts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="percentage"
                          id="percentage"
                        />
                        <Label htmlFor="percentage">By Percentage</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Split Details */}
                  <div className="space-y-3">
                    {formData.splitType === 'equal' && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-700">
                          Each person pays:{' '}
                          <strong>${calculateEqualSplit().toFixed(2)}</strong>
                        </p>
                      </div>
                    )}

                    {formData.splitType === 'custom' && (
                      <div className="space-y-3">
                        <Label>Enter custom amounts for each person</Label>
                        {selectedUsers.map((userId) => {
                          const user = tripUsers.find(
                            (u) => u.userId === userId
                          );
                          return (
                            <div
                              key={userId}
                              className="flex items-center gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <div
                                  className={`w-6 h-6 ${
                                    user?.color || 'bg-gray-500'
                                  } rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                                  {user?.firstName[0]}
                                  {user?.lastName[0]}
                                </div>
                                <span className="text-sm">
                                  {user?.firstName} {user?.lastName}
                                </span>
                              </div>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={customAmounts[userId] || ''}
                                onChange={(e) =>
                                  handleCustomAmountChange(
                                    userId,
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                                className="w-24"
                              />
                            </div>
                          );
                        })}
                        <div
                          className={`p-3 rounded-lg ${
                            Math.abs(getTotalCustomAmount() - formData.amount) <
                            0.01
                              ? 'bg-green-50'
                              : 'bg-red-50'
                          }`}>
                          <p
                            className={`text-sm ${
                              Math.abs(
                                getTotalCustomAmount() - formData.amount
                              ) < 0.01
                                ? 'text-green-700'
                                : 'text-red-700'
                            }`}>
                            Total: ${getTotalCustomAmount().toFixed(2)} / $
                            {formData.amount.toFixed(2)}
                            {Math.abs(
                              getTotalCustomAmount() - formData.amount
                            ) >= 0.01 &&
                              ` (Difference: $${Math.abs(
                                getTotalCustomAmount() - formData.amount
                              ).toFixed(2)})`}
                          </p>
                        </div>
                      </div>
                    )}

                    {formData.splitType === 'percentage' && (
                      <div className="space-y-3">
                        <Label>Enter percentage for each person</Label>
                        {selectedUsers.map((userId) => {
                          const user = tripUsers.find(
                            (u) => u.userId === userId
                          );
                          const percentage =
                            parseFloat(percentages[userId]) || 0;
                          const amount = (formData.amount * percentage) / 100;
                          return (
                            <div
                              key={userId}
                              className="flex items-center gap-3">
                              <div className="flex items-center gap-2 flex-1">
                                <div
                                  className={`w-6 h-6 ${
                                    user?.color || 'bg-gray-500'
                                  } rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                                  {user?.firstName[0]}
                                  {user?.lastName[0]}
                                </div>
                                <span className="text-sm">
                                  {user?.firstName} {user?.lastName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                  value={percentages[userId] || ''}
                                  onChange={(e) =>
                                    handlePercentageChange(
                                      userId,
                                      e.target.value
                                    )
                                  }
                                  placeholder="0"
                                  className="w-16"
                                />
                                <span className="text-sm">%</span>
                                <span className="text-sm text-gray-500 w-16">
                                  (${amount.toFixed(2)})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        <div
                          className={`p-3 rounded-lg ${
                            Math.abs(getTotalPercentage() - 100) < 0.01
                              ? 'bg-green-50'
                              : 'bg-red-50'
                          }`}>
                          <p
                            className={`text-sm ${
                              Math.abs(getTotalPercentage() - 100) < 0.01
                                ? 'text-green-700'
                                : 'text-red-700'
                            }`}>
                            Total: {getTotalPercentage().toFixed(1)}% / 100%
                            {Math.abs(getTotalPercentage() - 100) >= 0.01 &&
                              ` (Difference: ${Math.abs(
                                getTotalPercentage() - 100
                              ).toFixed(1)}%)`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              handleReset();
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid()}>
            {!isEdit ? 'Add Expense' : 'Edit Expense'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpense;
