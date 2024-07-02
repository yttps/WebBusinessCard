import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EmployeesApi } from '@/ApiEndpoints/EmployeesApi';
import { GetEmployeeById } from '@/Model/GetEmployeeById';
import Header from '../Header/Header';
import { 
    // Row, Col , 
    
    Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function DetailEmployees() {

    const { id: employeesId } = useParams();
    const employeesapi = new EmployeesApi();

    const [dataemployeesById, setDataEmployeesById] = useState<GetEmployeeById | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();
    console.log(nav , Swal);

    const fetchData = async () => {
        
        try {

            if (employeesId) {

                const resGetdataDetail = await employeesapi.GetDatadataemployeesById(employeesId);

                console.log('get by id', resGetdataDetail);

                setDataEmployeesById(resGetdataDetail);
                setIsLoading(true);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    // const DeleteHrData = async () => {

    //     if (!dataemployeesById) return;

    //     const chk = confirm("ยืนยันเพื่อทำการลบข้อมูล!");

    //     if (chk) {

    //         try {

    //             console.log("com id", dataemployeesById?.id);
    //             const response = await employeesapi.DeleteHr(dataemployeesById.id);

    //             if (response == 200) {
    //                 Swal.fire({
    //                     title: 'Success!',
    //                     text: 'ลบข้อมูลสำเร็จ!',
    //                     icon: 'success',
    //                 });
    //                 nav('ListCompany');
    //             }
    //         } catch (error) {
    //             console.error('Error deleting company:', error);
    //             Swal.fire({
    //                 title: 'Error!',
    //                 text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
    //                 icon: 'error',
    //             });
    //         }
    //     }
    // }

    useEffect(() => {

        if (!isLoading) {
            fetchData();
        }

    }, [employeesId]);


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
                <Button id='delete-btn' variant="danger">ลบข้อมูล</Button>
            </div>

        </div>
    );


}