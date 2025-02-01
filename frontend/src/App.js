import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import VideoProcessor from './components/ViedoProcessor/VideoProcessor'
import Thisability from './components/Thisability';
import PdfProcessor from './components/PdfProcessor/PdfProcessor';
import PdfUpload from './components/PdfProcessor/PdfUpload';
import TranslatePdf from './components/PdfProcessor/TranslatePdf';
import SummarizePdf from './components/PdfProcessor/SummarizePdf';
import QuickQuiz from './components/PdfProcessor/QuickQuiz';
import ChatbotWithPDF from './components/PdfProcessor/ChatbotWithPDF';

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'signin',
          element: <SignIn />
        },
        {
          path: 'signup',
          element: <SignUp />
        },
        {
          path:"youtubeprocessing",
          element:<VideoProcessor/>
        },
        {
          path:"pdfprocessing",
          element:<PdfProcessor/>
        },
        {
          path:"thisability",
          element:<Thisability/>

        },
        {
          path:'pdfupload',
          element:<PdfUpload/>
        },
        {
          path:"translatepdf",
          element:<TranslatePdf/>

        },
        {
          path:"summarizepdf",
          element:<SummarizePdf/>

        },
        {
          path:"quickquiz",
          element:<QuickQuiz/>
        },
        {
          path:"chatbotwithpdf",
          element:<ChatbotWithPDF/>

        },
        {
          path: '',
          element: <Navigate to="home" />
        }
      ]
    }
  ]);
  
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
