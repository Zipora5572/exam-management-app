"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSelector } from "react-redux"
import type { StoreType } from "@/store/store"
import { BarChart, Calendar, FileText, FolderOpen, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const user = useSelector((state: StoreType) => state.auth.user)
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const folders = useSelector((state: StoreType) => state.folders.folders)
  const navigate = useNavigate()

  // Mock data for dashboard
  const recentActivity = [
    { id: 1, type: "exam", name: "Math Final Exam", date: "2 hours ago" },
    { id: 2, type: "folder", name: "Science Tests", date: "Yesterday" },
    { id: 3, type: "exam", name: "History Quiz", date: "3 days ago" },
    { id: 4, type: "exam", name: "English Literature Test", date: "1 week ago" },
  ]

  const upcomingExams = [
    { id: 1, name: "Physics Mid-term", date: "Tomorrow", students: 28 },
    { id: 2, name: "Chemistry Lab Test", date: "Next week", students: 22 },
    { id: 3, name: "Biology Final", date: "In 2 weeks", students: 35 },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/app/exams")}>
            View All Exams
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{exams.length || 24}</div>
                <p className="text-xs text-muted-foreground">+4 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Folders</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{folders.length || 8}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Next: Tomorrow</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent exam and folder activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        {activity.type === "exam" ? (
                          <FileText className="h-4 w-4 mr-2 text-red-600" />
                        ) : (
                          <FolderOpen className="h-4 w-4 mr-2 text-blue-600" />
                        )}
                        <span>{activity.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>Scheduled exams for your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingExams.map((exam) => (
                    <div key={exam.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{exam.name}</span>
                        <span className="text-sm text-muted-foreground">{exam.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{exam.students} students</span>
                      </div>
                      <Progress value={Math.random() * 100} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Analytics</CardTitle>
              <CardDescription>View performance metrics and statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart className="h-16 w-16" />
                <p>Analytics data will appear here</p>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Reports</CardTitle>
              <CardDescription>Generate and view detailed reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <FileText className="h-16 w-16" />
                <p>Your reports will appear here</p>
                <Button variant="outline" size="sm">
                  Create New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View your recent notifications</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <p>No new notifications</p>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
