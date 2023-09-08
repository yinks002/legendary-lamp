// cannister code goes here
import { $query, $update, Vec, match, Result, ic, Principal } from "azle";
import {Patient,Doctor,PatientPayload,DataPayload,Data,DoctorPayload,PatientStore,DataStore,DoctorStore} from './type'


//to register a new patient
$update
export function RegisterPatient(payload: PatientPayload):Result<Patient, string>{
     //function to check if an existing adress is mapped to a patient
    //if address exists,  it returns an error
    const existingPatientOpt = PatientStore.get(ic.caller().toString()).Some;
    
   if(existingPatientOpt?.Address){
        return Result.Err<Patient, string>(`patient with adress ${existingPatientOpt.Address}already exists`)
   }
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
        init: false,
        ReadOrWrite: true,
        Doctor:ic.caller().toString(),
        //if set to true, the patient data can be read and altered, if set to write, doctor can only read the data
        
    }
    PatientStore.insert(patient.Address.toString(), patient);
    return Result.Ok(patient)
}
$update
export function RegisterDoctor(payload:DoctorPayload):Result<Doctor, string>{

    //function to check if an existing adress is mapped to doctor
    //if address exists,  it returns an error
    const existingDoctorOpt = DoctorStore.get(ic.caller().toString()).Some;
    
   if(existingDoctorOpt?.Address){
        return Result.Err<Doctor, string>(`Doctor with adress ${existingDoctorOpt.Address} already exists`)
   }
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
    DoctorStore.insert(doctor.Address.toString(), doctor);
    return Result.Ok(doctor);
}
$update
export function RegisterData(patientId:string,payload: DataPayload):Result<Vec<Data>, string>{
    const patient = PatientStore.get(patientId).Some
    if(!patient?.Address){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not exist` )
    }
    if(patient.init != false){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} has been initalized , please proceed to update data` )
    }
    if (patientId == patient.Doctor){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} cannot alter its own records please assign a doctor` )
    }
    if(patient.Doctor != ic.caller().toString()){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not authorize you to view its data` )
    }
    if(patient.ReadOrWrite != true){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not authorize you to alter its data` )
    }
    const data: Data = {
        PatientId: patientId,
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

    
    patient.init = true;
    DataStore.insert(data.PatientId,dataStore);
    return Result.Ok(dataStore)

}

$query
export function getId(): Principal{
    return ic.caller()
}
$query
export function getDetails(patientId: string):Result<Vec<Data>,string>{
    const patient = PatientStore.get(patientId).Some
    if(patient?.Doctor != ic.caller().toString()){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not authorize you to view its data` )
    } 
    
    return match(DataStore.get(patientId),{
        Some:(data)=>Result.Ok<Vec<Data>, string>(data),

        None:() => Result.Err<Vec<Data>, string>(`a message with id=${patientId} not found`)
    })
}
$update
export function UpdateData(PatientId:string,payload:DataPayload):Result<Vec<Data>,string>
{
    const patient = PatientStore.get(PatientId).Some
    if(!patient?.Address){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not exist` )
    }
    if (PatientId == patient.Doctor){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} cannot alter its own records please assign a doctor` )
    }
    // if(patient.init != true){
    //     return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} has no data, please register Data` )
    // }
    if(patient.Doctor != ic.caller().toString()){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not authorize you to view its data` )
    }
    if(patient.ReadOrWrite != true){
        return Result.Err<Vec<Data>, string>(`user with ${patient?.Address} does not authorize you to alter its data` )
    }
    const NewData: Data  = {
        PatientId: PatientId,
        Diagnosis: payload.Diagnosis,
        Medications: payload.Medications,
        Date: payload.Date,
        Note: payload.Note,
        LabResults: payload.LabResults,
        BillingData: payload.BillingData,
        DoctorId: ic.caller(),
        createdAt: ic.time()
    }
    return match(DataStore.get(PatientId),{
        Some:(patient)=>{
             patient.push(NewData)
            DataStore.insert(PatientId, patient)
            return Result.Ok<Vec<Data>,string>(patient)
        },
        None:()=>Result.Err<Vec<Data>,string>("patient id not found")
    })
    // return match(DataStore.get(PatientId),{
    //     Some:(patients)=>{
            
           
    //       const updatedData:Vec<Data> = {...patients,...payload}
          
    //       DataStore.insert(PatientId,updatedData);
    //       return Result.Ok<Vec<Data>,string>(updatedData)
    //     },
    //     None:()=>Result.Err<Vec<Data>,string>("nhot founhd")
    // });
}
//set true to write, set to false to readOnly
$update
export function GrantAccess(DoctorId: string, ReadOrWrite: boolean):Result<Patient, string>{
    const doctor = DoctorStore.get(DoctorId).Some
        if(!doctor?.Address){
            return Result.Err(`doctor with ${doctor?.Address} does not exist` )
        }
    return match(PatientStore.get(ic.caller().toString()),{
        
        Some:(patient)=>{
            if(patient.Address.toString() != ic.caller().toString()){
                return Result.Err<Patient, string>("youre not tthe owner of this record")
                
            }
            const updateDoc: Patient = {...patient, Doctor: DoctorId, ReadOrWrite: ReadOrWrite};
            PatientStore.insert(ic.caller().toString(), updateDoc)
            return Result.Ok<Patient, string>(updateDoc)
        },
        None:()=>Result.Err<Patient , string>("patient with id doesnt exist")
    })
}
$update
export function RemoveAccess():Result<Patient, string>{
    return match(PatientStore.get(ic.caller().toString()),{
        Some:(patient)=>{
            if (patient.Doctor== ic.caller().toString()){
                return Result.Err<Patient, string>("No access was granted initially")
            }
            if(patient.Address.toString() !== ic.caller().toString()){
                return Result.Err<Patient, string>("youre not tthe owner of this record")
                
            }
            const updateDoc: Patient = {...patient, Doctor: ic.caller().toString()};
            PatientStore.insert(ic.caller().toString(), updateDoc)
            return Result.Ok<Patient, string>(updateDoc)
        },
        None:()=>Result.Err<Patient , string>("patient with id doesnt exist")
    })
}







//fire salt hockey rhythm report cattle grief target amazing obscure try can match figure table syrup planet cat shove nation rebuild primary silk such
// dfx canister call elth RegisterData '("n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae",record{"PatientId"= "n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae";"Diagnosis"="canmcer";"Medications"="paracetamol";"Date"=332;"Note"="oka";"LabResults"="picture.com";"BillingData"="hmmn"})'
// dfx canister call elth UpdateData '("n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae",record{"PatientId"= "n42km-ezuzg-l63tz-4xg75-cf6db-kodii-mzf6c-cj5cm-7hvdd-ab25h-6ae";"Diagnosis"="headacxhg";"Medications"="amoxiclim";"Date"=332;"Note"="oka";"LabResults"="picture.com";"BillingData"="sure"})'
// dfx canister call elth RegisterPatient '(record{"Name"="John  Doe";"Phone"=080000;"Gender"="Male";"Height"="6 4";"Weight"= "78kg";"BloodGroup"= "AA";"Allergies"= "cherry"; "HouseAddr"="27 artatica, off atlantic ocean"})'
// dfx canister call elth RegisterDoctor '(record{"Name"="alish adesh";"Phone"=0988998889;"Gender" = "Male";"Qualification" = "Msc Masters degree";"Major" = "sugery";"Date" = 87788;"Hospital"="ELTH worldwide limited"})'
// dfx canister call elth RegisterPatient '(record{"Name"="jhonna deosara";"Phone"=089980080000;"Gender"="Female";"Height"="6'9";"Weight"= "278kg";"BloodGroup"= "AS";"Allergies"= "apploe pie"; "HouseAddr" = "27 mars or jupiter, off pacific ocean"})'
// dfx canister call elth RegisterDoctor '(record{"Name"="haliyah monsour";"Phone"=0988998889;"Gender" = "Female";"Qualification" = "Pdh degree";"Major" = "dentism";"Date" = 99899;"Hospital":"ELTH worldwide limited"})'
// lqd2p-3ukwy-tpkyg-ccyfx-qxsvw-ngme3-5chzt-arsez-zebhy-ydtxh-qae
