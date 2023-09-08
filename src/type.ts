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
    ReadOrWrite: boolean;
    Doctor:string;
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
    Diagnosis: string;
    Medications: string;
    Date: nat64;
    Note: String;
    LabResults: string;
    BillingData: string;
}>
export const PatientStore = new StableBTreeMap<string, Patient>(0,90,256);
export const DoctorStore = new StableBTreeMap<string, Doctor>(1,90,190);
export const DataStore = new StableBTreeMap<string, Vec<Data>>(3,256,1000);


// fire salt hockey rhythm report cattle grief target amazing obscure try can match figure table syrup planet cat shove nation rebuild primary silk such
//comic spirit drum delay term credit access sting verb bundle liar marine baby citizen usual dirt birth cover color lens parent people exit produce

//torch chat urban local first galaxy car knife consider dad vessel clean empower secret work estate pyramid ranch pencil invest cause sail rail powder