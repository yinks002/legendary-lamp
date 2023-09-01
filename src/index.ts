// cannister code goes here
import { $query, $update, StableBTreeMap, Vec, Opt, match, Result, nat64, ic, Principal, int8 } from "azle";
import { v4 as uuidv4 } from 'uuid';
import {Patient,Doctor,PatientPayload,DataPayload,Data,DoctorPayload,PatientStore,DataStore,DoctorStore} from './type'


//to register a new patient
$update
export function RegisterPatient(payload: PatientPayload):Result<Patient, string>{
    // return match(PatientStore.get(ic.caller()),{
    //     Some:(patient)=>{

    //     },
    //     None:()=>Result.Err<Patient, string>("")
    // })
    const patient: Patient = {
       Address: ic.caller(),
       Name: payload.Name,
       Phone: payload.Phone,
       Gender: payload.Gender,
       Height: payload.Height,
        Weight: payload.Weight,
        BloodGroup:payload.BloodGroup,
        Allergies: payload.Allergies,
        HouseAddr: payload.HouseAddr,
        init: true
    }
    PatientStore.insert(patient.Address, patient);
    return Result.Ok(patient)
}
$update
export function RegisterDoctor(payload:DoctorPayload):Result<Doctor, string>{
    const doctor: Doctor = {
    Address: ic.caller(),
    Name: payload.Name,
    Phone: payload.Phone,
    Gender: payload.Gender, 
    Qualification: payload.Qualification,
    Major: payload.Major,
    Date: payload.Date,
    Hospital: payload.Hospital
    }
    DoctorStore.insert(doctor.Address, doctor);
    return Result.Ok(doctor);
}
$update
export function RegisterData(payload: DataPayload):Result<Vec<Data>, string>{
    const data: Data = {
        PatientId: payload.PatientId,
        Diagnosis: payload.Diagnosis,
        Medications: payload.Medications,
        Date: payload.Date,
        Note: payload.Note,
        LabResults: payload.LabResults,
        BillingData: payload.BillingData,
        DoctorId: ic.caller(),
        createdAt: ic.time()
    }
    let dataStore: Vec<Data> = []
    dataStore.push(data)

    
    
    DataStore.insert(data.PatientId,dataStore);
    return Result.Ok(dataStore)

}

$query
export function getId(): Principal{
    return ic.caller()
}
$update
export function getDetails(patientId: string):Result<Vec<Data>,string>{
    return match(DataStore.get(patientId),{
        Some:(patient)=>Result.Ok<Vec<Data>, string>(patient),

        None:() => Result.Err<Vec<Data>, string>(`a message with id=${patientId} not found`)
    })
}
$update
export function UpdateData(PatientId:string,payload:DataPayload):Result<Vec<Data>,string>{
    return match(DataStore.get(PatientId),{
        Some:(patients)=>{
            
           
          const updatedData:Vec<Data> = {...patients,...payload}
          
          DataStore.insert(PatientId,updatedData);
          return Result.Ok<Vec<Data>,string>(updatedData)
        },
        None:()=>Result.Err<Vec<Data>,string>("nhot founhd")
    });
}


// dfx canister call elth RegisterData '(record{"PatientId"= "n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae";"Diagnosis"="canmcer";"Medications"="paracetamol";"Date"=332;"Note"="oka";"LabResults"="picture.com";"BillingData"="hmmn"})'
// dfx canister call elth UpdateData '("n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae",record{"PatientId"= "n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae";"Diagnosis"="headacxhg";"Medications"="amoxiclim";"Date"=332;"Note"="oka";"LabResults"="picture.com";"BillingData"="sure"})'





