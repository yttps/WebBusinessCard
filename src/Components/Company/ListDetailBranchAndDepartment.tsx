import { GetCompanyBranchesById } from "@/Model/GetCompanyBranchesById";
import { GetDepartmentByComId } from "@/Model/GetDepartmentByComId";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CompanyApi } from "@/ApiEndpoints/CompanyApi";
import Header from "../Header/Header";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import AddCompanyBranch from "./AddCompanyBranch";
import AddDepartment from "./AddDepartment";
import AddHr from "./AddHr";

export default function ListDetailBranchAndDepartment() {

  const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
  const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
  const [isFetch, setIsFetch] = useState(false);
  const companyapi = useMemo(() => new CompanyApi(), []);
  const nav = useNavigate();

  // const [selectedDateRange, setSelectedDateRange] = useState<string>('Last 30 days');
  // const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  // State for Departments
  const [currentPageDepartments, setCurrentPageDepartments] = useState<number>(1);
  const itemsPerPageDepartments = 5;
  const indexOfLastItemDepartments = currentPageDepartments * itemsPerPageDepartments;
  const indexOfFirstItemDepartments = indexOfLastItemDepartments - itemsPerPageDepartments;
  const currentItemsDepartments = dataDepartmentById.slice(indexOfFirstItemDepartments, indexOfLastItemDepartments);
  const totalPagesDepartments = Math.ceil(dataDepartmentById.length / itemsPerPageDepartments);

  // State for Branches
  const [currentPageBranches, setCurrentPageBranches] = useState<number>(1);
  const itemsPerPageBranches = 5;
  const indexOfLastItemBranches = currentPageBranches * itemsPerPageBranches;
  const indexOfFirstItemBranches = indexOfLastItemBranches - itemsPerPageBranches;
  const currentItemsBranches = dataBranchesById.slice(indexOfFirstItemBranches, indexOfLastItemBranches);
  const totalPagesBranches = Math.ceil(dataBranchesById.length / itemsPerPageBranches);

  const getCompanyBranchById = useCallback(async (CompanyId: string) => {
    const res = await companyapi.getCompanyBranchById(CompanyId);
    setDataBranchesById(res);
  }, [companyapi]);

  const GetDepartmentByCompanyId = useCallback(async (CompanyId: string) => {
    const res = await companyapi.getDepartmentByCompanyId(CompanyId);
    setDataDepartmentById(res);
  }, [companyapi]);

  async function handleDeleteDepartment(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, departmentId: string) {
    e.preventDefault();
    console.log('departmentId', departmentId);

    const result = await Swal.fire({
      title: 'ลบข้อมูล?',
      text: 'ยืนยันเพื่อทำการลบข้อมูล!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {

      const res = await companyapi.deleteDepartment(departmentId);

      if (res == 200) {
        await Swal.fire({
          title: 'Success!',
          text: 'ลบแผนกสำเร็จ!',
          icon: 'success'
        }).then(() => {
          nav('/ListDetailBranchAndDepartment');
          window.location.reload();
        });
      }
    }


  }

  async function handleDeleteBranch(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, branchId: string) {
    e.preventDefault();

    console.log('branchId', branchId);
    console.log('len', dataBranchesById.length);

    if (dataBranchesById.length <= 1) {

      Swal.fire({
        title: 'Error!',
        text: 'ต้องมีสาขาบริษัทอย่างน้อย 1 สาขา!',
        icon: 'error',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'ลบข้อมูล?',
      text: 'ยืนยันเพื่อทำการลบข้อมูล!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {

      const res = await companyapi.deleteBranch(branchId);

      if (res == 200) {
        await Swal.fire({
          title: 'Success!',
          text: 'ลบสาขาบริษัทสำเร็จ!',
          icon: 'success',
        }).then(() => {
          nav('/ListDetailBranchAndDepartment');
          window.location.reload();
        });

      }
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

  }, [isFetch, GetDepartmentByCompanyId, getCompanyBranchById])

  console.log('branch', dataBranchesById);
  console.log('department', dataBranchesById);

  // const toggleDropdown = () => {
  //   setDropdownVisible(!dropdownVisible);
  // };

  // const handleDateRangeChange = (range: string) => {
  //   setSelectedDateRange(range);
  //   setDropdownVisible(false);
  // };

  const handleClickDepartments = (pageNumber: number) => {
    setCurrentPageDepartments(pageNumber);
  };

  const handleClickBranches = (pageNumber: number) => {
    setCurrentPageBranches(pageNumber);
  };

  function handleToListHr() {
    nav('/ListHr');
  }

  return (
    <>
      <Header />
      <br />
      <Row>
        <Col xs={2} style={{ height: '100wh' }}>
          <hr />
          <div className="h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <a>
                  <AddHr isFetch={isFetch} setIsFetch={setIsFetch} />
                </a>
              </li>
              <li>
                <div onClick={handleToListHr} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">ข้อมูลพนักงานฝ่ายบุคคล</span>
                </div>
              </li>
              <li>
                <AddCompanyBranch />
              </li>
              <li>
                <AddDepartment />
              </li>
            </ul>
          </div>
        </Col>
        <Col xs={10}>
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
            <div>
              <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">แผนกบริษัท</label>
              <br />
              {dataDepartmentById.length > 0 ? (
                <>
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Department name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Department phone
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsDepartments.map((department: GetDepartmentByComId, index: number) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-6 py-4">{department.name}</td>
                          <td className="px-6 py-4">{department.phone}</td>
                          <td>
                            <button
                              className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg"
                              onClick={(e) => handleDeleteDepartment(e, department.id)}
                              type='submit'
                            >
                              ลบข้อมูลแผนก
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                          <button
                            onClick={() => handleClickDepartments(currentPageDepartments - 1)}
                            disabled={currentPageDepartments === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPagesDepartments)].map((_, i) => (
                          <li key={i}>
                            <button
                              onClick={() => handleClickDepartments(i + 1)}
                              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPageDepartments === i + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300'} hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => handleClickDepartments(currentPageDepartments + 1)}
                            disabled={currentPageDepartments === totalPagesDepartments}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                    <br />
                  </div>
                </>
              ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <p>Not Found Departments.</p>
                </div>
              )}
            </div>

            <br />
            <hr />
            <br />

            <div>
              <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-white">สาขาบริษัท</label>
              <br />
              {dataBranchesById.length > 0 ? (
                <>
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          CompanyBranch name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Address name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItemsBranches.map((branch: GetCompanyBranchesById, index: number) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-6 py-4">{branch.name}</td>
                          <td className="px-6 py-4">{branch.address}</td>
                          <td>
                            <button
                              className="bg-red-500 text-red-50 hover:bg-red-600 py-2 px-4 rounded-lg"
                              onClick={(e) => handleDeleteBranch(e, branch.id)}
                              type='submit'
                            >
                              ลบข้อมูลสาขา
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div>
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                      <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                          <button
                            onClick={() => handleClickBranches(currentPageBranches - 1)}
                            disabled={currentPageBranches === 1}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            Previous
                          </button>
                        </li>
                        {[...Array(totalPagesBranches)].map((_, i) => (
                          <li key={i}>
                            <button
                              onClick={() => handleClickBranches(i + 1)}
                              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPageBranches === i + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300'} hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => handleClickBranches(currentPageBranches + 1)}
                            disabled={currentPageBranches === totalPagesBranches}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                    <br />
                  </div>
                </>
              ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <p>Not Found Branches.</p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );


}