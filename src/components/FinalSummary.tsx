
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
      description: 'Total monthly debt payments divided by gross monthly income',
      criteria: 'The calculated DTI is within the policy recommended range (<55%)'
    },
    {
      id: 'liquidity',
      label: 'Liquidity Ratio',
      value: '6.2 months',
      status: 'good',
      description: 'Liquid assets available to cover monthly obligations',
      criteria: 'Liquid assets cover minimum 6 months of monthly obligations as required by policy'
    },
    {
      id: 'leverage',
      label: 'Leverage Ratio',
      value: '3.2:1',
      status: 'moderate',
      description: 'Total debt to net worth ratio',
      criteria: 'Leverage ratio is within acceptable range (≤5:1) per underwriting guidelines'
    },
    {
      id: 'monthlyIncome',
      label: 'Monthly Income',
      value: '$18,500',
      status: 'good',
      description: 'Verified gross monthly income from all sources',
      criteria: 'Income meets minimum threshold ($15,000/month) and is properly documented'
    },
    {
      id: 'liquidAssets',
      label: 'Liquid Assets',
      value: '$114,700',
      status: 'good',
      description: 'Cash and easily convertible assets',
      criteria: 'Liquid assets exceed minimum requirement (≥$100,000) for this loan amount'
    },
    {
      id: 'totalAssets',
      label: 'Total Assets',
      value: '$1,580,000',
      status: 'good',
      description: 'Sum of all reported assets',
      criteria: 'Total assets are sufficient to support loan amount and demonstrate financial capacity'
    },
    {
      id: 'totalLiabilities',
      label: 'Total Liabilities',
      value: '$333,000',
      status: 'good',
      description: 'Sum of all reported debts and obligations',
      criteria: 'Total liabilities are reasonable relative to assets and income capacity'
    },
    {
      id: 'netWorth',
      label: 'Net Worth',
      value: '$1,247,000',
      status: 'good',
      description: 'Total assets minus total liabilities',
      criteria: 'Net worth exceeds minimum requirement (≥$1,000,000) for this product type'
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
                  <label className="text-sm font-medium text-gray-700">Policy Criteria</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">{metric.criteria}</p>
                  </div>
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
