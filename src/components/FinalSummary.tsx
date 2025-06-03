
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Download, FileText, ArrowLeft, Calculator } from 'lucide-react';
import { useState } from 'react';
import CheckerMode from './CheckerMode';
import { CategorizedDocument } from './SmartDocumentUpload';

interface FinalSummaryProps {
  data: {
    productType: string;
    incomeTypes: string[];
    documents: CategorizedDocument[];
  };
  onBack: () => void;
}

const FinalSummary = ({ data, onBack }: FinalSummaryProps) => {
  const [showCheckerMode, setShowCheckerMode] = useState(false);
  const [comments, setComments] = useState<{ [key: string]: string }>({
    dti: '',
    liquidity: '',
    leverage: '',
    monthlyIncome: '',
    liquidAssets: '',
    totalAssets: '',
    totalLiabilities: '',
    netWorth: ''
  });

  // Create compatible data structure for CheckerMode
  const checkerModeData = {
    productType: data.productType,
    riskLevel: data.incomeTypes.join(', '),
    documents: data.documents.map(doc => doc.file.name)
  };

  if (showCheckerMode) {
    return (
      <CheckerMode 
        data={checkerModeData} 
        onBack={() => setShowCheckerMode(false)} 
        onComplete={onBack}
      />
    );
  }

  const financialMetrics = [
    {
      id: 'dti',
      label: 'Debt-to-Income Ratio (DTI)',
      value: '28.5%',
      status: 'good',
      description: 'Total monthly debt payments divided by gross monthly income'
    },
    {
      id: 'liquidity',
      label: 'Liquidity Ratio',
      value: '6.2 months',
      status: 'good',
      description: 'Liquid assets available to cover monthly obligations'
    },
    {
      id: 'leverage',
      label: 'Leverage Ratio',
      value: '3.2:1',
      status: 'moderate',
      description: 'Total debt to net worth ratio'
    },
    {
      id: 'monthlyIncome',
      label: 'Monthly Income',
      value: '$18,500',
      status: 'good',
      description: 'Verified gross monthly income from all sources'
    },
    {
      id: 'liquidAssets',
      label: 'Liquid Assets',
      value: '$114,700',
      status: 'good',
      description: 'Cash and easily convertible assets'
    },
    {
      id: 'totalAssets',
      label: 'Total Assets',
      value: '$1,580,000',
      status: 'good',
      description: 'Sum of all reported assets'
    },
    {
      id: 'totalLiabilities',
      label: 'Total Liabilities',
      value: '$333,000',
      status: 'good',
      description: 'Sum of all reported debts and obligations'
    },
    {
      id: 'netWorth',
      label: 'Net Worth',
      value: '$1,247,000',
      status: 'good',
      description: 'Total assets minus total liabilities'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCommentChange = (metricId: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [metricId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Financial Analysis Summary</h1>
                <p className="text-sm text-gray-500">Key calculations and ratios • Ready for review</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Analysis Complete
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Decision Summary */}
        <Card className="border-green-200 bg-green-50 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-green-800">MEETS ALL CRITERIA</CardTitle>
                <CardDescription className="text-green-600">
                  All financial metrics and requirements are satisfied
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-sm text-green-600">Confidence</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {financialMetrics.map((metric) => (
            <Card key={metric.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span>{metric.label}</span>
                  </CardTitle>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Comments</label>
                  <Textarea
                    placeholder="Add comments or notes about this metric..."
                    value={comments[metric.id] || ''}
                    onChange={(e) => handleCommentChange(metric.id, e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setShowCheckerMode(true)} size="lg">
            Send to Checker
          </Button>
          <Button variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" size="lg">
            <FileText className="w-4 h-4 mr-2" />
            Export to LOS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
