import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle, X, Move } from 'lucide-react';

export interface CategorizedDocument {
  file: File;
  category: 'pfs' | 'credit' | 'asset';
  id: string;
}

interface SmartDocumentUploadProps {
  onDocumentsChange: (documents: CategorizedDocument[]) => void;
  documents: CategorizedDocument[];
}

const documentCategories = {
  pfs: {
    label: 'Personal Financial Statement',
    description: 'Income statements, tax returns, financial statements',
    keywords: ['financial', 'statement', 'income', 'tax', 'return', 'pfs', 'w2', 'paystub'],
    color: 'bg-blue-100 text-blue-800'
  },
  credit: {
    label: 'Credit Report',
    description: 'Credit reports, credit scores, credit history',
    keywords: ['credit', 'report', 'score', 'experian', 'equifax', 'transunion', 'fico'],
    color: 'bg-green-100 text-green-800'
  },
  asset: {
    label: 'Asset Statement',
    description: 'Bank statements, investment accounts, asset documentation',
    keywords: ['bank', 'statement', 'asset', 'investment', 'account', 'portfolio', 'savings', 'checking'],
    color: 'bg-purple-100 text-purple-800'
  }
};

const SmartDocumentUpload = ({ onDocumentsChange, documents }: SmartDocumentUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const categorizeDocument = (fileName: string): 'pfs' | 'credit' | 'asset' => {
    const lowerFileName = fileName.toLowerCase();
    
    // Check for credit-related keywords first (most specific)
    if (documentCategories.credit.keywords.some(keyword => lowerFileName.includes(keyword))) {
      return 'credit';
    }
    
    // Check for asset-related keywords
    if (documentCategories.asset.keywords.some(keyword => lowerFileName.includes(keyword))) {
      return 'asset';
    }
    
    // Default to PFS for income/financial documents
    return 'pfs';
  };

  const addDocuments = useCallback((files: FileList | File[]) => {
    const newDocuments: CategorizedDocument[] = [];
    
    Array.from(files).forEach(file => {
      const category = categorizeDocument(file.name);
      const newDoc: CategorizedDocument = {
        file,
        category,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      newDocuments.push(newDoc);
    });
    
    onDocumentsChange([...documents, ...newDocuments]);
  }, [documents, onDocumentsChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addDocuments(files);
    }
  }, [addDocuments]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addDocuments(e.target.files);
    }
  }, [addDocuments]);

  const removeDocument = useCallback((id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  }, [documents, onDocumentsChange]);

  const changeCategory = useCallback((id: string, newCategory: 'pfs' | 'credit' | 'asset') => {
    onDocumentsChange(documents.map(doc => 
      doc.id === id ? { ...doc, category: newCategory } : doc
    ));
  }, [documents, onDocumentsChange]);

  const groupedDocuments = {
    pfs: documents.filter(doc => doc.category === 'pfs'),
    credit: documents.filter(doc => doc.category === 'credit'),
    asset: documents.filter(doc => doc.category === 'asset')
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Document Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-700 mb-2">
              Drop documents here or click to upload
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Documents will be automatically categorized based on content
            </div>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="max-w-xs mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categorized Documents */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(documentCategories).map(([categoryKey, categoryInfo]) => {
            const categoryDocs = groupedDocuments[categoryKey as keyof typeof groupedDocuments];
            
            return (
              <Card key={categoryKey} className="h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{categoryInfo.label}</span>
                    <Badge variant="secondary">{categoryDocs.length}</Badge>
                  </CardTitle>
                  <p className="text-xs text-gray-500">{categoryInfo.description}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryDocs.length === 0 ? (
                    <div className="text-xs text-gray-400 text-center py-4">
                      No documents yet
                    </div>
                  ) : (
                    categoryDocs.map(doc => (
                      <div key={doc.id} className="bg-gray-50 rounded p-3 group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm font-medium truncate">
                                {doc.file.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Select
                              value={doc.category}
                              onValueChange={(value) => changeCategory(doc.id, value as any)}
                            >
                              <SelectTrigger className="h-6 w-6 p-0 border-none">
                                <Move className="w-3 h-3" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pfs">PFS</SelectItem>
                                <SelectItem value="credit">Credit</SelectItem>
                                <SelectItem value="asset">Asset</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => removeDocument(doc.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartDocumentUpload;
