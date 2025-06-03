import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, FileText, AlertTriangle, ArrowLeft, Clock } from 'lucide-react';
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
    riskLevel: data.incomeTypes.join(', '), // Convert incomeTypes array to string for backward compatibility
    documents: data.documents.map(doc => doc.file.name) // Convert CategorizedDocument[] to string[] for CheckerMode
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

  const financialData = {
    netWorth: '$1,247,000',
    creditScore: '726',
    monthlyIncome: '$18,500',
    monthlyObligations: '$3,200',
    dtiRatio: '28.5%',
    ltvRatio: '75%',
    cashReserves: '6.2 months',
    divorceStatus: 'Married',
    pfsRecency: '3 months old'
  };

  const obligations = [
    { type: 'Credit Card', amount: '$450', balance: '$12,000' },
    { type: 'Auto Loan', amount: '$650', balance: '$28,000' },
    { type: 'Student Loan', amount: '$320', balance: '$15,000' },
    { type: 'Personal Loan', amount: '$280', balance: '$8,500' },
    { type: 'HOA Fees', amount: '$350', balance: 'N/A' },
    { type: 'Insurance', amount: '$1,150', balance: 'N/A' }
  ];

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
                <h1 className="text-xl font-semibold text-gray-900">Underwriting Complete</h1>
                <p className="text-sm text-gray-500">Analysis finished • Ready for review</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Decision */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-green-800">APPROVE WITH CONDITIONS</CardTitle>
                    <CardDescription className="text-green-600">
                      Loan meets all primary criteria with minor conditions
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-green-600">Confidence</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Conditions:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Verify employment status within 10 days of closing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Obtain updated bank statements showing sufficient reserves</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Financials */}
            <Card>
              <CardHeader>
                <CardTitle>Extracted Financial Information</CardTitle>
                <CardDescription>Key data points from document analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(financialData).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Obligations */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Obligations Breakdown</CardTitle>
                <CardDescription>Detailed analysis of borrower's existing debts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Obligation Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Payment
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Outstanding Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {obligations.map((obligation, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {obligation.type}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {obligation.amount}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            {obligation.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total Monthly Obligations:</span>
                    <span className="text-lg font-bold text-blue-600">$3,200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Available actions and workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setShowCheckerMode(true)}>
                  <Clock className="w-4 h-4 mr-2" />
                  Send to Checker
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Export to LOS
                </Button>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Overall risk profile summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Credit Risk</span>
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Income Risk</span>
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Collateral Risk</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Risk</span>
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Metrics</CardTitle>
                <CardDescription>Analysis performance details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Time</span>
                    <span className="text-sm font-medium">2m 15s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documents Processed</span>
                    <span className="text-sm font-medium">{data.documents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Points Extracted</span>
                    <span className="text-sm font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Manual Review Required</span>
                    <span className="text-sm font-medium text-yellow-600">2 items</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
