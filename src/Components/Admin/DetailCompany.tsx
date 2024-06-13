import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CompanyApi } from '@/ApiEndpoints/CompanyApi';
import { GetDataCompanyById } from '@/Model/GetCompanyById';

export default function DetailCompany() {

    const { id: companyId } = useParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const companyapi = new CompanyApi();
    const [companyById, setCompanyById] = useState<GetDataCompanyById[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const fetchData = async () => {

            try {

                if (companyId) {
                    
                    const response = await companyapi.GetDataCompanyById(companyId!); // Assuming API call
                    setCompanyById(response);
                    console.log('in get by id', companyById);

                    if (companyById) {
                        setIsLoading(true);
                    }
                }


            } catch (error) {
                console.error('Error fetching company data:', error);
                // Handle error gracefully (e.g., display error message to user)
            }
        };

        fetchData();
        
    }, [companyById, companyId, companyapi])

    if (isLoading) {
        return (
            <div>
                <h1>Company Details for ID: {companyId}</h1>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Data Company not found</h1>
            </div>
        )
    }


}