"use client"

import { ArrowLeft, ChevronLeft, ChevronRight, Download, RotateCcw, Save, Share2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import studentExamsService from "../../../services/StudentExamService"
import { Loader2 } from "lucide-react"

interface ExamViewerHeaderProps {
  exam: any
  handleGoBack: () => void
  zoom: number
  setZoom: (zoom: number) => void
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
  isShareDialogOpen: boolean
  setIsShareDialogOpen: (open: boolean) => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
  grade: number
  evaluation: string
}

const ExamViewerHeader = ({
  exam,
  handleGoBack,
  zoom,
  setZoom,
  currentPage,
  totalPages,
  setCurrentPage,
  isShareDialogOpen,
  setIsShareDialogOpen,
  isSaving,
  setIsSaving,
  grade,
  evaluation,
}: ExamViewerHeaderProps) => {
  const [shareEmail, setShareEmail] = useState("")
  const [sharePermission, setSharePermission] = useState("view")
  const getLastFolder = (filePath) => {
    const parts = filePath.split("/")
    // Filter out empty strings in case of leading or trailing slashes
    const filteredParts = parts.filter((part) => part.length > 0)

    // The last folder will be the second to last element in the filtered array
    return filteredParts.length > 1 ? filteredParts[filteredParts.length - 2] : null
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleShareExam = () => {
    setIsShareDialogOpen(false)
  }

  const handleSaveExam = async () => {
    if (!exam) return

    setIsSaving(true)

    try {
      // Save exam data
      await studentExamsService.updateStudentExam(exam.id, {
        ...exam,
        grade: grade,
        evaluation: evaluation,
        isChecked: true,
        checkedAt: new Date().toISOString(),
      })

      // Navigate back to student exams list
      handleGoBack()
    } catch (error) {
      console.error("Error saving exam data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200 mx-6 mt-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-sm font-medium text-gray-700">
          {getLastFolder(exam.namePrefix)} / {exam?.student.firstName} {exam?.student.lastName}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1 border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="h-8 w-8 text-gray-700 hover:bg-gray-100"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center text-gray-700">{Math.round(zoom * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="h-8 w-8 text-gray-700 hover:bg-gray-100"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="h-8 w-8 text-gray-700 hover:bg-gray-100"
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 rounded-md px-2 py-1 border border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="h-8 w-8 text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 text-gray-700 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1 border-gray-300 hover:bg-gray-50">
              <Share2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Exam</DialogTitle>
              <DialogDescription>Share this exam with other teachers or administrators</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="shareEmail" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="shareEmail"
                  placeholder="colleague@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="border-gray-300 focus-visible:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sharePermission" className="text-sm font-medium text-gray-700">
                  Permission
                </label>
                <Select value={sharePermission} onValueChange={setSharePermission}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View only</SelectItem>
                    <SelectItem value="comment">Can comment</SelectItem>
                    <SelectItem value="edit">Can edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)} className="border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleShareExam} className="bg-red-600 hover:bg-red-700">
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleSaveExam}
          disabled={isSaving}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default ExamViewerHeader
