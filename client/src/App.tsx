import {Route, Routes} from 'react-router-dom'
import LibraryPage from './LibraryPage.tsx'
import EditBookPage from './EditBookPage.tsx'


function App() {
    return (
        <Routes>
            <Route path="/" element={<LibraryPage/>}/>
            <Route path="/edit/:bookId" element={<EditBookPage/>}/>
        </Routes>
    )
}

export default App
