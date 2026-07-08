// ===============================
// ARCHITIES SCANNER
// app.js - BAGIAN 1
// ===============================

// ===============================
// KONFIGURASI
// ===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbwDNdDqJ62mUaATDhB35CEjOUu_taJ0qTh0gPSVuUOIjsrPPP98fa6ZRF3GfQtx-9Oj/exec";

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
