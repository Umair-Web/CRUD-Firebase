// Linking

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, addDoc, collection,getDoc,doc,updateDoc,deleteDoc} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage,ref,uploadBytes,uploadBytesResumable,getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4MUwooiKU44p1B6hlnK-OTxoXmgsz9fs",
  authDomain: "crud-159c0.firebaseapp.com",
  projectId: "crud-159c0",
  storageBucket: "crud-159c0.appspot.com",
  messagingSenderId: "472948782455",
  appId: "1:472948782455:web:a5be0fe01b7e26a2c61d72",
  measurementId: "G-FQHMN8R2ZP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();


// Create Operation//////////////////////////////

let create=document.getElementById("Create");

create && create.addEventListener("click",async(event)=>{
    
event.preventDefault();
let Name=document.getElementById("Name").value;
let Address=document.getElementById("Address").value;
let RollNo=document.getElementById("RollNo").value;
let Section=document.getElementById("Section").value;

try{
let file=document.getElementById("fileinput").files[0];
var res= await uploadFile(file);
console.log("File is stored in storage")
}
catch(err){
console.log("Error file is not stored in Storage")
}

// User Object

let userdata={
    userName:Name,
    userAddress:Address,
    userRollNo:RollNo,
    userSection:Section,
    userfile:res
}

console.log(Name);
console.log(Address);
console.log(RollNo);
console.log(Section);
console.log(res);



// storing in database
try {
    const docRef = await addDoc(collection(db, "users"), {
        Name:userdata.userName,
        Address:userdata.userAddress,
        RollNo:userdata.userRollNo,
        Section:userdata.userSection,
        UserFile:userdata.userfile
    });
    console.log("Document written with ID: ", docRef.id);
    localStorage.setItem("ReferenceID",`${docRef.id}`);
    console.log("User is created in database");
  } catch (e) {
    console.error("Error adding document: ", e);
    console.log("User is NOT!! created in database");
  }
})

//Read Operation/////////////////////////////////

let read=document.getElementById("Read");
read && read.addEventListener("click",async(event)=>{
event.preventDefault();
let cardDisplay=document.getElementById("card2");
cardDisplay.style.display="block";
var ReferenceFrLocalSt=localStorage.getItem("ReferenceID");
const docRef = doc(db, "users", ReferenceFrLocalSt);
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  
  console.log("Document data:", docSnap.data());

// HTML DOM SETTING
console.log(docSnap.data().Address);
console.log(docSnap.data().RollNo);
console.log(docSnap.data().Section);
console.log(docSnap.data().Name);
document.getElementById("Name-page-2").innerHTML =`${docSnap.data().Name}`;
document.getElementById("Address-page-2").innerHTML =`${docSnap.data().Address}`;
document.getElementById("RollNo-page-2").innerHTML =`${docSnap.data().RollNo}`;
document.getElementById("Section-page-2").innerHTML =`${docSnap.data().Section}`;
document.getElementById("page-2-img").src =`${docSnap.data().UserFile}`;
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
  window.alert("No such document!")
  cardDisplay.style.display="none";
}


})

//Update Operation/////////////////////////////////

let update=document.getElementById("Update");
update&&update.addEventListener("click",async(event)=>{
event.preventDefault();
var ReferenceFrLocalSt=localStorage.getItem("ReferenceID");
let Name=document.getElementById("Name").value;
let Address=document.getElementById("Address").value;
let RollNo=document.getElementById("RollNo").value;
let Section=document.getElementById("Section").value;

try{
let file=document.getElementById("fileinput").files[0];
var res= await uploadFile(file);
console.log("File is stored in storage")
}
catch(err){
console.log("Error file is not stored in Storage")
}

// User Object

let userdata={
    userName:Name,
    userAddress:Address,
    userRollNo:RollNo,
    userSection:Section,
    userfile:res
}

// Updating in database
const docRef = doc(db, "users",ReferenceFrLocalSt);

// Set the "capital" field of the city 'DC'
await updateDoc(docRef, {
        Name:userdata.userName,
        Address:userdata.userAddress,
        RollNo:userdata.userRollNo,
        Section:userdata.userSection,
        UserFile:userdata.userfile
  
});
console.log("Data Updated")
})

//Delete Operation////////////////////////

let Delete1=document.getElementById("Delete");
Delete1 && Delete1.addEventListener("click",async(event)=>{
event.preventDefault();
let cardDisplay=document.getElementById("card2");
var ReferenceFrLocalSt=localStorage.getItem("ReferenceID");
await deleteDoc(doc(db, "users",ReferenceFrLocalSt));
console.log("Data Deleted")
window.alert("Data Deleted")
cardDisplay.style.display="none";
})
// Upload file function

function uploadFile(file){

    return new Promise((resolve,reject)=>{
    // Storing file in Storage with name here file is let file=document.getElementById("fileinput").files[0];
    // so we just have to give file in function 
    
    const mountainImagesRef = ref(storage, `images/${file.name}`);
    
    // Storing in data base with url return
    
    const uploadTask = uploadBytesResumable(mountainImagesRef, file);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        reject(error);
      }, 
      
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // It will return URL Function which is using it must store its response
          resolve( downloadURL);
        });
         }
    );
    
    })
    }
/////////////////////////////////////////////////////////
