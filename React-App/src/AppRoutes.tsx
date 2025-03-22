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
           
            { path: '/viewExam', element: <ExamFileViewer fileName={''} fileUrl={'https://storage.cloud.google.com/exams-bucket/46341d91-e28b-4779-9a7c-26ba3f88e8ae.png'} /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/profile', element: <Profile /> },
        ],
    },
])