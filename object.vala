using Gtk;
using Gee;
using GLib;
using Posix;

namespace ValaObject {

	public class Article : Object {
		public Gtk.Box box = new Gtk.Box(Gtk.Orientation.HORIZONTAL, 0);
		public Gtk.Entry quantity = new Gtk.Entry();
		public Gtk.Entry model = new Gtk.Entry();
		public Gtk.Entry title = new Gtk.Entry();
		public Gtk.Entry shipping_price = new Gtk.Entry();

		public Article() {
			this.quantity.set_width_chars(2);
			this.model.set_width_chars(2);
			this.shipping_price.set_width_chars(2);
			this.title.set_width_chars(-1);

			this.box.pack_start(this.quantity, true, true, 0);
			this.box.pack_start(this.model, true, true, 0);
			this.box.pack_start(this.title, true, true, 0);
			this.box.pack_start(this.shipping_price, true, true, 0);

			this.box.show_all();
		}
	}

	public class InvoicesUI : Object {
		public Gtk.Builder builder = new Gtk.Builder ();
		public Gtk.Builder builder_article = new Gtk.Builder ();
		public Gtk.Window win;
		public Gtk.Frame frame_article;
		public Gtk.Button btn_add;
		public Gtk.Button pdf_button;
		public Gtk.Box box_all_article;
		public Gtk.Box box_main;

		public Gtk.Entry cust_name;
		public Gtk.Entry cust_first_name;
		public Gtk.Entry cust_company;
		public Gtk.Entry cust_street;
		public Gtk.Entry cust_street_num;
		public Gtk.Entry cust_plz;
		public Gtk.Entry cust_ort;

		public Gtk.Entry entry_date;
		public Gee.AbstractList<Article> article = new ArrayList<Article> ();

		string pdf_string;

		public InvoicesUI() {
			// create_widgets ();
			// connect_signals ();

		}
		public void show_all() {
			this.win.show_all();
		}
		public int create_widgets () {
			try {
				builder = new Gtk.Builder ();
				builder_article = new Gtk.Builder ();
				this.builder.add_from_file ("./ui/main.ui");
				this.builder_article.add_from_file ("./ui/article.ui");
			} catch (GLib.Error e) {
				GLib.stderr.printf ("Could not load UI: %s\n", e.message);
				return 1;
			} 

			this.win = builder.get_object ("main") as Gtk.Window;
			this.entry_date = builder.get_object ("entry_date") as Gtk.Entry;
			this.pdf_button = builder.get_object ("pdf_button") as Gtk.Button;
			this.box_main = builder.get_object ("box_main") as Gtk.Box;

			this.frame_article = builder_article.get_object ("frame_article") as Gtk.Frame;
			this.btn_add = builder_article.get_object ("btn_add") as Gtk.Button;
			this.box_all_article = builder_article.get_object ("box_all_article") as Gtk.Box;

			// <- customer
			this.cust_name = builder.get_object ("cust_name") as Gtk.Entry;
			this.cust_first_name = builder.get_object ("cust_first_name") as Gtk.Entry;
			this.cust_company = builder.get_object ("cust_company") as Gtk.Entry;
			this.cust_street = builder.get_object ("cust_street") as Gtk.Entry;
			this.cust_street_num = builder.get_object ("cust_street_num") as Gtk.Entry;
			this.cust_plz = builder.get_object ("cust_plz") as Gtk.Entry;
			this.cust_ort = builder.get_object ("cust_ort") as Gtk.Entry;
			// -> customer

			this.article.add(new Article());
			this.box_all_article.pack_start(article[0].box, true, true, 0);


			this.box_main.pack_start(frame_article, true, true, 0);
			
			return 0;
		}
		public void connect_signals () {
			this.win.destroy.connect(Gtk.main_quit);
			//If this is commented out the second button works.
			this.pdf_button.clicked.connect(() => {
				//print("clicked\n");
				pdf_string = "";
				pdf_string += "-o test.pdf ";
				if(cust_first_name.text.length>0)
					pdf_string += "-N "+cust_first_name.text.to_string()+" ";
				if(cust_name.text.length>0)
					pdf_string += "-n "+cust_name.text.to_string()+" ";
				if(cust_company.text.length>0)
					pdf_string += "-c "+cust_company.text.to_string()+" ";
				if(cust_street.text.length>0)
					pdf_string += "-s "+cust_street.text.to_string()+" ";
				if(cust_street_num.text.length>0)
					pdf_string += "-sn "+cust_street_num.text.to_string()+" ";
				if(cust_plz.text.length>0 && cust_ort.text.length>0)
					pdf_string += "-l "+cust_plz.text.to_string()+" "+cust_ort.text.to_string()+" ";
				print(pdf_string);
				//Posix.execl("ls", null);
				try {
					print(GLib.Process.spawn_command_line_async("node pdf.js "+pdf_string).to_string());
				} catch (GLib.SpawnError e) {
					print("Error: %s\n", e.message);
				}
			});

			this.btn_add.clicked.connect(() => {
				print("clicked\n");
				article.add(new Article());
				print("%i",article.size);
				box_all_article.pack_start(article[article.size-1].box, true, true, 0);
			});
		}

	}

	int main (string[] args) {
	    Gtk.init (ref args);
	    var ui = new InvoicesUI();
	    ui.create_widgets();
	    ui.connect_signals();
	    ui.show_all();
	    Gtk.main ();
	    return 0;
	}
}