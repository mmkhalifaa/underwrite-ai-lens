
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ExternalLink, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Expand,
  FileText,
  CheckCircle
} from 'lucide-react';

interface DocumentViewerProps {
  stepId: string;
  isOpen: boolean;
  onClose: () => void;
}

const documentMockData = {
  'pfs-analysis': {
    documentName: 'Personal_Financial_Statement.pdf',
    uploadDate: 'March 15, 2025',
    source: 'SOR System',
    totalPages: 4,
    currentPage: 2,
    highlightedSection: {
      text: 'Total Net Worth: $1,247,000\nLiquid Assets: $850,000\nMonthly Income: $18,500',
      location: 'Page 2, Section C - Asset Summary',
      confidence: 98
    },
    extractedData: [
      { label: 'Net Worth', value: '$1,247,000', line: 'Line 15' },
      { label: 'Liquid Assets', value: '$850,000', line: 'Line 18' },
      { label: 'Monthly Income', value: '$18,500', line: 'Line 22' }
    ]
  },
  'credit-analysis': {
    documentName: 'Credit_Report_Experian.pdf',
    uploadDate: 'March 15, 2025',
    source: 'SOR System',
    totalPages: 12,
    currentPage: 1,
    highlightedSection: {
      text: 'FICO Score: 726\nPayment History: 100% On-Time\nTotal Monthly Obligations: $3,200',
      location: 'Page 1, Credit Summary',
      confidence: 95
    },
    extractedData: [
      { label: 'FICO Score', value: '726', line: 'Summary Box' },
      { label: 'Payment History', value: '100% On-Time', line: 'Line 12' },
      { label: 'Monthly Obligations', value: '$3,200', line: 'Line 28' }
    ]
  },
  'mortgage-calc': {
    documentName: 'Income_Verification.pdf',
    uploadDate: 'March 15, 2025',
    source: 'SOR System',
    totalPages: 3,
    currentPage: 1,
    highlightedSection: {
      text: 'Gross Monthly Income: $18,500\nExisting Debt Payments: $3,200\nProposed Mortgage Payment: $2,075',
      location: 'Page 1, Income Summary',
      confidence: 92
    },
    extractedData: [
      { label: 'Gross Income', value: '$18,500', line: 'Line 8' },
      { label: 'Existing Debt', value: '$3,200', line: 'Line 15' },
      { label: 'DTI Calculation', value: '28.5%', line: 'Calculated' }
    ]
  },
  'policy-check': {
    documentName: 'Underwriting_Guidelines_v2.pdf',
    uploadDate: 'March 10, 2025',
    source: 'Policy Library',
    totalPages: 45,
    currentPage: 12,
    highlightedSection: {
      text: 'Policy #12A: Minimum FICO Score: 620\nMaximum DTI Ratio: 30%\nMinimum Down Payment: 20%',
      location: 'Page 12, Section 4.2',
      confidence: 100
    },
    extractedData: [
      { label: 'Min FICO Required', value: '620', line: 'Line 4' },
      { label: 'Max DTI Allowed', value: '30%', line: 'Line 7' },
      { label: 'Policy Match', value: 'Compliant', line: 'Calculated' }
    ]
  }
};

const DocumentViewer = ({ stepId, isOpen, onClose }: DocumentViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isVerified, setIsVerified] = useState(false);
  const [comment, setComment] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const docData = documentMockData[stepId as keyof typeof documentMockData];
  if (!docData) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  return (
    <div className={`fixed inset-y-0 right-0 z-50 bg-white border-l shadow-xl transition-all duration-300 ${
      isFullscreen ? 'inset-x-0' : 'w-1/2 min-w-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">{docData.documentName}</h3>
            <p className="text-sm text-gray-500">
              Uploaded {docData.uploadDate} • {docData.source}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Expand className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Document Display */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">{zoomLevel}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Page {docData.currentPage} of {docData.totalPages}</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open Full
              </Button>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 p-4 bg-gray-100 overflow-auto">
            <div 
              className="bg-white shadow-lg mx-auto"
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                width: '8.5in',
                minHeight: '11in',
                padding: '1in'
              }}
            >
              {/* Mock Document Content */}
              <div className="space-y-4">
                <div className="text-center">
                  <h1 className="text-xl font-bold">{docData.documentName.replace('.pdf', '').replace(/_/g, ' ')}</h1>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">Borrower Information:</p>
                  <p className="text-sm">John Smith</p>
                  <p className="text-sm">123 Main Street, Anytown, ST 12345</p>
                </div>

                {/* Highlighted Section */}
                <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded relative">
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-blue-600">AI Extracted</Badge>
                  </div>
                  <div className="font-medium text-gray-900 whitespace-pre-line">
                    {docData.highlightedSection.text}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {docData.highlightedSection.location} • {docData.highlightedSection.confidence}% confidence
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm">Additional financial information...</p>
                  <p className="text-sm">Property details...</p>
                  <p className="text-sm">Employment verification...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l bg-gray-50 overflow-auto">
          <div className="p-4 space-y-4">
            {/* Verification Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Reviewer Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="verify"
                    checked={isVerified}
                    onCheckedChange={setIsVerified}
                  />
                  <label htmlFor="verify" className="text-sm font-medium">
                    Verify Extraction
                  </label>
                  {isVerified && <CheckCircle className="w-4 h-4 text-green-600" />}
                </div>
                <Button className="w-full" size="sm" variant="outline">
                  Override Decision
                </Button>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Extracted Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {docData.extractedData.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-medium text-gray-500">{item.label}</div>
                        <div className="text-sm font-semibold">{item.value}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">{item.line}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Add Comment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Note any discrepancies or additional context..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="text-sm"
                  rows={3}
                />
                <Button size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
              </CardContent>
            </Card>

            {/* Document Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages:</span>
                  <span>{docData.totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upload Date:</span>
                  <span>{docData.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source:</span>
                  <span>{docData.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <Badge variant="secondary">{docData.highlightedSection.confidence}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
