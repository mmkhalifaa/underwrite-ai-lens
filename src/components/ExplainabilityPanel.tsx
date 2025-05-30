
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, FileText, Settings, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ExplainabilityPanelProps {
  selectedStep: string | null;
  completedSteps: string[];
  currentStep: any;
}

const stepExplanations = {
  'pfs-analysis': {
    confidence: 'High',
    reasoning: 'Personal Financial Statement shows strong financial position with diversified assets and manageable debt levels.',
    businessContext: 'PFS analysis is critical for verifying borrower\'s ability to service debt and maintain financial stability.',
    sources: ['PFS_Document.pdf', 'Bank_Statements.pdf'],
    keyFindings: ['Net worth exceeds loan amount by 4.2x', 'Liquid assets cover 6+ months payments', 'Income trend is stable']
  },
  'credit-analysis': {
    confidence: 'High',
    reasoning: 'Credit report indicates excellent payment history with manageable existing debt obligations.',
    businessContext: 'Credit analysis ensures borrower has demonstrated ability to manage credit responsibly.',
    sources: ['Credit_Report.pdf', 'Payment_History.xlsx'],
    keyFindings: ['FICO score in excellent range', 'No late payments in 24 months', 'Credit utilization under 30%']
  },
  'mortgage-calc': {
    confidence: 'Medium',
    reasoning: 'DTI ratio is within acceptable range but approaching upper threshold for this loan program.',
    businessContext: 'Debt-to-income calculations determine borrower\'s capacity to take on additional mortgage debt.',
    sources: ['Income_Verification.pdf', 'Tax_Returns.pdf'],
    keyFindings: ['DTI at 28.5% (threshold: 30%)', 'LTV provides adequate equity cushion', 'Cash reserves adequate']
  },
  'policy-check': {
    confidence: 'High',
    reasoning: 'All underwriting criteria met per Policy #12A with no exceptions required.',
    businessContext: 'Policy compliance ensures loan meets regulatory and institutional risk standards.',
    sources: ['Underwriting_Guidelines.pdf', 'Policy_Matrix.xlsx'],
    keyFindings: ['Minimum FICO requirement met', 'LTV within policy limits', 'Income documentation complete']
  }
};

const ExplainabilityPanel = ({ selectedStep, completedSteps, currentStep }: ExplainabilityPanelProps) => {
  const [comment, setComment] = useState('');
  
  const explanation = selectedStep ? stepExplanations[selectedStep as keyof typeof stepExplanations] : null;
  const isStepCompleted = selectedStep ? completedSteps.includes(selectedStep) : false;

  return (
    <div className="space-y-4">
      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis Status</CardTitle>
          <CardDescription>Real-time underwriting progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Steps Completed</span>
              <Badge variant="secondary">{completedSteps.length}/4</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Task</span>
              <span className="text-sm text-gray-600">
                {currentStep ? currentStep.title.split(' ')[0] + '...' : 'Complete'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status</span>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">On Track</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Details Card */}
      {selectedStep && explanation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Step Details</span>
              {isStepCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
            </CardTitle>
            <CardDescription>AI reasoning and context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Confidence Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Confidence Level</span>
                <Badge 
                  variant={explanation.confidence === 'High' ? 'default' : 'secondary'}
                  className={explanation.confidence === 'High' ? 'bg-green-100 text-green-800' : ''}
                >
                  {explanation.confidence}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* AI Reasoning */}
            <div>
              <h4 className="text-sm font-medium mb-2">AI Reasoning</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{explanation.reasoning}</p>
            </div>

            <Separator />

            {/* Business Context */}
            <div>
              <h4 className="text-sm font-medium mb-2">Why This Matters</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{explanation.businessContext}</p>
            </div>

            <Separator />

            {/* Key Findings */}
            <div>
              <h4 className="text-sm font-medium mb-2">Key Findings</h4>
              <ul className="space-y-1">
                {explanation.keyFindings.map((finding, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Source Documents */}
            <div>
              <h4 className="text-sm font-medium mb-2">Source Documents</h4>
              <div className="space-y-1">
                {explanation.sources.map((source, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start p-0 h-auto text-xs text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {source}
                  </Button>
                ))}
              </div>
            </div>

            {/* Manual Override */}
            {isStepCompleted && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Manual Override</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Override Decision
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Flag for Review
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comments Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reviewer Comments</CardTitle>
          <CardDescription>Add notes for audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Textarea
              placeholder="Add comments about this step..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-sm"
              rows={3}
            />
            <Button size="sm" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExplainabilityPanel;
