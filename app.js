// ===============================
// ARCHITIES SCANNER
// app.js - BAGIAN 1
// ===============================

// ===============================
// KONFIGURASI
// ===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbxj4MIGkkoV9qM_TSHTKrOG6znhld8aDLg0DaVi-XSx4AvzY6joFF8xdF8PyCt9KnE4/exec";

const API_KEY = "ARCHITIES2026";

const PIN = "2026ARCH";

// ===============================

let html5QrCode;
let scanAktif = true;
let flashAktif = false;

// ===============================
// LOGIN
// ===============================

function login(){

    const pin = document.getElementById("pin").value;

    if(pin !== PIN){

        alert("PIN salah");

        return;

    }

    document.getElementById("loginBox").style.display="none";
    document.getElementById("scannerBox").style.display="block";

    mulaiScanner();

}

// ===============================
// MULAI SCANNER
// ===============================

async function mulaiScanner(){

    html5QrCode = new Html5Qrcode("reader");

    try{

        const cameras = await Html5Qrcode.getCameras();

        if(cameras.length===0){

            alert("Tidak ada kamera.");

            return;

        }

        // kamera belakang
        const camera =
            cameras[cameras.length-1].id;

        await html5QrCode.start(

            camera,

            {

                fps:10,

                qrbox:{
                    width:250,
                    height:250
                }

            },

            onScanSuccess,

            ()=>{}

        );

        loadDashboard();

    }

    catch(err){

        console.log(err);

        alert(err);

    }

}

// ===============================
// FLASH
// ===============================

async function aktifkanFlash(){

    try{

        if(!html5QrCode) return;

        const track =
        html5QrCode.getRunningTrack();

        if(!track) return;

        flashAktif = !flashAktif;

        await track.applyConstraints({

            advanced:[

                {
                    torch:flashAktif
                }

            ]

        });

    }

    catch(err){

        console.log(err);

    }

}



// ===============================
// QR BERHASIL DISCAN
// ===============================

async function onScanSuccess(decodedText) {

    if (!scanAktif) return;

    scanAktif = false;

    document.getElementById("status").className = "waiting";
    document.getElementById("status").innerHTML = "Memeriksa...";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                apiKey: API_KEY,
                action: "checkin",
                id: decodedText

            })

        });

        const res = await response.json();

        tampilkanStatus(res);

        loadDashboard();

    } catch (err) {

        console.log(err);

        document.getElementById("status").className = "error";
        document.getElementById("status").innerHTML = "❌ Gagal terhubung ke server";

    }

    setTimeout(() => {

        scanAktif = true;

        document.getElementById("status").className = "waiting";
        document.getElementById("status").innerHTML = "Menunggu Scan...";

    }, 2000);

}

// ===============================
// TAMPILKAN STATUS
// ===============================

function tampilkanStatus(res){

    const status = document.getElementById("status");

    if(res.success){

        status.className = "success";

        status.innerHTML =
        "✅ " + res.nama;

        document.getElementById("last").innerHTML =
        res.nama;

        if(navigator.vibrate){

            navigator.vibrate(200);

        }

    }

    else{

        status.className = "error";

        if(res.type=="duplicate"){

            status.innerHTML="🔴 Sudah Hadir";

        }

        else{

            status.innerHTML="❌ QR Tidak Valid";

        }

    }

}

// ===============================
// DASHBOARD
// ===============================

async function loadDashboard(){

    try{

        const res = await fetch(

            API_URL + "?action=dashboard"

        );

        const data = await res.json();

        document.getElementById("hadir").innerHTML =
        data.hadir;

        document.getElementById("total").innerHTML =
        data.total;

    }

    catch(err){

        console.log(err);

    }

}
