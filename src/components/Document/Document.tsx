import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  File,
  Image,
  X,
  Calendar,
  Eye,
  Download,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import { useParams } from 'react-router';
import keycloak from '@/keycloak-config';
import DeleteDocumentConfirmationDialog from './DeleteDocumentConfirmationDialog';

interface FileDetails {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  uploaderFullName: string;
  uploaderId: string;
  documentId: string;
}

const Document: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [documents, setDocuments] = useState<FileDetails[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { tripId } = useParams<{ tripId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data } = (await apiRequest<void, { data: FileDetails[] }>(
        API_PATH.DOCUMENTS_LIST + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: FileDetails[] };

      setDocuments(data);
    } catch (error) {
      console.error('Error while fetching documents: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
    ];
    if (allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please upload a PDF or image file (JPEG, PNG, GIF, WebP)');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        await apiRequest<unknown, unknown>(
          API_PATH.UPLOAD_DOCUMENT + `/${tripId}/${keycloak.subject}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        fetchDocuments();
        toast.success('Document has been uploaded successfully.');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error('Error while uploading document, Please try again.');
        console.error('Error while uploading document: ', error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return <File className="w-5 h-5" />;
    } else if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (document: unknown) => {
    console.log('Downloading:', document);
  };

  const handleView = (document: unknown) => {
    console.log('Viewing:', document);
  };

  const handleDocumentDelete = async () => {
    try {
      await apiRequest<void, void>(
        API_PATH.DELETE_DOCUMENT + `/${deleteDocumentId}`,
        {
          method: 'DELETE',
        }
      );

      setShowDeleteDialog(false);
      setDeleteDocumentId(null);
      fetchDocuments();
      toast.success('Document has been deleted successfully.');
    } catch (error) {
      setShowDeleteDialog(false);
      setDeleteDocumentId(null);
      toast.error('Error while deleting document, Please try again.');
      console.error('Error while deleting document: ', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Document Upload
      </h2>

      <div className="space-y-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : selectedFile
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <File className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  File selected
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  {getFileIcon(selectedFile.type)}
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-gray-400">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
              </div>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleUpload}
                  className="px-6 py-2 font-medium flex items-center space-x-1">
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </Button>
                <Button
                  onClick={handleUploadClick}
                  className="px-4 py-2 text-sm font-medium">
                  Change File
                </Button>
                <Button
                  onClick={handleRemoveFile}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-1">
                  <X className="w-4 h-4" />
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <p className="text-lg font-medium text-gray-700">
                  Share important documents with your trip members, such as
                  flight tickets, hotel bookings, and more by uploading them
                  here.
                </p>
              </div>
              <Button
                onClick={handleUploadClick}
                className="px-6 py-3">
                Select File
              </Button>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, JPEG, PNG
              </p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-medium text-gray-900 mb-3">File Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{selectedFile.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <p className="font-medium">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium">{selectedFile.type}</p>
              </div>
              <div>
                <span className="text-gray-500">Last Modified:</span>
                <p className="font-medium">
                  {new Date(selectedFile.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Documents List Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Documents ({documents.length})
          </h3>
        </div>

        {loading && documents.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documents uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload your first document to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {documents.map((doc) => (
              <div
                key={doc.fileName}
                className="bg-gray-50 rounded-lg border p-4 hover:shadow-md transition-shadow m-2">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(doc.fileType)}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-medium text-gray-900 truncate"
                        title={doc.fileName}>
                        {doc.fileName}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(doc.uploadDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Size: {formatFileSize(doc.fileSize)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Type: {doc.fileType.split('/')[1].toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Uploader: {doc.uploaderFullName}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleView(doc)}
                    className="flex-1 px-3 py-2">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Button>
                  <Button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 px-3 py-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                  {doc.uploaderId === keycloak.subject && (
                    <Button
                      className="flex-1 px-3 py-2 bg-red-600"
                      onClick={() => {
                        setDeleteDocumentId(doc.documentId);
                        setShowDeleteDialog(true);
                      }}>
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteDocumentConfirmationDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={() => {
          setShowDeleteDialog(!showDeleteDialog);
          setDeleteDocumentId(null);
        }}
        deleteDocument={handleDocumentDelete}
      />
    </div>
  );
};

export default Document;
