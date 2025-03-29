import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import ExamList from './components/Exams/ExamList';
import AuthForm from './components/Auth/AuthForm';
import Exams from './pages/Exams';
import Home from './pages/home';
import Profile from './pages/Profile';
import StudentsExams from './components/StudentsExams';
import ExamFileViewer from './components/Exams/ExamFileViewer';


export const router = createBrowserRouter([
    // { path: '/authForm', element: <AuthForm /> },
    {

        path: '/',
        element: <AppLayout />,
        // errorElement:
        
        children: [
            { path: '/authForm', element: <AuthForm /> },
            { path: '/', element: <Home /> },
            { path: '/home', element: <Home /> },
            { path: '/about', element: <About /> },
            {
                path: '/exams',
                element: <Exams />,
                children: [
                    { path: '', element: <ExamList /> },
                    { path: 'students-exams', element: <StudentsExams /> } 
                    
                ],
            },
           
            { path: '/viewExam', element: <ExamFileViewer /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/profile', element: <Profile /> },
        ],
    },
])