export interface GetUsersByCompany {
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
    profile:       string;
    id:            string;
    age:           number;
}

export interface Companybranch {
    companyID: string;
    name:      string;
    id:        string;
    address:   string;
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
