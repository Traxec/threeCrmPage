/**
 * Dark blue theme for Highcharts JS
 * @author Torstein Hønsi
 */

Highcharts.theme = {
	colors: ["#eeaaee", "#eeaaee", "#eeaaee", "#eeaaee", "#eeaaee", "#eeaaee", "#eeaaee",
		"#eeaaee", "#eeaaee", "#eeaaee", "#eeaaee"],
	chart: {
		backgroundColor: {
			linearGradient: [0, 0, 250, 500],
			stops: [
				[0, 'rgb(48, 48, 96)'],
				[1, 'rgb(0, 0, 0)']
			]
		},
		borderColor: '#000000',
		borderWidth: 2,
		className: 'dark-container',
		plotBackgroundColor: 'rgba(255, 255, 255, .1)',
		plotBorderColor: '#CCCCCC',
		plotBorderWidth: 1
	},
	title: {
		style: {
			color: '#eeaaee',
			font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
		}
	},
	subtitle: {
		style: {
			color: '#eeaaee',
			font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
		}
	},
	xAxis: {
		gridLineColor: '#eeaaee',
		gridLineWidth: 1,
		labels: {
			style: {
				color: '#eeaaee'
			}
		},
		lineColor: '#eeaaee',
		tickColor: '#eeaaee',
		title: {
			style: {
				color: '#eeaaee',
				fontWeight: 'bold',
				fontSize: '12px',
				fontFamily: 'Trebuchet MS, Verdana, sans-serif'

			}
		}
	},
	yAxis: {
		gridLineColor: '#eeaaee',
		labels: {
			style: {
				color: '#eeaaee'
			}
		},
		lineColor: '#eeaaee',
		minorTickInterval: null,
		tickColor: '#eeaaee',
		tickWidth: 1,
		title: {
			style: {
				color: '#eeaaee',
				fontWeight: 'bold',
				fontSize: '12px',
				fontFamily: 'Trebuchet MS, Verdana, sans-serif'
			}
		}
	},
	legend: {
		itemStyle: {
			font: '9pt Trebuchet MS, Verdana, sans-serif',
			color: '#eeaaee'
		}
	},
	tooltip: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		style: {
			color: '#eeaaee'
		}
	},
	toolbar: {
		itemStyle: {
			color: 'silver'
		}
	},
	plotOptions: {
		line: {
			dataLabels: {
				color: '#eeaaee'
			},
			marker: {
				lineColor: '#eeaaee'
			}
		},
		spline: {
			marker: {
				lineColor: '#eeaaee'
			}
		},
		scatter: {
			marker: {
				lineColor: '#eeaaee'
			}
		},
		candlestick: {
			lineColor: 'white'
		}
	},
	legend: {
		itemStyle: {
			color: '#eeaaee'
		},
		itemHoverStyle: {
			color: '#eeaaee'
		},
		itemHiddenStyle: {
			color: '#eeaaee'
		}
	},
	credits: {
		style: {
			color: '#eeaaee'
		}
	},
	labels: {
		style: {
			color: '#eeaaee'
		}
	},

	navigation: {
		buttonOptions: {
			backgroundColor: {
				linearGradient: [0, 0, 0, 20],
				stops: [
					[0.4, '#eeaaee'],
					[0.6, '#eeaaee']
				]
			},
			borderColor: '#eeaaee',
			symbolStroke: '#eeaaee',
			hoverSymbolStroke: '#eeaaee'
		}
	},

	exporting: {
		buttons: {
			exportButton: {
				symbolFill: '#eeaaee'
			},
			printButton: {
				symbolFill: '#eeaaee'
			}
		}
	},

	// scroll charts
	rangeSelector: {
		buttonTheme: {
			fill: {
				linearGradient: [0, 0, 0, 20],
				stops: [
					[0.4, '#eeaaee'],
					[0.6, '#eeaaee']
				]
			},
			stroke: '#eeaaee',
			style: {
				color: '#eeaaee',
				fontWeight: 'bold'
			},
			states: {
				hover: {
					fill: {
						linearGradient: [0, 0, 0, 20],
						stops: [
							[0.4, '#eeaaee'],
							[0.6, '#eeaaee']
						]
					},
					stroke: '#eeaaee',
					style: {
						color: 'white'
					}
				},
				select: {
					fill: {
						linearGradient: [0, 0, 0, 20],
						stops: [
							[0.1, '#eeaaee'],
							[0.3, '#eeaaee']
						]
					},
					stroke: '#eeaaee',
					style: {
						color: 'yellow'
					}
				}
			}
		},
		inputStyle: {
			backgroundColor: '#eeaaee',
			color: 'silver'
		},
		labelStyle: {
			color: 'silver'
		}
	},

	navigator: {
		handles: {
			backgroundColor: '#eeaaee',
			borderColor: '#eeaaee'
		},
		outlineColor: '#eeaaee',
		maskFill: 'rgba(16, 16, 16, 0.5)',
		series: {
			color: '#eeaaee',
			lineColor: '#eeaaee'
		}
	},

	scrollbar: {
		barBackgroundColor: {
				linearGradient: [0, 0, 0, 20],
				stops: [
					[0.4, '#eeaaee'],
					[0.6, '#eeaaee']
				]
			},
		barBorderColor: '#eeaaee',
		buttonArrowColor: '#eeaaee',
		buttonBackgroundColor: {
				linearGradient: [0, 0, 0, 20],
				stops: [
					[0.4, '#eeaaee'],
					[0.6, '#eeaaee']
				]
			},
		buttonBorderColor: '#eeaaee',
		rifleColor: '#eeaaee',
		trackBackgroundColor: {
			linearGradient: [0, 0, 0, 10],
			stops: [
				[0, '#eeaaee'],
				[1, '#eeaaee']
			]
		},
		trackBorderColor: '#eeaaee'
	},

	// special colors for some of the
	legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	legendBackgroundColorSolid: 'rgb(35, 35, 70)',
	dataLabelsColor: '#eeaaee',
	textColor: '#eeaaee',
	maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
