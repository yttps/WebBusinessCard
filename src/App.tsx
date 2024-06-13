import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from '@/Components/Login/Login';

import ListCompany from '@/Components/Admin/ListCompany'; // ตรวจสอบการ import
import ListHr from '@/Components/Company/ListHr';
import ListGeneralUser from '@/Components/Admin/ListGeneralUser';
import ListEmployees from '@/Components/Employees/ListEmployees'
import DetailCompany from '@/Components/Admin/DetailCompany';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/ListCompany" element={<ListCompany />} />
        <Route path="/ListHr" element={<ListHr />} />
        <Route path="/ListGeneralUser" element={<ListGeneralUser />} />
        <Route path="/ListEmployees" element={<ListEmployees />} />
        <Route path="/ListCompany/:id" element={<DetailCompany />} />

      </Routes>
    </>
  )
}

export default App;
