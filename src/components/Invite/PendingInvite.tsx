import React, { useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { PendingInvite } from './Invite';
import { ROUTE_PATH } from '@/consts/RoutePath';

interface PendingInviteTableProps {
  invites: PendingInvite[];
  onDeleteInvitation: (id: string) => void;
}

const PendingInviteTable: React.FC<PendingInviteTableProps> = ({
  invites,
  onDeleteInvitation,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  const handleCopyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(
        `${API_BASE_URL}${ROUTE_PATH.INVITATIONS}`
      );
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (invites.length === 0) {
    return (
      <div className='w-full'>
        <div className='text-center space-y-8 mt-20'>
          <h2 className='text-4xl font-bold text-gray-900'>Pending Invites</h2>
        </div>
        <div className='text-center py-12 text-gray-500 rounded-xl shadow-sm border-dashed border-2 border-gray-300 mt-8 max-w-2xl mx-auto'>
          <p>No pending invites found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-8 mt-20 '>
      <div className='text-center space-y-2'>
        <h2 className='text-4xl font-bold text-gray-900'>Pending Invites</h2>
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Sent Date</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
              <TableRow key={invite.invitationId}>
                <TableCell className='font-medium'>{invite.email}</TableCell>
                <TableCell className='text-gray-600'>
                  {new Date(invite.sentAt).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleCopyLink(invite.invitationId)}
                      className='flex items-center gap-2'>
                      {copiedId === invite.invitationId ? (
                        <>
                          <Check className='h-4 w-4' />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className='h-4 w-4' />
                          Copy Link
                        </>
                      )}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Invite</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the invite for{' '}
                            <span className='font-medium'>{invite.email}</span>?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              onDeleteInvitation(invite.invitationId)
                            }
                            className='bg-red-600 hover:bg-red-700'>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='text-sm text-gray-500'>
        {invites.length} pending invite
        {invites.length !== 1 ? 's' : ''}
      </div>

      <div className='text-center'>
        <p className='text-xs text-gray-500'>
          An email has been sent to the users, but you can also share the link.
        </p>
      </div>
    </div>
  );
};

export default PendingInviteTable;
