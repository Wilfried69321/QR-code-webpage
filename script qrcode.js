document.addEventListener("DOMContentLoaded", function (){
new QRCode(document.getElementById("qrcode"), {
  text: "http://localhost:3000/scan?ticket_id=1",
  width: 200,
  height: 200,
  correctLevel : QRCode.CorrectLevel.H
});
});
