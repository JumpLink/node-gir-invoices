export LD_LIBRARY_PATH := $(shell pwd)
export GI_TYPELIB_PATH := $(shell pwd)

all: vala-object.o vala-object.so ValaObject-0.1.typelib

run: all
	./vala-object.o
	node app.js

c-source:
	valac --ccode object.vala

vala-object.so:
	valac \
		--enable-experimental    \
		-X -fPIC -X -shared      \
		--library=vala-object    \
		--gir=ValaObject-0.1.gir \
		-o vala-object.so        \
		--pkg gtk+-3.0           \
		--pkg gee-1.0            \
		--pkg glib-2.0           \
		--pkg posix              \
		object.vala

vala-object.o:
	valac \
		-o vala-object.o         \
		--pkg gtk+-3.0           \
		--pkg gee-1.0            \
		--pkg posix              \
		--pkg glib-2.0           \
		object.vala

ValaObject-0.1.typelib:
	g-ir-compiler \
		--shared-library=vala-object.so \
		--output=ValaObject-0.1.typelib \
		ValaObject-0.1.gir

clean:
	rm -fr *.vapi *.gir *.so *.typelib *.o