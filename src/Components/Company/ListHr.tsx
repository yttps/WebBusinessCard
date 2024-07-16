import { useState, useEffect } from 'react';
import Header from '@/Components/Header/Header';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { HrApi } from '@/ApiEndpoints/HrApi';
import { GetAllHrByCompanyId } from '@/Model/GetAllHR';
import { NavLink , useNavigate } from 'react-router-dom';
import AddHr from './AddHr';
import AddCompanyBranch from './AddCompanyBranch';
import AddDepartment from './AddDepartment';

export default function ListHr() {

    const [searchQuery, setSearchQuery] = useState('');
    const [dataHr, setDataHr] = useState<GetAllHrByCompanyId[]>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isFetch , setIsFetch] = useState(false);
    const nav = useNavigate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const hrapi = new HrApi();

    function handleToListBranchAndDepartment(){
        nav('/ListDetailBranchAndDepartment');
    }

    const getHr = async () => {
        try {
            const res = await hrapi.GetAllHrByCompanyId();

            if (res) {
                setDataHr(res);
                console.log('get all data hr by company id', dataHr);
                setDataFetched(true);
                setHasError(false);
            }
        } catch (error) {
            console.error('Error fetching general users:', error);
            setHasError(true);
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
                <AddHr isFetch={isFetch} setIsFetch={setIsFetch}/>
                <Button variant="success" onClick={handleToListBranchAndDepartment}>สาขาบริษัทและแผนก</Button>
                <AddCompanyBranch />
                <AddDepartment />
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
                                    {filteredData.map((item: GetAllHrByCompanyId, index: number) => (
                                        <tr key={index}>
                                            <td id={`idCompany${index}`}></td>
                                            <td id={`nameCompany${index}`}>{item.firstname}</td>
                                            <td id={`abbreviationCompany${index}`}>{item.lastname}</td>
                                            <td id={`businesTypeCompany${index}`}>{item.position}</td>
                                            <td id={`websiteCompany${index}`}>{item.email}</td>
                                            <td id={`btnEdit`}>
                                                {typeof window !== 'undefined' && (
                                                    <NavLink to={`/ListHr/${item.id}`}>
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
