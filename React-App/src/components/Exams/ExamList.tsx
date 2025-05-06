// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useLocation } from "react-router-dom"
// import type { AppDispatch, StoreType } from "../../store/store"
// import { getAllExams } from "../../store/examSlice"
// import { getAllFolders } from "../../store/folderSlice"
// import useModal from "../../hooks/useModal"
// import ModalWrapper from "../ModalWrapper"
// import ActionButtons from "../ActionButtons"
// import ExamsTable from "./ExamsTable"
// import { ChevronLeft, ChevronUp, Search } from "lucide-react"
// import { Button } from "../ui/button"
// import { Input } from "../ui/input"
// import { log } from "console"

// const ExamList = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const exams = useSelector((state: StoreType) => state.exams.exams)
//   const folders = useSelector((state: StoreType) => state.folders.folders)
  
  
//   const loading = useSelector((state: StoreType) => state.exams.loading)
//   const error = useSelector((state: StoreType) => state.exams.error)
//   const { isOpen, openModal, closeModal, modalData } = useModal()
//   const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
//   const [currentFolderName, setCurrentFolderName] = useState<string | null>(null)
//   const [folderPath, setFolderPath] = useState<{ id: number | null; name: string }[]>([])
//   const location = useLocation()
//   const filter = new URLSearchParams(location.search).get("filter") || "all"
//   const [searchQuery, setSearchQuery] = useState("")
//   const filteredExams = exams.filter((exam) => {
//     if (filter === "shared") return exam.isShared
//     if (filter === "starred") return exam.isStarred
//     if (searchQuery) return exam.name.toLowerCase().includes(searchQuery.toLowerCase()) 

//     return true
//   })

//   const filteredFolders = folders.filter((folder) => {
//     if (filter === "shared") return folder.isShared
//     if (filter === "starred") return folder.isStarred
//     if (searchQuery) return folder.name.toLowerCase().includes(searchQuery.toLowerCase()) 
//     return true
//   })

//   useEffect(() => {
//     dispatch(getAllFolders())
//     dispatch(getAllExams())
//   }, [dispatch])

//   const handleGoBack = () => {
//     if (folderPath.length > 0) {
//       const newPath = [...folderPath]
//       newPath.pop()
//       setFolderPath(newPath)
//       setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null)
//     }
//   }

//   return (
//     <div className="space-y-4 ">
//       <div className="flex justify-between items-center">
//       <div className="flex items-center">
//           {folderPath.length > 0 && (
//             <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//           )}

//           <nav className="flex" aria-label="Breadcrumb">
//             <ol className="flex items-center space-x-2">
//               <li>
//                 <button
//                    onClick={() => {
//                     setFolderPath(folderPath.slice(0, index + 1))
//                     setCurrentFolderId(folder.id)
//                   }}
//                   className={`text-sm font-medium ${
//                     folderPath.length === 0 ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Your Exams
//                 </button>
//               </li>

//               {folderPath.map((folder, index) => (
//                 <li key={index} className="flex items-center">
//                   <span className="mx-1 text-gray-400">/</span>
//                   <button
//                    onClick={() => {
//                     setFolderPath([])
//                     setCurrentFolderId(null)
//                   }}
//                     className={`text-sm font-medium ${
//                       index === folderPath.length - 1 ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     {folder.name}
//                   </button>
//                 </li>
//               ))}
//             </ol>
//           </nav>
//         </div>
//         {/* <nav className="flex" aria-label="Breadcrumb">
//           <ol className="inline-flex items-center space-x-1 md:space-x-3">
//             <li className="inline-flex items-center">
//               <button
//                 onClick={() => {
//                   setFolderPath([])
//                   setCurrentFolderId(null)
//                 }}
//                 className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600"
//               >
//                 Your Exams
//               </button>
//             </li>

//             {folderPath.map((folder, index) => (
//               <li key={folder.id}>
//                 <div className="flex items-center">
//                   <svg
//                     className="w-3 h-3 text-gray-400 mx-1"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 6 10"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="m1 9 4-4-4-4"
//                     />
//                   </svg>
//                   <button
//                     onClick={() => {
//                       setFolderPath(folderPath.slice(0, index + 1))
//                       setCurrentFolderId(folder.id)
//                     }}
//                     className="ml-1 text-sm font-medium text-gray-700 hover:text-red-600 md:ml-2"
//                   >
//                     {folder.name}
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ol>
//         </nav> */}
//          <div className="flex items-center space-x-2">
//   <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//             <Input
//               type="search"
//               placeholder="Search exams..."
//               className="pl-8 w-64"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
          
//         <ActionButtons
//           folderId={currentFolderId}
//           folderName={currentFolderName || "ראשי"}
//           openModal={openModal}
//           modalData={modalData}
//         />
//       </div>
//       </div>

//       {/* {folderPath.length > 0 && (
//         <button
//           onClick={handleGoBack}
//           className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
//         >
//           <ChevronUp className="w-4 h-4 mr-1" />
//           Back
//         </button>
//       )} */}

//       {error ? (
//         <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
//       ) : (
//         <ExamsTable
//           exams={filteredExams}
//           folders={filteredFolders}
//           loading={loading}
//           currentFolderId={currentFolderId}
//           setCurrentFolderId={setCurrentFolderId}
//           currentFolderName={currentFolderName}
//           setCurrentFolderName={setCurrentFolderName}
//           folderPath={folderPath}
//           setFolderPath={setFolderPath}
//         />
//       )}

//       <ModalWrapper
//         open={isOpen}
//         handleClose={closeModal}
//         title={modalData?.title || ""}
//         onConfirm={modalData?.onConfirm}
//         confirmText={modalData?.confirmText}
//         initialName={modalData?.initialName}
//         setNewName={modalData?.setNewName || (() => {})}
//       >
//         {modalData?.children}
//       </ModalWrapper>
//     </div>
//   )
// }

// export default ExamList
"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import type { AppDispatch, StoreType } from "../../store/store"
import { getAllExams } from "../../store/examSlice"
import { getAllFolders } from "../../store/folderSlice"
import useModal from "../../hooks/useModal"
import ModalWrapper from "../ModalWrapper"
import ActionButtons from "../ActionButtons"
import ExamsTable from "./ExamsTable"
import { ChevronLeft, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const ExamList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const exams = useSelector((state: StoreType) => state.exams.exams)
  const folders = useSelector((state: StoreType) => state.folders.folders)

  const loading = useSelector((state: StoreType) => state.exams.loading)
  const error = useSelector((state: StoreType) => state.exams.error)
  const { isOpen, openModal, closeModal, modalData } = useModal()
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null)
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<{ id: number | null; name: string }[]>([])
  const location = useLocation()
  const filter = new URLSearchParams(location.search).get("filter") || "all"
  const [searchQuery, setSearchQuery] = useState("")
  const filteredExams = exams.filter((exam) => {
    if (filter === "shared") return exam.isShared
    if (filter === "starred") return exam.isStarred
    if (searchQuery) return exam.name.toLowerCase().includes(searchQuery.toLowerCase())

    return true
  })

  const filteredFolders = folders.filter((folder) => {
    if (filter === "shared") return folder.isShared
    if (filter === "starred") return folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    return true
  })

  useEffect(() => {
    dispatch(getAllFolders())
    dispatch(getAllExams())
  }, [dispatch])

  const handleGoBack = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath]
      newPath.pop()
      setFolderPath(newPath)
      setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null)
    }
  }

  return (
    <div className="space-y-4 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {folderPath.length > 0 && (
            <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => {
                    setFolderPath([])
                    setCurrentFolderId(null)
                  }}
                  className={`text-sm font-medium ${
                    folderPath.length === 0 ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Your Exams
                </button>
              </li>

              {folderPath.map((folder, index) => (
                <li key={index} className="flex items-center">
                  <span className="mx-1 text-gray-400">/</span>
                  <button
                    onClick={() => {
                      setFolderPath(folderPath.slice(0, index + 1))
                      setCurrentFolderId(folder.id)
                    }}
                    className={`text-sm font-medium ${
                      index === folderPath.length - 1 ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {folder.name}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search exams..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ActionButtons
            folderId={currentFolderId}
            folderName={currentFolderName || "ראשי"}
            openModal={openModal}
            modalData={modalData}
          />
        </div>
      </div>

      {/* {folderPath.length > 0 && (
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          <ChevronUp className="w-4 h-4 mr-1" />
          Back
        </button>
      )} */}

      {error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      ) : (
        <ExamsTable
          exams={filteredExams}
          folders={filteredFolders}
          loading={loading}
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
          currentFolderName={currentFolderName}
          setCurrentFolderName={setCurrentFolderName}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
        />
      )}

      <ModalWrapper
        open={isOpen}
        handleClose={closeModal}
        title={modalData?.title || ""}
        onConfirm={modalData?.onConfirm}
        confirmText={modalData?.confirmText}
        initialName={modalData?.initialName}
        setNewName={modalData?.setNewName || (() => {})}
      >
        {modalData?.children}
      </ModalWrapper>
    </div>
  )
}

export default ExamList
