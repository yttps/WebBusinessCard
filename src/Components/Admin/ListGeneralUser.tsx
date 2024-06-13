import React , { useEffect, useState }from 'react'
import Header from '../Header/Header'
import { GeneralUserApi } from '@/ApiEndpoints/GeneralUserApi';
import { Button, InputGroup, Form , Table } from 'react-bootstrap';
import ListCompany from './ListCompany';

function ListGeneralUser() {

    const [searchQuery, setSearchQuery] = useState('');
    const generalUserApi = new GeneralUserApi();

    // const filteredData = data.filter((item: Detail_GeneralUser) => {
    //     // Check if item and item.name are defined before calling toLowerCase()
    //     return item && item.firstname && item.firstname.toLowerCase().includes(searchQuery.toLowerCase());
    // });

    async function getAllGeneralUser() {
        
        const res = generalUserApi.GetAllGeneralUser();
        console.log(res);

    }

    useEffect(() =>{
        getAllGeneralUser();
    } , []);

    return (
        <>
            <Header />
            <br />
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>
                        รายการบุคคลทั่วไป
                    </p>
                    {/* <Button variant="success">Success</Button> */}
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
                {/* <div id='general-btn'>
                        <Button variant="primary" onClick={linktocomponent}>บริษัท</Button>
                    </div> */}
                <br />
                <div id='tableCon2'>
                    <Table striped bordered hover variant="write">
                        <thead>
                            <tr>
                                <th>ชื่อผู้ใช้</th>
                                <th>Email</th>
                                <th>เบอร์โทรศัพท์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {filteredData && filteredData.map((item: Detail_GeneralUser, index: number) => {
                                const { id } = item;
                                return (
                                    <tr key={index}>
                                        <td>{item.firstname}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>
                                            <NavLink to={`/ListGeneralUser/${item.firstname}`}>
                                                <Button variant="warning" onClick={() => viewDetailGeneralUser(id)}>ดูรายละเอียด</Button>
                                            </NavLink>
                                        </td>
                                    </tr>
                                )
                            })} */}
                        </tbody>
                    </Table>
                </div>
            </div>

        </>
    )
}

export default ListGeneralUser