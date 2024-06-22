import { useState, useEffect } from 'react'
import Header from '@/Components/Header/Header';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';
import GetAllEmployees from '@/Model/GetAllEmployees';
import { Link , NavLink } from 'react-router-dom';

export default function ListEmployees() {

    const [searchQuery, setSearchQuery] = useState('');
    const [dataEmployees, setDataEmployees] = useState<GetAllEmployees[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const employeesapi = new EmployeesApi();

    const getEmployees = async () => {
        try {
            const res = await employeesapi.GetAllEmployees(); //get user form companyid and companybranch
            setDataEmployees(res);
            setDataFetched(true);
            
        } catch (error) {
            console.error('Error fetching general users:', error);
        }
    }

    // const filteredData = dataEmployees.filter((dataEmployees) =>
    //   dataEmployees.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    useEffect(() => {
        if (!dataFetched) {
          getEmployees();
            console.log('get data com' , dataEmployees);
        }
    }, [dataFetched]);

    return (
        <>
            <Header />
            <br />
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>
                        รายชื่อพนักงาน
                    </p>
                </div>
                <hr />
                <div id='headerCon2'>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="ค้นหาชื่อ..."
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div id='general-btn'>

                </div>
                <br />
                <div id='tableCon2'>
                    <Table striped bordered hover variant="write">
                        <thead>
                            <tr>
                                <th>no.</th>
                                <th>ชื่อบริษัท</th>
                                <th>ชื่อย่อบริษัท</th>
                                <th>ประเภทธุรกิจ</th>
                                <th>เว็บไซต์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {filteredData.map((item: GetAllEmployees, index: number) => (
                                <tr key={index}>
                                    <td id={`idCompany${index}`}></td>
                                    <td id={`nameCompany${index}`}>{item.name}</td>
                                    <td id={`abbreviationCompany${index}`}>{item.abbreviation}</td>
                                    <td id={`businesTypeCompany${index}`}>{item.businessType}</td>
                                    <td id={`websiteCompany${index}`}>{item.website}</td>
                                    <td id={`btnEdit`}>
                                        {typeof window !== 'undefined' && (
                                            <NavLink to={`/ListCompany/${item.id}`}>
                                                <Button variant="warning">
                                                    แสดงข้อมูล
                                                </Button>
                                            </NavLink>
                                        )}
                                    </td>
                                </tr>
                            ))} */}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}