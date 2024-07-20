import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from '@/Components/Login/Login';
import Register from '@/Components/Register/Register';

import ListCompany from '@/Components/Admin/ListCompany'; // ตรวจสอบการ import
import ListHr from '@/Components/Company/ListHr';
import ListGeneralUser from '@/Components/Admin/ListGeneralUser';
import ListEmployees from '@/Components/Employees/ListEmployees'
import DetailCompany from '@/Components/Admin/DetailCompany';
import CreateCard from './Components/Employees/CreateCard';
import CreateTemplate from './Components/Employees/CreateTemplate';
import AddDepartment from './Components/Company/AddDepartment';
import AddCompanyBranch from './Components/Company/AddCompanyBranch';
import DetailHr from './Components/Company/DetailHr';
import DetailEmployees from './Components/Employees/DetailEmployees';
import DetailGeneralUser from './Components/Admin/DetailGeneralUser';
import ListDetailBranchAndDepartment from './Components/Company/ListDetailBranchAndDepartment';
import ApprovalCompany from './Components/Admin/ApprovalCompany';
import DetailCompanyAppproval from './Components/Admin/DetailCompanyAppproval';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path="/ListCompany" element={<ListCompany />} />
        <Route path="/ListHr" element={<ListHr />} />
        <Route path="/ListGeneralUser" element={<ListGeneralUser />} />
        <Route path="/ListEmployees" element={<ListEmployees />} />
        <Route path="/ListCompany/:id" element={<DetailCompany />} />
        <Route path="/CreateTemplate" element={<CreateTemplate />} />
        <Route path="/AddDepartment" element={<AddDepartment />} />
        <Route path="/AddCompanyBranch" element={<AddCompanyBranch />} />
        <Route path="/ListHr/:id" element={<DetailHr />} />
        <Route path="/ListEmployees/:id" element={<DetailEmployees />} />
        <Route path="/CreateCard" element={<CreateCard />} />
        <Route path="/ListGeneralUser/:id" element={<DetailGeneralUser />} />
        <Route path="/ListDetailBranchAndDepartment" element={<ListDetailBranchAndDepartment />} />
        <Route path="/ApprovalCompany" element={<ApprovalCompany />} />
        <Route path="/ApprovalCompany/:id" element={<DetailCompanyAppproval />} />

      </Routes>
    </>
  )
}

export default App;
