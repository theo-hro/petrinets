var xmlns = "http://www.w3.org/2000/svg";
var hranabymove;
var plocha;
var nadplochou;
var transitions = new Array();
var places = new Array();
var arcs = new Array();
var bod = new point();
var previousMarking = {};
var kresli_sa_hrana = 0;
var source_hrany;
var polomer = 18;
var velkost = 36;
var posunutie_suradnic = 20;
var arrowHeadSize = 9;
var pocetmousedown = 0;
var sirkatextu = 0;
var fontfamily = "verdana";
var fontsize = 12;
var korekcia = 0.75 * fontsize;
var fontsizeoffset = 18;
var vahaoffset = 10;
var posuva_sa_hrana = 0;
var pocetmousedownposuv = 0;
var pocetmousedownposuvtran = 0;
var pocetmousedownposuvplace = 0;

var posuvanahrana;
var pomtext = "";
var tokenpolomer = 3;
var tokenposuv = 7;
var hybesaprechod = 0;
var hybesamiesto = 0;
var movedprechod;
var movedmiesto;
var id = 0;

var text = "";
var menofilu = "newmodel.xml";
var downloadLink;
var appwidth = 1880;
var appheight = 940;
var maxwidth = 10000;
var maxheight = 5000;
var minwidth = 640;
var minheight = 360;
var gridstep = 2 * posunutie_suradnic;
var minstep = 1;
var maxstep = 100;
var maxx = maxwidth - posunutie_suradnic;
var maxy = maxheight - posunutie_suradnic;
var modal;
var shade;
var insidemodal;
var helptext;




function novy_svg_transition(element, plocha, xmlns, x, y, velkost) {
    var svgelement = document.createElementNS(xmlns, "rect");

    svgelement.setAttributeNS(null, "x", x - velkost / 2);
    svgelement.setAttributeNS(null, "y", y - velkost / 2);
    svgelement.setAttributeNS(null, "width", velkost);
    svgelement.setAttributeNS(null, "height", velkost);
    svgelement.setAttributeNS(null, "fill", "white");
    svgelement.setAttributeNS(null, "stroke", "black");
    svgelement.setAttributeNS(null, "stroke-width", "2");
    plocha.appendChild(svgelement);

    var svgzamenom = document.createElementNS(xmlns, "rect");

    svgzamenom.setAttributeNS(null, "x", x);
    svgzamenom.setAttributeNS(null, "y", y + velkost / 2 + fontsizeoffset - korekcia);
    svgzamenom.setAttributeNS(null, "width", 0);
    svgzamenom.setAttributeNS(null, "height", fontsize);
    svgzamenom.setAttributeNS(null, "fill-opacity", "0.7");
    svgzamenom.setAttributeNS(null, "fill", "white");
    plocha.appendChild(svgzamenom);


    var svgmeno = document.createElementNS(xmlns, "text");
    svgmeno.setAttributeNS(null, "x", x);
    svgmeno.setAttributeNS(null, "y", y + velkost / 2 + fontsizeoffset);
    svgmeno.setAttributeNS(null, "font-size", fontsize);
    svgmeno.setAttributeNS(null, "font-family", fontfamily);
    var labelnode = document.createTextNode(element.label);
    svgmeno.appendChild(labelnode);
    plocha.appendChild(svgmeno);

    sirkatextu = svgmeno.getComputedTextLength();

    svgzamenom.setAttributeNS(null, "x", x - sirkatextu / 2);
    svgmeno.setAttributeNS(null, "x", x - sirkatextu / 2);




    svgelement.onmouseover = function () { if (!document.getElementById("fire").checked) { svgelement.setAttributeNS(null, "stroke", "blue"); element.over = 1; } };
    svgelement.onmouseout = function () { if (!document.getElementById("fire").checked) { svgelement.setAttributeNS(null, "stroke", "black"); element.over = 0; } };
    svgelement.onmousedown = function () {
        if (document.getElementById("delete").checked) {
            for (var i = 0; i < arcs.length; i++) {
                if (element === arcs[i].source || element === arcs[i].target) {
                    plocha.removeChild(arcs[i].objektyhrany.polyciarapod);
                    plocha.removeChild(arcs[i].objektyhrany.polyciara);
                    plocha.removeChild(arcs[i].objektyhrany.sipka);
                    arcs[i].objektyhrany.vahaelem.removeChild(arcs[i].objektyhrany.vaha);
                    plocha.removeChild(arcs[i].objektyhrany.vahaelem);
                    arcs.splice(i, 1);
                    i--;
                }
            }

            plocha.removeChild(svgelement);
            plocha.removeChild(svgzamenom);

            svgmeno.removeChild(labelnode);
            plocha.removeChild(svgmeno);
            var i = transitions.indexOf(element);
            transitions.splice(i, 1);
        }
        if (document.getElementById("arc").checked) {
            if (kresli_sa_hrana == 0) {
                source_hrany = element;
                kresli_sa_hrana = 1;
                bod.start_x = element.start_x + arrowHeadSize; //event.pageX - nadplochou.offsetLeft;
                bod.start_y = element.start_y; //event.pageY - nadplochou.offsetTop;
                hranabymove = novy_svg_temp_arc(plocha, xmlns, element, bod, "regular");
            }
            else {
                if (source_hrany.type != element.type) {
                    var actual = arcs.length;
                    arcs[actual] = new Arc(source_hrany, element, "regular");
                    var elem = arcs[actual].svgelement1;

                    elementypredhrany(); labelypredhranyprve();
                }

            }

        }

        if (document.getElementById("resetarc").checked) {
            if (kresli_sa_hrana != 0) {
                if (source_hrany.type != element.type) {
                    var actual = arcs.length;
                    arcs[actual] = new Arc(source_hrany, element, "reset");
                    var elem = arcs[actual].svgelement1;

                    elementypredhrany(); labelypredhranyprve();
                }

            }

        }

        if (document.getElementById("inhibitorarc").checked) {
            if (kresli_sa_hrana != 0) {
                if (source_hrany.type != element.type) {
                    var actual = arcs.length;
                    arcs[actual] = new Arc(source_hrany, element, "inhibitor");
                    var elem = arcs[actual].svgelement1;

                    elementypredhrany(); labelypredhranyprve();
                }

            }

        }

        if (document.getElementById("position").checked) {
            var doit = false;
            var novex = element.start_x;
            var novey = element.start_y;
            var a = prompt("Please enter x-coordinate of the transition (not smaller than " + posunutie_suradnic + " and not greater than " + maxx + " ):", element.start_x);
            if (a != null) {
                var x = parseInt(a);
                if (isNaN(x)) {
                    alert("x is not a number");
                } else {
                    if (x <= posunutie_suradnic || maxx <= x)
                        alert("x is out of dimension");
                    else {
                        novex = x;
                        doit = true;
                    }
                }
            }
            var b = prompt("Please enter y-coordinate of the transition (not smaller than " + posunutie_suradnic + " and not greater than " + maxy + " ):", element.start_y);
            if (b != null) {
                var y = parseInt(b);
                if (isNaN(y)) {
                    alert("y is not a number");
                } else {
                    if (y <= posunutie_suradnic || maxy <= y)
                        alert("y is out of dimension");
                    else {
                        novey = y;
                        doit = true;
                    }
                }
            }
            if (doit) {

                moveprechod(element, novex, novey);
            }

        }

        if (document.getElementById("move").checked) {
            if (hybesaprechod == 0) {
                hybesaprechod = 1;
                movedprechod = element;
            }


        }

        if (document.getElementById("label").checked) {

            var label = prompt("Please enter transition label", element.label);
            if (label != null) {
                element.label = label;
                labelnode.nodeValue = element.label;
                sirkatextu = svgmeno.getComputedTextLength();
                svgzamenom.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
                svgzamenom.setAttributeNS(null, "width", sirkatextu);
                svgmeno.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
            }
        }

        if (document.getElementById("fire").checked) {
            if (enabled(element)) {
                consume(element);
                produce(element);
                updatemarkings();
                if (document.getElementById("fire").checked) {
                    for (var i = 0; i < transitions.length; i++) {
                        if (enabled(transitions[i])) {
                            transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "green");
                            transitions[i].objektyelementu.element.setAttributeNS(null, "fill", "yellowgreen");

                        }
                        else {
                            transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "red");
                            transitions[i].objektyelementu.element.setAttributeNS(null, "fill", "white");
                        }
                    }

                }
            }
        }

    };

    svgmeno.onmousedown = function () {
        if (document.getElementById("label").checked) {

            var label = prompt("Please enter transition label", element.label);
            if (label != null) {
                element.label = label;
                labelnode.nodeValue = element.label;
                sirkatextu = svgmeno.getComputedTextLength();
                svgzamenom.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
                svgzamenom.setAttributeNS(null, "width", sirkatextu);
                svgmeno.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
            }
        }

    };
    svgmeno.onmouseout = function () { svgmeno.setAttributeNS(null, "fill", "black"); };
    svgmeno.onmouseover = function () { svgmeno.setAttributeNS(null, "fill", "blue"); };

    return new objektyelementu(svgelement, svgmeno, labelnode, svgzamenom);
}

function moveprechod(prechod, x, y) {
    prechod.start_x = x;
    prechod.start_y = y;
    prechod.objektyelementu.element.setAttributeNS(null, "x", x - velkost / 2);

    prechod.objektyelementu.element.setAttributeNS(null, "y", y - velkost / 2);
    prechod.objektyelementu.element.setAttributeNS(null, "stroke", "red");

    sirkatextu = prechod.objektyelementu.menoelem.getComputedTextLength();


    prechod.objektyelementu.zamenom.setAttributeNS(null, "x", x - sirkatextu / 2);
    prechod.objektyelementu.zamenom.setAttributeNS(null, "y", y + velkost / 2 + fontsizeoffset - korekcia);


    prechod.objektyelementu.menoelem.setAttributeNS(null, "x", x - sirkatextu / 2);
    prechod.objektyelementu.menoelem.setAttributeNS(null, "y", y + velkost / 2 + fontsizeoffset);



    for (var i = 0; i < arcs.length; i++) {
        if (prechod === arcs[i].source || prechod === arcs[i].target) {
            updatehranusvg(arcs[i]);
        }
    }

}

function objektyelementu(a, b, c, d) {
    this.element = a;
    this.menoelem = b;
    this.meno = c;
    this.zamenom = d;
}

function objektymiesta(a, b, c, d, e, f) {
    this.element = a;
    this.menoelem = b;
    this.meno = c;
    this.svgmarking = d;
    this.markingnode = e;
    this.zamenom = f;
}

function attachid() {
    id++;
    return id;

}

function Transition(start_x, start_y) {
    this.type = "transition";
    this.id = attachid();
    this.index = 0;
    this.start_x = start_x;
    this.start_y = start_y;
    this.velkost = velkost;
    this.label = "";
    this.over = 1;
    this.objektyelementu = novy_svg_transition(this, plocha, xmlns, start_x, start_y, this.velkost);
}

function updateindex() {
    for (var i = 0; i < transitions.length; i++) {
        transitions[i].index = i;
    }

    for (var i = 0; i < placess.length; i++) {
        places[i].index = i;
    }
}

function enabled(transition) {
    for (var i = 0; i < places.length; i++) {
        places[i].testmarking = places[i].marking;
    }

    for (var i = 0; i < arcs.length; i++) {
        if (arcs[i].target === transition && (arcs[i].arctype == "inhibitor") && (arcs[i].source.testmarking >= arcs[i].vaha)) {
            return false;
        }
    }

    for (var i = 0; i < arcs.length; i++) {
        if (arcs[i].target === transition && (arcs[i].arctype == "regular")) {
            arcs[i].source.testmarking = arcs[i].source.testmarking - arcs[i].vaha;
        }

    }
    for (var i = 0; i < places.length; i++) {
        if (places[i].testmarking < 0) {
            return false;
        }
    }


    return true;

}

function consume(transition) {
    for (var i = 0; i < arcs.length; i++) {
        if (arcs[i].target === transition && (arcs[i].arctype == "regular")) {
            arcs[i].source.marking = arcs[i].source.marking - arcs[i].vaha;
        }


    }
    for (var i = 0; i < arcs.length; i++) {
        if (arcs[i].target === transition && (arcs[i].arctype == "reset")) {
            arcs[i].source.marking = 0;

        }
    }

}

function updatemarkings() {
    for (var i = 0; i < places.length; i++) {
        updatetokeny(places[i]);
    }
}

function produce(transition) {
    for (var i = 0; i < arcs.length; i++) {
        if (arcs[i].source === transition) {
            arcs[i].target.marking = arcs[i].target.marking + arcs[i].vaha;
        }

    }

}

function novy_svg_place(element, plocha, xmlns, x, y, polomer) {
    var svgelement = document.createElementNS(xmlns, "circle");

    svgelement.setAttributeNS(null, "cx", x);
    svgelement.setAttributeNS(null, "cy", y);
    svgelement.setAttributeNS(null, "r", polomer);
    svgelement.setAttributeNS(null, "fill", "white");
    svgelement.setAttributeNS(null, "stroke", "black");
    if (element.static) {
        svgelement.setAttributeNS(null, "stroke-dasharray", "14, 5");
        svgelement.setAttributeNS(null, "stroke-width", "3");
    }
    else
        svgelement.setAttributeNS(null, "stroke-width", "2");

    plocha.appendChild(svgelement);

    tokeny(element);

    var svgzamenom = document.createElementNS(xmlns, "rect");

    svgzamenom.setAttributeNS(null, "x", x);
    svgzamenom.setAttributeNS(null, "y", y + polomer + fontsizeoffset - korekcia);
    svgzamenom.setAttributeNS(null, "width", 0);
    svgzamenom.setAttributeNS(null, "height", fontsize);
    svgzamenom.setAttributeNS(null, "fill-opacity", "0.7");
    svgzamenom.setAttributeNS(null, "fill", "white");
    plocha.appendChild(svgzamenom);


    var svgmeno = document.createElementNS(xmlns, "text");
    svgmeno.setAttributeNS(null, "x", x);
    svgmeno.setAttributeNS(null, "y", y + polomer + fontsizeoffset);
    svgmeno.setAttributeNS(null, "font-size", fontsize);
    svgmeno.setAttributeNS(null, "font-family", fontfamily);

    var labelnode = document.createTextNode(element.label);
    svgmeno.appendChild(labelnode);
    plocha.appendChild(svgmeno);
    sirkatextu = svgmeno.getComputedTextLength();

    svgzamenom.setAttributeNS(null, "x", x - sirkatextu / 2);
    svgmeno.setAttributeNS(null, "x", x - sirkatextu / 2);

    var svgmarking = document.createElementNS(xmlns, "text");
    svgmarking.setAttributeNS(null, "x", x);
    svgmarking.setAttributeNS(null, "y", y + fontsize / 2);
    svgmarking.setAttributeNS(null, "font-size", fontsize);
    svgmarking.setAttributeNS(null, "font-family", fontfamily);

    var markingnode = document.createTextNode(element.markinglabel);
    svgmarking.appendChild(markingnode);
    plocha.appendChild(svgmarking);
    sirkatextu = svgmarking.getComputedTextLength();


    svgmarking.setAttributeNS(null, "x", x - sirkatextu / 2);


    svgelement.onmouseover = function () { svgelement.setAttributeNS(null, "stroke", "blue"); element.over = 1; };
    svgelement.onmouseout = function () { svgelement.setAttributeNS(null, "stroke", "black"); element.over = 0; };
    svgelement.onmousedown = function () { onplacedown(element, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom) };

    for (var i = 0; i < element.markingtokens.length; i++) {
        element.markingtokens[i].onmouseover = function () { svgelement.setAttributeNS(null, "stroke", "blue"); element.over = 1; };
        element.markingtokens[i].onmouseout = function () { svgelement.setAttributeNS(null, "stroke", "black"); element.over = 0; };
        element.markingtokens[i].onmousedown = function () { onplacedown(element, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom) };
    }


    svgmarking.onmousedown = function () { onplacedown(element, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom) };
    svgmarking.onmouseover = function () { svgelement.setAttributeNS(null, "stroke", "blue"); element.over = 1; };
    svgmarking.onmouseout = function () { svgelement.setAttributeNS(null, "stroke", "black"); element.over = 0; };

    svgmeno.onmousedown = function () {
        if (document.getElementById("label").checked) {

            var label = prompt("Please enter place label", element.label);
            if (label != null) {
                element.label = label;
                labelnode.nodeValue = element.label;
                sirkatextu = svgmeno.getComputedTextLength();
                svgzamenom.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
                svgzamenom.setAttributeNS(null, "width", sirkatextu);
                svgmeno.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
            }
        }



    };
    svgmeno.onmouseout = function () { svgmeno.setAttributeNS(null, "fill", "black"); };
    svgmeno.onmouseover = function () { svgmeno.setAttributeNS(null, "fill", "blue"); };
    return new objektymiesta(svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom);
}

function onplacedown(element, svgelement, svgmeno, labelnode, svgmarking, markingnode, svgzamenom) {
    {
        if (document.getElementById("delete").checked) {
            for (var i = 0; i < arcs.length; i++) {
                if (element === arcs[i].source || element === arcs[i].target) {
                    plocha.removeChild(arcs[i].objektyhrany.polyciarapod);
                    plocha.removeChild(arcs[i].objektyhrany.polyciara);
                    plocha.removeChild(arcs[i].objektyhrany.sipka);
                    arcs[i].objektyhrany.vahaelem.removeChild(arcs[i].objektyhrany.vaha);
                    plocha.removeChild(arcs[i].objektyhrany.vahaelem);
                    arcs.splice(i, 1);
                    i--;
                }
            }
            plocha.removeChild(svgelement);
            plocha.removeChild(svgzamenom);
            svgmeno.removeChild(labelnode);
            plocha.removeChild(svgmeno);
            for (var i = 0; i < element.markingtokens.length; i++) {
                plocha.removeChild(element.markingtokens[i]);
            }
            svgmarking.removeChild(markingnode);
            plocha.removeChild(svgmarking);

            var j = places.indexOf(element);
            places.splice(j, 1);
        }
        if (document.getElementById("arc").checked) {
            if (kresli_sa_hrana == 0) {
                source_hrany = element;
                kresli_sa_hrana = 1;
                bod.start_x = element.start_x + arrowHeadSize; //event.pageX - plocha.getBoundingClientRect().left;
                bod.start_y = element.start_y; //event.pageY - plocha.getBoundingClientRect().top;
                hranabymove = novy_svg_temp_arc(plocha, xmlns, element, bod, "regular");
            }
            else {
                if (source_hrany.type != element.type) {
                    var actual = arcs.length;
                    arcs[actual] = new Arc(source_hrany, element, "regular");
                    var elem = arcs[actual].svgelement1;
                    elementypredhrany(); labelypredhranyprve();
                }

            }

        }
        if (document.getElementById("resetarc").checked) {
            if (kresli_sa_hrana == 0) {
                source_hrany = element;
                kresli_sa_hrana = 1;
                bod.start_x = element.start_x + arrowHeadSize; //event.pageX - plocha.getBoundingClientRect().left;
                bod.start_y = element.start_y; //event.pageY - plocha.getBoundingClientRect().top;
                hranabymove = novy_svg_temp_arc(plocha, xmlns, element, bod, "reset");
            }


        }

        if (document.getElementById("inhibitorarc").checked) {
            if (kresli_sa_hrana == 0) {
                source_hrany = element;
                kresli_sa_hrana = 1;
                bod.start_x = element.start_x + arrowHeadSize; //event.pageX - plocha.getBoundingClientRect().left;
                bod.start_y = element.start_y; //event.pageY - plocha.getBoundingClientRect().top;
                hranabymove = novy_svg_temp_arc(plocha, xmlns, element, bod, "inhibitor");
            }


        }

        if (document.getElementById("label").checked) {

            var label = prompt("Please enter place label", element.label);
            if (label != null) {
                element.label = label;
                labelnode.nodeValue = element.label;
                sirkatextu = svgmeno.getComputedTextLength();
                svgzamenom.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);
                svgzamenom.setAttributeNS(null, "width", sirkatextu);
                svgmeno.setAttributeNS(null, "x", element.start_x - sirkatextu / 2);

            }
        }
        if (document.getElementById("marking").checked) {

            updatemarkingsvg(element);
        }
        if (document.getElementById("addtoken").checked) {
            element.marking++;
            updatetokeny(element);
        }
        if (document.getElementById("removetoken").checked) {
            if (element.marking > 0) {
                element.marking--;
                updatetokeny(element);
            }
        }

        if (document.getElementById("position").checked) {
            var doit = false;
            var novex = element.start_x;
            var novey = element.start_y;
            var a = prompt("Please enter x-coordinate of the place (not smaller than " + posunutie_suradnic + " and not greater than " + maxx + " ):", element.start_x);
            if (a != null) {
                var x = parseInt(a);
                if (isNaN(x)) {
                    alert("x is not a number");
                } else {
                    if (x <= posunutie_suradnic || maxx <= x)
                        alert("x is out of dimension");
                    else {
                        novex = x;
                        doit = true;
                    }
                }
            }
            var b = prompt("Please enter y-coordinate of the place (not smaller than " + posunutie_suradnic + " and not greater than " + maxy + " ):", element.start_y);
            if (b != null) {
                var y = parseInt(b);
                if (isNaN(y)) {
                    alert("y is not a number");
                } else {
                    if (y <= posunutie_suradnic || maxy <= y)
                        alert("y is out of dimension");
                    else {
                        novey = y;
                        doit = true;
                    }
                }
            }
            if (doit) {

                movemiesto(element, novex, novey);
            }

        }


        if (document.getElementById("move").checked) {
            if (hybesamiesto == 0) {
                hybesamiesto = 1;
                movedmiesto = element;

            }


        }
    };
}



function elementypredhrany() {

    for (var i = 0; i < places.length; i++) {
        plocha.appendChild(places[i].objektymiesta.element);
        places[i].objektymiesta.element.setAttributeNS(null, "fill", "white");
        places[i].objektymiesta.element.setAttributeNS(null, "stroke", "black");
        if (places[i].static) {
            places[i].objektymiesta.element.setAttributeNS(null, "stroke-dasharray", "14, 5");
            places[i].objektymiesta.element.setAttributeNS(null, "stroke-width", "3");
        }
        else
            places[i].objektymiesta.element.setAttributeNS(null, "stroke-width", "2");

        for (var j = 0; j < places[i].markingtokens.length; j++) {
            plocha.appendChild(places[i].markingtokens[j]);
        }
        places[i].objektymiesta.svgmarking.appendChild(places[i].objektymiesta.markingnode);
        plocha.appendChild(places[i].objektymiesta.svgmarking);
    }
    updatemarkings();
    for (var i = 0; i < transitions.length; i++) {
        plocha.appendChild(transitions[i].objektyelementu.element);
        transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "black");
        transitions[i].objektyelementu.element.setAttributeNS(null, "fill", "white");

    }
}

function movemiesto(miesto, x, y) {
    miesto.start_x = x;
    miesto.start_y = y;

    miesto.objektymiesta.element.setAttributeNS(null, "cx", x);
    miesto.objektymiesta.element.setAttributeNS(null, "cy", y);
    miesto.objektymiesta.element.setAttributeNS(null, "stroke", "red");

    sirkatextu = miesto.objektymiesta.menoelem.getComputedTextLength();

    miesto.objektymiesta.zamenom.setAttributeNS(null, "x", x - sirkatextu / 2);
    miesto.objektymiesta.zamenom.setAttributeNS(null, "y", y + polomer + fontsizeoffset - korekcia);


    miesto.objektymiesta.menoelem.setAttributeNS(null, "x", x - sirkatextu / 2);
    miesto.objektymiesta.menoelem.setAttributeNS(null, "y", y + polomer + fontsizeoffset);

    updatepositionmarking(miesto);


    sirkatextu = miesto.objektymiesta.svgmarking.getComputedTextLength();
    miesto.objektymiesta.svgmarking.setAttributeNS(null, "x", x - sirkatextu / 2);

    miesto.objektymiesta.svgmarking.setAttributeNS(null, "y", y + fontsize / 2);



    for (var i = 0; i < arcs.length; i++) {
        if (miesto === arcs[i].source || miesto === arcs[i].target) {
            updatehranusvg(arcs[i]);
        }
    }

}

function Place(start_x, start_y, static) {
    this.type = "place";
    this.static = static;
    this.id = attachid();
    this.index = 0;
    this.start_x = start_x;
    this.start_y = start_y;
    this.polomer = polomer;
    this.label = "";
    this.over = 1;
    this.marking = 0;
    this.testmarking = 0;
    this.markinglabel = "";
    this.markingtokens = new Array();
    this.objektymiesta = novy_svg_place(this, plocha, xmlns, start_x, start_y, this.polomer);

}

function updatepositionmarking(place) {
    var x = place.start_x;
    var y = place.start_y;

    place.markingtokens[0].setAttributeNS(null, "cx", x);
    place.markingtokens[0].setAttributeNS(null, "cy", y);

    place.markingtokens[1].setAttributeNS(null, "cx", x + tokenposuv);
    place.markingtokens[1].setAttributeNS(null, "cy", y + tokenposuv);

    place.markingtokens[2].setAttributeNS(null, "cx", x - tokenposuv);
    place.markingtokens[2].setAttributeNS(null, "cy", y + tokenposuv);

    place.markingtokens[3].setAttributeNS(null, "cx", x + tokenposuv);
    place.markingtokens[3].setAttributeNS(null, "cy", y - tokenposuv);

    place.markingtokens[4].setAttributeNS(null, "cx", x - tokenposuv);
    place.markingtokens[4].setAttributeNS(null, "cy", y - tokenposuv);

    place.markingtokens[5].setAttributeNS(null, "cx", x - tokenposuv);
    place.markingtokens[5].setAttributeNS(null, "cy", y);

    place.markingtokens[6].setAttributeNS(null, "cx", x + tokenposuv);
    place.markingtokens[6].setAttributeNS(null, "cy", y);

    place.markingtokens[7].setAttributeNS(null, "cx", x);
    place.markingtokens[7].setAttributeNS(null, "cy", y - tokenposuv);

    place.markingtokens[8].setAttributeNS(null, "cx", x);
    place.markingtokens[8].setAttributeNS(null, "cy", y + tokenposuv);

}

function tokeny(place) {

    var x = place.start_x;
    var y = place.start_y;

    place.markingtokens[0] = document.createElementNS(xmlns, "circle");
    place.markingtokens[0].setAttributeNS(null, "cx", x);
    place.markingtokens[0].setAttributeNS(null, "cy", y);
    place.markingtokens[0].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[0].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[0]);

    place.markingtokens[1] = document.createElementNS(xmlns, "circle");
    place.markingtokens[1].setAttributeNS(null, "cx", x + tokenposuv);
    place.markingtokens[1].setAttributeNS(null, "cy", y + tokenposuv);
    place.markingtokens[1].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[1].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[1]);

    place.markingtokens[2] = document.createElementNS(xmlns, "circle");
    place.markingtokens[2].setAttributeNS(null, "cx", x - tokenposuv);
    place.markingtokens[2].setAttributeNS(null, "cy", y + tokenposuv);
    place.markingtokens[2].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[2].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[2]);

    place.markingtokens[3] = document.createElementNS(xmlns, "circle");
    place.markingtokens[3].setAttributeNS(null, "cx", x + tokenposuv);
    place.markingtokens[3].setAttributeNS(null, "cy", y - tokenposuv);
    place.markingtokens[3].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[3].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[3]);

    place.markingtokens[4] = document.createElementNS(xmlns, "circle");
    place.markingtokens[4].setAttributeNS(null, "cx", x - tokenposuv);
    place.markingtokens[4].setAttributeNS(null, "cy", y - tokenposuv);
    place.markingtokens[4].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[4].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[4]);

    place.markingtokens[5] = document.createElementNS(xmlns, "circle");
    place.markingtokens[5].setAttributeNS(null, "cx", x - tokenposuv);
    place.markingtokens[5].setAttributeNS(null, "cy", y);
    place.markingtokens[5].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[5].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[5]);

    place.markingtokens[6] = document.createElementNS(xmlns, "circle");
    place.markingtokens[6].setAttributeNS(null, "cx", x + tokenposuv);
    place.markingtokens[6].setAttributeNS(null, "cy", y);
    place.markingtokens[6].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[6].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[6]);

    place.markingtokens[7] = document.createElementNS(xmlns, "circle");
    place.markingtokens[7].setAttributeNS(null, "cx", x);
    place.markingtokens[7].setAttributeNS(null, "cy", y - tokenposuv);
    place.markingtokens[7].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[7].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[7]);

    place.markingtokens[8] = document.createElementNS(xmlns, "circle");
    place.markingtokens[8].setAttributeNS(null, "cx", x);
    place.markingtokens[8].setAttributeNS(null, "cy", y + tokenposuv);
    place.markingtokens[8].setAttributeNS(null, "r", tokenpolomer);
    place.markingtokens[8].setAttributeNS(null, "fill", "white");
    plocha.appendChild(place.markingtokens[8]);

}

function updatetokeny(place) {

    if (place.marking >= 0 && place.marking <= 9) {
        place.markinglabel = "";

    }
    else
        place.markinglabel = place.marking;


    switch (place.marking) {
        case 1:
            place.markingtokens[0].setAttributeNS(null, "fill", "black");
            place.markingtokens[1].setAttributeNS(null, "fill", "white");
            place.markingtokens[2].setAttributeNS(null, "fill", "white");
            place.markingtokens[3].setAttributeNS(null, "fill", "white");
            place.markingtokens[4].setAttributeNS(null, "fill", "white");
            place.markingtokens[5].setAttributeNS(null, "fill", "white");
            place.markingtokens[6].setAttributeNS(null, "fill", "white");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 2:
            place.markingtokens[0].setAttributeNS(null, "fill", "white");
            place.markingtokens[1].setAttributeNS(null, "fill", "white");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "white");
            place.markingtokens[5].setAttributeNS(null, "fill", "white");
            place.markingtokens[6].setAttributeNS(null, "fill", "white");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 3:
            place.markingtokens[0].setAttributeNS(null, "fill", "black");
            place.markingtokens[1].setAttributeNS(null, "fill", "white");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "white");
            place.markingtokens[5].setAttributeNS(null, "fill", "white");
            place.markingtokens[6].setAttributeNS(null, "fill", "white");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 4:
            place.markingtokens[0].setAttributeNS(null, "fill", "white");
            place.markingtokens[1].setAttributeNS(null, "fill", "black");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "black");
            place.markingtokens[5].setAttributeNS(null, "fill", "white");
            place.markingtokens[6].setAttributeNS(null, "fill", "white");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 5:
            place.markingtokens[0].setAttributeNS(null, "fill", "black");
            place.markingtokens[1].setAttributeNS(null, "fill", "black");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "black");
            place.markingtokens[5].setAttributeNS(null, "fill", "white");
            place.markingtokens[6].setAttributeNS(null, "fill", "white");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 6:
            place.markingtokens[0].setAttributeNS(null, "fill", "white");
            place.markingtokens[1].setAttributeNS(null, "fill", "black");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "black");
            place.markingtokens[5].setAttributeNS(null, "fill", "black");
            place.markingtokens[6].setAttributeNS(null, "fill", "black");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 7:
            place.markingtokens[0].setAttributeNS(null, "fill", "black");
            place.markingtokens[1].setAttributeNS(null, "fill", "black");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "black");
            place.markingtokens[5].setAttributeNS(null, "fill", "black");
            place.markingtokens[6].setAttributeNS(null, "fill", "black");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
            break;
        case 8:
            place.markingtokens[0].setAttributeNS(null, "fill", "white");
            place.markingtokens[1].setAttributeNS(null, "fill", "black");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "black");
            place.markingtokens[5].setAttributeNS(null, "fill", "black");
            place.markingtokens[6].setAttributeNS(null, "fill", "black");
            place.markingtokens[7].setAttributeNS(null, "fill", "black");
            place.markingtokens[8].setAttributeNS(null, "fill", "black");
            break;
        case 9:
            place.markingtokens[0].setAttributeNS(null, "fill", "black");
            place.markingtokens[1].setAttributeNS(null, "fill", "black");
            place.markingtokens[2].setAttributeNS(null, "fill", "black");
            place.markingtokens[3].setAttributeNS(null, "fill", "black");
            place.markingtokens[4].setAttributeNS(null, "fill", "black");
            place.markingtokens[5].setAttributeNS(null, "fill", "black");
            place.markingtokens[6].setAttributeNS(null, "fill", "black");
            place.markingtokens[7].setAttributeNS(null, "fill", "black");
            place.markingtokens[8].setAttributeNS(null, "fill", "black");
            break;
        default:
            place.markingtokens[0].setAttributeNS(null, "fill", "white");
            place.markingtokens[1].setAttributeNS(null, "fill", "white");
            place.markingtokens[2].setAttributeNS(null, "fill", "white");
            place.markingtokens[3].setAttributeNS(null, "fill", "white");
            place.markingtokens[4].setAttributeNS(null, "fill", "white");
            place.markingtokens[5].setAttributeNS(null, "fill", "white");
            place.markingtokens[6].setAttributeNS(null, "fill", "white");
            place.markingtokens[7].setAttributeNS(null, "fill", "white");
            place.markingtokens[8].setAttributeNS(null, "fill", "white");
    }

    place.objektymiesta.markingnode.nodeValue = place.markinglabel;
    sirkatextu = place.objektymiesta.svgmarking.getComputedTextLength();
    place.objektymiesta.svgmarking.setAttributeNS(null, "x", place.start_x - sirkatextu / 2);
}

function updatemarkingsvg(place) {

    place.objektymiesta.markingnode.nodeValue = place.markinglabel;
    var marking = place.marking;
    var zadane = prompt("Please enter a nonnegative place marking", place.marking);

    if (zadane != null) {
        marking = parseInt(zadane);


        if (isNaN(marking)) {
            alert("Not a number");

        }
        if (marking < 0)
            alert("Negative number");


        if (!isNaN(marking) && marking >= 0) {
            place.marking = marking;

            updatetokeny(place);

        }

    }


}

function novy_svg_temp_arc(plocha, xmlns, zaciatok, koniec, arctype) {
    var dx = koniec.start_x - zaciatok.start_x;
    var dy = koniec.start_y - zaciatok.start_y;
    var dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    var dlzkaskratena = dlzkahrany - arrowHeadSize + 2;
    var pomer = dlzkaskratena / dlzkahrany;
    var nx = zaciatok.start_x + dx * pomer;
    var ny = zaciatok.start_y + dy * pomer;



    var svgelement = document.createElementNS(xmlns, "polyline");

    svgelement.setAttributeNS(null, "points", zaciatok.start_x + "," + zaciatok.start_y + " " + nx + "," + ny);
    svgelement.setAttributeNS(null, "fill", "none");
    svgelement.setAttributeNS(null, "stroke-width", "2");

    svgelement.setAttributeNS(null, "stroke", "blue");

    plocha.appendChild(svgelement);

    var svgelement2;
    if (arctype == "inhibitor") {
        svgelement2 = document.createElementNS(xmlns, "circle");

        svgelement2.setAttributeNS(null, "cx", bodInhibitorSipky(zaciatok.start_x, zaciatok.start_y, koniec.start_x, koniec.start_y).start_x);
        svgelement2.setAttributeNS(null, "cy", bodInhibitorSipky(zaciatok.start_x, zaciatok.start_y, koniec.start_x, koniec.start_y).start_y);
        svgelement2.setAttributeNS(null, "r", arrowHeadSize / 2);
        svgelement2.setAttributeNS(null, "fill", "white");
        svgelement2.setAttributeNS(null, "stroke", "blue");
        svgelement2.setAttributeNS(null, "stroke-width", "2");



    }
    else {
        svgelement2 = document.createElementNS(xmlns, "polygon");
        svgelement2.setAttributeNS(null, "points", bodySipky(zaciatok.start_x, zaciatok.start_y, koniec.start_x, koniec.start_y, arctype));
        svgelement2.setAttributeNS(null, "fill", "blue");

        svgelement2.setAttributeNS(null, "stroke", "blue");
    }

    plocha.appendChild(svgelement2);


    return new objektyhranymove(svgelement, svgelement2, arctype);
}

function novy_svg_arc(element, plocha, nadplochou, xmlns, zaciatok, koniec) {

    var dx = koniec.start_x - zaciatok.start_x;
    var dy = koniec.start_y - zaciatok.start_y;
    var dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    var dlzkaskratena = dlzkahrany - arrowHeadSize + 2;
    var pomer = dlzkaskratena / dlzkahrany;
    var nx = zaciatok.start_x + dx * pomer;
    var ny = zaciatok.start_y + dy * pomer;

    var svgelement = document.createElementNS(xmlns, "polyline");

    svgelement.setAttributeNS(null, "points", zaciatok.start_x + "," + zaciatok.start_y + " " + nx + "," + ny);
    svgelement.setAttributeNS(null, "fill", "none");
    svgelement.setAttributeNS(null, "stroke-width", "4");

    svgelement.setAttributeNS(null, "stroke", "white");

    plocha.appendChild(svgelement);





    var svgelement1 = document.createElementNS(xmlns, "polyline");

    svgelement1.setAttributeNS(null, "points", zaciatok.start_x + "," + zaciatok.start_y + " " + nx + "," + ny);
    svgelement1.setAttributeNS(null, "fill", "none");
    svgelement1.setAttributeNS(null, "stroke-width", "2");

    svgelement1.setAttributeNS(null, "stroke", "black");

    plocha.appendChild(svgelement1);

    var svgelement2;
    if (element.arctype == "inhibitor") {
        svgelement2 = document.createElementNS(xmlns, "circle");

        svgelement2.setAttributeNS(null, "cx", bodInhibitorSipky(zaciatok.start_x, zaciatok.start_y, koniec.start_x, koniec.start_y).start_x);
        svgelement2.setAttributeNS(null, "cy", bodInhibitorSipky(zaciatok.start_x, zaciatok.start_y, koniec.start_x, koniec.start_y).start_y);
        svgelement2.setAttributeNS(null, "r", arrowHeadSize / 2);
        svgelement2.setAttributeNS(null, "fill", "white");
        svgelement2.setAttributeNS(null, "stroke", "black");
        svgelement2.setAttributeNS(null, "stroke-width", "2");


    }
    else {
        svgelement2 = document.createElementNS(xmlns, "polygon");
        svgelement2.setAttributeNS(null, "points", bodySipky(zaciatok.start_x, zaciatok.start_y, koniec.start_x, koniec.start_y, element.arctype));

        svgelement2.setAttributeNS(null, "fill", "black");
        svgelement2.setAttributeNS(null, "stroke", "black");
    }

    plocha.appendChild(svgelement2);

    var svgmeno = document.createElementNS(xmlns, "text");
    var bodvaha = bodvahy(zaciatok, koniec);
    svgmeno.setAttributeNS(null, "x", bodvaha.start_x);
    svgmeno.setAttributeNS(null, "y", bodvaha.start_y);
    svgmeno.setAttributeNS(null, "font-size", fontsize);
    svgmeno.setAttributeNS(null, "font-family", fontfamily);
    var labelnode = document.createTextNode(element.vahalabel);
    svgmeno.appendChild(labelnode);
    plocha.appendChild(svgmeno);



    svgmeno.setAttributeNS(null, "x", bodvaha.start_x - vahaoffset / 3);
    svgmeno.setAttributeNS(null, "y", bodvaha.start_y + vahaoffset / 2);

    svgelement.onmouseover = function () {
        svgelement1.setAttributeNS(null, "stroke", "blue");
        if (element.arctype == "inhibitor")
            svgelement2.setAttributeNS(null, "fill", "white");
        else
            svgelement2.setAttributeNS(null, "fill", "blue");
        svgelement2.setAttributeNS(null, "stroke", "blue");
    };

    svgelement.onmouseout = function () {
        svgelement1.setAttributeNS(null, "stroke", "black");
        if (element.arctype == "inhibitor")
            svgelement2.setAttributeNS(null, "fill", "white");
        else
            svgelement2.setAttributeNS(null, "fill", "black");
        svgelement2.setAttributeNS(null, "stroke", "black");
    };


    svgelement1.onmouseover = function () {
        svgelement1.setAttributeNS(null, "stroke", "blue");
        if (element.arctype == "inhibitor")
            svgelement2.setAttributeNS(null, "fill", "white");
        else
            svgelement2.setAttributeNS(null, "fill", "blue");
        svgelement2.setAttributeNS(null, "stroke", "blue");
    };

    svgelement1.onmouseout = function () {
        svgelement1.setAttributeNS(null, "stroke", "black");
        if (element.arctype == "inhibitor")
            svgelement2.setAttributeNS(null, "fill", "white");
        else
            svgelement2.setAttributeNS(null, "fill", "black");
        svgelement2.setAttributeNS(null, "stroke", "black");
    };


    svgelement.onmousedown = function (event) { mysdownnahrane(event, element, svgelement, svgelement1, svgelement2, labelnode, svgmeno) };

    svgelement1.onmousedown = function (event) { mysdownnahrane(event, element, svgelement, svgelement1, svgelement2, labelnode, svgmeno) };


    svgelement2.onmouseover = function () {
        svgelement1.setAttributeNS(null, "stroke", "blue");
        if (element.arctype == "inhibitor")
            svgelement2.setAttributeNS(null, "fill", "white");
        else
            svgelement2.setAttributeNS(null, "fill", "blue");
        svgelement2.setAttributeNS(null, "stroke", "blue");
    };
    svgelement2.onmouseout = function () {
        svgelement1.setAttributeNS(null, "stroke", "black");
        if (element.arctype == "inhibitor")
            svgelement2.setAttributeNS(null, "fill", "white");
        else
            svgelement2.setAttributeNS(null, "fill", "black");
        svgelement2.setAttributeNS(null, "stroke", "black");
    };
    svgelement2.onmousedown = function () {
        if (document.getElementById("delete").checked) {
            plocha.removeChild(svgelement);
            plocha.removeChild(svgelement1);
            plocha.removeChild(svgelement2);

            svgmeno.removeChild(labelnode);
            plocha.removeChild(svgmeno);

            var i = arcs.indexOf(element);
            arcs.splice(i, 1);
        }

    };
    svgmeno.onmousedown = function () {
        if (document.getElementById("arc_weight").checked && (element.arctype != "reset")) {

            var vaha = element.vaha;


            var zadane = prompt("Please enter positive arc weight", element.vaha);

            if (zadane != null) {
                vaha = parseInt(zadane);

                if (isNaN(vaha)) {
                    alert("Not a number");

                }
                if (vaha <= 0)
                    alert("Not positive number");


                if (!isNaN(vaha) && vaha > 0) {
                    element.vaha = vaha;
                    if (vaha == 1) {
                        element.vahalabel = "";
                    }
                    else
                        element.vahalabel = vaha;
                    labelnode.nodeValue = element.vahalabel;
                }

            }
        }
    };
    svgmeno.onmouseout = function () { svgmeno.setAttributeNS(null, "fill", "black"); };
    svgmeno.onmouseover = function () { svgmeno.setAttributeNS(null, "fill", "blue"); };

    return new objektyhrany(svgelement, svgelement1, svgelement2, svgmeno, labelnode);
}

function mysdownnahrane(event, element, svgelement, svgelement1, svgelement2, labelnode, svgmeno) {
    if (document.getElementById("delete").checked) {

        var novy_bod = new point();

        novy_bod.start_x = event.pageX - nadplochou.offsetLeft;

        novy_bod.start_y = event.pageY - nadplochou.offsetTop;
        var deletujembod = 0;

        for (var i = 1; i < element.bodyhrany.length - 1; i++) {
            if (Math.abs(element.bodyhrany[i].start_x - novy_bod.start_x) <= 5 && Math.abs(element.bodyhrany[i].start_y - novy_bod.start_y) <= 5) {
                element.bodyhrany.splice(i, 1);
                updatehranusvg(element);
                deletujembod = 1;
                break;
            }
        }
        if (deletujembod == 0) {
            plocha.removeChild(svgelement);
            plocha.removeChild(svgelement1);
            plocha.removeChild(svgelement2);
            svgmeno.removeChild(labelnode);
            plocha.removeChild(svgmeno);

            var i = arcs.indexOf(element);
            arcs.splice(i, 1);

        }
    }

    if (document.getElementById("position").checked) {



        var novy_bod = new point();

        novy_bod.start_x = event.pageX - nadplochou.offsetLeft;

        novy_bod.start_y = event.pageY - nadplochou.offsetTop;

        for (var i = 1; i < element.bodyhrany.length - 1; i++) {
            if (Math.abs(element.bodyhrany[i].start_x - novy_bod.start_x) <= 5 && Math.abs(element.bodyhrany[i].start_y - novy_bod.start_y) <= 5) {
                indexbodu = i;
                var doit = false;
                var novex = element.bodyhrany[i].start_x;
                var novey = element.bodyhrany[i].start_y;
                var a = prompt("Please enter x-coordinate of the point (not smaller than " + posunutie_suradnic + " and not greater than " + maxx + " ):", element.bodyhrany[i].start_x);
                if (a != null) {
                    var x = parseInt(a);
                    if (isNaN(x)) {
                        alert("x is not a number");
                    } else {
                        if (x <= posunutie_suradnic || maxx <= x)
                            alert("x is out of dimension");
                        else {
                            novex = x;
                            doit = true;
                        }
                    }
                }
                var b = prompt("Please enter y-coordinate of the point (not smaller than " + posunutie_suradnic + " and not greater than " + maxy + " ):", element.bodyhrany[i].start_y);
                if (b != null) {
                    var y = parseInt(b);
                    if (isNaN(y)) {
                        alert("y is not a number");
                    } else {
                        if (y <= posunutie_suradnic || maxy <= y)
                            alert("y is out of dimension");
                        else {
                            novey = y;
                            doit = true;
                        }
                    }
                }
                if (doit) {


                    element.bodyhrany[i].start_x = novex;
                    element.bodyhrany[i].start_y = novey;
                    updatehranusvg(element);
                }
                break;
            }
        }
    }

    if (document.getElementById("move").checked) {
        if (posuva_sa_hrana == 0) {


            var novy_bod = new point();

            novy_bod.start_x = event.pageX - nadplochou.offsetLeft;

            novy_bod.start_y = event.pageY - nadplochou.offsetTop;

            for (var i = 1; i < element.bodyhrany.length - 1; i++) {
                if (Math.abs(element.bodyhrany[i].start_x - novy_bod.start_x) <= 5 && Math.abs(element.bodyhrany[i].start_y - novy_bod.start_y) <= 5) {
                    indexbodu = i;
                    posuvanahrana = element;
                    posuva_sa_hrana = 1;
                    updatehranusvg(element);
                    break;
                }
            }

            if (posuva_sa_hrana == 0) {
                for (var i = 0; i < element.bodyhrany.length - 1; i++) {
                    var dx = element.bodyhrany[i + 1].start_x - element.bodyhrany[i].start_x;
                    var dy = element.bodyhrany[i + 1].start_y - element.bodyhrany[i].start_y;
                    var dxn = novy_bod.start_x - element.bodyhrany[i].start_x;
                    var dyn = novy_bod.start_y - element.bodyhrany[i].start_y;
                    var dlzkahrany = Math.sqrt(dx * dx + dy * dy);
                    var dlzkapomys = Math.sqrt(dxn * dxn + dyn * dyn);
                    var pomer = dlzkapomys / dlzkahrany;
                    var nx = element.bodyhrany[i].start_x + dx * pomer;
                    var ny = element.bodyhrany[i].start_y + dy * pomer;
                    if (Math.abs(nx - novy_bod.start_x) <= 2 && Math.abs(ny - novy_bod.start_y) <= 2) {
                        element.bodyhrany.splice(i + 1, 0, novy_bod);
                        indexbodu = i + 1;
                        posuvanahrana = element;
                        posuva_sa_hrana = 1;
                        updatehranusvg(element);
                        break;
                    }

                }
            }
        }
    }
    if (document.getElementById("arc_weight").checked && (element.arctype != "reset")) {

        var vaha = element.vaha;


        var zadane = prompt("Please enter positive arc weight", element.vaha);

        if (zadane != null) {
            vaha = parseInt(zadane);

            if (isNaN(vaha)) {
                alert("Not a number");

            }
            if (vaha <= 0)
                alert("Not positive number");


            if (!isNaN(vaha) && vaha > 0) {
                element.vaha = vaha;
                if (vaha == 1) {
                    element.vahalabel = "";
                }
                else
                    element.vahalabel = vaha;
                labelnode.nodeValue = element.vahalabel;
            }

        }
    }


}


function objektyhrany(a, b, c, d, e) {
    this.polyciarapod = a;
    this.polyciara = b;
    this.sipka = c;
    this.vahaelem = d;
    this.vaha = e;
}

function objektyhranymove(a, b, arctype) {
    this.polyciara = a;
    this.sipka = b;
    this.arctype = arctype;

}

function prvebodyhrany(source, target) {
    var polebodov = new Array();
    polebodov[0] = zaciatok_hrany(source, target);
    polebodov[1] = koniec_hrany(source, target);
    return polebodov;
}

function skrattemphranu(zaciatok, koniec) {
    var dx = koniec.start_x - zaciatok.start_x;
    var dy = koniec.start_y - zaciatok.start_y;
    var dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    var dlzkaskratena = dlzkahrany - arrowHeadSize + 2;
    var pomer = dlzkaskratena / dlzkahrany;
    var nx = zaciatok.start_x + dx * pomer;
    var ny = zaciatok.start_y + dy * pomer;

    return new point(nx, ny);

}

function skrathranu(element) {
    var i = element.bodyhrany.length - 2;
    var dx = element.bodyhrany[i + 1].start_x - element.bodyhrany[i].start_x;
    var dy = element.bodyhrany[i + 1].start_y - element.bodyhrany[i].start_y;
    var dlzkahrany = Math.sqrt(dx * dx + dy * dy);
    var dlzkaskratena = dlzkahrany - arrowHeadSize + 2;
    var pomer = dlzkaskratena / dlzkahrany;
    var nx = element.bodyhrany[i].start_x + dx * pomer;
    var ny = element.bodyhrany[i].start_y + dy * pomer;
    return new point(nx, ny);


}


function updatehranusvg(hrana) {
    var text = "";
    var last = hrana.bodyhrany.length - 1;
    var stred = parseInt(last / 2);

    if (hrana.bodyhrany.length > 2) {
        hrana.bodyhrany[0] = zaciatok_hrany(hrana.source, hrana.bodyhrany[1]);
        hrana.bodyhrany[last] = koniec_hrany(hrana.bodyhrany[last - 1], hrana.target);
    }
    else {
        hrana.bodyhrany[0] = zaciatok_hrany(hrana.source, hrana.target);
        hrana.bodyhrany[last] = koniec_hrany(hrana.source, hrana.target);
    } var bodvaha = bodvahy(hrana.bodyhrany[stred], hrana.bodyhrany[stred + 1]);
    for (var i = 0; i < hrana.bodyhrany.length - 1; i++) {
        text = text + hrana.bodyhrany[i].start_x + "," + hrana.bodyhrany[i].start_y + " ";

    }
    var skratenykoniec = skrathranu(hrana);
    text = text + skratenykoniec.start_x + "," + skratenykoniec.start_y;
    if (posuva_sa_hrana == 1) {
        hrana.objektyhrany.polyciara.setAttributeNS(null, "stroke", "red");
        hrana.objektyhrany.sipka.setAttributeNS(null, "stroke", "red");
        if (hrana.arctype == "inhibitor") {
            hrana.objektyhrany.sipka.setAttributeNS(null, "fill", "white");
        }
        else {
            hrana.objektyhrany.sipka.setAttributeNS(null, "fill", "red");
        }

    }
    else {
        hrana.objektyhrany.polyciara.setAttributeNS(null, "stroke", "black");

        hrana.objektyhrany.sipka.setAttributeNS(null, "stroke", "black");
        if (hrana.arctype == "inhibitor") {
            hrana.objektyhrany.sipka.setAttributeNS(null, "fill", "white");
        }
        else {
            hrana.objektyhrany.sipka.setAttributeNS(null, "fill", "black");

        }
    }

    hrana.objektyhrany.polyciarapod.setAttributeNS(null, "points", text);
    hrana.objektyhrany.polyciara.setAttributeNS(null, "points", text);

    if (hrana.arctype == "inhibitor") {

        hrana.objektyhrany.sipka.setAttributeNS(null, "cx", bodInhibitorSipky(hrana.bodyhrany[last - 1].start_x, hrana.bodyhrany[last - 1].start_y, hrana.bodyhrany[last].start_x, hrana.bodyhrany[last].start_y).start_x);
        hrana.objektyhrany.sipka.setAttributeNS(null, "cy", bodInhibitorSipky(hrana.bodyhrany[last - 1].start_x, hrana.bodyhrany[last - 1].start_y, hrana.bodyhrany[last].start_x, hrana.bodyhrany[last].start_y).start_y);




    }
    else {

        hrana.objektyhrany.sipka.setAttributeNS(null, "points", bodySipky(hrana.bodyhrany[last - 1].start_x, hrana.bodyhrany[last - 1].start_y, hrana.bodyhrany[last].start_x, hrana.bodyhrany[last].start_y, hrana.arctype));
    }



    hrana.objektyhrany.vahaelem.setAttributeNS(null, "x", bodvaha.start_x - vahaoffset / 3);
    hrana.objektyhrany.vahaelem.setAttributeNS(null, "y", bodvaha.start_y + vahaoffset / 2);


}

function Arc(source, target, arctype) {
    this.type = "arc";
    this.arctype = arctype;
    this.id = attachid();
    this.source = source;
    this.target = target;
    this.arrowHeadSize = arrowHeadSize;
    this.vaha = 1;
    this.vahalabel = "";
    this.bodyhrany = prvebodyhrany(source, target);
    this.objektyhrany = novy_svg_arc(this, plocha, nadplochou, xmlns, this.bodyhrany[0], this.bodyhrany[1]);




}

function bodvahy(startbod, endbod) {
    var startPoint_x = startbod.start_x;
    var startPoint_y = startbod.start_y;
    var endPoint_x = endbod.start_x;
    var endPoint_y = endbod.start_y;

    var dx = (endPoint_x - startPoint_x) / 2;
    var dy = (endPoint_y - startPoint_y) / 2;

    var length = Math.sqrt(dx * dx + dy * dy);
    var unitDx = dx / length;
    var unitDy = dy / length;
    var x; var y;
    if (dx >= 0 && dy >= 0) {
        x = (endPoint_x - dx + unitDy * vahaoffset);
        y = (endPoint_y - dy - unitDx * vahaoffset);
    }
    if (dx >= 0 && dy < 0) {

        x = (endPoint_x - dx - unitDy * vahaoffset);
        y = (endPoint_y - dy + unitDx * vahaoffset);


    }
    if (dx < 0 && dy > 0) {

        x = (endPoint_x - dx + unitDy * vahaoffset);
        y = (endPoint_y - dy - unitDx * vahaoffset);

    }
    if (dx < 0 && dy <= 0) {
        x = (endPoint_x - dx - unitDy * vahaoffset);
        y = (endPoint_y - dy + unitDx * vahaoffset);
    }


    var bodvaha = new point(x, y);

    return bodvaha;
}


function bodInhibitorSipky(startPoint_x, startPoint_y, endPoint_x, endPoint_y) {
    var dx = endPoint_x - startPoint_x;
    var dy = endPoint_y - startPoint_y;

    var length = Math.sqrt(dx * dx + dy * dy);
    var unitDx = dx / length;
    var unitDy = dy / length;

    var inhibitorPoint_x = (endPoint_x - unitDx * arrowHeadSize / 2);
    var inhibitorPoint_y = (endPoint_y - unitDy * arrowHeadSize / 2);

    return new point(inhibitorPoint_x, inhibitorPoint_y);



}

function bodySipky(startPoint_x, startPoint_y, endPoint_x, endPoint_y, arctype) {

    var dx = endPoint_x - startPoint_x;
    var dy = endPoint_y - startPoint_y;

    var length = Math.sqrt(dx * dx + dy * dy);
    var unitDx = dx / length;
    var unitDy = dy / length;

    var arrowPoint1_x = (endPoint_x - unitDx * arrowHeadSize - 0.5 * unitDy * arrowHeadSize);
    var arrowPoint1_y = (endPoint_y - unitDy * arrowHeadSize + 0.5 * unitDx * arrowHeadSize);

    var arrowPoint2_x = (endPoint_x - unitDx * arrowHeadSize + 0.5 * unitDy * arrowHeadSize);
    var arrowPoint2_y = (endPoint_y - unitDy * arrowHeadSize - 0.5 * unitDx * arrowHeadSize);

    if (arctype == "reset") {
        var arrowPoint3_x = (endPoint_x - unitDx * arrowHeadSize);
        var arrowPoint3_y = (endPoint_y - unitDy * arrowHeadSize);
        var arrowPoint4_x = (arrowPoint3_x - unitDx * arrowHeadSize - 0.5 * unitDy * arrowHeadSize);
        var arrowPoint4_y = (arrowPoint3_y - unitDy * arrowHeadSize + 0.5 * unitDx * arrowHeadSize);

        var arrowPoint5_x = (arrowPoint3_x - unitDx * arrowHeadSize + 0.5 * unitDy * arrowHeadSize);
        var arrowPoint5_y = (arrowPoint3_y - unitDy * arrowHeadSize - 0.5 * unitDx * arrowHeadSize);

        return (endPoint_x + "," + endPoint_y + " " + arrowPoint1_x + "," + arrowPoint1_y + " " + arrowPoint3_x + "," + arrowPoint3_y + " " + arrowPoint4_x + "," + arrowPoint4_y + " " + arrowPoint5_x + "," + arrowPoint5_y + " " + arrowPoint3_x + "," + arrowPoint3_y + " " + arrowPoint2_x + "," + arrowPoint2_y + " ");

    }

    return (endPoint_x + "," + endPoint_y + " " + arrowPoint1_x + "," + arrowPoint1_y + " " + arrowPoint2_x + "," + arrowPoint2_y + " ");
}

function point(x, y) {
    this.start_x = x;
    this.start_y = y;
}

function zaciatok_hrany(startElement, endElement) {

    var startPoint_x = startElement.start_x;
    var startPoint_y = startElement.start_y;
    var endPoint_x = endElement.start_x;
    var endPoint_y = endElement.start_y;
    var dx = endPoint_x - startPoint_x;
    var dy = endPoint_y - startPoint_y;

    var dlzka_hrany = Math.sqrt(dx * dx + dy * dy);
    var pdx = polomer * dx / dlzka_hrany;
    var pdy = polomer * dy / dlzka_hrany;
    var tdx = 0;

    if (dx * dx >= dy * dy) tdx = velkost / 2;
    else tdx = (velkost / 2) * (dx / dy);

    var tdy = 0;
    if (dx * dx >= dy * dy) tdy = (velkost / 2) * (dy / dx);
    else tdy = velkost / 2;

    if (startElement.type == "place") {

        var snovex = startPoint_x + pdx;
        var snovey = startPoint_y + pdy;
        return new point(snovex, snovey);
    }

    if (startElement.type == "transition") {
        if ((dx * dx >= dy * dy && dx >= 0) || (dx * dx < dy * dy && dy >= 0)) {


            var snovex = startPoint_x + tdx;
            var snovey = startPoint_y + tdy;
        }
        else {


            var snovex = startPoint_x - tdx;
            var snovey = startPoint_y - tdy;
        }
        return new point(snovex, snovey);
    }
}

function koniec_hrany(startElement, endElement) {

    var startPoint_x = startElement.start_x;
    var startPoint_y = startElement.start_y;
    var endPoint_x = endElement.start_x;
    var endPoint_y = endElement.start_y;
    var dx = endPoint_x - startPoint_x;
    var dy = endPoint_y - startPoint_y;

    var dlzka_hrany = Math.sqrt(dx * dx + dy * dy);
    var pdx = polomer * dx / dlzka_hrany;
    var pdy = polomer * dy / dlzka_hrany;
    var tdx = 0;

    if (dx * dx >= dy * dy) tdx = velkost / 2;
    else tdx = (velkost / 2) * (dx / dy);

    var tdy = 0;
    if (dx * dx >= dy * dy) tdy = (velkost / 2) * (dy / dx);
    else tdy = velkost / 2;

    if (endElement.type == "transition") {
        if ((dx * dx >= dy * dy && dx >= 0) || (dx * dx < dy * dy && dy >= 0)) {
            var tnovex = endPoint_x - tdx;
            var tnovey = endPoint_y - tdy;
        }
        else {
            var tnovex = endPoint_x + tdx;
            var tnovey = endPoint_y + tdy;
        }
        return new point(tnovex, tnovey);
    }

    if (endElement.type == "place") {
        var tnovex = endPoint_x - pdx;
        var tnovey = endPoint_y - pdy;
        return new point(tnovex, tnovey);
    }


}


function initialize() {
    plocha = document.getElementById("plocha_1");
    plocha.onselectstart = function () { return false };

    dolny_div = document.getElementById("dolny_div");

    horny_div = document.getElementById("horny_div");

    nadplochou = document.getElementById("nadplochou");

    modal = document.getElementById("modal");

    shade = document.getElementById("shade");
    insidemodal = document.getElementById("insidemodal");
    helptext = document.createTextNode("");

    plocha.addEventListener("mousedown", doMouseDown, false);
    plocha.addEventListener("mousemove", doMouseMove, false);

    plocha.setAttribute("style", "width:" + appwidth + "px; height:" + appheight + "px");
    nadplochou.setAttribute("style", "width:" + appwidth + "px; height:" + appheight + "px");
    dolny_div.setAttribute("style", "border-style: solid; border-width: 2px; width:" + appwidth + "px");
    horny_div.setAttribute("style", "border-style: solid; border-width: 2px; border-bottom:none; font-family:verdana; font-size:15px; width:" + appwidth + "px");


}


function doMouseMove(event) {
    var mys_x = event.pageX;
    var mys_y = event.pageY;

    mys_x = mys_x - nadplochou.offsetLeft;
    mys_y = mys_y - nadplochou.offsetTop;
    var posun;

    if (kresli_sa_hrana == 1 && (document.getElementById("arc").checked || document.getElementById("resetarc").checked || document.getElementById("inhibitorarc").checked)) {
        if (source_hrany.type == "place") posun = polomer + 2; else posun = velkost / 2 + 2;
        if (Math.abs(source_hrany.start_x - mys_x) > posun || Math.abs(source_hrany.start_y - mys_y) > posun) {
            if (source_hrany.start_x > mys_x) { mys_x = mys_x + 2; } if (source_hrany.start_x < mys_x) { mys_x = mys_x - 2; }
            if (source_hrany.start_y > mys_y) { mys_y = mys_y + 2; } if (source_hrany.start_y < mys_y) { mys_y = mys_y - 2; }
            var koniech = new point(mys_x, mys_y);
            var dx = koniech.start_x - source_hrany.start_x;
            var dy = koniech.start_y - source_hrany.start_y;
            var dlzkahrany = Math.sqrt(dx * dx + dy * dy);
            var dlzkaskratena = dlzkahrany - arrowHeadSize + 2;
            var pomer = dlzkaskratena / dlzkahrany;
            var nx = source_hrany.start_x + dx * pomer;
            var ny = source_hrany.start_y + dy * pomer;
            var start = zaciatok_hrany(source_hrany, koniech);
        }

        hranabymove.polyciara.setAttributeNS(null, "points", start.start_x + "," + start.start_y + " " + nx + "," + ny);

        if (document.getElementById("inhibitorarc").checked) {
            hranabymove.sipka.setAttributeNS(null, "cx", bodInhibitorSipky(start.start_x, start.start_y, mys_x, mys_y).start_x);
            hranabymove.sipka.setAttributeNS(null, "cy", bodInhibitorSipky(start.start_x, start.start_y, mys_x, mys_y).start_y);


        }
        else

            hranabymove.sipka.setAttributeNS(null, "points", bodySipky(start.start_x, start.start_y, mys_x, mys_y, hranabymove.arctype));


    }
    if (posuva_sa_hrana == 1 && document.getElementById("move").checked) {
        posuvanahrana.bodyhrany[indexbodu].start_x = mys_x;
        posuvanahrana.bodyhrany[indexbodu].start_y = mys_y;

        updatehranusvg(posuvanahrana);

    }

    if (hybesaprechod == 1 && document.getElementById("move").checked) {

        moveprechod(movedprechod, mys_x, mys_y);
    }

    if (hybesamiesto == 1 && document.getElementById("move").checked) {

        movemiesto(movedmiesto, mys_x, mys_y);
    }

}

function korekcia_x(x) {
    var xx = x;
    if (xx < posunutie_suradnic)
        xx = posunutie_suradnic;


    if (xx > appwidth - posunutie_suradnic)
        xx = appwidth - posunutie_suradnic;


    return xx;
}

function korekcia_y(y) {
    var yy = y;
    if (yy < posunutie_suradnic)
        yy = posunutie_suradnic;

    if (yy > appheight - posunutie_suradnic)
        yy = appheight - posunutie_suradnic;

    return yy;
}

function korekcia_max_x(x) {
    var xx = x;
    if (xx > maxx)
        xx = maxx;


    return xx;
}

function korekcia_max_y(y) {
    var yy = y;
    if (yy > maxy)
        yy = maxy;


    return yy;
}


function doMouseDown(event) {
    var mys_x = event.pageX;
    var mys_y = event.pageY;

    mys_x = mys_x - nadplochou.offsetLeft;
    mys_y = mys_y - nadplochou.offsetTop;

    mys_x = korekcia_x(mys_x);
    mys_y = korekcia_y(mys_y);



    if (kresli_sa_hrana == 1) {
        pocetmousedown++;

    }
    if (pocetmousedown == 2 && kresli_sa_hrana == 1) {
        plocha.removeChild(hranabymove.polyciara);
        plocha.removeChild(hranabymove.sipka);
        pocetmousedown = 0; kresli_sa_hrana = 0;


    }

    if (posuva_sa_hrana == 1) {
        pocetmousedownposuv++;


    }
    if (pocetmousedownposuv == 2 && posuva_sa_hrana == 1) {
        posuvanahrana.bodyhrany[indexbodu].start_x = mys_x;
        posuvanahrana.bodyhrany[indexbodu].start_y = mys_y;



        pocetmousedownposuv = 0; posuva_sa_hrana = 0;
        updatehranusvg(posuvanahrana);


    }
    if (hybesaprechod == 1) {
        pocetmousedownposuvtran++;
    }

    if (pocetmousedownposuvtran == 2 && hybesaprechod == 1) {

        pocetmousedownposuvtran = 0; hybesaprechod = 0;
        moveprechod(movedprechod, mys_x, mys_y);
        movedprechod.objektyelementu.element.setAttributeNS(null, "stroke", "blue");



    }

    if (hybesamiesto == 1) {
        pocetmousedownposuvplace++;
    }

    if (pocetmousedownposuvplace == 2 && hybesamiesto == 1) {

        pocetmousedownposuvplace = 0; hybesamiesto = 0;
        movemiesto(movedmiesto, mys_x, mys_y);
        movedmiesto.objektymiesta.element.setAttributeNS(null, "stroke", "blue");



    }


    if (document.getElementById("transition").checked) {
        var actual = transitions.length;
        transitions[actual] = new Transition(mys_x, mys_y);

    }

    if (document.getElementById("place").checked) {
        var places_actual = places.length;
        places[places_actual] = new Place(mys_x, mys_y, false);
    }

    if (document.getElementById("staticplace").checked) {
        var places_actual = places.length;
        places[places_actual] = new Place(mys_x, mys_y, true);
    }




}

function resetMarking() {
    console.log("resetting");
    document.getElementById("fire").checked = false;
    places.forEach(p => {
        if (p.id in previousMarking) {
            p.marking = previousMarking[p.id];
            p.testmarking = previousMarking[p.id];
        }
    });
    updatemarkings();
    reset();
}

function reset() {
    reset_hranu();

    if (document.getElementById("fire").checked) {
        previousMarking = {};
        places.forEach(p => {
            previousMarking[p.id] = p.marking;
        });
        for (var i = 0; i < transitions.length; i++) {
            if (enabled(transitions[i])) {
                transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "green");
                transitions[i].objektyelementu.element.setAttributeNS(null, "fill", "yellowgreen");

            }
            else {
                transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "red");
            }
        }

    }
    if (!document.getElementById("fire").checked) {
        for (var i = 0; i < transitions.length; i++) {

            transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "black");
            transitions[i].objektyelementu.element.setAttributeNS(null, "fill", "white");

        }

    }
}

function reset_hranu() {
    if (posuva_sa_hrana == 1) {

        posuvanahrana.objektyhrany.polyciara.setAttributeNS(null, "stroke", "black");
        if (posuvanahrana.arctype == "inhibitor")
            posuvanahrana.objektyhrany.sipka.setAttributeNS(null, "fill", "white");
        else
            posuvanahrana.objektyhrany.sipka.setAttributeNS(null, "fill", "black");

        posuvanahrana.objektyhrany.sipka.setAttributeNS(null, "stroke", "black");

        pocetmousedownposuv = 0; posuva_sa_hrana = 0;
    }
    if (kresli_sa_hrana == 1) {

        plocha.removeChild(hranabymove.polyciara);
        plocha.removeChild(hranabymove.sipka);
        pocetmousedown = 0; kresli_sa_hrana = 0;
    }





}


//// open save methods

function exportasXML(format) {

    var textnazapis = generujXML(format);
    if (format == 1)
        var menosuboru = prompt("Please enter the file name", menofilu);
    if (format == 2)
        var menosuboru = prompt("Please enter the file name", menofilu + ".pflow");

    if (menosuboru != null) {
        menofilu = menosuboru;
        var xmlakoBlob = null;
        if (window.Blob) {
            xmlakoBlob = new Blob([textnazapis], { type: 'text/plain;charset=utf-8' });
        }


        if (xmlakoBlob != null) {
            if (window.navigator.msSaveBlob !== undefined) {
                window.navigator.msSaveBlob(xmlakoBlob, menofilu);
            } else {
                downloadLink = document.createElement("a");
                downloadLink.download = menofilu;
                downloadLink.innerHTML = "Download Model" + menofilu;
                if (window.webkitURL !== undefined) {
                    downloadLink.href = window.webkitURL.createObjectURL(xmlakoBlob);
                }
                else {
                    if (window.URL.createObjectURL !== undefined) {
                        downloadLink.href = window.URL.createObjectURL(xmlakoBlob);
                        downloadLink.onclick = zavripokliku;
                        downloadLink.style.display = "none";
                        document.body.appendChild(downloadLink);
                    }
                } downloadLink.click();
            }
            document.getElementById('menofilu').innerHTML = menofilu;
        }
    }
}

function exportasSVG() {
    var prevodnik = new XMLSerializer();
    var textnazapis = prevodnik.serializeToString(plocha);
    var menosuboru = prompt("Please enter the file name", menofilu + ".svg");
    if (menosuboru != null) {
        var xmlakoBlob = null;
        if (window.Blob) {
            xmlakoBlob = new Blob([textnazapis], { type: 'text/plain;charset=utf-8' });
        }


        if (xmlakoBlob != null) {
            if (window.navigator.msSaveBlob !== undefined) {
                window.navigator.msSaveBlob(xmlakoBlob, menosuboru);
            } else {
                downloadLink = document.createElement("a");
                downloadLink.download = menosuboru;
                downloadLink.innerHTML = "Download Model" + menosuboru;
                if (window.webkitURL !== undefined) {
                    downloadLink.href = window.webkitURL.createObjectURL(xmlakoBlob);
                }
                else {
                    if (window.URL.createObjectURL !== undefined) {
                        downloadLink.href = window.URL.createObjectURL(xmlakoBlob);
                        downloadLink.onclick = zavripokliku;
                        downloadLink.style.display = "none";
                        document.body.appendChild(downloadLink);
                    }
                } downloadLink.click();
            }
        }
    }
}


function zavripokliku(event) {
    document.body.removeChild(event.target);
}

var otvorFile = function (event) {
    var subor = event.target.files[0];
    menofilu = subor.name;
    document.getElementById('menofilu').innerHTML = menofilu;


    var citac = new FileReader();
    citac.onload = function () {
        text = citac.result;
        nacitajxml(mojparser(text));
        document.getElementById('otvorSubor').value = "";
    };

    citac.readAsText(subor);
};



function mojparser(txt) {
    if (window.DOMParser) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(txt, "text/xml");
    }
    else // Internet Explorer
    {
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(txt);
    }
    return xmlDoc;
}


function nacitajxml(xmlDoc) {
    deleteall();
    var x_min = posunutie_suradnic;
    var y_min = posunutie_suradnic;


    var xmltransitions = xmlDoc.getElementsByTagName("transition");
    transitions = new Array();

    for (var i = 0; i < xmltransitions.length; i++) {

        var xx = parseInt(xmltransitions[i].getElementsByTagName("x")[0].childNodes[0].nodeValue);
        var yy = parseInt(xmltransitions[i].getElementsByTagName("y")[0].childNodes[0].nodeValue);

        if (xx < x_min) {
            x_min = xx;
        }

        if (yy < y_min) {
            y_min = yy;
        }
    }

    var xmlplaces = xmlDoc.getElementsByTagName("place");

    for (var i = 0; i < xmlplaces.length; i++) {

        var xx = parseInt(xmlplaces[i].getElementsByTagName("x")[0].childNodes[0].nodeValue);
        var yy = parseInt(xmlplaces[i].getElementsByTagName("y")[0].childNodes[0].nodeValue);

        if (xx < x_min) {
            x_min = xx;
        }

        if (yy < y_min) {
            y_min = yy;
        }
    }

    var xmlarcs = xmlDoc.getElementsByTagName("arc");

    for (var i = 0; i < xmlarcs.length; i++) {
        if (xmlarcs[i].getElementsByTagName("breakPoint").length > 0) {
            var bodyxml = xmlarcs[i].getElementsByTagName("breakPoint");



            for (var j = 0; j < bodyxml.length; j++) {

                var xx = parseInt(bodyxml[j].getElementsByTagName("x")[0].childNodes[0].nodeValue)
                var yy = parseInt(bodyxml[j].getElementsByTagName("y")[0].childNodes[0].nodeValue);

                if (xx < x_min) {
                    x_min = xx;
                }

                if (yy < y_min) {
                    y_min = yy;
                }

            }
        }
    }



    var x_korekcia = 0;

    if (posunutie_suradnic > x_min) {
        x_korekcia = posunutie_suradnic - x_min;
    }

    var y_korekcia = 0;

    if (posunutie_suradnic > y_min) {
        y_korekcia = posunutie_suradnic - y_min;

    }
    for (var i = 0; i < xmltransitions.length; i++) {

        var xx = parseInt(xmltransitions[i].getElementsByTagName("x")[0].childNodes[0].nodeValue) + x_korekcia;
        var yy = parseInt(xmltransitions[i].getElementsByTagName("y")[0].childNodes[0].nodeValue) + y_korekcia;

        xx = korekcia_max_x(xx);
        yy = korekcia_max_y(yy);
        transitions[i] = new Transition(xx, yy);


        transitions[i].id = parseInt(xmltransitions[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (id <= transitions[i].id)
            id = transitions[i].id;

        if (xmltransitions[i].getElementsByTagName("label").length > 0) {
            if (xmltransitions[i].getElementsByTagName("label")[0].childNodes.length != 0) {
                transitions[i].label = xmltransitions[i].getElementsByTagName("label")[0].childNodes[0].nodeValue;
                transitions[i].objektyelementu.meno.nodeValue = transitions[i].label;
            }
        }
    }


    places = new Array();

    for (var i = 0; i < xmlplaces.length; i++) {
        var xx = parseInt(xmlplaces[i].getElementsByTagName("x")[0].childNodes[0].nodeValue) + x_korekcia;
        var yy = parseInt(xmlplaces[i].getElementsByTagName("y")[0].childNodes[0].nodeValue) + y_korekcia;

        xx = korekcia_max_x(xx);
        yy = korekcia_max_y(yy);



        var static = false;
        if (xmlplaces[i].getElementsByTagName("isStatic").length > 0) {
            if (xmlplaces[i].getElementsByTagName("isStatic")[0].childNodes.length != 0) {

                static = (xmlplaces[i].getElementsByTagName("isStatic")[0].childNodes[0].nodeValue == "true");

            }
        }
        if (xmlplaces[i].getElementsByTagName("static").length > 0) {
            if (xmlplaces[i].getElementsByTagName("static")[0].childNodes.length != 0) {

                static = (xmlplaces[i].getElementsByTagName("static")[0].childNodes[0].nodeValue == "true");

            }
        }

        places[i] = new Place(xx, yy, static);



        places[i].id = parseInt(xmlplaces[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);

        if (id <= places[i].id)
            id = places[i].id;

        places[i].marking = parseInt(xmlplaces[i].getElementsByTagName("tokens")[0].childNodes[0].nodeValue);



        updatetokeny(places[i]);
        if (xmlplaces[i].getElementsByTagName("label").length > 0) {
            if (xmlplaces[i].getElementsByTagName("label")[0].childNodes.length != 0) {
                places[i].label = xmlplaces[i].getElementsByTagName("label")[0].childNodes[0].nodeValue;
                places[i].objektymiesta.meno.nodeValue = places[i].label;
            }
        }


    }




    arcs = new Array();
    var source;
    var target;



    for (i = 0; i < xmlarcs.length; i++) {
        var ind = arcs.length;
        var nasielsomsource = 0;
        for (var j = 0; j < places.length; j++) {
            if (places[j].id == xmlarcs[i].getElementsByTagName("sourceId")[0].childNodes[0].nodeValue) {

                source = places[j];
                nasielsomsource = 1;
                break;
            }
        }
        if (nasielsomsource == 0) {
            for (var j = 0; j < transitions.length; j++) {
                if (transitions[j].id == xmlarcs[i].getElementsByTagName("sourceId")[0].childNodes[0].nodeValue) {

                    source = transitions[j];
                    nasielsomsource = 2;
                    break;
                }
            }
        }


        if (nasielsomsource == 2) {
            for (var j = 0; j < places.length; j++) {
                if (places[j].id == xmlarcs[i].getElementsByTagName("destinationId")[0].childNodes[0].nodeValue) {

                    target = places[j];
                    break;
                }
            }
        }
        if (nasielsomsource == 1) {
            for (var j = 0; j < transitions.length; j++) {
                if (transitions[j].id == xmlarcs[i].getElementsByTagName("destinationId")[0].childNodes[0].nodeValue) {

                    target = transitions[j];
                    break;
                }
            }
        }


        var parsed_arc_type = "regular";

        if (xmlarcs[i].getElementsByTagName("type").length > 0) {
            if (xmlarcs[i].getElementsByTagName("type")[0].childNodes.length != 0)
                parsed_arc_type = xmlarcs[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
        }
        arcs[ind] = new Arc(source, target, parsed_arc_type);


        if (xmlarcs[i].getElementsByTagName("id").length > 0) {
            arcs[ind].id = parseInt(xmlarcs[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
        }


        if (id <= arcs[i].id)
            id = arcs[i].id;



        arcs[ind].vaha = parseInt(xmlarcs[i].getElementsByTagName("multiplicity")[0].childNodes[0].nodeValue);

        if (arcs[ind].vaha == 1) {
            arcs[ind].vahalabel = "";
        }
        else
            arcs[ind].vahalabel = arcs[ind].vaha;
        arcs[ind].objektyhrany.vaha.nodeValue = arcs[ind].vahalabel;


        elementypredhrany;

        if (xmlarcs[i].getElementsByTagName("breakPoint").length > 0) {
            var bodyxml = xmlarcs[i].getElementsByTagName("breakPoint");


            var xx;
            var yy;

            for (var j = 0; j < bodyxml.length; j++) {

                xx = parseInt(bodyxml[j].getElementsByTagName("x")[0].childNodes[0].nodeValue) + x_korekcia;
                yy = parseInt(bodyxml[j].getElementsByTagName("y")[0].childNodes[0].nodeValue) + y_korekcia;
                xx = korekcia_max_x(xx);
                yy = korekcia_max_y(yy);


                arcs[ind].bodyhrany[j + 1] = new point(xx, yy);


            }
            arcs[ind].bodyhrany[j + 1] = new point(posunutie_suradnic, posunutie_suradnic);
        }


        updatehranusvg(arcs[ind]);

    }
    elementypredhrany();
    labelypredhranyprve();
}

function labelypredhranyprve() {
    for (var i = 0; i < places.length; i++) {
        plocha.appendChild(places[i].objektymiesta.zamenom);
        plocha.appendChild(places[i].objektymiesta.menoelem);
        sirkatextu = places[i].objektymiesta.menoelem.getComputedTextLength();
        places[i].objektymiesta.zamenom.setAttributeNS(null, "x", places[i].start_x - sirkatextu / 2);
        places[i].objektymiesta.zamenom.setAttributeNS(null, "width", sirkatextu);
        places[i].objektymiesta.menoelem.setAttributeNS(null, "x", places[i].start_x - sirkatextu / 2);

    }
    for (var i = 0; i < transitions.length; i++) {
        plocha.appendChild(transitions[i].objektyelementu.zamenom);
        plocha.appendChild(transitions[i].objektyelementu.menoelem);
        sirkatextu = transitions[i].objektyelementu.menoelem.getComputedTextLength();

        transitions[i].objektyelementu.zamenom.setAttributeNS(null, "x", transitions[i].start_x - sirkatextu / 2);
        transitions[i].objektyelementu.zamenom.setAttributeNS(null, "width", sirkatextu);
        transitions[i].objektyelementu.menoelem.setAttributeNS(null, "x", transitions[i].start_x - sirkatextu / 2);

    }
}

function deleteall() {

    for (var i = 0; i < arcs.length; i++) {
        plocha.removeChild(arcs[i].objektyhrany.polyciarapod);
        plocha.removeChild(arcs[i].objektyhrany.polyciara);
        plocha.removeChild(arcs[i].objektyhrany.sipka);
        arcs[i].objektyhrany.vahaelem.removeChild(arcs[i].objektyhrany.vaha);
        plocha.removeChild(arcs[i].objektyhrany.vahaelem);
    }
    arcs.splice(0, arcs.length);

    for (var i = 0; i < transitions.length; i++) {
        plocha.removeChild(transitions[i].objektyelementu.element);
        plocha.removeChild(transitions[i].objektyelementu.zamenom);
        transitions[i].objektyelementu.menoelem.removeChild(transitions[i].objektyelementu.meno);
        plocha.removeChild(transitions[i].objektyelementu.menoelem);

    }
    transitions.splice(0, transitions.length);

    for (var i = 0; i < places.length; i++) {

        plocha.removeChild(places[i].objektymiesta.element);
        plocha.removeChild(places[i].objektymiesta.zamenom);
        places[i].objektymiesta.menoelem.removeChild(places[i].objektymiesta.meno);
        plocha.removeChild(places[i].objektymiesta.menoelem);
        for (var j = 0; j < places[i].markingtokens.length; j++) {
            plocha.removeChild(places[i].markingtokens[j]);
        }
        places[i].objektymiesta.svgmarking.removeChild(places[i].objektymiesta.markingnode);
        plocha.removeChild(places[i].objektymiesta.svgmarking);
    }
    places.splice(0, places.length);

    id = 0;
}

function clearmodel() {
    if (places.length > 0 || transitions.length > 0) {
        var c = confirm("Are you sure to clear? Any unsaved changes will be lost.");
        if (c) {
            deleteall();
            menofilu = "newmodel.xml";
            document.getElementById('menofilu').innerHTML = menofilu;
        }
    }
    else {
        deleteall();
        menofilu = "newmodel.xml";
        document.getElementById('menofilu').innerHTML = menofilu;
    }
}

function generujXML(format) {
    var xmltext = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<document>\n";
    if (format == 2)
        xmltext = xmltext + "<subnet>\n";

    for (var i = 0; i < places.length; i++) {
        xmltext = xmltext + "<place>\n";
        xmltext = xmltext + "<id>" + places[i].id + "</id>\n";
        xmltext = xmltext + "<x>" + places[i].start_x + "</x>\n";
        xmltext = xmltext + "<y>" + places[i].start_y + "</y>\n";
        xmltext = xmltext + "<label>" + places[i].label + "</label>\n";
        xmltext = xmltext + "<tokens>" + places[i].marking + "</tokens>\n";
        if (format == 1)
            xmltext = xmltext + "<static>" + places[i].static + "</static>\n";
        if (format == 2)
            xmltext = xmltext + "<isStatic>" + places[i].static + "</isStatic>\n";

        xmltext = xmltext + "</place>\n";
    }

    for (var i = 0; i < transitions.length; i++) {
        xmltext = xmltext + "<transition>\n";
        xmltext = xmltext + "<id>" + transitions[i].id + "</id>\n";
        xmltext = xmltext + "<x>" + transitions[i].start_x + "</x>\n";
        xmltext = xmltext + "<y>" + transitions[i].start_y + "</y>\n";
        xmltext = xmltext + "<label>" + transitions[i].label + "</label>\n";
        xmltext = xmltext + "</transition>\n";
    }

    for (var i = 0; i < arcs.length; i++) {
        xmltext = xmltext + "<arc>\n";
        xmltext = xmltext + "<id>" + arcs[i].id + "</id>\n";
        xmltext = xmltext + "<type>" + arcs[i].arctype + "</type>\n";
        xmltext = xmltext + "<sourceId>" + arcs[i].source.id + "</sourceId>\n";
        xmltext = xmltext + "<destinationId>" + arcs[i].target.id + "</destinationId>\n";
        xmltext = xmltext + "<multiplicity>" + arcs[i].vaha + "</multiplicity>\n";
        for (var j = 1; j < arcs[i].bodyhrany.length - 1; j++) {
            xmltext = xmltext + "<breakPoint><x>" + arcs[i].bodyhrany[j].start_x + "</x><y>" + arcs[i].bodyhrany[j].start_y + "</y></breakPoint>\n";
        }
        xmltext = xmltext + "</arc>\n";
    }
    if (format == 2)
        xmltext = xmltext + "</subnet>\n";

    xmltext = xmltext + "</document>";
    return xmltext;
}


function setDimension() {
    var doit = false;
    var a = prompt("Please enter width (min width is " + minwidth + ", max width is " + maxwidth + "):", appwidth);
    if (a != null) {
        var x = parseInt(a);
        if (isNaN(x)) {
            alert("x is not a number");
        } else {
            if (x < minwidth || maxwidth < x) //|| y < minheight || maxheight < y
                alert("x is out of dimension");
            else {
                appwidth = x;
                doit = true;
            }
        }
    }
    var b = prompt("Please enter height (min height is " + minheight + ", max height is " + maxheight + ":", appheight);
    if (b != null) {
        var y = parseInt(b);
        if (isNaN(y)) {
            alert("y is not a number");
        } else {
            if (y < minheight || maxheight < y)
                alert("y is out of dimension");
            else {
                appheight = y;
                doit = true;
            }
        }
    }


    if (doit) {


        plocha.setAttribute("style", "width:" + appwidth + "px; height:" + appheight + "px");
        nadplochou.setAttribute("style", "width:" + appwidth + "px; height:" + appheight + "px");
        dolny_div.setAttribute("style", "border-style: solid; border-width: 2px; width:" + appwidth + "px");
        horny_div.setAttribute("style", "border-style: solid; border-width: 2px; border-bottom:none; font-family:verdana; font-size:15px; width:" + appwidth + "px");

    }


}

function alignElements() {


    for (var i = 0; i < transitions.length; i++) {
        var x = transitions[i].start_x;
        x = korekcia_x((parseInt(x / gridstep)) * gridstep + gridstep / 2);
        var y = transitions[i].start_y;
        y = korekcia_y((parseInt(y / gridstep)) * gridstep + gridstep / 2);
        moveprechod(transitions[i], x, y);
        transitions[i].objektyelementu.element.setAttributeNS(null, "stroke", "black");


    }

    for (var i = 0; i < places.length; i++) {
        var x = places[i].start_x;
        x = korekcia_x((parseInt(x / gridstep)) * gridstep + gridstep / 2);
        var y = places[i].start_y;
        y = korekcia_y((parseInt(y / gridstep)) * gridstep + gridstep / 2);
        movemiesto(places[i], x, y);
        places[i].objektymiesta.element.setAttributeNS(null, "stroke", "black");
    }

    for (var i = 0; i < arcs.length; i++) {
        for (var j = 1; j < arcs[i].bodyhrany.length - 1; j++) {
            var x = arcs[i].bodyhrany[j].start_x;
            arcs[i].bodyhrany[j].start_x = korekcia_x((parseInt(x / gridstep)) * gridstep + gridstep / 2);
            var y = arcs[i].bodyhrany[j].start_y;
            arcs[i].bodyhrany[j].start_y = korekcia_y((parseInt(y / gridstep)) * gridstep + gridstep / 2);
        }
        updatehranusvg(arcs[i]);
    }

    reset();



}

function propertiesM() {
    var spolu = places.length + transitions.length + arcs.length;
    alert("Number of places: " + places.length + "\nNumber of transitions: " + transitions.length + "\nNumber of arcs: " + arcs.length + "\nNumber of elements: " + spolu);
}

function about() {
    alert("PETRIFLOW is a light online Petri net editor on cloud operated by BIREGAL.\nPETRIFLOW was implemented by Gabriel Juhas and Ana Juhasova.");
}



function help() {
    modal.style.display = shade.style.display = 'block';
    insidemodal.appendChild(helptext);
}

function zavri() {
    modal.style.display = shade.style.display = 'none';
}

function helpotvorFile() {


    helptext.nodeValue = "Choose a file to open";
}

function helpexportasXML() {
    helptext.nodeValue = "Save as an XML file";
}
function helpexportasPFLOW() {
    helptext.nodeValue = "Export as an PFLOW XML file - format of the PNEditor.org (PNEditor also offers a possibility to export and import files in PNML)";
}

function helpexportasSVG() {
    helptext.nodeValue = "Export in SVG format";
}

function helpclearmodel() {
    helptext.nodeValue = "Clear will delete the actual Petri net model, any unsaved changes will be lost";
}

function helpsetDimension() {
    helptext.nodeValue = "Enable to set the width and height of the drawing area";
}

function helpalignElements() {
    helptext.nodeValue = "Align elements (places and transitions) into a grid";
}

function helppropertiesM() {
    helptext.nodeValue = "Show the number of places, transitions, arcs and all elements together";
}

function helphelp() {
    helptext.nodeValue = "Open the help dialog";
}

function helpabout() {

    helptext.nodeValue = "Click to see information about Petriflow";
}

function helptransition() {

    helptext.nodeValue = "After you click on the radio button, you can insert transitions by clicking on the drawing area under the radio button bar.";
}
function helpplace() {

    helptext.nodeValue = "After you click on the radio button, you can insert places by clicking on the drawing area under the radio button bar.";
}

function helpstaticplace() {
    helptext.nodeValue = "After you click on the radio button, you can insert static places by clicking on the drawing area under the radio button bar.";
}

function helpaddtoken() {
    helptext.nodeValue = "After you click on the radio button, you can insert tokens into a place/static place by clicking on the place/static place.";
}

function helpremovetoken() {
    helptext.nodeValue = "After you click on the radio button, you can remove tokens from a place/static place by clicking on the place/static place.";
}

function helpmarking() {
    helptext.nodeValue = "After you click on the radio button, you can change the marking of a place/static place by clicking on the place/static place. Then a prompt dialog window will appears, where you can insert the value of the marking.";
}
function helplabel() {
    helptext.nodeValue = "After you click on the radio button, you can add/change the label of a place/transition by clicking on the place/transition. Then a prompt dialog window will appears, where you can insert/change the label.";
}
function helparc() {
    helptext.nodeValue = "After you click on the radio button, you can add arcs between places and transitions. By clicking on a place/transition, you start to draw an arc, which has now the red color. By clicking second time over a place/transition, the arc is added. You cannot connect a place with another place and a transition with another transition.";
}
function helparc_weight() {
    helptext.nodeValue = "After you click on the radio button, you can add a weight to regular/inhibitor arcs. By clicking on an arc, a prompt dialog window will appears, where you can enter the weight of the arc.";
}
function helpresetarc() {
    helptext.nodeValue = "After you click on the radio button, you can add a reset arc connecting a place with a transition. By clicking on a place, you start to draw a reset arc, which has now the red color. By clicking second time over a transition, the reset arc is added.";
}
function helpinhibitorarc() {
    helptext.nodeValue = "After you click on the radio button, you can add an inhibitor arc connecting a place with a transition. By clicking on a place, you start to draw an inhibitor arc, which has now the red color. By clicking second time over a transition, the inhibitor arc is added.";
}
function helpposition() {
    helptext.nodeValue = "After you click on the radio button, you can change position of a place, a transition or a break point of an arc. By clicking on an element, a prompt dialog window will appears, where you can enter the value of the x-coordinate of the element. Then another prompt dialog appears, where you can enter the value of the y-coordinate.";
}
function helpdelete() {
    helptext.nodeValue = "After you click on the radio button, you can delete elements. If you click on a place, static place, transition, or omn a break point of an arc, it will be deleted. To delete the entire arc, you have to click on the arc at a different position than its break points.";
}
function helpmove() {
    helptext.nodeValue = "After you click on the radio button, you can move elements. If you go over a place or a transition and click, it becomes to be red and movable. If you click on a break point of an arc, it becomes movable too. If you click on an arc at a different position than its break points, a new break point is added to the arcs and it becomes movable. To stop moving the element, you have to click second time. ";
}
function helpfire() {
    helptext.nodeValue = "After you click on the radio button, you will change to the firing mode. The transitions, which are enabled to fire, become green. A transition is enabled to fire if the sum of the weights of the arcs from places to the transition is smaller or equal to the number of tokens in the places and if the number of tokens in any place connected by an inhibitor arc with the transition is smaller than the weight of the inhibitor arc. Just click on an enabled green transition to fire it. For an arc from a place to the transition it will remove the number of tokens given by the arc weight from the place. For an arc from the transition to a place, it will add the number of tokens given by the arc weight to the place. Note that the default weight of an arc is one. For a reset arc from a place to the transition, it will remove all tokens from the place. An inhibitor arc from a place to the transition does not change the marking of the place by firing.";
}
