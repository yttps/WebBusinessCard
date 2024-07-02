import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HrApi } from '@/ApiEndpoints/HrApi';
import { GetDataHrById } from '@/Model/GetDataHrById';
import Header from '../Header/Header';
import { 
    // Row, Col , 
    
    Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function DetailHr() {

    const { id: HrId } = useParams();
    const hrapi = new HrApi();
    const [hrById, setHrById] = useState<GetDataHrById | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();

    const fetchData = async () => {
        try {

            if (HrId) {

                const resGetdataDetail = await hrapi.GetDataHrById(HrId);

                console.log('get by id', resGetdataDetail);

                setHrById(resGetdataDetail);
                setIsLoading(true);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    const DeleteHrData = async () => {

        if (!hrById) return;

        const chk = confirm("ยืนยันเพื่อทำการลบข้อมูล!");

        if (chk) {

            try {

                console.log("com id", hrById?.id);
                const response = await hrapi.DeleteHr(hrById.id);

                if (response == 200) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'ลบข้อมูลสำเร็จ!',
                        icon: 'success',
                    });
                    nav('ListCompany');
                }
            } catch (error) {
                console.error('Error deleting company:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'เกิดข้อผิดพลาดในการลบข้อมูล!',
                    icon: 'error',
                });
            }
        }
    }

    useEffect(() => {

        if (!isLoading) {
            fetchData();
        }

    }, [HrId]);


    if (!hrById) {
        return <div>No company data found.</div>;
    }

    return (
        <div>
            <Header />
            <h1>Company Details</h1>
            <p>Name: {hrById.firstname}</p>
            <p>Email: {hrById.email}</p>
            <p>Company branch: {hrById.companybranch.name}</p>
            <p>Email: {hrById.email}</p>
            <p>Department: {hrById.department.name}</p>
            <p>Address : {hrById.address}</p>
            <p>Password : {hrById.password}</p>
            <p>Detail Company : {hrById.companybranch.company.name}</p>
            <p>Position : {hrById.position}</p>
            <div>
                <img src={hrById.profile} alt="" />
            </div>
            <div id="col2-2">
                <Button id='delete-btn' variant="danger" onClick={DeleteHrData}>ลบข้อมูล</Button>
            </div>

        </div>
    );


}