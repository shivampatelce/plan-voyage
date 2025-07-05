import type React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

const DeleteActivityConfirmationDialog: React.FC<{
  showDeleteDialog: boolean;
  setShowDeleteDialog: () => void;
  deleteActivity: () => void;
}> = ({ showDeleteDialog, setShowDeleteDialog, deleteActivity }) => {
  return (
    <AlertDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Settlement</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this settlement?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            onClick={deleteActivity}>
            Delete Settlement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteActivityConfirmationDialog;
