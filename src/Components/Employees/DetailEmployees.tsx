import { useEffect, useState, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { GetEmployeeById } from '@/Model/GetEmployeeById';
import Header from '../Header/Header';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { GetCompanyBranchesById } from '@/Model/GetCompanyBranchesById';
import { GetDepartmentByComId } from '@/Model/GetDepartmentByComId';
import { HrApi } from '@/ApiEndpoints/HrApi';
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';


export default function DetailEmployees() {

    const { id: employeesId } = useParams();
    const employeesapi = new EmployeesApi();
    const [dataemployeesById, setDataEmployeesById] = useState<GetEmployeeById | null>(null);
    const [dataBranchesById, setDataBranchesById] = useState<GetCompanyBranchesById[]>([]);
    const [dataDepartmentById, setDataDepartmentById] = useState<GetDepartmentByComId[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();
    const [update, setUpdate] = useState(false);
    const [genderValue, setGenderValue] = useState('');
    const [departmentValue, setDepartmentValue] = useState('');
    const [branchValue, setBranchValue] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const hrapi = new HrApi();
    const [isFetch, setIsFetch] = useState(false);
    const companyapi = new CompanyApi();
    const employeeapi = new EmployeesApi();

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

    function handleUpdate() {

        if (update == true) {
            setUpdate(false);
        }
        if (update == false) {
            setUpdate(true);
        }
    }

    const [imageData] = useState({
        base64textString: '',
        imageName: '',
        showImage: false,
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleDepartment = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setDepartmentValue(e.target.value);
    };

    const handleBranches = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setBranchValue(e.target.value);
    };

    const handleGender = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setGenderValue(e.target.value);
    };

    const fetchData = async () => {

        try {

            if (employeesId) {

                const resGetdataDetail = await employeesapi.GetDatadataemployeesById(employeesId);
                setDataEmployeesById(resGetdataDetail);
                setIsLoading(true);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    const DeleteEmployeeData = async (): Promise<void> => {

        if (!dataemployeesById) return;

        try {
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
                const response = await employeesapi.DeleteEmployee(dataemployeesById.id); //bug origin

                if (response == 200) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });
                    nav('/ListEmployees', { replace: true });
                }
            }
        } catch (error) {
            console.error('Error deleting general user:', error);
            await Swal.fire({
                title: 'Error!',
                text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                icon: 'error',
            });
        }
    }

    async function SaveDetails(e: React.FormEvent<HTMLFormElement>, EMId: string) {

        try {

            e.preventDefault();
            const firstnameElement = document.getElementById('firstnameEdit') as HTMLInputElement;
            const lastnameElement = document.getElementById('lastnameEdit') as HTMLInputElement;
            const positionElement = document.getElementById('positionEdit') as HTMLInputElement;
            const birthdayElement = document.getElementById('birthdayEdit') as HTMLInputElement;
            const startworkElement = document.getElementById('startworkEdit') as HTMLInputElement;
            const subdistrictElement = document.getElementById('subdistrictEdit') as HTMLInputElement;
            const districtElement = document.getElementById('districtEdit') as HTMLInputElement;
            const provinceElement = document.getElementById('provinceEdit') as HTMLInputElement;
            const countryElement = document.getElementById('countryEdit') as HTMLInputElement;
            const telElement = document.getElementById('telEdit') as HTMLInputElement;
            const emailElement = document.getElementById('emailEdit') as HTMLInputElement;
            const passwordElement = document.getElementById('passwordEdit') as HTMLInputElement;

            const formEdit = {
                firstname: firstnameElement.value,
                lastname: lastnameElement.value,
                position: positionElement.value,
                gender: genderValue,
                birthdate: birthdayElement.value,
                startwork: startworkElement.value,
                subdistrict: subdistrictElement.value,
                district: districtElement.value,
                province: provinceElement.value,
                country: countryElement.value,
                phone: telElement.value,
                email: emailElement.value,
                password: passwordElement.value,
                branch: branchValue,
                department: departmentValue,
                EMId: EMId,
                file: file
            }

            const allValuesNotNull = Object.values(formEdit).every(value => value !== null && value !== '');
            const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            const phoneRegex = /^\d+$/;

            if (!allValuesNotNull) {
                Swal.fire({
                    title: 'Error!',
                    text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
                    icon: 'error',
                });
                return;
            }

            if (passwordElement.value.length < 6) {
                Swal.fire({
                    title: 'Error!',
                    text: 'กำหนดรหัสผ่านอย่างน้อย 6 ตัว!',
                    icon: 'error',
                });
                return;
            }
            if (!emailRegex.test(emailElement.value)) {
                Swal.fire({
                    title: 'Add Data Error!',
                    text: 'อีเมลต้องมี "@" และ ".com"',
                    icon: 'error',
                });
                return;
            }
            if (!phoneRegex.test(telElement.value)) {
                Swal.fire({
                    title: 'Add Data Error!',
                    text: 'ต้องใส่เบอร์โทรเป็นตัวเลขเท่านั้น',
                    icon: 'error',
                });
                return;
            }

            const resUpdateData = await employeeapi.updateDataEmployee(
                firstnameElement.value, lastnameElement.value, positionElement.value, genderValue, birthdayElement.value, startworkElement.value,
                subdistrictElement.value, districtElement.value, provinceElement.value, countryElement.value, telElement.value, emailElement.value,
                branchValue, departmentValue, passwordElement.value, EMId
            );

            if (resUpdateData == 200 && file) {

                const folderName = '';
                const collection = 'users';
                const resUploadLogo = await hrapi.UploadProfile(file, EMId, folderName, collection);

                if (resUploadLogo == 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'อัปเดทข้อมูลสำเร็จ!',
                        icon: 'success',
                    });

                    nav('/ListEmployees', { replace: true });
                }
            }
            else {

                Swal.fire({
                    title: 'Error!',
                    text: 'อัปเดทข้อมูลไม่สำเร็จ!',
                    icon: 'error',
                });

                return;
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {

        if (!isLoading) {
            fetchData();
        }

    }, [employeesId]);

    useEffect(() => {

        if (!isFetch) {
            const loggedInData = localStorage.getItem("LoggedIn");

            if (loggedInData) {
                const parsedData = JSON.parse(loggedInData);
                const CompanyId = parsedData.companyId;

                if (CompanyId) {
                    getCompanyBranchById(CompanyId);
                    GetDepartmentByCompanyId(CompanyId);
                }
            }
        }

    }, [isFetch]);

    if (update) {
        return (
            <>
                <Header />
                <br />
                <div id='con3' className="container">
                    {dataemployeesById ? (
                        <form onSubmit={(e) => SaveDetails(e, dataemployeesById.id)}>
                            <div className="col1">
                                <h4>Profile</h4>
                                <br />
                                <hr />
                                <div id="header">
                                    <h6>ชื่อ:</h6>
                                    <input type='text' id="firstnameEdit" placeholder={dataemployeesById.firstname} required></input>
                                    <br />
                                    <h6>นามสกุล:</h6>
                                    <input id="lastnameEdit" type='text' placeholder={dataemployeesById.lastname} required></input>
                                    <br />
                                    <h6>ตำแหน่ง:</h6>
                                    <input id="positionEdit" type='text' placeholder={dataemployeesById.position} required></input>
                                </div>

                            </div>
                            <div className="col2">
                                <h4>รายละเอียด HR </h4>
                                <br />
                                <hr />
                                <div id="col2-1">
                                    <Row>
                                        <Col>
                                            <h5 >เพศ</h5>
                                            <Form.Select aria-label="เลือกเพศ" onChange={handleGender} value={genderValue}>
                                                <option value="">เลือกเพศ</option>
                                                <option value="male">ชาย</option>
                                                <option value="female">หญิง</option>
                                            </Form.Select>
                                            <br />
                                            <h5>วันเกิด</h5>
                                            <input type='datetime-local' id="birthdayEdit" placeholder={dataemployeesById.birthdate} required></input>
                                            <br />
                                            <h5>วันที่เริ่มงาน</h5>
                                            <input type='datetime-local' id="startworkEdit" placeholder={dataemployeesById.startwork} required></input>
                                            <br />
                                            <h5>ตำบล</h5>
                                            <input id="subdistrictEdit" type='text' placeholder="Subdistrict" required></input>
                                            <br />
                                            <h5>อำเภอ</h5>
                                            <input id="districtEdit" type='text' placeholder="District" required></input>
                                            <br />
                                            <h5>จังหวัด</h5>
                                            <input id="provinceEdit" type='text' placeholder="Province" required></input>
                                            <br />
                                        </Col>
                                        <Col>
                                            <h5>ประเทศ</h5>
                                            <input id="countryEdit" type='text' placeholder="Country" required></input>
                                            <br />
                                            <h5>เบอร์โทรศัพท์</h5>
                                            <input id="telEdit" type='text' placeholder={dataemployeesById.phone} required></input>
                                            <br />
                                            <h5>สาขาบริษัท</h5>
                                            {dataBranchesById && (
                                                <Form.Select onChange={handleBranches}>
                                                    <option value="">เลือกสาขาบริษัท</option>
                                                    {dataBranchesById.map((item: GetCompanyBranchesById, index: number) => (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            )}
                                            <br />
                                            <h5>แผนก</h5>
                                            {dataDepartmentById && (
                                                <Form.Select onChange={handleDepartment}>
                                                    <option value="">เลือกแผนกบริษัท</option>
                                                    {dataDepartmentById.map((item: GetDepartmentByComId, index: number) => (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            )}
                                            <br />

                                            <div className="container mt-1">
                                                <h4>รูปประจำตัวพนักงาน</h4>
                                                <label>
                                                    <input className="btn btn-primary" type="file" id='selectImg' onChange={handleFileChange} />
                                                </label>
                                                {imageData.showImage && (
                                                    <div>
                                                        <img
                                                            src={imageData.base64textString}
                                                            alt={imageData.imageName}
                                                            style={{ maxWidth: '100%' }} />
                                                    </div>
                                                )}
                                                <br />
                                            </div>
                                        </Col>
                                        <Col>
                                            <h5>Email</h5>
                                            <input id="emailEdit" type='text' placeholder={dataemployeesById.email} required></input>
                                            <br />
                                            <h5>password</h5>
                                            <input id="passwordEdit" type='text' placeholder={dataemployeesById.password} required></input>
                                        </Col>
                                    </Row>
                                    <div id="col2-2">
                                        <Button type='submit' variant="success">บันทึก</Button>
                                        <Button variant="danger" onClick={handleUpdate}>ยกเลิก</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </>
        );
    }


    if (!dataemployeesById) {
        return <div>No company data found.</div>;
    }

    return (
        <div>
            <Header />
            <h1>Company Details</h1>
            <p>Name: {dataemployeesById.firstname}</p>
            <p>Email: {dataemployeesById.email}</p>
            <p>Company branch: {dataemployeesById.companybranch.name}</p>
            <p>Department: {dataemployeesById.department.name}</p>
            <p>Address : {dataemployeesById.address}</p>
            <p>Password : {dataemployeesById.password}</p>
            <p>Detail Company : {dataemployeesById.companybranch.company.name}</p>
            <p>Position : {dataemployeesById.position}</p>
            <div>
                <img src={dataemployeesById.profile} alt="" />
            </div>
            <div id="col2-2">
                <Button variant="danger" onClick={DeleteEmployeeData}>ลบข้อมูล</Button>
                <Button variant="warning" onClick={handleUpdate}>แก้ไขข้อมูล</Button>

            </div>

        </div>
    );


}