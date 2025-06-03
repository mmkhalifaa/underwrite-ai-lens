
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, FileText, Shield, Landmark } from 'lucide-react';
import UnderwritingFlow from '@/components/UnderwritingFlow';
import SmartDocumentUpload, { CategorizedDocument } from '@/components/SmartDocumentUpload';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [underwritingData, setUnderwritingData] = useState({
    productType: '',
    incomeTypes: [] as string[],
    documents: [] as CategorizedDocument[]
  });
  const { toast } = useToast();

  const handleStartUnderwriting = () => {
    if (!underwritingData.productType || underwritingData.incomeTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select product type and at least one income type to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (underwritingData.documents.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload at least one document to begin analysis.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentScreen('underwriting');
    toast({
      title: "Underwriting Started",
      description: "AI analysis is beginning. Please wait...",
    });
  };

  const handleDocumentsChange = (documents: CategorizedDocument[]) => {
    setUnderwritingData(prev => ({
      ...prev,
      documents
    }));
  };

  const handleIncomeTypeChange = (incomeType: string, checked: boolean) => {
    setUnderwritingData(prev => ({
      ...prev,
      incomeTypes: checked 
        ? [...prev.incomeTypes, incomeType]
        : prev.incomeTypes.filter(type => type !== incomeType)
    }));
  };

  if (currentScreen === 'underwriting') {
    return <UnderwritingFlow data={underwritingData} onBack={() => setCurrentScreen('setup')} />;
  }

  const isConfigurationComplete = underwritingData.productType && underwritingData.incomeTypes.length > 0;
  const totalDocuments = underwritingData.documents.length;
  const isReadyToStart = isConfigurationComplete && totalDocuments > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Mortgage Underwriting AI</h1>
              <p className="text-sm text-gray-500">Transparent AI-powered decision making</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Underwriting Task</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure your underwriting parameters and upload documents for AI analysis with step-by-step transparency.
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isConfigurationComplete 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              }`}>
                {isConfigurationComplete ? '✓' : '1'}
              </div>
              <span className={`text-sm font-medium ${
                isConfigurationComplete ? 'text-green-700' : 'text-blue-700'
              }`}>
                Configuration
              </span>
            </div>
            <div className={`h-0.5 w-16 ${isConfigurationComplete ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                totalDocuments > 0 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : isConfigurationComplete 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
              }`}>
                {totalDocuments > 0 ? '✓' : '2'}
              </div>
              <span className={`text-sm font-medium ${
                totalDocuments > 0 ? 'text-green-700' : 
                isConfigurationComplete ? 'text-blue-700' : 'text-gray-500'
              }`}>
                Documents ({totalDocuments})
              </span>
            </div>
            <div className={`h-0.5 w-16 ${totalDocuments > 0 ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isReadyToStart 
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                  : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${
                isReadyToStart ? 'text-blue-700' : 'text-gray-500'
              }`}>
                Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="max-w-6xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Landmark className="w-5 h-5" />
              <span>Underwriting Setup</span>
            </CardTitle>
            <CardDescription>
              Configure loan parameters and upload required documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Configuration Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Configuration</h3>
                {isConfigurationComplete && (
                  <div className="ml-auto text-sm text-green-600 font-medium">✓ Complete</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Type */}
                <div className="space-y-2">
                  <Label htmlFor="product-type">Product Type</Label>
                  <Select onValueChange={(value) => setUnderwritingData(prev => ({ ...prev, productType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Income Type */}
                <div className="space-y-2">
                  <Label>Client Income Type</Label>
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="annuitized-income"
                        checked={underwritingData.incomeTypes.includes('annuitized')}
                        onCheckedChange={(checked) => handleIncomeTypeChange('annuitized', !!checked)}
                      />
                      <Label htmlFor="annuitized-income" className="text-sm font-normal">
                        Annuitized income
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="w2-employment"
                        checked={underwritingData.incomeTypes.includes('w2-employment')}
                        onCheckedChange={(checked) => handleIncomeTypeChange('w2-employment', !!checked)}
                      />
                      <Label htmlFor="w2-employment" className="text-sm font-normal">
                        W-2 employment income
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
                {totalDocuments > 0 && (
                  <div className="ml-auto text-sm text-green-600 font-medium">✓ {totalDocuments} uploaded</div>
                )}
              </div>

              <SmartDocumentUpload 
                onDocumentsChange={handleDocumentsChange}
                documents={underwritingData.documents}
              />
            </div>

            {/* Start Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button 
                onClick={handleStartUnderwriting}
                disabled={!isReadyToStart}
                className={`w-full font-medium py-3 transition-all duration-200 ${
                  isReadyToStart 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                size="lg"
              >
                {!isConfigurationComplete 
                  ? 'Complete Configuration First' 
                  : totalDocuments === 0 
                    ? 'Upload Documents to Continue'
                    : 'Begin Underwriting Analysis'
                }
              </Button>
              {isReadyToStart && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Analysis will process {totalDocuments} document{totalDocuments !== 1 ? 's' : ''} for {underwritingData.productType} loan
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
