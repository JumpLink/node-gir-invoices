var DateFormat = require('dateformatjs').DateFormat
  , df = new DateFormat("dd'.'MM'.'yyyy")
  , current_date = df.format(new Date())
  ;

var argv = require('optimist')
  .default('o', 'filename.pdf')
  .default('N', 'customer first name')
  .default('n', 'customer last name')
  .default('c', 'customer company')
  .default('d', current_date)
  .default('s', 'customer street')
  .default('sn', 'customer street number')
  .default('tn', 'transaction number')
  .default('l', 'customer location')
  .default('p', 'payment method')
  .default('q', [ '1', '2', '3']) //quantity
  .default('mo', ['model_1', 'model_2', 'model_3' ]) //model
  .default('t', ['title_1', 'title_2', 'title_3' ]) //title
  .default('pr', ['10', '15', '20' ]) //price
  .default('sp', '100') //shipping price
  .argv;

var pdf = require('pdfkit')
  , config = require(__dirname+'/config/config.js')
  ;

function generate_pdf() {

  doc = new pdf;

  console.log(argv.o);
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf')
     .fontSize(11)
     .text(config.default.company, 320, 40);

  doc.text(config.default.slogan);
  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf');
  doc.moveDown();
  doc.text(config.default.street);
  doc.text(config.default.zip_code);
  doc.text('fon. '+config.default.fon);
  doc.text('fax.   '+config.default.fax);
  doc.text('mail.  '+config.default.mail);
  doc.text('web.   '+config.default.web);
  doc.moveDown();
  doc.text('Geschäftsführer. '+config.default.manager);
  doc.text('USt-Nr. '+config.default.VATno);
  doc.text(config.default.bank_name);
  doc.text('BLZ. '+config.default.bank_code_number+'    Kontonr. '+config.default.bank_account_number);
  doc.moveDown();
  doc.text('Datum: '+argv.d);
  doc.moveDown();
  doc.text('Vorgangsnr.:  '+argv.tn);
  doc.text('Kunde: '+argv.n+', '+argv.N);

  doc.image(__dirname+config.default.logo_src, 40, 40, {fit: [200, 500]})
    .text(config.default.company+' • '+config.default.street+' • '+config.default.zip_code, 40, 123);

  doc.fontSize(14)
    .text(argv.c,45,155)
    .text(argv.N+' '+argv.n)
    .text(argv.s)
    .text(argv.l)
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

  var total_price = 0;
  var realy_total_price = 0;

  for (var i = 0; i < argv.q.length; i++) {
    total_price = (argv.pr[i]*argv.q[i]);
    realy_total_price += total_price;

    doc.text(argv.q[i], menge.x, menge.y);
    doc.text(argv.mo[i], nr.x, nr.y);
    doc.text(argv.t[i], bez.x, bez.y);
    doc.text(argv.pr[i], preis.x, preis.y);
    doc.text(total_price, gesamt.x, gesamt.y);

    doc.moveDown();
    menge.y += 12;
    nr.y += 12;
    bez.y += 12;
    preis.y += 12;
    gesamt.y += 12;

  }

  realy_total_price += Number(argv.sp);

  // doc.text("1", menge.x, menge.y);
  // doc.text("AC898040", nr.x, nr.y);
  // doc.text("DACHGEPÄCKTRÄGER VW BUS EDELSTAHL POLIERT 4- BOGEN", bez.x, bez.y);
  // doc.text("719,95", preis.x, preis.y);
  // doc.text("719,95", gesamt.x, gesamt.y);

  doc.moveDown(2);

  var y = doc.y;
  doc.text("Versand Spedition",bez.x, y);
  doc.text(argv.sp, gesamt.x, y);

  doc.moveTo(menge.x, doc.y) 
    .lineTo(gesamt.x+30, doc.y)
    .stroke();

  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-B.ttf');
  y = doc.y;
  doc.text ("Gesamt", 40, y);
  doc.text (realy_total_price, gesamt.x, y);

  doc.font('/usr/share/fonts/truetype/ubuntu-font-family/Ubuntu-R.ttf');
  doc.text ("incl. "+config.default.VAT.toString()+" % MwSt", 40, doc.y);
  doc.moveDown();
  doc.text("Zahlungsart: "+argv.p);

  doc.text("Vielen Dank für Ihren Einkauf.",0,750);

  doc.write(argv.o.toString());
}

generate_pdf();
