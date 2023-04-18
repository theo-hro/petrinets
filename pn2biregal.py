import argparse
import math
import re
import sys

import networkx as nx

from petripy.parser import LolaParser, PNMLParser
from petripy.petrinet import PetriNet

POS_PATTERN = r"([0-9]+(\.[0-9]+)?),([0-9]+(\.[0-9]+)?)"


def generate_xml(net: PetriNet, output, layout = {}):
    output.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    output.write("<document>\n")

    id = 1
    placeIds = {}
    for pid,place in net.places.items():
        pos = layout.get(pid, [0,0])
        output.writelines([
            "<place>\n",
            f"\t<id>{id}</id>\n",
            f"\t<x>{pos[0]}</x>\n",
            f"\t<y>{pos[1]}</y>\n",
            f"\t<label>{place.name}</label>\n",
            f"\t<tokens>{net.initial_marking[place]}</tokens>\n"
            "\t<static>false</static>\n",
            "</place>\n"
        ])
        placeIds[pid] = id
        id += 1

    arcid = id + len(net.transitions)
    transitions = []
    arcs = []
    for tid,transition in net.transitions.items():
        pos = layout.get(tid, [0,0])
        transitions.append([
            "<transition>\n",
            f"\t<id>{id}</id>\n",
            f"\t<x>{pos[0]}</x>\n",
            f"\t<y>{pos[1]}</y>\n",
            f"\t<label>{transition.name}</label>\n",
            "</transition>\n"
        ])
        for place,mult in transition.consume.items():
            pid = placeIds[place.name]
            arcs.append([
                "<arc>\n",
                f"\t<id>{arcid}</id>\n",
                f"\t<sourceId>{pid}</sourceId>\n",
                f"\t<destinationId>{id}</destinationId>\n",
                f"\t<multiplicity>{mult}</multiplicity>\n",
                "</arc>\n"
            ])
            arcid += 1
        for place,mult in transition.produce.items():
            pid = placeIds[place.name]
            arcs.append([
                "<arc>\n",
                f"\t<id>{arcid}</id>\n",
                f"\t<sourceId>{id}</sourceId>\n",
                f"\t<destinationId>{pid}</destinationId>\n",
                f"\t<multiplicity>{mult}</multiplicity>\n",
                "</arc>\n"
            ])
            arcid += 1
        id += 1

    for t in transitions:
        output.writelines(t)
    for a in arcs:
        output.writelines(a)

    output.write("</document>\n")



def main():
    parser = argparse.ArgumentParser(prog="pn2biregal", description="Converts petri net files in .lola or .pnml format to a xml description readable by biregal.")
    parser.add_argument("input", type=argparse.FileType("r"), default=sys.stdin)
    parser.add_argument("-o", "--output", nargs="?", type=argparse.FileType("w"), default=sys.stdout)
    parser.add_argument("-s", "--scale", nargs="?", type=float, default=1)

    args = parser.parse_args()

    if args.input.name.endswith(".lola"):
        netparser = LolaParser()
    elif args.input.name.endswith(".pnml"):
        netparser = PNMLParser()
    
    if netparser:
        net = netparser.parse(args.input.name)
    
    layout = {}
    for nid,node in net.graph.nodes(data=True):
        if "pos" in node:
            match = re.match(POS_PATTERN, node["pos"])
            if match:
                x, _, y, _ = match.groups()
                layout[nid] = [float(x), float(y)]
            else:
                layout = None
                break
        else:
            layout = None
            break
    if layout == None:
        layout = nx.kamada_kawai_layout(net.graph)
        x_min = math.inf
        x_max = -math.inf
        y_min = math.inf
        y_max = -math.inf
        for pos in layout.values():
            x_min = min(x_min, pos[0])
            y_min = min(y_min, pos[1])
            x_max = max(x_max, pos[0])
            y_max = max(y_max, pos[1])
        width = x_max - x_min
        height = y_max - y_min
        smaller = min(width, height)
        factor = 400/smaller
        for pos in layout.values():
            pos[0] = (pos[0] - x_min) * factor
            pos[1] = (pos[1] - y_min) * factor
    
    for nid,pos in layout.items():
        pos[0] *= args.scale
        pos[1] *= args.scale
        x_min = math.inf
        y_min = math.inf
        for pos in layout.values():
            x_min = min(x_min, pos[0])
            y_min = min(y_min, pos[1])
    
    for pos in layout.values():
        pos[0] = pos[0] - x_min + 40
        pos[1] = pos[1] - y_min + 40


    generate_xml(net, args.output, layout)


if __name__ == "__main__":
    main()