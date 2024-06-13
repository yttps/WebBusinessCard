import { useState, useEffect } from 'react'
import AddCompany from '@/Components/Admin/AddCompany';
import Header from '@/Components/Header/Header';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
// import ListGeneralUser from './ListGeneralUser';
import { GetAllCompany } from '@/Model/GetAllCompany';
import { NavLink } from 'react-router-dom';

export default function ListCompany() {

    const [searchQuery, setSearchQuery] = useState('');
    const [dataCompany, setDataCompany] = useState<GetAllCompany[]>([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const companyApi = new CompanyApi();

    // async function getCompany() {
        // const res = await companyApi.GetAllCompany();
        // setDataCompany(res);

    // }

    const viewDetailCompany = async (id: string) => {

        console.log('id', id);
    };

    useEffect(() => {

        // getCompany();

        const getCompany = async () => {

            try {
                const res = await companyApi.GetAllCompany();
                setDataCompany(res);
            } catch (error) {
                console.error('Error fetching general users:', error);
            }
        }

        getCompany();
    }, [companyApi]);

    return (
        <>
            <Header />
            <br />
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>
                        รายชื่อบริษัท
                    </p>
                    <AddCompany />
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
                    {/* <Button variant="primary" onClick={linktocomponent}>บุคคลทั่วไป</Button> */}
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
                            {dataCompany.map((item: GetAllCompany, index: number) => (
                                <tr key={index}>
                                    <td id={`idCompany${index}`}></td>
                                    <td id={`nameCompany${index}`}>{item.name}</td>
                                    <td id={`abbreviationCompany${index}`}>{item.abbreviation}</td>
                                    <td id={`businesTypeCompany${index}`}>{item.businessType}</td>
                                    <td id={`websiteCompany${index}`}>{item.website}</td>
                                    <td id='btnEdit'>
                                        <NavLink to={`/ListCompany/${item.id}`}>
                                            <Button variant="warning" onClick={() => viewDetailCompany(item.id)}>
                                                แสดงข้อมูล
                                            </Button>
                                        </NavLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}