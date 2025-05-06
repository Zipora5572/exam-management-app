import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Search, Plus, Github, GraduationCapIcon as Graduation } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import type { AppDispatch, StoreType } from "../store/store"
import NotificationsDropdown from "./NotificationsDropdown"
import HelpCenter from "./HelpCenter"
import { log } from "console"
import { logout } from "@/store/userSlice"
import UserMenu from "./Auth/UserAccess"

const Header = () => {
  const user = useSelector((state: StoreType) => state.auth.user)
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  const isPublicPage = location.pathname === "/" || location.pathname === "/about" || location.pathname === "/home"
  const dispatch = useDispatch<AppDispatch>()
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
  }
  const handleCreateNew = () => {
    // Create new functionality
    navigate("/app/exams/new")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 ">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white">
            <Graduation className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-red-600">ExamEase</span>
        </Link>
      </div>

      {!isPublicPage && (
        <form onSubmit={handleSearch} className="hidden flex-1 items-center px-4 md:flex lg:px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search exams, students, or folders..."
              className="w-full bg-gray-100 pl-8 focus-visible:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      )}

      <div className="flex items-center gap-3">
        {!isPublicPage && (
          <>
            <Button variant="outline" size="sm" className="hidden gap-1 md:flex" onClick={handleCreateNew}>
              <Plus className="h-4 w-4" />
              <span>Create Exam</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleCreateNew}>
              <Plus className="h-5 w-5" />
            </Button>
          </>
        )}

       
        <a
          href="https://github.com/Zipora5572/exam-management-app/tree/main/React-App"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Button>
        </a>

        <NotificationsDropdown />
        <HelpCenter />

        {user ? (
          <UserMenu user={user}/>
        ) : (
          <Link to="/authForm">
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
