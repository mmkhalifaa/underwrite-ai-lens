
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, Brain, CheckCircle } from 'lucide-react';
import UnderwritingFlow from '@/components/UnderwritingFlow';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [underwritingData, setUnderwritingData] = useState({
    productType: '',
    incomeTypes: [] as string[],
    documents: []
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
    
    setCurrentScreen('underwriting');
    toast({
      title: "Underwriting Started",
      description: "AI analysis is beginning. Please wait...",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUnderwritingData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files.map(file => file.name)]
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Underwriting Task</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI will analyze your documents step-by-step, showing transparent reasoning and allowing human oversight at every stage.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Document Upload & Configuration</span>
            </CardTitle>
            <CardDescription>
              Upload client documents and configure underwriting parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="documents">Client Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-2">
                  Drop files here or click to upload
                </div>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
              {underwritingData.documents.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                  <div className="space-y-1">
                    {underwritingData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

            {/* Start Button */}
            <Button 
              onClick={handleStartUnderwriting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
              size="lg"
            >
              Begin Underwriting Analysis
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
