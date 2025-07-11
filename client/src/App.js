import { fetchallusers } from './action/users';
import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './Comnponent/Navbar/navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Allroutes from './Allroutes';
import { useDispatch } from 'react-redux';
import { fetchallquestion } from './action/question';
import Profile from './Comnponent/Profile/Profile'; // <-- Import Profile

function App() {
  const [slidein, setslidein] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchallusers());
    dispatch(fetchallquestion());
  }, [dispatch]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setslidein(false);
    }
  }, []);

  const handleslidein = () => {
    if (window.innerWidth <= 768) {
      setslidein((state) => !state);
    }
  };
  return (
    <div className="App">
      <Router>
        <Navbar handleslidein={handleslidein} />
        <Routes>
          <Route path="/profile" element={<Profile />} />
          {/* Render all your other routes */}
          <Route path="/*" element={<Allroutes slidein={slidein} handleslidein={handleslidein} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;