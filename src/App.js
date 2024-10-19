import './App.css';
import{BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './Pages/Home';
import AddEditUser from './Pages/AddEditUser';
import Nav from './Components/nav';
import Login from './Pages/Login';
import About from './Pages/About';
import NavBar from './Components/NavBar';  // Adjust the path if necessary


function App() {
  return (
    <BrowserRouter>
    <div className='App'>
      <Nav />
      <NavBar />
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/add' element={<AddEditUser/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/update/:id' element={<AddEditUser/>} />
    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
