export interface GetDataHrById {
    firstname:     string;
    password:      string;
    birthdate:     string;
    address:       string;
    gender:        string;
    phone:         string;
    startwork:     string;
    companybranch: Companybranch;
    position:      string;
    department:    Department;
    email:         string;
    lastname:      string;
    Hr:            string;
    id:            string;
    age:           number;
    profile:       string;
    business_card: string;
}

export interface Companybranch {
    companyID: string;
    address:   string;
    name:      string;
    id:        string;
    company:   Company;
}

export interface Company {
    website:      string;
    password:     string;
    name:         string;
    businessType: string;
    yearFounded:  string;
    email:        string;
    logo:         string;
    id:           string;
}

export interface Department {
    companyID: string;
    phone:     string;
    name:      string;
    id:        string;
}