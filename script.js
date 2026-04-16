async function testPCB() {
    const res = await fetch("/api/test");
    const data = await res.json();

    document.getElementById("voltage").innerText = data.voltage + " V";
    document.getElementById("current").innerText = data.current + " A";
    document.getElementById("temperature").innerText = data.temperature + " °C";

    const resultEl = document.getElementById("result");
    resultEl.innerText = data.result;

    if (data.result === "PASS") {
        resultEl.className = "pass";
    } else {
        resultEl.className = "fail";
    }

    document.getElementById("download").href = "/" + data.pdf;

    const qrUrl = "http://localhost:3000/" + data.pdf;
    document.getElementById("qr").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" + qrUrl;
}