import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './home'
import Dashboard from './dashboard'
import EditResume from './dashboard/resume/[resumeId]/edit'
import ViewResume from './my-resume/[resumeId]/view'
import { Toaster } from 'sonner'
import Header from './components/custom/Header'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/resume/:resumeId/edit" element={<EditResume />} />
        <Route path="/my-resume/:resumeId/view" element={<ViewResume />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App
