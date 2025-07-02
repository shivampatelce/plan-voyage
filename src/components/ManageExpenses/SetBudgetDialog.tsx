import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@radix-ui/react-dropdown-menu';
import type React from 'react';
import { Input } from '@/components/ui/input';

const SetBudgetDialog: React.FC<{
  editingBudget: boolean;
  newBudget: string;
  setNewBudget: (budget: string) => void;
  handleBudgetCancel: () => void;
  handleBudgetSave: () => void;
  setEditingBudget: (editingBudget: boolean) => void;
}> = ({
  editingBudget,
  newBudget,
  setNewBudget,
  handleBudgetCancel,
  handleBudgetSave,
  setEditingBudget,
}) => {
  return (
    <AlertDialog
      open={editingBudget}
      onOpenChange={() => setEditingBudget(!editingBudget)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Budget</AlertDialogTitle>
          <AlertDialogDescription>
            Update your trip budget amount. This will recalculate your expense
            progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label className="text-sm font-medium">Budget Amount</Label>
          <Input
            id="budget-input"
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            placeholder="Enter budget amount"
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleBudgetCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleBudgetSave}>
            Save Budget
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SetBudgetDialog;
