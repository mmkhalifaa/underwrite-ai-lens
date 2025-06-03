
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

export interface CategorizedDocument {
  file: File;
  category: 'pfs' | 'credit' | 'asset';
  id: string;
}

interface SmartDocumentUploadProps {
  onDocumentsChange: (documents: CategorizedDocument[]) => void;
  documents: CategorizedDocument[];
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  category: 'pfs' | 'credit' | 'asset';
}

const documentCategories = {
  pfs: {
    label: 'Personal Financial Statement',
    description: 'Income statements, tax returns, financial statements',
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-400'
  },
  credit: {
    label: 'Credit Report',
    description: 'Credit reports, credit scores, credit history',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-400'
  },
  asset: {
    label: 'Asset Statement',
    description: 'Bank statements, investment accounts, asset documentation',
    color: 'bg-purple-100 text-purple-800',
    borderColor: 'border-purple-400'
  }
};

const SmartDocumentUpload = ({ onDocumentsChange, documents }: SmartDocumentUploadProps) => {
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const simulateUpload = (uploadingFile: UploadingFile): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
          
          const newDoc: CategorizedDocument = {
            file: uploadingFile.file,
            category: uploadingFile.category,
            id: uploadingFile.id
          };
          
          onDocumentsChange([...documents, newDoc]);
          resolve();
        } else {
          setUploadingFiles(prev => 
            prev.map(f => f.id === uploadingFile.id ? { ...f, progress } : f)
          );
        }
      }, 200 + Math.random() * 300);
    });
  };

  const addDocuments = useCallback(async (files: FileList | File[], category: 'pfs' | 'credit' | 'asset') => {
    const newUploadingFiles: UploadingFile[] = [];
    
    Array.from(files).forEach(file => {
      const uploadingFile: UploadingFile = {
        file,
        category,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        progress: 0
      };
      newUploadingFiles.push(uploadingFile);
    });
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    
    newUploadingFiles.forEach(uploadingFile => {
      simulateUpload(uploadingFile);
    });
  }, [documents, onDocumentsChange]);

  const handleDragOver = useCallback((e: React.DragEvent, category: string) => {
    e.preventDefault();
    setDragOverZone(category);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, category: 'pfs' | 'credit' | 'asset') => {
    e.preventDefault();
    setDragOverZone(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addDocuments(files, category);
    }
  }, [addDocuments]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, category: 'pfs' | 'credit' | 'asset') => {
    if (e.target.files && e.target.files.length > 0) {
      addDocuments(e.target.files, category);
    }
  }, [addDocuments]);

  const removeDocument = useCallback((id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  }, [documents, onDocumentsChange]);

  const groupedDocuments = {
    pfs: documents.filter(doc => doc.category === 'pfs'),
    credit: documents.filter(doc => doc.category === 'credit'),
    asset: documents.filter(doc => doc.category === 'asset')
  };

  const categoryUploadingFiles = {
    pfs: uploadingFiles.filter(f => f.category === 'pfs'),
    credit: uploadingFiles.filter(f => f.category === 'credit'),
    asset: uploadingFiles.filter(f => f.category === 'asset')
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(documentCategories).map(([categoryKey, categoryInfo]) => {
          const categoryDocs = groupedDocuments[categoryKey as keyof typeof groupedDocuments];
          const categoryUploading = categoryUploadingFiles[categoryKey as keyof typeof categoryUploadingFiles];
          const isDragOver = dragOverZone === categoryKey;
          
          return (
            <Card key={categoryKey} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{categoryInfo.label}</span>
                  <Badge variant="secondary">{categoryDocs.length}</Badge>
                </CardTitle>
                <p className="text-sm text-gray-500">{categoryInfo.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver 
                      ? `${categoryInfo.borderColor} bg-opacity-10 ${categoryInfo.color.split(' ')[0]}-50` 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={(e) => handleDragOver(e, categoryKey)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, categoryKey as 'pfs' | 'credit' | 'asset')}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Drop {categoryInfo.label.toLowerCase()} here
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileInput(e, categoryKey as 'pfs' | 'credit' | 'asset')}
                    className="text-xs"
                  />
                </div>

                {/* Upload Progress */}
                {categoryUploading.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700">Uploading:</div>
                    {categoryUploading.map(uploadingFile => (
                      <div key={uploadingFile.id} className={`${categoryInfo.color} rounded-lg p-3 border`}>
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                              {uploadingFile.file.name}
                            </div>
                            <div className="text-xs opacity-75">
                              {(uploadingFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <div className="text-xs font-medium">
                            {Math.round(uploadingFile.progress)}%
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="bg-white bg-opacity-50 rounded-full h-1">
                            <div 
                              className="bg-current h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadingFile.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Documents */}
                {categoryDocs.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700">Uploaded:</div>
                    {categoryDocs.map(doc => (
                      <div key={doc.id} className="bg-gray-50 rounded p-3 group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <FileText className="w-3 h-3 text-gray-500 flex-shrink-0" />
                              <span className="text-xs font-medium truncate">
                                {doc.file.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 text-center py-4">
                    No {categoryInfo.label.toLowerCase()} uploaded yet
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SmartDocumentUpload;
