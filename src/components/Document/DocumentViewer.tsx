import React, { useState, useEffect } from 'react';
import {
  File,
  Image,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { apiBlobRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import type { FileDetails } from '@/types/Document';

interface DocumentViewerProps {
  document: FileDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && document) {
      loadDocument();
    }
    return () => {
      if (documentUrl) {
        URL.revokeObjectURL(documentUrl);
        setDocumentUrl(null);
      }
    };
  }, [isOpen, document]);

  const loadDocument = async () => {
    if (!document) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiBlobRequest(
        `${API_PATH.DOWNLOAD_DOCUMENT}/${document.documentId}`
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDocumentUrl(url);
    } catch (err) {
      console.error('Error loading document:', err);
      setError('Failed to load document. Please try again.');
      toast.error('Error loading document');
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleClose = () => {
    if (documentUrl) {
      URL.revokeObjectURL(documentUrl);
      setDocumentUrl(null);
    }
    setZoom(1);
    setRotation(0);
    setError(null);
    onClose();
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return <File className="w-5 h-5" />;
    } else if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen || !document) return null;

  const isImage = document.fileType.startsWith('image/');
  const isPDF = document.fileType === 'application/pdf';

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm shadow-2xl shadow-gray-600 flex items-center justify-center border-2 z-50">
      <div className="bg-white rounded-lg border-2 w-11/12 h-5/6 max-w-8xl max-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            {getFileIcon(document.fileType)}
            <div>
              <h3 className="font-semibold text-gray-900 truncate max-w-md">
                {document.fileName}
              </h3>
              <p className="text-sm text-gray-500">
                {document.fileType} • {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {isImage && (
              <>
                <Button
                  onClick={handleZoomOut}
                  className="p-2"
                  disabled={zoom <= 0.25}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  onClick={handleZoomIn}
                  className="p-2"
                  disabled={zoom >= 3}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleRotate}
                  className="p-2">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleReset}
                  className="p-2">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button
              onClick={handleClose}
              className="p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading document...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-red-600 mb-2">{error}</p>
                <Button
                  onClick={loadDocument}
                  className="mt-2">
                  Try Again
                </Button>
              </div>
            </div>
          ) : documentUrl ? (
            <div className="flex items-center justify-center min-h-full px-4">
              {isPDF ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full min-h-100 border-0 rounded"
                  title={document.fileName}
                />
              ) : (
                isImage && (
                  <img
                    src={documentUrl}
                    alt={document.fileName}
                    className="max-w-none transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                    }}
                  />
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
