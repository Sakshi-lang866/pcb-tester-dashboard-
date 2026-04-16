const express = require("express");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(__dirname + "/public"));

// Home route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.get("/report_:id.pdf", (req, res) => {
    const filePath = __dirname + "/report_" + req.params.id + ".pdf";
    res.sendFile(filePath);
});
// API for PCB Test
app.get("/api/test", async (req, res) => {

    let voltage = (Math.random() * 200).toFixed(2);
    let current = (Math.random() * 5).toFixed(2);
    let temperature = (Math.random() * 50).toFixed(2);

    // PASS / FAIL logic
    let result = (voltage < 100 && current < 2 && temperature < 40) ? "PASS" : "FAIL";

    let fileName = `report_${Date.now()}.pdf`;

    // Create PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(fileName));

    doc.fontSize(20).text("Smart PCB Test Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Voltage: ${voltage} V`);
    doc.text(`Current: ${current} A`);
    doc.text(`Temperature: ${temperature} °C`);
    doc.text(`Result: ${result}`);

    doc.moveDown();

    // QR Code
    const qrData = `Voltage: ${voltage}, Current: ${current}, Temp: ${temperature}, Result: ${result}`;
    const qrImage = await QRCode.toDataURL(qrData);

    const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync("qr.png", base64Data, "base64");

    doc.image("qr.png", {
        fit: [150, 150],
        align: "center"
    });

    doc.end();

    // Send response
    res.json({
        voltage,
        current,
        temperature,
        result,
        pdf: fileName
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});