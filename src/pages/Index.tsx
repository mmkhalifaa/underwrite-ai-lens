
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain } from 'lucide-react';
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Underwriting Task</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI will analyze your documents step-by-step, showing transparent reasoning and allowing human oversight at every stage.
          </p>
        </div>

        <div className="space-y-8">
          {/* Configuration Card */}
          <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Underwriting Configuration</CardTitle>
              <CardDescription>
                Configure underwriting parameters before document upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="space-y-3">
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
            </CardContent>
          </Card>

          {/* Document Upload */}
          <SmartDocumentUpload 
            onDocumentsChange={handleDocumentsChange}
            documents={underwritingData.documents}
          />

          {/* Start Button */}
          <div className="max-w-2xl mx-auto">
            <Button 
              onClick={handleStartUnderwriting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
              size="lg"
            >
              Begin Underwriting Analysis
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
