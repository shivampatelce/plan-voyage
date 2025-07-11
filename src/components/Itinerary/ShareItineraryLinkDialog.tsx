import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
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

interface ShareItineraryLinkDialogProps {
  itineraryTitle: string;
  tripId: string;
  isOpen: boolean;
  setIsOpen: () => void;
}

const ShareItineraryLinkDialog: React.FC<ShareItineraryLinkDialogProps> = ({
  tripId,
  itineraryTitle,
  isOpen,
  setIsOpen,
}) => {
  const [copied, setCopied] = useState(false);

  const shareLink = `${
    import.meta.env.VITE_APP_BASE_URL
  }shared-itinerary/${tripId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Itinerary
          </DialogTitle>
          <DialogDescription>
            Share "{itineraryTitle}" itinerary with others using this link.
            Anyone with the link can view your itinerary.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-link">Shareable Link</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="px-3">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="sr-only">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </>
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 font-medium">
                Link copied to clipboard!
              </p>
            )}
          </div>

          <p className="mt-2 text-gray-600 text-sm">
            This link allows view-only access to your itinerary. Recipients
            cannot edit or delete your travel plans.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareItineraryLinkDialog;
