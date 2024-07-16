import { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { GeneralUserApi } from '@/ApiEndpoints/GeneralUserApi';
import { InputGroup, Form, Table, Button } from 'react-bootstrap';
import { GetAllGeneralUser } from '@/Model/GetAllGeneralUser';
import { Link, NavLink } from 'react-router-dom';

function ListGeneralUser() {

    const [searchQuery, setSearchQuery] = useState('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const generalUserApi = new GeneralUserApi();
    const [dataFetched, setDataFetched] = useState(false);
    const [dataGeneralUsers, setDataGeneralUsers] = useState<GetAllGeneralUser[]>([]);

    const fetchData = async () => {
        try {
            const response = await generalUserApi.GetAllGeneralUsers(); //get by generalusers not form company
            setDataGeneralUsers(response);
            setDataFetched(true);

            console.log("res general users", dataGeneralUsers);

        } catch (error) {
            console.error('Error fetching general users:', error);
        }
    };

    const filteredData = dataGeneralUsers.filter((generalUsers) =>
        generalUsers?.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (!dataFetched) {
            fetchData();
        }
    }, [dataFetched]);

    return (
        <>
            <Header />
            <br />
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>
                        รายการบุคคลทั่วไป
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
                <Link to="/ListCompany">
                    <Button variant="primary">ข้อมูลบริษัท</Button>
                </Link>
                <br />
                <div id='tableCon2'>
                    {filteredData.length > 0 ? (
                        <Table striped bordered hover variant="write">
                            <thead>
                                <tr>
                                    <th>ชื่อผู้ใช้</th>
                                    <th>Email</th>
                                    <th>เบอร์โทรศัพท์</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData && filteredData.map((item: GetAllGeneralUser, index: number) => (
                                    <tr key={index}>
                                        <td>{item.firstname}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>
                                            {typeof window !== 'undefined' && (
                                                <NavLink to={`/ListGeneralUser/${item.id}`}>
                                                    <Button variant="warning">แสดงข้อมูล</Button>
                                                </NavLink>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Not found data General user</p>
                    )}
                </div>
            </div>

        </>
    )
}

export default ListGeneralUser