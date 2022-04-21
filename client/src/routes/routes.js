import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import CodeVerification from '../pages/CodeVerification';
import Home from '../pages/Home';

function routes() {

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login/>} />
                <Route path='/confirm' element={<CodeVerification/>} />
                <Route path='/home' element={<Home/>} />
                <Route path="*" element={<Navigate to ="/" />} />
            </Routes>
        </Router>
    );
}

export default routes