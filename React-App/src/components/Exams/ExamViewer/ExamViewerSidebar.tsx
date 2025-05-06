"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Circle, PenTool, Hand, Eraser } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ExamViewerSidebarProps {
  exam: any
  grade: number
  setgrade: (grade: number) => void
  evaluation: string
  setEvaluation: (evaluation: string) => void
  markedAnswers: any[]
  setMarkedAnswers: (answers: any[]) => void
  calculategrade: () => void
  studentExams: any[]
}

const ExamViewerSidebar = ({
  exam,
  grade,
  setgrade,
  evaluation,
  setEvaluation,
  markedAnswers,
  setMarkedAnswers,
  calculategrade,
  studentExams,
}: ExamViewerSidebarProps) => {
  const [activeTab, setActiveTab] = useState("grading")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isManualGrading, setIsManualGrading] = useState(false)

  const handleGradeChange = (value: number[]) => {
    setgrade(value[0])
  }

  const handleEvaluationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluation(e.target.value)
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template === selectedTemplate ? null : template)
  }

  const handleToggleManualGrading = (checked: boolean) => {
    setIsManualGrading(checked)
    if (!checked) {
      setSelectedTemplate(null)
    }
  }

  return (
    <div className="w-80 flex flex-col gap-4">
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Student</h3>
              <p className="text-sm text-gray-900">
                {exam?.student.firstName} {exam?.student.lastName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">ID</h3>
              <p className="text-sm text-gray-900">{exam?.student.studentId || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Email</h3>
              <p className="text-sm text-gray-900">{exam?.student.email || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
          <TabsTrigger
            value="grading"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Grading
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grading" className="mt-4 space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Score</span>
                  <span className="text-lg font-bold text-red-600">{grade}/100</span>
                </div>
                <Slider
                  value={[grade]}
                  max={100}
                  step={1}
                  onValueChange={handleGradeChange}
                  className="[&_[role=slider]]:bg-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add your evaluation comments here..."
                value={evaluation}
                onChange={handleEvaluationChange}
                className="min-h-[120px] resize-none border-gray-300 focus-visible:ring-red-500"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="mt-4 space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Marking Tools</CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="manual-grading"
                    checked={isManualGrading}
                    onCheckedChange={handleToggleManualGrading}
                    className="data-[state=checked]:bg-red-600"
                  />
                  <Label htmlFor="manual-grading" className="text-sm text-gray-700">
                    Manual Grading
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isManualGrading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedTemplate === "correct" ? "default" : "outline"}
                      className={`flex flex-col items-center justify-center p-3 h-auto ${
                        selectedTemplate === "correct"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleTemplateSelect("correct")}
                    >
                      <Check className="h-6 w-6 mb-1" />
                      <span className="text-xs">Correct</span>
                    </Button>
                    <Button
                      variant={selectedTemplate === "incorrect" ? "default" : "outline"}
                      className={`flex flex-col items-center justify-center p-3 h-auto ${
                        selectedTemplate === "incorrect"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleTemplateSelect("incorrect")}
                    >
                      <X className="h-6 w-6 mb-1" />
                      <span className="text-xs">Incorrect</span>
                    </Button>
                    <Button
                      variant={selectedTemplate === "circle" ? "default" : "outline"}
                      className={`flex flex-col items-center justify-center p-3 h-auto ${
                        selectedTemplate === "circle"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleTemplateSelect("circle")}
                    >
                      <Circle className="h-6 w-6 mb-1" />
                      <span className="text-xs">Circle</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedTemplate === "pen" ? "default" : "outline"}
                      className={`flex flex-col items-center justify-center p-3 h-auto ${
                        selectedTemplate === "pen"
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleTemplateSelect("pen")}
                    >
                      <PenTool className="h-6 w-6 mb-1" />
                      <span className="text-xs">Pen</span>
                    </Button>
                    <Button
                      variant={selectedTemplate === "hand" ? "default" : "outline"}
                      className={`flex flex-col items-center justify-center p-3 h-auto ${
                        selectedTemplate === "hand"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleTemplateSelect("hand")}
                    >
                      <Hand className="h-6 w-6 mb-1" />
                      <span className="text-xs">Pan</span>
                    </Button>
                    <Button
                      variant={selectedTemplate === "eraser" ? "default" : "outline"}
                      className={`flex flex-col items-center justify-center p-3 h-auto ${
                        selectedTemplate === "eraser"
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : "border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleTemplateSelect("eraser")}
                    >
                      <Eraser className="h-6 w-6 mb-1" />
                      <span className="text-xs">Eraser</span>
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Instructions:</span> Select a marking tool and click on the exam to
                      apply it. Use the pan tool to navigate the exam.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] bg-gray-50 border border-gray-200 rounded-md">
                  <div className="text-center p-4">
                    <p className="text-gray-500 mb-2">Enable manual grading to access marking tools</p>
                    <Button onClick={() => setIsManualGrading(true)} className="bg-red-600 hover:bg-red-700">
                      Enable Manual Grading
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ExamViewerSidebar
