import { useState, useEffect } from 'react'
import AddCompany from '@/Components/Admin/AddCompany';
import Header from '@/Components/Header/Header';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetAllCompany } from '@/Model/GetAllCompany';
import { Link, NavLink } from 'react-router-dom';

export default function ListCompany() {

    const [searchQuery, setSearchQuery] = useState('');
    const [dataCompany, setDataCompany] = useState<GetAllCompany[]>([]);
    const [dataFetched, setDataFetched] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const companyApi = new CompanyApi();

    const getCompany = async () => {
        try {
            const res = await companyApi.GetAllCompany();
            setDataCompany(res);
            setDataFetched(true);

        } catch (error) {
            console.error('Error fetching general users:', error);
        }
    }

    const filteredData = dataCompany.filter((company) =>
        company?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (!dataFetched) {
            getCompany();
            console.log('get data com', dataCompany);
        }
    }, [dataFetched]);

    return (
        <>
            <Header />
            <br />
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>รายชื่อบริษัท</p>
                    <AddCompany />
                    <Link to="/ListGeneralUser">
                        <Button variant="primary">บุคคลทั่วไป</Button>
                    </Link>
                    <br />
                    <Link to="/ApprovalCompany">
                        <Button variant="primary">รายการรออนุมัติบริษัท</Button>
                    </Link>
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
                <div id='general-btn'></div>
                <br />
                <div id='tableCon2'>
                    {filteredData.length > 0 ? (
                        <Table striped bordered hover variant="write">
                            <thead>
                                <tr>
                                    <th>no.</th>
                                    <th>ชื่อบริษัท</th>
                                    <th>ชื่อย่อบริษัท</th>
                                    <th>ประเภทธุรกิจ</th>
                                    <th>เว็บไซต์</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item: GetAllCompany, index: number) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.abbreviation}</td>
                                        <td>{item.businessType}</td>
                                        <td>{item.website}</td>
                                        <td>
                                            {typeof window !== 'undefined' && (
                                                <NavLink to={`/ListCompany/${item.id}`}>
                                                    <Button variant="warning">แสดงข้อมูล</Button>
                                                </NavLink>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>Not found data company</p>
                    )}
                </div>
            </div>
        </>
    );
}