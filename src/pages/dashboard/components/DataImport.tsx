import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, FileSpreadsheet, File } from 'lucide-react';
import axios from '../../../lib/axios';

const DataImport = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: getFileType(file.name)
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv']
    }
  });

  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'spreadsheet';
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'document';
      default:
        return 'unknown';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'document':
        return <File className="h-6 w-6 text-blue-600" />;
      default:
        return <File className="h-6 w-6 text-gray-600" />;
    }
  };

  // --- Backend file upload logic ---
  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      for (const fileData of files) {
        const file = fileData.file;
        const formData = new FormData();
        formData.append('file', file);

        // Backend endpoint: /documents (change if your API is different)
        const response = await axios.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        toast({
          title: "File uploaded",
          description: `File "${file.name}" uploaded successfully (ID: ${response.data.id || 'N/A'})`
        });
      }

      setFiles([]);
      toast({
        title: "Import successful",
        description: `Successfully uploaded ${files.length} file(s) to backend.`
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: "Could not upload files. Please check file formats and try again.",
        variant: "destructive"
      });
    }
    setIsProcessing(false);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Data Import & File Processing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-blue-500 text-lg font-medium">Drop the files here ...</p>
          ) : (
            <div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                Drag & drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500">
                Supports Excel (.xls, .xlsx), CSV, PDF, Word documents (.doc, .docx)
              </p>
            </div>
          )}
        </div>
        
        {files.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-4">Selected Files ({files.length}):</h4>
            <div className="space-y-2">
              {files.map((fileData, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fileData.type)}
                    <div>
                      <p className="font-medium">{fileData.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isProcessing}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleUpload} 
              className="mt-4 w-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Uploading..." : "Import & Upload to Backend"}
            </Button>
          </div>
        )}
        
        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Supported Data Types:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Excel/CSV:</strong> Cost breakdowns, vendor quotes, historical data</li>
            <li>• <strong>PDF:</strong> Contracts, estimates, geological reports</li>
            <li>• <strong>Word:</strong> Project specifications, cost summaries</li>
            <li>• <strong>Auto-processing:</strong> AI extracts relevant cost data automatically</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImport;
