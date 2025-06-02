
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, FileText, Calculator, Shield, Download } from 'lucide-react';
import UnderwritingStep from './UnderwritingStep';
import ExplainabilityPanel from './ExplainabilityPanel';
import FinalSummary from './FinalSummary';

interface UnderwritingFlowProps {
  data: {
    productType: string;
    riskLevel: string;
    documents: string[];
  };
  onBack: () => void;
}

const underwritingSteps = [
  {
    id: 'pfs-analysis',
    title: 'Personal Financial Statement Analysis',
    description: 'Extracting key financial data from client documents',
    icon: FileText,
    duration: 3000,
    substeps: [
      'Reading uploaded PFS document',
      'Extracting net worth calculations',
      'Identifying liquid assets',
      'Calculating debt obligations'
    ]
  },
  {
    id: 'credit-analysis',
    title: 'Credit Report Analysis',
    description: 'Analyzing credit history and scoring',
    icon: Shield,
    duration: 2500,
    substeps: [
      'Processing credit report data',
      'Extracting credit score',
      'Analyzing payment history',
      'Calculating monthly obligations'
    ]
  },
  {
    id: 'mortgage-calc',
    title: 'Mortgage Calculations',
    description: 'Computing DTI, LTV, and affordability metrics',
    icon: Calculator,
    duration: 2000,
    substeps: [
      'Calculating debt-to-income ratio',
      'Computing loan-to-value ratio',
      'Analyzing cash flow requirements',
      'Validating affordability metrics'
    ]
  },
  {
    id: 'policy-check',
    title: 'Policy & Procedure Matching',
    description: 'Checking compliance with underwriting guidelines',
    icon: CheckCircle,
    duration: 1500,
    substeps: [
      'Matching against policy requirements',
      'Validating minimum criteria',
      'Checking exception rules',
      'Generating compliance report'
    ]
  }
];

const UnderwritingFlow = ({ data, onBack }: UnderwritingFlowProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepProcessing, setStepProcessing] = useState<string | null>(null);
  const [stepProgress, setStepProgress] = useState(0);

  const handleStartStep = (stepId: string) => {
    const stepIndex = underwritingSteps.findIndex(step => step.id === stepId);
    const step = underwritingSteps[stepIndex];
    
    setStepProcessing(stepId);
    setStepProgress(0);
    
    // Simulate step processing with progress
    const progressInterval = setInterval(() => {
      setStepProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStepProcessing(null);
          setCompletedSteps(prev => [...prev, stepId]);
          setProgress(((stepIndex + 1) / underwritingSteps.length) * 100);
          
          // If this was the last step, mark as complete
          if (stepIndex === underwritingSteps.length - 1) {
            setIsComplete(true);
          } else {
            setCurrentStepIndex(stepIndex + 1);
          }
          return 100;
        }
        return prev + 2;
      });
    }, step.duration / 50);
  };

  if (isComplete) {
    return <FinalSummary data={data} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Underwriting in Progress</h1>
                <p className="text-sm text-gray-500">{data.productType} • {data.riskLevel} Risk</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{Math.round(progress)}% Complete</div>
                <div className="text-xs text-gray-500">Step {completedSteps.length + (stepProcessing ? 1 : 0)} of {underwritingSteps.length}</div>
              </div>
              <div className="w-24">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {underwritingSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = index === currentStepIndex && !stepProcessing;
                const isProcessing = stepProcessing === step.id;
                const isPending = index > currentStepIndex;

                return (
                  <UnderwritingStep
                    key={step.id}
                    step={step}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                    isProcessing={isProcessing}
                    isPending={isPending}
                    onSelect={() => setSelectedStep(step.id)}
                    isSelected={selectedStep === step.id}
                    onStart={() => handleStartStep(step.id)}
                    stepProgress={isProcessing ? stepProgress : 0}
                  />
                );
              })}
            </div>
          </div>

          {/* Explainability Panel */}
          <div className="lg:col-span-1">
            <ExplainabilityPanel 
              selectedStep={selectedStep} 
              completedSteps={completedSteps}
              currentStep={currentStepIndex < underwritingSteps.length ? underwritingSteps[currentStepIndex] : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderwritingFlow;
