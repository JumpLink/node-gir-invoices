var Gir = require('gir')
, Gtk = module.exports = Gir.load('Gtk', '3.0')
, DateFormat = require('dateformatjs').DateFormat
, df = new DateFormat("dd'.'MM'.'yyyy")
, current_date = df.format(new Date())
, pdf = require('pdfkit')
, util = require('util')
, exec = require('child_process').exec
, argv = require('optimist').argv
;

var win
, entry_date
, cust_first_name
, cust_name
, pdf_button
;

doc = new pdf;

function generate_pdf(pdf_uri) {
  console.log(pdf_uri);
  //# Embed a font, set the font size, and render some text
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf')
     .fontSize(11)
     .text('test', 320, 40);

  doc.text('the aircooled Hulashop');
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf');
  doc.moveDown();
  doc.text('testweg 35');
  doc.text('D-00303 Mond');
  doc.text('fon.  123456');
  doc.text('fax.   123456');
  doc.text('mail.   info@test.com');
  doc.text('web.   www.test.com');
  doc.moveDown();
  doc.moveDown();
  //doc.text('Datum: '+entry_date.text);
  doc.moveDown();
  doc.text('Vorgangsnr.:  01');
  doc.text('Kunde:');

  //doc.image('public/pdf/logo.png', 40, 40, {fit: [200, 500]})

  doc.fontSize(14)
    .text(cust_first_name.text+' '+cust_name.text,45,155)
    .text("Teststraße 1")
    .text("00000 Moond")
    .rect(40, 150, 200, 100)
    .stroke();

  doc.moveDown(8);
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf');
  doc.text("Auftragsbestätigung und Rechnung", {align: 'center'});
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf');
  doc.fontSize(12);
  doc.text("Gemäß Ihrer Bestellung liefern wir folgende Waren:", {align: 'left'});
  doc.moveDown();

  var abstand = 110;
  var menge = {x:doc.x-5, y:doc.y};
  var nr = {x:doc.x+40, y:doc.y};
  var bez = {x:doc.x+100, y:doc.y};
  var preis = {x:doc.x+400, y:doc.y};
  var gesamt = {x:doc.x+500, y:doc.y};

  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf');
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

function create_ui() {
	var builder = new Gtk.Builder ();
	builder.add_from_file ("ui/main.ui");
	win = builder.get_object ("main");
	entry_date = builder.get_object ("entry_date");
	pdf_button = builder.get_object ("pdf_button");
	entry_date.text = current_date;

	win.show_all();

	win.on("destroy", function() {
	    console.log("destroyed", arguments[0] instanceof Gtk.Window);
	    process.exit(1);
	    Gtk.mainQuit();
	});

	pdf_button.on("clicked", function(){
		generate_pdf('test.pdf');
	});

}

function print_jobs(pdf_uri, customer, date, count, cb) {
  console.log("print wird ausgeführt");
	exec("lp -U $USER -t test " + customer + " " + date + "-o media=a4 "+ pdf_uri, cb);
  console.log("done");
}

Gtk.init(0);
create_ui();
Gtk.main();