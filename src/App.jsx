import React from 'react';
import HomePage from './components/HomePage.jsx';
import Sidebar from './components/Sidebar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    return (
        // <div style={{ display: 'flex' }}>
        //     <Sidebar /> {/* Sidebar on the left */}
        //     <div style={{ marginLeft: '200px', padding: '20px', flexGrow: 1 }}> {/* Main content area */}
        //         <HomePage />
        //     </div>
        // </div>
        <HomePage/>
    );
};

export default App;
