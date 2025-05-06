"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store/store"
import { deleteExamFile, getAllExams, renameExamFile } from "../../store/examSlice"
import { deleteFolder, renameFolder } from "../../store/folderSlice"
import StudentExamService from "../../services/StudentExamService"
import ExamService from "../../services/ExamService"
import StudentService from "../../services/StudentService"
import LanguageDetectionService from "../../services/LanguageDetectionService"
import type { ExamFileType, ExamFolderType } from "../../models/Exam"
import {
  Upload,
  Download,
  Trash2,
  Pencil,
  MoreHorizontal,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  Languages,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExamMenuProps {
  handleMenuClose: () => void
  row: ExamFileType | ExamFolderType
  openModal: (data: {
    title: string
    initialName?: string
    setNewName?: (name: string) => void
    confirmText?: string
    onConfirm?: (value?: string) => void
    children?: React.ReactNode
  }) => void
}

const ExamMenu: React.FC<ExamMenuProps> = ({ handleMenuClose, openModal, row }) => {
  const [newName, setNewName] = useState<string>(row.name)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hebrew">("english")
  const [studentListUploaded, setStudentListUploaded] = useState(false)
  const [isProcessingLanguage, setIsProcessingLanguage] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [detectedLanguage, setDetectedLanguage] = useState<"english" | "hebrew" | "unknown">("unknown")
  const [languageConfidence, setLanguageConfidence] = useState(0)
  const [showProcessingDialog, setShowProcessingDialog] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const selectedFilesRef = useRef<FileList | null>(null)

  useEffect(() => {
    setNewName(row.name)
  }, [row.name])

  useEffect(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      selectedFilesRef.current = selectedFiles
    }
  }, [selectedFiles])

  // Check if student list has been uploaded for this exam
  useEffect(() => {
    const checkStudentList = async () => {
      try {
        // This would be a real API call in a production app
        // For now, we'll simulate this check
        const hasStudents = await StudentService.hasStudents({ examId: row.id })
        setStudentListUploaded(hasStudents)
      } catch (error) {
        console.error("Error checking student list:", error)
        setStudentListUploaded(false)
      }
    }

    checkStudentList()
  }, [row.id])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files
      setSelectedFiles(files)

      // If this is a student exam upload, we need to detect language
      if (event.target.id.includes("student-file") || event.target.id.includes("folder-input")) {
        if (!studentListUploaded) {
          // Show error that student list must be uploaded first
          openModal({
            title: "Student List Required",
            children: (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Student List Required</AlertTitle>
                  <AlertDescription>
                    You need to upload a student list Excel file before uploading student exams. This allows our AI to
                    automatically match students to their exams.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-center">
                  <Button
                    variant="default"
                    onClick={() => {
                      handleUploadStudentList()
                    }}
                  >
                    Upload Student List
                  </Button>
                </div>
              </div>
            ),
            confirmText: "Close",
          })
          return
        }

        // Start language detection for the first file
        setShowProcessingDialog(true)
        setIsProcessingLanguage(true)
        setProcessingProgress(0)

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 300)

        try {
          // Detect language from the first uploaded file
          const result = await LanguageDetectionService.detectLanguage({ examId: row.id }, files[0])

          setDetectedLanguage(result.language)
          setLanguageConfidence(result.confidence)

          // Clear progress interval and set to 100%
          clearInterval(progressInterval)
          setProcessingProgress(100)

          // If confidence is high and language is known, use it directly
          if (result.confidence > 0.85 && result.language !== "unknown") {
            setSelectedLanguage(result.language)
            setShowProcessingDialog(false)
            handleUploadStudentExams(result.language)
          } else {
            // Otherwise, ask user to confirm language
            setShowProcessingDialog(false)
            setShowLanguageDialog(true)
          }
        } catch (error) {
          console.error("Error detecting language:", error)
          clearInterval(progressInterval)
          setProcessingProgress(0)
          setShowProcessingDialog(false)

          // Fall back to manual selection
          setShowLanguageDialog(true)
        } finally {
          setIsProcessingLanguage(false)
        }
      }
    }
  }

  const handleUploadStudentList = () => {
    openModal({
      title: "Upload Students Excel",
      children: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload an Excel file containing the list of students for this exam. Our AI will automatically match students
            to their exams.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Excel Template Format</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-200 px-3 py-2 text-left">Student ID</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">First Name</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Last Name</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Email</th>
                    <th className="border border-gray-200 px-3 py-2 text-left">Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">12345</td>
                    <td className="border border-gray-200 px-3 py-2">John</td>
                    <td className="border border-gray-200 px-3 py-2">Smith</td>
                    <td className="border border-gray-200 px-3 py-2">john.smith@example.com</td>
                    <td className="border border-gray-200 px-3 py-2">Class A</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">67890</td>
                    <td className="border border-gray-200 px-3 py-2">Jane</td>
                    <td className="border border-gray-200 px-3 py-2">Doe</td>
                    <td className="border border-gray-200 px-3 py-2">jane.doe@example.com</td>
                    <td className="border border-gray-200 px-3 py-2">Class B</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => window.open("#", "_blank")}>
                <Download className="h-3 w-3 mr-1" />
                Download Template
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              How the Process Works
            </h4>
            <ol className="text-xs text-blue-700 mt-1 ml-5 list-decimal">
              <li>Upload your student roster Excel file first</li>
              <li>Then upload scanned student exams</li>
              <li>Our AI will automatically identify student names on the exams</li>
              <li>The system matches exams to students in your roster</li>
              <li>Review and finalize the grading</li>
            </ol>
          </div>

          <input
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            id="upload-student-list-input"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-student-list-input">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("upload-student-list-input")?.click()}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Select Excel File
            </Button>
          </label>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      ),
      confirmText: "Upload",
      onConfirm: async () => {
        const filesToUpload = selectedFilesRef.current
        if (!filesToUpload) {
          setUploadError("Please select a file to upload")
          return
        }

        try {
          await StudentService.uploadStudentList({ examId: row.id }, filesToUpload[0])
          setStudentListUploaded(true)
          dispatch(getAllExams())
          handleMenuClose()
        } catch (error) {
          console.error("Error uploading student list:", error)
          setUploadError("Failed to upload student list. Please try again.")
        }
      },
    })
  }

  const handleUploadStudentExams = (detectedLang?: "english" | "hebrew") => {
    if (!studentListUploaded) {
      openModal({
        title: "Student List Required",
        children: (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Student List Required</AlertTitle>
              <AlertDescription>
                You need to upload a student list Excel file before uploading student exams. This allows our AI to
                automatically match students to their exams.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button
                variant="default"
                onClick={() => {
                  handleUploadStudentList()
                }}
              >
                Upload Student List
              </Button>
            </div>
          </div>
        ),
        confirmText: "Close",
      })
      return
    }

    // If language was already detected, use it
    if (detectedLang) {
      showUploadExamsModal(detectedLang)
    } else {
      // Otherwise show language selection dialog
      setShowLanguageDialog(true)
    }
  }

  const handleLanguageSelect = () => {
    setShowLanguageDialog(false)
    showUploadExamsModal(selectedLanguage)
  }

  const showUploadExamsModal = (language: "english" | "hebrew") => {
    openModal({
      title: "Upload Student Exams",
      children: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-md p-3 mb-4">
            <div className="flex items-center">
              <Languages className="h-4 w-4 text-green-600 mr-2" />
              <h4 className="text-sm font-medium text-green-800">
                Language: {language === "english" ? "English" : "Hebrew"}
              </h4>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Our AI will process these exams using {language === "english" ? "English" : "Hebrew"} OCR for optimal
              accuracy.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Choose to upload a full folder of student exams or a single file. Our AI will process them and automatically
            match students to their exams.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              AI-Powered Processing
            </h4>
            <p className="text-xs text-blue-700 mt-1">
              Our system will automatically identify student names on the exams and match them to your student list.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <input
              accept="*"
              style={{ display: "none" }}
              id="upload-folder-input"
              type="file"
              multiple
              {...({ webkitdirectory: "true" } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
              onChange={handleFileChange}
            />
            <label htmlFor="upload-folder-input">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("upload-folder-input")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Folder
              </Button>
            </label>

            <input
              accept="*"
              style={{ display: "none" }}
              id="upload-student-file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-student-file-input">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("upload-student-file-input")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </label>
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      ),
      confirmText: "Upload",
      onConfirm: () => {
        const filesToUpload = selectedFilesRef.current
        if (!filesToUpload || filesToUpload.length === 0) {
          setUploadError("Please select files to upload")
          return
        }
        handleFilesUpload(filesToUpload, language)
      },
    })
  }

  const handleFilesUpload = async (files: FileList | null, language: "english" | "hebrew") => {
    if (!files || files.length === 0) return

    setUploadError(null)

    try {
      // In a real implementation, we would pass the selected language to the API
      await StudentExamService.uploadStudentExams(
        {
          examId: row.id,
          language: language,
        },
        files,
      )
      dispatch(getAllExams())
      handleMenuClose()
    } catch (error) {
      console.error("Error uploading student exams:", error)
      setUploadError("Failed to upload student exams. Please try again.")
    }
  }

  const handleDownload = async () => {
    try {
      await ExamService.download(row.namePrefix)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    openModal({
      title: "Delete",
      children: (
        <div className="text-sm text-gray-600">
          You and the people you shared this file with won't be able to access it once it has been deleted. The file
          will be permanently deleted, and this action can't be undone.
        </div>
      ),
      confirmText: "Delete",
      onConfirm: () => {
        if (row.type === "file") dispatch(deleteExamFile(row.id))
        else dispatch(deleteFolder(row.id))
        handleMenuClose()
      },
    })
  }

  const handleRename = () => {
    openModal({
      title: "Rename",
      initialName: row.name,
      setNewName: (name: string) => {
        setNewName(name)
      },
      confirmText: "Rename",
      onConfirm: (updatedName: string) => {
        if (row.type === "file") dispatch(renameExamFile({ id: row.id, newName: updatedName }))
        else dispatch(renameFolder({ id: row.id, newName: updatedName }))
        handleMenuClose()
      },
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>AI-Powered Features</DropdownMenuLabel>
          <DropdownMenuGroup>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUploadStudentList()
                    }}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Upload Students Excel</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Upload student roster first to enable AI matching</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUploadStudentExams()
                    }}
                    className={!studentListUploaded ? "opacity-50" : ""}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Upload Student Exams</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    {!studentListUploaded ? "Upload student list first" : "AI will identify students and grade exams"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleRename()
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Document Language</DialogTitle>
            <DialogDescription>
              Choose the primary language of the exam documents for optimal OCR processing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {detectedLanguage !== "unknown" && (
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <Languages className="h-4 w-4 text-blue-600" />
                <AlertTitle>Language Detection</AlertTitle>
                <AlertDescription>
                  We detected that this document might be in{" "}
                  <span className="font-medium">{detectedLanguage === "english" ? "English" : "Hebrew"}</span>{" "}
                  (confidence: {Math.round(languageConfidence * 100)}%). Please confirm or select the correct language.
                </AlertDescription>
              </Alert>
            )}

            <RadioGroup
              value={selectedLanguage}
              onValueChange={(value) => setSelectedLanguage(value as "english" | "hebrew")}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="english-lang" />
                <Label htmlFor="english-lang">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hebrew" id="hebrew-lang" />
                <Label htmlFor="hebrew-lang">Hebrew</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLanguageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLanguageSelect}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      <Dialog open={showProcessingDialog} onOpenChange={setShowProcessingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing Document</DialogTitle>
            <DialogDescription>Analyzing document and detecting language...</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Progress value={processingProgress} className="h-2" />
            <p className="text-center text-sm text-gray-500 mt-2">{processingProgress}% complete</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExamMenu
