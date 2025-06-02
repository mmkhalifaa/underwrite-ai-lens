
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, ArrowRight, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnderwritingStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    icon: any;
    duration: number;
    substeps: string[];
  };
  isCompleted: boolean;
  isCurrent: boolean;
  isProcessing: boolean;
  isPending: boolean;
  onSelect: () => void;
  isSelected: boolean;
  onStart: () => void;
  stepProgress: number;
}

const stepOutputs = {
  'pfs-analysis': {
    netWorth: '$1,247,000',
    liquidAssets: '$850,000',
    monthlyIncome: '$18,500',
    confidence: 'High'
  },
  'credit-analysis': {
    creditScore: '726',
    monthlyObligations: '$3,200',
    paymentHistory: '100% on-time',
    confidence: 'High'
  },
  'mortgage-calc': {
    dti: '28.5%',
    ltv: '75%',
    cashReserves: '6.2 months',
    confidence: 'Medium'
  },
  'policy-check': {
    policyMatched: 'Policy #12A',
    status: 'Compliant',
    exceptions: 'None',
    confidence: 'High'
  }
};

const UnderwritingStep = ({ 
  step, 
  isCompleted, 
  isCurrent, 
  isProcessing,
  isPending, 
  onSelect, 
  isSelected,
  onStart,
  stepProgress
}: UnderwritingStepProps) => {
  const [currentSubstep, setCurrentSubstep] = useState(0);
  const Icon = step.icon;

  useEffect(() => {
    if (isProcessing) {
      const substepIndex = Math.floor((stepProgress / 100) * step.substeps.length);
      setCurrentSubstep(Math.min(substepIndex, step.substeps.length - 1));
    }
  }, [isProcessing, stepProgress, step.substeps.length]);

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-50 border-green-200';
    if (isProcessing) return 'bg-blue-50 border-blue-200';
    if (isCurrent) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getIconColor = () => {
    if (isCompleted) return 'text-green-600';
    if (isProcessing) return 'text-blue-600';
    if (isCurrent) return 'text-yellow-600';
    return 'text-gray-400';
  };

  const stepOutput = stepOutputs[step.id as keyof typeof stepOutputs];

  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:shadow-md ${getStatusColor()} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : isProcessing ? 'bg-blue-100' : isCurrent ? 'bg-yellow-100' : 'bg-gray-100'}`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Icon className={`w-5 h-5 ${getIconColor()}`} />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            )}
            {isProcessing && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Clock className="w-3 h-3 mr-1" />
                Processing
              </Badge>
            )}
            {isCurrent && !isProcessing && (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onStart();
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            )}
            {isPending && (
              <Badge variant="outline" className="text-gray-500">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Current Processing Steps */}
        {isProcessing && (
          <div className="mb-4">
            <div className="space-y-2">
              {step.substeps.map((substep, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    index < currentSubstep ? 'bg-green-500' : 
                    index === currentSubstep ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    index <= currentSubstep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {substep}
                  </span>
                </div>
              ))}
            </div>
            <Progress value={stepProgress} className="mt-3 h-1" />
          </div>
        )}

        {/* Completed Step Output */}
        {isCompleted && stepOutput && (
          <div className="bg-white rounded-lg p-4 border">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stepOutput).map(([key, value]) => (
                <div key={key}>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="text-xs text-gray-500">Source: PFS_Document.pdf, Page 2</span>
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                View Source
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnderwritingStep;
