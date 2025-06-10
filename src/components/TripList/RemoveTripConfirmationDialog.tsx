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

const RemoveTripConfirmationDialog = ({
  title,
  showDeleteDialog,
  setShowDeleteDialog,
  deleteTrip,
}: {
  title: string;
  showDeleteDialog: boolean;
  setShowDeleteDialog: () => void;
  deleteTrip: () => void;
}) => {
  return (
    <AlertDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Trip</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "Trip To {title}"? This action
            cannot be undone and will permanently remove all trip data including
            itinerary, chat, and notes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            onClick={deleteTrip}>
            Delete Trip
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveTripConfirmationDialog;
