import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, ArrowRight } from 'lucide-react';
import type { TripUsers } from '@/types/Trip';
import keycloak from '@/keycloak-config';

const SettlementDialog: React.FC<{
  payer?: TripUsers;
  payee?: TripUsers;
  open: boolean;
  handleSettlement: (
    payee: TripUsers,
    payer: TripUsers,
    amount: number
  ) => void;
  close: () => void;
}> = ({ payer, payee, open, close, handleSettlement }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (error) setError('');
  };

  const handleSettle = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const settlementAmount = parseFloat(amount);
    if (payee && payer) handleSettlement(payee, payer, settlementAmount);
    setAmount('');
    setError('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            <div className="pb-4">
              {payer?.userId === keycloak.subject ? (
                <span>
                  You paid {payee?.firstName} {payer?.lastName}
                </span>
              ) : (
                <span>
                  {payer?.firstName} {payer?.lastName} paid You
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 ${
                    payer?.color || 'bg-gray-700'
                  } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {payer?.firstName[0]}
                  {payer?.lastName[0]}
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {payer?.firstName} {payer?.lastName}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 ${
                    payee?.color || 'bg-gray-700'
                  } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {payee?.firstName[0]}
                  {payee?.lastName[0]}
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {payee?.firstName} {payee?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </DialogTitle>

          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm font-medium">
              Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={`pl-10 text-lg ${error ? 'border-red-500' : ''}`}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={close}
              className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSettle}
              className="flex-1">
              Settle Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettlementDialog;
