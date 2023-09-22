import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PanelAdmin from './components/Admin/PanelAdmin';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'; // Utilisez getDoc au lieu de getDocs
import { db } from './firebase';


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/admin' Component={PanelAdmin} />
          <Route exact path='/login' Component={Login} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
