import { useEffect, useState } from 'react';
import InvitationForm from './InvitationForm';
import PendingInvite from './PendingInvite';
import { useParams } from 'react-router';
import { API_PATH } from '@/consts/ApiPath';
import { apiRequest } from '@/util/apiRequest';

export interface PendingInvite {
  invitationId: string;
  email: string;
  inviteLink: string;
  sentAt: string;
}

const Invite: React.FC = () => {
  const [invites, setInvites] = useState<PendingInvite[]>([]);

  const { tripId } = useParams<{ tripId: string }>();

  useEffect(() => {
    if (tripId) fetchInvitations(tripId);
  }, [tripId]);

  const fetchInvitations = async (tripId: string) => {
    try {
      const { data } = (await apiRequest<unknown, { data: PendingInvite[] }>(
        `${API_PATH.PENDING_INVITATION_LIST}/${tripId}`,
        {
          method: 'POST',
        }
      )) as { data: PendingInvite[] };

      setInvites(data);
    } catch (error) {
      console.error('Error fetching pending invitation list:', error);
    }
  };

  const handleDelete = async (id: string) => {
    await apiRequest<unknown, unknown>(API_PATH.DELETE_INVITATION + '/' + id, {
      method: 'DELETE',
    })
      .then(() => {
        if (tripId) fetchInvitations(tripId);
      })
      .catch((error) => {
        console.error('Error fetching pending invitation list:', error);
      });
  };

  return (
    <>
      <InvitationForm handleEmailAdd={() => fetchInvitations(tripId!)} />
      <PendingInvite
        onDeleteInvitation={(id) => handleDelete(id)}
        invites={invites}
      />
    </>
  );
};

export default Invite;
