
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, AlertTriangle, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckerModeProps {
  data: {
    productType: string;
    riskLevel: string;
    documents: string[];
  };
  onBack: () => void;
  onComplete: () => void;
}

const underwritingSteps = [
  {
    id: 'pfs-analysis',
    title: 'Personal Financial Statement Analysis',
    aiDecision: 'Net Worth: $1,247,000 | Liquid Assets: $850,000',
    confidence: 'High',
    requiresReview: false
  },
  {
    id: 'credit-analysis', 
    title: 'Credit Report Analysis',
    aiDecision: 'Credit Score: 726 | Monthly Obligations: $3,200',
    confidence: 'High',
    requiresReview: false
  },
  {
    id: 'mortgage-calc',
    title: 'Mortgage Calculations', 
    aiDecision: 'DTI: 28.5% | LTV: 75% | Cash Reserves: 6.2 months',
    confidence: 'Medium',
    requiresReview: true
  },
  {
    id: 'policy-check',
    title: 'Policy & Procedure Matching',
    aiDecision: 'Policy #12A matched | Status: Compliant',
    confidence: 'High', 
    requiresReview: false
  }
];

const CheckerMode = ({ data, onBack, onComplete }: CheckerModeProps) => {
  const [approvedSteps, setApprovedSteps] = useState<string[]>([]);
  const [comments, setComments] = useState<{[key: string]: string}>({});
  const [overallComment, setOverallComment] = useState('');
  const { toast } = useToast();

  const handleStepApproval = (stepId: string, approved: boolean) => {
    if (approved) {
      setApprovedSteps(prev => [...prev, stepId]);
    } else {
      setApprovedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  const handleStepComment = (stepId: string, comment: string) => {
    setComments(prev => ({ ...prev, [stepId]: comment }));
  };

  const handleFinalSubmission = () => {
    const allStepsReviewed = underwritingSteps.every(step => 
      !step.requiresReview || approvedSteps.includes(step.id)
    );

    if (!allStepsReviewed) {
      toast({
        title: "Review Required",
        description: "Please review all flagged steps before submission.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Underwriting Approved",
      description: "File has been submitted for final processing.",
    });

    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const totalSteps = underwritingSteps.length;
  const reviewedSteps = approvedSteps.length + underwritingSteps.filter(s => !s.requiresReview).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Summary
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Checker Review Mode</h1>
                <p className="text-sm text-gray-500">Human oversight and approval workflow</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {reviewedSteps}/{totalSteps} Steps Reviewed
                </div>
                <div className="text-xs text-gray-500">{data.productType} • {data.riskLevel} Risk</div>
              </div>
              <Badge 
                variant={reviewedSteps === totalSteps ? "default" : "secondary"}
                className={reviewedSteps === totalSteps ? "bg-green-100 text-green-800" : ""}
              >
                {reviewedSteps === totalSteps ? "Ready for Submission" : "In Review"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Instructions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Checker Review Instructions</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Review each AI decision below. Steps marked with ⚠️ require manual approval. 
                    Add comments as needed and approve/override decisions before final submission.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Reviews */}
          <div className="space-y-4">
            {underwritingSteps.map((step) => {
              const isApproved = approvedSteps.includes(step.id);
              const needsReview = step.requiresReview;
              const isAutoApproved = !needsReview;

              return (
                <Card key={step.id} className={`${needsReview ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {needsReview ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-600">
                            {step.aiDecision}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={step.confidence === 'High' ? 'default' : 'secondary'}
                          className={step.confidence === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {step.confidence} Confidence
                        </Badge>
                        {isAutoApproved && (
                          <Badge className="bg-green-100 text-green-800">
                            Auto-Approved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Manual Review Section */}
                      {needsReview && (
                        <div className="bg-white rounded-lg p-4 border border-yellow-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <Checkbox
                              id={`approve-${step.id}`}
                              checked={isApproved}
                              onCheckedChange={(checked) => handleStepApproval(step.id, !!checked)}
                            />
                            <label htmlFor={`approve-${step.id}`} className="text-sm font-medium">
                              I approve this AI decision
                            </label>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                              Reviewer Comments (Optional)
                            </label>
                            <Textarea
                              placeholder="Add comments about this decision..."
                              value={comments[step.id] || ''}
                              onChange={(e) => handleStepComment(step.id, e.target.value)}
                              rows={2}
                              className="text-sm"
                            />
                          </div>

                          <div className="flex space-x-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStepApproval(step.id, false)}
                            >
                              Override Decision
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              Request Additional Info
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Auto-approved steps */}
                      {isAutoApproved && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-800 font-medium">
                              Automatically approved based on high confidence and policy compliance
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Overall Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Overall Review Comments</span>
              </CardTitle>
              <CardDescription>
                Add any additional comments for the loan file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add overall comments about this underwriting decision..."
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Final Action */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-900">Ready for Final Submission</h3>
                  <p className="text-sm text-green-700 mt-1">
                    All required reviews completed. Click submit to finalize the underwriting decision.
                  </p>
                </div>
                <Button 
                  onClick={handleFinalSubmission}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={reviewedSteps !== totalSteps}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Final Decision
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckerMode;
