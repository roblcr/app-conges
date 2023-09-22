import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PanelAdmin from './components/Admin/PanelAdmin';
import Login from './components/Login';
import CongeCalendar from './components/CongesCalendar';


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/admin' Component={PanelAdmin} />
          <Route exact path='/login' Component={Login} />
          <Route exact path='/' Component={CongeCalendar} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
