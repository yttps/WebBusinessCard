import { GetCompanyBranchesById } from "@/Model/GetCompanyBranchesById";
import { GetDepartmentByComId } from "@/Model/GetDepartmentByComId";
import { useState, useEffect } from "react";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";
import { Table, Button } from 'react-bootstrap';
import Header from "../Header/Header";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function ListDetailBranchAndDepartment() {

  const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
  const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
  const [isFetch, setIsFetch] = useState(false);
  const companyapi = new CompanyApi();
  const nav = useNavigate();

  async function getCompanyBranchById(CompanyId: string) {
    const res = await companyapi.getCompanyBranchById(CompanyId);
    setDataBranchesById(res);
    setIsFetch(true);
  }

  async function GetDepartmentByCompanyId(CompanyId: string) {
    const res = await companyapi.getDepartmentByCompanyId(CompanyId);
    setDataDepartmentById(res);
    setIsFetch(true);
  }

  async function handleDeleteDepartment(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, departmentId: string) {
    e.preventDefault();
    console.log('departmentId', departmentId);

    const res = await companyapi.deleteDepartment(departmentId);

    if (res == 200) {
      Swal.fire({
        title: 'Success!',
        text: 'ลบสาขาบริษัทสำเร็จ!',
        icon: 'success'
      });

      nav('/ListHr', { replace: true });
    }

  }

  async function handleDeleteBranch(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, branchId: string) {
    e.preventDefault();
    console.log('branchId', branchId);

    const res = await companyapi.deleteBranch(branchId);

    if (res == 200) {

      Swal.fire({
        title: 'Success!',
        text: 'ลบสาขาบริษัทสำเร็จ!',
        icon: 'success',
      });

      nav('/ListHr', { replace: true });
    }
  }

  useEffect(() => {

    if (!isFetch) {
      const loggedInData = localStorage.getItem("LoggedIn");

      if (loggedInData) {
        const parsedData = JSON.parse(loggedInData);
        const companyId = parsedData.id;

        if (companyId) {
          getCompanyBranchById(companyId);
          GetDepartmentByCompanyId(companyId);
        }
      }
    }

  }, [isFetch])

  console.log('branch', dataBranchesById);
  console.log('department', dataBranchesById);


  return (
    <>
      <Header />
      <div className="container">
        <Table striped bordered hover variant="write">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataDepartmentById.length > 0 ? (
              dataDepartmentById.map((department: GetDepartmentByComId, index: number) => (
                <tr key={index}>
                  <td>Department Name: {department.name}</td>
                  <td>
                    <Button variant="danger" onClick={(e) => handleDeleteDepartment(e, department.id)}>ลบข้อมูลแผนก</Button>

                  </td>
                </tr>
              ))
            ) : (
              <p>No departments found.</p>
            )}
          </tbody>
        </Table>

        <hr />

        <Table striped bordered hover variant="write">
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>Address Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataBranchesById.length > 0 ? (
              dataBranchesById.map((branch: GetCompanyBranchesById, index: number) => (
                <tr key={index}>
                  <td>{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>
                    <Button variant="danger" onClick={(e) => handleDeleteBranch(e, branch.id)}>ลบข้อมูลสาขา</Button>

                  </td>
                </tr>
              ))
            ) : (
              <p>No branches found.</p>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}