"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../store/store"
import { getAllExams } from "../store/examSlice"
import { getStudentExamsByExamId } from "../store/studentExamSlice"
import { Line, Radar } from "react-chartjs-2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
// import { useToast } from "@/hooks/use-toast"
import {
  Download,
  User,
  CheckCircle,
  Clock,
  RefreshCw,
  Mail,
  Phone,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  Printer,
} from "lucide-react"

const StudentReport = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  // const { toast } = useToast()

  const exams = useSelector((state: StoreType) => state.exams.exams)
  const studentExams = useSelector((state: StoreType) => state.studentExams.exams)
  const loading = useSelector((state: StoreType) => state.studentExams.loading)

  useEffect(() => {
    dispatch(getAllExams())
  }, [dispatch])

  useEffect(() => {
    if (selectedExam) {
      fetchStudentExams(Number.parseInt(selectedExam))
    }
  }, [selectedExam, dispatch])

  const fetchStudentExams = async (examId: number) => {
    setIsRefreshing(true)
    try {
      await dispatch(getStudentExamsByExamId(examId)).unwrap()
      // toast({
      //   title: "Success",
      //   description: "Student data loaded successfully",
      //   variant: "success",
      // })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to load student data",
      //   variant: "destructive",
      // })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Get unique students from all exams
  const uniqueStudents = Array.from(
    new Set(studentExams.map((exam) => exam.studentName || exam.studentExamName || "Unknown")),
  )

  // Filter exams for selected student
  const studentData = selectedStudent
    ? studentExams.filter((exam) => (exam.studentName || exam.studentExamName) === selectedStudent)
    : []

  // Calculate student statistics
  const averagegrade =
    studentData.length > 0 ? studentData.reduce((sum, exam) => sum + (exam.grade || 0), 0) / studentData.length : 0

  const highestgrade = studentData.length > 0 ? Math.max(...studentData.map((exam) => exam.grade || 0)) : 0

  const lowestgrade = studentData.length > 0 ? Math.min(...studentData.map((exam) => exam.grade || 0)) : 0

  const completedExams = studentData.filter((exam) => exam.isChecked).length

  // Performance trend data
  const performanceTrend = {
    labels: studentData
      .sort((a, b) => {
        if (!a.checkedAt || !b.checkedAt) return 0
        return new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
      })
      .map((exam) => exam.name || "Exam")
      .slice(0, 10),
    datasets: [
      {
        label: "grade",
        data: studentData
          .sort((a, b) => {
            if (!a.checkedAt || !b.checkedAt) return 0
            return new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
          })
          .map((exam) => exam.grade || 0)
          .slice(0, 10),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Skill radar data (mock data for demonstration)
  const skillsData = {
    labels: ["Reading", "Writing", "Listening", "Speaking", "Grammar", "Vocabulary"],
    datasets: [
      {
        label: "Skills",
        data: [85, 70, 90, 65, 75, 80],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  }

  const handlePrintReport = () => {
    setIsPrinting(true)

    // Simulate printing delay
    setTimeout(() => {
      setIsPrinting(false)
      // toast({
      //   title: "Report generated",
      //   description: "Student report has been prepared for printing",
      //   variant: "success",
      // })

      // In a real implementation, this would trigger the browser's print dialog
      // window.print()
    }, 1500)
  }

  if (loading && !isRefreshing && !selectedExam) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Student Report</h1>
            <p className="text-muted-foreground">Detailed performance analysis for individual students</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handlePrintReport}
              disabled={!selectedStudent || isPrinting}
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4" />
                  Print Report
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                // toast({
                //   title: "Export successful",
                //   description: "Student report exported as PDF",
                //   variant: "success",
                // })
              }}
              disabled={!selectedStudent}
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <Select value={selectedStudent || ""} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStudents.map((student) => (
                <SelectItem key={student} value={student}>
                  {student}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedExam || ""} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id.toString()}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedExam && fetchStudentExams(Number.parseInt(selectedExam))}
            disabled={isRefreshing || !selectedExam}
            className="flex items-center gap-1"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {!selectedStudent ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Student Selected</h3>
            <p className="text-gray-500 max-w-md">
              Please select a student from the dropdown above to view their detailed performance report.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium">{selectedStudent}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>student@example.com</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-2 h-4 w-4" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Grade 10</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Average grade</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{averagegrade.toFixed(1)}</span>
                        {averagegrade > 75 ? (
                          <Badge variant="success" className="flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Good
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center bg-red-100 text-red-800">
                            <TrendingDown className="mr-1 h-3 w-3" />
                            Needs Improvement
                          </Badge>
                        )}
                      </div>
                      <Progress value={averagegrade} className="h-2" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Highest grade</p>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold mr-2">{highestgrade}</span>
                        <Badge variant="success" className="flex items-center">
                          <Award className="mr-1 h-3 w-3" />
                          Best
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Completed Exams</p>
                      <p className="text-2xl font-bold">{completedExams}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Last Exam</p>
                      <p className="text-lg font-medium">
                        {studentData.length > 0 && studentData[0].checkedAt
                          ? new Date(studentData[0].checkedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                <TabsTrigger value="exams">Exam History</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                    <CardDescription>Student's grade progression over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Line
                      data={performanceTrend}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Excellent understanding of core concepts</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Strong problem-solving skills</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Consistent performance across exams</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          <span>Time management during exams</span>
                        </li>
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          <span>Attention to detail in complex questions</span>
                        </li>
                        <li className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-red-500" />
                          <span>Application of theoretical knowledge</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Breakdown</CardTitle>
                    <CardDescription>Analysis of student's proficiency across different skill areas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Radar
                      data={skillsData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              stepSize: 20,
                            },
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Skills Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {skillsData.labels.map((skill, index) => (
                        <div key={skill} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{skill}</span>
                            <span className="text-sm text-gray-500">{skillsData.datasets[0].data[index]}%</span>
                          </div>
                          <Progress value={skillsData.datasets[0].data[index]} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exams" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Exam History</CardTitle>
                    <CardDescription>Complete record of all exams taken by the student</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Exam Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              grade
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentData.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                No exam records found
                              </td>
                            </tr>
                          ) : (
                            studentData.map((exam) => (
                              <tr key={exam.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {exam.name || "Untitled Exam"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "Not available"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.isChecked ? (
                                    <span className="font-medium">{exam.grade || 0}/100</span>
                                  ) : (
                                    <span className="text-gray-400">Not graded</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {exam.isChecked ? (
                                    <Badge variant="success" className="bg-red-100 text-red-800">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      Pending
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentReport
