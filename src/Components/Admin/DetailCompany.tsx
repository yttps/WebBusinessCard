import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';
import Header from '../Header/Header';
import { Row, Col, Button } from 'react-bootstrap';



export default function DetailCompany() {

    const { id: companyId } = useParams();
    const companyapi = new CompanyApi();
    const [companyById, setCompanyById] = useState<GetDataCompanyById | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            if (companyId) {
                const response = await companyapi.GetDataCompanyById(companyId);
                setCompanyById(response);
                setIsLoading(false);
                console.log("Fetched response:", response);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!companyById) {
        return <div>No company data found.</div>;
    }

    return (
        <div>
            <Header/>
            <h1>Company Details</h1>
            <p>Name: {companyById.name}</p>
            <p>Email: {companyById.email}</p>
            <p>Business Type: {companyById.businessType}</p>
            <p>Website: {companyById.website}</p>
            <p>Year Founded: {companyById.yearFounded}</p>
            <p>Address : {companyById.address}</p>
            {/* <p>Phone Number: {companyById.phoneNumber}</p>
            <p>Subdistrict: {companyById.subdistrict}</p>
            <p>District: {companyById.district}</p>
            <p>Province: {companyById.province}</p>
            <p>Country: {companyById.country}</p> */}
        </div>
    );


}