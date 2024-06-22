import { useState, useEffect } from 'react';
import Header from '@/Components/Header/Header';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { HrApi } from '@/ApiEndpoints/HrApi';
import { GetAllHR } from '@/Model/GetAllHR';
import { NavLink } from 'react-router-dom';
import AddHr from './AddHr';
import AddCompanyBranch from './AddCompanyBranch';

export default function ListHr() {

    const [searchQuery, setSearchQuery] = useState('');
    const [dataHr, setDataHr] = useState<GetAllHR[]>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [hasError, setHasError] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const hrapi = new HrApi();

    const getHr = async () => {
        try {
            const res = await hrapi.GetAllHr(); //get user from companyid and companybranch
            setDataHr(res);
            console.log('get all data hr by company id', dataHr);
            setDataFetched(true);
            setHasError(false); // Reset error state on successful fetch
        } catch (error) {
            console.error('Error fetching general users:', error);
            setHasError(true); // Set error state on failure
        }
    }

    const filteredData = dataHr.filter((Hr) =>
        Hr.firstname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (!dataFetched) {
            getHr();
        }
    }, [dataFetched]);

    return (
        <>
            <Header />
            <br />
            <div id='con1' className="container">
                <div id='headerCon1'>
                    <p>รายชื่อพนักงานฝ่ายบุคคล</p>
                </div>
                 <AddHr/>
                 <AddCompanyBranch />
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
                    {hasError ? (
                        <p>Not found data HR</p>
                    ) : (
                        filteredData.length > 0 ? (
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
                                    {filteredData.map((item: GetAllHR, index: number) => (
                                        <tr key={index}>
                                            <td id={`idCompany${index}`}></td>
                                            <td id={`nameCompany${index}`}>{item.firstname}</td>
                                            <td id={`abbreviationCompany${index}`}>{item.lastname}</td>
                                            <td id={`businesTypeCompany${index}`}>{item.position}</td>
                                            <td id={`websiteCompany${index}`}>{item.email}</td>
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
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p>Not found data HR</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
