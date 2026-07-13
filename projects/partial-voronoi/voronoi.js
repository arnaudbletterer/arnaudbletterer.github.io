d3.selection.prototype.first = function() 
{
	return d3.select(this[0][0]);
};
d3.selection.prototype.last = function() 
{
	var last = this.size() - 1;
	return d3.select(this[0][last]);
};

function chooseColorHSL(color_index, nb_colors)
{
	if (nb_colors < 1) nb_colors = 1; // defaults to one color - avoid dividing by zero
	return color_index * (360 / nb_colors) % 360;
}

var svg = d3.select("#main_svg")
	.on("mousein", mousein)
	.on("mouseout", mouseout)
	.on("touchmove mousemove", moved)
	.on("mousedown", mousedown)
	.on("mouseup", mouseup)
	.on("click", clicked);
var width = +svg.attr("width");
var height = +svg.attr("height");

var sub_svg = d3.select("#secondary_svg")
	.on("mousein", mousein)
	.on("mouseout", mouseout)
	.on("touchmove mousemove", moved)
	.on("mousedown", mousedown)
	.on("mouseup", mouseup)
	.on("click", clicked);

d3.select('body')
	.on('keydown', keydown);

var update_timer = d3.timer(update);
update_timer.stop();

var to_relax = false;
var to_block_sites = false;

function keydown()
{
	switch(d3.event.key)
	{
		case "m":
			changeManipulationMode();
		break;
		case "r":
			to_relax = !to_relax;
			if(to_relax)
			{
				update_timer.restart(update);
			}
			else
			{
				update_timer.stop();
			}
		break;
		case "b":
			to_block_sites = !to_block_sites;
			break;
		default:
		break;
	}
	redraw();
}

function mousein()
{
	found = diagram.find(mouse_pos[0], mouse_pos[1]);

	highlightCell(found.index);
}

function mouseout()
{
	if(!to_manipulate && last_cell_hovered != -1)
	{
		polygon._groups[0][0].children[last_cell_hovered].setAttribute("fill", 
			polygon._groups[0][0].children[last_cell_hovered].getAttribute("fill").replace(highlighted_intensity, normal_intensity)
		);
		last_cell_hovered = -1;
	}
}

var mouse_is_clicking = false;

function mousedown()
{
	mouse_is_clicking = true;
}

function mouseup()
{
	mouse_is_clicking = false;
}

var mouse_pos = -1;

function moved() 
{
	mouse_pos = d3.mouse(this);
	if(to_manipulate)
	{
		redraw();
	}
	else if(with_cell_hovering)
	{
		var found = diagram.find(mouse_pos[0], mouse_pos[1]);
		highlightCell(found.index);
	}
}

var last_cell_selected = -1;
var current_added_point = undefined;

function clicked() 
{
	if(to_manipulate)
	{
		if (d3.event.shiftKey) 
		{
			if(!current_added_point)
			{
				current_added_point = mouse_pos;
			}
			else
			{
				addLine(current_added_point, mouse_pos);

				current_added_point = undefined;
			}
		}
		else
		{
			addSite(mouse_pos);
		}
	}
	else
	{
		var found = diagram.find(mouse_pos[0], mouse_pos[1]);
		last_cell_selected = found.index;
	}
	redraw();
}

var to_manipulate = true;

var sites = d3.range(0);

var voronoi = d3.voronoi()
	.extent([[-1, -1], [width + 1, height + 1]]);

var voronoi_2 = d3.voronoi()
	.extent([[width/4, height/4], [3*width/4, 3*height/4]]);

var diagram, polygon, site, line;
var sub_diagram, sub_polygon, sub_site, sub_line;
var sites_color = [];
var sites_mobility = [];

var line_sites_only = [];

var normal_intensity = 50;
var highlighted_intensity = 100;

var lines = [];

function initData() 
{
	diagram = voronoi(sites.concat(line_sites_only));
	sub_diagram = voronoi(sites.concat(line_sites_only));

	polygon = svg.append("g")
		.attr("class", "polygons");

	polygon
		.selectAll("path")
		.data(diagram.polygons())
		.enter().append("path")
		.attr("stroke", "#000")
		.attr("stroke-width", "1")
		.call(redrawPolygon);

	if (polygon._groups[0][0] && polygon._groups[0][0].children) {
		for(var i = 0; i < polygon._groups[0][0].children.length; ++i)
		{
			polygon._groups[0][0].children[i].setAttribute("fill", "hsl("+sites_color[i]+","+normal_intensity+"%,50%)");
		}
	}

	sub_polygon = sub_svg.append("g")
		.attr("class", "polygons");

	sub_polygon
		.selectAll("path")
		.data(diagram.polygons())
		.enter().append("path")
		.attr("stroke", "#000")
		.attr("stroke-width", "1")
		.call(redrawPolygon);

	if (sub_polygon._groups[0][0] && sub_polygon._groups[0][0].children) {
		for(var i = 0; i < sub_polygon._groups[0][0].children.length; ++i)
		{
			sub_polygon._groups[0][0].children[i].setAttribute("fill", "hsl("+sites_color[i]+","+normal_intensity+"%,50%)");
		}
	}

	site = svg.append("g")
		.attr("class", "sites");

	site
		.selectAll("circle")
		.data(sites)
		.enter().append("circle")
		.attr("r", 5)
		.attr("stroke", "#000")
		.attr("stroke", "#fff")
		.call(redrawPoint);

	sub_site = sub_svg.append("g")
		.attr("class", "sites");

	sub_site
		.selectAll("circle")
		.data(sites)
		.enter().append("circle")
		.attr("r", 5)
		.attr("stroke", "#000")
		.attr("stroke", "#fff")
		.call(redrawPoint);

	line = svg.append("g")
		.attr("class", "lines");

	sub_line = svg.append("g")
		.attr("class", "lines");

	drawVoronoiEdgesFromCheckbox();
	drawVoronoiSitesFromCheckbox();
	
	// Commented out default box barrier lines to start with a clean canvas
	/*
	var point_A = [];
	point_A.push(width/4);
	point_A.push(height/4);
	var point_B = [];
	point_B.push(3*width/4);
	point_B.push(height/4);
	var point_C = [];
	point_C.push(3*width/4);
	point_C.push(3*height/4);
	var point_D = [];
	point_D.push(width/4);
	point_D.push(3*height/4);

	addLine(point_A, point_B, lines, sub_line);
	addLine(point_B, point_C, lines, sub_line);
	addLine(point_C, point_D, lines, sub_line);
	addLine(point_D, point_A, lines, sub_line);

	line
		.selectAll("line")
		.data(lines)
		.call(redrawLine);
	*/

	// addSite([740.0257771793966,531.909782910793], false)
	// addSite([51.78544380888812,62.454921066676924], false)
	// addSite([748.2382108444556,67.57208961733842], false)
	// addSite([60.451899866710164,542.594308654108], false)
	// addSite([624.37736866052,54.734055762801816], false)
	// addSite([180.85402458116155,542.8283378069585], false)
	// addSite([750.8292813748378,382.6092883714523], false)
	// addSite([157.94640114729435,55.01876507316067], false)
	// addSite([607.0203312053424,546.8062938705157], false)
	// addSite([53.69190142747338,426.3365958692885], false)
	// addSite([505.3775643598074,59.60738365996612], false)
	// addSite([54.653480891862536,186.41217858793206], false)
	// addSite([757.4856717857234,231.41487205864544], false)
	// addSite([163.28636772315446,402.79144035023234], false)
	// addSite([267.0052689687959,56.03404664992078], false)
	// addSite([646.1316573342543,429.21179188988737], false)
	// addSite([65.96175644017568,303.75458006853177], false)
	// addSite([674.4997903955472,162.03064211392936], false)
	// addSite([325.20655669900935,555.6589784931674], false)
	// addSite([381.8675800475852,53.460586432774306], false)
	// addSite([657.575494248344,290.22143741430847], false)
	// addSite([262.41025873910246,464.95802239714834], false)
	// addSite([560.6574333197151,181.69701929042057], false)
	// addSite([467.94298129031733,550.8472365515944], false)
	// addSite([167.12956457807155,169.6477872462992], false)
	// addSite([521.6722853217461,446.6145376305958], false)
	// addSite([289.62519116526124,166.6387928106148], false)
	// addSite([200.65969947042532,280.00126101476445], false)
	// addSite([422.745121580756,156.1770041319626], false)
	// addSite([388.3083132600608,458.962803888723], false)
	// addSite([555.9383260343435,330.395311595963], false)
	// addSite([294.98936197640376,361.3613880089332], false)
	// addSite([470.58248895508194,254.134012544748], false)
	// addSite([427.9247357197484,357.47125867796495], false)
	// addSite([344.4297229933677,261.16557784156487], false)

	redraw();
}

function changeManipulationMode()
{
	to_manipulate = !to_manipulate;

	if(last_cell_hovered != -1)
	{
		unhighlightCellAndNeighbors(last_cell_hovered);
		last_cell_hovered = -1;
	}

	if(!to_manipulate)
	{
		var found = diagram.find(mouse_pos[0], mouse_pos[1]);
		highlightCell(found.index);
	}
}

var with_cell_hovering = true;
var last_cell_hovered = -1;

function highlightCell(cell_index)
{
	if(cell_index != -1)
	{
		if(last_cell_hovered != -1)
		{
			polygon._groups[0][0].children[last_cell_hovered].setAttribute("fill", 
				polygon._groups[0][0].children[last_cell_hovered].getAttribute("fill").replace(highlighted_intensity, normal_intensity)
			);
		}

		last_cell_hovered = cell_index;

		polygon._groups[0][0].children[cell_index].setAttribute("fill", 
			polygon._groups[0][0].children[cell_index].getAttribute("fill").replace(normal_intensity, highlighted_intensity)
		);
	}
}

function unhighlightCellAndNeighbors(cell_index)
{
	polygon._groups[0][0].children[cell_index].setAttribute("fill", 
		polygon._groups[0][0].children[cell_index].getAttribute("fill").replace(highlighted_intensity, normal_intensity)
	);
	var neighboring_cells = getNeighboringCells(cell_index);
	for(var n_cell of neighboring_cells)
	{
		if(n_cell != -1)
		{
			polygon._groups[0][0].children[n_cell].setAttribute("fill", 
				polygon._groups[0][0].children[n_cell].getAttribute("fill").replace(highlighted_intensity, normal_intensity)
			);
		}
	}
}

function redraw() 
{
	if(sites.length > 0)
	{
		diagram = voronoi(sites.concat(line_sites_only));

		polygon
			.selectAll("path")
			.data(diagram.polygons().slice(0, sites.length))
			.call(redrawPolygon);

		site
			.selectAll("circle")
			.data(sites)
			.call(redrawPoint);

		// Handle Partial Voronoi clipping (Step 3)
		var defs = svg.select("defs");
		if (defs.empty()) {
			defs = svg.append("defs");
		}
		defs.selectAll("clipPath").remove();

		if (typeof currentStep !== 'undefined' && (currentStep === 3 || currentStep === 4 || currentStep === 5)) {
			// Create clip paths for each site with a radius of 50px
			var clips = defs.selectAll("clipPath")
				.data(sites);
				
			var enterClips = clips.enter().append("clipPath")
				.attr("id", function(d, i) { return "clip-" + i; });
				
			enterClips.append("circle")
				.attr("r", 50)
				.attr("cx", function(d) { return d[0]; })
				.attr("cy", function(d) { return d[1]; });
				
			polygon.selectAll("path")
				.attr("clip-path", function(d, i) { return "url(#clip-" + i + ")"; });

			// Draw domain boundary circles to show the limits of the domains
			var domainBoundaries = svg.select(".domain-boundaries");
			if (domainBoundaries.empty()) {
				// Insert before sites so it renders behind sites but on top of polygons
				domainBoundaries = svg.insert("g", ".sites")
					.attr("class", "domain-boundaries");
			}
			
			var bounds = domainBoundaries.selectAll("circle")
				.data(sites);
				
			bounds.enter().append("circle")
				.attr("r", 50)
				.attr("fill", "none")
				.attr("stroke", "#000")
				.attr("stroke-width", "1")
				.call(redrawPoint);
				
			bounds.call(redrawPoint);
			bounds.exit().remove();
		} else {
			polygon.selectAll("path")
				.attr("clip-path", null);
			svg.select(".domain-boundaries").remove();
		}

		// Handle Fog of War overlay (Steps 3, 4, 5)
		var fogOfWar = svg.select(".fog-of-war");
		if (typeof currentStep !== 'undefined' && currentStep >= 3) {
			if (fogOfWar.empty()) {
				fogOfWar = svg.append("g")
					.attr("class", "fog-of-war")
					.style("pointer-events", "none");
					
				fogOfWar.append("rect")
					.attr("x", 400)
					.attr("y", 0)
					.attr("width", 400)
					.attr("height", 600)
					.attr("fill", "rgba(15, 23, 42, 0.75)")
					.style("backdrop-filter", "blur(2px)");
					
				fogOfWar.append("text")
					.attr("x", 600)
					.attr("y", 300)
					.attr("text-anchor", "middle")
					.attr("fill", "#ffffff")
					.attr("font-size", "1.1rem")
					.attr("font-weight", "bold")
					.attr("opacity", "0.6")
					.text("FOG OF WAR (Unknown Domain)");
			}
		} else {
			fogOfWar.remove();
		}
	}
}

function addSite(mouse_pos, is_part_of_line)
{
	var chosen_color = chooseColorHSL(Math.floor(Math.random()*1000+1), 1000);

	if(!is_part_of_line)
	{
		sites.push(mouse_pos);
		sites_color.push(chosen_color);
	}
	else
	{
		line_sites_only.push(mouse_pos);
		return;
	}

	diagram = voronoi(sites.concat(line_sites_only));

	if(!is_part_of_line)
	{
		if(d3.select('input[id="voronoi_edges_checkbox"]:checked').node())
		{
			polygon
				.selectAll("path")
				.data(diagram.polygons().slice(0, sites.length))
				.enter().append("path")
				.attr("stroke", "#000")
				.attr("stroke-width", "1")
				.attr("fill", "hsl("+chosen_color+","+normal_intensity+"%,50%)")
				.call(redrawPolygon);
		}
		else
		{
			polygon
				.selectAll("path")
				.data(diagram.polygons().slice(0, sites.length))
				.enter().append("path")
				.attr("stroke", "#000")
				.attr("stroke-width", "0")
				.attr("fill", "hsl("+chosen_color+","+normal_intensity+"%,50%)")
				.call(redrawPolygon);
		}

		site
			.selectAll("circle")
			.data(sites)
			.enter().append("circle")
			.attr("r", 5)
			.attr("stroke", "#fff")
			.call(redrawPoint);

		sites_mobility.push(true);
	}
}

function addLine(point_a, point_b, lines, line)
{
	var vector = new Array(2);
	vector[0] = point_b[0]-point_a[0];
	vector[1] = point_b[1]-point_a[1];
	var cur_pos = [];
	cur_pos.push(point_a[0]);
	cur_pos.push(point_a[1]);
	var nb_points = Math.round(Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]));

	for(var i = 0; i < nb_points; ++i)
	{
		addSite([cur_pos[0], cur_pos[1]], true);
		cur_pos[0] += vector[0]/nb_points;
		cur_pos[1] += vector[1]/nb_points;
	}

	lines.push([]);

	lines[lines.length-1].source = point_a;
	lines[lines.length-1].target = point_b;

	line
		.selectAll("line")
		.data(lines)
		.enter().append("line")
		.attr("stroke", "#000")
		.attr("stroke-width", "1")
		.call(redrawLine);

	diagram = voronoi(sites.concat(line_sites_only));

	redraw();
}

function update()
{
	if(to_manipulate && mouse_is_clicking && mouse_pos)
	{
		addSite(mouse_pos);
	}

	repositionSites();

	redraw();
}

function redrawPolygon(polygon) 
{
	polygon
		.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; });
}

function redrawLine(line)
{
	line
		.attr("x1", function(d) { return d.source[0]; })
		.attr("y1", function(d) { return d.source[1]; })
		.attr("x2", function(d) { return d.target[0]; })
		.attr("y2", function(d) { return d.target[1]; });
}

function redrawPoint(point) 
{
	point
		.attr("cx", function(d) { return d[0]; })
		.attr("cy", function(d) { return d[1]; });
}

function repositionSites() 
{
	var polygons = diagram.polygons(sites);
	for(var i = 0; i < polygons.length; ++i)
	{
		if(sites_mobility[i])
		{
			sites[i] = d3.polygonCentroid(polygons[i]);	
		}
	}
}

function getNeighboringCells(cell_index)
{
	var cell = diagram.cells[cell_index];

	var neighboring_cells = [];

	cell.halfedges.forEach(function(e) {
		var edge = diagram.edges[e];
		var ea = edge.left;
		if (ea === cell.site) {
			ea = edge.right;
		}
		if (ea){
			neighboring_cells.push(ea.index);
		}
		else
		{
			neighboring_cells.push(-1);
		}
	});

	return neighboring_cells;
}

var circles;
var neighboring_cells = [];

function blockSites()
{
	if(last_cell_selected != -1)
	{
		for(var n_cell of neighboring_cells)
		{
			if(n_cell != -1)
			{
				sites_mobility[n_cell] = false;
			}
		}
	}
}

function unblockSites()
{
	if(last_cell_selected != -1)
	{
		for(var n_cell of neighboring_cells)
		{
			if(n_cell != -1)
			{
				sites_mobility[n_cell] = true;
			}
		}
	}
}

function drawVoronoiEdgesFromCheckbox()
{
	if(d3.select('input[id="voronoi_edges_checkbox"]:checked').node())	
	{
		// d3.selectAll(".polygons").attr("visibility", "visible");
		d3.selectAll(".polygons").selectAll("path").attr("stroke-width", "1");
	}
	else
	{
		// d3.selectAll(".polygons").attr("visibility", "hidden");
		d3.selectAll(".polygons").selectAll("path").attr("stroke-width", "0");
	}
}

function drawVoronoiSitesFromCheckbox()
{
	if(d3.select('input[id="voronoi_sites_checkbox"]:checked').node())	
	{
		d3.selectAll(".sites").attr("visibility", "visible");
	}
	else
	{
		d3.selectAll(".sites").attr("visibility", "hidden");
	}
}

function exportMainSVG()
{
	exportSVG([d3.select("#main_svg")], "main_svg");
}

function exportSVG(svg_elems, name) {
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var html = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">';

    for(svg_elem of svg_elems)
    {
	    html += svg_elem
	        .node().parentNode.innerHTML;
    }

    html += '</svg>';

    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, name+".svg");
}