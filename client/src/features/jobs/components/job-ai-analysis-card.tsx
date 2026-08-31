import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAnalyzeJob } from "../hooks/use-analyze-job";

interface JobAiAnalysisCardProps {
  jobId: string;
  aiAnalysis?: {
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    suggestions: string[];
    provider: string;
    model: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

function getScoreMeta(score: number) {
  if (score >= 80) {
    return {
      label: "Strong Match",
      description: "Your resume is a strong match for this role.",
      className: "text-emerald-500",
      barClassName: "bg-emerald-500",
    };
  }

  if (score >= 60) {
    return {
      label: "Good Match",
      description: "Your resume matches many of the requirements.",
      className: "text-blue-500",
      barClassName: "bg-blue-500",
    };
  }

  if (score >= 40) {
    return {
      label: "Moderate Match",
      description: "There are some important areas you could improve.",
      className: "text-amber-500",
      barClassName: "bg-amber-500",
    };
  }

  return {
    label: "Low Match",
    description: "This role has several gaps compared with your resume.",
    className: "text-red-500",
    barClassName: "bg-red-500",
  };
}

function getAiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "AI analysis failed. Please try again.";
}

export default function JobAiAnalysisCard({
  jobId,
  aiAnalysis: jobAiAnalysis,
}: JobAiAnalysisCardProps) {
  const analyzeJob = useAnalyzeJob();

  function handleAnalyze() {
    analyzeJob.mutate(jobId);
  }

  const result = analyzeJob.data ?? jobAiAnalysis;
  const scoreMeta = result ? getScoreMeta(result.matchScore) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Job Analysis
        </CardTitle>

        <Button onClick={handleAnalyze} disabled={analyzeJob.isPending}>
          <Sparkles className="mr-2 h-4 w-4" />

          {analyzeJob.isPending ? "Analyzing..." : "Analyze with AI"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error */}
        {analyzeJob.isError && (
          <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-medium">AI analysis failed</p>

              <p className="mt-1">{getAiErrorMessage(analyzeJob.error)}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !analyzeJob.isPending && !analyzeJob.isError && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Sparkles className="h-6 w-6" />
            </div>

            <p className="font-medium">Analyze this job with AI</p>

            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Compare your attached resume against the job description to see
              your match score, matching skills, skill gaps, and improvement
              suggestions.
            </p>
          </div>
        )}

        {/* Loading */}
        {analyzeJob.isPending && (
          <div className="space-y-4">
            <div>
              <p className="font-medium">Analyzing your application...</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Gemini is comparing your resume against the job description.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-2 w-3/4 animate-pulse rounded-full bg-muted" />
              <div className="h-2 w-1/2 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        )}

        {/* Result */}
        {result && scoreMeta && (
          <>
            {/* Match Score */}
            <div className="rounded-lg border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />

                    <p className="text-sm font-medium text-muted-foreground">
                      Match Score
                    </p>
                  </div>

                  <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-5xl font-bold">{result.matchScore}%</p>

                    <span
                      className={`text-sm font-semibold ${scoreMeta.className}`}
                    >
                      {scoreMeta.label}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {scoreMeta.description}
                  </p>
                </div>

                <CheckCircle2 className={`h-6 w-6 ${scoreMeta.className}`} />
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${scoreMeta.barClassName}`}
                    style={{
                      width: `${Math.min(
                        Math.max(result.matchScore, 0),
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Matching Skills */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                <h3 className="text-sm font-semibold">Matching Skills</h3>

                <span className="text-xs text-muted-foreground">
                  ({result.matchingSkills.length})
                </span>
              </div>

              {result.matchingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No matching skills identified.
                </p>
              )}
            </div>

            {/* Missing Skills */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />

                <h3 className="text-sm font-semibold">Missing Skills / Gaps</h3>

                <span className="text-xs text-muted-foreground">
                  ({result.missingSkills.length})
                </span>
              </div>

              {result.missingSkills.length > 0 ? (
                <div className="space-y-2">
                  {result.missingSkills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No significant skill gaps identified.
                </p>
              )}
            </div>

            {/* Suggestions */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500" />

                <h3 className="text-sm font-semibold">
                  Improvement Suggestions
                </h3>
              </div>

              {result.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      className="flex gap-3 rounded-md border bg-muted/30 p-3"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No additional suggestions.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
