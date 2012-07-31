//node oart.js -o pdf_uri

var pdf = require('pdfkit')
  , util = require('util')
  , exec = require('child_process').exec
  , argv = require('optimist').argv
  , DateFormat = require('dateformatjs').DateFormat
  , df = new DateFormat("dd'.'MM'.'yyyy")
  , current_date = df.format(new Date())
  ;


function generate_pdf(pdf_uri) {
  doc = new pdf;
  //# Embed a font, set the font size, and render some text
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf')
     .fontSize(11)
     .text('Bugwelder', 320, 40);

  doc.text('the aircooled Hulashop');
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf')
  doc.moveDown();
  doc.text('Strichweg 35');
  doc.text('D-27472 Cuxhaven');
  doc.text('fon.  (00 49) 47 21 - 39 69 02');
  doc.text('fax.   (00 49) 47 21 - 39 69 05');
  doc.text('mail.   info@bugwelder.com');
  doc.text('web.   www.bugwelder.com');
  doc.moveDown();
  doc.text('Geschäftsführer. Christopher Heinecke');
  doc.text('USt-Nr. DE243667612');
  doc.text('Stadtsparkasse Cuxhaven');
  doc.text('BLZ. 241 500 01    Kontonr. 14 72 15');
  doc.moveDown();
  doc.text('Datum: '+current_date);
  doc.moveDown();
  doc.text('Vorgangsnr.:  160712005');
  doc.text('Kunde:');

  doc.image('public/pdf/bugwelder-logo.png', 40, 40, {fit: [200, 500]})
    .text('Bugwelder • Strichweg 35 • 27472 Cuxhaven', 40, 123);

  doc.fontSize(14)
    .text('Henrik Bertram',45,155)
    .text("Bogenstrasse 1")
    .text("45768 Marl")
    .rect(40, 150, 200, 100)
    .stroke();

  doc.moveDown(8);
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf');
  doc.text("Auftragsbestätigung und Rechnung", {align: 'center'});
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf')
  doc.fontSize(12);
  doc.text("Gemäß Ihrer Bestellung liefern wir folgende Waren:", {align: 'left'});
  doc.moveDown();

  var abstand = 110;
  var menge = {x:doc.x-5, y:doc.y};
  var nr = {x:doc.x+40, y:doc.y};
  var bez = {x:doc.x+100, y:doc.y};
  var preis = {x:doc.x+400, y:doc.y};
  var gesamt = {x:doc.x+500, y:doc.y};

  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf')
  doc.fontSize(8);

  doc.text("Menge", menge.x, menge.y);
  doc.text("Artikel-Nr.", nr.x, nr.y);
  doc.text("Bezeichnung", bez.x, bez.y);
  doc.text("Preis/Stck.", preis.x, preis.y);
  doc.text("Gesamt", gesamt.x, gesamt.y);

  doc.moveTo(menge.x, doc.y) 
    .lineTo(gesamt.x+30, doc.y)
    .stroke();

  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf');

  menge.y = doc.y+3;
  nr.y = doc.y+3;
  bez.y = doc.y+3;
  preis.y = doc.y+3;
  gesamt.y = doc.y+3;

  doc.text("1", menge.x, menge.y);
  doc.text("AC898040", nr.x, nr.y);
  doc.text("DACHGEPÄCKTRÄGER VW BUS EDELSTAHL POLIERT 4- BOGEN", bez.x, bez.y);
  doc.text("719,95", preis.x, preis.y);
  doc.text("719,95", gesamt.x, gesamt.y);

  doc.moveDown(2);

  var y = doc.y;
  doc.text("Versand Spedition",bez.x, y);
  doc.text("79,5",gesamt.x, y);

  doc.moveTo(menge.x, doc.y) 
    .lineTo(gesamt.x+30, doc.y)
    .stroke();

  doc.text ("Gesamt", 40, doc.y);
  doc.text ("incl. 19 % MwSt", 40, doc.y);

  doc.text("Zahlungsart: per Vorkasse ohne Abzug!",40,750);
  doc.text("Vielen Dank für Ihren Einkauf.");

  doc.write(pdf_uri);
}

function print_jobs(pdf_uri, customer, date, count, cb) {
  console.log("print wird ausgeführt");
	exec("lp -U $USER -t Pizza " + customer + " " + date + "-o media=a4 "+ pdf_uri, cb);
  //exec('echo "Hello from JumpLink"|lp', cb);
  console.log("done");
}

if (argv.o) {
  generate_pdf(argv.o)
}

//module.exports.generate_pdf = generate_pdf;
//module.exports.print_jobs = print_jobs;