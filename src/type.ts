import {
    
    nat64,
    StableBTreeMap,
    Record,  int8, Principal,
    Vec
} from 'azle';
import { group } from 'console';


export type Patient = Record<{
    Address : Principal;
    Name: string;
    Phone: nat64;
    Gender: string;
    Height: string;
    Weight: string;
    BloodGroup:string;
    Allergies: string;
    HouseAddr: string;
    init: boolean;

}>

export type Data = Record<{
    PatientId: string,
    Diagnosis: string;
    Medications: string;
    Date: nat64;
    DoctorId: Principal;
    Note: String;
    LabResults: string;
    BillingData: string;
    createdAt: nat64
}>
export type Doctor = Record<{
    Address: Principal;
    Name: string;
    Phone: nat64;
    Gender: string;
    Qualification: string;
    Major: string;
    Date: nat64;
    Hospital: string;

}>

export type PatientPayload = Record<{
    Name: string;
    Phone: nat64;
    Gender: string;
    Height: string;
    Weight: string;
    BloodGroup:string;
    Allergies: string;
    HouseAddr: string;
    
}>
export type DoctorPayload = Record<{
    Name: string;
    Phone: nat64;
    Gender: string;
    Qualification: string;
    Major: string;
    Date: nat64;
    Hospital: string;
}>

export type DataPayload = Record<{
    PatientId: string,
    Diagnosis: string;
    Medications: string;
    Date: nat64;
    Note: String;
    LabResults: string;
    BillingData: string;
}>
export const PatientStore = new StableBTreeMap<Principal, Patient>(0,44,256);
export const DoctorStore = new StableBTreeMap<Principal, Doctor>(1,24,156);
export const DataStore = new StableBTreeMap<string, Vec<Data>>(3,256,1000);




