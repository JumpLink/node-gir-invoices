var Gir = require('gir')
, Gtk = module.exports = Gir.load('Gtk', '3.0')
, ValaObject = module.exports = Gir.load('ValaObject')
, DateFormat = require('dateformatjs').DateFormat
, df = new DateFormat("dd'.'MM'.'yyyy")
, current_date = df.format(new Date())
, util = require('util')
, exec = require('child_process').exec
;

//Gir.init();

Gtk.init(0);

var ui = new ValaObject.InvoicesUI();
ui.create_widgets();
ui.connect_signals();
ui.show_all();

Gtk.main();

// var win
//   , entry_date
//   , cust_first_name
//   , cust_name
//   , pdf_button
//   , box_main
//   , article
//   ;

// function create_article_inputs() {
//   var article = {
//     box: new Gtk.Box(),
//     quantity: new Gtk.Entry(),
//     model: new Gtk.Entry(),
//     title: new Gtk.Entry(),
//     shipping_price: new Gtk.Entry()
//   }
//   article.box.orientation = Gtk.Orientation.horizontal;

//   article.quantity.set_width_chars(2);
//   article.model.set_width_chars(2);
//   article.shipping_price.set_width_chars(2);
//   article.title.set_width_chars(-1);

//   article.title.hexpand_set = true;
//   article.title.vexpand_set = true;

//   article.box.pack_start(article.quantity, true, true, 0);
//   article.box.pack_start(article.model, true, true, 0);
//   article.box.pack_start(article.title, true, true, 0);
//   article.box.pack_start(article.shipping_price, true, true, 0);

//   return article;
// }

// function create_ui() {
//   Gtk.init(0);
// 	var builder = new Gtk.Builder ();
// 	builder.add_from_file ("ui/main.ui");
// 	win = builder.get_object ("main");
// 	entry_date = builder.get_object ("entry_date");
// 	pdf_button = builder.get_object ("pdf_button");
//   box_main = builder.get_object ("box_main");

//   var builder_article = new Gtk.Builder ();
//   builder_article.add_from_file ("ui/article.ui");
//   var frame_article = builder_article.get_object ("frame_article");
//   var btn_add = builder_article.get_object ("btn_add");
//   var box_all_article = builder_article.get_object ("box_all_article");
//   var article = [];

//   // <- customer
//     var cust_name = builder.get_object ("cust_name");
//     var cust_first_name = builder.get_object ("cust_first_name");
//     var cust_company = builder.get_object ("cust_company");
//     var cust_street = builder.get_object ("cust_street");
//     var cust_street_num = builder.get_object ("cust_street_num");
//     var cust_plz = builder.get_object ("cust_plz");
//     var cust_ort = builder.get_object ("cust_ort");
//   // -> customer

//   article.push(create_article_inputs());
//   box_all_article.pack_start(article[0].box, true, true, 0);
  

//   box_main.pack_start(frame_article, true, true, 0);

// 	entry_date.text = current_date;

// 	win.show_all();

// 	win.on("destroy", function() {
// 	    console.log("destroyed", arguments[0] instanceof Gtk.Window);
// 	    process.exit(1);
// 	    Gtk.mainQuit();
// 	});

//   //If this is commented out the second button works.
// 	pdf_button.on("clicked", function(){
//     var filename = "-o test.pdf ";
//     var customer_first_name = "-N "+cust_first_name.text+" ";
//     var customer_name = "-n "+cust_name.text+" ";
//     var customer_company = "-c "+cust_company.text+" ";
//     var customer_street = "-s "+cust_street.text+" ";
//     var customer_street_num = "-sn "+cust_street_num.text+" ";
//     var customer_plz = "-l "+cust_plz.text+" "+cust_ort.text+" ";
//     exec('node pdf.js '+filename+customer_first_name+customer_name+customer_company+customer_street+customer_street_num+customer_plz+customer_ort);
//   });

//   btn_add.on("clicked", function(){
//         //console.log("clicked");
//     article.push(create_article_inputs());
//     //console.log(article.length-1);
//     box_all_article.pack_start(article[article.length-1].box, true, true, 0);
//     win.show_all();
//   });

//   Gtk.main();
// }



// function print_jobs(pdf_uri, customer, date, count, cb) {
//   console.log("print wird ausgeführt");
// 	exec("lp -U $USER -t test " + customer + " " + date + "-o media=a4 "+ pdf_uri, cb);
//   console.log("done");
// }

