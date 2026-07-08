const API_URL =
"https://script.google.com/macros/s/AKfycbwDNdDqJ62mUaATDhB35CEjOUu_taJ0qTh0gPSVuUOIjsrPPP98fa6ZRF3GfQtx-9Oj/exec";

async function loadDashboard(){

    const res = await fetch(
        API_URL + "?action=dashboard"
    );

    const data = await res.json();

    document.getElementById("total").innerHTML =
        data.total;

    document.getElementById("hadir").innerHTML =
        data.hadir;

    document.getElementById("belum").innerHTML =
        data.belum;

    const persen =
        data.total > 0
        ? Math.round(data.hadir * 100 / data.total)
        : 0;

    document.getElementById("persen").innerHTML =
        persen + "%";

    document.getElementById("progressBar").style.width =
        persen + "%";

}

loadDashboard();

setInterval(loadDashboard,5000);
