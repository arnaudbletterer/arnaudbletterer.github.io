var voronoi_bassin, draw_voronoi_bassin_mode = 0;

var old_keydown = keydown;

keydown = function()
{
	old_keydown();
	switch(d3.event.key)
	{
		case "c":
			d3.select('input[id="voronoi_bassin_checkbox"]').property("checked", !d3.select('input[id="voronoi_bassin_checkbox"]').property("checked"));
			drawVoronoiBassinFromCheckbox();
		break;
		case "d":
			changeDrawVoronoiBassinMode();
		default:
		break;
	}
	redraw();
}

d3.select('body')
	.on('keydown', keydown);

var old_clicked = clicked;

clicked = function()
{
	old_clicked();
	drawVoronoiBassin(last_cell_selected);
}

d3.select("#main_svg")
	.on("click", clicked);

var old_redraw = redraw;

redraw = function() 
{
	old_redraw();
	drawVoronoiBassin(last_cell_selected);
}

function drawVoronoiBassinFromCheckbox()
{
	if(d3.select('input[id="voronoi_bassin_checkbox"]:checked').node())	
	{
		d3.selectAll(".voronoi_bassin").attr("visibility", "visible");
	}
	else
	{
		d3.selectAll(".voronoi_bassin").attr("visibility", "hidden");
	}
}

function drawVoronoiBassin(cell_index)
{
	if(cell_index != -1)
	{
		var cell = diagram.polygons()[cell_index];

		var site_pos = sites[cell_index];

		// var old_neighboring_cells = neighboring_cells;

		neighboring_cells = getNeighboringCells(last_cell_selected);

		var similar_cells = false;

		// for(var i = 0; i < neighboring_cells.length && similar_cells; ++i)
		// {
		// 	if(old_neighboring_cells[i] != neighboring_cells[i])
		// 	{
		// 		similar_cells = false;
		// 	}
		// }

		if(!similar_cells)
		{
			if(voronoi_bassin)
			{
				voronoi_bassin.selectAll('circle').remove()
			}
			else
			{
				voronoi_bassin = svg.append("g")
					.attr("class", "voronoi_bassin")
					.on("click", voronoi_bassin_clicked);
			}

			for(var i = 0; i < cell.length; ++i)
			{
				var vertex_pos = cell[i];

				var diff = [site_pos[0]-vertex_pos[0], site_pos[1]-vertex_pos[1]];

				var radius = Math.sqrt(diff[0]*diff[0] + diff[1]*diff[1]);

				voronoi_bassin
					.append("circle")
						.attr("class", "voronoi_bassin_circles")
						.attr("cx", vertex_pos[0])
						.attr("cy", vertex_pos[1])
						.attr("r", radius);
			}
		}
		// else
		// {
		// 	voronoi_bassin

		// }

		drawVoronoiBassinMode();

		if(to_block_sites)
		{
			unblockSites();
		}

		if(to_block_sites)
		{
			blockSites();
		}

		if(d3.select('input[id="voronoi_bassin_checkbox"]:checked').node())	
		{
			d3.selectAll(".voronoi_bassin").attr("visibility", "visible");
		}
		else
		{
			d3.selectAll(".voronoi_bassin").attr("visibility", "hidden");
		}
	}
}

function drawVoronoiBassinMode()
{
	switch(draw_voronoi_bassin_mode)
	{
		case 0:
			d3.selectAll(".voronoi_bassin_circles")
				.attr("fill", "none")
				.attr("stroke", "black")
				.attr("stroke-dasharray" ,"6, 6");
		break;
		case 1:
			d3.selectAll(".voronoi_bassin_circles")
				.attr("fill", "none")
				.attr("stroke", "black")
				.attr("stroke-dasharray" ,"0, 0");
		break;
		case 2: 
			d3.selectAll(".voronoi_bassin_circles")
				.attr("fill", "black")
				.attr("fill-opacity", 0.25)
				.attr("stroke", "black");
		break;
		default:
		break;
	}
}

function changeDrawVoronoiBassinMode()
{
	drawVoronoiBassinMode();
	draw_voronoi_bassin_mode = (draw_voronoi_bassin_mode+1)%3;

	redraw();
}

function voronoi_bassin_clicked(d)
{
	var width = d3.select("#main_svg").attr("width");
	var height = d3.select("#main_svg").attr("height");
	var secondary_width = d3.select("#secondary_svg").attr("width");
	var secondary_height = d3.select("#secondary_svg").attr("height");

	var x_scale = secondary_width/width;
	var y_scale = secondary_height/height;

	var nodes = voronoi_bassin.nodes();
	var min_x = width, min_y = height, max_x = 0, max_y = 0;
	for(var node of nodes)
	{
		var bbox = node.getBBox();
		if(bbox.x < min_x)
		{
			min_x = bbox.x;
		}
		if(bbox.y < min_y)
		{
			min_y = bbox.y;
		}

		var x = bbox.x+bbox.width;
		var y = bbox.y+bbox.height;

		if(x > max_x)
		{
			max_x = x;
		}
		if(y > max_y)
		{
			max_y = y;
		}
	}	

	var dx = max_x - min_x,
		dy = max_y - min_y,
		x = (min_x + max_x) / 2,
		y = (min_y + max_y) / 2,
		scale = .9 / Math.max(dx / width, dy / height),
		translate = [(width / 2 - scale * x)*0.5, (height / 2 - scale * y)*0.5];

	d3.select("#secondary_svg").selectAll("use")
		.transition()
		.duration(750)
		.attr("transform", "translate(" + translate + ") scale(" + scale*x_scale + ", "+scale*y_scale+")");
}