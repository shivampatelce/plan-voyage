import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { X, Mail, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/util/apiRequest';
import { useParams } from 'react-router';
import { API_PATH } from '@/consts/ApiPath';
import keycloak from '@/keycloak-config';

interface InviteState {
  emails: string[];
  inputValue: string;
  errors: string[];
  isSubmitting: boolean;
  submitSuccess: boolean;
}

interface InviteUserRequest {
  emails: string[];
  tripId: string;
  sentAt: Date;
  inviterId: string;
}

const InvitationForm = ({ handleEmailAdd }: { handleEmailAdd: () => void }) => {
  const [state, setState] = useState<InviteState>({
    emails: [],
    inputValue: '',
    errors: [],
    isSubmitting: false,
    submitSuccess: false,
  });

  const { tripId } = useParams<{ tripId: string }>();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      inputValue: e.target.value,
      errors: [],
      submitSuccess: false,
    }));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmails();
    } else if (
      e.key === 'Backspace' &&
      state.inputValue === '' &&
      state.emails.length > 0
    ) {
      removeEmail(state.emails.length - 1);
    }
  };

  const addEmails = () => {
    if (!state.inputValue.trim()) return;

    const newEmails = state.inputValue
      .split(/[,\s]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const validEmails: string[] = [];
    const newErrors: string[] = [];

    newEmails.forEach((email) => {
      if (!validateEmail(email)) {
        newErrors.push(`Invalid email format: ${email}`);
      } else if (state.emails.includes(email)) {
        newErrors.push(`Email already added: ${email}`);
      } else {
        validEmails.push(email);
      }
    });

    setState((prev) => ({
      ...prev,
      emails: [...prev.emails, ...validEmails],
      inputValue: '',
      errors: newErrors,
    }));
  };

  const removeEmail = (index: number) => {
    setState((prev) => ({
      ...prev,
      emails: prev.emails.filter((_, i) => i !== index),
      errors: [],
    }));
  };

  const handleSubmit = async () => {
    if (state.inputValue.trim()) {
      addEmails();
      return;
    }

    if (state.emails.length === 0) {
      setState((prev) => ({
        ...prev,
        errors: ['Please add at least one email address'],
      }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, errors: [] }));

    try {
      const inviteUserReq: InviteUserRequest = {
        emails: state.emails,
        tripId: tripId!,
        sentAt: new Date(),
        inviterId: keycloak.subject!,
      };
      await apiRequest<InviteUserRequest, unknown>(API_PATH.INVITE_USER, {
        method: 'POST',
        body: inviteUserReq,
      });

      resetForm();
      handleEmailAdd();
    } catch (error) {
      console.error('Error creating trips:', error);
      resetForm();
      handleEmailAdd();
    }
  };

  const resetForm = () => {
    setState({
      emails: [],
      inputValue: '',
      errors: [],
      isSubmitting: false,
      submitSuccess: false,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900">Invite Users</h2>
        <p className="text-gray-600">
          Send invitations to multiple users by entering their email addresses
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="email-input"
            className="text-sm font-medium text-gray-700">
            Email Addresses
          </Label>

          <div className="relative">
            <div className="min-h-[42px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="flex flex-wrap gap-2 items-center">
                {state.emails.map((email, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1">
                    <Mail className="w-3 h-3" />
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  id="email-input"
                  type="text"
                  value={state.inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onBlur={addEmails}
                  placeholder={
                    state.emails.length === 0
                      ? 'Enter email addresses (separated by commas or spaces)'
                      : 'Add more emails...'
                  }
                  className="flex-1 min-w-[200px] border-none outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Press Enter, comma, or space to add emails. You can also paste
            multiple emails at once.
          </p>
        </div>

        {state.emails.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 font-medium">
              {state.emails.length} email
              {state.emails.length !== 1 ? 's' : ''} ready to invite
            </p>
          </div>
        )}

        {state.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {state.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {state.submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Invitations sent successfully! Users will receive an email with
              instructions to join.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSubmit}
          disabled={state.isSubmitting}
          className="w-full h-11 text-base font-medium">
          {state.isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Sending Invitations...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite{' '}
              {state.emails.length > 0
                ? `${state.emails.length} User${
                    state.emails.length !== 1 ? 's' : ''
                  }`
                : 'Users'}
            </>
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Invited users receive an email with an account creation link to join
          your trip. Once they join, they can help plan the trip and see
          everything you see.
        </p>
      </div>
    </div>
  );
};

export default InvitationForm;
