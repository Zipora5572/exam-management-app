"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { AppDispatch } from "../../store/store"
import { updateStudentExam } from "../../store/studentExamSlice"
import type { StudentExamType } from "../../models/StudentExam"
import studentExamsService from "../../services/StudentExamService"
import * as XLSX from "xlsx"
import {
  Search,
  RefreshCw,
  Download,
  CheckCircle,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Filter,
  X,
  FileText,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface StudentsExamsListProps {
  studentExams: StudentExamType[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  sortConfig: { key: string; direction: "ascending" | "descending" }
  setSortConfig: (config: { key: string; direction: "ascending" | "descending" }) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (items: number) => void
  selectedExams: StudentExamType[]
  setSelectedExams: (exams: StudentExamType[]) => void
  checkingStatus: { [key: string]: "idle" | "pending" | "done" }
  setCheckingStatus: (status: { [key: string]: "idle" | "pending" | "done" }) => void
  isRefreshing: boolean
  fetchStudentExams: () => void
  isExportDialogOpen: boolean
  setIsExportDialogOpen: (open: boolean) => void
  examId: number
  examFileTeacherName: string
}

const StudentsExamsList = ({
  studentExams,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortConfig,
  setSortConfig,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  selectedExams,
  setSelectedExams,
  checkingStatus,
  setCheckingStatus,
  isRefreshing,
  fetchStudentExams,
  isExportDialogOpen,
  setIsExportDialogOpen,
  examId,
  examFileTeacherName,
}: StudentsExamsListProps) => {
  const [exportFormat, setExportFormat] = useState("xlsx")
  const [exportOptions, setExportOptions] = useState({
    includeGrades: true,
    includeComments: true,
    includeTimestamps: true,
  })
  const [dateFilter, setDateFilter] = useState<{
    startDate: string | null
    endDate: string | null
  }>({
    startDate: null,
    endDate: null,
  })
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const filteredExams = studentExams.filter((exam) => {
    const matchesSearch =
      exam.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.namePrefix && exam.namePrefix.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "checked"
          ? exam.isChecked
          : statusFilter === "unchecked"
            ? !exam.isChecked
            : true

    let matchesDate = true
    if (dateFilter.startDate && exam.checkedAt) {
      const examDate = new Date(exam.checkedAt)
      const startDate = new Date(dateFilter.startDate)
      matchesDate = examDate >= startDate
    }
    if (dateFilter.endDate && exam.checkedAt) {
      const examDate = new Date(exam.checkedAt)
      const endDate = new Date(dateFilter.endDate)
      endDate.setHours(23, 59, 59, 999)
      matchesDate = matchesDate && examDate <= endDate
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const sortedExams = [...filteredExams].sort((a, b) => {
    let aValue, bValue

    switch (sortConfig.key) {
      case "studentName":
        aValue = a.studentName || ""
        bValue = b.studentName || ""
        break
      case "grade":
        aValue = a.grade || 0
        bValue = b.grade || 0
        break
      case "checkedAt":
        aValue = a.checkedAt ? new Date(a.checkedAt).getTime() : 0
        bValue = b.checkedAt ? new Date(b.checkedAt).getTime() : 0
        break
      default:
        aValue = a.studentName || ""
        bValue = b.studentName || ""
    }

    if (sortConfig.direction === "ascending") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentExams = sortedExams.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedExams.length / itemsPerPage)

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  const handleSelectExam = (exam: StudentExamType) => {
    setSelectedExams((prev) =>
      prev.find((e) => e.id === exam.id) ? prev.filter((e) => e.id !== exam.id) : [...prev, exam],
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExams(currentExams)
    } else {
      setSelectedExams([])
    }
  }

  const isSelected = (exam: StudentExamType) => selectedExams.some((e) => e.id === exam.id)

  const handleViewExamDetails = (exam: StudentExamType) => {
    navigate("/app/viewExam", { state: { exam } })
  }

  const handleCheckExam = async (studentExam: StudentExamType) => {
    const examId = studentExam.id
    setCheckingStatus((prev) => ({ ...prev, [examId]: "pending" }))

    try {
      const response = await studentExamsService.checkExam(studentExam.namePrefix, examFileTeacherName)

      dispatch(
        updateStudentExam({
          id: studentExam.id,
          studentExam: {
            ...studentExam,
            grade: Number(response.grade?.replace("%", "")),
            evaluation: response.evaluation,
            isChecked: true,
            checkedAt: new Date().toISOString(),
          },
        }),
      )

      setCheckingStatus((prev) => ({ ...prev, [examId]: "done" }))
    } catch (error) {
      console.error("Error checking exam:", error)
      setCheckingStatus((prev) => ({ ...prev, [examId]: "idle" }))
    }
  }

  const handleBatchCheck = async () => {
    if (selectedExams.length === 0) {
      return
    }

    const uncheckedExams = selectedExams.filter((exam) => !exam.isChecked)

    if (uncheckedExams.length === 0) {
      return
    }

    for (const exam of uncheckedExams) {
      await handleCheckExam(exam)
    }
  }

  const handleExportData = () => {
    const dataToExport = studentExams.map((exam) => {
      const exportData: Record<string, any> = {
        "First Name": exam.student.firstName || "Unknown",
        "Last Name": exam.student.lastName || "Unknown",
      }

      if (exportOptions.includeGrades) {
        exportData["grade"] = exam.grade || "N/A"
        exportData["Status"] = exam.isChecked ? "Checked" : "Not Checked"
      }

      if (exportOptions.includeComments) {
        exportData["Comments"] = exam.evaluation || "N/A"
      }

      if (exportOptions.includeTimestamps) {
        exportData["Checked At"] = exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "N/A"
      }

      return exportData
    })

    if (exportFormat === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Student Grades")
      XLSX.writeFile(workbook, `Student_Grades_${examId}.xlsx`)
    } else if (exportFormat === "csv") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport)
      const csv = XLSX.utils.sheet_to_csv(worksheet)
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `Student_Grades_${examId}.csv`
      link.click()
    } else if (exportFormat === "pdf") {
      // In a real implementation, you would use a PDF library
      console.log("PDF export would be implemented here")
    }

    setIsExportDialogOpen(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setDateFilter({ startDate: null, endDate: null })
  }

  const renderPagination = () => {
    const pages = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className={`w-9 h-9 p-0 ${currentPage === i ? "bg-red-600 hover:bg-red-700" : "border-gray-200 hover:bg-gray-50"}`}
        >
          {i}
        </Button>,
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &laquo;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &lsaquo;
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 p-0 border-gray-200"
            >
              1
            </Button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 p-0 border-gray-200"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &rsaquo;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 p-0 border-gray-200"
        >
          &raquo;
        </Button>
      </div>
    )
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-gray-900">Student Exams</CardTitle>
              <CardDescription className="text-gray-500">Manage and review student exam submissions</CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchStudentExams}
                disabled={isRefreshing}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>

              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Student Data</DialogTitle>
                    <DialogDescription>Choose your export format and options</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Export Format</h4>
                      <div className="flex space-x-2">
                        {["xlsx", "csv", "pdf"].map((format) => (
                          <Button
                            key={format}
                            variant={exportFormat === format ? "default" : "outline"}
                            size="sm"
                            onClick={() => setExportFormat(format)}
                            className={exportFormat === format ? "bg-red-600 hover:bg-red-700" : "border-gray-300"}
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Export Options</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeGrades"
                            checked={exportOptions.includeGrades}
                            onCheckedChange={(checked) =>
                              setExportOptions({
                                ...exportOptions,
                                includeGrades: checked === true,
                              })
                            }
                            className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label htmlFor="includeGrades" className="text-sm">
                            Include grades and status
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeComments"
                            checked={exportOptions.includeComments}
                            onCheckedChange={(checked) =>
                              setExportOptions({
                                ...exportOptions,
                                includeComments: checked === true,
                              })
                            }
                            className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label htmlFor="includeComments" className="text-sm">
                            Include teacher comments
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeTimestamps"
                            checked={exportOptions.includeTimestamps}
                            onCheckedChange={(checked) =>
                              setExportOptions({
                                ...exportOptions,
                                includeTimestamps: checked === true,
                              })
                            }
                            className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <label htmlFor="includeTimestamps" className="text-sm">
                            Include timestamps
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} className="border-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={handleExportData} className="bg-red-600 hover:bg-red-700">
                      Export
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="default"
                size="sm"
                onClick={handleBatchCheck}
                disabled={selectedExams.length === 0}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
              >
                <CheckCircle className="h-4 w-4" />
                Check Selected ({selectedExams.length})
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          {showFilters && (
            <div className="mb-4 p-4 border rounded-md bg-gray-50 border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block text-gray-700">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search students..."
                      className="pl-8 border-gray-300 focus-visible:ring-red-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] border-gray-300">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      <SelectItem value="checked">Checked</SelectItem>
                      <SelectItem value="unchecked">Unchecked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700">Start Date</label>
                  <Input
                    type="date"
                    value={dateFilter.startDate || ""}
                    onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value || null })}
                    className="border-gray-300 focus-visible:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-700">End Date</label>
                  <Input
                    type="date"
                    value={dateFilter.endDate || ""}
                    onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value || null })}
                    className="border-gray-300 focus-visible:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">{filteredExams.length} results found</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={currentExams.length > 0 && selectedExams.length === currentExams.length}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("studentName")}>
                    <div className="flex items-center space-x-1">
                      <span>Student</span>
                      {sortConfig.key === "studentName" &&
                        (sortConfig.direction === "ascending" ? (
                          <SortAsc className="h-4 w-4 text-gray-500" />
                        ) : (
                          <SortDesc className="h-4 w-4 text-gray-500" />
                        ))}
                      {sortConfig.key !== "studentName" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("grade")}>
                    <div className="flex items-center space-x-1">
                      <span>Grade</span>
                      {sortConfig.key === "grade" &&
                        (sortConfig.direction === "ascending" ? (
                          <SortAsc className="h-4 w-4 text-gray-500" />
                        ) : (
                          <SortDesc className="h-4 w-4 text-gray-500" />
                        ))}
                      {sortConfig.key !== "grade" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("checkedAt")}>
                    <div className="flex items-center space-x-1">
                      <span>Checked At</span>
                      {sortConfig.key === "checkedAt" &&
                        (sortConfig.direction === "ascending" ? (
                          <SortAsc className="h-4 w-4 text-gray-500" />
                        ) : (
                          <SortDesc className="h-4 w-4 text-gray-500" />
                        ))}
                      {sortConfig.key !== "checkedAt" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentExams.map((exam) => (
                    <TableRow
                      key={exam.id}
                      className={isSelected(exam) ? "bg-red-50" : "hover:bg-gray-50"}
                      data-state={isSelected(exam) ? "selected" : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected(exam)}
                          onCheckedChange={() => handleSelectExam(exam)}
                          className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {exam.student.firstName} {exam.student.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        {exam.isChecked ? (
                          <div className="font-medium">{exam.grade}</div>
                        ) : (
                          <span className="text-gray-500">Not graded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {exam.isChecked ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Checked
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Unchecked
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {exam.checkedAt ? (
                          <div className="text-sm">
                            {new Date(exam.checkedAt).toLocaleDateString()}
                            <div className="text-xs text-gray-500">{new Date(exam.checkedAt).toLocaleTimeString()}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-gray-200">
                            <DropdownMenuItem
                              onClick={() => handleViewExamDetails(exam)}
                              className="text-gray-700 focus:text-gray-900 focus:bg-gray-100"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCheckExam(exam)}
                              disabled={exam.isChecked || checkingStatus[exam.id] === "pending"}
                              className="text-gray-700 focus:text-gray-900 focus:bg-gray-100"
                            >
                              {checkingStatus[exam.id] === "pending" ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Check Exam
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-200" />
                            <DropdownMenuItem className="text-gray-700 focus:text-gray-900 focus:bg-gray-100">
                              <FileText className="mr-2 h-4 w-4" />
                              Download Exam
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredExams.length)} of{" "}
                {filteredExams.length}
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[100px] border-gray-300">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && <div className="flex justify-center">{renderPagination()}</div>}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default StudentsExamsList
