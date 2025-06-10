import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';


import ListPage from "./components/ListPage";
import NoPage from "./components/NoPage";


// change <ListPage/> components to <ListPage_v2/> to connect w/ backend
// this needs to get deleted later
import ListPage_v2 from "./components/ListPage_v2";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListPage_v2/>}/>
        <Route path="/:activeListId" element={<ListPage_v2 />}/>
        <Route path="*" element={<NoPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
