"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../../store/store"
import { getStudentExamsByExamId } from "../../../store/studentExamSlice"
import { useLocation, useNavigate } from "react-router-dom"

import ExamViewerHeader from "./ExamViewerHeader"
import ExamViewerCanvas from "./ExamViewerCanvas"
import ExamViewerSidebar from "./ExamViewerSidebar"

const ExamFileViewer = () => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null)
  const [loadingImage, setLoadingImage] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [grade, setgrade] = useState(0)
  const [evaluation, setEvaluation] = useState("")
  const [markedAnswers, setMarkedAnswers] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { exam } = location.state || {}

  useEffect(() => {
    if (exam?.examId) {
      dispatch(getStudentExamsByExamId(exam.examId))
    }
  }, [dispatch, exam?.examId])

  useEffect(() => {
    if (exam) {
      setgrade(exam.grade || 0)
      setEvaluation(exam.evaluation || "")
      // Reset view when exam changes
      setPosition({ x: 0, y: 0 })
      setZoom(1)
    }
  }, [exam])

  const studentExams = useSelector((state: StoreType) => state.studentExams.exams)

  const handleGoBack = () => {
    navigate(-1)
  }

  const calculategrade = () => {
    const totalgrade = markedAnswers.reduce((total, answer) => total + answer.grade, 0)
    setgrade(Math.min(100, Math.max(0, totalgrade)))
  }

  const resetView = () => {
    if (image) {
      const stageWidth = window.innerWidth - 500
      const stageHeight = window.innerHeight - 200

      // Calculate position to center the image
      const xPos = (stageWidth - image.width * zoom) / 2
      const yPos = (stageHeight - image.height * zoom) / 2

      setPosition({ x: xPos, y: yPos })
      setZoom(1)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ExamViewerHeader
        exam={exam}
        handleGoBack={handleGoBack}
        zoom={zoom}
        setZoom={setZoom}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        grade={grade}
        evaluation={evaluation}
      />

      <div className="flex gap-4 h-[calc(100vh-12rem)] px-6 pb-6">
        <ExamViewerSidebar
          exam={exam}
          grade={grade}
          setgrade={setgrade}
          evaluation={evaluation}
          setEvaluation={setEvaluation}
          markedAnswers={markedAnswers}
          setMarkedAnswers={setMarkedAnswers}
          calculategrade={calculategrade}
          studentExams={studentExams}
        />

        <ExamViewerCanvas
          exam={exam}
          loadingImage={loadingImage}
          setLoadingImage={setLoadingImage}
          markedAnswers={markedAnswers}
          setMarkedAnswers={setMarkedAnswers}
          zoom={zoom}
          position={position}
          setPosition={setPosition}
          calculategrade={calculategrade}
          currentPage={currentPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          image={image}
          setImage={setImage}
        />
      </div>
    </div>
  )
}

export default ExamFileViewer
