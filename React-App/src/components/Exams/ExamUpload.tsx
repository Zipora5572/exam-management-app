"use client"

import type React from "react"

import useModal from "../../hooks/useModal"
import ModalWrapper from "../ModalWrapper"
import type { ExamFileType } from "../../models/Exam"
import { Upload, HelpCircle, Languages } from "lucide-react"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { uploadExamFile } from "../../store/examSlice"
import type { StoreType, AppDispatch } from "../../store/store"
import LanguageDetectionService from "../../services/LanguageDetectionService"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const ExamUpload = ({ folderId }: { folderId: number | undefined }) => {
  const user = useSelector((state: StoreType) => state.auth.user)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [detectedLanguage, setDetectedLanguage] = useState<"english" | "hebrew" | "unknown">("unknown")
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hebrew">("english")
  const [languageConfidence, setLanguageConfidence] = useState(0)
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [examDetails, setExamDetails] = useState<Partial<ExamFileType>>({
    userId: 1,
    examName: " ",
    folderId: folderId,
    topic: { name: "name", description: "desc" },
  })

  const { isOpen, openModal, closeModal, modalData } = useModal()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)

      // Start language detection
      setIsProcessing(true)
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
        // Detect language from the uploaded file
        const result = await LanguageDetectionService.detectLanguage({}, selectedFile)

        setDetectedLanguage(result.language)
        setLanguageConfidence(result.confidence)

        // Clear progress interval and set to 100%
        clearInterval(progressInterval)
        setProcessingProgress(100)

        // If confidence is high and language is known, use it directly
        if (result.confidence > 0.85 && result.language !== "unknown") {
          setSelectedLanguage(result.language)
          showExamDetailsModal(selectedFile, result.language)
        } else {
          // Otherwise, ask user to confirm language
          setShowLanguageSelection(true)
        }
      } catch (error) {
        console.error("Error detecting language:", error)
        clearInterval(progressInterval)
        setProcessingProgress(0)

        // Fall back to manual selection
        setShowLanguageSelection(true)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleLanguageConfirm = () => {
    if (file) {
      setShowLanguageSelection(false)
      showExamDetailsModal(file, selectedLanguage)
    }
  }

  const showExamDetailsModal = (selectedFile: File, language: "english" | "hebrew") => {
    const localTopic = {
      name: examDetails.topic?.name || "",
      description: examDetails.topic?.description || "",
    }

    openModal({
      title: "Enter Exam Details",
      confirmText: "Upload",
      onConfirm: () => {
        setExamDetails((prevDetails) => ({
          ...prevDetails,
          topic: { name: localTopic.name, description: localTopic.description },
        }))
        handleUpload(selectedFile, language)
      },
      children: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
            <div className="flex items-center">
              <Languages className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Language: {language === "english" ? "English" : "Hebrew"}
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Our AI will process this exam using {language === "english" ? "English" : "Hebrew"} OCR.
            </p>
          </div>

          <div>
            <label htmlFor="exam-name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="exam-name"
              type="text"
              defaultValue={examDetails.topic?.name}
              onChange={(e) => {
                localTopic.name = e.target.value
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="exam-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="exam-description"
              type="text"
              defaultValue={examDetails.topic?.description}
              onChange={(e) => {
                localTopic.description = e.target.value
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            />
          </div>
        </div>
      ),
    })
  }

  const handleUpload = async (selectedFile: File, language: "english" | "hebrew") => {
    if (selectedFile) {
      try {
        examDetails.folderId = folderId
        // In a real implementation, you would pass the language to your API
        dispatch(
          uploadExamFile({
            file: selectedFile,
            examDetails: examDetails,
            language: language,
          }),
        )
      } catch (error) {
        console.error("Error uploading file:", error)
      } finally {
        closeModal()
      }
    }
  }

  return (
    <div>
      <input accept="*" ref={fileInputRef} style={{ display: "none" }} type="file" onChange={handleFileChange} />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Exam
      </Button>

      {/* Language Detection Modal */}
      <ModalWrapper
        open={showLanguageSelection}
        handleClose={() => setShowLanguageSelection(false)}
        title="Confirm Document Language"
        onConfirm={handleLanguageConfirm}
        confirmText="Continue"
      >
        <div className="space-y-4">
          {detectedLanguage !== "unknown" && (
            <Alert className="bg-blue-50 border-blue-200">
              <Languages className="h-4 w-4 text-blue-600" />
              <AlertTitle>Language Detection</AlertTitle>
              <AlertDescription>
                We detected that this document might be in{" "}
                <span className="font-medium">{detectedLanguage === "english" ? "English" : "Hebrew"}</span>{" "}
                (confidence: {Math.round(languageConfidence * 100)}%). Please confirm or select the correct language.
              </AlertDescription>
            </Alert>
          )}

          <div className="py-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select the primary language of this exam:</h3>
            <RadioGroup
              value={selectedLanguage}
              onValueChange={(value) => setSelectedLanguage(value as "english" | "hebrew")}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hebrew" id="hebrew" />
                <Label htmlFor="hebrew">Hebrew</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
            <div className="flex items-start">
              <HelpCircle className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
              <p>
                Selecting the correct language ensures optimal OCR accuracy for student name detection and automated
                grading.
              </p>
            </div>
          </div>
        </div>
      </ModalWrapper>

      {/* Processing Modal */}
      <ModalWrapper open={isProcessing} handleClose={() => {}} title="Processing Document" hideButtons={true}>
        <div className="space-y-4 py-2">
          <p className="text-center text-sm text-gray-600">Analyzing document and detecting language...</p>
          <Progress value={processingProgress} className="h-2" />
          <p className="text-center text-xs text-gray-500">{processingProgress}% complete</p>
        </div>
      </ModalWrapper>

      {/* Exam Details Modal */}
      <ModalWrapper
        open={isOpen}
        handleClose={closeModal}
        title={modalData?.title || ""}
        onConfirm={modalData?.onConfirm}
        confirmText={modalData?.confirmText}
      >
        {modalData?.children}
      </ModalWrapper>
    </div>
  )
}

export default ExamUpload
