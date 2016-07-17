function humanized_time_span(a, b, c, d) {
    function e() {
        for (var a = 0; a < c[j].length; a++)
            if (null == c[j][a].ceiling || i <= c[j][a].ceiling) return c[j][a];
        return null
    }

    function f() {
        for (var a = i, b = {}, c = 0; c < d.length; c++) {
            var e = Math.floor(a / d[c][0]);
            a -= d[c][0] * e, b[d[c][1]] = e
        }
        return b
    }

    function g(a) {
        var b = f(),
            c = a.text.replace(/\$(\w+)/g, function() {
                return b[arguments[1]]
            });
        return h(c, b)
    }

    function h(a, b) {
        for (var c in b)
            if (1 == b[c]) {
                var d = new RegExp("\\b" + c + "\\b");
                a = a.replace(d, function() {
                    return arguments[0].replace(/s\b/g, "")
                })
            }
        return a
    }
    c = c || {
        past: [{
            ceiling: 60,
            text: "$seconds seconds ago"
        }, {
            ceiling: 3600,
            text: "$minutes minutes ago"
        }, {
            ceiling: 86400,
            text: "$hours hours ago"
        }, {
            ceiling: 2629744,
            text: "$days days ago"
        }, {
            ceiling: 31556926,
            text: "$months months ago"
        }, {
            ceiling: null,
            text: "$years years ago"
        }],
        future: [{
            ceiling: 60,
            text: "in $seconds seconds"
        }, {
            ceiling: 3600,
            text: "in $minutes minutes"
        }, {
            ceiling: 86400,
            text: "in $hours hours"
        }, {
            ceiling: 2629744,
            text: "in $days days"
        }, {
            ceiling: 31556926,
            text: "in $months months"
        }, {
            ceiling: null,
            text: "in $years years"
        }]
    }, d = d || [
        [31556926, "years"],
        [2629744, "months"],
        [86400, "days"],
        [3600, "hours"],
        [60, "minutes"],
        [1, "seconds"]
    ], a = new Date(a), b = b ? new Date(b) : new Date;
    var i = (b - a) / 1e3,
        j = "past";
    return 0 > i && (j = "future", i = 0 - i), g(e())
}

function slugify(a) {
    return a.toLowerCase().replace(/\s/g, "-")
}

function flashText(a, b) {
    a.classed("flash", ƒ(b, changed)).text(b).on("animationEnd", removeAnimation).on("webkitAnimationEnd", removeAnimation)
}

function removeAnimation() {
    this.classList.remove(event.animationName)
}

function changed(a) {
    return this.textContent && a != this.textContent
}

function partyTag(a) {
    return '<span class="tag bg ' + a.slug + '"></span>'
}

function classByWinningParty(a) {
    return "f " + (a.results ? a.results.winningParty.slug : "uncalled")
}

function classBySelectedParty(a) {
    return a.candidates.some(function(a) {
        return a.party === state.selected.party
    }) ? "f " + state.selected.party.slug : "f no-candidate"
}

function classByParty(a) {
    return function(b) {
        var c = b.candidates.filter(function(b) {
            return b.party === a
        })[0];
        return c ? c.pctShare ? ["f", a.slug, quantizePct(c.pctShare)].join(" ") : "f uncalled" : "f no-candidate"
    }
}

function constituencyClass(a) {
    return state.selected.party ? classBySelectedParty(a) : classByWinningParty(a)
}

function constituencyOpacity(a) {
    if (state.selected.party) {
        var b = a.candidates.filter(function(a) {
            return a.party === state.selected.party
        })[0];
        return b ? b.pctShare ? pctShareScale(b.pctShare) : 0 : 1
    }
    return 1
}

function endall(a, b) {
    var c = 0;
    a.each(function() {
        ++c
    }).each("end", function() {
        --c || b.apply(this, arguments)
    })
}

function OrderedSet() {
    var a = [],
        b = ƒ("id"),
        c = {};
    return c.has = function(c) {
        return a.indexOf(b(c)) > -1
    }, c.toggle = function(d) {
        return c.has(d) ? a.splice(a.indexOf(b(d)), 1) : a.push(b(d)), c
    }, c.clear = function() {
        return a = [], c
    }, c.empty = function() {
        return 0 === a.length
    }, c.values = function() {
        return a.slice()
    }, c.length = function() {
        return a.length
    }, c.singleValue = function() {
        return 1 === a.length ? a[0] : void 0
    }, c
}

function electionApp() {
    function a(a) {
        a.parties.forEach(function(a) {
            a.slug = slugify(a.abbr), a.candidates = [], a.constituencies = [], "UK Independence Party" == a.name && (a.name = "UKIP")
        });
        var b = {};
        a.idx = b, b.constituencyById = d3.nest().key(ƒ("id")).rollup(ƒ(0)).map(a.constituencies), b.constituencyByGss = d3.nest().key(ƒ("gss")).rollup(ƒ(0)).map(a.constituencies), b.partyById = d3.nest().key(ƒ("id")).rollup(ƒ(0)).map(a.parties), b.partyByAbbr = d3.nest().key(ƒ("abbr")).rollup(ƒ(0)).map(a.parties);
        var c = b.partyByAbbr["Lab Co-op"];
        if (c) {
            var d = b.partyByAbbr.Lab;
            b.partyByAbbr["Lab Co-op"] = d, b.partyById[c.id] = d, a.parties = a.parties.filter(function(a) {
                return a !== c
            })
        }
        b.candidateById = d3.nest().key(ƒ("id")).rollup(ƒ(0)).map(a.candidates), a.constituencies.forEach(function(a) {
            a.id = parseInt(a.id), a.electorate = parseInt(a.electorate), a.candidates = []
        }), a.candidates.forEach(function(a) {
            var c = b.constituencyById[a.constituency_id];
            a.constituency = c, c.candidates.push(a);
            var d = b.partyById[a.party_id];
            a.party = d, d.candidates.push(a), d.constituencies.push(c)
        })
    }

    function b(a) {
        return [a.id, a.revision, a.date].join(":")
    }

    function c(a, c) {
        var e = {};
        if (a.forEach(function(a) {
                a.declarationTime = new Date(a.declarationTime), e[a.id] = a
            }), a = d3.values(e).sort(function(a, b) {
                return d3.ascending(a.declarationTime, b.declarationTime)
            }), c.results) {
            var f = d3.map(c.results, b),
                g = a.filter(function(a) {
                    return !f.has(b(a))
                }).map(ƒ("id"));
            if (!g.length) return []
        }
        return c.results = a, d(c), g || a.map(ƒ("id"))
    }

    function d(a) {
        a.parties.forEach(function(a) {
            a.won = [], a.gained = [], a.lost = [], a.votes = 0
        }), a.results.forEach(function(b) {
            b.winningParty = a.idx.partyByAbbr[b.winningPartyAbbr], b.sittingParty = a.idx.partyByAbbr[b.sittingPartyAbbr], b.constituency = a.idx.constituencyById[b.id], b.constituency.results = b, b.declarationTime = new Date(b.declarationTime), b.winningParty.won.push(b.constituency), b.gain && (b.winningParty.gained.push(b.constituency), b.sittingParty.lost.push(b.constituency)), b.candidates && b.candidates.forEach(function(b, c) {
                var d = a.idx.candidateById[b.id];
                if (!d) throw new Error("Missing candidate for ID " + b.id);
                for (var e in b) d[e] = b[e];
                d.party.votes += b.votes
            })
        })
    }

    function e() {
        clearTimeout(g), g = setTimeout(e, h), d3.json(i, function(a, b) {
            if (!a) {
                h = 1e3 * (b.nextTimeout || 30);
                var d = c(b.results, f);
                d.length && dispatch.dataChange(d)
            }
        })
    }
    var f, g, h = conf.pollTimeout;
    queue().defer(d3.json, "data/map.json").defer(d3.json, conf.dataPath + "bundle-2010.json").defer(d3.json, conf.dataPath + "bundle-2015.json").await(function(b, d, g, h) {
        if (b) return console.log(b);
        topo = d, h.is2015 = !0, g.is2015 = !1, h.id = "2015", g.id = "2010", a(g), a(h);
        var i = g.results;
        delete g.results, c(i, g), bundles[g.id] = g, bundles[h.id] = h, f = bundles[2015], state.setBundle("2015"), e();
        var j = +window.location.hash.replace("#", ""),
            k = data.idx.constituencyById[j];
        k && state.selected.setConstituency(k), d3.selectAll(".uk-election-graphics").style("opacity", 1)
    }), window.startPoll = e;
    var i = state.isIE ? "data/ie-results.json" : conf.resultsPath + "results.json"
}

function resultsBarView(a) {
    function b() {
        a.text(""), a.append("div.section-title").text(data.id + " National Results");
        var b = a.append("div.sub-title.hide2010");
        t = b.append("div.leading");
        var d = b.append("div.declared");
        s = d.append("span.num-declared").text("0"), d.append("span").text(" of 650 seats declared");
        var e = a.append("div.sub-title.hide2015");
        e.append("span.cl.c").text("Conservatives"), e.append("span").text(" won 307 seats but no overall majority."), e.append("div").text("They formed a coalition government with the Liberal Democrats."), a.append("div.clearboth"), u = f.map(function(a) {
            return data.parties.filter(function(b) {
                return b.name === a
            })[0] || {
                name: a,
                slug: "other"
            }
        }), n = a.selectAll(".party").data(u).enter().append("div.party").classed("is-first", function(a, b) {
            return !b
        }), j = a.append("div.won-bars").selectAll("div").data(u).enter().append("div").attr("class", function(a) {
            return "bar bg won-bar " + a.slug
        }), k = a.append("div.vote-bars").selectAll("div").data(u).enter().append("div").attr("class", function(a) {
            return "bar bg vote-bar " + a.slug
        }), n.append("div").attr("class", function(a) {
            return "tag bg " + a.slug
        }), name = n.append("div.name").text(function(a) {
            return "Scottish National Party" == a.name ? a.abbr : a.name
        }), n.append("div.abbr").text(function(a, b) {
            return "Scottish National Party" == a.name ? a.abbr : g[b]
        });
        var w = n.append("div.won");
        h = w.append("span").text("0"), i = w.append("span").text(" seats"), d3.select(".won-bars").insert("div.bar.bg.won-bar.full-bar"), w = n.append("div.votes"), l = w.append("span").text(0), w.append("span").text(" votes"), m = w.append("div.votes-pct").html("(<span>0.0</span>%)").select("span"), d3.select(".vote-bars").append("div.label").text("Popular vote"), d3.select(".won-bars").append("div.clearboth"), d3.select(".vote-bars").append("div.clearboth"), a.append("div.clearboth"), broadcastResize();
        var x = d3.time.format.iso.parse("2015-05-07T21:00:00.000Z");
        if (o = t.append("span"), p = t.append("span"), q = t.append("span"), r = t.append("span"), data.results && 0 !== data.results.length) c();
        else {
            t.style("display", "block");
            var y = function() {
                var a = new Date;
                x > a ? (o.text("Polls close " + humanized_time_span(x, a)), v = setTimeout(y, 1e3 - a % 1e3)) : o.text("Polls have closed. Awaiting first results")
            };
            clearTimeout(v), y()
        }
    }

    function c() {
        clearTimeout(v);
        var a, b, c = w.map(data.parties),
            f = d3.sum(d3.values(c), ƒ("votes")),
            g = data.parties.slice().sort(function(a, b) {
                return d3.descending(a.won.length, b.won.length)
            });
        if (data.results.length && g[0].won.length !== g[1].won.length && (a = g[0], b = g[0].won.length - g[1].won.length), data.results.length === data.constituencies.length) {
            var t = Math.floor(data.constituencies.length / 2 + 1);
            if (a && a.won.length >= t) {
                o.text(d(a.name)).attr("class", "cl " + a.slug);
                var u = a.won.length - (t - 1);
                p.text(" win, with majority of " + u + e(" seat", u))
            } else o.text(""), p.text("Hung Parliament");
            q.text(""), r.text("")
        } else o.text(a ? d(a.name) : "No party leading").attr("class", a ? "cl " + a.slug : ""), p.text(a ? "C" == a.abbr ? " lead by " : " leads by " : ""), q.call(flashText, function() {
            return b
        }), r.text(a ? e(" seat", b) : "");
        s.call(flashText, function() {
            return data.results.length
        }), h.call(flashText, function(a) {
            return c[a.name].won
        }), i.text(function(a) {
            return e(" seat", c[a.name].won)
        }), j.style("width", function(a) {
            return 99.8 * (c[a.name].won / data.constituencies.length) + "%"
        }).style("opacity", function(a) {
            return 0 == f ? 0 : 1
        }), k.style("width", function(a) {
            return 99.8 * (f ? c[a.name].votes / f : 0) + "%"
        }).style("opacity", function(a) {
            return 0 == f ? 0 : 1
        }), n.style("left", function(a, b) {
            var d = 0;
            return n.each(function(a, e) {
                b > e && (d += c[a.name].won / (data.constituencies.length + 1) * 100)
            }), d + "%"
        }), l.call(flashText, function(a) {
            return numf(c[a.name].votes)
        }), m.call(flashText, function(a) {
            return (f ? 100 * c[a.name].votes / f : 0).toFixed(1)
        })
    }

    function d(a) {
        var b = ["Conservative", "Liberal Democrat"];
        return _.contains(b, a) ? a + "s" : a
    }

    function e(a, b) {
        return 1 == b ? a : a + "s"
    }
    var f = ["Labour", "Scottish National Party", "Liberal Democrat", "Other", "Conservative"],
        g = ["Lab", "SNP", "Lib Dem", "Other", "Con"];
    a.classed("results-bar-view", !0);
    var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w = d3.nest().key(function(a) {
        return u.indexOf(a) > -1 ? a.name : "Other"
    }).rollup(function(a) {
        return {
            won: d3.sum(a, ƒ("won", "length")),
            votes: d3.sum(a, ƒ("votes"))
        }
    });
    dispatch.on("ready.resultsBarView", b).on("dataChange.resultsBarView", c)
}

function partiesView(a) {
    "use strict";

    function b() {
        var b = d3.nest().key(ƒ("name")).rollup(ƒ(0)).map(data.parties);
        a.text(""), a.append("h1").classed("title", !0).text("Party Standings");
        var k = a.append("table"),
            l = k.append("thead");
        l.append("th.party").html(partyTag({
            slug: ""
        }) + "Party"), l.append("th.num").text("Seats"), l.append("th.num").text("+/−"), l.append("th.num").text("Votes"), l.append("th.num").text("%");
        var m = k.append("tbody");
        f = m.selectAll("tr").data(e.map(function(a) {
            return b[a] || d
        })).enter().append("tr"), f.append("td.party").append("div.overflow-cell").html(function(a) {
            return partyTag(a) + a.name
        }).on("click", state.selected.setParty), g = f.append("td.num").append("span").text(0), h = f.append("td.num").append("span").text(0), i = f.append("td.num").append("span").text(0), j = f.append("td.num").append("span").text(0..toFixed(1)), a.append("p").classed("note", !0).text("Note: The Speaker, who remains neutral, is included in other"), data.results && c()
    }

    function c() {
        var a = k.map(data.parties),
            b = d3.sum(d3.values(a), ƒ("votes"));
        b && f.sort(function(b, c) {
            if (b == d) return 1;
            if (c == d) return -1;
            var e = a[b.name].won,
                f = a[c.name].won;
            if (e !== f) return d3.descending(e, f);
            var g = a[b.name].votes,
                h = a[c.name].votes;
            return d3.descending(g, h)
        }), g.call(flashText, function(b) {
            return a[b.name].won
        }), h.call(flashText, function(b) {
            return 0 === a[b.name].change ? numChange(a[b.name].change) + (data.is2015 ? " —" : "") : numChange(a[b.name].change) + (a[b.name].change > 0 ? " ▲" : " ▼")
        }), i.call(flashText, function(b) {
            return numf(a[b.name].votes)
        }), j.call(flashText, function(c) {
            return (b ? 100 * a[c.name].votes / b : 0).toFixed(1)
        })
    }
    var d = {
            name: "Other",
            slug: "other"
        },
        e = ["Conservative", "Labour", "Liberal Democrat", "Scottish National Party", "UKIP", "Green", "Plaid Cymru", "Democratic Unionist Party", "Sinn Fein", "Social Democratic and Labour Party", "Alliance", "Respect the Unity Coalition", d.name];
    dispatch.on("ready.partiesView", b).on("dataChange.partiesView", c), a.classed("parties-view", !0), a.append("h1").classed("title", !0).text("Party standings");
    var f, g, h, i, j, k = d3.nest().key(function(a) {
        return e.indexOf(a.name) > -1 ? a.name : d.name
    }).rollup(function(a, b) {
        if (!a) return {
            won: 0,
            gained: 0,
            lost: 0,
            change: 0,
            votes: 0
        };
        var c = d3.sum(a, ƒ("gained", "length")),
            d = d3.sum(a, ƒ("lost", "length"));
        return {
            won: d3.sum(a, ƒ("won", "length")),
            gained: c,
            lost: d,
            change: c - d,
            votes: d3.sum(a, ƒ("votes"))
        }
    })
}

function streamView(a) {
    "use strict";

    function b() {
        a.html(""), a.append("h1").classed("title", !0).text(data.is2015 ? "Latest Results" : "2010 Results"), e = a.append("div.fake-table"), f = e.append("div.thead"), f.append("div.th.constituency").html('<span class="tag"></span>Constituency'), f.append("div.th.party").text("Party"), f.append("div.th.status.hide2010").text("Status"), g = e.append("div.tbody"), i = a.append("div.footer").text("Show More").on("click", function() {
            var a = e.node().getBoundingClientRect().height;
            e.transition().duration(500).style("height", a + 250 + "px")
        }), a.style("display", "none"), data.results && c()
    }

    function c() {
        if (data.is2015) var b = data.results.slice().sort(function(a, b) {
            return d3.descending(a.declarationTime, b.declarationTime)
        });
        else var b = data.results.slice().sort(function(a, b) {
            return d3.ascending(a.constituency.name, b.constituency.name)
        });
        0 != data.results.length && a.style("display", "block"), h = g.selectAll(".tr").data(b, function(a) {
            return [a.id, a.revision].join(":")
        }), h.exit().remove();
        var c = h.enter().insert("div.tr", ".tr").style("max-height", 0).classed("selected", function(a) {
            return state.selected.constituencies.has(a.constituency)
        }).on("click", function(a) {
            state.selected.setConstituency(a.constituency)
        });
        h.order(), c.append("div.td.constituency").html(function(a) {
            return partyTag(a.winningParty) + a.constituency.name
        }).classed("overflow-cell", !0), c.append("div.td.party").text(ƒ("winningParty", "name")), c.append("div.td.status.hide2010").text(function(a) {
            return a.gain ? "▲ Gain" : "Hold"
        }).classed("gain", ƒ("gain")), c.transition().duration(0).style("max-height", "2em"), h.exit().transition().style("height", 0).remove(), i.style("display", b.length > 15 && data.is2015 ? "block" : "none")
    }

    function d(a) {
        h && h.classed("selected", function(a) {
            return state.selected.constituencies.has(a.constituency)
        })
    }
    dispatch.on("ready.streamView", b).on("dataChange.streamView", c).on("stateChange.streamView", d), a.classed("stream-view", !0);
    var e, f, g, h, i
}

function constituencyView(a) {
    "use strict";

    function b(a) {
        a.each(b.render)
    }
    a.classed("constituency-view", !0);
    var c = a.append("h1.title"),
        d = a.append("div.tabs");
    d.append("div.cl.gray3").text("⬅ Back to national view").on("click", function() {
        state.selected.setConstituency(null)
    });
    var e = a.append("table"),
        f = e.append("thead").append("tr");
    f.append("th.hide2010"), f.append("th.name-party").html("Name/party"), f.append("th.num").text("Votes"), f.append("th.num").text("%"), f.append("th.num").text("+/-");
    var g, h = e.append("tbody");
    return b.constituency = function(a) {
        return arguments.length ? (g = a, b) : g
    }, b.render = function() {
        if (c.text(g.name), h.selectAll("tr").remove(), g.candidates.sort(function(a, b) {
                return a.constituency.results ? d3.descending(a.votes, b.votes) : d3.ascending(a.lastname, b.lastname)
            }), g.results) {
            var a = g.candidates[0];
            d3.max(g.candidates, ƒ("pctChange", Math.abs))
        }
        var b = h.selectAll("tr").data(g.candidates, ƒ("id")),
            d = b.enter().append("tr").classed("winner", function(b) {
                return b === a
            });
        d.append("td.candidate-photo.hide2010").html(function(a, b) {
            return data.is2015 ? '<img class="bg ' + a.party.slug + '" src="candidate-photos/' + a.id + '.jpg" />' : ""
        }).select("img").on("error", function() {
            "" != this.src && (this.src = "")
        }), d.append("td").html(function(a, b) {
            return '<div class="tag bg ' + a.party.slug + '"></div><div class="party-name">' + a.party.name + '</div><div class="candidate-name">' + a.firstname + " " + a.lastname + "</div>"
        }), d.append("td.num").text(ƒ("votes", numf)), d.append("td.num").text(ƒ("pctShare", pct)), d.append("td.num").text(ƒ("pctChange", pctChange))
    }, b
}

function mapView(a) {
    "use strict";

    function b() {
        if (p.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"), m) {
            var a = d3.event.scale;
            o.classed("hidden", k > a), m.attr({
                x: -(d3.event.translate[0] / a),
                y: -(d3.event.translate[1] / a),
                width: e / a,
                height: f / a
            })
        }
    }

    function c(a) {
        state.isHomePage ? window.open("http://www.bloomberg.com/graphics/2015-uk-election/#" + a.properties.constituency.id, "_blank") : state.selected.setConstituency(a.properties.constituency)
    }

    function d() {
        d3.event.defaultPrevented && d3.event.stopPropagation()
    }
    var e = 708,
        f = 996,
        g = 10,
        h = 1200,
        i = classByWinningParty,
        j = .2,
        k = 1.8;
    a.classed("map-view", !0);
    var l, m, n = a.append("svg.main-map"),
        o = a.append("svg.mini-map"),
        p = n.append("g.geo-map"),
        q = d3.behavior.zoom().translate([0, 0]).scale(1).scaleExtent([1, g]).on("zoom", b),
        r = d3.geo.uk().translate([.4 * e, .54 * f]).scale(6386),
        s = (d3.geo.graticule().extent([
            [-11, 61],
            [3.01, 49]
        ]).step([2, 2]), d3.geo.path().projection(r));
    if (n.attr("width", "100%").attr("viewBox", [0, 0, e, f]).on("dblclick.zoom", null).on("click", d, !0), window.innerWidth > 767 && n.call(q).call(q.event), state.isIE) {
        var t = parseInt(.6 * window.innerHeight);
        n.attr("height", t), a.style("height", t + "px"), d3.select(".cartogram-view").style("height", t + "px")
    }
    o.attr("width", 100 * j + "%").attr("height", 100 * j + "%").attr("viewBox", [0, 0, e, f]).classed("hidden", !0);
    var u = {};
    return u.drawMap = function() {
        if (l) return u.renderData();
        var a = p.append("g.non-uk");
        a.append("path").datum(topojson.mesh(topo, topo.objects.imn, function(a, b) {
            return a == b
        })).attr("vector-effect", "non-scaling-stroke").attr("d", s), a.append("path").datum(topojson.mesh(topo, topo.objects["republic-of-ireland"], function(a, b) {
            return a == b
        })).attr("vector-effect", "non-scaling-stroke").attr("d", s), m = o.append("g.zoom-box").append("rect").attr("vector-effect", "non-scaling-stroke"), l = p.append("g.constituencies").selectAll("g").data(topojson.feature(topo, topo.objects.uk).features).enter().append("g").append("path").attr("d", s).attr("vector-effect", "non-scaling-stroke").classed("f uncalled", !0).on("click", c).call(d3.attachTooltip).on("mouseover", function(a) {
            d3.select(".tooltip").text(a.properties.constituency.name)
        }), o.append("g.background").append("rect").attr("x", 0).attr("y", 0).attr("width", e).attr("height", f), o.append("g.map").append("path").datum(topojson.mesh(topo, topo.objects.uk, function(a, b) {
            return a == b
        })).attr("d", s), m = o.append("g.zoom-box").append("rect").attr("vector-effect", "non-scaling-stroke"), o.append("text").attr("x", "50%").attr("y", "95%").attr("text-anchor", "middle").attr("class", "zoom-out-text").text("Zoom to full map");
        var b = 10;
        p.append("rect").attr({
            height: 236 + 2 * b,
            width: 147 + 2 * b,
            y: 25 - b,
            x: 475 - b
        }).style({
            fill: "none",
            "pointer-events": "none",
            stroke: "grey",
            "stroke-dasharray": "5 5"
        }), broadcastResize()
    }, u.renderData = function() {
        l.attr("class", ƒ("properties", "constituency", i))
    }, u.renderState = function() {
        if (l.each(function(a) {
                d3.select(this.parentElement).classed("selected", state.selected.constituencies.has(a.properties.constituency)), this.parentElement && this.parentElement.parentElement && state.selected.constituencies.has(a.properties.constituency) && this.parentElement.parentElement.appendChild(this.parentElement)
            }), state.selected.constituencies.empty()) return p.classed("selected", !1), u.reset();
        p.classed("selected", !0);
        var a = topojson.merge(topo, topo.objects.uk.geometries.filter(function(a) {
                return state.selected.constituencies.has(a.properties.constituency)
            })),
            b = s.bounds(a),
            c = b[1][0] - b[0][0],
            d = b[1][1] - b[0][1],
            i = (b[0][0] + b[1][0]) / 2,
            j = (b[0][1] + b[1][1]) / 2,
            k = .9 / Math.max(c / e, d / f),
            k = Math.min(k, g),
            m = [e / 2 - k * i, f / 2 - k * j];
        n.transition().duration(h).call(q.translate(m).scale(k).event).each("end", function() {
            p.classed("selected", !0)
        })
    }, u.classBy = function(a) {
        return arguments.length ? (i = a, u) : i
    }, u.reset = function() {
        var a = q.translate().map(Math.floor).join(),
            b = Math.ceil(q.scale());
        return "0,0" === a && 1 === b ? n.transition().duration(0) : n.transition().duration(h).call(q.translate([0, 0]).scale(1).event)
    }, o.on("click", state.selected.setConstituency), u
}

function cartogramView(a) {
    "use strict";
    var b, c, d, e = 708,
        f = 996,
        g = 500;
    window.coords = [
        [197.8, 716.9],
        [215.8, 548.9],
        [323.7, 56],
        [341.7, 67.2],
        [305.7, 67.2],
        [287.7, 168],
        [341.7, 851.3],
        [359.6, 526.5],
        [323.7, 436.9],
        [251.7, 526.5],
        [431.6, 526.5],
        [323.7, 78.4],
        [171.9, 384.8],
        [153.9, 373.6],
        [136, 384.8],
        [197.8, 560.1],
        [233.8, 89.6],
        [485.5, 851.3],
        [449.5, 515.3],
        [593.4, 828.9],
        [359.6, 392.1],
        [323.7, 750.5],
        [251.7, 235.2],
        [233.8, 224],
        [233.8, 201.6],
        [323.7, 705.7],
        [305.7, 44.8],
        [575.4, 750.5],
        [413.6, 448.1],
        [431.6, 436.9],
        [305.7, 313.6],
        [593.4, 716.9],
        [611.4, 728.1],
        [323.7, 862.5],
        [485.5, 492.9],
        [269.7, 806.5],
        [413.6, 403.3],
        [449.5, 784.1],
        [359.6, 728.1],
        [503.5, 817.7],
        [413.6, 627.3],
        [377.6, 672.1],
        [395.6, 638.5],
        [377.6, 694.5],
        [153.9, 418.4],
        [153.9, 396],
        [136, 429.6],
        [136, 407.2],
        [485.5, 761.7],
        [341.7, 224],
        [323.7, 212.8],
        [521.5, 739.3],
        [521.5, 403.3],
        [575.4, 840.1],
        [539.5, 795.3],
        [233.8, 448.1],
        [287.7, 660.9],
        [341.7, 560.1],
        [323.7, 638.5],
        [341.7, 582.5],
        [323.7, 616.1],
        [305.7, 649.7],
        [323.7, 593.7],
        [305.7, 604.9],
        [341.7, 604.9],
        [395.6, 302.4],
        [323.7, 324.8],
        [341.7, 380.9],
        [287.7, 324.8],
        [269.7, 336],
        [251.7, 660.9],
        [341.7, 268.8],
        [377.6, 224],
        [467.5, 862.5],
        [449.5, 492.9],
        [323.7, 347.2],
        [323.7, 369.6],
        [305.7, 358.4],
        [215.8, 459.3],
        [521.5, 560.1],
        [395.6, 571.3],
        [269.7, 873.7],
        [269.7, 851.3],
        [341.7, 806.5],
        [413.6, 358.4],
        [395.6, 392.1],
        [395.6, 369.6],
        [557.4, 672.1],
        [251.7, 616.1],
        [449.5, 694.5],
        [431.6, 705.7],
        [413.6, 739.3],
        [539.5, 683.3],
        [197.8, 761.7],
        [179.8, 862.5],
        [485.5, 448.1],
        [539.5, 862.5],
        [521.5, 851.3],
        [251.7, 795.3],
        [233.8, 806.5],
        [233.8, 828.9],
        [251.7, 817.7],
        [557.4, 604.9],
        [521.5, 784.1],
        [323.7, 660.9],
        [485.5, 649.7],
        [467.5, 526.5],
        [377.6, 716.9],
        [377.6, 358.4],
        [359.6, 481.7],
        [341.7, 336],
        [341.7, 358.4],
        [557.4, 649.7],
        [251.7, 705.7],
        [251.7, 33.6],
        [395.6, 436.9],
        [503.5, 772.9],
        [89.9, 940.9],
        [521.5, 649.7],
        [521.5, 604.9],
        [449.5, 604.9],
        [467.5, 616.1],
        [539.5, 660.9],
        [341.7, 537.7],
        [647.3, 795.3],
        [233.8, 716.9],
        [251.7, 728.1],
        [233.8, 739.3],
        [215.8, 728.1],
        [323.7, 280],
        [179.8, 705.7],
        [143.9, 728.1],
        [449.5, 828.9],
        [629.4, 739.3],
        [251.7, 638.5],
        [449.5, 560.1],
        [611.4, 795.3],
        [341.7, 448.1],
        [575.4, 705.7],
        [449.5, 761.7],
        [305.7, 716.9],
        [341.7, 716.9],
        [251.7, 504.1],
        [431.6, 504.1],
        [449.5, 873.7],
        [539.5, 705.7],
        [269.7, 828.9],
        [467.5, 660.9],
        [287.7, 347.2],
        [287.7, 884.9],
        [467.5, 750.5],
        [629.4, 672.1],
        [521.5, 492.9],
        [251.7, 571.3],
        [233.8, 560.1],
        [269.7, 179.2],
        [575.4, 683.3],
        [395.6, 459.3],
        [341.7, 470.5],
        [305.7, 291.2],
        [467.5, 571.3],
        [125.9, 918.5],
        [125.9, 940.9],
        [305.7, 739.3],
        [377.6, 560.1],
        [377.6, 582.5],
        [359.6, 593.7],
        [449.5, 851.3],
        [305.7, 470.5],
        [485.5, 828.9],
        [467.5, 817.7],
        [467.5, 840.1],
        [269.7, 112],
        [233.8, 694.5],
        [575.4, 772.9],
        [431.6, 302.4],
        [575.4, 795.3],
        [377.6, 604.9],
        [233.8, 515.3],
        [359.6, 414.5],
        [395.6, 526.5],
        [413.6, 537.7],
        [395.6, 504.1],
        [413.6, 515.3],
        [413.6, 492.9],
        [395.6, 548.9],
        [287.7, 840.1],
        [161.8, 896.1],
        [197.8, 896.1],
        [161.8, 873.7],
        [161.8, 940.9],
        [143.9, 907.3],
        [431.6, 414.5],
        [467.5, 436.9],
        [485.5, 425.7],
        [485.5, 403.3],
        [233.8, 873.7],
        [251.7, 862.5],
        [251.7, 907.3],
        [233.8, 896.1],
        [629.4, 828.9],
        [171.9, 429.6],
        [153.9, 463.3],
        [287.7, 571.3],
        [287.7, 593.7],
        [485.5, 784.1],
        [269.7, 246.4],
        [305.7, 246.4],
        [251.7, 123.2],
        [251.7, 100.8],
        [305.7, 89.6],
        [323.7, 100.8],
        [305.7, 112],
        [395.6, 280],
        [377.6, 291.2],
        [359.6, 280],
        [215.8, 571.3],
        [413.6, 716.9],
        [395.6, 728.1],
        [395.6, 750.5],
        [431.6, 257.6],
        [557.4, 739.3],
        [251.7, 212.8],
        [341.7, 179.2],
        [575.4, 862.5],
        [359.6, 884.9],
        [269.7, 492.9],
        [323.7, 168],
        [323.7, 190.4],
        [305.7, 201.6],
        [305.7, 179.2],
        [305.7, 156.8],
        [521.5, 694.5],
        [233.8, 470.5],
        [449.5, 336],
        [539.5, 772.9],
        [503.5, 683.3],
        [485.5, 672.1],
        [521.5, 672.1],
        [413.6, 828.9],
        [449.5, 537.7],
        [557.4, 784.1],
        [377.6, 806.5],
        [179.8, 907.3],
        [287.7, 123.2],
        [377.6, 896.1],
        [611.4, 817.7],
        [395.6, 772.9],
        [100, 407.2],
        [341.7, 112],
        [251.7, 772.9],
        [467.5, 683.3],
        [611.4, 840.1],
        [269.7, 739.3],
        [118, 373.6],
        [269.7, 358.4],
        [521.5, 515.3],
        [269.7, 470.5],
        [395.6, 257.6],
        [503.5, 526.5],
        [629.4, 806.5],
        [251.7, 168],
        [269.7, 156.8],
        [251.7, 145.6],
        [269.7, 134.4],
        [233.8, 134.4],
        [269.7, 201.6],
        [233.8, 156.8],
        [323.7, 123.2],
        [287.7, 750.5],
        [287.7, 56],
        [395.6, 884.9],
        [161.8, 739.3],
        [503.5, 593.7],
        [593.4, 784.1],
        [521.5, 470.5],
        [593.4, 627.3],
        [539.5, 750.5],
        [395.6, 840.1],
        [485.5, 716.9],
        [503.5, 728.1],
        [305.7, 627.3],
        [395.6, 414.5],
        [503.5, 392.1],
        [287.7, 459.3],
        [431.6, 772.9],
        [413.6, 851.3],
        [341.7, 828.9],
        [305.7, 828.9],
        [431.6, 728.1],
        [431.6, 593.7],
        [503.5, 660.9],
        [467.5, 324.8],
        [431.6, 683.3],
        [413.6, 694.5],
        [449.5, 268.8],
        [593.4, 672.1],
        [593.4, 851.3],
        [431.6, 862.5],
        [377.6, 761.7],
        [377.6, 470.5],
        [485.5, 627.3],
        [485.5, 380.9],
        [449.5, 672.1],
        [341.7, 694.5],
        [287.7, 705.7],
        [269.7, 649.7],
        [503.5, 638.5],
        [503.5, 616.1],
        [395.6, 683.3],
        [431.6, 660.9],
        [341.7, 246.4],
        [359.6, 347.2],
        [395.6, 481.7],
        [431.6, 638.5],
        [467.5, 728.1],
        [593.4, 761.7],
        [449.5, 716.9],
        [503.5, 840.1],
        [413.6, 268.8],
        [521.5, 873.7],
        [413.6, 425.7],
        [503.5, 436.9],
        [503.5, 414.5],
        [503.5, 459.3],
        [431.6, 616.1],
        [359.6, 324.8],
        [557.4, 716.9],
        [575.4, 728.1],
        [215.8, 145.6],
        [269.7, 67.2],
        [593.4, 649.7],
        [341.7, 918.5],
        [467.5, 705.7],
        [485.5, 739.3],
        [251.7, 683.3],
        [395.6, 235.2],
        [395.6, 347.2],
        [341.7, 649.7],
        [431.6, 750.5],
        [449.5, 582.5],
        [269.7, 224],
        [395.6, 817.7],
        [269.7, 784.1],
        [305.7, 134.4],
        [269.7, 425.7],
        [153.9, 440.9],
        [287.7, 212.8],
        [269.7, 380.9],
        [359.6, 302.4],
        [413.6, 380.9],
        [467.5, 392.1],
        [449.5, 380.9],
        [431.6, 369.6],
        [431.6, 347.2],
        [431.6, 571.3],
        [413.6, 604.9],
        [413.6, 582.5],
        [413.6, 560.1],
        [395.6, 593.7],
        [287.7, 414.5],
        [557.4, 851.3],
        [521.5, 761.7],
        [503.5, 795.3],
        [485.5, 806.5],
        [521.5, 716.9],
        [359.6, 504.1],
        [503.5, 548.9],
        [287.7, 145.6],
        [251.7, 481.7],
        [251.7, 414.5],
        [251.7, 459.3],
        [251.7, 436.9],
        [305.7, 224],
        [161.8, 716.9],
        [136, 362.4],
        [431.6, 548.9],
        [521.5, 537.7],
        [269.7, 604.9],
        [395.6, 660.9],
        [413.6, 649.7],
        [359.6, 459.3],
        [341.7, 784.1],
        [593.4, 806.5],
        [287.7, 392.1],
        [629.4, 694.5],
        [341.7, 403.3],
        [305.7, 403.3],
        [341.7, 425.7],
        [467.5, 481.7],
        [377.6, 873.7],
        [359.6, 571.3],
        [233.8, 672.1],
        [449.5, 291.2],
        [467.5, 302.4],
        [323.7, 235.2],
        [359.6, 683.3],
        [359.6, 705.7],
        [431.6, 817.7],
        [377.6, 828.9],
        [269.7, 694.5],
        [251.7, 593.7],
        [287.7, 78.4],
        [323.7, 302.4],
        [449.5, 403.3],
        [287.7, 190.4],
        [215.8, 56],
        [197.8, 694.5],
        [305.7, 873.7],
        [305.7, 896.1],
        [503.5, 504.1],
        [305.7, 806.5],
        [269.7, 515.3],
        [359.6, 257.6],
        [377.6, 268.8],
        [359.6, 235.2],
        [269.7, 716.9],
        [251.7, 750.5],
        [118, 440.9],
        [197.8, 918.5],
        [467.5, 593.7],
        [575.4, 616.1],
        [539.5, 593.7],
        [575.4, 638.5],
        [521.5, 627.3],
        [449.5, 358.4],
        [377.6, 627.3],
        [377.6, 649.7],
        [359.6, 660.9],
        [539.5, 616.1],
        [557.4, 627.3],
        [485.5, 537.7],
        [485.5, 515.3],
        [467.5, 548.9],
        [377.6, 537.7],
        [287.7, 100.8],
        [197.8, 739.3],
        [557.4, 761.7],
        [377.6, 425.7],
        [359.6, 369.6],
        [557.0307651451142, 136.7948058024281],
        [521.5, 806.5],
        [341.7, 761.7],
        [323.7, 772.9],
        [233.8, 112],
        [233.8, 179.2],
        [377.6, 336],
        [413.6, 470.5],
        [323.7, 257.6],
        [269.7, 89.6],
        [485.5, 604.9],
        [161.8, 918.5],
        [143.9, 929.7],
        [215.8, 705.7],
        [251.7, 884.9],
        [503.5, 750.5],
        [395.6, 862.5],
        [413.6, 873.7],
        [143.9, 705.7],
        [305.7, 336],
        [413.6, 336],
        [413.6, 784.1],
        [593.4, 694.5],
        [323.7, 795.3],
        [323.7, 817.7],
        [467.5, 280],
        [305.7, 672.1],
        [431.6, 840.1],
        [251.7, 190.4],
        [215.8, 683.3],
        [377.6, 313.6],
        [413.6, 313.6],
        [413.6, 761.7],
        [377.6, 403.3],
        [611.4, 772.9],
        [629.4, 716.9],
        [593.4, 739.3],
        [305.7, 851.3],
        [251.7, 56],
        [377.6, 380.9],
        [485.5, 470.5],
        [449.5, 425.7],
        [359.6, 616.1],
        [395.6, 705.7],
        [359.6, 772.9],
        [485.5, 560.1],
        [287.7, 235.2],
        [485.5, 582.5],
        [557.4, 694.5],
        [467.5, 638.5],
        [107.9, 929.7],
        [269.7, 403.3],
        [269.7, 448.1],
        [71.9, 952.1],
        [323.7, 392.1],
        [287.7, 862.5],
        [485.5, 336],
        [503.5, 481.7],
        [413.6, 291.2],
        [233.8, 425.7],
        [467.5, 347.2],
        [539.5, 817.7],
        [449.5, 448.1],
        [431.6, 459.3],
        [431.6, 481.7],
        [449.5, 470.5],
        [467.5, 459.3],
        [467.5, 504.1],
        [431.6, 324.8],
        [269.7, 560.1],
        [269.7, 537.7],
        [629.4, 784.1],
        [395.6, 324.8],
        [503.5, 571.3],
        [359.6, 750.5],
        [341.7, 627.3],
        [215.8, 817.7],
        [251.7, 840.1],
        [215.8, 862.5],
        [521.5, 582.5],
        [251.7, 392.1],
        [413.6, 224],
        [341.7, 873.7],
        [323.7, 884.9],
        [611.4, 705.7],
        [233.8, 403.3],
        [359.6, 795.3],
        [341.7, 515.3],
        [323.7, 481.7],
        [287.7, 526.5],
        [377.6, 448.1],
        [449.5, 627.3],
        [251.7, 78.4],
        [359.6, 436.9],
        [431.6, 280],
        [449.5, 313.6],
        [305.7, 492.9],
        [287.7, 504.1],
        [305.7, 515.3],
        [341.7, 492.9],
        [287.7, 638.5],
        [171.9, 452.1],
        [341.7, 672.1],
        [467.5, 795.3],
        [305.7, 380.9],
        [287.7, 772.9],
        [611.4, 660.9],
        [629.4, 649.7],
        [575.4, 660.9],
        [539.5, 638.5],
        [431.6, 235.2],
        [521.5, 828.9],
        [359.6, 817.7],
        [377.6, 851.3],
        [539.5, 840.1],
        [413.6, 806.5],
        [359.6, 548.9],
        [179.8, 750.5],
        [179.8, 728.1],
        [305.7, 761.7],
        [287.7, 795.3],
        [377.6, 492.9],
        [323.7, 459.3],
        [179.8, 884.9],
        [287.7, 548.9],
        [287.7, 728.1],
        [665.3, 806.5],
        [647.3, 817.7],
        [503.5, 369.6],
        [269.7, 761.7],
        [611.4, 750.5],
        [215.8, 884.9],
        [557.4, 806.5],
        [449.5, 806.5],
        [179.8, 929.7],
        [269.7, 672.1],
        [179.8, 952.1],
        [485.5, 694.5],
        [107.9, 952.1],
        [575.4, 817.7],
        [395.6, 795.3],
        [395.6, 212.8],
        [377.6, 246.4],
        [100, 384.8],
        [118, 396],
        [136, 452.1],
        [377.6, 739.3],
        [233.8, 537.7],
        [215.8, 750.5],
        [467.5, 772.9],
        [431.6, 392.1],
        [215.8, 481.7],
        [323.7, 526.5],
        [323.7, 548.9],
        [503.5, 705.7],
        [359.6, 212.8],
        [305.7, 784.1],
        [305.7, 582.5],
        [287.7, 436.9],
        [305.7, 448.1],
        [359.6, 638.5],
        [377.6, 515.3],
        [413.6, 246.4],
        [413.6, 672.1],
        [611.4, 638.5],
        [557.4, 828.9],
        [287.7, 481.7],
        [395.6, 616.1],
        [197.8, 851.3],
        [449.5, 649.7],
        [467.5, 414.5],
        [323.7, 571.3],
        [287.7, 616.1],
        [539.5, 728.1],
        [449.5, 739.3],
        [341.7, 291.2],
        [215.8, 840.1],
        [287.7, 369.6],
        [287.7, 817.7],
        [233.8, 851.3],
        [431.6, 795.3],
        [359.6, 862.5],
        [377.6, 784.1],
        [233.8, 492.9],
        [215.8, 504.1],
        [611.4, 683.3],
        [323.7, 728.1],
        [359.6, 840.1],
        [323.7, 840.1],
        [323.7, 504.1],
        [305.7, 560.1],
        [305.7, 537.7],
        [287.7, 683.3],
        [323.7, 683.3],
        [305.7, 694.5],
        [305.7, 268.8],
        [305.7, 425.7],
        [503.5, 862.5],
        [485.5, 873.7],
        [269.7, 582.5],
        [251.7, 548.9],
        [341.7, 739.3],
        [341.7, 313.6],
        [269.7, 627.3],
        [323.7, 414.5],
        [197.8, 873.7],
        [179.8, 526.5],
        [467.5, 369.6],
        [485.5, 358.4],
        [521.5, 380.9]
    ];
    var h = [
        [28.3, 22.3],
        [22.3, 11.1],
        [10.3, 11.1],
        [4.3, 22.3],
        [10.3, 33.5],
        [22.3, 33.5]
    ];
    Math.TAU || (Math.TAU = 2 * Math.PI), h = d3.range(6).map(function(a) {
        return a = a / 6 * Math.TAU, [Math.cos(a), Math.sin(a)]
    }).map(function(a) {
        return a.join(",")
    }).join(" "), a.classed("cartogram-view", !0);
    var i, j = {},
        k = d3.scale.linear().range([0, 500]),
        l = d3.scale.sqrt().range([0, 5]);
    j.draw = function() {
        return data.constituencies.slice().sort(function(a, b) {
            return d3.ascending(a.id, b.id)
        }).forEach(function(a, b) {
            a.hexCoords = coords[b]
        }), b ? j.renderData() : (i = a.append("svg").attr("width", "100%").attr("height", "100%").attr("viewBox", [0, 0, e, f]), i.append("defs").append("g#seat").append("polygon").attr("vector-effect", "non-scaling-stroke").attr("points", h).attr("transform", "scale(11.5)"), d = ƒ("geo", "properties", "geoCentroid", 0), k.domain(d3.extent(data.constituencies, d)), l.domain([0, d3.max(data.constituencies, ƒ("geo", "properties", "geoArea"))]), c = i.append("g.seats"), void(b = c.selectAll("use").data(data.constituencies).enter().append("g").append("use").on("click", function(a) {
            state.isHomePage ? window.open("http://www.bloomberg.com/graphics/2015-uk-election/#" + a.id, "_blank") : state.selected.setConstituency(a)
        }).attr("xlink:href", "#seat").attr("transform", function(a) {
            var b = a.geo.properties;
            return "translate(" + b.geoCentroid + ") scale(" + l(b.geoArea) + ")"
        }).call(d3.attachTooltip).on("mouseover", function(a) {
            d3.select(".tooltip").text(a.name)
        })))
    }, j.renderData = function() {
        b.data(data.constituencies, ƒ("id")).attr("class", classByWinningParty)
    }, j.renderState = function() {
        c.classed("selected", !state.selected.constituencies.empty()), b.each(function(a) {
            d3.select(this.parentElement).classed("selected", state.selected.constituencies.has(a))
        })
    };
    var m = !1;
    return j.switchProportional = function() {
        return m = !m, b.transition().duration(g).delay(ƒ(d, k)).attr("transform", function(a) {
            if (m) return "translate(" + a.hexCoords + ") scale(1)";
            var b = a.geo.properties;
            return "translate(" + b.geoCentroid + ") scale(" + l(b.geoArea) + ")"
        })
    }, j
}

function mapCartogramView(a) {
    "use strict";
    a.classed("map-cartogram", !0), a.append("div").classed("map-tab active", !0).append("div.icon.hex").append("p").text("Show proportional map view"), a.append("div").classed("map-tab", !0).append("div.icon.geo").append("p").text("Show geographic map view"), a = a.append("div.map-cartogram-container").style({
        position: "relative",
        width: "100%"
    });
    var b = a.append("div"),
        c = mapView(b),
        d = a.append("div").style({
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }),
        e = cartogramView(d),
        f = !0;
    d3.selectAll(".map-tab").on("click", function() {
        var a = d3.select(".map-tab");
        d3.selectAll(".map-tab").classed("active", function(b) {
            return !a.classed("active")
        }), f = !f, f ? e.switchProportional().call(endall, function(a, c) {
            b.classed("active", !0), d.classed("active", !1)
        }) : c.reset().each("end", function() {
            b.classed("active", !1), d.classed("active", !0).transition().duration(600).each("end", e.switchProportional)
        })
    }), b.classed("active", !0), dispatch.on("ready.mv", c.drawMap).on("dataChange.mv", c.renderData).on("stateChange.mv", c.renderState), dispatch.on("ready.cv", e.draw).on("dataChange.cv", e.renderData).on("stateChange.cv", e.renderState);
}

function searchView(a) {
    "use strict";

    function b() {
        return h ? c(data.id) : void setTimeout(function() {
            d(), c(data.id)
        }, 100)
    }

    function c(a) {
        i.typeahead("destroy"), i.typeahead("val", ""), i.typeahead({
            hint: !0,
            highlight: !0,
            minLength: 1
        }, {
            name: "constituencies",
            displayKey: "value",
            source: h[a].constituencies.ttAdapter(),
            templates: {
                header: '<h3 class="ta-header">Constituencies</h3>'
            }
        }, {
            name: "candidates",
            displayKey: "value",
            source: h[a].candidates.ttAdapter(),
            templates: {
                header: '<h3 class="ta-header">Candidates</h3>'
            }
        }).bind("typeahead:select", f).bind("typeahead:autocomplete", f)
    }

    function d() {
        h = {}, _.each(bundles, e)
    }

    function e(a) {
        h[a.id] = {};
        var b = a.candidates.map(function(a) {
                return {
                    id: a.constituency.id,
                    value: a.firstname + " " + a.lastname + " - " + a.constituency.name
                }
            }),
            c = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: b
            });
        h[a.id].candidates = c, c.initialize();
        var d = a.constituencies.map(function(a) {
                return {
                    id: a.id,
                    value: a.name
                }
            }),
            e = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace("value"),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: d
            });
        h[a.id].constituencies = e, e.initialize()
    }

    function f(a, b) {
        var c = data.idx.constituencyById[b.id];
        c && (i.typeahead("val", ""), state.selected.constituencies.has(c) || state.selected.setConstituency(c))
    }

    function g() {
        i.typeahead("val", "")
    }
    dispatch.on("ready.searchView", b).on("stateChange.searchView", g);
    var h, i = $("#type-ahead")
}! function() {
    function a(a) {
        return a && (a.ownerDocument || a.document || a).documentElement
    }

    function b(a) {
        return a && (a.ownerDocument && a.ownerDocument.defaultView || a.document && a || a.defaultView)
    }

    function c(a, b) {
        return b > a ? -1 : a > b ? 1 : a >= b ? 0 : NaN
    }

    function d(a) {
        return null === a ? NaN : +a
    }

    function e(a) {
        return !isNaN(a)
    }

    function f(a) {
        return {
            left: function(b, c, d, e) {
                for (arguments.length < 3 && (d = 0), arguments.length < 4 && (e = b.length); e > d;) {
                    var f = d + e >>> 1;
                    a(b[f], c) < 0 ? d = f + 1 : e = f
                }
                return d
            },
            right: function(b, c, d, e) {
                for (arguments.length < 3 && (d = 0), arguments.length < 4 && (e = b.length); e > d;) {
                    var f = d + e >>> 1;
                    a(b[f], c) > 0 ? e = f : d = f + 1
                }
                return d
            }
        }
    }

    function g(a) {
        return a.length
    }

    function h(a) {
        for (var b = 1; a * b % 1;) b *= 10;
        return b
    }

    function i(a, b) {
        for (var c in b) Object.defineProperty(a.prototype, c, {
            value: b[c],
            enumerable: !1
        })
    }

    function j() {
        this._ = Object.create(null)
    }

    function k(a) {
        return (a += "") === og || a[0] === pg ? pg + a : a
    }

    function l(a) {
        return (a += "")[0] === pg ? a.slice(1) : a
    }

    function m(a) {
        return k(a) in this._
    }

    function n(a) {
        return (a = k(a)) in this._ && delete this._[a]
    }

    function o() {
        var a = [];
        for (var b in this._) a.push(l(b));
        return a
    }

    function p() {
        var a = 0;
        for (var b in this._) ++a;
        return a
    }

    function q() {
        for (var a in this._) return !1;
        return !0
    }

    function r() {
        this._ = Object.create(null)
    }

    function s(a) {
        return a
    }

    function t(a, b, c) {
        return function() {
            var d = c.apply(b, arguments);
            return d === b ? a : d
        }
    }

    function u(a, b) {
        if (b in a) return b;
        b = b.charAt(0).toUpperCase() + b.slice(1);
        for (var c = 0, d = qg.length; d > c; ++c) {
            var e = qg[c] + b;
            if (e in a) return e
        }
    }

    function v() {}

    function w() {}

    function x(a) {
        function b() {
            for (var b, d = c, e = -1, f = d.length; ++e < f;)(b = d[e].on) && b.apply(this, arguments);
            return a
        }
        var c = [],
            d = new j;
        return b.on = function(b, e) {
            var f, g = d.get(b);
            return arguments.length < 2 ? g && g.on : (g && (g.on = null, c = c.slice(0, f = c.indexOf(g)).concat(c.slice(f + 1)), d.remove(b)), e && c.push(d.set(b, {
                on: e
            })), a)
        }, b
    }

    function y() {
        bg.event.preventDefault()
    }

    function z() {
        for (var a, b = bg.event; a = b.sourceEvent;) b = a;
        return b
    }

    function A(a) {
        for (var b = new w, c = 0, d = arguments.length; ++c < d;) b[arguments[c]] = x(b);
        return b.of = function(c, d) {
            return function(e) {
                try {
                    var f = e.sourceEvent = bg.event;
                    e.target = a, bg.event = e, b[e.type].apply(c, d)
                } finally {
                    bg.event = f
                }
            }
        }, b
    }

    function B(a) {
        return sg(a, wg), a
    }

    function C(a) {
        return "function" == typeof a ? a : function() {
            return tg(a, this)
        }
    }

    function D(a) {
        return "function" == typeof a ? a : function() {
            return ug(a, this)
        }
    }

    function E(a, b) {
        function c() {
            this.removeAttribute(a)
        }

        function d() {
            this.removeAttributeNS(a.space, a.local)
        }

        function e() {
            this.setAttribute(a, b)
        }

        function f() {
            this.setAttributeNS(a.space, a.local, b)
        }

        function g() {
            var c = b.apply(this, arguments);
            null == c ? this.removeAttribute(a) : this.setAttribute(a, c)
        }

        function h() {
            var c = b.apply(this, arguments);
            null == c ? this.removeAttributeNS(a.space, a.local) : this.setAttributeNS(a.space, a.local, c)
        }
        return a = bg.ns.qualify(a), null == b ? a.local ? d : c : "function" == typeof b ? a.local ? h : g : a.local ? f : e
    }

    function F(a) {
        return a.trim().replace(/\s+/g, " ")
    }

    function G(a) {
        return new RegExp("(?:^|\\s+)" + bg.requote(a) + "(?:\\s+|$)", "g")
    }

    function H(a) {
        return (a + "").trim().split(/^|\s+/)
    }

    function I(a, b) {
        function c() {
            for (var c = -1; ++c < e;) a[c](this, b)
        }

        function d() {
            for (var c = -1, d = b.apply(this, arguments); ++c < e;) a[c](this, d)
        }
        a = H(a).map(J);
        var e = a.length;
        return "function" == typeof b ? d : c
    }

    function J(a) {
        var b = G(a);
        return function(c, d) {
            if (e = c.classList) return d ? e.add(a) : e.remove(a);
            var e = c.getAttribute("class") || "";
            d ? (b.lastIndex = 0, b.test(e) || c.setAttribute("class", F(e + " " + a))) : c.setAttribute("class", F(e.replace(b, " ")))
        }
    }

    function K(a, b, c) {
        function d() {
            this.style.removeProperty(a)
        }

        function e() {
            this.style.setProperty(a, b, c)
        }

        function f() {
            var d = b.apply(this, arguments);
            null == d ? this.style.removeProperty(a) : this.style.setProperty(a, d, c)
        }
        return null == b ? d : "function" == typeof b ? f : e
    }

    function L(a, b) {
        function c() {
            delete this[a]
        }

        function d() {
            this[a] = b
        }

        function e() {
            var c = b.apply(this, arguments);
            null == c ? delete this[a] : this[a] = c
        }
        return null == b ? c : "function" == typeof b ? e : d
    }

    function M(a) {
        function b() {
            var b = this.ownerDocument,
                c = this.namespaceURI;
            return c ? b.createElementNS(c, a) : b.createElement(a)
        }

        function c() {
            return this.ownerDocument.createElementNS(a.space, a.local)
        }
        return "function" == typeof a ? a : (a = bg.ns.qualify(a)).local ? c : b
    }

    function N() {
        var a = this.parentNode;
        a && a.removeChild(this)
    }

    function O(a) {
        return {
            __data__: a
        }
    }

    function P(a) {
        return function() {
            return vg(this, a)
        }
    }

    function Q(a) {
        return arguments.length || (a = c),
            function(b, c) {
                return b && c ? a(b.__data__, c.__data__) : !b - !c
            }
    }

    function R(a, b) {
        for (var c = 0, d = a.length; d > c; c++)
            for (var e, f = a[c], g = 0, h = f.length; h > g; g++)(e = f[g]) && b(e, g, c);
        return a
    }

    function S(a) {
        return sg(a, yg), a
    }

    function T(a) {
        var b, c;
        return function(d, e, f) {
            var g, h = a[f].update,
                i = h.length;
            for (f != c && (c = f, b = 0), e >= b && (b = e + 1); !(g = h[b]) && ++b < i;);
            return g
        }
    }

    function U(a, b, c) {
        function d() {
            var b = this[g];
            b && (this.removeEventListener(a, b, b.$), delete this[g])
        }

        function e() {
            var e = i(b, dg(arguments));
            d.call(this), this.addEventListener(a, this[g] = e, e.$ = c), e._ = b
        }

        function f() {
            var b, c = new RegExp("^__on([^.]+)" + bg.requote(a) + "$");
            for (var d in this)
                if (b = d.match(c)) {
                    var e = this[d];
                    this.removeEventListener(b[1], e, e.$), delete this[d]
                }
        }
        var g = "__on" + a,
            h = a.indexOf("."),
            i = V;
        h > 0 && (a = a.slice(0, h));
        var j = zg.get(a);
        return j && (a = j, i = W), h ? b ? e : d : b ? v : f
    }

    function V(a, b) {
        return function(c) {
            var d = bg.event;
            bg.event = c, b[0] = this.__data__;
            try {
                a.apply(this, b)
            } finally {
                bg.event = d
            }
        }
    }

    function W(a, b) {
        var c = V(a, b);
        return function(a) {
            var b = this,
                d = a.relatedTarget;
            d && (d === b || 8 & d.compareDocumentPosition(b)) || c.call(b, a)
        }
    }

    function X(c) {
        var d = ".dragsuppress-" + ++Bg,
            e = "click" + d,
            f = bg.select(b(c)).on("touchmove" + d, y).on("dragstart" + d, y).on("selectstart" + d, y);
        if (null == Ag && (Ag = "onselectstart" in c ? !1 : u(c.style, "userSelect")), Ag) {
            var g = a(c).style,
                h = g[Ag];
            g[Ag] = "none"
        }
        return function(a) {
            if (f.on(d, null), Ag && (g[Ag] = h), a) {
                var b = function() {
                    f.on(e, null)
                };
                f.on(e, function() {
                    y(), b()
                }, !0), setTimeout(b, 0)
            }
        }
    }

    function Y(a, c) {
        c.changedTouches && (c = c.changedTouches[0]);
        var d = a.ownerSVGElement || a;
        if (d.createSVGPoint) {
            var e = d.createSVGPoint();
            if (0 > Cg) {
                var f = b(a);
                if (f.scrollX || f.scrollY) {
                    d = bg.select("body").append("svg").style({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        margin: 0,
                        padding: 0,
                        border: "none"
                    }, "important");
                    var g = d[0][0].getScreenCTM();
                    Cg = !(g.f || g.e), d.remove()
                }
            }
            return Cg ? (e.x = c.pageX, e.y = c.pageY) : (e.x = c.clientX, e.y = c.clientY), e = e.matrixTransform(a.getScreenCTM().inverse()), [e.x, e.y]
        }
        var h = a.getBoundingClientRect();
        return [c.clientX - h.left - a.clientLeft, c.clientY - h.top - a.clientTop]
    }

    function Z() {
        return bg.event.changedTouches[0].identifier
    }

    function $(a) {
        return a > 0 ? 1 : 0 > a ? -1 : 0
    }

    function _(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    }

    function aa(a) {
        return a > 1 ? 0 : -1 > a ? Fg : Math.acos(a)
    }

    function ba(a) {
        return a > 1 ? Ig : -1 > a ? -Ig : Math.asin(a)
    }

    function ca(a) {
        return ((a = Math.exp(a)) - 1 / a) / 2
    }

    function da(a) {
        return ((a = Math.exp(a)) + 1 / a) / 2
    }

    function ea(a) {
        return ((a = Math.exp(2 * a)) - 1) / (a + 1)
    }

    function fa(a) {
        return (a = Math.sin(a / 2)) * a
    }

    function ga() {}

    function ha(a, b, c) {
        return this instanceof ha ? (this.h = +a, this.s = +b, void(this.l = +c)) : arguments.length < 2 ? a instanceof ha ? new ha(a.h, a.s, a.l) : va("" + a, wa, ha) : new ha(a, b, c)
    }

    function ia(a, b, c) {
        function d(a) {
            return a > 360 ? a -= 360 : 0 > a && (a += 360), 60 > a ? f + (g - f) * a / 60 : 180 > a ? g : 240 > a ? f + (g - f) * (240 - a) / 60 : f
        }

        function e(a) {
            return Math.round(255 * d(a))
        }
        var f, g;
        return a = isNaN(a) ? 0 : (a %= 360) < 0 ? a + 360 : a, b = isNaN(b) ? 0 : 0 > b ? 0 : b > 1 ? 1 : b, c = 0 > c ? 0 : c > 1 ? 1 : c, g = .5 >= c ? c * (1 + b) : c + b - c * b, f = 2 * c - g, new ra(e(a + 120), e(a), e(a - 120))
    }

    function ja(a, b, c) {
        return this instanceof ja ? (this.h = +a, this.c = +b, void(this.l = +c)) : arguments.length < 2 ? a instanceof ja ? new ja(a.h, a.c, a.l) : a instanceof la ? na(a.l, a.a, a.b) : na((a = xa((a = bg.rgb(a)).r, a.g, a.b)).l, a.a, a.b) : new ja(a, b, c)
    }

    function ka(a, b, c) {
        return isNaN(a) && (a = 0), isNaN(b) && (b = 0), new la(c, Math.cos(a *= Jg) * b, Math.sin(a) * b)
    }

    function la(a, b, c) {
        return this instanceof la ? (this.l = +a, this.a = +b, void(this.b = +c)) : arguments.length < 2 ? a instanceof la ? new la(a.l, a.a, a.b) : a instanceof ja ? ka(a.h, a.c, a.l) : xa((a = ra(a)).r, a.g, a.b) : new la(a, b, c)
    }

    function ma(a, b, c) {
        var d = (a + 16) / 116,
            e = d + b / 500,
            f = d - c / 200;
        return e = oa(e) * Ug, d = oa(d) * Vg, f = oa(f) * Wg, new ra(qa(3.2404542 * e - 1.5371385 * d - .4985314 * f), qa(-.969266 * e + 1.8760108 * d + .041556 * f), qa(.0556434 * e - .2040259 * d + 1.0572252 * f))
    }

    function na(a, b, c) {
        return a > 0 ? new ja(Math.atan2(c, b) * Kg, Math.sqrt(b * b + c * c), a) : new ja(NaN, NaN, a)
    }

    function oa(a) {
        return a > .206893034 ? a * a * a : (a - 4 / 29) / 7.787037
    }

    function pa(a) {
        return a > .008856 ? Math.pow(a, 1 / 3) : 7.787037 * a + 4 / 29
    }

    function qa(a) {
        return Math.round(255 * (.00304 >= a ? 12.92 * a : 1.055 * Math.pow(a, 1 / 2.4) - .055))
    }

    function ra(a, b, c) {
        return this instanceof ra ? (this.r = ~~a, this.g = ~~b, void(this.b = ~~c)) : arguments.length < 2 ? a instanceof ra ? new ra(a.r, a.g, a.b) : va("" + a, ra, ia) : new ra(a, b, c)
    }

    function sa(a) {
        return new ra(a >> 16, a >> 8 & 255, 255 & a)
    }

    function ta(a) {
        return sa(a) + ""
    }

    function ua(a) {
        return 16 > a ? "0" + Math.max(0, a).toString(16) : Math.min(255, a).toString(16)
    }

    function va(a, b, c) {
        var d, e, f, g = 0,
            h = 0,
            i = 0;
        if (d = /([a-z]+)\((.*)\)/i.exec(a)) switch (e = d[2].split(","), d[1]) {
            case "hsl":
                return c(parseFloat(e[0]), parseFloat(e[1]) / 100, parseFloat(e[2]) / 100);
            case "rgb":
                return b(za(e[0]), za(e[1]), za(e[2]))
        }
        return (f = Zg.get(a.toLowerCase())) ? b(f.r, f.g, f.b) : (null == a || "#" !== a.charAt(0) || isNaN(f = parseInt(a.slice(1), 16)) || (4 === a.length ? (g = (3840 & f) >> 4, g = g >> 4 | g, h = 240 & f, h = h >> 4 | h, i = 15 & f, i = i << 4 | i) : 7 === a.length && (g = (16711680 & f) >> 16, h = (65280 & f) >> 8, i = 255 & f)), b(g, h, i))
    }

    function wa(a, b, c) {
        var d, e, f = Math.min(a /= 255, b /= 255, c /= 255),
            g = Math.max(a, b, c),
            h = g - f,
            i = (g + f) / 2;
        return h ? (e = .5 > i ? h / (g + f) : h / (2 - g - f), d = a == g ? (b - c) / h + (c > b ? 6 : 0) : b == g ? (c - a) / h + 2 : (a - b) / h + 4, d *= 60) : (d = NaN, e = i > 0 && 1 > i ? 0 : d), new ha(d, e, i)
    }

    function xa(a, b, c) {
        a = ya(a), b = ya(b), c = ya(c);
        var d = pa((.4124564 * a + .3575761 * b + .1804375 * c) / Ug),
            e = pa((.2126729 * a + .7151522 * b + .072175 * c) / Vg),
            f = pa((.0193339 * a + .119192 * b + .9503041 * c) / Wg);
        return la(116 * e - 16, 500 * (d - e), 200 * (e - f))
    }

    function ya(a) {
        return (a /= 255) <= .04045 ? a / 12.92 : Math.pow((a + .055) / 1.055, 2.4)
    }

    function za(a) {
        var b = parseFloat(a);
        return "%" === a.charAt(a.length - 1) ? Math.round(2.55 * b) : b
    }

    function Aa(a) {
        return "function" == typeof a ? a : function() {
            return a
        }
    }

    function Ba(a) {
        return function(b, c, d) {
            return 2 === arguments.length && "function" == typeof c && (d = c, c = null), Ca(b, c, a, d)
        }
    }

    function Ca(a, b, c, d) {
        function e() {
            var a, b = i.status;
            if (!b && Ea(i) || b >= 200 && 300 > b || 304 === b) {
                try {
                    a = c.call(f, i)
                } catch (d) {
                    return void g.error.call(f, d)
                }
                g.load.call(f, a)
            } else g.error.call(f, i)
        }
        var f = {},
            g = bg.dispatch("beforesend", "progress", "load", "error"),
            h = {},
            i = new XMLHttpRequest,
            j = null;
        return !this.XDomainRequest || "withCredentials" in i || !/^(http(s)?:)?\/\//.test(a) || (i = new XDomainRequest), "onload" in i ? i.onload = i.onerror = e : i.onreadystatechange = function() {
            i.readyState > 3 && e()
        }, i.onprogress = function(a) {
            var b = bg.event;
            bg.event = a;
            try {
                g.progress.call(f, i)
            } finally {
                bg.event = b
            }
        }, f.header = function(a, b) {
            return a = (a + "").toLowerCase(), arguments.length < 2 ? h[a] : (null == b ? delete h[a] : h[a] = b + "", f)
        }, f.mimeType = function(a) {
            return arguments.length ? (b = null == a ? null : a + "", f) : b
        }, f.responseType = function(a) {
            return arguments.length ? (j = a, f) : j
        }, f.response = function(a) {
            return c = a, f
        }, ["get", "post"].forEach(function(a) {
            f[a] = function() {
                return f.send.apply(f, [a].concat(dg(arguments)))
            }
        }), f.send = function(c, d, e) {
            if (2 === arguments.length && "function" == typeof d && (e = d, d = null), i.open(c, a, !0), null == b || "accept" in h || (h.accept = b + ",*/*"), i.setRequestHeader)
                for (var k in h) i.setRequestHeader(k, h[k]);
            return null != b && i.overrideMimeType && i.overrideMimeType(b), null != j && (i.responseType = j), null != e && f.on("error", e).on("load", function(a) {
                e(null, a)
            }), g.beforesend.call(f, i), i.send(null == d ? null : d), f
        }, f.abort = function() {
            return i.abort(), f
        }, bg.rebind(f, g, "on"), null == d ? f : f.get(Da(d))
    }

    function Da(a) {
        return 1 === a.length ? function(b, c) {
            a(null == b ? c : null)
        } : a
    }

    function Ea(a) {
        var b = a.responseType;
        return b && "text" !== b ? a.response : a.responseText
    }

    function Fa() {
        var a = Ga(),
            b = Ha() - a;
        b > 24 ? (isFinite(b) && (clearTimeout(bh), bh = setTimeout(Fa, b)), ah = 0) : (ah = 1, dh(Fa))
    }

    function Ga() {
        var a = Date.now();
        for (ch = $g; ch;) a >= ch.t && (ch.f = ch.c(a - ch.t)), ch = ch.n;
        return a
    }

    function Ha() {
        for (var a, b = $g, c = 1 / 0; b;) b.f ? b = a ? a.n = b.n : $g = b.n : (b.t < c && (c = b.t), b = (a = b).n);
        return _g = a, c
    }

    function Ia(a, b) {
        return b - (a ? Math.ceil(Math.log(a) / Math.LN10) : 1)
    }

    function Ja(a, b) {
        var c = Math.pow(10, 3 * ng(8 - b));
        return {
            scale: b > 8 ? function(a) {
                return a / c
            } : function(a) {
                return a * c
            },
            symbol: a
        }
    }

    function Ka(a) {
        var b = a.decimal,
            c = a.thousands,
            d = a.grouping,
            e = a.currency,
            f = d && c ? function(a, b) {
                for (var e = a.length, f = [], g = 0, h = d[0], i = 0; e > 0 && h > 0 && (i + h + 1 > b && (h = Math.max(1, b - i)), f.push(a.substring(e -= h, e + h)), !((i += h + 1) > b));) h = d[g = (g + 1) % d.length];
                return f.reverse().join(c)
            } : s;
        return function(a) {
            var c = fh.exec(a),
                d = c[1] || " ",
                g = c[2] || ">",
                h = c[3] || "-",
                i = c[4] || "",
                j = c[5],
                k = +c[6],
                l = c[7],
                m = c[8],
                n = c[9],
                o = 1,
                p = "",
                q = "",
                r = !1,
                s = !0;
            switch (m && (m = +m.substring(1)), (j || "0" === d && "=" === g) && (j = d = "0", g = "="), n) {
                case "n":
                    l = !0, n = "g";
                    break;
                case "%":
                    o = 100, q = "%", n = "f";
                    break;
                case "p":
                    o = 100, q = "%", n = "r";
                    break;
                case "b":
                case "o":
                case "x":
                case "X":
                    "#" === i && (p = "0" + n.toLowerCase());
                case "c":
                    s = !1;
                case "d":
                    r = !0, m = 0;
                    break;
                case "s":
                    o = -1, n = "r"
            }
            "$" === i && (p = e[0], q = e[1]), "r" != n || m || (n = "g"), null != m && ("g" == n ? m = Math.max(1, Math.min(21, m)) : ("e" == n || "f" == n) && (m = Math.max(0, Math.min(20, m)))), n = gh.get(n) || La;
            var t = j && l;
            return function(a) {
                var c = q;
                if (r && a % 1) return "";
                var e = 0 > a || 0 === a && 0 > 1 / a ? (a = -a, "-") : "-" === h ? "" : h;
                if (0 > o) {
                    var i = bg.formatPrefix(a, m);
                    a = i.scale(a), c = i.symbol + q
                } else a *= o;
                a = n(a, m);
                var u, v, w = a.lastIndexOf(".");
                if (0 > w) {
                    var x = s ? a.lastIndexOf("e") : -1;
                    0 > x ? (u = a, v = "") : (u = a.substring(0, x), v = a.substring(x))
                } else u = a.substring(0, w), v = b + a.substring(w + 1);
                !j && l && (u = f(u, 1 / 0));
                var y = p.length + u.length + v.length + (t ? 0 : e.length),
                    z = k > y ? new Array(y = k - y + 1).join(d) : "";
                return t && (u = f(z + u, z.length ? k - v.length : 1 / 0)), e += p, a = u + v, ("<" === g ? e + a + z : ">" === g ? z + e + a : "^" === g ? z.substring(0, y >>= 1) + e + a + z.substring(y) : e + (t ? a : z + a)) + c
            }
        }
    }

    function La(a) {
        return a + ""
    }

    function Ma() {
        this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0])
    }

    function Na(a, b, c) {
        function d(b) {
            var c = a(b),
                d = f(c, 1);
            return d - b > b - c ? c : d
        }

        function e(c) {
            return b(c = a(new ih(c - 1)), 1), c
        }

        function f(a, c) {
            return b(a = new ih(+a), c), a
        }

        function g(a, d, f) {
            var g = e(a),
                h = [];
            if (f > 1)
                for (; d > g;) c(g) % f || h.push(new Date(+g)), b(g, 1);
            else
                for (; d > g;) h.push(new Date(+g)), b(g, 1);
            return h
        }

        function h(a, b, c) {
            try {
                ih = Ma;
                var d = new Ma;
                return d._ = a, g(d, b, c)
            } finally {
                ih = Date
            }
        }
        a.floor = a, a.round = d, a.ceil = e, a.offset = f, a.range = g;
        var i = a.utc = Oa(a);
        return i.floor = i, i.round = Oa(d), i.ceil = Oa(e), i.offset = Oa(f), i.range = h, a
    }

    function Oa(a) {
        return function(b, c) {
            try {
                ih = Ma;
                var d = new Ma;
                return d._ = b, a(d, c)._
            } finally {
                ih = Date
            }
        }
    }

    function Pa(a) {
        function b(a) {
            function b(b) {
                for (var c, e, f, g = [], h = -1, i = 0; ++h < d;) 37 === a.charCodeAt(h) && (g.push(a.slice(i, h)), null != (e = kh[c = a.charAt(++h)]) && (c = a.charAt(++h)), (f = C[c]) && (c = f(b, null == e ? "e" === c ? " " : "0" : e)), g.push(c), i = h + 1);
                return g.push(a.slice(i, h)), g.join("")
            }
            var d = a.length;
            return b.parse = function(b) {
                var d = {
                        y: 1900,
                        m: 0,
                        d: 1,
                        H: 0,
                        M: 0,
                        S: 0,
                        L: 0,
                        Z: null
                    },
                    e = c(d, a, b, 0);
                if (e != b.length) return null;
                "p" in d && (d.H = d.H % 12 + 12 * d.p);
                var f = null != d.Z && ih !== Ma,
                    g = new(f ? Ma : ih);
                return "j" in d ? g.setFullYear(d.y, 0, d.j) : "w" in d && ("W" in d || "U" in d) ? (g.setFullYear(d.y, 0, 1), g.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + 7 * d.W - (g.getDay() + 5) % 7 : d.w + 7 * d.U - (g.getDay() + 6) % 7)) : g.setFullYear(d.y, d.m, d.d), g.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L), f ? g._ : g
            }, b.toString = function() {
                return a
            }, b
        }

        function c(a, b, c, d) {
            for (var e, f, g, h = 0, i = b.length, j = c.length; i > h;) {
                if (d >= j) return -1;
                if (e = b.charCodeAt(h++), 37 === e) {
                    if (g = b.charAt(h++), f = D[g in kh ? b.charAt(h++) : g], !f || (d = f(a, c, d)) < 0) return -1
                } else if (e != c.charCodeAt(d++)) return -1
            }
            return d
        }

        function d(a, b, c) {
            w.lastIndex = 0;
            var d = w.exec(b.slice(c));
            return d ? (a.w = x.get(d[0].toLowerCase()), c + d[0].length) : -1
        }

        function e(a, b, c) {
            u.lastIndex = 0;
            var d = u.exec(b.slice(c));
            return d ? (a.w = v.get(d[0].toLowerCase()), c + d[0].length) : -1
        }

        function f(a, b, c) {
            A.lastIndex = 0;
            var d = A.exec(b.slice(c));
            return d ? (a.m = B.get(d[0].toLowerCase()), c + d[0].length) : -1
        }

        function g(a, b, c) {
            y.lastIndex = 0;
            var d = y.exec(b.slice(c));
            return d ? (a.m = z.get(d[0].toLowerCase()), c + d[0].length) : -1
        }

        function h(a, b, d) {
            return c(a, C.c.toString(), b, d)
        }

        function i(a, b, d) {
            return c(a, C.x.toString(), b, d)
        }

        function j(a, b, d) {
            return c(a, C.X.toString(), b, d)
        }

        function k(a, b, c) {
            var d = t.get(b.slice(c, c += 2).toLowerCase());
            return null == d ? -1 : (a.p = d, c)
        }
        var l = a.dateTime,
            m = a.date,
            n = a.time,
            o = a.periods,
            p = a.days,
            q = a.shortDays,
            r = a.months,
            s = a.shortMonths;
        b.utc = function(a) {
            function c(a) {
                try {
                    ih = Ma;
                    var b = new ih;
                    return b._ = a, d(b)
                } finally {
                    ih = Date
                }
            }
            var d = b(a);
            return c.parse = function(a) {
                try {
                    ih = Ma;
                    var b = d.parse(a);
                    return b && b._
                } finally {
                    ih = Date
                }
            }, c.toString = d.toString, c
        }, b.multi = b.utc.multi = hb;
        var t = bg.map(),
            u = Ra(p),
            v = Sa(p),
            w = Ra(q),
            x = Sa(q),
            y = Ra(r),
            z = Sa(r),
            A = Ra(s),
            B = Sa(s);
        o.forEach(function(a, b) {
            t.set(a.toLowerCase(), b)
        });
        var C = {
                a: function(a) {
                    return q[a.getDay()]
                },
                A: function(a) {
                    return p[a.getDay()]
                },
                b: function(a) {
                    return s[a.getMonth()]
                },
                B: function(a) {
                    return r[a.getMonth()]
                },
                c: b(l),
                d: function(a, b) {
                    return Qa(a.getDate(), b, 2)
                },
                e: function(a, b) {
                    return Qa(a.getDate(), b, 2)
                },
                H: function(a, b) {
                    return Qa(a.getHours(), b, 2)
                },
                I: function(a, b) {
                    return Qa(a.getHours() % 12 || 12, b, 2)
                },
                j: function(a, b) {
                    return Qa(1 + hh.dayOfYear(a), b, 3)
                },
                L: function(a, b) {
                    return Qa(a.getMilliseconds(), b, 3)
                },
                m: function(a, b) {
                    return Qa(a.getMonth() + 1, b, 2)
                },
                M: function(a, b) {
                    return Qa(a.getMinutes(), b, 2)
                },
                p: function(a) {
                    return o[+(a.getHours() >= 12)]
                },
                S: function(a, b) {
                    return Qa(a.getSeconds(), b, 2)
                },
                U: function(a, b) {
                    return Qa(hh.sundayOfYear(a), b, 2)
                },
                w: function(a) {
                    return a.getDay()
                },
                W: function(a, b) {
                    return Qa(hh.mondayOfYear(a), b, 2)
                },
                x: b(m),
                X: b(n),
                y: function(a, b) {
                    return Qa(a.getFullYear() % 100, b, 2)
                },
                Y: function(a, b) {
                    return Qa(a.getFullYear() % 1e4, b, 4)
                },
                Z: fb,
                "%": function() {
                    return "%"
                }
            },
            D = {
                a: d,
                A: e,
                b: f,
                B: g,
                c: h,
                d: _a,
                e: _a,
                H: bb,
                I: bb,
                j: ab,
                L: eb,
                m: $a,
                M: cb,
                p: k,
                S: db,
                U: Ua,
                w: Ta,
                W: Va,
                x: i,
                X: j,
                y: Xa,
                Y: Wa,
                Z: Ya,
                "%": gb
            };
        return b
    }

    function Qa(a, b, c) {
        var d = 0 > a ? "-" : "",
            e = (d ? -a : a) + "",
            f = e.length;
        return d + (c > f ? new Array(c - f + 1).join(b) + e : e)
    }

    function Ra(a) {
        return new RegExp("^(?:" + a.map(bg.requote).join("|") + ")", "i")
    }

    function Sa(a) {
        for (var b = new j, c = -1, d = a.length; ++c < d;) b.set(a[c].toLowerCase(), c);
        return b
    }

    function Ta(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 1));
        return d ? (a.w = +d[0], c + d[0].length) : -1
    }

    function Ua(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c));
        return d ? (a.U = +d[0], c + d[0].length) : -1
    }

    function Va(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c));
        return d ? (a.W = +d[0], c + d[0].length) : -1
    }

    function Wa(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 4));
        return d ? (a.y = +d[0], c + d[0].length) : -1
    }

    function Xa(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 2));
        return d ? (a.y = Za(+d[0]), c + d[0].length) : -1
    }

    function Ya(a, b, c) {
        return /^[+-]\d{4}$/.test(b = b.slice(c, c + 5)) ? (a.Z = -b, c + 5) : -1
    }

    function Za(a) {
        return a + (a > 68 ? 1900 : 2e3)
    }

    function $a(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 2));
        return d ? (a.m = d[0] - 1, c + d[0].length) : -1
    }

    function _a(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 2));
        return d ? (a.d = +d[0], c + d[0].length) : -1
    }

    function ab(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 3));
        return d ? (a.j = +d[0], c + d[0].length) : -1
    }

    function bb(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 2));
        return d ? (a.H = +d[0], c + d[0].length) : -1
    }

    function cb(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 2));
        return d ? (a.M = +d[0], c + d[0].length) : -1
    }

    function db(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 2));
        return d ? (a.S = +d[0], c + d[0].length) : -1
    }

    function eb(a, b, c) {
        lh.lastIndex = 0;
        var d = lh.exec(b.slice(c, c + 3));
        return d ? (a.L = +d[0], c + d[0].length) : -1
    }

    function fb(a) {
        var b = a.getTimezoneOffset(),
            c = b > 0 ? "-" : "+",
            d = ng(b) / 60 | 0,
            e = ng(b) % 60;
        return c + Qa(d, "0", 2) + Qa(e, "0", 2)
    }

    function gb(a, b, c) {
        mh.lastIndex = 0;
        var d = mh.exec(b.slice(c, c + 1));
        return d ? c + d[0].length : -1
    }

    function hb(a) {
        for (var b = a.length, c = -1; ++c < b;) a[c][0] = this(a[c][0]);
        return function(b) {
            for (var c = 0, d = a[c]; !d[1](b);) d = a[++c];
            return d[0](b)
        }
    }

    function ib() {}

    function jb(a, b, c) {
        var d = c.s = a + b,
            e = d - a,
            f = d - e;
        c.t = a - f + (b - e)
    }

    function kb(a, b) {
        a && qh.hasOwnProperty(a.type) && qh[a.type](a, b)
    }

    function lb(a, b, c) {
        var d, e = -1,
            f = a.length - c;
        for (b.lineStart(); ++e < f;) d = a[e], b.point(d[0], d[1], d[2]);
        b.lineEnd()
    }

    function mb(a, b) {
        var c = -1,
            d = a.length;
        for (b.polygonStart(); ++c < d;) lb(a[c], b, 1);
        b.polygonEnd()
    }

    function nb() {
        function a(a, b) {
            a *= Jg, b = b * Jg / 2 + Fg / 4;
            var c = a - d,
                g = c >= 0 ? 1 : -1,
                h = g * c,
                i = Math.cos(b),
                j = Math.sin(b),
                k = f * j,
                l = e * i + k * Math.cos(h),
                m = k * g * Math.sin(h);
            sh.add(Math.atan2(m, l)), d = a, e = i, f = j
        }
        var b, c, d, e, f;
        th.point = function(g, h) {
            th.point = a, d = (b = g) * Jg, e = Math.cos(h = (c = h) * Jg / 2 + Fg / 4), f = Math.sin(h)
        }, th.lineEnd = function() {
            a(b, c)
        }
    }

    function ob(a) {
        var b = a[0],
            c = a[1],
            d = Math.cos(c);
        return [d * Math.cos(b), d * Math.sin(b), Math.sin(c)]
    }

    function pb(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    }

    function qb(a, b) {
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
    }

    function rb(a, b) {
        a[0] += b[0], a[1] += b[1], a[2] += b[2]
    }

    function sb(a, b) {
        return [a[0] * b, a[1] * b, a[2] * b]
    }

    function tb(a) {
        var b = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        a[0] /= b, a[1] /= b, a[2] /= b
    }

    function ub(a) {
        return [Math.atan2(a[1], a[0]), ba(a[2])]
    }

    function vb(a, b) {
        return ng(a[0] - b[0]) < Dg && ng(a[1] - b[1]) < Dg
    }

    function wb(a, b) {
        a *= Jg;
        var c = Math.cos(b *= Jg);
        xb(c * Math.cos(a), c * Math.sin(a), Math.sin(b))
    }

    function xb(a, b, c) {
        ++uh, wh += (a - wh) / uh, xh += (b - xh) / uh, yh += (c - yh) / uh
    }

    function yb() {
        function a(a, e) {
            a *= Jg;
            var f = Math.cos(e *= Jg),
                g = f * Math.cos(a),
                h = f * Math.sin(a),
                i = Math.sin(e),
                j = Math.atan2(Math.sqrt((j = c * i - d * h) * j + (j = d * g - b * i) * j + (j = b * h - c * g) * j), b * g + c * h + d * i);
            vh += j, zh += j * (b + (b = g)), Ah += j * (c + (c = h)), Bh += j * (d + (d = i)), xb(b, c, d)
        }
        var b, c, d;
        Fh.point = function(e, f) {
            e *= Jg;
            var g = Math.cos(f *= Jg);
            b = g * Math.cos(e), c = g * Math.sin(e), d = Math.sin(f), Fh.point = a, xb(b, c, d)
        }
    }

    function zb() {
        Fh.point = wb
    }

    function Ab() {
        function a(a, b) {
            a *= Jg;
            var c = Math.cos(b *= Jg),
                g = c * Math.cos(a),
                h = c * Math.sin(a),
                i = Math.sin(b),
                j = e * i - f * h,
                k = f * g - d * i,
                l = d * h - e * g,
                m = Math.sqrt(j * j + k * k + l * l),
                n = d * g + e * h + f * i,
                o = m && -aa(n) / m,
                p = Math.atan2(m, n);
            Ch += o * j, Dh += o * k, Eh += o * l, vh += p, zh += p * (d + (d = g)), Ah += p * (e + (e = h)), Bh += p * (f + (f = i)), xb(d, e, f)
        }
        var b, c, d, e, f;
        Fh.point = function(g, h) {
            b = g, c = h, Fh.point = a, g *= Jg;
            var i = Math.cos(h *= Jg);
            d = i * Math.cos(g), e = i * Math.sin(g), f = Math.sin(h), xb(d, e, f)
        }, Fh.lineEnd = function() {
            a(b, c), Fh.lineEnd = zb, Fh.point = wb
        }
    }

    function Bb(a, b) {
        function c(c, d) {
            return c = a(c, d), b(c[0], c[1])
        }
        return a.invert && b.invert && (c.invert = function(c, d) {
            return c = b.invert(c, d), c && a.invert(c[0], c[1])
        }), c
    }

    function Cb() {
        return !0
    }

    function Db(a, b, c, d, e) {
        var f = [],
            g = [];
        if (a.forEach(function(a) {
                if (!((b = a.length - 1) <= 0)) {
                    var b, c = a[0],
                        d = a[b];
                    if (vb(c, d)) {
                        e.lineStart();
                        for (var h = 0; b > h; ++h) e.point((c = a[h])[0], c[1]);
                        return void e.lineEnd()
                    }
                    var i = new Fb(c, a, null, !0),
                        j = new Fb(c, null, i, !1);
                    i.o = j, f.push(i), g.push(j), i = new Fb(d, a, null, !1), j = new Fb(d, null, i, !0), i.o = j, f.push(i), g.push(j)
                }
            }), g.sort(b), Eb(f), Eb(g), f.length) {
            for (var h = 0, i = c, j = g.length; j > h; ++h) g[h].e = i = !i;
            for (var k, l, m = f[0];;) {
                for (var n = m, o = !0; n.v;)
                    if ((n = n.n) === m) return;
                k = n.z, e.lineStart();
                do {
                    if (n.v = n.o.v = !0, n.e) {
                        if (o)
                            for (var h = 0, j = k.length; j > h; ++h) e.point((l = k[h])[0], l[1]);
                        else d(n.x, n.n.x, 1, e);
                        n = n.n
                    } else {
                        if (o) {
                            k = n.p.z;
                            for (var h = k.length - 1; h >= 0; --h) e.point((l = k[h])[0], l[1])
                        } else d(n.x, n.p.x, -1, e);
                        n = n.p
                    }
                    n = n.o, k = n.z, o = !o
                } while (!n.v);
                e.lineEnd()
            }
        }
    }

    function Eb(a) {
        if (b = a.length) {
            for (var b, c, d = 0, e = a[0]; ++d < b;) e.n = c = a[d], c.p = e, e = c;
            e.n = c = a[0], c.p = e
        }
    }

    function Fb(a, b, c, d) {
        this.x = a, this.z = b, this.o = c, this.e = d, this.v = !1, this.n = this.p = null
    }

    function Gb(a, b, c, d) {
        return function(e, f) {
            function g(b, c) {
                var d = e(b, c);
                a(b = d[0], c = d[1]) && f.point(b, c)
            }

            function h(a, b) {
                var c = e(a, b);
                q.point(c[0], c[1])
            }

            function i() {
                s.point = h, q.lineStart()
            }

            function j() {
                s.point = g, q.lineEnd()
            }

            function k(a, b) {
                p.push([a, b]);
                var c = e(a, b);
                u.point(c[0], c[1])
            }

            function l() {
                u.lineStart(), p = []
            }

            function m() {
                k(p[0][0], p[0][1]), u.lineEnd();
                var a, b = u.clean(),
                    c = t.buffer(),
                    d = c.length;
                if (p.pop(), o.push(p), p = null, d)
                    if (1 & b) {
                        a = c[0];
                        var e, d = a.length - 1,
                            g = -1;
                        if (d > 0) {
                            for (v || (f.polygonStart(), v = !0), f.lineStart(); ++g < d;) f.point((e = a[g])[0], e[1]);
                            f.lineEnd()
                        }
                    } else d > 1 && 2 & b && c.push(c.pop().concat(c.shift())), n.push(c.filter(Hb))
            }
            var n, o, p, q = b(f),
                r = e.invert(d[0], d[1]),
                s = {
                    point: g,
                    lineStart: i,
                    lineEnd: j,
                    polygonStart: function() {
                        s.point = k, s.lineStart = l, s.lineEnd = m, n = [], o = []
                    },
                    polygonEnd: function() {
                        s.point = g, s.lineStart = i, s.lineEnd = j, n = bg.merge(n);
                        var a = Nb(r, o);
                        n.length ? (v || (f.polygonStart(), v = !0), Db(n, Jb, a, c, f)) : a && (v || (f.polygonStart(), v = !0), f.lineStart(), c(null, null, 1, f), f.lineEnd()), v && (f.polygonEnd(), v = !1), n = o = null
                    },
                    sphere: function() {
                        f.polygonStart(), f.lineStart(), c(null, null, 1, f), f.lineEnd(), f.polygonEnd()
                    }
                },
                t = Ib(),
                u = b(t),
                v = !1;
            return s
        }
    }

    function Hb(a) {
        return a.length > 1
    }

    function Ib() {
        var a, b = [];
        return {
            lineStart: function() {
                b.push(a = [])
            },
            point: function(b, c) {
                a.push([b, c])
            },
            lineEnd: v,
            buffer: function() {
                var c = b;
                return b = [], a = null, c
            },
            rejoin: function() {
                b.length > 1 && b.push(b.pop().concat(b.shift()))
            }
        }
    }

    function Jb(a, b) {
        return ((a = a.x)[0] < 0 ? a[1] - Ig - Dg : Ig - a[1]) - ((b = b.x)[0] < 0 ? b[1] - Ig - Dg : Ig - b[1])
    }

    function Kb(a) {
        var b, c = NaN,
            d = NaN,
            e = NaN;
        return {
            lineStart: function() {
                a.lineStart(), b = 1
            },
            point: function(f, g) {
                var h = f > 0 ? Fg : -Fg,
                    i = ng(f - c);
                ng(i - Fg) < Dg ? (a.point(c, d = (d + g) / 2 > 0 ? Ig : -Ig), a.point(e, d), a.lineEnd(), a.lineStart(), a.point(h, d), a.point(f, d), b = 0) : e !== h && i >= Fg && (ng(c - e) < Dg && (c -= e * Dg), ng(f - h) < Dg && (f -= h * Dg), d = Lb(c, d, f, g), a.point(e, d), a.lineEnd(), a.lineStart(), a.point(h, d), b = 0), a.point(c = f, d = g), e = h
            },
            lineEnd: function() {
                a.lineEnd(), c = d = NaN
            },
            clean: function() {
                return 2 - b
            }
        }
    }

    function Lb(a, b, c, d) {
        var e, f, g = Math.sin(a - c);
        return ng(g) > Dg ? Math.atan((Math.sin(b) * (f = Math.cos(d)) * Math.sin(c) - Math.sin(d) * (e = Math.cos(b)) * Math.sin(a)) / (e * f * g)) : (b + d) / 2
    }

    function Mb(a, b, c, d) {
        var e;
        if (null == a) e = c * Ig, d.point(-Fg, e), d.point(0, e), d.point(Fg, e), d.point(Fg, 0), d.point(Fg, -e), d.point(0, -e), d.point(-Fg, -e), d.point(-Fg, 0), d.point(-Fg, e);
        else if (ng(a[0] - b[0]) > Dg) {
            var f = a[0] < b[0] ? Fg : -Fg;
            e = c * f / 2, d.point(-f, e), d.point(0, e), d.point(f, e)
        } else d.point(b[0], b[1])
    }

    function Nb(a, b) {
        var c = a[0],
            d = a[1],
            e = [Math.sin(c), -Math.cos(c), 0],
            f = 0,
            g = 0;
        sh.reset();
        for (var h = 0, i = b.length; i > h; ++h) {
            var j = b[h],
                k = j.length;
            if (k)
                for (var l = j[0], m = l[0], n = l[1] / 2 + Fg / 4, o = Math.sin(n), p = Math.cos(n), q = 1;;) {
                    q === k && (q = 0), a = j[q];
                    var r = a[0],
                        s = a[1] / 2 + Fg / 4,
                        t = Math.sin(s),
                        u = Math.cos(s),
                        v = r - m,
                        w = v >= 0 ? 1 : -1,
                        x = w * v,
                        y = x > Fg,
                        z = o * t;
                    if (sh.add(Math.atan2(z * w * Math.sin(x), p * u + z * Math.cos(x))), f += y ? v + w * Gg : v, y ^ m >= c ^ r >= c) {
                        var A = qb(ob(l), ob(a));
                        tb(A);
                        var B = qb(e, A);
                        tb(B);
                        var C = (y ^ v >= 0 ? -1 : 1) * ba(B[2]);
                        (d > C || d === C && (A[0] || A[1])) && (g += y ^ v >= 0 ? 1 : -1)
                    }
                    if (!q++) break;
                    m = r, o = t, p = u, l = a
                }
        }
        return (-Dg > f || Dg > f && 0 > sh) ^ 1 & g
    }

    function Ob(a) {
        function b(a, b) {
            return Math.cos(a) * Math.cos(b) > f
        }

        function c(a) {
            var c, f, i, j, k;
            return {
                lineStart: function() {
                    j = i = !1, k = 1
                },
                point: function(l, m) {
                    var n, o = [l, m],
                        p = b(l, m),
                        q = g ? p ? 0 : e(l, m) : p ? e(l + (0 > l ? Fg : -Fg), m) : 0;
                    if (!c && (j = i = p) && a.lineStart(), p !== i && (n = d(c, o), (vb(c, n) || vb(o, n)) && (o[0] += Dg, o[1] += Dg, p = b(o[0], o[1]))), p !== i) k = 0, p ? (a.lineStart(), n = d(o, c), a.point(n[0], n[1])) : (n = d(c, o), a.point(n[0], n[1]), a.lineEnd()), c = n;
                    else if (h && c && g ^ p) {
                        var r;
                        q & f || !(r = d(o, c, !0)) || (k = 0, g ? (a.lineStart(), a.point(r[0][0], r[0][1]), a.point(r[1][0], r[1][1]), a.lineEnd()) : (a.point(r[1][0], r[1][1]), a.lineEnd(), a.lineStart(), a.point(r[0][0], r[0][1])))
                    }!p || c && vb(c, o) || a.point(o[0], o[1]), c = o, i = p, f = q
                },
                lineEnd: function() {
                    i && a.lineEnd(), c = null
                },
                clean: function() {
                    return k | (j && i) << 1
                }
            }
        }

        function d(a, b, c) {
            var d = ob(a),
                e = ob(b),
                g = [1, 0, 0],
                h = qb(d, e),
                i = pb(h, h),
                j = h[0],
                k = i - j * j;
            if (!k) return !c && a;
            var l = f * i / k,
                m = -f * j / k,
                n = qb(g, h),
                o = sb(g, l),
                p = sb(h, m);
            rb(o, p);
            var q = n,
                r = pb(o, q),
                s = pb(q, q),
                t = r * r - s * (pb(o, o) - 1);
            if (!(0 > t)) {
                var u = Math.sqrt(t),
                    v = sb(q, (-r - u) / s);
                if (rb(v, o), v = ub(v), !c) return v;
                var w, x = a[0],
                    y = b[0],
                    z = a[1],
                    A = b[1];
                x > y && (w = x, x = y, y = w);
                var B = y - x,
                    C = ng(B - Fg) < Dg,
                    D = C || Dg > B;
                if (!C && z > A && (w = z, z = A, A = w), D ? C ? z + A > 0 ^ v[1] < (ng(v[0] - x) < Dg ? z : A) : z <= v[1] && v[1] <= A : B > Fg ^ (x <= v[0] && v[0] <= y)) {
                    var E = sb(q, (-r + u) / s);
                    return rb(E, o), [v, ub(E)]
                }
            }
        }

        function e(b, c) {
            var d = g ? a : Fg - a,
                e = 0;
            return -d > b ? e |= 1 : b > d && (e |= 2), -d > c ? e |= 4 : c > d && (e |= 8), e
        }
        var f = Math.cos(a),
            g = f > 0,
            h = ng(f) > Dg,
            i = nc(a, 6 * Jg);
        return Gb(b, c, i, g ? [0, -a] : [-Fg, a - Fg])
    }

    function Pb(a, b, c, d) {
        return function(e) {
            var f, g = e.a,
                h = e.b,
                i = g.x,
                j = g.y,
                k = h.x,
                l = h.y,
                m = 0,
                n = 1,
                o = k - i,
                p = l - j;
            if (f = a - i, o || !(f > 0)) {
                if (f /= o, 0 > o) {
                    if (m > f) return;
                    n > f && (n = f)
                } else if (o > 0) {
                    if (f > n) return;
                    f > m && (m = f)
                }
                if (f = c - i, o || !(0 > f)) {
                    if (f /= o, 0 > o) {
                        if (f > n) return;
                        f > m && (m = f)
                    } else if (o > 0) {
                        if (m > f) return;
                        n > f && (n = f)
                    }
                    if (f = b - j, p || !(f > 0)) {
                        if (f /= p, 0 > p) {
                            if (m > f) return;
                            n > f && (n = f)
                        } else if (p > 0) {
                            if (f > n) return;
                            f > m && (m = f)
                        }
                        if (f = d - j, p || !(0 > f)) {
                            if (f /= p, 0 > p) {
                                if (f > n) return;
                                f > m && (m = f)
                            } else if (p > 0) {
                                if (m > f) return;
                                n > f && (n = f)
                            }
                            return m > 0 && (e.a = {
                                x: i + m * o,
                                y: j + m * p
                            }), 1 > n && (e.b = {
                                x: i + n * o,
                                y: j + n * p
                            }), e
                        }
                    }
                }
            }
        }
    }

    function Qb(a, b, c, d) {
        function e(d, e) {
            return ng(d[0] - a) < Dg ? e > 0 ? 0 : 3 : ng(d[0] - c) < Dg ? e > 0 ? 2 : 1 : ng(d[1] - b) < Dg ? e > 0 ? 1 : 0 : e > 0 ? 3 : 2
        }

        function f(a, b) {
            return g(a.x, b.x)
        }

        function g(a, b) {
            var c = e(a, 1),
                d = e(b, 1);
            return c !== d ? c - d : 0 === c ? b[1] - a[1] : 1 === c ? a[0] - b[0] : 2 === c ? a[1] - b[1] : b[0] - a[0]
        }
        return function(h) {
            function i(a) {
                for (var b = 0, c = q.length, d = a[1], e = 0; c > e; ++e)
                    for (var f, g = 1, h = q[e], i = h.length, j = h[0]; i > g; ++g) f = h[g], j[1] <= d ? f[1] > d && _(j, f, a) > 0 && ++b : f[1] <= d && _(j, f, a) < 0 && --b, j = f;
                return 0 !== b
            }

            function j(f, h, i, j) {
                var k = 0,
                    l = 0;
                if (null == f || (k = e(f, i)) !== (l = e(h, i)) || g(f, h) < 0 ^ i > 0) {
                    do j.point(0 === k || 3 === k ? a : c, k > 1 ? d : b); while ((k = (k + i + 4) % 4) !== l)
                } else j.point(h[0], h[1])
            }

            function k(e, f) {
                return e >= a && c >= e && f >= b && d >= f
            }

            function l(a, b) {
                k(a, b) && h.point(a, b)
            }

            function m() {
                D.point = o, q && q.push(r = []), y = !0, x = !1, v = w = NaN
            }

            function n() {
                p && (o(s, t), u && x && B.rejoin(), p.push(B.buffer())), D.point = l, x && h.lineEnd()
            }

            function o(a, b) {
                a = Math.max(-Hh, Math.min(Hh, a)), b = Math.max(-Hh, Math.min(Hh, b));
                var c = k(a, b);
                if (q && r.push([a, b]), y) s = a, t = b, u = c, y = !1, c && (h.lineStart(), h.point(a, b));
                else if (c && x) h.point(a, b);
                else {
                    var d = {
                        a: {
                            x: v,
                            y: w
                        },
                        b: {
                            x: a,
                            y: b
                        }
                    };
                    C(d) ? (x || (h.lineStart(), h.point(d.a.x, d.a.y)), h.point(d.b.x, d.b.y), c || h.lineEnd(), z = !1) : c && (h.lineStart(), h.point(a, b), z = !1)
                }
                v = a, w = b, x = c
            }
            var p, q, r, s, t, u, v, w, x, y, z, A = h,
                B = Ib(),
                C = Pb(a, b, c, d),
                D = {
                    point: l,
                    lineStart: m,
                    lineEnd: n,
                    polygonStart: function() {
                        h = B, p = [], q = [], z = !0
                    },
                    polygonEnd: function() {
                        h = A, p = bg.merge(p);
                        var b = i([a, d]),
                            c = z && b,
                            e = p.length;
                        (c || e) && (h.polygonStart(), c && (h.lineStart(), j(null, null, 1, h), h.lineEnd()), e && Db(p, f, b, j, h), h.polygonEnd()), p = q = r = null
                    }
                };
            return D
        }
    }

    function Rb(a) {
        var b = 0,
            c = Fg / 3,
            d = fc(a),
            e = d(b, c);
        return e.parallels = function(a) {
            return arguments.length ? d(b = a[0] * Fg / 180, c = a[1] * Fg / 180) : [b / Fg * 180, c / Fg * 180]
        }, e
    }

    function Sb(a, b) {
        function c(a, b) {
            var c = Math.sqrt(f - 2 * e * Math.sin(b)) / e;
            return [c * Math.sin(a *= e), g - c * Math.cos(a)]
        }
        var d = Math.sin(a),
            e = (d + Math.sin(b)) / 2,
            f = 1 + d * (2 * e - d),
            g = Math.sqrt(f) / e;
        return c.invert = function(a, b) {
            var c = g - b;
            return [Math.atan2(a, c) / e, ba((f - (a * a + c * c) * e * e) / (2 * e))]
        }, c
    }

    function Tb() {
        function a(a, b) {
            Jh += e * a - d * b, d = a, e = b
        }
        var b, c, d, e;
        Oh.point = function(f, g) {
            Oh.point = a, b = d = f, c = e = g
        }, Oh.lineEnd = function() {
            a(b, c)
        }
    }

    function Ub(a, b) {
        Kh > a && (Kh = a), a > Mh && (Mh = a), Lh > b && (Lh = b), b > Nh && (Nh = b)
    }

    function Vb() {
        function a(a, b) {
            g.push("M", a, ",", b, f)
        }

        function b(a, b) {
            g.push("M", a, ",", b), h.point = c
        }

        function c(a, b) {
            g.push("L", a, ",", b)
        }

        function d() {
            h.point = a
        }

        function e() {
            g.push("Z")
        }
        var f = Wb(4.5),
            g = [],
            h = {
                point: a,
                lineStart: function() {
                    h.point = b
                },
                lineEnd: d,
                polygonStart: function() {
                    h.lineEnd = e
                },
                polygonEnd: function() {
                    h.lineEnd = d, h.point = a
                },
                pointRadius: function(a) {
                    return f = Wb(a), h
                },
                result: function() {
                    if (g.length) {
                        var a = g.join("");
                        return g = [], a
                    }
                }
            };
        return h
    }

    function Wb(a) {
        return "m0," + a + "a" + a + "," + a + " 0 1,1 0," + -2 * a + "a" + a + "," + a + " 0 1,1 0," + 2 * a + "z"
    }

    function Xb(a, b) {
        wh += a, xh += b, ++yh
    }

    function Yb() {
        function a(a, d) {
            var e = a - b,
                f = d - c,
                g = Math.sqrt(e * e + f * f);
            zh += g * (b + a) / 2, Ah += g * (c + d) / 2, Bh += g, Xb(b = a, c = d)
        }
        var b, c;
        Qh.point = function(d, e) {
            Qh.point = a, Xb(b = d, c = e)
        }
    }

    function Zb() {
        Qh.point = Xb
    }

    function $b() {
        function a(a, b) {
            var c = a - d,
                f = b - e,
                g = Math.sqrt(c * c + f * f);
            zh += g * (d + a) / 2, Ah += g * (e + b) / 2, Bh += g, g = e * a - d * b, Ch += g * (d + a), Dh += g * (e + b), Eh += 3 * g, Xb(d = a, e = b)
        }
        var b, c, d, e;
        Qh.point = function(f, g) {
            Qh.point = a, Xb(b = d = f, c = e = g)
        }, Qh.lineEnd = function() {
            a(b, c)
        }
    }

    function _b(a) {
        function b(b, c) {
            a.moveTo(b + g, c), a.arc(b, c, g, 0, Gg)
        }

        function c(b, c) {
            a.moveTo(b, c), h.point = d
        }

        function d(b, c) {
            a.lineTo(b, c)
        }

        function e() {
            h.point = b
        }

        function f() {
            a.closePath()
        }
        var g = 4.5,
            h = {
                point: b,
                lineStart: function() {
                    h.point = c
                },
                lineEnd: e,
                polygonStart: function() {
                    h.lineEnd = f
                },
                polygonEnd: function() {
                    h.lineEnd = e, h.point = b
                },
                pointRadius: function(a) {
                    return g = a, h
                },
                result: v
            };
        return h
    }

    function ac(a) {
        function b(a) {
            return (h ? d : c)(a)
        }

        function c(b) {
            return dc(b, function(c, d) {
                c = a(c, d), b.point(c[0], c[1])
            })
        }

        function d(b) {
            function c(c, d) {
                c = a(c, d), b.point(c[0], c[1])
            }

            function d() {
                t = NaN, y.point = f, b.lineStart()
            }

            function f(c, d) {
                var f = ob([c, d]),
                    g = a(c, d);
                e(t, u, s, v, w, x, t = g[0], u = g[1], s = c, v = f[0], w = f[1], x = f[2], h, b), b.point(t, u)
            }

            function g() {
                y.point = c, b.lineEnd()
            }

            function i() {
                d(), y.point = j, y.lineEnd = k
            }

            function j(a, b) {
                f(l = a, m = b), n = t, o = u, p = v, q = w, r = x, y.point = f
            }

            function k() {
                e(t, u, s, v, w, x, n, o, l, p, q, r, h, b), y.lineEnd = g, g()
            }
            var l, m, n, o, p, q, r, s, t, u, v, w, x, y = {
                point: c,
                lineStart: d,
                lineEnd: g,
                polygonStart: function() {
                    b.polygonStart(), y.lineStart = i
                },
                polygonEnd: function() {
                    b.polygonEnd(), y.lineStart = d
                }
            };
            return y
        }

        function e(b, c, d, h, i, j, k, l, m, n, o, p, q, r) {
            var s = k - b,
                t = l - c,
                u = s * s + t * t;
            if (u > 4 * f && q--) {
                var v = h + n,
                    w = i + o,
                    x = j + p,
                    y = Math.sqrt(v * v + w * w + x * x),
                    z = Math.asin(x /= y),
                    A = ng(ng(x) - 1) < Dg || ng(d - m) < Dg ? (d + m) / 2 : Math.atan2(w, v),
                    B = a(A, z),
                    C = B[0],
                    D = B[1],
                    E = C - b,
                    F = D - c,
                    G = t * E - s * F;
                (G * G / u > f || ng((s * E + t * F) / u - .5) > .3 || g > h * n + i * o + j * p) && (e(b, c, d, h, i, j, C, D, A, v /= y, w /= y, x, q, r), r.point(C, D), e(C, D, A, v, w, x, k, l, m, n, o, p, q, r))
            }
        }
        var f = .5,
            g = Math.cos(30 * Jg),
            h = 16;
        return b.precision = function(a) {
            return arguments.length ? (h = (f = a * a) > 0 && 16, b) : Math.sqrt(f)
        }, b
    }

    function bc(a) {
        var b = ac(function(b, c) {
            return a([b * Kg, c * Kg])
        });
        return function(a) {
            return gc(b(a))
        }
    }

    function cc(a) {
        this.stream = a
    }

    function dc(a, b) {
        return {
            point: b,
            sphere: function() {
                a.sphere()
            },
            lineStart: function() {
                a.lineStart()
            },
            lineEnd: function() {
                a.lineEnd()
            },
            polygonStart: function() {
                a.polygonStart()
            },
            polygonEnd: function() {
                a.polygonEnd()
            }
        }
    }

    function ec(a) {
        return fc(function() {
            return a
        })()
    }

    function fc(a) {
        function b(a) {
            return a = h(a[0] * Jg, a[1] * Jg), [a[0] * m + i, j - a[1] * m]
        }

        function c(a) {
            return a = h.invert((a[0] - i) / m, (j - a[1]) / m), a && [a[0] * Kg, a[1] * Kg]
        }

        function d() {
            h = Bb(g = jc(r, t, u), f);
            var a = f(p, q);
            return i = n - a[0] * m, j = o + a[1] * m, e()
        }

        function e() {
            return k && (k.valid = !1, k = null), b
        }
        var f, g, h, i, j, k, l = ac(function(a, b) {
                return a = f(a, b), [a[0] * m + i, j - a[1] * m]
            }),
            m = 150,
            n = 480,
            o = 250,
            p = 0,
            q = 0,
            r = 0,
            t = 0,
            u = 0,
            v = Gh,
            w = s,
            x = null,
            y = null;
        return b.stream = function(a) {
                return k && (k.valid = !1), k = gc(v(g, l(w(a)))), k.valid = !0, k
            }, b.clipAngle = function(a) {
                return arguments.length ? (v = null == a ? (x = a, Gh) : Ob((x = +a) * Jg), e()) : x
            }, b.clipExtent = function(a) {
                return arguments.length ? (y = a, w = a ? Qb(a[0][0], a[0][1], a[1][0], a[1][1]) : s, e()) : y
            }, b.scale = function(a) {
                return arguments.length ? (m = +a, d()) : m
            }, b.translate = function(a) {
                return arguments.length ? (n = +a[0], o = +a[1], d()) : [n, o]
            }, b.center = function(a) {
                return arguments.length ? (p = a[0] % 360 * Jg, q = a[1] % 360 * Jg, d()) : [p * Kg, q * Kg]
            }, b.rotate = function(a) {
                return arguments.length ? (r = a[0] % 360 * Jg, t = a[1] % 360 * Jg, u = a.length > 2 ? a[2] % 360 * Jg : 0, d()) : [r * Kg, t * Kg, u * Kg]
            }, bg.rebind(b, l, "precision"),
            function() {
                return f = a.apply(this, arguments), b.invert = f.invert && c, d()
            }
    }

    function gc(a) {
        return dc(a, function(b, c) {
            a.point(b * Jg, c * Jg)
        })
    }

    function hc(a, b) {
        return [a, b]
    }

    function ic(a, b) {
        return [a > Fg ? a - Gg : -Fg > a ? a + Gg : a, b]
    }

    function jc(a, b, c) {
        return a ? b || c ? Bb(lc(a), mc(b, c)) : lc(a) : b || c ? mc(b, c) : ic
    }

    function kc(a) {
        return function(b, c) {
            return b += a, [b > Fg ? b - Gg : -Fg > b ? b + Gg : b, c]
        }
    }

    function lc(a) {
        var b = kc(a);
        return b.invert = kc(-a), b
    }

    function mc(a, b) {
        function c(a, b) {
            var c = Math.cos(b),
                h = Math.cos(a) * c,
                i = Math.sin(a) * c,
                j = Math.sin(b),
                k = j * d + h * e;
            return [Math.atan2(i * f - k * g, h * d - j * e), ba(k * f + i * g)]
        }
        var d = Math.cos(a),
            e = Math.sin(a),
            f = Math.cos(b),
            g = Math.sin(b);
        return c.invert = function(a, b) {
            var c = Math.cos(b),
                h = Math.cos(a) * c,
                i = Math.sin(a) * c,
                j = Math.sin(b),
                k = j * f - i * g;
            return [Math.atan2(i * f + j * g, h * d + k * e), ba(k * d - h * e)]
        }, c
    }

    function nc(a, b) {
        var c = Math.cos(a),
            d = Math.sin(a);
        return function(e, f, g, h) {
            var i = g * b;
            null != e ? (e = oc(c, e), f = oc(c, f), (g > 0 ? f > e : e > f) && (e += g * Gg)) : (e = a + g * Gg, f = a - .5 * i);
            for (var j, k = e; g > 0 ? k > f : f > k; k -= i) h.point((j = ub([c, -d * Math.cos(k), -d * Math.sin(k)]))[0], j[1])
        }
    }

    function oc(a, b) {
        var c = ob(b);
        c[0] -= a, tb(c);
        var d = aa(-c[1]);
        return ((-c[2] < 0 ? -d : d) + 2 * Math.PI - Dg) % (2 * Math.PI)
    }

    function pc(a, b, c) {
        var d = bg.range(a, b - Dg, c).concat(b);
        return function(a) {
            return d.map(function(b) {
                return [a, b]
            })
        }
    }

    function qc(a, b, c) {
        var d = bg.range(a, b - Dg, c).concat(b);
        return function(a) {
            return d.map(function(b) {
                return [b, a]
            })
        }
    }

    function rc(a) {
        return a.source
    }

    function sc(a) {
        return a.target
    }

    function tc(a, b, c, d) {
        var e = Math.cos(b),
            f = Math.sin(b),
            g = Math.cos(d),
            h = Math.sin(d),
            i = e * Math.cos(a),
            j = e * Math.sin(a),
            k = g * Math.cos(c),
            l = g * Math.sin(c),
            m = 2 * Math.asin(Math.sqrt(fa(d - b) + e * g * fa(c - a))),
            n = 1 / Math.sin(m),
            o = m ? function(a) {
                var b = Math.sin(a *= m) * n,
                    c = Math.sin(m - a) * n,
                    d = c * i + b * k,
                    e = c * j + b * l,
                    g = c * f + b * h;
                return [Math.atan2(e, d) * Kg, Math.atan2(g, Math.sqrt(d * d + e * e)) * Kg]
            } : function() {
                return [a * Kg, b * Kg]
            };
        return o.distance = m, o
    }

    function uc() {
        function a(a, e) {
            var f = Math.sin(e *= Jg),
                g = Math.cos(e),
                h = ng((a *= Jg) - b),
                i = Math.cos(h);
            Rh += Math.atan2(Math.sqrt((h = g * Math.sin(h)) * h + (h = d * f - c * g * i) * h), c * f + d * g * i), b = a, c = f, d = g
        }
        var b, c, d;
        Sh.point = function(e, f) {
            b = e * Jg, c = Math.sin(f *= Jg), d = Math.cos(f), Sh.point = a
        }, Sh.lineEnd = function() {
            Sh.point = Sh.lineEnd = v
        }
    }

    function vc(a, b) {
        function c(b, c) {
            var d = Math.cos(b),
                e = Math.cos(c),
                f = a(d * e);
            return [f * e * Math.sin(b), f * Math.sin(c)]
        }
        return c.invert = function(a, c) {
            var d = Math.sqrt(a * a + c * c),
                e = b(d),
                f = Math.sin(e),
                g = Math.cos(e);
            return [Math.atan2(a * f, d * g), Math.asin(d && c * f / d)]
        }, c
    }

    function wc(a, b) {
        function c(a, b) {
            g > 0 ? -Ig + Dg > b && (b = -Ig + Dg) : b > Ig - Dg && (b = Ig - Dg);
            var c = g / Math.pow(e(b), f);
            return [c * Math.sin(f * a), g - c * Math.cos(f * a)]
        }
        var d = Math.cos(a),
            e = function(a) {
                return Math.tan(Fg / 4 + a / 2)
            },
            f = a === b ? Math.sin(a) : Math.log(d / Math.cos(b)) / Math.log(e(b) / e(a)),
            g = d * Math.pow(e(a), f) / f;
        return f ? (c.invert = function(a, b) {
            var c = g - b,
                d = $(f) * Math.sqrt(a * a + c * c);
            return [Math.atan2(a, c) / f, 2 * Math.atan(Math.pow(g / d, 1 / f)) - Ig]
        }, c) : yc
    }

    function xc(a, b) {
        function c(a, b) {
            var c = f - b;
            return [c * Math.sin(e * a), f - c * Math.cos(e * a)]
        }
        var d = Math.cos(a),
            e = a === b ? Math.sin(a) : (d - Math.cos(b)) / (b - a),
            f = d / e + a;
        return ng(e) < Dg ? hc : (c.invert = function(a, b) {
            var c = f - b;
            return [Math.atan2(a, c) / e, f - $(e) * Math.sqrt(a * a + c * c)]
        }, c)
    }

    function yc(a, b) {
        return [a, Math.log(Math.tan(Fg / 4 + b / 2))]
    }

    function zc(a) {
        var b, c = ec(a),
            d = c.scale,
            e = c.translate,
            f = c.clipExtent;
        return c.scale = function() {
            var a = d.apply(c, arguments);
            return a === c ? b ? c.clipExtent(null) : c : a
        }, c.translate = function() {
            var a = e.apply(c, arguments);
            return a === c ? b ? c.clipExtent(null) : c : a
        }, c.clipExtent = function(a) {
            var g = f.apply(c, arguments);
            if (g === c) {
                if (b = null == a) {
                    var h = Fg * d(),
                        i = e();
                    f([
                        [i[0] - h, i[1] - h],
                        [i[0] + h, i[1] + h]
                    ])
                }
            } else b && (g = null);
            return g
        }, c.clipExtent(null)
    }

    function Ac(a, b) {
        return [Math.log(Math.tan(Fg / 4 + b / 2)), -a]
    }

    function Bc(a) {
        return a[0]
    }

    function Cc(a) {
        return a[1]
    }

    function Dc(a) {
        for (var b = a.length, c = [0, 1], d = 2, e = 2; b > e; e++) {
            for (; d > 1 && _(a[c[d - 2]], a[c[d - 1]], a[e]) <= 0;) --d;
            c[d++] = e
        }
        return c.slice(0, d)
    }

    function Ec(a, b) {
        return a[0] - b[0] || a[1] - b[1]
    }

    function Fc(a, b, c) {
        return (c[0] - b[0]) * (a[1] - b[1]) < (c[1] - b[1]) * (a[0] - b[0])
    }

    function Gc(a, b, c, d) {
        var e = a[0],
            f = c[0],
            g = b[0] - e,
            h = d[0] - f,
            i = a[1],
            j = c[1],
            k = b[1] - i,
            l = d[1] - j,
            m = (h * (i - j) - l * (e - f)) / (l * g - h * k);
        return [e + m * g, i + m * k]
    }

    function Hc(a) {
        var b = a[0],
            c = a[a.length - 1];
        return !(b[0] - c[0] || b[1] - c[1])
    }

    function Ic() {
        bd(this), this.edge = this.site = this.circle = null
    }

    function Jc(a) {
        var b = ci.pop() || new Ic;
        return b.site = a, b
    }

    function Kc(a) {
        Uc(a), _h.remove(a), ci.push(a), bd(a)
    }

    function Lc(a) {
        var b = a.circle,
            c = b.x,
            d = b.cy,
            e = {
                x: c,
                y: d
            },
            f = a.P,
            g = a.N,
            h = [a];
        Kc(a);
        for (var i = f; i.circle && ng(c - i.circle.x) < Dg && ng(d - i.circle.cy) < Dg;) f = i.P, h.unshift(i), Kc(i), i = f;
        h.unshift(i), Uc(i);
        for (var j = g; j.circle && ng(c - j.circle.x) < Dg && ng(d - j.circle.cy) < Dg;) g = j.N, h.push(j), Kc(j), j = g;
        h.push(j), Uc(j);
        var k, l = h.length;
        for (k = 1; l > k; ++k) j = h[k], i = h[k - 1], $c(j.edge, i.site, j.site, e);
        i = h[0], j = h[l - 1], j.edge = Yc(i.site, j.site, null, e), Tc(i), Tc(j)
    }

    function Mc(a) {
        for (var b, c, d, e, f = a.x, g = a.y, h = _h._; h;)
            if (d = Nc(h, g) - f, d > Dg) h = h.L;
            else {
                if (e = f - Oc(h, g), !(e > Dg)) {
                    d > -Dg ? (b = h.P, c = h) : e > -Dg ? (b = h, c = h.N) : b = c = h;
                    break
                }
                if (!h.R) {
                    b = h;
                    break
                }
                h = h.R
            }
        var i = Jc(a);
        if (_h.insert(b, i), b || c) {
            if (b === c) return Uc(b), c = Jc(b.site), _h.insert(i, c), i.edge = c.edge = Yc(b.site, i.site), Tc(b), void Tc(c);
            if (!c) return void(i.edge = Yc(b.site, i.site));
            Uc(b), Uc(c);
            var j = b.site,
                k = j.x,
                l = j.y,
                m = a.x - k,
                n = a.y - l,
                o = c.site,
                p = o.x - k,
                q = o.y - l,
                r = 2 * (m * q - n * p),
                s = m * m + n * n,
                t = p * p + q * q,
                u = {
                    x: (q * s - n * t) / r + k,
                    y: (m * t - p * s) / r + l
                };
            $c(c.edge, j, o, u), i.edge = Yc(j, a, null, u), c.edge = Yc(a, o, null, u), Tc(b), Tc(c)
        }
    }

    function Nc(a, b) {
        var c = a.site,
            d = c.x,
            e = c.y,
            f = e - b;
        if (!f) return d;
        var g = a.P;
        if (!g) return -(1 / 0);
        c = g.site;
        var h = c.x,
            i = c.y,
            j = i - b;
        if (!j) return h;
        var k = h - d,
            l = 1 / f - 1 / j,
            m = k / j;
        return l ? (-m + Math.sqrt(m * m - 2 * l * (k * k / (-2 * j) - i + j / 2 + e - f / 2))) / l + d : (d + h) / 2
    }

    function Oc(a, b) {
        var c = a.N;
        if (c) return Nc(c, b);
        var d = a.site;
        return d.y === b ? d.x : 1 / 0
    }

    function Pc(a) {
        this.site = a, this.edges = []
    }

    function Qc(a) {
        for (var b, c, d, e, f, g, h, i, j, k, l = a[0][0], m = a[1][0], n = a[0][1], o = a[1][1], p = $h, q = p.length; q--;)
            if (f = p[q], f && f.prepare())
                for (h = f.edges, i = h.length, g = 0; i > g;) k = h[g].end(), d = k.x, e = k.y, j = h[++g % i].start(), b = j.x, c = j.y, (ng(d - b) > Dg || ng(e - c) > Dg) && (h.splice(g, 0, new _c(Zc(f.site, k, ng(d - l) < Dg && o - e > Dg ? {
                    x: l,
                    y: ng(b - l) < Dg ? c : o
                } : ng(e - o) < Dg && m - d > Dg ? {
                    x: ng(c - o) < Dg ? b : m,
                    y: o
                } : ng(d - m) < Dg && e - n > Dg ? {
                    x: m,
                    y: ng(b - m) < Dg ? c : n
                } : ng(e - n) < Dg && d - l > Dg ? {
                    x: ng(c - n) < Dg ? b : l,
                    y: n
                } : null), f.site, null)), ++i)
    }

    function Rc(a, b) {
        return b.angle - a.angle
    }

    function Sc() {
        bd(this), this.x = this.y = this.arc = this.site = this.cy = null
    }

    function Tc(a) {
        var b = a.P,
            c = a.N;
        if (b && c) {
            var d = b.site,
                e = a.site,
                f = c.site;
            if (d !== f) {
                var g = e.x,
                    h = e.y,
                    i = d.x - g,
                    j = d.y - h,
                    k = f.x - g,
                    l = f.y - h,
                    m = 2 * (i * l - j * k);
                if (!(m >= -Eg)) {
                    var n = i * i + j * j,
                        o = k * k + l * l,
                        p = (l * n - j * o) / m,
                        q = (i * o - k * n) / m,
                        l = q + h,
                        r = di.pop() || new Sc;
                    r.arc = a, r.site = e, r.x = p + g, r.y = l + Math.sqrt(p * p + q * q), r.cy = l, a.circle = r;
                    for (var s = null, t = bi._; t;)
                        if (r.y < t.y || r.y === t.y && r.x <= t.x) {
                            if (!t.L) {
                                s = t.P;
                                break
                            }
                            t = t.L
                        } else {
                            if (!t.R) {
                                s = t;
                                break
                            }
                            t = t.R
                        }
                    bi.insert(s, r), s || (ai = r)
                }
            }
        }
    }

    function Uc(a) {
        var b = a.circle;
        b && (b.P || (ai = b.N), bi.remove(b), di.push(b), bd(b), a.circle = null)
    }

    function Vc(a) {
        for (var b, c = Zh, d = Pb(a[0][0], a[0][1], a[1][0], a[1][1]), e = c.length; e--;) b = c[e], (!Wc(b, a) || !d(b) || ng(b.a.x - b.b.x) < Dg && ng(b.a.y - b.b.y) < Dg) && (b.a = b.b = null, c.splice(e, 1))
    }

    function Wc(a, b) {
        var c = a.b;
        if (c) return !0;
        var d, e, f = a.a,
            g = b[0][0],
            h = b[1][0],
            i = b[0][1],
            j = b[1][1],
            k = a.l,
            l = a.r,
            m = k.x,
            n = k.y,
            o = l.x,
            p = l.y,
            q = (m + o) / 2,
            r = (n + p) / 2;
        if (p === n) {
            if (g > q || q >= h) return;
            if (m > o) {
                if (f) {
                    if (f.y >= j) return
                } else f = {
                    x: q,
                    y: i
                };
                c = {
                    x: q,
                    y: j
                }
            } else {
                if (f) {
                    if (f.y < i) return
                } else f = {
                    x: q,
                    y: j
                };
                c = {
                    x: q,
                    y: i
                }
            }
        } else if (d = (m - o) / (p - n), e = r - d * q, -1 > d || d > 1)
            if (m > o) {
                if (f) {
                    if (f.y >= j) return
                } else f = {
                    x: (i - e) / d,
                    y: i
                };
                c = {
                    x: (j - e) / d,
                    y: j
                }
            } else {
                if (f) {
                    if (f.y < i) return
                } else f = {
                    x: (j - e) / d,
                    y: j
                };
                c = {
                    x: (i - e) / d,
                    y: i
                }
            } else if (p > n) {
            if (f) {
                if (f.x >= h) return
            } else f = {
                x: g,
                y: d * g + e
            };
            c = {
                x: h,
                y: d * h + e
            }
        } else {
            if (f) {
                if (f.x < g) return
            } else f = {
                x: h,
                y: d * h + e
            };
            c = {
                x: g,
                y: d * g + e
            }
        }
        return a.a = f, a.b = c, !0
    }

    function Xc(a, b) {
        this.l = a, this.r = b, this.a = this.b = null
    }

    function Yc(a, b, c, d) {
        var e = new Xc(a, b);
        return Zh.push(e), c && $c(e, a, b, c), d && $c(e, b, a, d), $h[a.i].edges.push(new _c(e, a, b)), $h[b.i].edges.push(new _c(e, b, a)), e
    }

    function Zc(a, b, c) {
        var d = new Xc(a, null);
        return d.a = b, d.b = c, Zh.push(d), d
    }

    function $c(a, b, c, d) {
        a.a || a.b ? a.l === c ? a.b = d : a.a = d : (a.a = d, a.l = b, a.r = c)
    }

    function _c(a, b, c) {
        var d = a.a,
            e = a.b;
        this.edge = a, this.site = b, this.angle = c ? Math.atan2(c.y - b.y, c.x - b.x) : a.l === b ? Math.atan2(e.x - d.x, d.y - e.y) : Math.atan2(d.x - e.x, e.y - d.y)
    }

    function ad() {
        this._ = null
    }

    function bd(a) {
        a.U = a.C = a.L = a.R = a.P = a.N = null
    }

    function cd(a, b) {
        var c = b,
            d = b.R,
            e = c.U;
        e ? e.L === c ? e.L = d : e.R = d : a._ = d, d.U = e, c.U = d, c.R = d.L, c.R && (c.R.U = c), d.L = c
    }

    function dd(a, b) {
        var c = b,
            d = b.L,
            e = c.U;
        e ? e.L === c ? e.L = d : e.R = d : a._ = d, d.U = e, c.U = d, c.L = d.R, c.L && (c.L.U = c), d.R = c
    }

    function ed(a) {
        for (; a.L;) a = a.L;
        return a
    }

    function fd(a, b) {
        var c, d, e, f = a.sort(gd).pop();
        for (Zh = [], $h = new Array(a.length), _h = new ad, bi = new ad;;)
            if (e = ai, f && (!e || f.y < e.y || f.y === e.y && f.x < e.x))(f.x !== c || f.y !== d) && ($h[f.i] = new Pc(f), Mc(f), c = f.x, d = f.y), f = a.pop();
            else {
                if (!e) break;
                Lc(e.arc)
            }
        b && (Vc(b), Qc(b));
        var g = {
            cells: $h,
            edges: Zh
        };
        return _h = bi = Zh = $h = null, g
    }

    function gd(a, b) {
        return b.y - a.y || b.x - a.x
    }

    function hd(a, b, c) {
        return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y)
    }

    function id(a) {
        return a.x
    }

    function jd(a) {
        return a.y
    }

    function kd() {
        return {
            leaf: !0,
            nodes: [],
            point: null,
            x: null,
            y: null
        }
    }

    function ld(a, b, c, d, e, f) {
        if (!a(b, c, d, e, f)) {
            var g = .5 * (c + e),
                h = .5 * (d + f),
                i = b.nodes;
            i[0] && ld(a, i[0], c, d, g, h), i[1] && ld(a, i[1], g, d, e, h), i[2] && ld(a, i[2], c, h, g, f), i[3] && ld(a, i[3], g, h, e, f)
        }
    }

    function md(a, b, c, d, e, f, g) {
        var h, i = 1 / 0;
        return function j(a, k, l, m, n) {
            if (!(k > f || l > g || d > m || e > n)) {
                if (o = a.point) {
                    var o, p = b - a.x,
                        q = c - a.y,
                        r = p * p + q * q;
                    if (i > r) {
                        var s = Math.sqrt(i = r);
                        d = b - s, e = c - s, f = b + s, g = c + s, h = o
                    }
                }
                for (var t = a.nodes, u = .5 * (k + m), v = .5 * (l + n), w = b >= u, x = c >= v, y = x << 1 | w, z = y + 4; z > y; ++y)
                    if (a = t[3 & y]) switch (3 & y) {
                        case 0:
                            j(a, k, l, u, v);
                            break;
                        case 1:
                            j(a, u, l, m, v);
                            break;
                        case 2:
                            j(a, k, v, u, n);
                            break;
                        case 3:
                            j(a, u, v, m, n)
                    }
            }
        }(a, d, e, f, g), h
    }

    function nd(a, b) {
        a = bg.rgb(a), b = bg.rgb(b);
        var c = a.r,
            d = a.g,
            e = a.b,
            f = b.r - c,
            g = b.g - d,
            h = b.b - e;
        return function(a) {
            return "#" + ua(Math.round(c + f * a)) + ua(Math.round(d + g * a)) + ua(Math.round(e + h * a))
        }
    }

    function od(a, b) {
        var c, d = {},
            e = {};
        for (c in a) c in b ? d[c] = rd(a[c], b[c]) : e[c] = a[c];
        for (c in b) c in a || (e[c] = b[c]);
        return function(a) {
            for (c in d) e[c] = d[c](a);
            return e
        }
    }

    function pd(a, b) {
        return a = +a, b = +b,
            function(c) {
                return a * (1 - c) + b * c
            }
    }

    function qd(a, b) {
        var c, d, e, f = fi.lastIndex = gi.lastIndex = 0,
            g = -1,
            h = [],
            i = [];
        for (a += "", b += "";
            (c = fi.exec(a)) && (d = gi.exec(b));)(e = d.index) > f && (e = b.slice(f, e), h[g] ? h[g] += e : h[++g] = e), (c = c[0]) === (d = d[0]) ? h[g] ? h[g] += d : h[++g] = d : (h[++g] = null, i.push({
            i: g,
            x: pd(c, d)
        })), f = gi.lastIndex;
        return f < b.length && (e = b.slice(f), h[g] ? h[g] += e : h[++g] = e), h.length < 2 ? i[0] ? (b = i[0].x, function(a) {
            return b(a) + ""
        }) : function() {
            return b
        } : (b = i.length, function(a) {
            for (var c, d = 0; b > d; ++d) h[(c = i[d]).i] = c.x(a);
            return h.join("")
        })
    }

    function rd(a, b) {
        for (var c, d = bg.interpolators.length; --d >= 0 && !(c = bg.interpolators[d](a, b)););
        return c
    }

    function sd(a, b) {
        var c, d = [],
            e = [],
            f = a.length,
            g = b.length,
            h = Math.min(a.length, b.length);
        for (c = 0; h > c; ++c) d.push(rd(a[c], b[c]));
        for (; f > c; ++c) e[c] = a[c];
        for (; g > c; ++c) e[c] = b[c];
        return function(a) {
            for (c = 0; h > c; ++c) e[c] = d[c](a);
            return e
        }
    }

    function td(a) {
        return function(b) {
            return 0 >= b ? 0 : b >= 1 ? 1 : a(b)
        }
    }

    function ud(a) {
        return function(b) {
            return 1 - a(1 - b)
        }
    }

    function vd(a) {
        return function(b) {
            return .5 * (.5 > b ? a(2 * b) : 2 - a(2 - 2 * b))
        }
    }

    function wd(a) {
        return a * a
    }

    function xd(a) {
        return a * a * a
    }

    function yd(a) {
        if (0 >= a) return 0;
        if (a >= 1) return 1;
        var b = a * a,
            c = b * a;
        return 4 * (.5 > a ? c : 3 * (a - b) + c - .75)
    }

    function zd(a) {
        return function(b) {
            return Math.pow(b, a)
        }
    }

    function Ad(a) {
        return 1 - Math.cos(a * Ig)
    }

    function Bd(a) {
        return Math.pow(2, 10 * (a - 1))
    }

    function Cd(a) {
        return 1 - Math.sqrt(1 - a * a)
    }

    function Dd(a, b) {
        var c;
        return arguments.length < 2 && (b = .45), arguments.length ? c = b / Gg * Math.asin(1 / a) : (a = 1, c = b / 4),
            function(d) {
                return 1 + a * Math.pow(2, -10 * d) * Math.sin((d - c) * Gg / b)
            }
    }

    function Ed(a) {
        return a || (a = 1.70158),
            function(b) {
                return b * b * ((a + 1) * b - a)
            }
    }

    function Fd(a) {
        return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
    }

    function Gd(a, b) {
        a = bg.hcl(a), b = bg.hcl(b);
        var c = a.h,
            d = a.c,
            e = a.l,
            f = b.h - c,
            g = b.c - d,
            h = b.l - e;
        return isNaN(g) && (g = 0, d = isNaN(d) ? b.c : d), isNaN(f) ? (f = 0, c = isNaN(c) ? b.h : c) : f > 180 ? f -= 360 : -180 > f && (f += 360),
            function(a) {
                return ka(c + f * a, d + g * a, e + h * a) + ""
            }
    }

    function Hd(a, b) {
        a = bg.hsl(a), b = bg.hsl(b);
        var c = a.h,
            d = a.s,
            e = a.l,
            f = b.h - c,
            g = b.s - d,
            h = b.l - e;
        return isNaN(g) && (g = 0, d = isNaN(d) ? b.s : d), isNaN(f) ? (f = 0, c = isNaN(c) ? b.h : c) : f > 180 ? f -= 360 : -180 > f && (f += 360),
            function(a) {
                return ia(c + f * a, d + g * a, e + h * a) + ""
            }
    }

    function Id(a, b) {
        a = bg.lab(a), b = bg.lab(b);
        var c = a.l,
            d = a.a,
            e = a.b,
            f = b.l - c,
            g = b.a - d,
            h = b.b - e;
        return function(a) {
            return ma(c + f * a, d + g * a, e + h * a) + ""
        }
    }

    function Jd(a, b) {
        return b -= a,
            function(c) {
                return Math.round(a + b * c)
            }
    }

    function Kd(a) {
        var b = [a.a, a.b],
            c = [a.c, a.d],
            d = Md(b),
            e = Ld(b, c),
            f = Md(Nd(c, b, -e)) || 0;
        b[0] * c[1] < c[0] * b[1] && (b[0] *= -1, b[1] *= -1, d *= -1, e *= -1), this.rotate = (d ? Math.atan2(b[1], b[0]) : Math.atan2(-c[0], c[1])) * Kg, this.translate = [a.e, a.f], this.scale = [d, f], this.skew = f ? Math.atan2(e, f) * Kg : 0
    }

    function Ld(a, b) {
        return a[0] * b[0] + a[1] * b[1]
    }

    function Md(a) {
        var b = Math.sqrt(Ld(a, a));
        return b && (a[0] /= b, a[1] /= b), b
    }

    function Nd(a, b, c) {
        return a[0] += c * b[0], a[1] += c * b[1], a
    }

    function Od(a, b) {
        var c, d = [],
            e = [],
            f = bg.transform(a),
            g = bg.transform(b),
            h = f.translate,
            i = g.translate,
            j = f.rotate,
            k = g.rotate,
            l = f.skew,
            m = g.skew,
            n = f.scale,
            o = g.scale;
        return h[0] != i[0] || h[1] != i[1] ? (d.push("translate(", null, ",", null, ")"), e.push({
                i: 1,
                x: pd(h[0], i[0])
            }, {
                i: 3,
                x: pd(h[1], i[1])
            })) : d.push(i[0] || i[1] ? "translate(" + i + ")" : ""), j != k ? (j - k > 180 ? k += 360 : k - j > 180 && (j += 360), e.push({
                i: d.push(d.pop() + "rotate(", null, ")") - 2,
                x: pd(j, k)
            })) : k && d.push(d.pop() + "rotate(" + k + ")"), l != m ? e.push({
                i: d.push(d.pop() + "skewX(", null, ")") - 2,
                x: pd(l, m)
            }) : m && d.push(d.pop() + "skewX(" + m + ")"), n[0] != o[0] || n[1] != o[1] ? (c = d.push(d.pop() + "scale(", null, ",", null, ")"), e.push({
                i: c - 4,
                x: pd(n[0], o[0])
            }, {
                i: c - 2,
                x: pd(n[1], o[1])
            })) : (1 != o[0] || 1 != o[1]) && d.push(d.pop() + "scale(" + o + ")"), c = e.length,
            function(a) {
                for (var b, f = -1; ++f < c;) d[(b = e[f]).i] = b.x(a);
                return d.join("")
            }
    }

    function Pd(a, b) {
        return b = (b -= a = +a) || 1 / b,
            function(c) {
                return (c - a) / b
            }
    }

    function Qd(a, b) {
        return b = (b -= a = +a) || 1 / b,
            function(c) {
                return Math.max(0, Math.min(1, (c - a) / b))
            }
    }

    function Rd(a) {
        for (var b = a.source, c = a.target, d = Td(b, c), e = [b]; b !== d;) b = b.parent, e.push(b);
        for (var f = e.length; c !== d;) e.splice(f, 0, c), c = c.parent;
        return e
    }

    function Sd(a) {
        for (var b = [], c = a.parent; null != c;) b.push(a), a = c, c = c.parent;
        return b.push(a), b
    }

    function Td(a, b) {
        if (a === b) return a;
        for (var c = Sd(a), d = Sd(b), e = c.pop(), f = d.pop(), g = null; e === f;) g = e, e = c.pop(), f = d.pop();
        return g
    }

    function Ud(a) {
        a.fixed |= 2
    }

    function Vd(a) {
        a.fixed &= -7
    }

    function Wd(a) {
        a.fixed |= 4, a.px = a.x, a.py = a.y
    }

    function Xd(a) {
        a.fixed &= -5
    }

    function Yd(a, b, c) {
        var d = 0,
            e = 0;
        if (a.charge = 0, !a.leaf)
            for (var f, g = a.nodes, h = g.length, i = -1; ++i < h;) f = g[i], null != f && (Yd(f, b, c), a.charge += f.charge, d += f.charge * f.cx, e += f.charge * f.cy);
        if (a.point) {
            a.leaf || (a.point.x += Math.random() - .5, a.point.y += Math.random() - .5);
            var j = b * c[a.point.index];
            a.charge += a.pointCharge = j, d += j * a.point.x, e += j * a.point.y
        }
        a.cx = d / a.charge, a.cy = e / a.charge
    }

    function Zd(a, b) {
        return bg.rebind(a, b, "sort", "children", "value"), a.nodes = a, a.links = de, a
    }

    function $d(a, b) {
        for (var c = [a]; null != (a = c.pop());)
            if (b(a), (e = a.children) && (d = e.length))
                for (var d, e; --d >= 0;) c.push(e[d])
    }

    function _d(a, b) {
        for (var c = [a], d = []; null != (a = c.pop());)
            if (d.push(a), (f = a.children) && (e = f.length))
                for (var e, f, g = -1; ++g < e;) c.push(f[g]);
        for (; null != (a = d.pop());) b(a)
    }

    function ae(a) {
        return a.children
    }

    function be(a) {
        return a.value
    }

    function ce(a, b) {
        return b.value - a.value
    }

    function de(a) {
        return bg.merge(a.map(function(a) {
            return (a.children || []).map(function(b) {
                return {
                    source: a,
                    target: b
                }
            })
        }))
    }

    function ee(a) {
        return a.x
    }

    function fe(a) {
        return a.y
    }

    function ge(a, b, c) {
        a.y0 = b, a.y = c
    }

    function he(a) {
        return bg.range(a.length)
    }

    function ie(a) {
        for (var b = -1, c = a[0].length, d = []; ++b < c;) d[b] = 0;
        return d
    }

    function je(a) {
        for (var b, c = 1, d = 0, e = a[0][1], f = a.length; f > c; ++c)(b = a[c][1]) > e && (d = c, e = b);
        return d
    }

    function ke(a) {
        return a.reduce(le, 0)
    }

    function le(a, b) {
        return a + b[1]
    }

    function me(a, b) {
        return ne(a, Math.ceil(Math.log(b.length) / Math.LN2 + 1))
    }

    function ne(a, b) {
        for (var c = -1, d = +a[0], e = (a[1] - d) / b, f = []; ++c <= b;) f[c] = e * c + d;
        return f
    }

    function oe(a) {
        return [bg.min(a), bg.max(a)]
    }

    function pe(a, b) {
        return a.value - b.value
    }

    function qe(a, b) {
        var c = a._pack_next;
        a._pack_next = b, b._pack_prev = a, b._pack_next = c, c._pack_prev = b
    }

    function re(a, b) {
        a._pack_next = b, b._pack_prev = a
    }

    function se(a, b) {
        var c = b.x - a.x,
            d = b.y - a.y,
            e = a.r + b.r;
        return .999 * e * e > c * c + d * d
    }

    function te(a) {
        function b(a) {
            k = Math.min(a.x - a.r, k), l = Math.max(a.x + a.r, l), m = Math.min(a.y - a.r, m), n = Math.max(a.y + a.r, n)
        }
        if ((c = a.children) && (j = c.length)) {
            var c, d, e, f, g, h, i, j, k = 1 / 0,
                l = -(1 / 0),
                m = 1 / 0,
                n = -(1 / 0);
            if (c.forEach(ue), d = c[0], d.x = -d.r, d.y = 0, b(d), j > 1 && (e = c[1], e.x = e.r, e.y = 0, b(e), j > 2))
                for (f = c[2], xe(d, e, f), b(f), qe(d, f), d._pack_prev = f, qe(f, e), e = d._pack_next, g = 3; j > g; g++) {
                    xe(d, e, f = c[g]);
                    var o = 0,
                        p = 1,
                        q = 1;
                    for (h = e._pack_next; h !== e; h = h._pack_next, p++)
                        if (se(h, f)) {
                            o = 1;
                            break
                        }
                    if (1 == o)
                        for (i = d._pack_prev; i !== h._pack_prev && !se(i, f); i = i._pack_prev, q++);
                    o ? (q > p || p == q && e.r < d.r ? re(d, e = h) : re(d = i, e), g--) : (qe(d, f), e = f, b(f))
                }
            var r = (k + l) / 2,
                s = (m + n) / 2,
                t = 0;
            for (g = 0; j > g; g++) f = c[g], f.x -= r, f.y -= s, t = Math.max(t, f.r + Math.sqrt(f.x * f.x + f.y * f.y));
            a.r = t, c.forEach(ve)
        }
    }

    function ue(a) {
        a._pack_next = a._pack_prev = a
    }

    function ve(a) {
        delete a._pack_next, delete a._pack_prev
    }

    function we(a, b, c, d) {
        var e = a.children;
        if (a.x = b += d * a.x, a.y = c += d * a.y, a.r *= d, e)
            for (var f = -1, g = e.length; ++f < g;) we(e[f], b, c, d)
    }

    function xe(a, b, c) {
        var d = a.r + c.r,
            e = b.x - a.x,
            f = b.y - a.y;
        if (d && (e || f)) {
            var g = b.r + c.r,
                h = e * e + f * f;
            g *= g, d *= d;
            var i = .5 + (d - g) / (2 * h),
                j = Math.sqrt(Math.max(0, 2 * g * (d + h) - (d -= h) * d - g * g)) / (2 * h);
            c.x = a.x + i * e + j * f, c.y = a.y + i * f - j * e
        } else c.x = a.x + d, c.y = a.y
    }

    function ye(a, b) {
        return a.parent == b.parent ? 1 : 2
    }

    function ze(a) {
        var b = a.children;
        return b.length ? b[0] : a.t
    }

    function Ae(a) {
        var b, c = a.children;
        return (b = c.length) ? c[b - 1] : a.t
    }

    function Be(a, b, c) {
        var d = c / (b.i - a.i);
        b.c -= d, b.s += c, a.c += d, b.z += c, b.m += c
    }

    function Ce(a) {
        for (var b, c = 0, d = 0, e = a.children, f = e.length; --f >= 0;) b = e[f], b.z += c, b.m += c, c += b.s + (d += b.c)
    }

    function De(a, b, c) {
        return a.a.parent === b.parent ? a.a : c
    }

    function Ee(a) {
        return 1 + bg.max(a, function(a) {
            return a.y
        })
    }

    function Fe(a) {
        return a.reduce(function(a, b) {
            return a + b.x
        }, 0) / a.length
    }

    function Ge(a) {
        var b = a.children;
        return b && b.length ? Ge(b[0]) : a
    }

    function He(a) {
        var b, c = a.children;
        return c && (b = c.length) ? He(c[b - 1]) : a
    }

    function Ie(a) {
        return {
            x: a.x,
            y: a.y,
            dx: a.dx,
            dy: a.dy
        }
    }

    function Je(a, b) {
        var c = a.x + b[3],
            d = a.y + b[0],
            e = a.dx - b[1] - b[3],
            f = a.dy - b[0] - b[2];
        return 0 > e && (c += e / 2, e = 0), 0 > f && (d += f / 2, f = 0), {
            x: c,
            y: d,
            dx: e,
            dy: f
        }
    }

    function Ke(a) {
        var b = a[0],
            c = a[a.length - 1];
        return c > b ? [b, c] : [c, b]
    }

    function Le(a) {
        return a.rangeExtent ? a.rangeExtent() : Ke(a.range())
    }

    function Me(a, b, c, d) {
        var e = c(a[0], a[1]),
            f = d(b[0], b[1]);
        return function(a) {
            return f(e(a))
        }
    }

    function Ne(a, b) {
        var c, d = 0,
            e = a.length - 1,
            f = a[d],
            g = a[e];
        return f > g && (c = d, d = e, e = c, c = f, f = g, g = c), a[d] = b.floor(f), a[e] = b.ceil(g), a
    }

    function Oe(a) {
        return a ? {
            floor: function(b) {
                return Math.floor(b / a) * a
            },
            ceil: function(b) {
                return Math.ceil(b / a) * a
            }
        } : ri
    }

    function Pe(a, b, c, d) {
        var e = [],
            f = [],
            g = 0,
            h = Math.min(a.length, b.length) - 1;
        for (a[h] < a[0] && (a = a.slice().reverse(), b = b.slice().reverse()); ++g <= h;) e.push(c(a[g - 1], a[g])), f.push(d(b[g - 1], b[g]));
        return function(b) {
            var c = bg.bisect(a, b, 1, h) - 1;
            return f[c](e[c](b))
        }
    }

    function Qe(a, b, c, d) {
        function e() {
            var e = Math.min(a.length, b.length) > 2 ? Pe : Me,
                i = d ? Qd : Pd;
            return g = e(a, b, i, c), h = e(b, a, i, rd), f
        }

        function f(a) {
            return g(a)
        }
        var g, h;
        return f.invert = function(a) {
            return h(a)
        }, f.domain = function(b) {
            return arguments.length ? (a = b.map(Number), e()) : a
        }, f.range = function(a) {
            return arguments.length ? (b = a, e()) : b
        }, f.rangeRound = function(a) {
            return f.range(a).interpolate(Jd)
        }, f.clamp = function(a) {
            return arguments.length ? (d = a, e()) : d
        }, f.interpolate = function(a) {
            return arguments.length ? (c = a, e()) : c
        }, f.ticks = function(b) {
            return Ue(a, b)
        }, f.tickFormat = function(b, c) {
            return Ve(a, b, c)
        }, f.nice = function(b) {
            return Se(a, b), e()
        }, f.copy = function() {
            return Qe(a, b, c, d)
        }, e()
    }

    function Re(a, b) {
        return bg.rebind(a, b, "range", "rangeRound", "interpolate", "clamp")
    }

    function Se(a, b) {
        return Ne(a, Oe(Te(a, b)[2]))
    }

    function Te(a, b) {
        null == b && (b = 10);
        var c = Ke(a),
            d = c[1] - c[0],
            e = Math.pow(10, Math.floor(Math.log(d / b) / Math.LN10)),
            f = b / d * e;
        return .15 >= f ? e *= 10 : .35 >= f ? e *= 5 : .75 >= f && (e *= 2), c[0] = Math.ceil(c[0] / e) * e, c[1] = Math.floor(c[1] / e) * e + .5 * e, c[2] = e, c
    }

    function Ue(a, b) {
        return bg.range.apply(bg, Te(a, b))
    }

    function Ve(a, b, c) {
        var d = Te(a, b);
        if (c) {
            var e = fh.exec(c);
            if (e.shift(), "s" === e[8]) {
                var f = bg.formatPrefix(Math.max(ng(d[0]), ng(d[1])));
                return e[7] || (e[7] = "." + We(f.scale(d[2]))), e[8] = "f", c = bg.format(e.join("")),
                    function(a) {
                        return c(f.scale(a)) + f.symbol
                    }
            }
            e[7] || (e[7] = "." + Xe(e[8], d)), c = e.join("")
        } else c = ",." + We(d[2]) + "f";
        return bg.format(c)
    }

    function We(a) {
        return -Math.floor(Math.log(a) / Math.LN10 + .01)
    }

    function Xe(a, b) {
        var c = We(b[2]);
        return a in si ? Math.abs(c - We(Math.max(ng(b[0]), ng(b[1])))) + +("e" !== a) : c - 2 * ("%" === a)
    }

    function Ye(a, b, c, d) {
        function e(a) {
            return (c ? Math.log(0 > a ? 0 : a) : -Math.log(a > 0 ? 0 : -a)) / Math.log(b)
        }

        function f(a) {
            return c ? Math.pow(b, a) : -Math.pow(b, -a)
        }

        function g(b) {
            return a(e(b))
        }
        return g.invert = function(b) {
            return f(a.invert(b))
        }, g.domain = function(b) {
            return arguments.length ? (c = b[0] >= 0, a.domain((d = b.map(Number)).map(e)), g) : d
        }, g.base = function(c) {
            return arguments.length ? (b = +c, a.domain(d.map(e)), g) : b
        }, g.nice = function() {
            var b = Ne(d.map(e), c ? Math : ui);
            return a.domain(b), d = b.map(f), g
        }, g.ticks = function() {
            var a = Ke(d),
                g = [],
                h = a[0],
                i = a[1],
                j = Math.floor(e(h)),
                k = Math.ceil(e(i)),
                l = b % 1 ? 2 : b;
            if (isFinite(k - j)) {
                if (c) {
                    for (; k > j; j++)
                        for (var m = 1; l > m; m++) g.push(f(j) * m);
                    g.push(f(j))
                } else
                    for (g.push(f(j)); j++ < k;)
                        for (var m = l - 1; m > 0; m--) g.push(f(j) * m);
                for (j = 0; g[j] < h; j++);
                for (k = g.length; g[k - 1] > i; k--);
                g = g.slice(j, k)
            }
            return g
        }, g.tickFormat = function(a, b) {
            if (!arguments.length) return ti;
            arguments.length < 2 ? b = ti : "function" != typeof b && (b = bg.format(b));
            var d, h = Math.max(.1, a / g.ticks().length),
                i = c ? (d = 1e-12, Math.ceil) : (d = -1e-12, Math.floor);
            return function(a) {
                return a / f(i(e(a) + d)) <= h ? b(a) : ""
            }
        }, g.copy = function() {
            return Ye(a.copy(), b, c, d)
        }, Re(g, a)
    }

    function Ze(a, b, c) {
        function d(b) {
            return a(e(b))
        }
        var e = $e(b),
            f = $e(1 / b);
        return d.invert = function(b) {
            return f(a.invert(b))
        }, d.domain = function(b) {
            return arguments.length ? (a.domain((c = b.map(Number)).map(e)), d) : c
        }, d.ticks = function(a) {
            return Ue(c, a)
        }, d.tickFormat = function(a, b) {
            return Ve(c, a, b)
        }, d.nice = function(a) {
            return d.domain(Se(c, a))
        }, d.exponent = function(g) {
            return arguments.length ? (e = $e(b = g), f = $e(1 / b), a.domain(c.map(e)), d) : b
        }, d.copy = function() {
            return Ze(a.copy(), b, c)
        }, Re(d, a)
    }

    function $e(a) {
        return function(b) {
            return 0 > b ? -Math.pow(-b, a) : Math.pow(b, a)
        }
    }

    function _e(a, b) {
        function c(c) {
            return f[((e.get(c) || ("range" === b.t ? e.set(c, a.push(c)) : NaN)) - 1) % f.length]
        }

        function d(b, c) {
            return bg.range(a.length).map(function(a) {
                return b + c * a
            })
        }
        var e, f, g;
        return c.domain = function(d) {
            if (!arguments.length) return a;
            a = [], e = new j;
            for (var f, g = -1, h = d.length; ++g < h;) e.has(f = d[g]) || e.set(f, a.push(f));
            return c[b.t].apply(c, b.a)
        }, c.range = function(a) {
            return arguments.length ? (f = a, g = 0, b = {
                t: "range",
                a: arguments
            }, c) : f
        }, c.rangePoints = function(e, h) {
            arguments.length < 2 && (h = 0);
            var i = e[0],
                j = e[1],
                k = a.length < 2 ? (i = (i + j) / 2, 0) : (j - i) / (a.length - 1 + h);
            return f = d(i + k * h / 2, k), g = 0, b = {
                t: "rangePoints",
                a: arguments
            }, c
        }, c.rangeRoundPoints = function(e, h) {
            arguments.length < 2 && (h = 0);
            var i = e[0],
                j = e[1],
                k = a.length < 2 ? (i = j = Math.round((i + j) / 2), 0) : (j - i) / (a.length - 1 + h) | 0;
            return f = d(i + Math.round(k * h / 2 + (j - i - (a.length - 1 + h) * k) / 2), k), g = 0, b = {
                t: "rangeRoundPoints",
                a: arguments
            }, c
        }, c.rangeBands = function(e, h, i) {
            arguments.length < 2 && (h = 0), arguments.length < 3 && (i = h);
            var j = e[1] < e[0],
                k = e[j - 0],
                l = e[1 - j],
                m = (l - k) / (a.length - h + 2 * i);
            return f = d(k + m * i, m), j && f.reverse(), g = m * (1 - h), b = {
                t: "rangeBands",
                a: arguments
            }, c
        }, c.rangeRoundBands = function(e, h, i) {
            arguments.length < 2 && (h = 0), arguments.length < 3 && (i = h);
            var j = e[1] < e[0],
                k = e[j - 0],
                l = e[1 - j],
                m = Math.floor((l - k) / (a.length - h + 2 * i));
            return f = d(k + Math.round((l - k - (a.length - h) * m) / 2), m), j && f.reverse(), g = Math.round(m * (1 - h)), b = {
                t: "rangeRoundBands",
                a: arguments
            }, c
        }, c.rangeBand = function() {
            return g
        }, c.rangeExtent = function() {
            return Ke(b.a[0])
        }, c.copy = function() {
            return _e(a, b)
        }, c.domain(a)
    }

    function af(a, b) {
        function f() {
            var c = 0,
                d = b.length;
            for (h = []; ++c < d;) h[c - 1] = bg.quantile(a, c / d);
            return g
        }

        function g(a) {
            return isNaN(a = +a) ? void 0 : b[bg.bisect(h, a)]
        }
        var h;
        return g.domain = function(b) {
            return arguments.length ? (a = b.map(d).filter(e).sort(c), f()) : a
        }, g.range = function(a) {
            return arguments.length ? (b = a, f()) : b
        }, g.quantiles = function() {
            return h
        }, g.invertExtent = function(c) {
            return c = b.indexOf(c), 0 > c ? [NaN, NaN] : [c > 0 ? h[c - 1] : a[0], c < h.length ? h[c] : a[a.length - 1]]
        }, g.copy = function() {
            return af(a, b)
        }, f()
    }

    function bf(a, b, c) {
        function d(b) {
            return c[Math.max(0, Math.min(g, Math.floor(f * (b - a))))]
        }

        function e() {
            return f = c.length / (b - a), g = c.length - 1, d
        }
        var f, g;
        return d.domain = function(c) {
            return arguments.length ? (a = +c[0], b = +c[c.length - 1], e()) : [a, b]
        }, d.range = function(a) {
            return arguments.length ? (c = a, e()) : c
        }, d.invertExtent = function(b) {
            return b = c.indexOf(b), b = 0 > b ? NaN : b / f + a, [b, b + 1 / f]
        }, d.copy = function() {
            return bf(a, b, c)
        }, e()
    }

    function cf(a, b) {
        function c(c) {
            return c >= c ? b[bg.bisect(a, c)] : void 0
        }
        return c.domain = function(b) {
            return arguments.length ? (a = b, c) : a
        }, c.range = function(a) {
            return arguments.length ? (b = a, c) : b
        }, c.invertExtent = function(c) {
            return c = b.indexOf(c), [a[c - 1], a[c]]
        }, c.copy = function() {
            return cf(a, b)
        }, c
    }

    function df(a) {
        function b(a) {
            return +a
        }
        return b.invert = b, b.domain = b.range = function(c) {
            return arguments.length ? (a = c.map(b), b) : a
        }, b.ticks = function(b) {
            return Ue(a, b)
        }, b.tickFormat = function(b, c) {
            return Ve(a, b, c)
        }, b.copy = function() {
            return df(a)
        }, b
    }

    function ef() {
        return 0
    }

    function ff(a) {
        return a.innerRadius
    }

    function gf(a) {
        return a.outerRadius
    }

    function hf(a) {
        return a.startAngle
    }

    function jf(a) {
        return a.endAngle
    }

    function kf(a) {
        return a && a.padAngle
    }

    function lf(a, b, c, d) {
        return (a - c) * b - (b - d) * a > 0 ? 0 : 1
    }

    function mf(a, b, c, d, e) {
        var f = a[0] - b[0],
            g = a[1] - b[1],
            h = (e ? d : -d) / Math.sqrt(f * f + g * g),
            i = h * g,
            j = -h * f,
            k = a[0] + i,
            l = a[1] + j,
            m = b[0] + i,
            n = b[1] + j,
            o = (k + m) / 2,
            p = (l + n) / 2,
            q = m - k,
            r = n - l,
            s = q * q + r * r,
            t = c - d,
            u = k * n - m * l,
            v = (0 > r ? -1 : 1) * Math.sqrt(t * t * s - u * u),
            w = (u * r - q * v) / s,
            x = (-u * q - r * v) / s,
            y = (u * r + q * v) / s,
            z = (-u * q + r * v) / s,
            A = w - o,
            B = x - p,
            C = y - o,
            D = z - p;
        return A * A + B * B > C * C + D * D && (w = y, x = z), [
            [w - i, x - j],
            [w * c / t, x * c / t]
        ]
    }

    function nf(a) {
        function b(b) {
            function g() {
                j.push("M", f(a(k), h))
            }
            for (var i, j = [], k = [], l = -1, m = b.length, n = Aa(c), o = Aa(d); ++l < m;) e.call(this, i = b[l], l) ? k.push([+n.call(this, i, l), +o.call(this, i, l)]) : k.length && (g(), k = []);
            return k.length && g(), j.length ? j.join("") : null
        }
        var c = Bc,
            d = Cc,
            e = Cb,
            f = of,
            g = f.key,
            h = .7;
        return b.x = function(a) {
            return arguments.length ? (c = a, b) : c
        }, b.y = function(a) {
            return arguments.length ? (d = a, b) : d
        }, b.defined = function(a) {
            return arguments.length ? (e = a, b) : e
        }, b.interpolate = function(a) {
            return arguments.length ? (g = "function" == typeof a ? f = a : (f = Ai.get(a) || of).key, b) : g
        }, b.tension = function(a) {
            return arguments.length ? (h = a, b) : h
        }, b
    }

    function of(a) {
        return a.join("L")
    }

    function pf(a) {
        return of(a) + "Z"
    }

    function qf(a) {
        for (var b = 0, c = a.length, d = a[0], e = [d[0], ",", d[1]]; ++b < c;) e.push("H", (d[0] + (d = a[b])[0]) / 2, "V", d[1]);
        return c > 1 && e.push("H", d[0]), e.join("")
    }

    function rf(a) {
        for (var b = 0, c = a.length, d = a[0], e = [d[0], ",", d[1]]; ++b < c;) e.push("V", (d = a[b])[1], "H", d[0]);
        return e.join("")
    }

    function sf(a) {
        for (var b = 0, c = a.length, d = a[0], e = [d[0], ",", d[1]]; ++b < c;) e.push("H", (d = a[b])[0], "V", d[1]);
        return e.join("")
    }

    function tf(a, b) {
        return a.length < 4 ? of(a) : a[1] + wf(a.slice(1, -1), xf(a, b))
    }

    function uf(a, b) {
        return a.length < 3 ? of(a) : a[0] + wf((a.push(a[0]), a), xf([a[a.length - 2]].concat(a, [a[1]]), b))
    }

    function vf(a, b) {
        return a.length < 3 ? of(a) : a[0] + wf(a, xf(a, b))
    }

    function wf(a, b) {
        if (b.length < 1 || a.length != b.length && a.length != b.length + 2) return of(a);
        var c = a.length != b.length,
            d = "",
            e = a[0],
            f = a[1],
            g = b[0],
            h = g,
            i = 1;
        if (c && (d += "Q" + (f[0] - 2 * g[0] / 3) + "," + (f[1] - 2 * g[1] / 3) + "," + f[0] + "," + f[1], e = a[1], i = 2), b.length > 1) {
            h = b[1], f = a[i], i++, d += "C" + (e[0] + g[0]) + "," + (e[1] + g[1]) + "," + (f[0] - h[0]) + "," + (f[1] - h[1]) + "," + f[0] + "," + f[1];
            for (var j = 2; j < b.length; j++, i++) f = a[i], h = b[j], d += "S" + (f[0] - h[0]) + "," + (f[1] - h[1]) + "," + f[0] + "," + f[1]
        }
        if (c) {
            var k = a[i];
            d += "Q" + (f[0] + 2 * h[0] / 3) + "," + (f[1] + 2 * h[1] / 3) + "," + k[0] + "," + k[1]
        }
        return d
    }

    function xf(a, b) {
        for (var c, d = [], e = (1 - b) / 2, f = a[0], g = a[1], h = 1, i = a.length; ++h < i;) c = f, f = g, g = a[h], d.push([e * (g[0] - c[0]), e * (g[1] - c[1])]);
        return d
    }

    function yf(a) {
        if (a.length < 3) return of(a);
        var b = 1,
            c = a.length,
            d = a[0],
            e = d[0],
            f = d[1],
            g = [e, e, e, (d = a[1])[0]],
            h = [f, f, f, d[1]],
            i = [e, ",", f, "L", Cf(Di, g), ",", Cf(Di, h)];
        for (a.push(a[c - 1]); ++b <= c;) d = a[b], g.shift(), g.push(d[0]), h.shift(), h.push(d[1]), Df(i, g, h);
        return a.pop(), i.push("L", d), i.join("")
    }

    function zf(a) {
        if (a.length < 4) return of(a);
        for (var b, c = [], d = -1, e = a.length, f = [0], g = [0]; ++d < 3;) b = a[d], f.push(b[0]), g.push(b[1]);
        for (c.push(Cf(Di, f) + "," + Cf(Di, g)), --d; ++d < e;) b = a[d], f.shift(), f.push(b[0]), g.shift(), g.push(b[1]), Df(c, f, g);
        return c.join("")
    }

    function Af(a) {
        for (var b, c, d = -1, e = a.length, f = e + 4, g = [], h = []; ++d < 4;) c = a[d % e], g.push(c[0]), h.push(c[1]);
        for (b = [Cf(Di, g), ",", Cf(Di, h)], --d; ++d < f;) c = a[d % e], g.shift(), g.push(c[0]), h.shift(), h.push(c[1]), Df(b, g, h);
        return b.join("")
    }

    function Bf(a, b) {
        var c = a.length - 1;
        if (c)
            for (var d, e, f = a[0][0], g = a[0][1], h = a[c][0] - f, i = a[c][1] - g, j = -1; ++j <= c;) d = a[j], e = j / c, d[0] = b * d[0] + (1 - b) * (f + e * h),
                d[1] = b * d[1] + (1 - b) * (g + e * i);
        return yf(a)
    }

    function Cf(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
    }

    function Df(a, b, c) {
        a.push("C", Cf(Bi, b), ",", Cf(Bi, c), ",", Cf(Ci, b), ",", Cf(Ci, c), ",", Cf(Di, b), ",", Cf(Di, c))
    }

    function Ef(a, b) {
        return (b[1] - a[1]) / (b[0] - a[0])
    }

    function Ff(a) {
        for (var b = 0, c = a.length - 1, d = [], e = a[0], f = a[1], g = d[0] = Ef(e, f); ++b < c;) d[b] = (g + (g = Ef(e = f, f = a[b + 1]))) / 2;
        return d[b] = g, d
    }

    function Gf(a) {
        for (var b, c, d, e, f = [], g = Ff(a), h = -1, i = a.length - 1; ++h < i;) b = Ef(a[h], a[h + 1]), ng(b) < Dg ? g[h] = g[h + 1] = 0 : (c = g[h] / b, d = g[h + 1] / b, e = c * c + d * d, e > 9 && (e = 3 * b / Math.sqrt(e), g[h] = e * c, g[h + 1] = e * d));
        for (h = -1; ++h <= i;) e = (a[Math.min(i, h + 1)][0] - a[Math.max(0, h - 1)][0]) / (6 * (1 + g[h] * g[h])), f.push([e || 0, g[h] * e || 0]);
        return f
    }

    function Hf(a) {
        return a.length < 3 ? of(a) : a[0] + wf(a, Gf(a))
    }

    function If(a) {
        for (var b, c, d, e = -1, f = a.length; ++e < f;) b = a[e], c = b[0], d = b[1] - Ig, b[0] = c * Math.cos(d), b[1] = c * Math.sin(d);
        return a
    }

    function Jf(a) {
        function b(b) {
            function i() {
                p.push("M", h(a(r), l), k, j(a(q.reverse()), l), "Z")
            }
            for (var m, n, o, p = [], q = [], r = [], s = -1, t = b.length, u = Aa(c), v = Aa(e), w = c === d ? function() {
                    return n
                } : Aa(d), x = e === f ? function() {
                    return o
                } : Aa(f); ++s < t;) g.call(this, m = b[s], s) ? (q.push([n = +u.call(this, m, s), o = +v.call(this, m, s)]), r.push([+w.call(this, m, s), +x.call(this, m, s)])) : q.length && (i(), q = [], r = []);
            return q.length && i(), p.length ? p.join("") : null
        }
        var c = Bc,
            d = Bc,
            e = 0,
            f = Cc,
            g = Cb,
            h = of,
            i = h.key,
            j = h,
            k = "L",
            l = .7;
        return b.x = function(a) {
            return arguments.length ? (c = d = a, b) : d
        }, b.x0 = function(a) {
            return arguments.length ? (c = a, b) : c
        }, b.x1 = function(a) {
            return arguments.length ? (d = a, b) : d
        }, b.y = function(a) {
            return arguments.length ? (e = f = a, b) : f
        }, b.y0 = function(a) {
            return arguments.length ? (e = a, b) : e
        }, b.y1 = function(a) {
            return arguments.length ? (f = a, b) : f
        }, b.defined = function(a) {
            return arguments.length ? (g = a, b) : g
        }, b.interpolate = function(a) {
            return arguments.length ? (i = "function" == typeof a ? h = a : (h = Ai.get(a) || of).key, j = h.reverse || h, k = h.closed ? "M" : "L", b) : i
        }, b.tension = function(a) {
            return arguments.length ? (l = a, b) : l
        }, b
    }

    function Kf(a) {
        return a.radius
    }

    function Lf(a) {
        return [a.x, a.y]
    }

    function Mf(a) {
        return function() {
            var b = a.apply(this, arguments),
                c = b[0],
                d = b[1] - Ig;
            return [c * Math.cos(d), c * Math.sin(d)]
        }
    }

    function Nf() {
        return 64
    }

    function Of() {
        return "circle"
    }

    function Pf(a) {
        var b = Math.sqrt(a / Fg);
        return "M0," + b + "A" + b + "," + b + " 0 1,1 0," + -b + "A" + b + "," + b + " 0 1,1 0," + b + "Z"
    }

    function Qf(a) {
        return function() {
            var b, c;
            (b = this[a]) && (c = b[b.active]) && (--b.count ? delete b[b.active] : delete this[a], b.active += .5, c.event && c.event.interrupt.call(this, this.__data__, c.index))
        }
    }

    function Rf(a, b, c) {
        return sg(a, Ki), a.namespace = b, a.id = c, a
    }

    function Sf(a, b, c, d) {
        var e = a.id,
            f = a.namespace;
        return R(a, "function" == typeof c ? function(a, g, h) {
            a[f][e].tween.set(b, d(c.call(a, a.__data__, g, h)))
        } : (c = d(c), function(a) {
            a[f][e].tween.set(b, c)
        }))
    }

    function Tf(a) {
        return null == a && (a = ""),
            function() {
                this.textContent = a
            }
    }

    function Uf(a) {
        return null == a ? "__transition__" : "__transition_" + a + "__"
    }

    function Vf(a, b, c, d, e) {
        var f = a[c] || (a[c] = {
                active: 0,
                count: 0
            }),
            g = f[d];
        if (!g) {
            var h = e.time;
            g = f[d] = {
                tween: new j,
                time: h,
                delay: e.delay,
                duration: e.duration,
                ease: e.ease,
                index: b
            }, e = null, ++f.count, bg.timer(function(e) {
                function i(c) {
                    if (f.active > d) return k();
                    var e = f[f.active];
                    e && (--f.count, delete f[f.active], e.event && e.event.interrupt.call(a, a.__data__, e.index)), f.active = d, g.event && g.event.start.call(a, a.__data__, b), g.tween.forEach(function(c, d) {
                        (d = d.call(a, a.__data__, b)) && p.push(d)
                    }), m = g.ease, l = g.duration, bg.timer(function() {
                        return o.c = j(c || 1) ? Cb : j, 1
                    }, 0, h)
                }

                function j(c) {
                    if (f.active !== d) return 1;
                    for (var e = c / l, h = m(e), i = p.length; i > 0;) p[--i].call(a, h);
                    return e >= 1 ? (g.event && g.event.end.call(a, a.__data__, b), k()) : void 0
                }

                function k() {
                    return --f.count ? delete f[d] : delete a[c], 1
                }
                var l, m, n = g.delay,
                    o = ch,
                    p = [];
                return o.t = n + h, e >= n ? i(e - n) : void(o.c = i)
            }, 0, h)
        }
    }

    function Wf(a, b, c) {
        a.attr("transform", function(a) {
            var d = b(a);
            return "translate(" + (isFinite(d) ? d : c(a)) + ",0)"
        })
    }

    function Xf(a, b, c) {
        a.attr("transform", function(a) {
            var d = b(a);
            return "translate(0," + (isFinite(d) ? d : c(a)) + ")"
        })
    }

    function Yf(a) {
        return a.toISOString()
    }

    function Zf(a, b, c) {
        function d(b) {
            return a(b)
        }

        function e(a, c) {
            var d = a[1] - a[0],
                e = d / c,
                f = bg.bisect(Ti, e);
            return f == Ti.length ? [b.year, Te(a.map(function(a) {
                return a / 31536e6
            }), c)[2]] : f ? b[e / Ti[f - 1] < Ti[f] / e ? f - 1 : f] : [Wi, Te(a, c)[2]]
        }
        return d.invert = function(b) {
            return $f(a.invert(b))
        }, d.domain = function(b) {
            return arguments.length ? (a.domain(b), d) : a.domain().map($f)
        }, d.nice = function(a, b) {
            function c(c) {
                return !isNaN(c) && !a.range(c, $f(+c + 1), b).length
            }
            var f = d.domain(),
                g = Ke(f),
                h = null == a ? e(g, 10) : "number" == typeof a && e(g, a);
            return h && (a = h[0], b = h[1]), d.domain(Ne(f, b > 1 ? {
                floor: function(b) {
                    for (; c(b = a.floor(b));) b = $f(b - 1);
                    return b
                },
                ceil: function(b) {
                    for (; c(b = a.ceil(b));) b = $f(+b + 1);
                    return b
                }
            } : a))
        }, d.ticks = function(a, b) {
            var c = Ke(d.domain()),
                f = null == a ? e(c, 10) : "number" == typeof a ? e(c, a) : !a.range && [{
                    range: a
                }, b];
            return f && (a = f[0], b = f[1]), a.range(c[0], $f(+c[1] + 1), 1 > b ? 1 : b)
        }, d.tickFormat = function() {
            return c
        }, d.copy = function() {
            return Zf(a.copy(), b, c)
        }, Re(d, a)
    }

    function $f(a) {
        return new Date(a)
    }

    function _f(a) {
        return JSON.parse(a.responseText)
    }

    function ag(a) {
        var b = eg.createRange();
        return b.selectNode(eg.body), b.createContextualFragment(a.responseText)
    }
    var bg = {
            version: "3.5.5"
        },
        cg = [].slice,
        dg = function(a) {
            return cg.call(a)
        },
        eg = this.document;
    if (eg) try {
        dg(eg.documentElement.childNodes)[0].nodeType
    } catch (fg) {
        dg = function(a) {
            for (var b = a.length, c = new Array(b); b--;) c[b] = a[b];
            return c
        }
    }
    if (Date.now || (Date.now = function() {
            return +new Date
        }), eg) try {
        eg.createElement("DIV").style.setProperty("opacity", 0, "")
    } catch (gg) {
        var hg = this.Element.prototype,
            ig = hg.setAttribute,
            jg = hg.setAttributeNS,
            kg = this.CSSStyleDeclaration.prototype,
            lg = kg.setProperty;
        hg.setAttribute = function(a, b) {
            ig.call(this, a, b + "")
        }, hg.setAttributeNS = function(a, b, c) {
            jg.call(this, a, b, c + "")
        }, kg.setProperty = function(a, b, c) {
            lg.call(this, a, b + "", c)
        }
    }
    bg.ascending = c, bg.descending = function(a, b) {
        return a > b ? -1 : b > a ? 1 : b >= a ? 0 : NaN
    }, bg.min = function(a, b) {
        var c, d, e = -1,
            f = a.length;
        if (1 === arguments.length) {
            for (; ++e < f;)
                if (null != (d = a[e]) && d >= d) {
                    c = d;
                    break
                }
            for (; ++e < f;) null != (d = a[e]) && c > d && (c = d)
        } else {
            for (; ++e < f;)
                if (null != (d = b.call(a, a[e], e)) && d >= d) {
                    c = d;
                    break
                }
            for (; ++e < f;) null != (d = b.call(a, a[e], e)) && c > d && (c = d)
        }
        return c
    }, bg.max = function(a, b) {
        var c, d, e = -1,
            f = a.length;
        if (1 === arguments.length) {
            for (; ++e < f;)
                if (null != (d = a[e]) && d >= d) {
                    c = d;
                    break
                }
            for (; ++e < f;) null != (d = a[e]) && d > c && (c = d)
        } else {
            for (; ++e < f;)
                if (null != (d = b.call(a, a[e], e)) && d >= d) {
                    c = d;
                    break
                }
            for (; ++e < f;) null != (d = b.call(a, a[e], e)) && d > c && (c = d)
        }
        return c
    }, bg.extent = function(a, b) {
        var c, d, e, f = -1,
            g = a.length;
        if (1 === arguments.length) {
            for (; ++f < g;)
                if (null != (d = a[f]) && d >= d) {
                    c = e = d;
                    break
                }
            for (; ++f < g;) null != (d = a[f]) && (c > d && (c = d), d > e && (e = d))
        } else {
            for (; ++f < g;)
                if (null != (d = b.call(a, a[f], f)) && d >= d) {
                    c = e = d;
                    break
                }
            for (; ++f < g;) null != (d = b.call(a, a[f], f)) && (c > d && (c = d), d > e && (e = d))
        }
        return [c, e]
    }, bg.sum = function(a, b) {
        var c, d = 0,
            f = a.length,
            g = -1;
        if (1 === arguments.length)
            for (; ++g < f;) e(c = +a[g]) && (d += c);
        else
            for (; ++g < f;) e(c = +b.call(a, a[g], g)) && (d += c);
        return d
    }, bg.mean = function(a, b) {
        var c, f = 0,
            g = a.length,
            h = -1,
            i = g;
        if (1 === arguments.length)
            for (; ++h < g;) e(c = d(a[h])) ? f += c : --i;
        else
            for (; ++h < g;) e(c = d(b.call(a, a[h], h))) ? f += c : --i;
        return i ? f / i : void 0
    }, bg.quantile = function(a, b) {
        var c = (a.length - 1) * b + 1,
            d = Math.floor(c),
            e = +a[d - 1],
            f = c - d;
        return f ? e + f * (a[d] - e) : e
    }, bg.median = function(a, b) {
        var f, g = [],
            h = a.length,
            i = -1;
        if (1 === arguments.length)
            for (; ++i < h;) e(f = d(a[i])) && g.push(f);
        else
            for (; ++i < h;) e(f = d(b.call(a, a[i], i))) && g.push(f);
        return g.length ? bg.quantile(g.sort(c), .5) : void 0
    }, bg.variance = function(a, b) {
        var c, f, g = a.length,
            h = 0,
            i = 0,
            j = -1,
            k = 0;
        if (1 === arguments.length)
            for (; ++j < g;) e(c = d(a[j])) && (f = c - h, h += f / ++k, i += f * (c - h));
        else
            for (; ++j < g;) e(c = d(b.call(a, a[j], j))) && (f = c - h, h += f / ++k, i += f * (c - h));
        return k > 1 ? i / (k - 1) : void 0
    }, bg.deviation = function() {
        var a = bg.variance.apply(this, arguments);
        return a ? Math.sqrt(a) : a
    };
    var mg = f(c);
    bg.bisectLeft = mg.left, bg.bisect = bg.bisectRight = mg.right, bg.bisector = function(a) {
        return f(1 === a.length ? function(b, d) {
            return c(a(b), d)
        } : a)
    }, bg.shuffle = function(a, b, c) {
        (f = arguments.length) < 3 && (c = a.length, 2 > f && (b = 0));
        for (var d, e, f = c - b; f;) e = Math.random() * f-- | 0, d = a[f + b], a[f + b] = a[e + b], a[e + b] = d;
        return a
    }, bg.permute = function(a, b) {
        for (var c = b.length, d = new Array(c); c--;) d[c] = a[b[c]];
        return d
    }, bg.pairs = function(a) {
        for (var b, c = 0, d = a.length - 1, e = a[0], f = new Array(0 > d ? 0 : d); d > c;) f[c] = [b = e, e = a[++c]];
        return f
    }, bg.zip = function() {
        if (!(d = arguments.length)) return [];
        for (var a = -1, b = bg.min(arguments, g), c = new Array(b); ++a < b;)
            for (var d, e = -1, f = c[a] = new Array(d); ++e < d;) f[e] = arguments[e][a];
        return c
    }, bg.transpose = function(a) {
        return bg.zip.apply(bg, a)
    }, bg.keys = function(a) {
        var b = [];
        for (var c in a) b.push(c);
        return b
    }, bg.values = function(a) {
        var b = [];
        for (var c in a) b.push(a[c]);
        return b
    }, bg.entries = function(a) {
        var b = [];
        for (var c in a) b.push({
            key: c,
            value: a[c]
        });
        return b
    }, bg.merge = function(a) {
        for (var b, c, d, e = a.length, f = -1, g = 0; ++f < e;) g += a[f].length;
        for (c = new Array(g); --e >= 0;)
            for (d = a[e], b = d.length; --b >= 0;) c[--g] = d[b];
        return c
    };
    var ng = Math.abs;
    bg.range = function(a, b, c) {
        if (arguments.length < 3 && (c = 1, arguments.length < 2 && (b = a, a = 0)), (b - a) / c === 1 / 0) throw new Error("infinite range");
        var d, e = [],
            f = h(ng(c)),
            g = -1;
        if (a *= f, b *= f, c *= f, 0 > c)
            for (;
                (d = a + c * ++g) > b;) e.push(d / f);
        else
            for (;
                (d = a + c * ++g) < b;) e.push(d / f);
        return e
    }, bg.map = function(a, b) {
        var c = new j;
        if (a instanceof j) a.forEach(function(a, b) {
            c.set(a, b)
        });
        else if (Array.isArray(a)) {
            var d, e = -1,
                f = a.length;
            if (1 === arguments.length)
                for (; ++e < f;) c.set(e, a[e]);
            else
                for (; ++e < f;) c.set(b.call(a, d = a[e], e), d)
        } else
            for (var g in a) c.set(g, a[g]);
        return c
    };
    var og = "__proto__",
        pg = "\x00";
    i(j, {
        has: m,
        get: function(a) {
            return this._[k(a)]
        },
        set: function(a, b) {
            return this._[k(a)] = b
        },
        remove: n,
        keys: o,
        values: function() {
            var a = [];
            for (var b in this._) a.push(this._[b]);
            return a
        },
        entries: function() {
            var a = [];
            for (var b in this._) a.push({
                key: l(b),
                value: this._[b]
            });
            return a
        },
        size: p,
        empty: q,
        forEach: function(a) {
            for (var b in this._) a.call(this, l(b), this._[b])
        }
    }), bg.nest = function() {
        function a(b, g, h) {
            if (h >= f.length) return d ? d.call(e, g) : c ? g.sort(c) : g;
            for (var i, k, l, m, n = -1, o = g.length, p = f[h++], q = new j; ++n < o;)(m = q.get(i = p(k = g[n]))) ? m.push(k) : q.set(i, [k]);
            return b ? (k = b(), l = function(c, d) {
                k.set(c, a(b, d, h))
            }) : (k = {}, l = function(c, d) {
                k[c] = a(b, d, h)
            }), q.forEach(l), k
        }

        function b(a, c) {
            if (c >= f.length) return a;
            var d = [],
                e = g[c++];
            return a.forEach(function(a, e) {
                d.push({
                    key: a,
                    values: b(e, c)
                })
            }), e ? d.sort(function(a, b) {
                return e(a.key, b.key)
            }) : d
        }
        var c, d, e = {},
            f = [],
            g = [];
        return e.map = function(b, c) {
            return a(c, b, 0)
        }, e.entries = function(c) {
            return b(a(bg.map, c, 0), 0)
        }, e.key = function(a) {
            return f.push(a), e
        }, e.sortKeys = function(a) {
            return g[f.length - 1] = a, e
        }, e.sortValues = function(a) {
            return c = a, e
        }, e.rollup = function(a) {
            return d = a, e
        }, e
    }, bg.set = function(a) {
        var b = new r;
        if (a)
            for (var c = 0, d = a.length; d > c; ++c) b.add(a[c]);
        return b
    }, i(r, {
        has: m,
        add: function(a) {
            return this._[k(a += "")] = !0, a
        },
        remove: n,
        values: o,
        size: p,
        empty: q,
        forEach: function(a) {
            for (var b in this._) a.call(this, l(b))
        }
    }), bg.behavior = {}, bg.rebind = function(a, b) {
        for (var c, d = 1, e = arguments.length; ++d < e;) a[c = arguments[d]] = t(a, b, b[c]);
        return a
    };
    var qg = ["webkit", "ms", "moz", "Moz", "o", "O"];
    bg.dispatch = function() {
        for (var a = new w, b = -1, c = arguments.length; ++b < c;) a[arguments[b]] = x(a);
        return a
    }, w.prototype.on = function(a, b) {
        var c = a.indexOf("."),
            d = "";
        if (c >= 0 && (d = a.slice(c + 1), a = a.slice(0, c)), a) return arguments.length < 2 ? this[a].on(d) : this[a].on(d, b);
        if (2 === arguments.length) {
            if (null == b)
                for (a in this) this.hasOwnProperty(a) && this[a].on(d, null);
            return this
        }
    }, bg.event = null, bg.requote = function(a) {
        return a.replace(rg, "\\$&")
    };
    var rg = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,
        sg = {}.__proto__ ? function(a, b) {
            a.__proto__ = b
        } : function(a, b) {
            for (var c in b) a[c] = b[c]
        },
        tg = function(a, b) {
            return b.querySelector(a)
        },
        ug = function(a, b) {
            return b.querySelectorAll(a)
        },
        vg = function(a, b) {
            var c = a.matches || a[u(a, "matchesSelector")];
            return (vg = function(a, b) {
                return c.call(a, b)
            })(a, b)
        };
    "function" == typeof Sizzle && (tg = function(a, b) {
        return Sizzle(a, b)[0] || null
    }, ug = Sizzle, vg = Sizzle.matchesSelector), bg.selection = function() {
        return bg.select(eg.documentElement)
    };
    var wg = bg.selection.prototype = [];
    wg.select = function(a) {
        var b, c, d, e, f = [];
        a = C(a);
        for (var g = -1, h = this.length; ++g < h;) {
            f.push(b = []), b.parentNode = (d = this[g]).parentNode;
            for (var i = -1, j = d.length; ++i < j;)(e = d[i]) ? (b.push(c = a.call(e, e.__data__, i, g)), c && "__data__" in e && (c.__data__ = e.__data__)) : b.push(null)
        }
        return B(f)
    }, wg.selectAll = function(a) {
        var b, c, d = [];
        a = D(a);
        for (var e = -1, f = this.length; ++e < f;)
            for (var g = this[e], h = -1, i = g.length; ++h < i;)(c = g[h]) && (d.push(b = dg(a.call(c, c.__data__, h, e))), b.parentNode = c);
        return B(d)
    };
    var xg = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    bg.ns = {
        prefix: xg,
        qualify: function(a) {
            var b = a.indexOf(":"),
                c = a;
            return b >= 0 && (c = a.slice(0, b), a = a.slice(b + 1)), xg.hasOwnProperty(c) ? {
                space: xg[c],
                local: a
            } : a
        }
    }, wg.attr = function(a, b) {
        if (arguments.length < 2) {
            if ("string" == typeof a) {
                var c = this.node();
                return a = bg.ns.qualify(a), a.local ? c.getAttributeNS(a.space, a.local) : c.getAttribute(a)
            }
            for (b in a) this.each(E(b, a[b]));
            return this
        }
        return this.each(E(a, b))
    }, wg.classed = function(a, b) {
        if (arguments.length < 2) {
            if ("string" == typeof a) {
                var c = this.node(),
                    d = (a = H(a)).length,
                    e = -1;
                if (b = c.classList) {
                    for (; ++e < d;)
                        if (!b.contains(a[e])) return !1
                } else
                    for (b = c.getAttribute("class"); ++e < d;)
                        if (!G(a[e]).test(b)) return !1; return !0
            }
            for (b in a) this.each(I(b, a[b]));
            return this
        }
        return this.each(I(a, b))
    }, wg.style = function(a, c, d) {
        var e = arguments.length;
        if (3 > e) {
            if ("string" != typeof a) {
                2 > e && (c = "");
                for (d in a) this.each(K(d, a[d], c));
                return this
            }
            if (2 > e) {
                var f = this.node();
                return b(f).getComputedStyle(f, null).getPropertyValue(a)
            }
            d = ""
        }
        return this.each(K(a, c, d))
    }, wg.property = function(a, b) {
        if (arguments.length < 2) {
            if ("string" == typeof a) return this.node()[a];
            for (b in a) this.each(L(b, a[b]));
            return this
        }
        return this.each(L(a, b))
    }, wg.text = function(a) {
        return arguments.length ? this.each("function" == typeof a ? function() {
            var b = a.apply(this, arguments);
            this.textContent = null == b ? "" : b
        } : null == a ? function() {
            this.textContent = ""
        } : function() {
            this.textContent = a
        }) : this.node().textContent
    }, wg.html = function(a) {
        return arguments.length ? this.each("function" == typeof a ? function() {
            var b = a.apply(this, arguments);
            this.innerHTML = null == b ? "" : b
        } : null == a ? function() {
            this.innerHTML = ""
        } : function() {
            this.innerHTML = a
        }) : this.node().innerHTML
    }, wg.append = function(a) {
        return a = M(a), this.select(function() {
            return this.appendChild(a.apply(this, arguments))
        })
    }, wg.insert = function(a, b) {
        return a = M(a), b = C(b), this.select(function() {
            return this.insertBefore(a.apply(this, arguments), b.apply(this, arguments) || null)
        })
    }, wg.remove = function() {
        return this.each(N)
    }, wg.data = function(a, b) {
        function c(a, c) {
            var d, e, f, g = a.length,
                l = c.length,
                m = Math.min(g, l),
                n = new Array(l),
                o = new Array(l),
                p = new Array(g);
            if (b) {
                var q, r = new j,
                    s = new Array(g);
                for (d = -1; ++d < g;) r.has(q = b.call(e = a[d], e.__data__, d)) ? p[d] = e : r.set(q, e), s[d] = q;
                for (d = -1; ++d < l;)(e = r.get(q = b.call(c, f = c[d], d))) ? e !== !0 && (n[d] = e, e.__data__ = f) : o[d] = O(f), r.set(q, !0);
                for (d = -1; ++d < g;) r.get(s[d]) !== !0 && (p[d] = a[d])
            } else {
                for (d = -1; ++d < m;) e = a[d], f = c[d], e ? (e.__data__ = f, n[d] = e) : o[d] = O(f);
                for (; l > d; ++d) o[d] = O(c[d]);
                for (; g > d; ++d) p[d] = a[d]
            }
            o.update = n, o.parentNode = n.parentNode = p.parentNode = a.parentNode, h.push(o), i.push(n), k.push(p)
        }
        var d, e, f = -1,
            g = this.length;
        if (!arguments.length) {
            for (a = new Array(g = (d = this[0]).length); ++f < g;)(e = d[f]) && (a[f] = e.__data__);
            return a
        }
        var h = S([]),
            i = B([]),
            k = B([]);
        if ("function" == typeof a)
            for (; ++f < g;) c(d = this[f], a.call(d, d.parentNode.__data__, f));
        else
            for (; ++f < g;) c(d = this[f], a);
        return i.enter = function() {
            return h
        }, i.exit = function() {
            return k
        }, i
    }, wg.datum = function(a) {
        return arguments.length ? this.property("__data__", a) : this.property("__data__")
    }, wg.filter = function(a) {
        var b, c, d, e = [];
        "function" != typeof a && (a = P(a));
        for (var f = 0, g = this.length; g > f; f++) {
            e.push(b = []), b.parentNode = (c = this[f]).parentNode;
            for (var h = 0, i = c.length; i > h; h++)(d = c[h]) && a.call(d, d.__data__, h, f) && b.push(d)
        }
        return B(e)
    }, wg.order = function() {
        for (var a = -1, b = this.length; ++a < b;)
            for (var c, d = this[a], e = d.length - 1, f = d[e]; --e >= 0;)(c = d[e]) && (f && f !== c.nextSibling && f.parentNode.insertBefore(c, f), f = c);
        return this
    }, wg.sort = function(a) {
        a = Q.apply(this, arguments);
        for (var b = -1, c = this.length; ++b < c;) this[b].sort(a);
        return this.order()
    }, wg.each = function(a) {
        return R(this, function(b, c, d) {
            a.call(b, b.__data__, c, d)
        })
    }, wg.call = function(a) {
        var b = dg(arguments);
        return a.apply(b[0] = this, b), this
    }, wg.empty = function() {
        return !this.node()
    }, wg.node = function() {
        for (var a = 0, b = this.length; b > a; a++)
            for (var c = this[a], d = 0, e = c.length; e > d; d++) {
                var f = c[d];
                if (f) return f
            }
        return null
    }, wg.size = function() {
        var a = 0;
        return R(this, function() {
            ++a
        }), a
    };
    var yg = [];
    bg.selection.enter = S, bg.selection.enter.prototype = yg, yg.append = wg.append, yg.empty = wg.empty, yg.node = wg.node, yg.call = wg.call, yg.size = wg.size, yg.select = function(a) {
        for (var b, c, d, e, f, g = [], h = -1, i = this.length; ++h < i;) {
            d = (e = this[h]).update, g.push(b = []), b.parentNode = e.parentNode;
            for (var j = -1, k = e.length; ++j < k;)(f = e[j]) ? (b.push(d[j] = c = a.call(e.parentNode, f.__data__, j, h)), c.__data__ = f.__data__) : b.push(null)
        }
        return B(g)
    }, yg.insert = function(a, b) {
        return arguments.length < 2 && (b = T(this)), wg.insert.call(this, a, b)
    }, bg.select = function(b) {
        var c;
        return "string" == typeof b ? (c = [tg(b, eg)], c.parentNode = eg.documentElement) : (c = [b], c.parentNode = a(b)), B([c])
    }, bg.selectAll = function(a) {
        var b;
        return "string" == typeof a ? (b = dg(ug(a, eg)), b.parentNode = eg.documentElement) : (b = a, b.parentNode = null), B([b])
    }, wg.on = function(a, b, c) {
        var d = arguments.length;
        if (3 > d) {
            if ("string" != typeof a) {
                2 > d && (b = !1);
                for (c in a) this.each(U(c, a[c], b));
                return this
            }
            if (2 > d) return (d = this.node()["__on" + a]) && d._;
            c = !1
        }
        return this.each(U(a, b, c))
    };
    var zg = bg.map({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    });
    eg && zg.forEach(function(a) {
        "on" + a in eg && zg.remove(a)
    });
    var Ag, Bg = 0;
    bg.mouse = function(a) {
        return Y(a, z())
    };
    var Cg = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
    bg.touch = function(a, b, c) {
        if (arguments.length < 3 && (c = b, b = z().changedTouches), b)
            for (var d, e = 0, f = b.length; f > e; ++e)
                if ((d = b[e]).identifier === c) return Y(a, d)
    }, bg.behavior.drag = function() {
        function a() {
            this.on("mousedown.drag", f).on("touchstart.drag", g)
        }

        function c(a, b, c, f, g) {
            return function() {
                function h() {
                    var a, c, d = b(m, p);
                    d && (a = d[0] - t[0], c = d[1] - t[1], o |= a | c, t = d, n({
                        type: "drag",
                        x: d[0] + j[0],
                        y: d[1] + j[1],
                        dx: a,
                        dy: c
                    }))
                }

                function i() {
                    b(m, p) && (r.on(f + q, null).on(g + q, null), s(o && bg.event.target === l), n({
                        type: "dragend"
                    }))
                }
                var j, k = this,
                    l = bg.event.target,
                    m = k.parentNode,
                    n = d.of(k, arguments),
                    o = 0,
                    p = a(),
                    q = ".drag" + (null == p ? "" : "-" + p),
                    r = bg.select(c(l)).on(f + q, h).on(g + q, i),
                    s = X(l),
                    t = b(m, p);
                e ? (j = e.apply(k, arguments), j = [j.x - t[0], j.y - t[1]]) : j = [0, 0], n({
                    type: "dragstart"
                })
            }
        }
        var d = A(a, "drag", "dragstart", "dragend"),
            e = null,
            f = c(v, bg.mouse, b, "mousemove", "mouseup"),
            g = c(Z, bg.touch, s, "touchmove", "touchend");
        return a.origin = function(b) {
            return arguments.length ? (e = b, a) : e
        }, bg.rebind(a, d, "on")
    }, bg.touches = function(a, b) {
        return arguments.length < 2 && (b = z().touches), b ? dg(b).map(function(b) {
            var c = Y(a, b);
            return c.identifier = b.identifier, c
        }) : []
    };
    var Dg = 1e-6,
        Eg = Dg * Dg,
        Fg = Math.PI,
        Gg = 2 * Fg,
        Hg = Gg - Dg,
        Ig = Fg / 2,
        Jg = Fg / 180,
        Kg = 180 / Fg,
        Lg = Math.SQRT2,
        Mg = 2,
        Ng = 4;
    bg.interpolateZoom = function(a, b) {
        function c(a) {
            var b = a * s;
            if (r) {
                var c = da(p),
                    g = f / (Mg * m) * (c * ea(Lg * b + p) - ca(p));
                return [d + g * j, e + g * k, f * c / da(Lg * b + p)]
            }
            return [d + a * j, e + a * k, f * Math.exp(Lg * b)]
        }
        var d = a[0],
            e = a[1],
            f = a[2],
            g = b[0],
            h = b[1],
            i = b[2],
            j = g - d,
            k = h - e,
            l = j * j + k * k,
            m = Math.sqrt(l),
            n = (i * i - f * f + Ng * l) / (2 * f * Mg * m),
            o = (i * i - f * f - Ng * l) / (2 * i * Mg * m),
            p = Math.log(Math.sqrt(n * n + 1) - n),
            q = Math.log(Math.sqrt(o * o + 1) - o),
            r = q - p,
            s = (r || Math.log(i / f)) / Lg;
        return c.duration = 1e3 * s, c
    }, bg.behavior.zoom = function() {
        function a(a) {
            a.on(F, l).on(Pg + ".zoom", n).on("dblclick.zoom", o).on(I, m)
        }

        function c(a) {
            return [(a[0] - z.x) / z.k, (a[1] - z.y) / z.k]
        }

        function d(a) {
            return [a[0] * z.k + z.x, a[1] * z.k + z.y]
        }

        function e(a) {
            z.k = Math.max(C[0], Math.min(C[1], a))
        }

        function f(a, b) {
            b = d(b), z.x += a[0] - b[0], z.y += a[1] - b[1]
        }

        function g(b, c, d, g) {
            b.__chart__ = {
                x: z.x,
                y: z.y,
                k: z.k
            }, e(Math.pow(2, g)), f(q = c, d), b = bg.select(b), D > 0 && (b = b.transition().duration(D)), b.call(a.event)
        }

        function h() {
            v && v.domain(u.range().map(function(a) {
                return (a - z.x) / z.k
            }).map(u.invert)), x && x.domain(w.range().map(function(a) {
                return (a - z.y) / z.k
            }).map(w.invert))
        }

        function i(a) {
            E++ || a({
                type: "zoomstart"
            })
        }

        function j(a) {
            h(), a({
                type: "zoom",
                scale: z.k,
                translate: [z.x, z.y]
            })
        }

        function k(a) {
            --E || (a({
                type: "zoomend"
            }), q = null)
        }

        function l() {
            function a() {
                l = 1, f(bg.mouse(e), n), j(h)
            }

            function d() {
                m.on(G, null).on(H, null), o(l && bg.event.target === g), k(h)
            }
            var e = this,
                g = bg.event.target,
                h = J.of(e, arguments),
                l = 0,
                m = bg.select(b(e)).on(G, a).on(H, d),
                n = c(bg.mouse(e)),
                o = X(e);
            Ji.call(e), i(h)
        }

        function m() {
            function a() {
                var a = bg.touches(o);
                return n = z.k, a.forEach(function(a) {
                    a.identifier in q && (q[a.identifier] = c(a))
                }), a
            }

            function b() {
                var b = bg.event.target;
                bg.select(b).on(u, d).on(v, h), w.push(b);
                for (var c = bg.event.changedTouches, e = 0, f = c.length; f > e; ++e) q[c[e].identifier] = null;
                var i = a(),
                    j = Date.now();
                if (1 === i.length) {
                    if (500 > j - t) {
                        var k = i[0];
                        g(o, k, q[k.identifier], Math.floor(Math.log(z.k) / Math.LN2) + 1), y()
                    }
                    t = j
                } else if (i.length > 1) {
                    var k = i[0],
                        l = i[1],
                        m = k[0] - l[0],
                        n = k[1] - l[1];
                    r = m * m + n * n
                }
            }

            function d() {
                var a, b, c, d, g = bg.touches(o);
                Ji.call(o);
                for (var h = 0, i = g.length; i > h; ++h, d = null)
                    if (c = g[h], d = q[c.identifier]) {
                        if (b) break;
                        a = c, b = d
                    }
                if (d) {
                    var k = (k = c[0] - a[0]) * k + (k = c[1] - a[1]) * k,
                        l = r && Math.sqrt(k / r);
                    a = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], b = [(b[0] + d[0]) / 2, (b[1] + d[1]) / 2], e(l * n)
                }
                t = null, f(a, b), j(p)
            }

            function h() {
                if (bg.event.touches.length) {
                    for (var b = bg.event.changedTouches, c = 0, d = b.length; d > c; ++c) delete q[b[c].identifier];
                    for (var e in q) return void a()
                }
                bg.selectAll(w).on(s, null), x.on(F, l).on(I, m), A(), k(p)
            }
            var n, o = this,
                p = J.of(o, arguments),
                q = {},
                r = 0,
                s = ".zoom-" + bg.event.changedTouches[0].identifier,
                u = "touchmove" + s,
                v = "touchend" + s,
                w = [],
                x = bg.select(o),
                A = X(o);
            b(), i(p), x.on(F, null).on(I, b)
        }

        function n() {
            var a = J.of(this, arguments);
            s ? clearTimeout(s) : (Ji.call(this), p = c(q = r || bg.mouse(this)), i(a)), Ji.call(this), i(a), s = setTimeout(function() {
                s = null, k(a)
            }, 50), y(), e(Math.pow(2, .002 * Og()) * z.k), f(q, p), j(a)
        }

        function o() {
            var a = bg.mouse(this),
                b = Math.log(z.k) / Math.LN2;
            g(this, a, c(a), bg.event.shiftKey ? Math.ceil(b) - 1 : Math.floor(b) + 1)
        }
        var p, q, r, s, t, u, v, w, x, z = {
                x: 0,
                y: 0,
                k: 1
            },
            B = [960, 500],
            C = Qg,
            D = 250,
            E = 0,
            F = "mousedown.zoom",
            G = "mousemove.zoom",
            H = "mouseup.zoom",
            I = "touchstart.zoom",
            J = A(a, "zoomstart", "zoom", "zoomend");
        return Pg || (Pg = "onwheel" in eg ? (Og = function() {
            return -bg.event.deltaY * (bg.event.deltaMode ? 120 : 1)
        }, "wheel") : "onmousewheel" in eg ? (Og = function() {
            return bg.event.wheelDelta
        }, "mousewheel") : (Og = function() {
            return -bg.event.detail
        }, "MozMousePixelScroll")), a.event = function(a) {
            a.each(function() {
                var a = J.of(this, arguments),
                    b = z;
                Hi ? bg.select(this).transition().each("start.zoom", function() {
                    z = this.__chart__ || {
                        x: 0,
                        y: 0,
                        k: 1
                    }, i(a)
                }).tween("zoom:zoom", function() {
                    var c = B[0],
                        d = B[1],
                        e = q ? q[0] : c / 2,
                        f = q ? q[1] : d / 2,
                        g = bg.interpolateZoom([(e - z.x) / z.k, (f - z.y) / z.k, c / z.k], [(e - b.x) / b.k, (f - b.y) / b.k, c / b.k]);
                    return function(b) {
                        var d = g(b),
                            h = c / d[2];
                        this.__chart__ = z = {
                            x: e - d[0] * h,
                            y: f - d[1] * h,
                            k: h
                        }, j(a)
                    }
                }).each("interrupt.zoom", function() {
                    k(a)
                }).each("end.zoom", function() {
                    k(a)
                }) : (this.__chart__ = z, i(a), j(a), k(a))
            })
        }, a.translate = function(b) {
            return arguments.length ? (z = {
                x: +b[0],
                y: +b[1],
                k: z.k
            }, h(), a) : [z.x, z.y]
        }, a.scale = function(b) {
            return arguments.length ? (z = {
                x: z.x,
                y: z.y,
                k: +b
            }, h(), a) : z.k
        }, a.scaleExtent = function(b) {
            return arguments.length ? (C = null == b ? Qg : [+b[0], +b[1]], a) : C
        }, a.center = function(b) {
            return arguments.length ? (r = b && [+b[0], +b[1]], a) : r
        }, a.size = function(b) {
            return arguments.length ? (B = b && [+b[0], +b[1]], a) : B
        }, a.duration = function(b) {
            return arguments.length ? (D = +b, a) : D
        }, a.x = function(b) {
            return arguments.length ? (v = b, u = b.copy(), z = {
                x: 0,
                y: 0,
                k: 1
            }, a) : v
        }, a.y = function(b) {
            return arguments.length ? (x = b, w = b.copy(), z = {
                x: 0,
                y: 0,
                k: 1
            }, a) : x
        }, bg.rebind(a, J, "on")
    };
    var Og, Pg, Qg = [0, 1 / 0];
    bg.color = ga, ga.prototype.toString = function() {
        return this.rgb() + ""
    }, bg.hsl = ha;
    var Rg = ha.prototype = new ga;
    Rg.brighter = function(a) {
        return a = Math.pow(.7, arguments.length ? a : 1), new ha(this.h, this.s, this.l / a)
    }, Rg.darker = function(a) {
        return a = Math.pow(.7, arguments.length ? a : 1), new ha(this.h, this.s, a * this.l)
    }, Rg.rgb = function() {
        return ia(this.h, this.s, this.l)
    }, bg.hcl = ja;
    var Sg = ja.prototype = new ga;
    Sg.brighter = function(a) {
        return new ja(this.h, this.c, Math.min(100, this.l + Tg * (arguments.length ? a : 1)))
    }, Sg.darker = function(a) {
        return new ja(this.h, this.c, Math.max(0, this.l - Tg * (arguments.length ? a : 1)))
    }, Sg.rgb = function() {
        return ka(this.h, this.c, this.l).rgb()
    }, bg.lab = la;
    var Tg = 18,
        Ug = .95047,
        Vg = 1,
        Wg = 1.08883,
        Xg = la.prototype = new ga;
    Xg.brighter = function(a) {
        return new la(Math.min(100, this.l + Tg * (arguments.length ? a : 1)), this.a, this.b)
    }, Xg.darker = function(a) {
        return new la(Math.max(0, this.l - Tg * (arguments.length ? a : 1)), this.a, this.b)
    }, Xg.rgb = function() {
        return ma(this.l, this.a, this.b)
    }, bg.rgb = ra;
    var Yg = ra.prototype = new ga;
    Yg.brighter = function(a) {
        a = Math.pow(.7, arguments.length ? a : 1);
        var b = this.r,
            c = this.g,
            d = this.b,
            e = 30;
        return b || c || d ? (b && e > b && (b = e), c && e > c && (c = e), d && e > d && (d = e), new ra(Math.min(255, b / a), Math.min(255, c / a), Math.min(255, d / a))) : new ra(e, e, e)
    }, Yg.darker = function(a) {
        return a = Math.pow(.7, arguments.length ? a : 1), new ra(a * this.r, a * this.g, a * this.b)
    }, Yg.hsl = function() {
        return wa(this.r, this.g, this.b)
    }, Yg.toString = function() {
        return "#" + ua(this.r) + ua(this.g) + ua(this.b)
    };
    var Zg = bg.map({
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
    });
    Zg.forEach(function(a, b) {
        Zg.set(a, sa(b))
    }), bg.functor = Aa, bg.xhr = Ba(s), bg.dsv = function(a, b) {
        function c(a, c, f) {
            arguments.length < 3 && (f = c, c = null);
            var g = Ca(a, b, null == c ? d : e(c), f);
            return g.row = function(a) {
                return arguments.length ? g.response(null == (c = a) ? d : e(a)) : c
            }, g
        }

        function d(a) {
            return c.parse(a.responseText)
        }

        function e(a) {
            return function(b) {
                return c.parse(b.responseText, a)
            }
        }

        function f(b) {
            return b.map(g).join(a)
        }

        function g(a) {
            return h.test(a) ? '"' + a.replace(/\"/g, '""') + '"' : a
        }
        var h = new RegExp('["' + a + "\n]"),
            i = a.charCodeAt(0);
        return c.parse = function(a, b) {
            var d;
            return c.parseRows(a, function(a, c) {
                if (d) return d(a, c - 1);
                var e = new Function("d", "return {" + a.map(function(a, b) {
                    return JSON.stringify(a) + ": d[" + b + "]"
                }).join(",") + "}");
                d = b ? function(a, c) {
                    return b(e(a), c)
                } : e
            })
        }, c.parseRows = function(a, b) {
            function c() {
                if (k >= j) return g;
                if (e) return e = !1, f;
                var b = k;
                if (34 === a.charCodeAt(b)) {
                    for (var c = b; c++ < j;)
                        if (34 === a.charCodeAt(c)) {
                            if (34 !== a.charCodeAt(c + 1)) break;
                            ++c
                        }
                    k = c + 2;
                    var d = a.charCodeAt(c + 1);
                    return 13 === d ? (e = !0, 10 === a.charCodeAt(c + 2) && ++k) : 10 === d && (e = !0), a.slice(b + 1, c).replace(/""/g, '"')
                }
                for (; j > k;) {
                    var d = a.charCodeAt(k++),
                        h = 1;
                    if (10 === d) e = !0;
                    else if (13 === d) e = !0, 10 === a.charCodeAt(k) && (++k, ++h);
                    else if (d !== i) continue;
                    return a.slice(b, k - h)
                }
                return a.slice(b)
            }
            for (var d, e, f = {}, g = {}, h = [], j = a.length, k = 0, l = 0;
                (d = c()) !== g;) {
                for (var m = []; d !== f && d !== g;) m.push(d), d = c();
                b && null == (m = b(m, l++)) || h.push(m)
            }
            return h
        }, c.format = function(b) {
            if (Array.isArray(b[0])) return c.formatRows(b);
            var d = new r,
                e = [];
            return b.forEach(function(a) {
                for (var b in a) d.has(b) || e.push(d.add(b))
            }), [e.map(g).join(a)].concat(b.map(function(b) {
                return e.map(function(a) {
                    return g(b[a])
                }).join(a)
            })).join("\n")
        }, c.formatRows = function(a) {
            return a.map(f).join("\n")
        }, c
    }, bg.csv = bg.dsv(",", "text/csv"), bg.tsv = bg.dsv("	", "text/tab-separated-values");
    var $g, _g, ah, bh, ch, dh = this[u(this, "requestAnimationFrame")] || function(a) {
        setTimeout(a, 17)
    };
    bg.timer = function(a, b, c) {
        var d = arguments.length;
        2 > d && (b = 0), 3 > d && (c = Date.now());
        var e = c + b,
            f = {
                c: a,
                t: e,
                f: !1,
                n: null
            };
        _g ? _g.n = f : $g = f, _g = f, ah || (bh = clearTimeout(bh), ah = 1, dh(Fa))
    }, bg.timer.flush = function() {
        Ga(), Ha()
    }, bg.round = function(a, b) {
        return b ? Math.round(a * (b = Math.pow(10, b))) / b : Math.round(a)
    };
    var eh = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(Ja);
    bg.formatPrefix = function(a, b) {
        var c = 0;
        return a && (0 > a && (a *= -1), b && (a = bg.round(a, Ia(a, b))), c = 1 + Math.floor(1e-12 + Math.log(a) / Math.LN10), c = Math.max(-24, Math.min(24, 3 * Math.floor((c - 1) / 3)))), eh[8 + c / 3]
    };
    var fh = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,
        gh = bg.map({
            b: function(a) {
                return a.toString(2)
            },
            c: function(a) {
                return String.fromCharCode(a)
            },
            o: function(a) {
                return a.toString(8)
            },
            x: function(a) {
                return a.toString(16)
            },
            X: function(a) {
                return a.toString(16).toUpperCase()
            },
            g: function(a, b) {
                return a.toPrecision(b)
            },
            e: function(a, b) {
                return a.toExponential(b)
            },
            f: function(a, b) {
                return a.toFixed(b)
            },
            r: function(a, b) {
                return (a = bg.round(a, Ia(a, b))).toFixed(Math.max(0, Math.min(20, Ia(a * (1 + 1e-15), b))))
            }
        }),
        hh = bg.time = {},
        ih = Date;
    Ma.prototype = {
        getDate: function() {
            return this._.getUTCDate()
        },
        getDay: function() {
            return this._.getUTCDay()
        },
        getFullYear: function() {
            return this._.getUTCFullYear()
        },
        getHours: function() {
            return this._.getUTCHours()
        },
        getMilliseconds: function() {
            return this._.getUTCMilliseconds()
        },
        getMinutes: function() {
            return this._.getUTCMinutes()
        },
        getMonth: function() {
            return this._.getUTCMonth()
        },
        getSeconds: function() {
            return this._.getUTCSeconds()
        },
        getTime: function() {
            return this._.getTime()
        },
        getTimezoneOffset: function() {
            return 0
        },
        valueOf: function() {
            return this._.valueOf()
        },
        setDate: function() {
            jh.setUTCDate.apply(this._, arguments)
        },
        setDay: function() {
            jh.setUTCDay.apply(this._, arguments)
        },
        setFullYear: function() {
            jh.setUTCFullYear.apply(this._, arguments)
        },
        setHours: function() {
            jh.setUTCHours.apply(this._, arguments)
        },
        setMilliseconds: function() {
            jh.setUTCMilliseconds.apply(this._, arguments)
        },
        setMinutes: function() {
            jh.setUTCMinutes.apply(this._, arguments)
        },
        setMonth: function() {
            jh.setUTCMonth.apply(this._, arguments)
        },
        setSeconds: function() {
            jh.setUTCSeconds.apply(this._, arguments)
        },
        setTime: function() {
            jh.setTime.apply(this._, arguments)
        }
    };
    var jh = Date.prototype;
    hh.year = Na(function(a) {
        return a = hh.day(a), a.setMonth(0, 1), a
    }, function(a, b) {
        a.setFullYear(a.getFullYear() + b)
    }, function(a) {
        return a.getFullYear()
    }), hh.years = hh.year.range, hh.years.utc = hh.year.utc.range, hh.day = Na(function(a) {
        var b = new ih(2e3, 0);
        return b.setFullYear(a.getFullYear(), a.getMonth(), a.getDate()), b
    }, function(a, b) {
        a.setDate(a.getDate() + b)
    }, function(a) {
        return a.getDate() - 1
    }), hh.days = hh.day.range, hh.days.utc = hh.day.utc.range, hh.dayOfYear = function(a) {
        var b = hh.year(a);
        return Math.floor((a - b - 6e4 * (a.getTimezoneOffset() - b.getTimezoneOffset())) / 864e5)
    }, ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].forEach(function(a, b) {
        b = 7 - b;
        var c = hh[a] = Na(function(a) {
            return (a = hh.day(a)).setDate(a.getDate() - (a.getDay() + b) % 7), a
        }, function(a, b) {
            a.setDate(a.getDate() + 7 * Math.floor(b))
        }, function(a) {
            var c = hh.year(a).getDay();
            return Math.floor((hh.dayOfYear(a) + (c + b) % 7) / 7) - (c !== b)
        });
        hh[a + "s"] = c.range, hh[a + "s"].utc = c.utc.range, hh[a + "OfYear"] = function(a) {
            var c = hh.year(a).getDay();
            return Math.floor((hh.dayOfYear(a) + (c + b) % 7) / 7)
        }
    }), hh.week = hh.sunday, hh.weeks = hh.sunday.range, hh.weeks.utc = hh.sunday.utc.range, hh.weekOfYear = hh.sundayOfYear;
    var kh = {
            "-": "",
            _: " ",
            0: "0"
        },
        lh = /^\s*\d+/,
        mh = /^%/;
    bg.locale = function(a) {
        return {
            numberFormat: Ka(a),
            timeFormat: Pa(a)
        }
    };
    var nh = bg.locale({
        decimal: ".",
        thousands: ",",
        grouping: [3],
        currency: ["$", ""],
        dateTime: "%a %b %e %X %Y",
        date: "%m/%d/%Y",
        time: "%H:%M:%S",
        periods: ["AM", "PM"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });
    bg.format = nh.numberFormat, bg.geo = {}, ib.prototype = {
        s: 0,
        t: 0,
        add: function(a) {
            jb(a, this.t, oh), jb(oh.s, this.s, this), this.s ? this.t += oh.t : this.s = oh.t
        },
        reset: function() {
            this.s = this.t = 0
        },
        valueOf: function() {
            return this.s
        }
    };
    var oh = new ib;
    bg.geo.stream = function(a, b) {
        a && ph.hasOwnProperty(a.type) ? ph[a.type](a, b) : kb(a, b)
    };
    var ph = {
            Feature: function(a, b) {
                kb(a.geometry, b)
            },
            FeatureCollection: function(a, b) {
                for (var c = a.features, d = -1, e = c.length; ++d < e;) kb(c[d].geometry, b)
            }
        },
        qh = {
            Sphere: function(a, b) {
                b.sphere()
            },
            Point: function(a, b) {
                a = a.coordinates, b.point(a[0], a[1], a[2])
            },
            MultiPoint: function(a, b) {
                for (var c = a.coordinates, d = -1, e = c.length; ++d < e;) a = c[d], b.point(a[0], a[1], a[2])
            },
            LineString: function(a, b) {
                lb(a.coordinates, b, 0)
            },
            MultiLineString: function(a, b) {
                for (var c = a.coordinates, d = -1, e = c.length; ++d < e;) lb(c[d], b, 0)
            },
            Polygon: function(a, b) {
                mb(a.coordinates, b)
            },
            MultiPolygon: function(a, b) {
                for (var c = a.coordinates, d = -1, e = c.length; ++d < e;) mb(c[d], b)
            },
            GeometryCollection: function(a, b) {
                for (var c = a.geometries, d = -1, e = c.length; ++d < e;) kb(c[d], b)
            }
        };
    bg.geo.area = function(a) {
        return rh = 0, bg.geo.stream(a, th), rh
    };
    var rh, sh = new ib,
        th = {
            sphere: function() {
                rh += 4 * Fg
            },
            point: v,
            lineStart: v,
            lineEnd: v,
            polygonStart: function() {
                sh.reset(), th.lineStart = nb
            },
            polygonEnd: function() {
                var a = 2 * sh;
                rh += 0 > a ? 4 * Fg + a : a, th.lineStart = th.lineEnd = th.point = v
            }
        };
    bg.geo.bounds = function() {
        function a(a, b) {
            t.push(u = [k = a, m = a]), l > b && (l = b), b > n && (n = b)
        }

        function b(b, c) {
            var d = ob([b * Jg, c * Jg]);
            if (r) {
                var e = qb(r, d),
                    f = [e[1], -e[0], 0],
                    g = qb(f, e);
                tb(g), g = ub(g);
                var i = b - o,
                    j = i > 0 ? 1 : -1,
                    p = g[0] * Kg * j,
                    q = ng(i) > 180;
                if (q ^ (p > j * o && j * b > p)) {
                    var s = g[1] * Kg;
                    s > n && (n = s)
                } else if (p = (p + 360) % 360 - 180, q ^ (p > j * o && j * b > p)) {
                    var s = -g[1] * Kg;
                    l > s && (l = s)
                } else l > c && (l = c), c > n && (n = c);
                q ? o > b ? h(k, b) > h(k, m) && (m = b) : h(b, m) > h(k, m) && (k = b) : m >= k ? (k > b && (k = b), b > m && (m = b)) : b > o ? h(k, b) > h(k, m) && (m = b) : h(b, m) > h(k, m) && (k = b)
            } else a(b, c);
            r = d, o = b
        }

        function c() {
            v.point = b
        }

        function d() {
            u[0] = k, u[1] = m, v.point = a, r = null
        }

        function e(a, c) {
            if (r) {
                var d = a - o;
                s += ng(d) > 180 ? d + (d > 0 ? 360 : -360) : d
            } else p = a, q = c;
            th.point(a, c), b(a, c)
        }

        function f() {
            th.lineStart()
        }

        function g() {
            e(p, q), th.lineEnd(), ng(s) > Dg && (k = -(m = 180)), u[0] = k, u[1] = m, r = null
        }

        function h(a, b) {
            return (b -= a) < 0 ? b + 360 : b
        }

        function i(a, b) {
            return a[0] - b[0]
        }

        function j(a, b) {
            return b[0] <= b[1] ? b[0] <= a && a <= b[1] : a < b[0] || b[1] < a
        }
        var k, l, m, n, o, p, q, r, s, t, u, v = {
            point: a,
            lineStart: c,
            lineEnd: d,
            polygonStart: function() {
                v.point = e, v.lineStart = f, v.lineEnd = g, s = 0, th.polygonStart()
            },
            polygonEnd: function() {
                th.polygonEnd(), v.point = a, v.lineStart = c, v.lineEnd = d, 0 > sh ? (k = -(m = 180), l = -(n = 90)) : s > Dg ? n = 90 : -Dg > s && (l = -90), u[0] = k, u[1] = m
            }
        };
        return function(a) {
            n = m = -(k = l = 1 / 0), t = [], bg.geo.stream(a, v);
            var b = t.length;
            if (b) {
                t.sort(i);
                for (var c, d = 1, e = t[0], f = [e]; b > d; ++d) c = t[d], j(c[0], e) || j(c[1], e) ? (h(e[0], c[1]) > h(e[0], e[1]) && (e[1] = c[1]), h(c[0], e[1]) > h(e[0], e[1]) && (e[0] = c[0])) : f.push(e = c);
                for (var g, c, o = -(1 / 0), b = f.length - 1, d = 0, e = f[b]; b >= d; e = c, ++d) c = f[d], (g = h(e[1], c[0])) > o && (o = g, k = c[0], m = e[1])
            }
            return t = u = null, k === 1 / 0 || l === 1 / 0 ? [
                [NaN, NaN],
                [NaN, NaN]
            ] : [
                [k, l],
                [m, n]
            ]
        }
    }(), bg.geo.centroid = function(a) {
        uh = vh = wh = xh = yh = zh = Ah = Bh = Ch = Dh = Eh = 0, bg.geo.stream(a, Fh);
        var b = Ch,
            c = Dh,
            d = Eh,
            e = b * b + c * c + d * d;
        return Eg > e && (b = zh, c = Ah, d = Bh, Dg > vh && (b = wh, c = xh, d = yh), e = b * b + c * c + d * d, Eg > e) ? [NaN, NaN] : [Math.atan2(c, b) * Kg, ba(d / Math.sqrt(e)) * Kg]
    };
    var uh, vh, wh, xh, yh, zh, Ah, Bh, Ch, Dh, Eh, Fh = {
            sphere: v,
            point: wb,
            lineStart: yb,
            lineEnd: zb,
            polygonStart: function() {
                Fh.lineStart = Ab
            },
            polygonEnd: function() {
                Fh.lineStart = yb
            }
        },
        Gh = Gb(Cb, Kb, Mb, [-Fg, -Fg / 2]),
        Hh = 1e9;
    bg.geo.clipExtent = function() {
        var a, b, c, d, e, f, g = {
            stream: function(a) {
                return e && (e.valid = !1), e = f(a), e.valid = !0, e
            },
            extent: function(h) {
                return arguments.length ? (f = Qb(a = +h[0][0], b = +h[0][1], c = +h[1][0], d = +h[1][1]), e && (e.valid = !1, e = null), g) : [
                    [a, b],
                    [c, d]
                ]
            }
        };
        return g.extent([
            [0, 0],
            [960, 500]
        ])
    }, (bg.geo.conicEqualArea = function() {
        return Rb(Sb)
    }).raw = Sb, bg.geo.albers = function() {
        return bg.geo.conicEqualArea().rotate([96, 0]).center([-.6, 38.7]).parallels([29.5, 45.5]).scale(1070)
    }, bg.geo.albersUsa = function() {
        function a(a) {
            var f = a[0],
                g = a[1];
            return b = null, c(f, g), b || (d(f, g), b) || e(f, g), b
        }
        var b, c, d, e, f = bg.geo.albers(),
            g = bg.geo.conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
            h = bg.geo.conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
            i = {
                point: function(a, c) {
                    b = [a, c]
                }
            };
        return a.invert = function(a) {
            var b = f.scale(),
                c = f.translate(),
                d = (a[0] - c[0]) / b,
                e = (a[1] - c[1]) / b;
            return (e >= .12 && .234 > e && d >= -.425 && -.214 > d ? g : e >= .166 && .234 > e && d >= -.214 && -.115 > d ? h : f).invert(a)
        }, a.stream = function(a) {
            var b = f.stream(a),
                c = g.stream(a),
                d = h.stream(a);
            return {
                point: function(a, e) {
                    b.point(a, e), c.point(a, e), d.point(a, e)
                },
                sphere: function() {
                    b.sphere(), c.sphere(), d.sphere()
                },
                lineStart: function() {
                    b.lineStart(), c.lineStart(), d.lineStart()
                },
                lineEnd: function() {
                    b.lineEnd(), c.lineEnd(), d.lineEnd()
                },
                polygonStart: function() {
                    b.polygonStart(), c.polygonStart(), d.polygonStart()
                },
                polygonEnd: function() {
                    b.polygonEnd(), c.polygonEnd(), d.polygonEnd()
                }
            }
        }, a.precision = function(b) {
            return arguments.length ? (f.precision(b), g.precision(b), h.precision(b), a) : f.precision()
        }, a.scale = function(b) {
            return arguments.length ? (f.scale(b), g.scale(.35 * b), h.scale(b), a.translate(f.translate())) : f.scale()
        }, a.translate = function(b) {
            if (!arguments.length) return f.translate();
            var j = f.scale(),
                k = +b[0],
                l = +b[1];
            return c = f.translate(b).clipExtent([
                [k - .455 * j, l - .238 * j],
                [k + .455 * j, l + .238 * j]
            ]).stream(i).point, d = g.translate([k - .307 * j, l + .201 * j]).clipExtent([
                [k - .425 * j + Dg, l + .12 * j + Dg],
                [k - .214 * j - Dg, l + .234 * j - Dg]
            ]).stream(i).point, e = h.translate([k - .205 * j, l + .212 * j]).clipExtent([
                [k - .214 * j + Dg, l + .166 * j + Dg],
                [k - .115 * j - Dg, l + .234 * j - Dg]
            ]).stream(i).point, a
        }, a.scale(1070)
    };
    var Ih, Jh, Kh, Lh, Mh, Nh, Oh = {
            point: v,
            lineStart: v,
            lineEnd: v,
            polygonStart: function() {
                Jh = 0, Oh.lineStart = Tb
            },
            polygonEnd: function() {
                Oh.lineStart = Oh.lineEnd = Oh.point = v, Ih += ng(Jh / 2)
            }
        },
        Ph = {
            point: Ub,
            lineStart: v,
            lineEnd: v,
            polygonStart: v,
            polygonEnd: v
        },
        Qh = {
            point: Xb,
            lineStart: Yb,
            lineEnd: Zb,
            polygonStart: function() {
                Qh.lineStart = $b
            },
            polygonEnd: function() {
                Qh.point = Xb, Qh.lineStart = Yb, Qh.lineEnd = Zb
            }
        };
    bg.geo.path = function() {
        function a(a) {
            return a && ("function" == typeof h && f.pointRadius(+h.apply(this, arguments)), g && g.valid || (g = e(f)), bg.geo.stream(a, g)), f.result()
        }

        function b() {
            return g = null, a
        }
        var c, d, e, f, g, h = 4.5;
        return a.area = function(a) {
            return Ih = 0, bg.geo.stream(a, e(Oh)), Ih
        }, a.centroid = function(a) {
            return wh = xh = yh = zh = Ah = Bh = Ch = Dh = Eh = 0, bg.geo.stream(a, e(Qh)), Eh ? [Ch / Eh, Dh / Eh] : Bh ? [zh / Bh, Ah / Bh] : yh ? [wh / yh, xh / yh] : [NaN, NaN]
        }, a.bounds = function(a) {
            return Mh = Nh = -(Kh = Lh = 1 / 0), bg.geo.stream(a, e(Ph)), [
                [Kh, Lh],
                [Mh, Nh]
            ]
        }, a.projection = function(a) {
            return arguments.length ? (e = (c = a) ? a.stream || bc(a) : s, b()) : c
        }, a.context = function(a) {
            return arguments.length ? (f = null == (d = a) ? new Vb : new _b(a), "function" != typeof h && f.pointRadius(h), b()) : d
        }, a.pointRadius = function(b) {
            return arguments.length ? (h = "function" == typeof b ? b : (f.pointRadius(+b), +b), a) : h
        }, a.projection(bg.geo.albersUsa()).context(null)
    }, bg.geo.transform = function(a) {
        return {
            stream: function(b) {
                var c = new cc(b);
                for (var d in a) c[d] = a[d];
                return c
            }
        }
    }, cc.prototype = {
        point: function(a, b) {
            this.stream.point(a, b)
        },
        sphere: function() {
            this.stream.sphere()
        },
        lineStart: function() {
            this.stream.lineStart()
        },
        lineEnd: function() {
            this.stream.lineEnd()
        },
        polygonStart: function() {
            this.stream.polygonStart()
        },
        polygonEnd: function() {
            this.stream.polygonEnd()
        }
    }, bg.geo.projection = ec, bg.geo.projectionMutator = fc, (bg.geo.equirectangular = function() {
        return ec(hc)
    }).raw = hc.invert = hc, bg.geo.rotation = function(a) {
        function b(b) {
            return b = a(b[0] * Jg, b[1] * Jg), b[0] *= Kg, b[1] *= Kg, b
        }
        return a = jc(a[0] % 360 * Jg, a[1] * Jg, a.length > 2 ? a[2] * Jg : 0), b.invert = function(b) {
            return b = a.invert(b[0] * Jg, b[1] * Jg), b[0] *= Kg, b[1] *= Kg, b
        }, b
    }, ic.invert = hc, bg.geo.circle = function() {
        function a() {
            var a = "function" == typeof d ? d.apply(this, arguments) : d,
                b = jc(-a[0] * Jg, -a[1] * Jg, 0).invert,
                e = [];
            return c(null, null, 1, {
                point: function(a, c) {
                    e.push(a = b(a, c)), a[0] *= Kg, a[1] *= Kg
                }
            }), {
                type: "Polygon",
                coordinates: [e]
            }
        }
        var b, c, d = [0, 0],
            e = 6;
        return a.origin = function(b) {
            return arguments.length ? (d = b, a) : d
        }, a.angle = function(d) {
            return arguments.length ? (c = nc((b = +d) * Jg, e * Jg), a) : b
        }, a.precision = function(d) {
            return arguments.length ? (c = nc(b * Jg, (e = +d) * Jg), a) : e
        }, a.angle(90)
    }, bg.geo.distance = function(a, b) {
        var c, d = (b[0] - a[0]) * Jg,
            e = a[1] * Jg,
            f = b[1] * Jg,
            g = Math.sin(d),
            h = Math.cos(d),
            i = Math.sin(e),
            j = Math.cos(e),
            k = Math.sin(f),
            l = Math.cos(f);
        return Math.atan2(Math.sqrt((c = l * g) * c + (c = j * k - i * l * h) * c), i * k + j * l * h)
    }, bg.geo.graticule = function() {
        function a() {
            return {
                type: "MultiLineString",
                coordinates: b()
            }
        }

        function b() {
            return bg.range(Math.ceil(f / q) * q, e, q).map(m).concat(bg.range(Math.ceil(j / r) * r, i, r).map(n)).concat(bg.range(Math.ceil(d / o) * o, c, o).filter(function(a) {
                return ng(a % q) > Dg
            }).map(k)).concat(bg.range(Math.ceil(h / p) * p, g, p).filter(function(a) {
                return ng(a % r) > Dg
            }).map(l))
        }
        var c, d, e, f, g, h, i, j, k, l, m, n, o = 10,
            p = o,
            q = 90,
            r = 360,
            s = 2.5;
        return a.lines = function() {
            return b().map(function(a) {
                return {
                    type: "LineString",
                    coordinates: a
                }
            })
        }, a.outline = function() {
            return {
                type: "Polygon",
                coordinates: [m(f).concat(n(i).slice(1), m(e).reverse().slice(1), n(j).reverse().slice(1))]
            }
        }, a.extent = function(b) {
            return arguments.length ? a.majorExtent(b).minorExtent(b) : a.minorExtent()
        }, a.majorExtent = function(b) {
            return arguments.length ? (f = +b[0][0], e = +b[1][0], j = +b[0][1], i = +b[1][1], f > e && (b = f, f = e, e = b), j > i && (b = j, j = i, i = b), a.precision(s)) : [
                [f, j],
                [e, i]
            ]
        }, a.minorExtent = function(b) {
            return arguments.length ? (d = +b[0][0], c = +b[1][0], h = +b[0][1], g = +b[1][1], d > c && (b = d, d = c, c = b), h > g && (b = h, h = g, g = b), a.precision(s)) : [
                [d, h],
                [c, g]
            ]
        }, a.step = function(b) {
            return arguments.length ? a.majorStep(b).minorStep(b) : a.minorStep()
        }, a.majorStep = function(b) {
            return arguments.length ? (q = +b[0], r = +b[1], a) : [q, r]
        }, a.minorStep = function(b) {
            return arguments.length ? (o = +b[0], p = +b[1], a) : [o, p]
        }, a.precision = function(b) {
            return arguments.length ? (s = +b, k = pc(h, g, 90), l = qc(d, c, s), m = pc(j, i, 90), n = qc(f, e, s), a) : s
        }, a.majorExtent([
            [-180, -90 + Dg],
            [180, 90 - Dg]
        ]).minorExtent([
            [-180, -80 - Dg],
            [180, 80 + Dg]
        ])
    }, bg.geo.greatArc = function() {
        function a() {
            return {
                type: "LineString",
                coordinates: [b || d.apply(this, arguments), c || e.apply(this, arguments)]
            }
        }
        var b, c, d = rc,
            e = sc;
        return a.distance = function() {
            return bg.geo.distance(b || d.apply(this, arguments), c || e.apply(this, arguments))
        }, a.source = function(c) {
            return arguments.length ? (d = c, b = "function" == typeof c ? null : c, a) : d
        }, a.target = function(b) {
            return arguments.length ? (e = b, c = "function" == typeof b ? null : b, a) : e
        }, a.precision = function() {
            return arguments.length ? a : 0
        }, a
    }, bg.geo.interpolate = function(a, b) {
        return tc(a[0] * Jg, a[1] * Jg, b[0] * Jg, b[1] * Jg)
    }, bg.geo.length = function(a) {
        return Rh = 0, bg.geo.stream(a, Sh), Rh
    };
    var Rh, Sh = {
            sphere: v,
            point: v,
            lineStart: uc,
            lineEnd: v,
            polygonStart: v,
            polygonEnd: v
        },
        Th = vc(function(a) {
            return Math.sqrt(2 / (1 + a))
        }, function(a) {
            return 2 * Math.asin(a / 2)
        });
    (bg.geo.azimuthalEqualArea = function() {
        return ec(Th)
    }).raw = Th;
    var Uh = vc(function(a) {
        var b = Math.acos(a);
        return b && b / Math.sin(b)
    }, s);
    (bg.geo.azimuthalEquidistant = function() {
        return ec(Uh)
    }).raw = Uh, (bg.geo.conicConformal = function() {
        return Rb(wc)
    }).raw = wc, (bg.geo.conicEquidistant = function() {
        return Rb(xc)
    }).raw = xc;
    var Vh = vc(function(a) {
        return 1 / a
    }, Math.atan);
    (bg.geo.gnomonic = function() {
        return ec(Vh)
    }).raw = Vh, yc.invert = function(a, b) {
        return [a, 2 * Math.atan(Math.exp(b)) - Ig]
    }, (bg.geo.mercator = function() {
        return zc(yc)
    }).raw = yc;
    var Wh = vc(function() {
        return 1
    }, Math.asin);
    (bg.geo.orthographic = function() {
        return ec(Wh)
    }).raw = Wh;
    var Xh = vc(function(a) {
        return 1 / (1 + a)
    }, function(a) {
        return 2 * Math.atan(a)
    });
    (bg.geo.stereographic = function() {
        return ec(Xh)
    }).raw = Xh, Ac.invert = function(a, b) {
        return [-b, 2 * Math.atan(Math.exp(a)) - Ig]
    }, (bg.geo.transverseMercator = function() {
        var a = zc(Ac),
            b = a.center,
            c = a.rotate;
        return a.center = function(a) {
            return a ? b([-a[1], a[0]]) : (a = b(), [a[1], -a[0]])
        }, a.rotate = function(a) {
            return a ? c([a[0], a[1], a.length > 2 ? a[2] + 90 : 90]) : (a = c(), [a[0], a[1], a[2] - 90])
        }, c([0, 0, 90])
    }).raw = Ac, bg.geom = {}, bg.geom.hull = function(a) {
        function b(a) {
            if (a.length < 3) return [];
            var b, e = Aa(c),
                f = Aa(d),
                g = a.length,
                h = [],
                i = [];
            for (b = 0; g > b; b++) h.push([+e.call(this, a[b], b), +f.call(this, a[b], b), b]);
            for (h.sort(Ec), b = 0; g > b; b++) i.push([h[b][0], -h[b][1]]);
            var j = Dc(h),
                k = Dc(i),
                l = k[0] === j[0],
                m = k[k.length - 1] === j[j.length - 1],
                n = [];
            for (b = j.length - 1; b >= 0; --b) n.push(a[h[j[b]][2]]);
            for (b = +l; b < k.length - m; ++b) n.push(a[h[k[b]][2]]);
            return n
        }
        var c = Bc,
            d = Cc;
        return arguments.length ? b(a) : (b.x = function(a) {
            return arguments.length ? (c = a, b) : c
        }, b.y = function(a) {
            return arguments.length ? (d = a, b) : d
        }, b)
    }, bg.geom.polygon = function(a) {
        return sg(a, Yh), a
    };
    var Yh = bg.geom.polygon.prototype = [];
    Yh.area = function() {
        for (var a, b = -1, c = this.length, d = this[c - 1], e = 0; ++b < c;) a = d, d = this[b], e += a[1] * d[0] - a[0] * d[1];
        return .5 * e
    }, Yh.centroid = function(a) {
        var b, c, d = -1,
            e = this.length,
            f = 0,
            g = 0,
            h = this[e - 1];
        for (arguments.length || (a = -1 / (6 * this.area())); ++d < e;) b = h, h = this[d], c = b[0] * h[1] - h[0] * b[1], f += (b[0] + h[0]) * c, g += (b[1] + h[1]) * c;
        return [f * a, g * a]
    }, Yh.clip = function(a) {
        for (var b, c, d, e, f, g, h = Hc(a), i = -1, j = this.length - Hc(this), k = this[j - 1]; ++i < j;) {
            for (b = a.slice(), a.length = 0, e = this[i], f = b[(d = b.length - h) - 1], c = -1; ++c < d;) g = b[c], Fc(g, k, e) ? (Fc(f, k, e) || a.push(Gc(f, g, k, e)), a.push(g)) : Fc(f, k, e) && a.push(Gc(f, g, k, e)), f = g;
            h && a.push(a[0]), k = e
        }
        return a
    };
    var Zh, $h, _h, ai, bi, ci = [],
        di = [];
    Pc.prototype.prepare = function() {
        for (var a, b = this.edges, c = b.length; c--;) a = b[c].edge, a.b && a.a || b.splice(c, 1);
        return b.sort(Rc), b.length
    }, _c.prototype = {
        start: function() {
            return this.edge.l === this.site ? this.edge.a : this.edge.b
        },
        end: function() {
            return this.edge.l === this.site ? this.edge.b : this.edge.a
        }
    }, ad.prototype = {
        insert: function(a, b) {
            var c, d, e;
            if (a) {
                if (b.P = a, b.N = a.N, a.N && (a.N.P = b), a.N = b, a.R) {
                    for (a = a.R; a.L;) a = a.L;
                    a.L = b
                } else a.R = b;
                c = a
            } else this._ ? (a = ed(this._), b.P = null, b.N = a, a.P = a.L = b, c = a) : (b.P = b.N = null, this._ = b, c = null);
            for (b.L = b.R = null, b.U = c, b.C = !0, a = b; c && c.C;) d = c.U, c === d.L ? (e = d.R, e && e.C ? (c.C = e.C = !1, d.C = !0, a = d) : (a === c.R && (cd(this, c), a = c, c = a.U), c.C = !1, d.C = !0, dd(this, d))) : (e = d.L, e && e.C ? (c.C = e.C = !1, d.C = !0, a = d) : (a === c.L && (dd(this, c), a = c, c = a.U), c.C = !1, d.C = !0, cd(this, d))), c = a.U;
            this._.C = !1
        },
        remove: function(a) {
            a.N && (a.N.P = a.P), a.P && (a.P.N = a.N), a.N = a.P = null;
            var b, c, d, e = a.U,
                f = a.L,
                g = a.R;
            if (c = f ? g ? ed(g) : f : g, e ? e.L === a ? e.L = c : e.R = c : this._ = c, f && g ? (d = c.C, c.C = a.C, c.L = f, f.U = c, c !== g ? (e = c.U, c.U = a.U, a = c.R, e.L = a, c.R = g, g.U = c) : (c.U = e, e = c, a = c.R)) : (d = a.C, a = c), a && (a.U = e), !d) {
                if (a && a.C) return void(a.C = !1);
                do {
                    if (a === this._) break;
                    if (a === e.L) {
                        if (b = e.R, b.C && (b.C = !1, e.C = !0, cd(this, e), b = e.R), b.L && b.L.C || b.R && b.R.C) {
                            b.R && b.R.C || (b.L.C = !1, b.C = !0, dd(this, b), b = e.R), b.C = e.C, e.C = b.R.C = !1, cd(this, e), a = this._;
                            break
                        }
                    } else if (b = e.L, b.C && (b.C = !1, e.C = !0, dd(this, e), b = e.L), b.L && b.L.C || b.R && b.R.C) {
                        b.L && b.L.C || (b.R.C = !1, b.C = !0, cd(this, b), b = e.L), b.C = e.C, e.C = b.L.C = !1, dd(this, e), a = this._;
                        break
                    }
                    b.C = !0, a = e, e = e.U
                } while (!a.C);
                a && (a.C = !1)
            }
        }
    }, bg.geom.voronoi = function(a) {
        function b(a) {
            var b = new Array(a.length),
                d = h[0][0],
                e = h[0][1],
                f = h[1][0],
                g = h[1][1];
            return fd(c(a), h).cells.forEach(function(c, h) {
                var i = c.edges,
                    j = c.site,
                    k = b[h] = i.length ? i.map(function(a) {
                        var b = a.start();
                        return [b.x, b.y]
                    }) : j.x >= d && j.x <= f && j.y >= e && j.y <= g ? [
                        [d, g],
                        [f, g],
                        [f, e],
                        [d, e]
                    ] : [];
                k.point = a[h]
            }), b
        }

        function c(a) {
            return a.map(function(a, b) {
                return {
                    x: Math.round(f(a, b) / Dg) * Dg,
                    y: Math.round(g(a, b) / Dg) * Dg,
                    i: b
                }
            })
        }
        var d = Bc,
            e = Cc,
            f = d,
            g = e,
            h = ei;
        return a ? b(a) : (b.links = function(a) {
            return fd(c(a)).edges.filter(function(a) {
                return a.l && a.r
            }).map(function(b) {
                return {
                    source: a[b.l.i],
                    target: a[b.r.i]
                }
            })
        }, b.triangles = function(a) {
            var b = [];
            return fd(c(a)).cells.forEach(function(c, d) {
                for (var e, f, g = c.site, h = c.edges.sort(Rc), i = -1, j = h.length, k = h[j - 1].edge, l = k.l === g ? k.r : k.l; ++i < j;) e = k, f = l, k = h[i].edge, l = k.l === g ? k.r : k.l, d < f.i && d < l.i && hd(g, f, l) < 0 && b.push([a[d], a[f.i], a[l.i]])
            }), b
        }, b.x = function(a) {
            return arguments.length ? (f = Aa(d = a), b) : d
        }, b.y = function(a) {
            return arguments.length ? (g = Aa(e = a), b) : e
        }, b.clipExtent = function(a) {
            return arguments.length ? (h = null == a ? ei : a, b) : h === ei ? null : h
        }, b.size = function(a) {
            return arguments.length ? b.clipExtent(a && [
                [0, 0], a
            ]) : h === ei ? null : h && h[1]
        }, b)
    };
    var ei = [
        [-1e6, -1e6],
        [1e6, 1e6]
    ];
    bg.geom.delaunay = function(a) {
        return bg.geom.voronoi().triangles(a)
    }, bg.geom.quadtree = function(a, b, c, d, e) {
        function f(a) {
            function f(a, b, c, d, e, f, g, h) {
                if (!isNaN(c) && !isNaN(d))
                    if (a.leaf) {
                        var i = a.x,
                            k = a.y;
                        if (null != i)
                            if (ng(i - c) + ng(k - d) < .01) j(a, b, c, d, e, f, g, h);
                            else {
                                var l = a.point;
                                a.x = a.y = a.point = null, j(a, l, i, k, e, f, g, h), j(a, b, c, d, e, f, g, h)
                            } else a.x = c, a.y = d, a.point = b
                    } else j(a, b, c, d, e, f, g, h)
            }

            function j(a, b, c, d, e, g, h, i) {
                var j = .5 * (e + h),
                    k = .5 * (g + i),
                    l = c >= j,
                    m = d >= k,
                    n = m << 1 | l;
                a.leaf = !1, a = a.nodes[n] || (a.nodes[n] = kd()), l ? e = j : h = j, m ? g = k : i = k, f(a, b, c, d, e, g, h, i)
            }
            var k, l, m, n, o, p, q, r, s, t = Aa(h),
                u = Aa(i);
            if (null != b) p = b, q = c, r = d, s = e;
            else if (r = s = -(p = q = 1 / 0), l = [], m = [], o = a.length, g)
                for (n = 0; o > n; ++n) k = a[n], k.x < p && (p = k.x), k.y < q && (q = k.y), k.x > r && (r = k.x), k.y > s && (s = k.y), l.push(k.x), m.push(k.y);
            else
                for (n = 0; o > n; ++n) {
                    var v = +t(k = a[n], n),
                        w = +u(k, n);
                    p > v && (p = v), q > w && (q = w), v > r && (r = v), w > s && (s = w), l.push(v), m.push(w)
                }
            var x = r - p,
                y = s - q;
            x > y ? s = q + x : r = p + y;
            var z = kd();
            if (z.add = function(a) {
                    f(z, a, +t(a, ++n), +u(a, n), p, q, r, s)
                }, z.visit = function(a) {
                    ld(a, z, p, q, r, s)
                }, z.find = function(a) {
                    return md(z, a[0], a[1], p, q, r, s)
                }, n = -1, null == b) {
                for (; ++n < o;) f(z, a[n], l[n], m[n], p, q, r, s);
                --n
            } else a.forEach(z.add);
            return l = m = a = k = null, z
        }
        var g, h = Bc,
            i = Cc;
        return (g = arguments.length) ? (h = id, i = jd, 3 === g && (e = c, d = b, c = b = 0), f(a)) : (f.x = function(a) {
            return arguments.length ? (h = a, f) : h
        }, f.y = function(a) {
            return arguments.length ? (i = a, f) : i
        }, f.extent = function(a) {
            return arguments.length ? (null == a ? b = c = d = e = null : (b = +a[0][0], c = +a[0][1], d = +a[1][0], e = +a[1][1]), f) : null == b ? null : [
                [b, c],
                [d, e]
            ]
        }, f.size = function(a) {
            return arguments.length ? (null == a ? b = c = d = e = null : (b = c = 0, d = +a[0], e = +a[1]), f) : null == b ? null : [d - b, e - c]
        }, f)
    }, bg.interpolateRgb = nd, bg.interpolateObject = od, bg.interpolateNumber = pd, bg.interpolateString = qd;
    var fi = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        gi = new RegExp(fi.source, "g");
    bg.interpolate = rd, bg.interpolators = [function(a, b) {
        var c = typeof b;
        return ("string" === c ? Zg.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? nd : qd : b instanceof ga ? nd : Array.isArray(b) ? sd : "object" === c && isNaN(b) ? od : pd)(a, b)
    }], bg.interpolateArray = sd;
    var hi = function() {
            return s
        },
        ii = bg.map({
            linear: hi,
            poly: zd,
            quad: function() {
                return wd
            },
            cubic: function() {
                return xd
            },
            sin: function() {
                return Ad
            },
            exp: function() {
                return Bd
            },
            circle: function() {
                return Cd
            },
            elastic: Dd,
            back: Ed,
            bounce: function() {
                return Fd
            }
        }),
        ji = bg.map({
            "in": s,
            out: ud,
            "in-out": vd,
            "out-in": function(a) {
                return vd(ud(a))
            }
        });
    bg.ease = function(a) {
        var b = a.indexOf("-"),
            c = b >= 0 ? a.slice(0, b) : a,
            d = b >= 0 ? a.slice(b + 1) : "in";
        return c = ii.get(c) || hi, d = ji.get(d) || s, td(d(c.apply(null, cg.call(arguments, 1))))
    }, bg.interpolateHcl = Gd, bg.interpolateHsl = Hd, bg.interpolateLab = Id, bg.interpolateRound = Jd, bg.transform = function(a) {
        var b = eg.createElementNS(bg.ns.prefix.svg, "g");
        return (bg.transform = function(a) {
            if (null != a) {
                b.setAttribute("transform", a);
                var c = b.transform.baseVal.consolidate()
            }
            return new Kd(c ? c.matrix : ki)
        })(a)
    }, Kd.prototype.toString = function() {
        return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")"
    };
    var ki = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0
    };
    bg.interpolateTransform = Od, bg.layout = {}, bg.layout.bundle = function() {
        return function(a) {
            for (var b = [], c = -1, d = a.length; ++c < d;) b.push(Rd(a[c]));
            return b
        }
    }, bg.layout.chord = function() {
        function a() {
            var a, j, l, m, n, o = {},
                p = [],
                q = bg.range(f),
                r = [];
            for (c = [], d = [], a = 0, m = -1; ++m < f;) {
                for (j = 0, n = -1; ++n < f;) j += e[m][n];
                p.push(j), r.push(bg.range(f)), a += j
            }
            for (g && q.sort(function(a, b) {
                    return g(p[a], p[b])
                }), h && r.forEach(function(a, b) {
                    a.sort(function(a, c) {
                        return h(e[b][a], e[b][c])
                    })
                }), a = (Gg - k * f) / a, j = 0, m = -1; ++m < f;) {
                for (l = j, n = -1; ++n < f;) {
                    var s = q[m],
                        t = r[s][n],
                        u = e[s][t],
                        v = j,
                        w = j += u * a;
                    o[s + "-" + t] = {
                        index: s,
                        subindex: t,
                        startAngle: v,
                        endAngle: w,
                        value: u
                    }
                }
                d[s] = {
                    index: s,
                    startAngle: l,
                    endAngle: j,
                    value: (j - l) / a
                }, j += k
            }
            for (m = -1; ++m < f;)
                for (n = m - 1; ++n < f;) {
                    var x = o[m + "-" + n],
                        y = o[n + "-" + m];
                    (x.value || y.value) && c.push(x.value < y.value ? {
                        source: y,
                        target: x
                    } : {
                        source: x,
                        target: y
                    })
                }
            i && b()
        }

        function b() {
            c.sort(function(a, b) {
                return i((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2)
            })
        }
        var c, d, e, f, g, h, i, j = {},
            k = 0;
        return j.matrix = function(a) {
            return arguments.length ? (f = (e = a) && e.length, c = d = null, j) : e
        }, j.padding = function(a) {
            return arguments.length ? (k = a, c = d = null, j) : k
        }, j.sortGroups = function(a) {
            return arguments.length ? (g = a, c = d = null, j) : g
        }, j.sortSubgroups = function(a) {
            return arguments.length ? (h = a, c = null, j) : h
        }, j.sortChords = function(a) {
            return arguments.length ? (i = a, c && b(), j) : i
        }, j.chords = function() {
            return c || a(), c
        }, j.groups = function() {
            return d || a(), d
        }, j
    }, bg.layout.force = function() {
        function a(a) {
            return function(b, c, d, e) {
                if (b.point !== a) {
                    var f = b.cx - a.x,
                        g = b.cy - a.y,
                        h = e - c,
                        i = f * f + g * g;
                    if (i > h * h / q) {
                        if (o > i) {
                            var j = b.charge / i;
                            a.px -= f * j, a.py -= g * j
                        }
                        return !0
                    }
                    if (b.point && i && o > i) {
                        var j = b.pointCharge / i;
                        a.px -= f * j, a.py -= g * j
                    }
                }
                return !b.charge
            }
        }

        function b(a) {
            a.px = bg.event.x, a.py = bg.event.y, h.resume()
        }
        var c, d, e, f, g, h = {},
            i = bg.dispatch("start", "tick", "end"),
            j = [1, 1],
            k = .9,
            l = li,
            m = mi,
            n = -30,
            o = ni,
            p = .1,
            q = .64,
            r = [],
            t = [];
        return h.tick = function() {
            if ((d *= .99) < .005) return i.end({
                type: "end",
                alpha: d = 0
            }), !0;
            var b, c, h, l, m, o, q, s, u, v = r.length,
                w = t.length;
            for (c = 0; w > c; ++c) h = t[c], l = h.source, m = h.target, s = m.x - l.x, u = m.y - l.y, (o = s * s + u * u) && (o = d * f[c] * ((o = Math.sqrt(o)) - e[c]) / o, s *= o, u *= o, m.x -= s * (q = l.weight / (m.weight + l.weight)), m.y -= u * q, l.x += s * (q = 1 - q), l.y += u * q);
            if ((q = d * p) && (s = j[0] / 2, u = j[1] / 2, c = -1, q))
                for (; ++c < v;) h = r[c], h.x += (s - h.x) * q, h.y += (u - h.y) * q;
            if (n)
                for (Yd(b = bg.geom.quadtree(r), d, g), c = -1; ++c < v;)(h = r[c]).fixed || b.visit(a(h));
            for (c = -1; ++c < v;) h = r[c], h.fixed ? (h.x = h.px, h.y = h.py) : (h.x -= (h.px - (h.px = h.x)) * k, h.y -= (h.py - (h.py = h.y)) * k);
            i.tick({
                type: "tick",
                alpha: d
            })
        }, h.nodes = function(a) {
            return arguments.length ? (r = a, h) : r
        }, h.links = function(a) {
            return arguments.length ? (t = a, h) : t
        }, h.size = function(a) {
            return arguments.length ? (j = a, h) : j
        }, h.linkDistance = function(a) {
            return arguments.length ? (l = "function" == typeof a ? a : +a, h) : l
        }, h.distance = h.linkDistance, h.linkStrength = function(a) {
            return arguments.length ? (m = "function" == typeof a ? a : +a, h) : m
        }, h.friction = function(a) {
            return arguments.length ? (k = +a, h) : k
        }, h.charge = function(a) {
            return arguments.length ? (n = "function" == typeof a ? a : +a, h) : n
        }, h.chargeDistance = function(a) {
            return arguments.length ? (o = a * a, h) : Math.sqrt(o)
        }, h.gravity = function(a) {
            return arguments.length ? (p = +a, h) : p
        }, h.theta = function(a) {
            return arguments.length ? (q = a * a, h) : Math.sqrt(q)
        }, h.alpha = function(a) {
            return arguments.length ? (a = +a, d ? d = a > 0 ? a : 0 : a > 0 && (i.start({
                type: "start",
                alpha: d = a
            }), bg.timer(h.tick)), h) : d
        }, h.start = function() {
            function a(a, d) {
                if (!c) {
                    for (c = new Array(i), h = 0; i > h; ++h) c[h] = [];
                    for (h = 0; k > h; ++h) {
                        var e = t[h];
                        c[e.source.index].push(e.target), c[e.target.index].push(e.source)
                    }
                }
                for (var f, g = c[b], h = -1, j = g.length; ++h < j;)
                    if (!isNaN(f = g[h][a])) return f;
                return Math.random() * d
            }
            var b, c, d, i = r.length,
                k = t.length,
                o = j[0],
                p = j[1];
            for (b = 0; i > b; ++b)(d = r[b]).index = b, d.weight = 0;
            for (b = 0; k > b; ++b) d = t[b], "number" == typeof d.source && (d.source = r[d.source]), "number" == typeof d.target && (d.target = r[d.target]), ++d.source.weight, ++d.target.weight;
            for (b = 0; i > b; ++b) d = r[b], isNaN(d.x) && (d.x = a("x", o)), isNaN(d.y) && (d.y = a("y", p)), isNaN(d.px) && (d.px = d.x), isNaN(d.py) && (d.py = d.y);
            if (e = [], "function" == typeof l)
                for (b = 0; k > b; ++b) e[b] = +l.call(this, t[b], b);
            else
                for (b = 0; k > b; ++b) e[b] = l;
            if (f = [], "function" == typeof m)
                for (b = 0; k > b; ++b) f[b] = +m.call(this, t[b], b);
            else
                for (b = 0; k > b; ++b) f[b] = m;
            if (g = [], "function" == typeof n)
                for (b = 0; i > b; ++b) g[b] = +n.call(this, r[b], b);
            else
                for (b = 0; i > b; ++b) g[b] = n;
            return h.resume()
        }, h.resume = function() {
            return h.alpha(.1)
        }, h.stop = function() {
            return h.alpha(0)
        }, h.drag = function() {
            return c || (c = bg.behavior.drag().origin(s).on("dragstart.force", Ud).on("drag.force", b).on("dragend.force", Vd)), arguments.length ? void this.on("mouseover.force", Wd).on("mouseout.force", Xd).call(c) : c
        }, bg.rebind(h, i, "on")
    };
    var li = 20,
        mi = 1,
        ni = 1 / 0;
    bg.layout.hierarchy = function() {
        function a(e) {
            var f, g = [e],
                h = [];
            for (e.depth = 0; null != (f = g.pop());)
                if (h.push(f), (j = c.call(a, f, f.depth)) && (i = j.length)) {
                    for (var i, j, k; --i >= 0;) g.push(k = j[i]), k.parent = f, k.depth = f.depth + 1;
                    d && (f.value = 0), f.children = j
                } else d && (f.value = +d.call(a, f, f.depth) || 0), delete f.children;
            return _d(e, function(a) {
                var c, e;
                b && (c = a.children) && c.sort(b), d && (e = a.parent) && (e.value += a.value)
            }), h
        }
        var b = ce,
            c = ae,
            d = be;
        return a.sort = function(c) {
            return arguments.length ? (b = c, a) : b
        }, a.children = function(b) {
            return arguments.length ? (c = b, a) : c
        }, a.value = function(b) {
            return arguments.length ? (d = b, a) : d
        }, a.revalue = function(b) {
            return d && ($d(b, function(a) {
                a.children && (a.value = 0)
            }), _d(b, function(b) {
                var c;
                b.children || (b.value = +d.call(a, b, b.depth) || 0), (c = b.parent) && (c.value += b.value)
            })), b
        }, a
    }, bg.layout.partition = function() {
        function a(b, c, d, e) {
            var f = b.children;
            if (b.x = c, b.y = b.depth * e, b.dx = d, b.dy = e, f && (g = f.length)) {
                var g, h, i, j = -1;
                for (d = b.value ? d / b.value : 0; ++j < g;) a(h = f[j], c, i = h.value * d, e), c += i
            }
        }

        function b(a) {
            var c = a.children,
                d = 0;
            if (c && (e = c.length))
                for (var e, f = -1; ++f < e;) d = Math.max(d, b(c[f]));
            return 1 + d
        }

        function c(c, f) {
            var g = d.call(this, c, f);
            return a(g[0], 0, e[0], e[1] / b(g[0])), g
        }
        var d = bg.layout.hierarchy(),
            e = [1, 1];
        return c.size = function(a) {
            return arguments.length ? (e = a, c) : e
        }, Zd(c, d)
    }, bg.layout.pie = function() {
        function a(g) {
            var h, i = g.length,
                j = g.map(function(c, d) {
                    return +b.call(a, c, d)
                }),
                k = +("function" == typeof d ? d.apply(this, arguments) : d),
                l = ("function" == typeof e ? e.apply(this, arguments) : e) - k,
                m = Math.min(Math.abs(l) / i, +("function" == typeof f ? f.apply(this, arguments) : f)),
                n = m * (0 > l ? -1 : 1),
                o = (l - i * n) / bg.sum(j),
                p = bg.range(i),
                q = [];
            return null != c && p.sort(c === oi ? function(a, b) {
                return j[b] - j[a]
            } : function(a, b) {
                return c(g[a], g[b])
            }), p.forEach(function(a) {
                q[a] = {
                    data: g[a],
                    value: h = j[a],
                    startAngle: k,
                    endAngle: k += h * o + n,
                    padAngle: m
                }
            }), q
        }
        var b = Number,
            c = oi,
            d = 0,
            e = Gg,
            f = 0;
        return a.value = function(c) {
            return arguments.length ? (b = c, a) : b
        }, a.sort = function(b) {
            return arguments.length ? (c = b, a) : c
        }, a.startAngle = function(b) {
            return arguments.length ? (d = b, a) : d
        }, a.endAngle = function(b) {
            return arguments.length ? (e = b, a) : e
        }, a.padAngle = function(b) {
            return arguments.length ? (f = b, a) : f
        }, a
    };
    var oi = {};
    bg.layout.stack = function() {
        function a(h, i) {
            if (!(m = h.length)) return h;
            var j = h.map(function(c, d) {
                    return b.call(a, c, d)
                }),
                k = j.map(function(b) {
                    return b.map(function(b, c) {
                        return [f.call(a, b, c), g.call(a, b, c)]
                    })
                }),
                l = c.call(a, k, i);
            j = bg.permute(j, l), k = bg.permute(k, l);
            var m, n, o, p, q = d.call(a, k, i),
                r = j[0].length;
            for (o = 0; r > o; ++o)
                for (e.call(a, j[0][o], p = q[o], k[0][o][1]), n = 1; m > n; ++n) e.call(a, j[n][o], p += k[n - 1][o][1], k[n][o][1]);
            return h
        }
        var b = s,
            c = he,
            d = ie,
            e = ge,
            f = ee,
            g = fe;
        return a.values = function(c) {
            return arguments.length ? (b = c, a) : b
        }, a.order = function(b) {
            return arguments.length ? (c = "function" == typeof b ? b : pi.get(b) || he, a) : c
        }, a.offset = function(b) {
            return arguments.length ? (d = "function" == typeof b ? b : qi.get(b) || ie, a) : d
        }, a.x = function(b) {
            return arguments.length ? (f = b, a) : f
        }, a.y = function(b) {
            return arguments.length ? (g = b, a) : g
        }, a.out = function(b) {
            return arguments.length ? (e = b, a) : e
        }, a
    };
    var pi = bg.map({
            "inside-out": function(a) {
                var b, c, d = a.length,
                    e = a.map(je),
                    f = a.map(ke),
                    g = bg.range(d).sort(function(a, b) {
                        return e[a] - e[b]
                    }),
                    h = 0,
                    i = 0,
                    j = [],
                    k = [];
                for (b = 0; d > b; ++b) c = g[b], i > h ? (h += f[c], j.push(c)) : (i += f[c], k.push(c));
                return k.reverse().concat(j)
            },
            reverse: function(a) {
                return bg.range(a.length).reverse()
            },
            "default": he
        }),
        qi = bg.map({
            silhouette: function(a) {
                var b, c, d, e = a.length,
                    f = a[0].length,
                    g = [],
                    h = 0,
                    i = [];
                for (c = 0; f > c; ++c) {
                    for (b = 0, d = 0; e > b; b++) d += a[b][c][1];
                    d > h && (h = d), g.push(d)
                }
                for (c = 0; f > c; ++c) i[c] = (h - g[c]) / 2;
                return i
            },
            wiggle: function(a) {
                var b, c, d, e, f, g, h, i, j, k = a.length,
                    l = a[0],
                    m = l.length,
                    n = [];
                for (n[0] = i = j = 0, c = 1; m > c; ++c) {
                    for (b = 0, e = 0; k > b; ++b) e += a[b][c][1];
                    for (b = 0, f = 0, h = l[c][0] - l[c - 1][0]; k > b; ++b) {
                        for (d = 0, g = (a[b][c][1] - a[b][c - 1][1]) / (2 * h); b > d; ++d) g += (a[d][c][1] - a[d][c - 1][1]) / h;
                        f += g * a[b][c][1]
                    }
                    n[c] = i -= e ? f / e * h : 0, j > i && (j = i)
                }
                for (c = 0; m > c; ++c) n[c] -= j;
                return n
            },
            expand: function(a) {
                var b, c, d, e = a.length,
                    f = a[0].length,
                    g = 1 / e,
                    h = [];
                for (c = 0; f > c; ++c) {
                    for (b = 0, d = 0; e > b; b++) d += a[b][c][1];
                    if (d)
                        for (b = 0; e > b; b++) a[b][c][1] /= d;
                    else
                        for (b = 0; e > b; b++) a[b][c][1] = g
                }
                for (c = 0; f > c; ++c) h[c] = 0;
                return h
            },
            zero: ie
        });
    bg.layout.histogram = function() {
        function a(a, f) {
            for (var g, h, i = [], j = a.map(c, this), k = d.call(this, j, f), l = e.call(this, k, j, f), f = -1, m = j.length, n = l.length - 1, o = b ? 1 : 1 / m; ++f < n;) g = i[f] = [], g.dx = l[f + 1] - (g.x = l[f]), g.y = 0;
            if (n > 0)
                for (f = -1; ++f < m;) h = j[f], h >= k[0] && h <= k[1] && (g = i[bg.bisect(l, h, 1, n) - 1], g.y += o, g.push(a[f]));
            return i
        }
        var b = !0,
            c = Number,
            d = oe,
            e = me;
        return a.value = function(b) {
            return arguments.length ? (c = b, a) : c
        }, a.range = function(b) {
            return arguments.length ? (d = Aa(b), a) : d
        }, a.bins = function(b) {
            return arguments.length ? (e = "number" == typeof b ? function(a) {
                return ne(a, b)
            } : Aa(b), a) : e
        }, a.frequency = function(c) {
            return arguments.length ? (b = !!c, a) : b
        }, a
    }, bg.layout.pack = function() {
        function a(a, f) {
            var g = c.call(this, a, f),
                h = g[0],
                i = e[0],
                j = e[1],
                k = null == b ? Math.sqrt : "function" == typeof b ? b : function() {
                    return b
                };
            if (h.x = h.y = 0, _d(h, function(a) {
                    a.r = +k(a.value)
                }), _d(h, te), d) {
                var l = d * (b ? 1 : Math.max(2 * h.r / i, 2 * h.r / j)) / 2;
                _d(h, function(a) {
                    a.r += l
                }), _d(h, te), _d(h, function(a) {
                    a.r -= l
                })
            }
            return we(h, i / 2, j / 2, b ? 1 : 1 / Math.max(2 * h.r / i, 2 * h.r / j)), g
        }
        var b, c = bg.layout.hierarchy().sort(pe),
            d = 0,
            e = [1, 1];
        return a.size = function(b) {
            return arguments.length ? (e = b, a) : e
        }, a.radius = function(c) {
            return arguments.length ? (b = null == c || "function" == typeof c ? c : +c, a) : b
        }, a.padding = function(b) {
            return arguments.length ? (d = +b, a) : d
        }, Zd(a, c)
    }, bg.layout.tree = function() {
        function a(a, e) {
            var k = g.call(this, a, e),
                l = k[0],
                m = b(l);
            if (_d(m, c), m.parent.m = -m.z, $d(m, d), j) $d(l, f);
            else {
                var n = l,
                    o = l,
                    p = l;
                $d(l, function(a) {
                    a.x < n.x && (n = a), a.x > o.x && (o = a), a.depth > p.depth && (p = a)
                });
                var q = h(n, o) / 2 - n.x,
                    r = i[0] / (o.x + h(o, n) / 2 + q),
                    s = i[1] / (p.depth || 1);
                $d(l, function(a) {
                    a.x = (a.x + q) * r, a.y = a.depth * s
                })
            }
            return k
        }

        function b(a) {
            for (var b, c = {
                    A: null,
                    children: [a]
                }, d = [c]; null != (b = d.pop());)
                for (var e, f = b.children, g = 0, h = f.length; h > g; ++g) d.push((f[g] = e = {
                    _: f[g],
                    parent: b,
                    children: (e = f[g].children) && e.slice() || [],
                    A: null,
                    a: null,
                    z: 0,
                    m: 0,
                    c: 0,
                    s: 0,
                    t: null,
                    i: g
                }).a = e);
            return c.children[0]
        }

        function c(a) {
            var b = a.children,
                c = a.parent.children,
                d = a.i ? c[a.i - 1] : null;
            if (b.length) {
                Ce(a);
                var f = (b[0].z + b[b.length - 1].z) / 2;
                d ? (a.z = d.z + h(a._, d._), a.m = a.z - f) : a.z = f
            } else d && (a.z = d.z + h(a._, d._));
            a.parent.A = e(a, d, a.parent.A || c[0])
        }

        function d(a) {
            a._.x = a.z + a.parent.m, a.m += a.parent.m
        }

        function e(a, b, c) {
            if (b) {
                for (var d, e = a, f = a, g = b, i = e.parent.children[0], j = e.m, k = f.m, l = g.m, m = i.m; g = Ae(g), e = ze(e), g && e;) i = ze(i), f = Ae(f), f.a = a, d = g.z + l - e.z - j + h(g._, e._), d > 0 && (Be(De(g, a, c), a, d), j += d, k += d), l += g.m, j += e.m, m += i.m, k += f.m;
                g && !Ae(f) && (f.t = g, f.m += l - k), e && !ze(i) && (i.t = e, i.m += j - m, c = a)
            }
            return c
        }

        function f(a) {
            a.x *= i[0], a.y = a.depth * i[1]
        }
        var g = bg.layout.hierarchy().sort(null).value(null),
            h = ye,
            i = [1, 1],
            j = null;
        return a.separation = function(b) {
            return arguments.length ? (h = b, a) : h
        }, a.size = function(b) {
            return arguments.length ? (j = null == (i = b) ? f : null, a) : j ? null : i
        }, a.nodeSize = function(b) {
            return arguments.length ? (j = null == (i = b) ? null : f, a) : j ? i : null
        }, Zd(a, g)
    }, bg.layout.cluster = function() {
        function a(a, f) {
            var g, h = b.call(this, a, f),
                i = h[0],
                j = 0;
            _d(i, function(a) {
                var b = a.children;
                b && b.length ? (a.x = Fe(b), a.y = Ee(b)) : (a.x = g ? j += c(a, g) : 0, a.y = 0, g = a)
            });
            var k = Ge(i),
                l = He(i),
                m = k.x - c(k, l) / 2,
                n = l.x + c(l, k) / 2;
            return _d(i, e ? function(a) {
                a.x = (a.x - i.x) * d[0], a.y = (i.y - a.y) * d[1]
            } : function(a) {
                a.x = (a.x - m) / (n - m) * d[0], a.y = (1 - (i.y ? a.y / i.y : 1)) * d[1]
            }), h
        }
        var b = bg.layout.hierarchy().sort(null).value(null),
            c = ye,
            d = [1, 1],
            e = !1;
        return a.separation = function(b) {
            return arguments.length ? (c = b, a) : c
        }, a.size = function(b) {
            return arguments.length ? (e = null == (d = b), a) : e ? null : d
        }, a.nodeSize = function(b) {
            return arguments.length ? (e = null != (d = b),
                a) : e ? d : null
        }, Zd(a, b)
    }, bg.layout.treemap = function() {
        function a(a, b) {
            for (var c, d, e = -1, f = a.length; ++e < f;) d = (c = a[e]).value * (0 > b ? 0 : b), c.area = isNaN(d) || 0 >= d ? 0 : d
        }

        function b(c) {
            var f = c.children;
            if (f && f.length) {
                var g, h, i, j = l(c),
                    k = [],
                    m = f.slice(),
                    o = 1 / 0,
                    p = "slice" === n ? j.dx : "dice" === n ? j.dy : "slice-dice" === n ? 1 & c.depth ? j.dy : j.dx : Math.min(j.dx, j.dy);
                for (a(m, j.dx * j.dy / c.value), k.area = 0;
                    (i = m.length) > 0;) k.push(g = m[i - 1]), k.area += g.area, "squarify" !== n || (h = d(k, p)) <= o ? (m.pop(), o = h) : (k.area -= k.pop().area, e(k, p, j, !1), p = Math.min(j.dx, j.dy), k.length = k.area = 0, o = 1 / 0);
                k.length && (e(k, p, j, !0), k.length = k.area = 0), f.forEach(b)
            }
        }

        function c(b) {
            var d = b.children;
            if (d && d.length) {
                var f, g = l(b),
                    h = d.slice(),
                    i = [];
                for (a(h, g.dx * g.dy / b.value), i.area = 0; f = h.pop();) i.push(f), i.area += f.area, null != f.z && (e(i, f.z ? g.dx : g.dy, g, !h.length), i.length = i.area = 0);
                d.forEach(c)
            }
        }

        function d(a, b) {
            for (var c, d = a.area, e = 0, f = 1 / 0, g = -1, h = a.length; ++g < h;)(c = a[g].area) && (f > c && (f = c), c > e && (e = c));
            return d *= d, b *= b, d ? Math.max(b * e * o / d, d / (b * f * o)) : 1 / 0
        }

        function e(a, b, c, d) {
            var e, f = -1,
                g = a.length,
                h = c.x,
                j = c.y,
                k = b ? i(a.area / b) : 0;
            if (b == c.dx) {
                for ((d || k > c.dy) && (k = c.dy); ++f < g;) e = a[f], e.x = h, e.y = j, e.dy = k, h += e.dx = Math.min(c.x + c.dx - h, k ? i(e.area / k) : 0);
                e.z = !0, e.dx += c.x + c.dx - h, c.y += k, c.dy -= k
            } else {
                for ((d || k > c.dx) && (k = c.dx); ++f < g;) e = a[f], e.x = h, e.y = j, e.dx = k, j += e.dy = Math.min(c.y + c.dy - j, k ? i(e.area / k) : 0);
                e.z = !1, e.dy += c.y + c.dy - j, c.x += k, c.dx -= k
            }
        }

        function f(d) {
            var e = g || h(d),
                f = e[0];
            return f.x = 0, f.y = 0, f.dx = j[0], f.dy = j[1], g && h.revalue(f), a([f], f.dx * f.dy / f.value), (g ? c : b)(f), m && (g = e), e
        }
        var g, h = bg.layout.hierarchy(),
            i = Math.round,
            j = [1, 1],
            k = null,
            l = Ie,
            m = !1,
            n = "squarify",
            o = .5 * (1 + Math.sqrt(5));
        return f.size = function(a) {
            return arguments.length ? (j = a, f) : j
        }, f.padding = function(a) {
            function b(b) {
                var c = a.call(f, b, b.depth);
                return null == c ? Ie(b) : Je(b, "number" == typeof c ? [c, c, c, c] : c)
            }

            function c(b) {
                return Je(b, a)
            }
            if (!arguments.length) return k;
            var d;
            return l = null == (k = a) ? Ie : "function" == (d = typeof a) ? b : "number" === d ? (a = [a, a, a, a], c) : c, f
        }, f.round = function(a) {
            return arguments.length ? (i = a ? Math.round : Number, f) : i != Number
        }, f.sticky = function(a) {
            return arguments.length ? (m = a, g = null, f) : m
        }, f.ratio = function(a) {
            return arguments.length ? (o = a, f) : o
        }, f.mode = function(a) {
            return arguments.length ? (n = a + "", f) : n
        }, Zd(f, h)
    }, bg.random = {
        normal: function(a, b) {
            var c = arguments.length;
            return 2 > c && (b = 1), 1 > c && (a = 0),
                function() {
                    var c, d, e;
                    do c = 2 * Math.random() - 1, d = 2 * Math.random() - 1, e = c * c + d * d; while (!e || e > 1);
                    return a + b * c * Math.sqrt(-2 * Math.log(e) / e)
                }
        },
        logNormal: function() {
            var a = bg.random.normal.apply(bg, arguments);
            return function() {
                return Math.exp(a())
            }
        },
        bates: function(a) {
            var b = bg.random.irwinHall(a);
            return function() {
                return b() / a
            }
        },
        irwinHall: function(a) {
            return function() {
                for (var b = 0, c = 0; a > c; c++) b += Math.random();
                return b
            }
        }
    }, bg.scale = {};
    var ri = {
        floor: s,
        ceil: s
    };
    bg.scale.linear = function() {
        return Qe([0, 1], [0, 1], rd, !1)
    };
    var si = {
        s: 1,
        g: 1,
        p: 1,
        r: 1,
        e: 1
    };
    bg.scale.log = function() {
        return Ye(bg.scale.linear().domain([0, 1]), 10, !0, [1, 10])
    };
    var ti = bg.format(".0e"),
        ui = {
            floor: function(a) {
                return -Math.ceil(-a)
            },
            ceil: function(a) {
                return -Math.floor(-a)
            }
        };
    bg.scale.pow = function() {
        return Ze(bg.scale.linear(), 1, [0, 1])
    }, bg.scale.sqrt = function() {
        return bg.scale.pow().exponent(.5)
    }, bg.scale.ordinal = function() {
        return _e([], {
            t: "range",
            a: [
                []
            ]
        })
    }, bg.scale.category10 = function() {
        return bg.scale.ordinal().range(vi)
    }, bg.scale.category20 = function() {
        return bg.scale.ordinal().range(wi)
    }, bg.scale.category20b = function() {
        return bg.scale.ordinal().range(xi)
    }, bg.scale.category20c = function() {
        return bg.scale.ordinal().range(yi)
    };
    var vi = [2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175].map(ta),
        wi = [2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725].map(ta),
        xi = [3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654].map(ta),
        yi = [3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081].map(ta);
    bg.scale.quantile = function() {
        return af([], [])
    }, bg.scale.quantize = function() {
        return bf(0, 1, [0, 1])
    }, bg.scale.threshold = function() {
        return cf([.5], [0, 1])
    }, bg.scale.identity = function() {
        return df([0, 1])
    }, bg.svg = {}, bg.svg.arc = function() {
        function a() {
            var a = Math.max(0, +c.apply(this, arguments)),
                j = Math.max(0, +d.apply(this, arguments)),
                k = g.apply(this, arguments) - Ig,
                l = h.apply(this, arguments) - Ig,
                m = Math.abs(l - k),
                n = k > l ? 0 : 1;
            if (a > j && (o = j, j = a, a = o), m >= Hg) return b(j, n) + (a ? b(a, 1 - n) : "") + "Z";
            var o, p, q, r, s, t, u, v, w, x, y, z, A = 0,
                B = 0,
                C = [];
            if ((r = (+i.apply(this, arguments) || 0) / 2) && (q = f === zi ? Math.sqrt(a * a + j * j) : +f.apply(this, arguments), n || (B *= -1), j && (B = ba(q / j * Math.sin(r))), a && (A = ba(q / a * Math.sin(r)))), j) {
                s = j * Math.cos(k + B), t = j * Math.sin(k + B), u = j * Math.cos(l - B), v = j * Math.sin(l - B);
                var D = Math.abs(l - k - 2 * B) <= Fg ? 0 : 1;
                if (B && lf(s, t, u, v) === n ^ D) {
                    var E = (k + l) / 2;
                    s = j * Math.cos(E), t = j * Math.sin(E), u = v = null
                }
            } else s = t = 0;
            if (a) {
                w = a * Math.cos(l - A), x = a * Math.sin(l - A), y = a * Math.cos(k + A), z = a * Math.sin(k + A);
                var F = Math.abs(k - l + 2 * A) <= Fg ? 0 : 1;
                if (A && lf(w, x, y, z) === 1 - n ^ F) {
                    var G = (k + l) / 2;
                    w = a * Math.cos(G), x = a * Math.sin(G), y = z = null
                }
            } else w = x = 0;
            if ((o = Math.min(Math.abs(j - a) / 2, +e.apply(this, arguments))) > .001) {
                p = j > a ^ n ? 0 : 1;
                var H = null == y ? [w, x] : null == u ? [s, t] : Gc([s, t], [y, z], [u, v], [w, x]),
                    I = s - H[0],
                    J = t - H[1],
                    K = u - H[0],
                    L = v - H[1],
                    M = 1 / Math.sin(Math.acos((I * K + J * L) / (Math.sqrt(I * I + J * J) * Math.sqrt(K * K + L * L))) / 2),
                    N = Math.sqrt(H[0] * H[0] + H[1] * H[1]);
                if (null != u) {
                    var O = Math.min(o, (j - N) / (M + 1)),
                        P = mf(null == y ? [w, x] : [y, z], [s, t], j, O, n),
                        Q = mf([u, v], [w, x], j, O, n);
                    o === O ? C.push("M", P[0], "A", O, ",", O, " 0 0,", p, " ", P[1], "A", j, ",", j, " 0 ", 1 - n ^ lf(P[1][0], P[1][1], Q[1][0], Q[1][1]), ",", n, " ", Q[1], "A", O, ",", O, " 0 0,", p, " ", Q[0]) : C.push("M", P[0], "A", O, ",", O, " 0 1,", p, " ", Q[0])
                } else C.push("M", s, ",", t);
                if (null != y) {
                    var R = Math.min(o, (a - N) / (M - 1)),
                        S = mf([s, t], [y, z], a, -R, n),
                        T = mf([w, x], null == u ? [s, t] : [u, v], a, -R, n);
                    o === R ? C.push("L", T[0], "A", R, ",", R, " 0 0,", p, " ", T[1], "A", a, ",", a, " 0 ", n ^ lf(T[1][0], T[1][1], S[1][0], S[1][1]), ",", 1 - n, " ", S[1], "A", R, ",", R, " 0 0,", p, " ", S[0]) : C.push("L", T[0], "A", R, ",", R, " 0 0,", p, " ", S[0])
                } else C.push("L", w, ",", x)
            } else C.push("M", s, ",", t), null != u && C.push("A", j, ",", j, " 0 ", D, ",", n, " ", u, ",", v), C.push("L", w, ",", x), null != y && C.push("A", a, ",", a, " 0 ", F, ",", 1 - n, " ", y, ",", z);
            return C.push("Z"), C.join("")
        }

        function b(a, b) {
            return "M0," + a + "A" + a + "," + a + " 0 1," + b + " 0," + -a + "A" + a + "," + a + " 0 1," + b + " 0," + a
        }
        var c = ff,
            d = gf,
            e = ef,
            f = zi,
            g = hf,
            h = jf,
            i = kf;
        return a.innerRadius = function(b) {
            return arguments.length ? (c = Aa(b), a) : c
        }, a.outerRadius = function(b) {
            return arguments.length ? (d = Aa(b), a) : d
        }, a.cornerRadius = function(b) {
            return arguments.length ? (e = Aa(b), a) : e
        }, a.padRadius = function(b) {
            return arguments.length ? (f = b == zi ? zi : Aa(b), a) : f
        }, a.startAngle = function(b) {
            return arguments.length ? (g = Aa(b), a) : g
        }, a.endAngle = function(b) {
            return arguments.length ? (h = Aa(b), a) : h
        }, a.padAngle = function(b) {
            return arguments.length ? (i = Aa(b), a) : i
        }, a.centroid = function() {
            var a = (+c.apply(this, arguments) + +d.apply(this, arguments)) / 2,
                b = (+g.apply(this, arguments) + +h.apply(this, arguments)) / 2 - Ig;
            return [Math.cos(b) * a, Math.sin(b) * a]
        }, a
    };
    var zi = "auto";
    bg.svg.line = function() {
        return nf(s)
    };
    var Ai = bg.map({
        linear: of,
        "linear-closed": pf,
        step: qf,
        "step-before": rf,
        "step-after": sf,
        basis: yf,
        "basis-open": zf,
        "basis-closed": Af,
        bundle: Bf,
        cardinal: vf,
        "cardinal-open": tf,
        "cardinal-closed": uf,
        monotone: Hf
    });
    Ai.forEach(function(a, b) {
        b.key = a, b.closed = /-closed$/.test(a)
    });
    var Bi = [0, 2 / 3, 1 / 3, 0],
        Ci = [0, 1 / 3, 2 / 3, 0],
        Di = [0, 1 / 6, 2 / 3, 1 / 6];
    bg.svg.line.radial = function() {
        var a = nf(If);
        return a.radius = a.x, delete a.x, a.angle = a.y, delete a.y, a
    }, rf.reverse = sf, sf.reverse = rf, bg.svg.area = function() {
        return Jf(s)
    }, bg.svg.area.radial = function() {
        var a = Jf(If);
        return a.radius = a.x, delete a.x, a.innerRadius = a.x0, delete a.x0, a.outerRadius = a.x1, delete a.x1, a.angle = a.y, delete a.y, a.startAngle = a.y0, delete a.y0, a.endAngle = a.y1, delete a.y1, a
    }, bg.svg.chord = function() {
        function a(a, h) {
            var i = b(this, f, a, h),
                j = b(this, g, a, h);
            return "M" + i.p0 + d(i.r, i.p1, i.a1 - i.a0) + (c(i, j) ? e(i.r, i.p1, i.r, i.p0) : e(i.r, i.p1, j.r, j.p0) + d(j.r, j.p1, j.a1 - j.a0) + e(j.r, j.p1, i.r, i.p0)) + "Z"
        }

        function b(a, b, c, d) {
            var e = b.call(a, c, d),
                f = h.call(a, e, d),
                g = i.call(a, e, d) - Ig,
                k = j.call(a, e, d) - Ig;
            return {
                r: f,
                a0: g,
                a1: k,
                p0: [f * Math.cos(g), f * Math.sin(g)],
                p1: [f * Math.cos(k), f * Math.sin(k)]
            }
        }

        function c(a, b) {
            return a.a0 == b.a0 && a.a1 == b.a1
        }

        function d(a, b, c) {
            return "A" + a + "," + a + " 0 " + +(c > Fg) + ",1 " + b
        }

        function e(a, b, c, d) {
            return "Q 0,0 " + d
        }
        var f = rc,
            g = sc,
            h = Kf,
            i = hf,
            j = jf;
        return a.radius = function(b) {
            return arguments.length ? (h = Aa(b), a) : h
        }, a.source = function(b) {
            return arguments.length ? (f = Aa(b), a) : f
        }, a.target = function(b) {
            return arguments.length ? (g = Aa(b), a) : g
        }, a.startAngle = function(b) {
            return arguments.length ? (i = Aa(b), a) : i
        }, a.endAngle = function(b) {
            return arguments.length ? (j = Aa(b), a) : j
        }, a
    }, bg.svg.diagonal = function() {
        function a(a, e) {
            var f = b.call(this, a, e),
                g = c.call(this, a, e),
                h = (f.y + g.y) / 2,
                i = [f, {
                    x: f.x,
                    y: h
                }, {
                    x: g.x,
                    y: h
                }, g];
            return i = i.map(d), "M" + i[0] + "C" + i[1] + " " + i[2] + " " + i[3]
        }
        var b = rc,
            c = sc,
            d = Lf;
        return a.source = function(c) {
            return arguments.length ? (b = Aa(c), a) : b
        }, a.target = function(b) {
            return arguments.length ? (c = Aa(b), a) : c
        }, a.projection = function(b) {
            return arguments.length ? (d = b, a) : d
        }, a
    }, bg.svg.diagonal.radial = function() {
        var a = bg.svg.diagonal(),
            b = Lf,
            c = a.projection;
        return a.projection = function(a) {
            return arguments.length ? c(Mf(b = a)) : b
        }, a
    }, bg.svg.symbol = function() {
        function a(a, d) {
            return (Ei.get(b.call(this, a, d)) || Pf)(c.call(this, a, d))
        }
        var b = Of,
            c = Nf;
        return a.type = function(c) {
            return arguments.length ? (b = Aa(c), a) : b
        }, a.size = function(b) {
            return arguments.length ? (c = Aa(b), a) : c
        }, a
    };
    var Ei = bg.map({
        circle: Pf,
        cross: function(a) {
            var b = Math.sqrt(a / 5) / 2;
            return "M" + -3 * b + "," + -b + "H" + -b + "V" + -3 * b + "H" + b + "V" + -b + "H" + 3 * b + "V" + b + "H" + b + "V" + 3 * b + "H" + -b + "V" + b + "H" + -3 * b + "Z"
        },
        diamond: function(a) {
            var b = Math.sqrt(a / (2 * Gi)),
                c = b * Gi;
            return "M0," + -b + "L" + c + ",0 0," + b + " " + -c + ",0Z"
        },
        square: function(a) {
            var b = Math.sqrt(a) / 2;
            return "M" + -b + "," + -b + "L" + b + "," + -b + " " + b + "," + b + " " + -b + "," + b + "Z"
        },
        "triangle-down": function(a) {
            var b = Math.sqrt(a / Fi),
                c = b * Fi / 2;
            return "M0," + c + "L" + b + "," + -c + " " + -b + "," + -c + "Z"
        },
        "triangle-up": function(a) {
            var b = Math.sqrt(a / Fi),
                c = b * Fi / 2;
            return "M0," + -c + "L" + b + "," + c + " " + -b + "," + c + "Z"
        }
    });
    bg.svg.symbolTypes = Ei.keys();
    var Fi = Math.sqrt(3),
        Gi = Math.tan(30 * Jg);
    wg.transition = function(a) {
        for (var b, c, d = Hi || ++Li, e = Uf(a), f = [], g = Ii || {
                time: Date.now(),
                ease: yd,
                delay: 0,
                duration: 250
            }, h = -1, i = this.length; ++h < i;) {
            f.push(b = []);
            for (var j = this[h], k = -1, l = j.length; ++k < l;)(c = j[k]) && Vf(c, k, e, d, g), b.push(c)
        }
        return Rf(f, e, d)
    }, wg.interrupt = function(a) {
        return this.each(null == a ? Ji : Qf(Uf(a)))
    };
    var Hi, Ii, Ji = Qf(Uf()),
        Ki = [],
        Li = 0;
    Ki.call = wg.call, Ki.empty = wg.empty, Ki.node = wg.node, Ki.size = wg.size, bg.transition = function(a, b) {
        return a && a.transition ? Hi ? a.transition(b) : a : bg.selection().transition(a)
    }, bg.transition.prototype = Ki, Ki.select = function(a) {
        var b, c, d, e = this.id,
            f = this.namespace,
            g = [];
        a = C(a);
        for (var h = -1, i = this.length; ++h < i;) {
            g.push(b = []);
            for (var j = this[h], k = -1, l = j.length; ++k < l;)(d = j[k]) && (c = a.call(d, d.__data__, k, h)) ? ("__data__" in d && (c.__data__ = d.__data__), Vf(c, k, f, e, d[f][e]), b.push(c)) : b.push(null)
        }
        return Rf(g, f, e)
    }, Ki.selectAll = function(a) {
        var b, c, d, e, f, g = this.id,
            h = this.namespace,
            i = [];
        a = D(a);
        for (var j = -1, k = this.length; ++j < k;)
            for (var l = this[j], m = -1, n = l.length; ++m < n;)
                if (d = l[m]) {
                    f = d[h][g], c = a.call(d, d.__data__, m, j), i.push(b = []);
                    for (var o = -1, p = c.length; ++o < p;)(e = c[o]) && Vf(e, o, h, g, f), b.push(e)
                }
        return Rf(i, h, g)
    }, Ki.filter = function(a) {
        var b, c, d, e = [];
        "function" != typeof a && (a = P(a));
        for (var f = 0, g = this.length; g > f; f++) {
            e.push(b = []);
            for (var c = this[f], h = 0, i = c.length; i > h; h++)(d = c[h]) && a.call(d, d.__data__, h, f) && b.push(d)
        }
        return Rf(e, this.namespace, this.id)
    }, Ki.tween = function(a, b) {
        var c = this.id,
            d = this.namespace;
        return arguments.length < 2 ? this.node()[d][c].tween.get(a) : R(this, null == b ? function(b) {
            b[d][c].tween.remove(a)
        } : function(e) {
            e[d][c].tween.set(a, b)
        })
    }, Ki.attr = function(a, b) {
        function c() {
            this.removeAttribute(h)
        }

        function d() {
            this.removeAttributeNS(h.space, h.local)
        }

        function e(a) {
            return null == a ? c : (a += "", function() {
                var b, c = this.getAttribute(h);
                return c !== a && (b = g(c, a), function(a) {
                    this.setAttribute(h, b(a))
                })
            })
        }

        function f(a) {
            return null == a ? d : (a += "", function() {
                var b, c = this.getAttributeNS(h.space, h.local);
                return c !== a && (b = g(c, a), function(a) {
                    this.setAttributeNS(h.space, h.local, b(a))
                })
            })
        }
        if (arguments.length < 2) {
            for (b in a) this.attr(b, a[b]);
            return this
        }
        var g = "transform" == a ? Od : rd,
            h = bg.ns.qualify(a);
        return Sf(this, "attr." + a, b, h.local ? f : e)
    }, Ki.attrTween = function(a, b) {
        function c(a, c) {
            var d = b.call(this, a, c, this.getAttribute(e));
            return d && function(a) {
                this.setAttribute(e, d(a))
            }
        }

        function d(a, c) {
            var d = b.call(this, a, c, this.getAttributeNS(e.space, e.local));
            return d && function(a) {
                this.setAttributeNS(e.space, e.local, d(a))
            }
        }
        var e = bg.ns.qualify(a);
        return this.tween("attr." + a, e.local ? d : c)
    }, Ki.style = function(a, c, d) {
        function e() {
            this.style.removeProperty(a)
        }

        function f(c) {
            return null == c ? e : (c += "", function() {
                var e, f = b(this).getComputedStyle(this, null).getPropertyValue(a);
                return f !== c && (e = rd(f, c), function(b) {
                    this.style.setProperty(a, e(b), d)
                })
            })
        }
        var g = arguments.length;
        if (3 > g) {
            if ("string" != typeof a) {
                2 > g && (c = "");
                for (d in a) this.style(d, a[d], c);
                return this
            }
            d = ""
        }
        return Sf(this, "style." + a, c, f)
    }, Ki.styleTween = function(a, c, d) {
        function e(e, f) {
            var g = c.call(this, e, f, b(this).getComputedStyle(this, null).getPropertyValue(a));
            return g && function(b) {
                this.style.setProperty(a, g(b), d)
            }
        }
        return arguments.length < 3 && (d = ""), this.tween("style." + a, e)
    }, Ki.text = function(a) {
        return Sf(this, "text", a, Tf)
    }, Ki.remove = function() {
        var a = this.namespace;
        return this.each("end.transition", function() {
            var b;
            this[a].count < 2 && (b = this.parentNode) && b.removeChild(this)
        })
    }, Ki.ease = function(a) {
        var b = this.id,
            c = this.namespace;
        return arguments.length < 1 ? this.node()[c][b].ease : ("function" != typeof a && (a = bg.ease.apply(bg, arguments)), R(this, function(d) {
            d[c][b].ease = a
        }))
    }, Ki.delay = function(a) {
        var b = this.id,
            c = this.namespace;
        return arguments.length < 1 ? this.node()[c][b].delay : R(this, "function" == typeof a ? function(d, e, f) {
            d[c][b].delay = +a.call(d, d.__data__, e, f)
        } : (a = +a, function(d) {
            d[c][b].delay = a
        }))
    }, Ki.duration = function(a) {
        var b = this.id,
            c = this.namespace;
        return arguments.length < 1 ? this.node()[c][b].duration : R(this, "function" == typeof a ? function(d, e, f) {
            d[c][b].duration = Math.max(1, a.call(d, d.__data__, e, f))
        } : (a = Math.max(1, a), function(d) {
            d[c][b].duration = a
        }))
    }, Ki.each = function(a, b) {
        var c = this.id,
            d = this.namespace;
        if (arguments.length < 2) {
            var e = Ii,
                f = Hi;
            try {
                Hi = c, R(this, function(b, e, f) {
                    Ii = b[d][c], a.call(b, b.__data__, e, f)
                })
            } finally {
                Ii = e, Hi = f
            }
        } else R(this, function(e) {
            var f = e[d][c];
            (f.event || (f.event = bg.dispatch("start", "end", "interrupt"))).on(a, b)
        });
        return this
    }, Ki.transition = function() {
        for (var a, b, c, d, e = this.id, f = ++Li, g = this.namespace, h = [], i = 0, j = this.length; j > i; i++) {
            h.push(a = []);
            for (var b = this[i], k = 0, l = b.length; l > k; k++)(c = b[k]) && (d = c[g][e], Vf(c, k, g, f, {
                time: d.time,
                ease: d.ease,
                delay: d.delay + d.duration,
                duration: d.duration
            })), a.push(c)
        }
        return Rf(h, g, f)
    }, bg.svg.axis = function() {
        function a(a) {
            a.each(function() {
                var a, j = bg.select(this),
                    k = this.__chart__ || c,
                    l = this.__chart__ = c.copy(),
                    m = null == i ? l.ticks ? l.ticks.apply(l, h) : l.domain() : i,
                    n = null == b ? l.tickFormat ? l.tickFormat.apply(l, h) : s : b,
                    o = j.selectAll(".tick").data(m, l),
                    p = o.enter().insert("g", ".domain").attr("class", "tick").style("opacity", Dg),
                    q = bg.transition(o.exit()).style("opacity", Dg).remove(),
                    r = bg.transition(o.order()).style("opacity", 1),
                    t = Math.max(e, 0) + g,
                    u = Le(l),
                    v = j.selectAll(".domain").data([0]),
                    w = (v.enter().append("path").attr("class", "domain"), bg.transition(v));
                p.append("line"), p.append("text");
                var x, y, z, A, B = p.select("line"),
                    C = r.select("line"),
                    D = o.select("text").text(n),
                    E = p.select("text"),
                    F = r.select("text"),
                    G = "top" === d || "left" === d ? -1 : 1;
                if ("bottom" === d || "top" === d ? (a = Wf, x = "x", z = "y", y = "x2", A = "y2", D.attr("dy", 0 > G ? "0em" : ".71em").style("text-anchor", "middle"), w.attr("d", "M" + u[0] + "," + G * f + "V0H" + u[1] + "V" + G * f)) : (a = Xf, x = "y", z = "x", y = "y2", A = "x2", D.attr("dy", ".32em").style("text-anchor", 0 > G ? "end" : "start"), w.attr("d", "M" + G * f + "," + u[0] + "H0V" + u[1] + "H" + G * f)), B.attr(A, G * e), E.attr(z, G * t), C.attr(y, 0).attr(A, G * e), F.attr(x, 0).attr(z, G * t), l.rangeBand) {
                    var H = l,
                        I = H.rangeBand() / 2;
                    k = l = function(a) {
                        return H(a) + I
                    }
                } else k.rangeBand ? k = l : q.call(a, l, k);
                p.call(a, k, l), r.call(a, l, l)
            })
        }
        var b, c = bg.scale.linear(),
            d = Mi,
            e = 6,
            f = 6,
            g = 3,
            h = [10],
            i = null;
        return a.scale = function(b) {
            return arguments.length ? (c = b, a) : c
        }, a.orient = function(b) {
            return arguments.length ? (d = b in Ni ? b + "" : Mi, a) : d
        }, a.ticks = function() {
            return arguments.length ? (h = arguments, a) : h
        }, a.tickValues = function(b) {
            return arguments.length ? (i = b, a) : i
        }, a.tickFormat = function(c) {
            return arguments.length ? (b = c, a) : b
        }, a.tickSize = function(b) {
            var c = arguments.length;
            return c ? (e = +b, f = +arguments[c - 1], a) : e
        }, a.innerTickSize = function(b) {
            return arguments.length ? (e = +b, a) : e
        }, a.outerTickSize = function(b) {
            return arguments.length ? (f = +b, a) : f
        }, a.tickPadding = function(b) {
            return arguments.length ? (g = +b, a) : g
        }, a.tickSubdivide = function() {
            return arguments.length && a
        }, a
    };
    var Mi = "bottom",
        Ni = {
            top: 1,
            right: 1,
            bottom: 1,
            left: 1
        };
    bg.svg.brush = function() {
        function a(b) {
            b.each(function() {
                var b = bg.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", f).on("touchstart.brush", f),
                    g = b.selectAll(".background").data([0]);
                g.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair"), b.selectAll(".extent").data([0]).enter().append("rect").attr("class", "extent").style("cursor", "move");
                var h = b.selectAll(".resize").data(p, s);
                h.exit().remove(), h.enter().append("g").attr("class", function(a) {
                    return "resize " + a
                }).style("cursor", function(a) {
                    return Oi[a]
                }).append("rect").attr("x", function(a) {
                    return /[ew]$/.test(a) ? -3 : null
                }).attr("y", function(a) {
                    return /^[ns]/.test(a) ? -3 : null
                }).attr("width", 6).attr("height", 6).style("visibility", "hidden"), h.style("display", a.empty() ? "none" : null);
                var i, l = bg.transition(b),
                    m = bg.transition(g);
                j && (i = Le(j), m.attr("x", i[0]).attr("width", i[1] - i[0]), d(l)), k && (i = Le(k), m.attr("y", i[0]).attr("height", i[1] - i[0]), e(l)), c(l)
            })
        }

        function c(a) {
            a.selectAll(".resize").attr("transform", function(a) {
                return "translate(" + l[+/e$/.test(a)] + "," + m[+/^s/.test(a)] + ")"
            })
        }

        function d(a) {
            a.select(".extent").attr("x", l[0]), a.selectAll(".extent,.n>rect,.s>rect").attr("width", l[1] - l[0])
        }

        function e(a) {
            a.select(".extent").attr("y", m[0]), a.selectAll(".extent,.e>rect,.w>rect").attr("height", m[1] - m[0])
        }

        function f() {
            function f() {
                32 == bg.event.keyCode && (D || (t = null, F[0] -= l[1], F[1] -= m[1], D = 2), y())
            }

            function p() {
                32 == bg.event.keyCode && 2 == D && (F[0] += l[1], F[1] += m[1], D = 0, y())
            }

            function q() {
                var a = bg.mouse(v),
                    b = !1;
                u && (a[0] += u[0], a[1] += u[1]), D || (bg.event.altKey ? (t || (t = [(l[0] + l[1]) / 2, (m[0] + m[1]) / 2]), F[0] = l[+(a[0] < t[0])], F[1] = m[+(a[1] < t[1])]) : t = null), B && r(a, j, 0) && (d(z), b = !0), C && r(a, k, 1) && (e(z), b = !0), b && (c(z), x({
                    type: "brush",
                    mode: D ? "move" : "resize"
                }))
            }

            function r(a, b, c) {
                var d, e, f = Le(b),
                    i = f[0],
                    j = f[1],
                    k = F[c],
                    p = c ? m : l,
                    q = p[1] - p[0];
                return D && (i -= k, j -= q + k), d = (c ? o : n) ? Math.max(i, Math.min(j, a[c])) : a[c], D ? e = (d += k) + q : (t && (k = Math.max(i, Math.min(j, 2 * t[c] - d))), d > k ? (e = d, d = k) : e = k), p[0] != d || p[1] != e ? (c ? h = null : g = null, p[0] = d, p[1] = e, !0) : void 0
            }

            function s() {
                q(), z.style("pointer-events", "all").selectAll(".resize").style("display", a.empty() ? "none" : null), bg.select("body").style("cursor", null), G.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null), E(), x({
                    type: "brushend"
                })
            }
            var t, u, v = this,
                w = bg.select(bg.event.target),
                x = i.of(v, arguments),
                z = bg.select(v),
                A = w.datum(),
                B = !/^(n|s)$/.test(A) && j,
                C = !/^(e|w)$/.test(A) && k,
                D = w.classed("extent"),
                E = X(v),
                F = bg.mouse(v),
                G = bg.select(b(v)).on("keydown.brush", f).on("keyup.brush", p);
            if (bg.event.changedTouches ? G.on("touchmove.brush", q).on("touchend.brush", s) : G.on("mousemove.brush", q).on("mouseup.brush", s), z.interrupt().selectAll("*").interrupt(), D) F[0] = l[0] - F[0], F[1] = m[0] - F[1];
            else if (A) {
                var H = +/w$/.test(A),
                    I = +/^n/.test(A);
                u = [l[1 - H] - F[0], m[1 - I] - F[1]], F[0] = l[H], F[1] = m[I]
            } else bg.event.altKey && (t = F.slice());
            z.style("pointer-events", "none").selectAll(".resize").style("display", null), bg.select("body").style("cursor", w.style("cursor")), x({
                type: "brushstart"
            }), q()
        }
        var g, h, i = A(a, "brushstart", "brush", "brushend"),
            j = null,
            k = null,
            l = [0, 0],
            m = [0, 0],
            n = !0,
            o = !0,
            p = Pi[0];
        return a.event = function(a) {
            a.each(function() {
                var a = i.of(this, arguments),
                    b = {
                        x: l,
                        y: m,
                        i: g,
                        j: h
                    },
                    c = this.__chart__ || b;
                this.__chart__ = b, Hi ? bg.select(this).transition().each("start.brush", function() {
                    g = c.i, h = c.j, l = c.x, m = c.y, a({
                        type: "brushstart"
                    })
                }).tween("brush:brush", function() {
                    var c = sd(l, b.x),
                        d = sd(m, b.y);
                    return g = h = null,
                        function(e) {
                            l = b.x = c(e), m = b.y = d(e), a({
                                type: "brush",
                                mode: "resize"
                            })
                        }
                }).each("end.brush", function() {
                    g = b.i, h = b.j, a({
                        type: "brush",
                        mode: "resize"
                    }), a({
                        type: "brushend"
                    })
                }) : (a({
                    type: "brushstart"
                }), a({
                    type: "brush",
                    mode: "resize"
                }), a({
                    type: "brushend"
                }))
            })
        }, a.x = function(b) {
            return arguments.length ? (j = b, p = Pi[!j << 1 | !k], a) : j
        }, a.y = function(b) {
            return arguments.length ? (k = b, p = Pi[!j << 1 | !k], a) : k
        }, a.clamp = function(b) {
            return arguments.length ? (j && k ? (n = !!b[0], o = !!b[1]) : j ? n = !!b : k && (o = !!b), a) : j && k ? [n, o] : j ? n : k ? o : null
        }, a.extent = function(b) {
            var c, d, e, f, i;
            return arguments.length ? (j && (c = b[0], d = b[1], k && (c = c[0], d = d[0]), g = [c, d], j.invert && (c = j(c), d = j(d)), c > d && (i = c, c = d, d = i), (c != l[0] || d != l[1]) && (l = [c, d])), k && (e = b[0], f = b[1], j && (e = e[1], f = f[1]), h = [e, f], k.invert && (e = k(e), f = k(f)), e > f && (i = e, e = f, f = i), (e != m[0] || f != m[1]) && (m = [e, f])), a) : (j && (g ? (c = g[0], d = g[1]) : (c = l[0], d = l[1], j.invert && (c = j.invert(c), d = j.invert(d)), c > d && (i = c, c = d, d = i))), k && (h ? (e = h[0], f = h[1]) : (e = m[0], f = m[1], k.invert && (e = k.invert(e), f = k.invert(f)), e > f && (i = e, e = f, f = i))), j && k ? [
                [c, e],
                [d, f]
            ] : j ? [c, d] : k && [e, f])
        }, a.clear = function() {
            return a.empty() || (l = [0, 0], m = [0, 0], g = h = null), a
        }, a.empty = function() {
            return !!j && l[0] == l[1] || !!k && m[0] == m[1]
        }, bg.rebind(a, i, "on")
    };
    var Oi = {
            n: "ns-resize",
            e: "ew-resize",
            s: "ns-resize",
            w: "ew-resize",
            nw: "nwse-resize",
            ne: "nesw-resize",
            se: "nwse-resize",
            sw: "nesw-resize"
        },
        Pi = [
            ["n", "e", "s", "w", "nw", "ne", "se", "sw"],
            ["e", "w"],
            ["n", "s"],
            []
        ],
        Qi = hh.format = nh.timeFormat,
        Ri = Qi.utc,
        Si = Ri("%Y-%m-%dT%H:%M:%S.%LZ");
    Qi.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? Yf : Si, Yf.parse = function(a) {
        var b = new Date(a);
        return isNaN(b) ? null : b
    }, Yf.toString = Si.toString, hh.second = Na(function(a) {
        return new ih(1e3 * Math.floor(a / 1e3))
    }, function(a, b) {
        a.setTime(a.getTime() + 1e3 * Math.floor(b))
    }, function(a) {
        return a.getSeconds()
    }), hh.seconds = hh.second.range, hh.seconds.utc = hh.second.utc.range, hh.minute = Na(function(a) {
        return new ih(6e4 * Math.floor(a / 6e4))
    }, function(a, b) {
        a.setTime(a.getTime() + 6e4 * Math.floor(b))
    }, function(a) {
        return a.getMinutes()
    }), hh.minutes = hh.minute.range, hh.minutes.utc = hh.minute.utc.range, hh.hour = Na(function(a) {
        var b = a.getTimezoneOffset() / 60;
        return new ih(36e5 * (Math.floor(a / 36e5 - b) + b))
    }, function(a, b) {
        a.setTime(a.getTime() + 36e5 * Math.floor(b))
    }, function(a) {
        return a.getHours()
    }), hh.hours = hh.hour.range, hh.hours.utc = hh.hour.utc.range, hh.month = Na(function(a) {
        return a = hh.day(a), a.setDate(1), a
    }, function(a, b) {
        a.setMonth(a.getMonth() + b)
    }, function(a) {
        return a.getMonth()
    }), hh.months = hh.month.range, hh.months.utc = hh.month.utc.range;
    var Ti = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6],
        Ui = [
            [hh.second, 1],
            [hh.second, 5],
            [hh.second, 15],
            [hh.second, 30],
            [hh.minute, 1],
            [hh.minute, 5],
            [hh.minute, 15],
            [hh.minute, 30],
            [hh.hour, 1],
            [hh.hour, 3],
            [hh.hour, 6],
            [hh.hour, 12],
            [hh.day, 1],
            [hh.day, 2],
            [hh.week, 1],
            [hh.month, 1],
            [hh.month, 3],
            [hh.year, 1]
        ],
        Vi = Qi.multi([
            [".%L", function(a) {
                return a.getMilliseconds()
            }],
            [":%S", function(a) {
                return a.getSeconds()
            }],
            ["%I:%M", function(a) {
                return a.getMinutes()
            }],
            ["%I %p", function(a) {
                return a.getHours()
            }],
            ["%a %d", function(a) {
                return a.getDay() && 1 != a.getDate()
            }],
            ["%b %d", function(a) {
                return 1 != a.getDate()
            }],
            ["%B", function(a) {
                return a.getMonth()
            }],
            ["%Y", Cb]
        ]),
        Wi = {
            range: function(a, b, c) {
                return bg.range(Math.ceil(a / c) * c, +b, c).map($f)
            },
            floor: s,
            ceil: s
        };
    Ui.year = hh.year, hh.scale = function() {
        return Zf(bg.scale.linear(), Ui, Vi)
    };
    var Xi = Ui.map(function(a) {
            return [a[0].utc, a[1]]
        }),
        Yi = Ri.multi([
            [".%L", function(a) {
                return a.getUTCMilliseconds()
            }],
            [":%S", function(a) {
                return a.getUTCSeconds()
            }],
            ["%I:%M", function(a) {
                return a.getUTCMinutes()
            }],
            ["%I %p", function(a) {
                return a.getUTCHours()
            }],
            ["%a %d", function(a) {
                return a.getUTCDay() && 1 != a.getUTCDate()
            }],
            ["%b %d", function(a) {
                return 1 != a.getUTCDate()
            }],
            ["%B", function(a) {
                return a.getUTCMonth()
            }],
            ["%Y", Cb]
        ]);
    Xi.year = hh.year.utc, hh.scale.utc = function() {
        return Zf(bg.scale.linear(), Xi, Yi)
    }, bg.text = Ba(function(a) {
        return a.responseText
    }), bg.json = function(a, b) {
        return Ca(a, "application/json", _f, b)
    }, bg.html = function(a, b) {
        return Ca(a, "text/html", ag, b)
    }, bg.xml = Ba(function(a) {
        return a.responseXML
    }), "function" == typeof define && define.amd ? define(bg) : "object" == typeof module && module.exports && (module.exports = bg), this.d3 = bg
}(), ! function() {
    function a(a, b) {
        function c(b) {
            var c, d = a.arcs[0 > b ? ~b : b],
                e = d[0];
            return a.transform ? (c = [0, 0], d.forEach(function(a) {
                c[0] += a[0], c[1] += a[1]
            })) : c = d[d.length - 1], 0 > b ? [c, e] : [e, c]
        }

        function d(a, b) {
            for (var c in a) {
                var d = a[c];
                delete b[d.start], delete d.start, delete d.end, d.forEach(function(a) {
                    e[0 > a ? ~a : a] = 1
                }), h.push(d)
            }
        }
        var e = {},
            f = {},
            g = {},
            h = [],
            i = -1;
        return b.forEach(function(c, d) {
            var e, f = a.arcs[0 > c ? ~c : c];
            f.length < 3 && !f[1][0] && !f[1][1] && (e = b[++i], b[i] = c, b[d] = e)
        }), b.forEach(function(a) {
            var b, d, e = c(a),
                h = e[0],
                i = e[1];
            if (b = g[h])
                if (delete g[b.end], b.push(a), b.end = i, d = f[i]) {
                    delete f[d.start];
                    var j = d === b ? b : b.concat(d);
                    f[j.start = b.start] = g[j.end = d.end] = j
                } else f[b.start] = g[b.end] = b;
            else if (b = f[i])
                if (delete f[b.start], b.unshift(a), b.start = h, d = g[h]) {
                    delete g[d.end];
                    var k = d === b ? b : d.concat(b);
                    f[k.start = d.start] = g[k.end = b.end] = k
                } else f[b.start] = g[b.end] = b;
            else b = [a], f[b.start = h] = g[b.end = i] = b
        }), d(g, f), d(f, g), b.forEach(function(a) {
            e[0 > a ? ~a : a] || h.push([a])
        }), h
    }

    function b(b, c, d) {
        function e(a) {
            var b = 0 > a ? ~a : a;
            (k[b] || (k[b] = [])).push({
                i: a,
                g: j
            })
        }

        function f(a) {
            a.forEach(e)
        }

        function g(a) {
            a.forEach(f)
        }

        function h(a) {
            "GeometryCollection" === a.type ? a.geometries.forEach(h) : a.type in l && (j = a, l[a.type](a.arcs))
        }
        var i = [];
        if (arguments.length > 1) {
            var j, k = [],
                l = {
                    LineString: f,
                    MultiLineString: g,
                    Polygon: g,
                    MultiPolygon: function(a) {
                        a.forEach(g)
                    }
                };
            h(c), k.forEach(arguments.length < 3 ? function(a) {
                i.push(a[0].i)
            } : function(a) {
                d(a[0].g, a[a.length - 1].g) && i.push(a[0].i)
            })
        } else
            for (var m = 0, n = b.arcs.length; n > m; ++m) i.push(m);
        return {
            type: "MultiLineString",
            arcs: a(b, i)
        }
    }

    function c(b, c) {
        function d(a) {
            a.forEach(function(b) {
                b.forEach(function(b) {
                    (g[b = 0 > b ? ~b : b] || (g[b] = [])).push(a)
                })
            }), h.push(a)
        }

        function e(a) {
            return k(f(b, {
                type: "Polygon",
                arcs: [a]
            }).coordinates[0]) > 0
        }
        var g = {},
            h = [],
            i = [];
        return c.forEach(function(a) {
            "Polygon" === a.type ? d(a.arcs) : "MultiPolygon" === a.type && a.arcs.forEach(d)
        }), h.forEach(function(a) {
            if (!a._) {
                var b = [],
                    c = [a];
                for (a._ = 1, i.push(b); a = c.pop();) b.push(a), a.forEach(function(a) {
                    a.forEach(function(a) {
                        g[0 > a ? ~a : a].forEach(function(a) {
                            a._ || (a._ = 1, c.push(a))
                        })
                    })
                })
            }
        }), h.forEach(function(a) {
            delete a._
        }), {
            type: "MultiPolygon",
            arcs: i.map(function(c) {
                var d = [];
                if (c.forEach(function(a) {
                        a.forEach(function(a) {
                            a.forEach(function(a) {
                                g[0 > a ? ~a : a].length < 2 && d.push(a)
                            })
                        })
                    }), d = a(b, d), (n = d.length) > 1)
                    for (var f, h = e(c[0][0]), i = 0; i < n; ++i)
                        if (h === e(d[i])) {
                            f = d[0], d[0] = d[i], d[i] = f;
                            break
                        }
                return d
            })
        }
    }

    function d(a, b) {
        return "GeometryCollection" === b.type ? {
            type: "FeatureCollection",
            features: b.geometries.map(function(b) {
                return e(a, b)
            })
        } : e(a, b)
    }

    function e(a, b) {
        var c = {
            type: "Feature",
            id: b.id,
            properties: b.properties || {},
            geometry: f(a, b)
        };
        return null == b.id && delete c.id, c
    }

    function f(a, b) {
        function c(a, b) {
            b.length && b.pop();
            for (var c, d = k[0 > a ? ~a : a], e = 0, f = d.length; f > e; ++e) b.push(c = d[e].slice()), j(c, e);
            0 > a && g(b, f)
        }

        function d(a) {
            return a = a.slice(), j(a, 0), a
        }

        function e(a) {
            for (var b = [], d = 0, e = a.length; e > d; ++d) c(a[d], b);
            return b.length < 2 && b.push(b[0].slice()), b
        }

        function f(a) {
            for (var b = e(a); b.length < 4;) b.push(b[0].slice());
            return b
        }

        function h(a) {
            return a.map(f)
        }

        function i(a) {
            var b = a.type;
            return "GeometryCollection" === b ? {
                type: b,
                geometries: a.geometries.map(i)
            } : b in l ? {
                type: b,
                coordinates: l[b](a)
            } : null
        }
        var j = p(a.transform),
            k = a.arcs,
            l = {
                Point: function(a) {
                    return d(a.coordinates)
                },
                MultiPoint: function(a) {
                    return a.coordinates.map(d)
                },
                LineString: function(a) {
                    return e(a.arcs)
                },
                MultiLineString: function(a) {
                    return a.arcs.map(e)
                },
                Polygon: function(a) {
                    return h(a.arcs)
                },
                MultiPolygon: function(a) {
                    return a.arcs.map(h)
                }
            };
        return i(b)
    }

    function g(a, b) {
        for (var c, d = a.length, e = d - b; e < --d;) c = a[e], a[e++] = a[d], a[d] = c
    }

    function h(a, b) {
        for (var c = 0, d = a.length; d > c;) {
            var e = c + d >>> 1;
            a[e] < b ? c = e + 1 : d = e
        }
        return c
    }

    function i(a) {
        function b(a, b) {
            a.forEach(function(a) {
                0 > a && (a = ~a);
                var c = e[a];
                c ? c.push(b) : e[a] = [b]
            })
        }

        function c(a, c) {
            a.forEach(function(a) {
                b(a, c)
            })
        }

        function d(a, b) {
            "GeometryCollection" === a.type ? a.geometries.forEach(function(a) {
                d(a, b)
            }) : a.type in g && g[a.type](a.arcs, b)
        }
        var e = {},
            f = a.map(function() {
                return []
            }),
            g = {
                LineString: b,
                MultiLineString: c,
                Polygon: c,
                MultiPolygon: function(a, b) {
                    a.forEach(function(a) {
                        c(a, b)
                    })
                }
            };
        a.forEach(d);
        for (var i in e)
            for (var j = e[i], k = j.length, l = 0; k > l; ++l)
                for (var m = l + 1; k > m; ++m) {
                    var n, o = j[l],
                        p = j[m];
                    (n = f[o])[i = h(n, p)] !== p && n.splice(i, 0, p), (n = f[p])[i = h(n, o)] !== o && n.splice(i, 0, o)
                }
        return f
    }

    function j(a, b) {
        function c(a) {
            f.remove(a), a[1][2] = b(a), f.push(a)
        }
        var d = p(a.transform),
            e = q(a.transform),
            f = o();
        return b || (b = l), a.arcs.forEach(function(a) {
            for (var g, h, i = [], j = 0, k = 0, l = a.length; l > k; ++k) h = a[k], d(a[k] = [h[0], h[1], 1 / 0], k);
            for (var k = 1, l = a.length - 1; l > k; ++k) g = a.slice(k - 1, k + 2), g[1][2] = b(g), i.push(g), f.push(g);
            for (var k = 0, l = i.length; l > k; ++k) g = i[k], g.previous = i[k - 1], g.next = i[k + 1];
            for (; g = f.pop();) {
                var m = g.previous,
                    n = g.next;
                g[1][2] < j ? g[1][2] = j : j = g[1][2], m && (m.next = n, m[2] = g[2], c(m)), n && (n.previous = m, n[0] = g[0], c(n))
            }
            a.forEach(e)
        }), a
    }

    function k(a) {
        for (var b, c = -1, d = a.length, e = a[d - 1], f = 0; ++c < d;) b = e, e = a[c], f += b[0] * e[1] - b[1] * e[0];
        return .5 * f
    }

    function l(a) {
        var b = a[0],
            c = a[1],
            d = a[2];
        return Math.abs((b[0] - d[0]) * (c[1] - b[1]) - (b[0] - c[0]) * (d[1] - b[1]))
    }

    function m(a, b) {
        return a[1][2] - b[1][2]
    }

    function o() {
        function a(a, b) {
            for (; b > 0;) {
                var c = (b + 1 >> 1) - 1,
                    e = d[c];
                if (m(a, e) >= 0) break;
                d[e._ = b] = e, d[a._ = b = c] = a
            }
        }

        function b(a, b) {
            for (;;) {
                var c = b + 1 << 1,
                    f = c - 1,
                    g = b,
                    h = d[g];
                if (e > f && m(d[f], h) < 0 && (h = d[g = f]), e > c && m(d[c], h) < 0 && (h = d[g = c]), g === b) break;
                d[h._ = b] = h, d[a._ = b = g] = a
            }
        }
        var c = {},
            d = [],
            e = 0;
        return c.push = function(b) {
            return a(d[b._ = e] = b, e++), e
        }, c.pop = function() {
            if (!(0 >= e)) {
                var a, c = d[0];
                return --e > 0 && (a = d[e], b(d[a._ = 0] = a, 0)), c
            }
        }, c.remove = function(c) {
            var f, g = c._;
            if (d[g] === c) return g !== --e && (f = d[e], (m(f, c) < 0 ? a : b)(d[f._ = g] = f, g)), g
        }, c
    }

    function p(a) {
        if (!a) return r;
        var b, c, d = a.scale[0],
            e = a.scale[1],
            f = a.translate[0],
            g = a.translate[1];
        return function(a, h) {
            h || (b = c = 0), a[0] = (b += a[0]) * d + f, a[1] = (c += a[1]) * e + g
        }
    }

    function q(a) {
        if (!a) return r;
        var b, c, d = a.scale[0],
            e = a.scale[1],
            f = a.translate[0],
            g = a.translate[1];
        return function(a, h) {
            h || (b = c = 0);
            var i = (a[0] - f) / d | 0,
                j = (a[1] - g) / e | 0;
            a[0] = i - b, a[1] = j - c, b = i, c = j
        }
    }

    function r() {}
    var s = {
        version: "1.6.18",
        mesh: function(a) {
            return f(a, b.apply(this, arguments))
        },
        meshArcs: b,
        merge: function(a) {
            return f(a, c.apply(this, arguments))
        },
        mergeArcs: c,
        feature: d,
        neighbors: i,
        presimplify: j
    };
    "function" == typeof define && define.amd ? define(s) : "object" == typeof module && module.exports ? module.exports = s : this.topojson = s
}(), d3.geo.uk = function() {
        function a(a) {
            var e = a[0],
                f = a[1];
            return b = null, c(e, f), b || d(e, f), b
        }
        var b, c, d, e = 49.75,
            f = 58.71,
            g = 61,
            h = -11,
            i = 2,
            j = 0,
            k = [-3.5, f],
            l = 1e-6,
            m = d3.geo.mercator,
            n = m().rotate([4, -54]).center([0, 0]).clipAngle(10),
            o = m().rotate([4, -54]).center([0, 0]).clipAngle(10),
            p = {
                point: function(a, c) {
                    b = [a, c]
                }
            };
        return a.invert = function(a) {
            var b = n.scale(),
                c = n.translate();
            (a[0] - c[0]) / b, (c[1] - a[1]) / b;
            return n.invert(a)
        }, a.stream = function(a) {
            var b = n.stream(a),
                c = o.stream(a);
            return {
                point: function(a, d) {
                    b.point(a, d), c.point(a, d)
                },
                sphere: function() {
                    b.sphere(), c.sphere()
                },
                lineStart: function() {
                    b.lineStart(), c.lineStart()
                },
                lineEnd: function() {
                    b.lineEnd(), c.lineEnd()
                },
                polygonStart: function() {
                    b.polygonStart(), c.polygonStart()
                },
                polygonEnd: function() {
                    b.polygonEnd(), c.polygonEnd()
                }
            }
        }, a.precision = function(b) {
            return arguments.length ? (n.precision(b), o.precision(b), a) : n.precision()
        }, a.scale = function(b) {
            return arguments.length ? (n.scale(b), o.scale(b), a.translate(a.translate())) : n.scale()
        }, a.translate = function(b) {
            if (!arguments.length) return n.translate();
            var m = n.translate(b).scale(),
                q = +b[0],
                r = +b[1],
                s = n([h, e])[0],
                t = n(k)[1];
            return c = n.clipExtent([
                    [s, t], n([i, e])
                ]).stream(p).point, d = o.translate([q + .025 * m, r + .04 * m]).clipExtent([
                    [k[0], g],
                    [j, f + l]
                ].map(o)).stream(p).point,
                a
        }, a.scale(1e3)
    },
    function() {
        function a(a) {
            function d() {
                for (; h = k < j.length && a > l;) {
                    var b = k++,
                        d = j[b],
                        f = c.call(d, 1);
                    f.push(e(b)), ++l, d[0].apply(null, f)
                }
            }

            function e(a) {
                return function(b, c) {
                    --l, null == n && (null != b ? (n = b, k = m = NaN, f()) : (j[a] = c, --m ? h || d() : f()))
                }
            }

            function f() {
                null != n ? o(n) : i ? o(n, j) : o.apply(null, [n].concat(j))
            }
            var g, h, i, j = [],
                k = 0,
                l = 0,
                m = 0,
                n = null,
                o = b;
            return a || (a = 1 / 0), g = {
                defer: function() {
                    return n || (j.push(arguments), ++m, d()), g
                },
                await: function(a) {
                    return o = a, i = !1, m || f(), g
                },
                awaitAll: function(a) {
                    return o = a, i = !0, m || f(), g
                }
            }
        }

        function b() {}
        var c = [].slice;
        a.version = "1.0.7", "function" == typeof define && define.amd ? define(function() {
            return a
        }) : "object" == typeof module && module.exports ? module.exports = a : this.queue = a
    }(),
    function() {
        function a(a) {
            function b(a) {
                if ("string" == typeof a) {
                    var b, c = {},
                        d = a.split(e);
                    for (a = d.shift(); b = d.shift();) "." == b ? c["class"] = c["class"] ? c["class"] + " " + d.shift() : d.shift() : "#" == b && (c.id = d.shift());
                    return c.id || c["class"] ? {
                        tag: a,
                        attr: c
                    } : a
                }
                return a
            }

            function c(b) {
                return "function" == typeof b ? b : (b = a.ns.qualify(b)).local ? function() {
                    return this.ownerDocument.createElementNS(b.space, b.local)
                } : function() {
                    return this.ownerDocument.createElementNS(this.namespaceURI, b)
                }
            }

            function d(a) {
                return "function" == typeof a ? a : function() {
                    return this.querySelector(a)
                }
            }
            a.selection.prototype.translate = function(a) {
                return this.attr("transform", function(b, c) {
                    return "translate(" + ["function" == typeof a ? a(b, c) : a] + ")"
                })
            }, a.transition.prototype.translate = function(a) {
                return this.attr("transform", function(b, c) {
                    return "translate(" + ["function" == typeof a ? a(b, c) : a] + ")"
                })
            }, a.selection.prototype.tspans = function(a, b) {
                return this.selectAll("tspan").data(a).enter().append("tspan").text(function(a) {
                    return a
                }).attr("x", 0).attr("dy", function(a, c) {
                    return c ? b || 15 : 0
                })
            }, a.selection.prototype.append = a.selection.enter.prototype.append = function(a) {
                var d, e = b(a);
                return a = e.attr ? e.tag : a, a = c(a), d = this.select(function() {
                    return this.appendChild(a.apply(this, arguments))
                }), e.attr ? d.attr(e.attr) : d
            }, a.selection.prototype.insert = a.selection.enter.prototype.insert = function(a, e) {
                var f, g = b(a);
                return a = g.attr ? g.tag : a, a = c(a), e = d(e), f = this.select(function() {
                    return this.insertBefore(a.apply(this, arguments), e.apply(this, arguments) || null)
                }), g.attr ? f.attr(g.attr) : f
            };
            var e = /([\.#])/g;
            a.wordwrap = function(a, b) {
                var c = a.split(" "),
                    d = [],
                    e = [],
                    f = b || 40,
                    g = 0;
                return c.forEach(function(a) {
                    g + a.length > f && (d.push(e.join(" ")), e.length = 0, g = 0), g += a.length, e.push(a)
                }), e.length && d.push(e.join(" ")), d
            }, a.ascendingKey = function(a) {
                return "function" == typeof a ? function(b, c) {
                    return a(b) < a(c) ? -1 : a(b) > a(c) ? 1 : a(b) >= a(c) ? 0 : NaN
                } : function(b, c) {
                    return b[a] < c[a] ? -1 : b[a] > c[a] ? 1 : b[a] >= c[a] ? 0 : NaN
                }
            }, a.descendingKey = function(a) {
                return "function" == typeof a ? function(b, c) {
                    return a(c) < a(b) ? -1 : a(c) > a(b) ? 1 : a(c) >= a(b) ? 0 : NaN
                } : function(b, c) {
                    return c[a] < b[a] ? -1 : c[a] > b[a] ? 1 : c[a] >= b[a] ? 0 : NaN
                }
            }, a.f = function() {
                for (var a = arguments, b = 0, c = a.length; c > b;)("string" == typeof a[b] || "number" == typeof a[b]) && (a[b] = function(a) {
                    return function(b) {
                        return b[a]
                    }
                }(a[b])), b++;
                return function(b) {
                    for (var c = 0, d = a.length; c++ < d;) b = a[c - 1].call(this, b);
                    return b
                }
            }, window.hasOwnProperty("ƒ") || (window.ƒ = a.f)
        }
        "object" == typeof d3 && d3.version ? a(d3) : "function" == typeof define && define.amd && define(["d3"], a)
    }();
var dat = dat || {};
dat.gui = dat.gui || {}, dat.utils = dat.utils || {}, dat.controllers = dat.controllers || {}, dat.dom = dat.dom || {}, dat.color = dat.color || {}, dat.utils.css = function() {
        return {
            load: function(a, b) {
                b = b || document;
                var c = b.createElement("link");
                c.type = "text/css", c.rel = "stylesheet", c.href = a, b.getElementsByTagName("head")[0].appendChild(c)
            },
            inject: function(a, b) {
                b = b || document;
                var c = document.createElement("style");
                c.type = "text/css", c.innerHTML = a, b.getElementsByTagName("head")[0].appendChild(c)
            }
        }
    }(), dat.utils.common = function() {
        var a = Array.prototype.forEach,
            b = Array.prototype.slice;
        return {
            BREAK: {},
            extend: function(a) {
                return this.each(b.call(arguments, 1), function(b) {
                    for (var c in b) this.isUndefined(b[c]) || (a[c] = b[c])
                }, this), a
            },
            defaults: function(a) {
                return this.each(b.call(arguments, 1), function(b) {
                    for (var c in b) this.isUndefined(a[c]) && (a[c] = b[c])
                }, this), a
            },
            compose: function() {
                var a = b.call(arguments);
                return function() {
                    for (var c = b.call(arguments), d = a.length - 1; d >= 0; d--) c = [a[d].apply(this, c)];
                    return c[0]
                }
            },
            each: function(b, c, d) {
                if (b)
                    if (a && b.forEach && b.forEach === a) b.forEach(c, d);
                    else if (b.length === b.length + 0) {
                    for (var e = 0, f = b.length; f > e; e++)
                        if (e in b && c.call(d, b[e], e) === this.BREAK) return
                } else
                    for (var e in b)
                        if (c.call(d, b[e], e) === this.BREAK) return
            },
            defer: function(a) {
                setTimeout(a, 0)
            },
            toArray: function(a) {
                return a.toArray ? a.toArray() : b.call(a)
            },
            isUndefined: function(a) {
                return void 0 === a
            },
            isNull: function(a) {
                return null === a
            },
            isNaN: function(a) {
                return a !== a
            },
            isArray: Array.isArray || function(a) {
                return a.constructor === Array
            },
            isObject: function(a) {
                return a === Object(a)
            },
            isNumber: function(a) {
                return a === a + 0
            },
            isString: function(a) {
                return a === a + ""
            },
            isBoolean: function(a) {
                return a === !1 || a === !0
            },
            isFunction: function(a) {
                return "[object Function]" === Object.prototype.toString.call(a)
            }
        }
    }(), dat.controllers.Controller = function(a) {
        var b = function(a, b) {
            this.initialValue = a[b], this.domElement = document.createElement("div"), this.object = a, this.property = b, this.__onChange = void 0, this.__onFinishChange = void 0
        };
        return a.extend(b.prototype, {
            onChange: function(a) {
                return this.__onChange = a, this
            },
            onFinishChange: function(a) {
                return this.__onFinishChange = a, this
            },
            setValue: function(a) {
                return this.object[this.property] = a, this.__onChange && this.__onChange.call(this, a), this.updateDisplay(), this
            },
            getValue: function() {
                return this.object[this.property]
            },
            updateDisplay: function() {
                return this
            },
            isModified: function() {
                return this.initialValue !== this.getValue()
            }
        }), b
    }(dat.utils.common), dat.dom.dom = function(a) {
        function b(b) {
            if ("0" === b || a.isUndefined(b)) return 0;
            var c = b.match(e);
            return a.isNull(c) ? 0 : parseFloat(c[1])
        }
        var c = {
                HTMLEvents: ["change"],
                MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
                KeyboardEvents: ["keydown"]
            },
            d = {};
        a.each(c, function(b, c) {
            a.each(b, function(a) {
                d[a] = c
            })
        });
        var e = /(\d+(\.\d+)?)px/,
            f = {
                makeSelectable: function(a, b) {
                    void 0 !== a && void 0 !== a.style && (a.onselectstart = b ? function() {
                        return !1
                    } : function() {}, a.style.MozUserSelect = b ? "auto" : "none", a.style.KhtmlUserSelect = b ? "auto" : "none", a.unselectable = b ? "on" : "off")
                },
                makeFullscreen: function(b, c, d) {
                    a.isUndefined(c) && (c = !0), a.isUndefined(d) && (d = !0), b.style.position = "absolute", c && (b.style.left = 0, b.style.right = 0), d && (b.style.top = 0, b.style.bottom = 0)
                },
                fakeEvent: function(b, c, e, f) {
                    e = e || {};
                    var g = d[c];
                    if (!g) throw new Error("Event type " + c + " not supported.");
                    var h = document.createEvent(g);
                    switch (g) {
                        case "MouseEvents":
                            var i = e.x || e.clientX || 0,
                                j = e.y || e.clientY || 0;
                            h.initMouseEvent(c, e.bubbles || !1, e.cancelable || !0, window, e.clickCount || 1, 0, 0, i, j, !1, !1, !1, !1, 0, null);
                            break;
                        case "KeyboardEvents":
                            var k = h.initKeyboardEvent || h.initKeyEvent;
                            a.defaults(e, {
                                cancelable: !0,
                                ctrlKey: !1,
                                altKey: !1,
                                shiftKey: !1,
                                metaKey: !1,
                                keyCode: void 0,
                                charCode: void 0
                            }), k(c, e.bubbles || !1, e.cancelable, window, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
                            break;
                        default:
                            h.initEvent(c, e.bubbles || !1, e.cancelable || !0)
                    }
                    a.defaults(h, f), b.dispatchEvent(h)
                },
                bind: function(a, b, c, d) {
                    return d = d || !1, a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c), f
                },
                unbind: function(a, b, c, d) {
                    return d = d || !1, a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c), f
                },
                addClass: function(a, b) {
                    if (void 0 === a.className) a.className = b;
                    else if (a.className !== b) {
                        var c = a.className.split(/ +/); - 1 == c.indexOf(b) && (c.push(b), a.className = c.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                    }
                    return f
                },
                removeClass: function(a, b) {
                    if (b)
                        if (void 0 === a.className);
                        else if (a.className === b) a.removeAttribute("class");
                    else {
                        var c = a.className.split(/ +/),
                            d = c.indexOf(b); - 1 != d && (c.splice(d, 1), a.className = c.join(" "))
                    } else a.className = void 0;
                    return f
                },
                hasClass: function(a, b) {
                    return new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)").test(a.className) || !1
                },
                getWidth: function(a) {
                    var c = getComputedStyle(a);
                    return b(c["border-left-width"]) + b(c["border-right-width"]) + b(c["padding-left"]) + b(c["padding-right"]) + b(c.width)
                },
                getHeight: function(a) {
                    var c = getComputedStyle(a);
                    return b(c["border-top-width"]) + b(c["border-bottom-width"]) + b(c["padding-top"]) + b(c["padding-bottom"]) + b(c.height)
                },
                getOffset: function(a) {
                    var b = {
                        left: 0,
                        top: 0
                    };
                    if (a.offsetParent)
                        do b.left += a.offsetLeft, b.top += a.offsetTop; while (a = a.offsetParent);
                    return b
                },
                isActive: function(a) {
                    return a === document.activeElement && (a.type || a.href)
                }
            };
        return f
    }(dat.utils.common), dat.controllers.OptionController = function(a, b, c) {
        var d = function(a, e, f) {
            d.superclass.call(this, a, e);
            var g = this;
            if (this.__select = document.createElement("select"), c.isArray(f)) {
                var h = {};
                c.each(f, function(a) {
                    h[a] = a
                }), f = h
            }
            c.each(f, function(a, b) {
                var c = document.createElement("option");
                c.innerHTML = b, c.setAttribute("value", a), g.__select.appendChild(c)
            }), this.updateDisplay(), b.bind(this.__select, "change", function() {
                var a = this.options[this.selectedIndex].value;
                g.setValue(a)
            }), this.domElement.appendChild(this.__select)
        };
        return d.superclass = a, c.extend(d.prototype, a.prototype, {
            setValue: function(a) {
                var b = d.superclass.prototype.setValue.call(this, a);
                return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), b
            },
            updateDisplay: function() {
                return this.__select.value = this.getValue(), d.superclass.prototype.updateDisplay.call(this)
            }
        }), d
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.NumberController = function(a, b) {
        function c(a) {
            return a = a.toString(), a.indexOf(".") > -1 ? a.length - a.indexOf(".") - 1 : 0
        }
        var d = function(a, e, f) {
            d.superclass.call(this, a, e), f = f || {}, this.__min = f.min, this.__max = f.max, this.__step = f.step, b.isUndefined(this.__step) ? 0 == this.initialValue ? this.__impliedStep = 1 : this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__impliedStep = this.__step, this.__precision = c(this.__impliedStep)
        };
        return d.superclass = a, b.extend(d.prototype, a.prototype, {
            setValue: function(a) {
                return void 0 !== this.__min && a < this.__min ? a = this.__min : void 0 !== this.__max && a > this.__max && (a = this.__max), void 0 !== this.__step && a % this.__step != 0 && (a = Math.round(a / this.__step) * this.__step), d.superclass.prototype.setValue.call(this, a)
            },
            min: function(a) {
                return this.__min = a, this
            },
            max: function(a) {
                return this.__max = a, this
            },
            step: function(a) {
                return this.__step = a, this.__impliedStep = a, this.__precision = c(a), this
            }
        }), d
    }(dat.controllers.Controller, dat.utils.common), dat.controllers.NumberControllerBox = function(a, b, c) {
        function d(a, b) {
            var c = Math.pow(10, b);
            return Math.round(a * c) / c
        }
        var e = function(a, d, f) {
            function g() {
                var a = parseFloat(m.__input.value);
                c.isNaN(a) || m.setValue(a)
            }

            function h() {
                g(), m.__onFinishChange && m.__onFinishChange.call(m, m.getValue())
            }

            function i(a) {
                b.bind(window, "mousemove", j), b.bind(window, "mouseup", k), l = a.clientY
            }

            function j(a) {
                var b = l - a.clientY;
                m.setValue(m.getValue() + b * m.__impliedStep), l = a.clientY
            }

            function k() {
                b.unbind(window, "mousemove", j), b.unbind(window, "mouseup", k)
            }
            this.__truncationSuspended = !1, e.superclass.call(this, a, d, f);
            var l, m = this;
            this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), b.bind(this.__input, "change", g), b.bind(this.__input, "blur", h), b.bind(this.__input, "mousedown", i), b.bind(this.__input, "keydown", function(a) {
                13 === a.keyCode && (m.__truncationSuspended = !0, this.blur(), m.__truncationSuspended = !1)
            }), this.updateDisplay(), this.domElement.appendChild(this.__input)
        };
        return e.superclass = a, c.extend(e.prototype, a.prototype, {
            updateDisplay: function() {
                return this.__input.value = this.__truncationSuspended ? this.getValue() : d(this.getValue(), this.__precision), e.superclass.prototype.updateDisplay.call(this)
            }
        }), e
    }(dat.controllers.NumberController, dat.dom.dom, dat.utils.common), dat.controllers.NumberControllerSlider = function(a, b, c, d, e) {
        function f(a, b, c, d, e) {
            return d + (e - d) * ((a - b) / (c - b))
        }
        var g = function(a, c, d, e, h) {
            function i(a) {
                b.bind(window, "mousemove", j), b.bind(window, "mouseup", k), j(a)
            }

            function j(a) {
                a.preventDefault();
                var c = b.getOffset(l.__background),
                    d = b.getWidth(l.__background);
                return l.setValue(f(a.clientX, c.left, c.left + d, l.__min, l.__max)), !1
            }

            function k() {
                b.unbind(window, "mousemove", j), b.unbind(window, "mouseup", k), l.__onFinishChange && l.__onFinishChange.call(l, l.getValue())
            }
            g.superclass.call(this, a, c, {
                min: d,
                max: e,
                step: h
            });
            var l = this;
            this.__background = document.createElement("div"), this.__foreground = document.createElement("div"), b.bind(this.__background, "mousedown", i), b.addClass(this.__background, "slider"), b.addClass(this.__foreground, "slider-fg"), this.updateDisplay(), this.__background.appendChild(this.__foreground), this.domElement.appendChild(this.__background)
        };
        return g.superclass = a, g.useDefaultStyles = function() {
            c.inject(e)
        }, d.extend(g.prototype, a.prototype, {
            updateDisplay: function() {
                var a = (this.getValue() - this.__min) / (this.__max - this.__min);
                return this.__foreground.style.width = 100 * a + "%", g.superclass.prototype.updateDisplay.call(this)
            }
        }), g
    }(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, "/**\n * dat-gui JavaScript Controller Library\n * http://code.google.com/p/dat-gui\n *\n * Copyright 2011 Data Arts Team, Google Creative Lab\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n */\n\n.slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}"), dat.controllers.FunctionController = function(a, b, c) {
        var d = function(a, c, e) {
            d.superclass.call(this, a, c);
            var f = this;
            this.__button = document.createElement("div"), this.__button.innerHTML = void 0 === e ? "Fire" : e, b.bind(this.__button, "click", function(a) {
                return a.preventDefault(), f.fire(), !1
            }), b.addClass(this.__button, "button"), this.domElement.appendChild(this.__button)
        };
        return d.superclass = a, c.extend(d.prototype, a.prototype, {
            fire: function() {
                this.__onChange && this.__onChange.call(this), this.getValue().call(this.object), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue())
            }
        }), d
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.BooleanController = function(a, b, c) {
        var d = function(a, c) {
            function e() {
                f.setValue(!f.__prev)
            }
            d.superclass.call(this, a, c);
            var f = this;
            this.__prev = this.getValue(), this.__checkbox = document.createElement("input"), this.__checkbox.setAttribute("type", "checkbox"), b.bind(this.__checkbox, "change", e, !1), this.domElement.appendChild(this.__checkbox), this.updateDisplay()
        };
        return d.superclass = a, c.extend(d.prototype, a.prototype, {
            setValue: function(a) {
                var b = d.superclass.prototype.setValue.call(this, a);
                return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), b
            },
            updateDisplay: function() {
                return this.getValue() === !0 ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0) : this.__checkbox.checked = !1, d.superclass.prototype.updateDisplay.call(this)
            }
        }), d
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.color.toString = function(a) {
        return function(b) {
            if (1 == b.a || a.isUndefined(b.a)) {
                for (var c = b.hex.toString(16); c.length < 6;) c = "0" + c;
                return "#" + c
            }
            return "rgba(" + Math.round(b.r) + "," + Math.round(b.g) + "," + Math.round(b.b) + "," + b.a + ")"
        }
    }(dat.utils.common), dat.color.interpret = function(a, b) {
        var c, d, e = function() {
                d = !1;
                var a = arguments.length > 1 ? b.toArray(arguments) : arguments[0];
                return b.each(f, function(e) {
                    return e.litmus(a) ? (b.each(e.conversions, function(e, f) {
                        return c = e.read(a), d === !1 && c !== !1 ? (d = c, c.conversionName = f, c.conversion = e, b.BREAK) : void 0
                    }), b.BREAK) : void 0
                }), d
            },
            f = [{
                litmus: b.isString,
                conversions: {
                    THREE_CHAR_HEX: {
                        read: function(a) {
                            var b = a.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                            return null === b ? !1 : {
                                space: "HEX",
                                hex: parseInt("0x" + b[1].toString() + b[1].toString() + b[2].toString() + b[2].toString() + b[3].toString() + b[3].toString())
                            }
                        },
                        write: a
                    },
                    SIX_CHAR_HEX: {
                        read: function(a) {
                            var b = a.match(/^#([A-F0-9]{6})$/i);
                            return null === b ? !1 : {
                                space: "HEX",
                                hex: parseInt("0x" + b[1].toString())
                            }
                        },
                        write: a
                    },
                    CSS_RGB: {
                        read: function(a) {
                            var b = a.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                            return null === b ? !1 : {
                                space: "RGB",
                                r: parseFloat(b[1]),
                                g: parseFloat(b[2]),
                                b: parseFloat(b[3])
                            }
                        },
                        write: a
                    },
                    CSS_RGBA: {
                        read: function(a) {
                            var b = a.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
                            return null === b ? !1 : {
                                space: "RGB",
                                r: parseFloat(b[1]),
                                g: parseFloat(b[2]),
                                b: parseFloat(b[3]),
                                a: parseFloat(b[4])
                            }
                        },
                        write: a
                    }
                }
            }, {
                litmus: b.isNumber,
                conversions: {
                    HEX: {
                        read: function(a) {
                            return {
                                space: "HEX",
                                hex: a,
                                conversionName: "HEX"
                            }
                        },
                        write: function(a) {
                            return a.hex
                        }
                    }
                }
            }, {
                litmus: b.isArray,
                conversions: {
                    RGB_ARRAY: {
                        read: function(a) {
                            return 3 != a.length ? !1 : {
                                space: "RGB",
                                r: a[0],
                                g: a[1],
                                b: a[2]
                            }
                        },
                        write: function(a) {
                            return [a.r, a.g, a.b]
                        }
                    },
                    RGBA_ARRAY: {
                        read: function(a) {
                            return 4 != a.length ? !1 : {
                                space: "RGB",
                                r: a[0],
                                g: a[1],
                                b: a[2],
                                a: a[3]
                            }
                        },
                        write: function(a) {
                            return [a.r, a.g, a.b, a.a]
                        }
                    }
                }
            }, {
                litmus: b.isObject,
                conversions: {
                    RGBA_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.r) && b.isNumber(a.g) && b.isNumber(a.b) && b.isNumber(a.a) ? {
                                space: "RGB",
                                r: a.r,
                                g: a.g,
                                b: a.b,
                                a: a.a
                            } : !1
                        },
                        write: function(a) {
                            return {
                                r: a.r,
                                g: a.g,
                                b: a.b,
                                a: a.a
                            }
                        }
                    },
                    RGB_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.r) && b.isNumber(a.g) && b.isNumber(a.b) ? {
                                space: "RGB",
                                r: a.r,
                                g: a.g,
                                b: a.b
                            } : !1
                        },
                        write: function(a) {
                            return {
                                r: a.r,
                                g: a.g,
                                b: a.b
                            }
                        }
                    },
                    HSVA_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.h) && b.isNumber(a.s) && b.isNumber(a.v) && b.isNumber(a.a) ? {
                                space: "HSV",
                                h: a.h,
                                s: a.s,
                                v: a.v,
                                a: a.a
                            } : !1
                        },
                        write: function(a) {
                            return {
                                h: a.h,
                                s: a.s,
                                v: a.v,
                                a: a.a
                            }
                        }
                    },
                    HSV_OBJ: {
                        read: function(a) {
                            return b.isNumber(a.h) && b.isNumber(a.s) && b.isNumber(a.v) ? {
                                space: "HSV",
                                h: a.h,
                                s: a.s,
                                v: a.v
                            } : !1
                        },
                        write: function(a) {
                            return {
                                h: a.h,
                                s: a.s,
                                v: a.v
                            }
                        }
                    }
                }
            }];
        return e
    }(dat.color.toString, dat.utils.common), dat.GUI = dat.gui.GUI = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        function p(a, b, c, f) {
            if (void 0 === b[c]) throw new Error("Object " + b + ' has no property "' + c + '"');
            var g;
            if (f.color) g = new k(b, c);
            else {
                var h = [b, c].concat(f.factoryArgs);
                g = d.apply(a, h)
            }
            f.before instanceof e && (f.before = f.before.__li), s(a, g), n.addClass(g.domElement, "c");
            var i = document.createElement("span");
            n.addClass(i, "property-name"), i.innerHTML = g.property;
            var j = document.createElement("div");
            j.appendChild(i), j.appendChild(g.domElement);
            var l = q(a, j, f.before);
            return n.addClass(l, M.CLASS_CONTROLLER_ROW), n.addClass(l, typeof g.getValue()), r(a, l, g), a.__controllers.push(g), g
        }

        function q(a, b, c) {
            var d = document.createElement("li");
            return b && d.appendChild(b), c ? a.__ul.insertBefore(d, params.before) : a.__ul.appendChild(d), a.onResize(), d
        }

        function r(a, b, c) {
            if (c.__li = b, c.__gui = a, o.extend(c, {
                    options: function(b) {
                        return arguments.length > 1 ? (c.remove(), p(a, c.object, c.property, {
                            before: c.__li.nextElementSibling,
                            factoryArgs: [o.toArray(arguments)]
                        })) : o.isArray(b) || o.isObject(b) ? (c.remove(), p(a, c.object, c.property, {
                            before: c.__li.nextElementSibling,
                            factoryArgs: [b]
                        })) : void 0
                    },
                    name: function(a) {
                        return c.__li.firstElementChild.firstElementChild.innerHTML = a, c
                    },
                    listen: function() {
                        return c.__gui.listen(c), c
                    },
                    remove: function() {
                        return c.__gui.remove(c), c
                    }
                }), c instanceof i) {
                var d = new h(c.object, c.property, {
                    min: c.__min,
                    max: c.__max,
                    step: c.__step
                });
                o.each(["updateDisplay", "onChange", "onFinishChange"], function(a) {
                    var b = c[a],
                        e = d[a];
                    c[a] = d[a] = function() {
                        var a = Array.prototype.slice.call(arguments);
                        return b.apply(c, a), e.apply(d, a)
                    }
                }), n.addClass(b, "has-slider"), c.domElement.insertBefore(d.domElement, c.domElement.firstElementChild)
            } else if (c instanceof h) {
                var e = function(b) {
                    return o.isNumber(c.__min) && o.isNumber(c.__max) ? (c.remove(), p(a, c.object, c.property, {
                        before: c.__li.nextElementSibling,
                        factoryArgs: [c.__min, c.__max, c.__step]
                    })) : b
                };
                c.min = o.compose(e, c.min), c.max = o.compose(e, c.max)
            } else c instanceof f ? (n.bind(b, "click", function() {
                n.fakeEvent(c.__checkbox, "click")
            }), n.bind(c.__checkbox, "click", function(a) {
                a.stopPropagation()
            })) : c instanceof g ? (n.bind(b, "click", function() {
                n.fakeEvent(c.__button, "click")
            }), n.bind(b, "mouseover", function() {
                n.addClass(c.__button, "hover")
            }), n.bind(b, "mouseout", function() {
                n.removeClass(c.__button, "hover")
            })) : c instanceof k && (n.addClass(b, "color"), c.updateDisplay = o.compose(function(a) {
                return b.style.borderLeftColor = c.__color.toString(), a
            }, c.updateDisplay), c.updateDisplay());
            c.setValue = o.compose(function(b) {
                return a.getRoot().__preset_select && c.isModified() && A(a.getRoot(), !0), b
            }, c.setValue)
        }

        function s(a, b) {
            var c = a.getRoot(),
                d = c.__rememberedObjects.indexOf(b.object);
            if (-1 != d) {
                var e = c.__rememberedObjectIndecesToControllers[d];
                if (void 0 === e && (e = {}, c.__rememberedObjectIndecesToControllers[d] = e), e[b.property] = b, c.load && c.load.remembered) {
                    var f, g = c.load.remembered;
                    if (g[a.preset]) f = g[a.preset];
                    else {
                        if (!g[H]) return;
                        f = g[H]
                    }
                    if (f[d] && void 0 !== f[d][b.property]) {
                        var h = f[d][b.property];
                        b.initialValue = h, b.setValue(h)
                    }
                }
            }
        }

        function t(a, b) {
            return document.location.href + "." + b
        }

        function u(a) {
            function b() {
                j.style.display = a.useLocalStorage ? "block" : "none"
            }
            var c = a.__save_row = document.createElement("li");
            n.addClass(a.domElement, "has-save"), a.__ul.insertBefore(c, a.__ul.firstChild), n.addClass(c, "save-row");
            var d = document.createElement("span");
            d.innerHTML = "&nbsp;", n.addClass(d, "button gears");
            var e = document.createElement("span");
            e.innerHTML = "Save", n.addClass(e, "button"), n.addClass(e, "save");
            var f = document.createElement("span");
            f.innerHTML = "New", n.addClass(f, "button"), n.addClass(f, "save-as");
            var g = document.createElement("span");
            g.innerHTML = "Revert", n.addClass(g, "button"), n.addClass(g, "revert");
            var h = a.__preset_select = document.createElement("select");
            if (a.load && a.load.remembered ? o.each(a.load.remembered, function(b, c) {
                    y(a, c, c == a.preset)
                }) : y(a, H, !1), n.bind(h, "change", function() {
                    for (var b = 0; b < a.__preset_select.length; b++) a.__preset_select[b].innerHTML = a.__preset_select[b].value;
                    a.preset = this.value
                }), c.appendChild(h), c.appendChild(d), c.appendChild(e), c.appendChild(f), c.appendChild(g), I) {
                var i = document.getElementById("dg-save-locally"),
                    j = document.getElementById("dg-local-explain");
                i.style.display = "block";
                var k = document.getElementById("dg-local-storage");
                "true" === localStorage.getItem(t(a, "isLocal")) && k.setAttribute("checked", "checked"), b(), n.bind(k, "change", function() {
                    a.useLocalStorage = !a.useLocalStorage, b()
                })
            }
            var l = document.getElementById("dg-new-constructor");
            n.bind(l, "keydown", function(a) {
                !a.metaKey || 67 !== a.which && 67 != a.keyCode || C.hide()
            }), n.bind(d, "click", function() {
                l.innerHTML = JSON.stringify(a.getSaveObject(), void 0, 2), C.show(), l.focus(), l.select()
            }), n.bind(e, "click", function() {
                a.save()
            }), n.bind(f, "click", function() {
                var b = prompt("Enter a new preset name.");
                b && a.saveAs(b)
            }), n.bind(g, "click", function() {
                a.revert()
            })
        }

        function v(a) {
            function b(b) {
                return b.preventDefault(), e = b.clientX, n.addClass(a.__closeButton, M.CLASS_DRAG), n.bind(window, "mousemove", c), n.bind(window, "mouseup", d), !1
            }

            function c(b) {
                return b.preventDefault(), a.width += e - b.clientX, a.onResize(), e = b.clientX, !1
            }

            function d() {
                n.removeClass(a.__closeButton, M.CLASS_DRAG), n.unbind(window, "mousemove", c), n.unbind(window, "mouseup", d)
            }
            a.__resize_handle = document.createElement("div"), o.extend(a.__resize_handle.style, {
                width: "6px",
                marginLeft: "-3px",
                height: "200px",
                cursor: "ew-resize",
                position: "absolute"
            });
            var e;
            n.bind(a.__resize_handle, "mousedown", b), n.bind(a.__closeButton, "mousedown", b), a.domElement.insertBefore(a.__resize_handle, a.domElement.firstElementChild)
        }

        function w(a, b) {
            a.domElement.style.width = b + "px", a.__save_row && a.autoPlace && (a.__save_row.style.width = b + "px"), a.__closeButton && (a.__closeButton.style.width = b + "px")
        }

        function x(a, b) {
            var c = {};
            return o.each(a.__rememberedObjects, function(d, e) {
                var f = {},
                    g = a.__rememberedObjectIndecesToControllers[e];
                o.each(g, function(a, c) {
                    f[c] = b ? a.initialValue : a.getValue()
                }), c[e] = f
            }), c
        }

        function y(a, b, c) {
            var d = document.createElement("option");
            d.innerHTML = b, d.value = b, a.__preset_select.appendChild(d), c && (a.__preset_select.selectedIndex = a.__preset_select.length - 1)
        }

        function z(a) {
            for (var b = 0; b < a.__preset_select.length; b++) a.__preset_select[b].value == a.preset && (a.__preset_select.selectedIndex = b)
        }

        function A(a, b) {
            var c = a.__preset_select[a.__preset_select.selectedIndex];
            b ? c.innerHTML = c.value + "*" : c.innerHTML = c.value
        }

        function B(a) {
            0 != a.length && l(function() {
                B(a)
            }), o.each(a, function(a) {
                a.updateDisplay()
            })
        }
        a.inject(c);
        var C, D, E = "dg",
            F = 72,
            G = 20,
            H = "Default",
            I = function() {
                try {
                    return "localStorage" in window && null !== window.localStorage
                } catch (a) {
                    return !1
                }
            }(),
            J = !0,
            K = !1,
            L = [],
            M = function(a) {
                function b() {
                    var a = c.getRoot();
                    a.width += 1, o.defer(function() {
                        a.width -= 1
                    })
                }
                var c = this;
                this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), n.addClass(this.domElement, E), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], a = a || {}, a = o.defaults(a, {
                    autoPlace: !0,
                    width: M.DEFAULT_WIDTH
                }), a = o.defaults(a, {
                    resizable: a.autoPlace,
                    hideable: a.autoPlace
                }), o.isUndefined(a.load) ? a.load = {
                    preset: H
                } : a.preset && (a.load.preset = a.preset), o.isUndefined(a.parent) && a.hideable && L.push(this), a.resizable = o.isUndefined(a.parent) && a.resizable, a.autoPlace && o.isUndefined(a.scrollable) && (a.scrollable = !0);
                var d, e = I && "true" === localStorage.getItem(t(this, "isLocal"));
                if (Object.defineProperties(this, {
                        parent: {
                            get: function() {
                                return a.parent
                            }
                        },
                        scrollable: {
                            get: function() {
                                return a.scrollable
                            }
                        },
                        autoPlace: {
                            get: function() {
                                return a.autoPlace
                            }
                        },
                        preset: {
                            get: function() {
                                return c.parent ? c.getRoot().preset : a.load.preset
                            },
                            set: function(b) {
                                c.parent ? c.getRoot().preset = b : a.load.preset = b, z(this), c.revert()
                            }
                        },
                        width: {
                            get: function() {
                                return a.width
                            },
                            set: function(b) {
                                a.width = b, w(c, b)
                            }
                        },
                        name: {
                            get: function() {
                                return a.name
                            },
                            set: function(b) {
                                a.name = b, g && (g.innerHTML = a.name)
                            }
                        },
                        closed: {
                            get: function() {
                                return a.closed
                            },
                            set: function(b) {
                                a.closed = b, a.closed ? n.addClass(c.__ul, M.CLASS_CLOSED) : n.removeClass(c.__ul, M.CLASS_CLOSED), this.onResize(), c.__closeButton && (c.__closeButton.innerHTML = b ? M.TEXT_OPEN : M.TEXT_CLOSED)
                            }
                        },
                        load: {
                            get: function() {
                                return a.load
                            }
                        },
                        useLocalStorage: {
                            get: function() {
                                return e
                            },
                            set: function(a) {
                                I && (e = a, a ? n.bind(window, "unload", d) : n.unbind(window, "unload", d), localStorage.setItem(t(c, "isLocal"), a))
                            }
                        }
                    }), o.isUndefined(a.parent)) {
                    if (a.closed = !1, n.addClass(this.domElement, M.CLASS_MAIN), n.makeSelectable(this.domElement, !1), I && e) {
                        c.useLocalStorage = !0;
                        var f = localStorage.getItem(t(this, "gui"));
                        f && (a.load = JSON.parse(f))
                    }
                    this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = M.TEXT_CLOSED, n.addClass(this.__closeButton, M.CLASS_CLOSE_BUTTON), this.domElement.appendChild(this.__closeButton), n.bind(this.__closeButton, "click", function() {
                        c.closed = !c.closed
                    })
                } else {
                    void 0 === a.closed && (a.closed = !0);
                    var g = document.createTextNode(a.name);
                    n.addClass(g, "controller-name");
                    var h = q(c, g),
                        i = function(a) {
                            return a.preventDefault(), c.closed = !c.closed, !1
                        };
                    n.addClass(this.__ul, M.CLASS_CLOSED), n.addClass(h, "title"), n.bind(h, "click", i), a.closed || (this.closed = !1)
                }
                a.autoPlace && (o.isUndefined(a.parent) && (J && (D = document.createElement("div"), n.addClass(D, E), n.addClass(D, M.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(D), J = !1), D.appendChild(this.domElement), n.addClass(this.domElement, M.CLASS_AUTO_PLACE)), this.parent || w(c, a.width)), n.bind(window, "resize", function() {
                    c.onResize()
                }), n.bind(this.__ul, "webkitTransitionEnd", function() {
                    c.onResize()
                }), n.bind(this.__ul, "transitionend", function() {
                    c.onResize()
                }), n.bind(this.__ul, "oTransitionEnd", function() {
                    c.onResize()
                }), this.onResize(), a.resizable && v(this), d = function() {
                    I && "true" === localStorage.getItem(t(c, "isLocal")) && localStorage.setItem(t(c, "gui"), JSON.stringify(c.getSaveObject()))
                }, this.saveToLocalStorageIfPossible = d;
                c.getRoot();
                a.parent || b()
            };
        return M.toggleHide = function() {
            K = !K, o.each(L, function(a) {
                a.domElement.style.zIndex = K ? -999 : 999, a.domElement.style.opacity = K ? 0 : 1
            })
        }, M.CLASS_AUTO_PLACE = "a", M.CLASS_AUTO_PLACE_CONTAINER = "ac", M.CLASS_MAIN = "main", M.CLASS_CONTROLLER_ROW = "cr", M.CLASS_TOO_TALL = "taller-than-window", M.CLASS_CLOSED = "closed", M.CLASS_CLOSE_BUTTON = "close-button", M.CLASS_DRAG = "drag", M.DEFAULT_WIDTH = 245, M.TEXT_CLOSED = "Close Controls", M.TEXT_OPEN = "Open Controls", n.bind(window, "keydown", function(a) {
            "text" === document.activeElement.type || a.which !== F && a.keyCode != F || M.toggleHide()
        }, !1), o.extend(M.prototype, {
            add: function(a, b) {
                return p(this, a, b, {
                    factoryArgs: Array.prototype.slice.call(arguments, 2)
                })
            },
            addColor: function(a, b) {
                return p(this, a, b, {
                    color: !0
                })
            },
            remove: function(a) {
                this.__ul.removeChild(a.__li), this.__controllers.splice(this.__controllers.indexOf(a), 1);
                var b = this;
                o.defer(function() {
                    b.onResize()
                })
            },
            destroy: function() {
                this.autoPlace && D.removeChild(this.domElement)
            },
            addFolder: function(a) {
                if (void 0 !== this.__folders[a]) throw new Error('You already have a folder in this GUI by the name "' + a + '"');
                var b = {
                    name: a,
                    parent: this
                };
                b.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[a] && (b.closed = this.load.folders[a].closed, b.load = this.load.folders[a]);
                var c = new M(b);
                this.__folders[a] = c;
                var d = q(this, c.domElement);
                return n.addClass(d, "folder"), c
            },
            open: function() {
                this.closed = !1
            },
            close: function() {
                this.closed = !0
            },
            onResize: function() {
                var a = this.getRoot();
                if (a.scrollable) {
                    var b = n.getOffset(a.__ul).top,
                        c = 0;
                    o.each(a.__ul.childNodes, function(b) {
                        a.autoPlace && b === a.__save_row || (c += n.getHeight(b))
                    }), window.innerHeight - b - G < c ? (n.addClass(a.domElement, M.CLASS_TOO_TALL), a.__ul.style.height = window.innerHeight - b - G + "px") : (n.removeClass(a.domElement, M.CLASS_TOO_TALL), a.__ul.style.height = "auto")
                }
                a.__resize_handle && o.defer(function() {
                    a.__resize_handle.style.height = a.__ul.offsetHeight + "px"
                }), a.__closeButton && (a.__closeButton.style.width = a.width + "px")
            },
            remember: function() {
                if (o.isUndefined(C) && (C = new m, C.domElement.innerHTML = b), this.parent) throw new Error("You can only call remember on a top level GUI.");
                var a = this;
                o.each(Array.prototype.slice.call(arguments), function(b) {
                    0 == a.__rememberedObjects.length && u(a), -1 == a.__rememberedObjects.indexOf(b) && a.__rememberedObjects.push(b)
                }), this.autoPlace && w(this, this.width)
            },
            getRoot: function() {
                for (var a = this; a.parent;) a = a.parent;
                return a
            },
            getSaveObject: function() {
                var a = this.load;
                return a.closed = this.closed, this.__rememberedObjects.length > 0 && (a.preset = this.preset, a.remembered || (a.remembered = {}), a.remembered[this.preset] = x(this)), a.folders = {}, o.each(this.__folders, function(b, c) {
                    a.folders[c] = b.getSaveObject()
                }), a
            },
            save: function() {
                this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = x(this), A(this, !1), this.saveToLocalStorageIfPossible()
            },
            saveAs: function(a) {
                this.load.remembered || (this.load.remembered = {}, this.load.remembered[H] = x(this, !0)), this.load.remembered[a] = x(this), this.preset = a, y(this, a, !0), this.saveToLocalStorageIfPossible()
            },
            revert: function(a) {
                o.each(this.__controllers, function(b) {
                    this.getRoot().load.remembered ? s(a || this.getRoot(), b) : b.setValue(b.initialValue)
                }, this), o.each(this.__folders, function(a) {
                    a.revert(a)
                }), a || A(this.getRoot(), !1)
            },
            listen: function(a) {
                var b = 0 == this.__listening.length;
                this.__listening.push(a), b && B(this.__listening)
            }
        }), M
    }(dat.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg {\n  /** Clear list styles */\n  /* Auto-place container */\n  /* Auto-placed GUI's */\n  /* Line items that don't contain folders. */\n  /** Folder names */\n  /** Hides closed items */\n  /** Controller row */\n  /** Name-half (left) */\n  /** Controller-half (right) */\n  /** Controller placement */\n  /** Shorter number boxes when slider is present. */\n  /** Ensure the entire boolean and function row shows a hand */ }\n  .dg ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    clear: both; }\n  .dg.ac {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 0;\n    z-index: 0; }\n  .dg:not(.ac) .main {\n    /** Exclude mains in ac so that we don't hide close button */\n    overflow: hidden; }\n  .dg.main {\n    -webkit-transition: opacity 0.1s linear;\n    -o-transition: opacity 0.1s linear;\n    -moz-transition: opacity 0.1s linear;\n    transition: opacity 0.1s linear; }\n    .dg.main.taller-than-window {\n      overflow-y: auto; }\n      .dg.main.taller-than-window .close-button {\n        opacity: 1;\n        /* TODO, these are style notes */\n        margin-top: -1px;\n        border-top: 1px solid #2c2c2c; }\n    .dg.main ul.closed .close-button {\n      opacity: 1 !important; }\n    .dg.main:hover .close-button,\n    .dg.main .close-button.drag {\n      opacity: 1; }\n    .dg.main .close-button {\n      /*opacity: 0;*/\n      -webkit-transition: opacity 0.1s linear;\n      -o-transition: opacity 0.1s linear;\n      -moz-transition: opacity 0.1s linear;\n      transition: opacity 0.1s linear;\n      border: 0;\n      position: absolute;\n      line-height: 19px;\n      height: 20px;\n      /* TODO, these are style notes */\n      cursor: pointer;\n      text-align: center;\n      background-color: #000; }\n      .dg.main .close-button:hover {\n        background-color: #111; }\n  .dg.a {\n    float: right;\n    margin-right: 15px;\n    overflow-x: hidden; }\n    .dg.a.has-save > ul {\n      margin-top: 27px; }\n      .dg.a.has-save > ul.closed {\n        margin-top: 0; }\n    .dg.a .save-row {\n      position: fixed;\n      top: 0;\n      z-index: 1002; }\n  .dg li {\n    -webkit-transition: height 0.1s ease-out;\n    -o-transition: height 0.1s ease-out;\n    -moz-transition: height 0.1s ease-out;\n    transition: height 0.1s ease-out; }\n  .dg li:not(.folder) {\n    cursor: auto;\n    height: 27px;\n    line-height: 27px;\n    overflow: hidden;\n    padding: 0 4px 0 5px; }\n  .dg li.folder {\n    padding: 0;\n    border-left: 4px solid rgba(0, 0, 0, 0); }\n  .dg li.title {\n    cursor: pointer;\n    margin-left: -4px; }\n  .dg .closed li:not(.title),\n  .dg .closed ul li,\n  .dg .closed ul li > * {\n    height: 0;\n    overflow: hidden;\n    border: 0; }\n  .dg .cr {\n    clear: both;\n    padding-left: 3px;\n    height: 27px; }\n  .dg .property-name {\n    cursor: default;\n    float: left;\n    clear: left;\n    width: 40%;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n  .dg .c {\n    float: left;\n    width: 60%; }\n  .dg .c input[type=text] {\n    border: 0;\n    margin-top: 4px;\n    padding: 3px;\n    width: 100%;\n    float: right; }\n  .dg .has-slider input[type=text] {\n    width: 30%;\n    /*display: none;*/\n    margin-left: 0; }\n  .dg .slider {\n    float: left;\n    width: 66%;\n    margin-left: -5px;\n    margin-right: 0;\n    height: 19px;\n    margin-top: 4px; }\n  .dg .slider-fg {\n    height: 100%; }\n  .dg .c input[type=checkbox] {\n    margin-top: 9px; }\n  .dg .c select {\n    margin-top: 5px; }\n  .dg .cr.function,\n  .dg .cr.function .property-name,\n  .dg .cr.function *,\n  .dg .cr.boolean,\n  .dg .cr.boolean * {\n    cursor: pointer; }\n  .dg .selector {\n    display: none;\n    position: absolute;\n    margin-left: -9px;\n    margin-top: 23px;\n    z-index: 10; }\n  .dg .c:hover .selector,\n  .dg .selector.drag {\n    display: block; }\n  .dg li.save-row {\n    padding: 0; }\n    .dg li.save-row .button {\n      display: inline-block;\n      padding: 0px 6px; }\n  .dg.dialogue {\n    background-color: #222;\n    width: 460px;\n    padding: 15px;\n    font-size: 13px;\n    line-height: 15px; }\n\n/* TODO Separate style and structure */\n#dg-new-constructor {\n  padding: 10px;\n  color: #222;\n  font-family: Monaco, monospace;\n  font-size: 10px;\n  border: 0;\n  resize: none;\n  box-shadow: inset 1px 1px 1px #888;\n  word-wrap: break-word;\n  margin: 12px 0;\n  display: block;\n  width: 440px;\n  overflow-y: scroll;\n  height: 100px;\n  position: relative; }\n\n#dg-local-explain {\n  display: none;\n  font-size: 11px;\n  line-height: 17px;\n  border-radius: 3px;\n  background-color: #333;\n  padding: 8px;\n  margin-top: 10px; }\n  #dg-local-explain code {\n    font-size: 10px; }\n\n#dat-gui-save-locally {\n  display: none; }\n\n/** Main type */\n.dg {\n  color: #eee;\n  font: 11px 'Lucida Grande', sans-serif;\n  text-shadow: 0 -1px 0 #111;\n  /** Auto place */\n  /* Controller row, <li> */\n  /** Controllers */ }\n  .dg.main {\n    /** Scrollbar */ }\n    .dg.main::-webkit-scrollbar {\n      width: 5px;\n      background: #1a1a1a; }\n    .dg.main::-webkit-scrollbar-corner {\n      height: 0;\n      display: none; }\n    .dg.main::-webkit-scrollbar-thumb {\n      border-radius: 5px;\n      background: #676767; }\n  .dg li:not(.folder) {\n    background: #1a1a1a;\n    border-bottom: 1px solid #2c2c2c; }\n  .dg li.save-row {\n    line-height: 25px;\n    background: #dad5cb;\n    border: 0; }\n    .dg li.save-row select {\n      margin-left: 5px;\n      width: 108px; }\n    .dg li.save-row .button {\n      margin-left: 5px;\n      margin-top: 1px;\n      border-radius: 2px;\n      font-size: 9px;\n      line-height: 7px;\n      padding: 4px 4px 5px 4px;\n      background: #c5bdad;\n      color: #fff;\n      text-shadow: 0 1px 0 #b0a58f;\n      box-shadow: 0 -1px 0 #b0a58f;\n      cursor: pointer; }\n      .dg li.save-row .button.gears {\n        background: #c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;\n        height: 7px;\n        width: 8px; }\n      .dg li.save-row .button:hover {\n        background-color: #bab19e;\n        box-shadow: 0 -1px 0 #b0a58f; }\n  .dg li.folder {\n    border-bottom: 0; }\n  .dg li.title {\n    padding-left: 16px;\n    background: black url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;\n    cursor: pointer;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.2); }\n  .dg .closed li.title {\n    background-image: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==); }\n  .dg .cr.boolean {\n    border-left: 3px solid #806787; }\n  .dg .cr.function {\n    border-left: 3px solid #e61d5f; }\n  .dg .cr.number {\n    border-left: 3px solid #2fa1d6; }\n    .dg .cr.number input[type=text] {\n      color: #2fa1d6; }\n  .dg .cr.string {\n    border-left: 3px solid #1ed36f; }\n    .dg .cr.string input[type=text] {\n      color: #1ed36f; }\n  .dg .cr.function:hover, .dg .cr.boolean:hover {\n    background: #111; }\n  .dg .c input[type=text] {\n    background: #303030;\n    outline: none; }\n    .dg .c input[type=text]:hover {\n      background: #3c3c3c; }\n    .dg .c input[type=text]:focus {\n      background: #494949;\n      color: #fff; }\n  .dg .c .slider {\n    background: #303030;\n    cursor: ew-resize; }\n  .dg .c .slider-fg {\n    background: #2fa1d6; }\n  .dg .c .slider:hover {\n    background: #3c3c3c; }\n    .dg .c .slider:hover .slider-fg {\n      background: #44abda; }\n", dat.controllers.factory = function(a, b, c, d, e, f, g) {
        return function(h, i) {
            var j = h[i];
            return g.isArray(arguments[2]) || g.isObject(arguments[2]) ? new a(h, i, arguments[2]) : g.isNumber(j) ? g.isNumber(arguments[2]) && g.isNumber(arguments[3]) ? new c(h, i, arguments[2], arguments[3]) : new b(h, i, {
                min: arguments[2],
                max: arguments[3]
            }) : g.isString(j) ? new d(h, i) : g.isFunction(j) ? new e(h, i, "") : g.isBoolean(j) ? new f(h, i) : void 0
        }
    }(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = function(a, b, c) {
        var d = function(a, c) {
            function e() {
                g.setValue(g.__input.value)
            }

            function f() {
                g.__onFinishChange && g.__onFinishChange.call(g, g.getValue())
            }
            d.superclass.call(this, a, c);
            var g = this;
            this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), b.bind(this.__input, "keyup", e), b.bind(this.__input, "change", e), b.bind(this.__input, "blur", f), b.bind(this.__input, "keydown", function(a) {
                13 === a.keyCode && this.blur()
            }), this.updateDisplay(), this.domElement.appendChild(this.__input)
        };
        return d.superclass = a, c.extend(d.prototype, a.prototype, {
            updateDisplay: function() {
                return b.isActive(this.__input) || (this.__input.value = this.getValue()), d.superclass.prototype.updateDisplay.call(this)
            }
        }), d
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController, dat.controllers.ColorController = function(a, b, c, d, e) {
        function f(a, b, c, d) {
            a.style.background = "", e.each(i, function(e) {
                a.style.cssText += "background: " + e + "linear-gradient(" + b + ", " + c + " 0%, " + d + " 100%); "
            })
        }

        function g(a) {
            a.style.background = "", a.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", a.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", a.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", a.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", a.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
        }
        var h = function(a, i) {
            function j(a) {
                n(a), b.bind(window, "mousemove", n), b.bind(window, "mouseup", k)
            }

            function k() {
                b.unbind(window, "mousemove", n), b.unbind(window, "mouseup", k)
            }

            function l() {
                var a = d(this.value);
                a !== !1 ? (p.__color.__state = a, p.setValue(p.__color.toOriginal())) : this.value = p.__color.toString()
            }

            function m() {
                b.unbind(window, "mousemove", o), b.unbind(window, "mouseup", m)
            }

            function n(a) {
                a.preventDefault();
                var c = b.getWidth(p.__saturation_field),
                    d = b.getOffset(p.__saturation_field),
                    e = (a.clientX - d.left + document.body.scrollLeft) / c,
                    f = 1 - (a.clientY - d.top + document.body.scrollTop) / c;
                return f > 1 ? f = 1 : 0 > f && (f = 0), e > 1 ? e = 1 : 0 > e && (e = 0), p.__color.v = f, p.__color.s = e, p.setValue(p.__color.toOriginal()), !1
            }

            function o(a) {
                a.preventDefault();
                var c = b.getHeight(p.__hue_field),
                    d = b.getOffset(p.__hue_field),
                    e = 1 - (a.clientY - d.top + document.body.scrollTop) / c;
                return e > 1 ? e = 1 : 0 > e && (e = 0), p.__color.h = 360 * e, p.setValue(p.__color.toOriginal()), !1
            }
            h.superclass.call(this, a, i), this.__color = new c(this.getValue()), this.__temp = new c(0);
            var p = this;
            this.domElement = document.createElement("div"), b.makeSelectable(this.domElement, !1), this.__selector = document.createElement("div"), this.__selector.className = "selector", this.__saturation_field = document.createElement("div"), this.__saturation_field.className = "saturation-field", this.__field_knob = document.createElement("div"), this.__field_knob.className = "field-knob", this.__field_knob_border = "2px solid ", this.__hue_knob = document.createElement("div"), this.__hue_knob.className = "hue-knob", this.__hue_field = document.createElement("div"), this.__hue_field.className = "hue-field", this.__input = document.createElement("input"), this.__input.type = "text", this.__input_textShadow = "0 1px 1px ", b.bind(this.__input, "keydown", function(a) {
                13 === a.keyCode && l.call(this)
            }), b.bind(this.__input, "blur", l), b.bind(this.__selector, "mousedown", function(a) {
                b.addClass(this, "drag").bind(window, "mouseup", function(a) {
                    b.removeClass(p.__selector, "drag")
                })
            });
            var q = document.createElement("div");
            e.extend(this.__selector.style, {
                width: "122px",
                height: "102px",
                padding: "3px",
                backgroundColor: "#222",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
            }), e.extend(this.__field_knob.style, {
                position: "absolute",
                width: "12px",
                height: "12px",
                border: this.__field_knob_border + (this.__color.v < .5 ? "#fff" : "#000"),
                boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                borderRadius: "12px",
                zIndex: 1
            }), e.extend(this.__hue_knob.style, {
                position: "absolute",
                width: "15px",
                height: "2px",
                borderRight: "4px solid #fff",
                zIndex: 1
            }), e.extend(this.__saturation_field.style, {
                width: "100px",
                height: "100px",
                border: "1px solid #555",
                marginRight: "3px",
                display: "inline-block",
                cursor: "pointer"
            }), e.extend(q.style, {
                width: "100%",
                height: "100%",
                background: "none"
            }), f(q, "top", "rgba(0,0,0,0)", "#000"), e.extend(this.__hue_field.style, {
                width: "15px",
                height: "100px",
                display: "inline-block",
                border: "1px solid #555",
                cursor: "ns-resize"
            }), g(this.__hue_field), e.extend(this.__input.style, {
                outline: "none",
                textAlign: "center",
                color: "#fff",
                border: 0,
                fontWeight: "bold",
                textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
            }), b.bind(this.__saturation_field, "mousedown", j), b.bind(this.__field_knob, "mousedown", j), b.bind(this.__hue_field, "mousedown", function(a) {
                o(a), b.bind(window, "mousemove", o), b.bind(window, "mouseup", m)
            }), this.__saturation_field.appendChild(q), this.__selector.appendChild(this.__field_knob), this.__selector.appendChild(this.__saturation_field), this.__selector.appendChild(this.__hue_field), this.__hue_field.appendChild(this.__hue_knob), this.domElement.appendChild(this.__input), this.domElement.appendChild(this.__selector), this.updateDisplay()
        };
        h.superclass = a, e.extend(h.prototype, a.prototype, {
            updateDisplay: function() {
                var a = d(this.getValue());
                if (a !== !1) {
                    var b = !1;
                    e.each(c.COMPONENTS, function(c) {
                        return e.isUndefined(a[c]) || e.isUndefined(this.__color.__state[c]) || a[c] === this.__color.__state[c] ? void 0 : (b = !0, {})
                    }, this), b && e.extend(this.__color.__state, a)
                }
                e.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                var g = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0,
                    h = 255 - g;
                e.extend(this.__field_knob.style, {
                    marginLeft: 100 * this.__color.s - 7 + "px",
                    marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                    backgroundColor: this.__temp.toString(),
                    border: this.__field_knob_border + "rgb(" + g + "," + g + "," + g + ")"
                }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, f(this.__saturation_field, "left", "#fff", this.__temp.toString()), e.extend(this.__input.style, {
                    backgroundColor: this.__input.value = this.__color.toString(),
                    color: "rgb(" + g + "," + g + "," + g + ")",
                    textShadow: this.__input_textShadow + "rgba(" + h + "," + h + "," + h + ",.7)"
                })
            }
        });
        var i = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
        return h
    }(dat.controllers.Controller, dat.dom.dom, dat.color.Color = function(a, b, c, d) {
        function e(a, b, c) {
            Object.defineProperty(a, b, {
                get: function() {
                    return "RGB" === this.__state.space ? this.__state[b] : (g(this, b, c), this.__state[b])
                },
                set: function(a) {
                    "RGB" !== this.__state.space && (g(this, b, c), this.__state.space = "RGB"), this.__state[b] = a
                }
            })
        }

        function f(a, b) {
            Object.defineProperty(a, b, {
                get: function() {
                    return "HSV" === this.__state.space ? this.__state[b] : (h(this), this.__state[b])
                },
                set: function(a) {
                    "HSV" !== this.__state.space && (h(this), this.__state.space = "HSV"), this.__state[b] = a
                }
            })
        }

        function g(a, c, e) {
            if ("HEX" === a.__state.space) a.__state[c] = b.component_from_hex(a.__state.hex, e);
            else {
                if ("HSV" !== a.__state.space) throw "Corrupted color state";
                d.extend(a.__state, b.hsv_to_rgb(a.__state.h, a.__state.s, a.__state.v))
            }
        }

        function h(a) {
            var c = b.rgb_to_hsv(a.r, a.g, a.b);
            d.extend(a.__state, {
                s: c.s,
                v: c.v
            }), d.isNaN(c.h) ? d.isUndefined(a.__state.h) && (a.__state.h = 0) : a.__state.h = c.h
        }
        var i = function() {
            if (this.__state = a.apply(this, arguments), this.__state === !1) throw "Failed to interpret color arguments";
            this.__state.a = this.__state.a || 1
        };
        return i.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], d.extend(i.prototype, {
            toString: function() {
                return c(this)
            },
            toOriginal: function() {
                return this.__state.conversion.write(this)
            }
        }), e(i.prototype, "r", 2), e(i.prototype, "g", 1), e(i.prototype, "b", 0), f(i.prototype, "h"), f(i.prototype, "s"), f(i.prototype, "v"), Object.defineProperty(i.prototype, "a", {
            get: function() {
                return this.__state.a
            },
            set: function(a) {
                this.__state.a = a
            }
        }), Object.defineProperty(i.prototype, "hex", {
            get: function() {
                return "HEX" !== !this.__state.space && (this.__state.hex = b.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
            },
            set: function(a) {
                this.__state.space = "HEX", this.__state.hex = a
            }
        }), i
    }(dat.color.interpret, dat.color.math = function() {
        var a;
        return {
            hsv_to_rgb: function(a, b, c) {
                var d = Math.floor(a / 60) % 6,
                    e = a / 60 - Math.floor(a / 60),
                    f = c * (1 - b),
                    g = c * (1 - e * b),
                    h = c * (1 - (1 - e) * b),
                    i = [
                        [c, h, f],
                        [g, c, f],
                        [f, c, h],
                        [f, g, c],
                        [h, f, c],
                        [c, f, g]
                    ][d];
                return {
                    r: 255 * i[0],
                    g: 255 * i[1],
                    b: 255 * i[2]
                }
            },
            rgb_to_hsv: function(a, b, c) {
                var d, e, f = Math.min(a, b, c),
                    g = Math.max(a, b, c),
                    h = g - f;
                return 0 == g ? {
                    h: NaN,
                    s: 0,
                    v: 0
                } : (e = h / g, d = a == g ? (b - c) / h : b == g ? 2 + (c - a) / h : 4 + (a - b) / h, d /= 6, 0 > d && (d += 1), {
                    h: 360 * d,
                    s: e,
                    v: g / 255
                })
            },
            rgb_to_hex: function(a, b, c) {
                var d = this.hex_with_component(0, 2, a);
                return d = this.hex_with_component(d, 1, b), d = this.hex_with_component(d, 0, c)
            },
            component_from_hex: function(a, b) {
                return a >> 8 * b & 255
            },
            hex_with_component: function(b, c, d) {
                return d << (a = 8 * c) | b & ~(255 << a)
            }
        }
    }(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a, b) {
            window.setTimeout(a, 1e3 / 60)
        }
    }(), dat.dom.CenteredDiv = function(a, b) {
        var c = function() {
            this.backgroundElement = document.createElement("div"), b.extend(this.backgroundElement.style, {
                backgroundColor: "rgba(0,0,0,0.8)",
                top: 0,
                left: 0,
                display: "none",
                zIndex: "1000",
                opacity: 0,
                WebkitTransition: "opacity 0.2s linear",
                transition: "opacity 0.2s linear"
            }), a.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), b.extend(this.domElement.style, {
                position: "fixed",
                display: "none",
                zIndex: "1001",
                opacity: 0,
                WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear",
                transition: "transform 0.2s ease-out, opacity 0.2s linear"
            }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
            var c = this;
            a.bind(this.backgroundElement, "click", function() {
                c.hide()
            })
        };
        return c.prototype.show = function() {
            var a = this;
            this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), b.defer(function() {
                a.backgroundElement.style.opacity = 1, a.domElement.style.opacity = 1, a.domElement.style.webkitTransform = "scale(1)"
            })
        }, c.prototype.hide = function() {
            var b = this,
                c = function() {
                    b.domElement.style.display = "none", b.backgroundElement.style.display = "none", a.unbind(b.domElement, "webkitTransitionEnd", c), a.unbind(b.domElement, "transitionend", c), a.unbind(b.domElement, "oTransitionEnd", c)
                };
            a.bind(this.domElement, "webkitTransitionEnd", c), a.bind(this.domElement, "transitionend", c), a.bind(this.domElement, "oTransitionEnd", c), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
        }, c.prototype.layout = function() {
            this.domElement.style.left = window.innerWidth / 2 - a.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - a.getHeight(this.domElement) / 2 + "px"
        }, c
    }(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common),
    function(a, b) {
        function c(a) {
            var b = a.length,
                c = ka.type(a);
            return ka.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || "function" !== c && (0 === b || "number" == typeof b && b > 0 && b - 1 in a)
        }

        function d(a) {
            var b = za[a] = {};
            return ka.each(a.match(ma) || [], function(a, c) {
                b[c] = !0
            }), b
        }

        function e(a, c, d, e) {
            if (ka.acceptData(a)) {
                var f, g, h = ka.expando,
                    i = a.nodeType,
                    j = i ? ka.cache : a,
                    k = i ? a[h] : a[h] && h;
                if (k && j[k] && (e || j[k].data) || d !== b || "string" != typeof c) return k || (k = i ? a[h] = ba.pop() || ka.guid++ : h), j[k] || (j[k] = i ? {} : {
                    toJSON: ka.noop
                }), ("object" == typeof c || "function" == typeof c) && (e ? j[k] = ka.extend(j[k], c) : j[k].data = ka.extend(j[k].data, c)), g = j[k], e || (g.data || (g.data = {}), g = g.data), d !== b && (g[ka.camelCase(c)] = d), "string" == typeof c ? (f = g[c], null == f && (f = g[ka.camelCase(c)])) : f = g, f
            }
        }

        function f(a, b, c) {
            if (ka.acceptData(a)) {
                var d, e, f = a.nodeType,
                    g = f ? ka.cache : a,
                    i = f ? a[ka.expando] : ka.expando;
                if (g[i]) {
                    if (b && (d = c ? g[i] : g[i].data)) {
                        ka.isArray(b) ? b = b.concat(ka.map(b, ka.camelCase)) : b in d ? b = [b] : (b = ka.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                        for (; e--;) delete d[b[e]];
                        if (c ? !h(d) : !ka.isEmptyObject(d)) return
                    }(c || (delete g[i].data, h(g[i]))) && (f ? ka.cleanData([a], !0) : ka.support.deleteExpando || g != g.window ? delete g[i] : g[i] = null)
                }
            }
        }

        function g(a, c, d) {
            if (d === b && 1 === a.nodeType) {
                var e = "data-" + c.replace(Ba, "-$1").toLowerCase();
                if (d = a.getAttribute(e), "string" == typeof d) {
                    try {
                        d = "true" === d ? !0 : "false" === d ? !1 : "null" === d ? null : +d + "" === d ? +d : Aa.test(d) ? ka.parseJSON(d) : d
                    } catch (f) {}
                    ka.data(a, c, d)
                } else d = b
            }
            return d
        }

        function h(a) {
            var b;
            for (b in a)
                if (("data" !== b || !ka.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
            return !0
        }

        function i() {
            return !0
        }

        function j() {
            return !1
        }

        function k() {
            try {
                return Y.activeElement
            } catch (a) {}
        }

        function l(a, b) {
            do a = a[b]; while (a && 1 !== a.nodeType);
            return a
        }

        function m(a, b, c) {
            if (ka.isFunction(b)) return ka.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
            if (b.nodeType) return ka.grep(a, function(a) {
                return a === b !== c
            });
            if ("string" == typeof b) {
                if (Qa.test(b)) return ka.filter(b, a, c);
                b = ka.filter(b, a)
            }
            return ka.grep(a, function(a) {
                return ka.inArray(a, b) >= 0 !== c
            })
        }

        function n(a) {
            var b = Ua.split("|"),
                c = a.createDocumentFragment();
            if (c.createElement)
                for (; b.length;) c.createElement(b.pop());
            return c
        }

        function o(a, b) {
            return ka.nodeName(a, "table") && ka.nodeName(1 === b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
        }

        function p(a) {
            return a.type = (null !== ka.find.attr(a, "type")) + "/" + a.type, a
        }

        function q(a) {
            var b = eb.exec(a.type);
            return b ? a.type = b[1] : a.removeAttribute("type"), a
        }

        function r(a, b) {
            for (var c, d = 0; null != (c = a[d]); d++) ka._data(c, "globalEval", !b || ka._data(b[d], "globalEval"))
        }

        function s(a, b) {
            if (1 === b.nodeType && ka.hasData(a)) {
                var c, d, e, f = ka._data(a),
                    g = ka._data(b, f),
                    h = f.events;
                if (h) {
                    delete g.handle, g.events = {};
                    for (c in h)
                        for (d = 0, e = h[c].length; e > d; d++) ka.event.add(b, c, h[c][d])
                }
                g.data && (g.data = ka.extend({}, g.data))
            }
        }

        function t(a, b) {
            var c, d, e;
            if (1 === b.nodeType) {
                if (c = b.nodeName.toLowerCase(), !ka.support.noCloneEvent && b[ka.expando]) {
                    e = ka._data(b);
                    for (d in e.events) ka.removeEvent(b, d, e.handle);
                    b.removeAttribute(ka.expando)
                }
                "script" === c && b.text !== a.text ? (p(b).text = a.text, q(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), ka.support.html5Clone && a.innerHTML && !ka.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && bb.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
            }
        }

        function u(a, c) {
            var d, e, f = 0,
                g = typeof a.getElementsByTagName !== W ? a.getElementsByTagName(c || "*") : typeof a.querySelectorAll !== W ? a.querySelectorAll(c || "*") : b;
            if (!g)
                for (g = [], d = a.childNodes || a; null != (e = d[f]); f++) !c || ka.nodeName(e, c) ? g.push(e) : ka.merge(g, u(e, c));
            return c === b || c && ka.nodeName(a, c) ? ka.merge([a], g) : g
        }

        function v(a) {
            bb.test(a.type) && (a.defaultChecked = a.checked)
        }

        function w(a, b) {
            if (b in a) return b;
            for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = yb.length; e--;)
                if (b = yb[e] + c, b in a) return b;
            return d
        }

        function x(a, b) {
            return a = b || a, "none" === ka.css(a, "display") || !ka.contains(a.ownerDocument, a)
        }

        function y(a, b) {
            for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = ka._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && x(d) && (f[g] = ka._data(d, "olddisplay", C(d.nodeName)))) : f[g] || (e = x(d), (c && "none" !== c || !e) && ka._data(d, "olddisplay", e ? c : ka.css(d, "display"))));
            for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
            return a
        }

        function z(a, b, c) {
            var d = rb.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
        }

        function A(a, b, c, d, e) {
            for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += ka.css(a, c + xb[f], !0, e)), d ? ("content" === c && (g -= ka.css(a, "padding" + xb[f], !0, e)), "margin" !== c && (g -= ka.css(a, "border" + xb[f] + "Width", !0, e))) : (g += ka.css(a, "padding" + xb[f], !0, e), "padding" !== c && (g += ka.css(a, "border" + xb[f] + "Width", !0, e)));
            return g
        }

        function B(a, b, c) {
            var d = !0,
                e = "width" === b ? a.offsetWidth : a.offsetHeight,
                f = kb(a),
                g = ka.support.boxSizing && "border-box" === ka.css(a, "boxSizing", !1, f);
            if (0 >= e || null == e) {
                if (e = lb(a, b, f), (0 > e || null == e) && (e = a.style[b]), sb.test(e)) return e;
                d = g && (ka.support.boxSizingReliable || e === a.style[b]), e = parseFloat(e) || 0
            }
            return e + A(a, b, c || (g ? "border" : "content"), d, f) + "px"
        }

        function C(a) {
            var b = Y,
                c = ub[a];
            return c || (c = D(a, b), "none" !== c && c || (jb = (jb || ka("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(b.documentElement), b = (jb[0].contentWindow || jb[0].contentDocument).document, b.write("<!doctype html><html><body>"), b.close(), c = D(a, b), jb.detach()), ub[a] = c), c
        }

        function D(a, b) {
            var c = ka(b.createElement(a)).appendTo(b.body),
                d = ka.css(c[0], "display");
            return c.remove(), d
        }

        function E(a, b, c, d) {
            var e;
            if (ka.isArray(b)) ka.each(b, function(b, e) {
                c || Ab.test(a) ? d(a, e) : E(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            });
            else if (c || "object" !== ka.type(b)) d(a, b);
            else
                for (e in b) E(a + "[" + e + "]", b[e], c, d)
        }

        function F(a) {
            return function(b, c) {
                "string" != typeof b && (c = b, b = "*");
                var d, e = 0,
                    f = b.toLowerCase().match(ma) || [];
                if (ka.isFunction(c))
                    for (; d = f[e++];) "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
            }
        }

        function G(a, c, d, e) {
            function f(i) {
                var j;
                return g[i] = !0, ka.each(a[i] || [], function(a, i) {
                    var k = i(c, d, e);
                    return "string" != typeof k || h || g[k] ? h ? !(j = k) : b : (c.dataTypes.unshift(k), f(k), !1)
                }), j
            }
            var g = {},
                h = a === Rb;
            return f(c.dataTypes[0]) || !g["*"] && f("*")
        }

        function H(a, c) {
            var d, e, f = ka.ajaxSettings.flatOptions || {};
            for (e in c) c[e] !== b && ((f[e] ? a : d || (d = {}))[e] = c[e]);
            return d && ka.extend(!0, a, d), a
        }

        function I(a, c, d) {
            for (var e, f, g, h, i = a.contents, j = a.dataTypes;
                "*" === j[0];) j.shift(), f === b && (f = a.mimeType || c.getResponseHeader("Content-Type"));
            if (f)
                for (h in i)
                    if (i[h] && i[h].test(f)) {
                        j.unshift(h);
                        break
                    }
            if (j[0] in d) g = j[0];
            else {
                for (h in d) {
                    if (!j[0] || a.converters[h + " " + j[0]]) {
                        g = h;
                        break
                    }
                    e || (e = h)
                }
                g = g || e
            }
            return g ? (g !== j[0] && j.unshift(g), d[g]) : b
        }

        function J(a, b, c, d) {
            var e, f, g, h, i, j = {},
                k = a.dataTypes.slice();
            if (k[1])
                for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
            for (f = k.shift(); f;)
                if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                    if ("*" === f) f = i;
                    else if ("*" !== i && i !== f) {
                if (g = j[i + " " + f] || j["* " + f], !g)
                    for (e in j)
                        if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                            g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                            break
                        }
                if (g !== !0)
                    if (g && a["throws"]) b = g(b);
                    else try {
                        b = g(b)
                    } catch (l) {
                        return {
                            state: "parsererror",
                            error: g ? l : "No conversion from " + i + " to " + f
                        }
                    }
            }
            return {
                state: "success",
                data: b
            }
        }

        function K() {
            try {
                return new a.XMLHttpRequest
            } catch (b) {}
        }

        function L() {
            try {
                return new a.ActiveXObject("Microsoft.XMLHTTP")
            } catch (b) {}
        }

        function M() {
            return setTimeout(function() {
                $b = b
            }), $b = ka.now()
        }

        function N(a, b, c) {
            for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++)
                if (d = e[f].call(c, b, a)) return d
        }

        function O(a, b, c) {
            var d, e, f = 0,
                g = dc.length,
                h = ka.Deferred().always(function() {
                    delete i.elem
                }),
                i = function() {
                    if (e) return !1;
                    for (var b = $b || M(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                    return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
                },
                j = h.promise({
                    elem: a,
                    props: ka.extend({}, b),
                    opts: ka.extend(!0, {
                        specialEasing: {}
                    }, c),
                    originalProperties: b,
                    originalOptions: c,
                    startTime: $b || M(),
                    duration: c.duration,
                    tweens: [],
                    createTween: function(b, c) {
                        var d = ka.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                        return j.tweens.push(d), d
                    },
                    stop: function(b) {
                        var c = 0,
                            d = b ? j.tweens.length : 0;
                        if (e) return this;
                        for (e = !0; d > c; c++) j.tweens[c].run(1);
                        return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                    }
                }),
                k = j.props;
            for (P(k, j.opts.specialEasing); g > f; f++)
                if (d = dc[f].call(j, a, k, j.opts)) return d;
            return ka.map(k, N, j), ka.isFunction(j.opts.start) && j.opts.start.call(a, j), ka.fx.timer(ka.extend(i, {
                elem: a,
                anim: j,
                queue: j.opts.queue
            })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
        }

        function P(a, b) {
            var c, d, e, f, g;
            for (c in a)
                if (d = ka.camelCase(c), e = b[d], f = a[c], ka.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = ka.cssHooks[d], g && "expand" in g) {
                    f = g.expand(f), delete a[d];
                    for (c in f) c in a || (a[c] = f[c], b[c] = e)
                } else b[d] = e
        }

        function Q(a, b, c) {
            var d, e, f, g, h, i, j = this,
                k = {},
                l = a.style,
                m = a.nodeType && x(a),
                n = ka._data(a, "fxshow");
            c.queue || (h = ka._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
                h.unqueued || i()
            }), h.unqueued++, j.always(function() {
                j.always(function() {
                    h.unqueued--, ka.queue(a, "fx").length || h.empty.fire()
                })
            })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [l.overflow, l.overflowX, l.overflowY], "inline" === ka.css(a, "display") && "none" === ka.css(a, "float") && (ka.support.inlineBlockNeedsLayout && "inline" !== C(a.nodeName) ? l.zoom = 1 : l.display = "inline-block")), c.overflow && (l.overflow = "hidden", ka.support.shrinkWrapBlocks || j.always(function() {
                l.overflow = c.overflow[0], l.overflowX = c.overflow[1], l.overflowY = c.overflow[2]
            }));
            for (d in b)
                if (e = b[d], ac.exec(e)) {
                    if (delete b[d], f = f || "toggle" === e, e === (m ? "hide" : "show")) continue;
                    k[d] = n && n[d] || ka.style(a, d)
                }
            if (!ka.isEmptyObject(k)) {
                n ? "hidden" in n && (m = n.hidden) : n = ka._data(a, "fxshow", {}), f && (n.hidden = !m), m ? ka(a).show() : j.done(function() {
                    ka(a).hide()
                }), j.done(function() {
                    var b;
                    ka._removeData(a, "fxshow");
                    for (b in k) ka.style(a, b, k[b])
                });
                for (d in k) g = N(m ? n[d] : 0, d, j), d in n || (n[d] = g.start, m && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
            }
        }

        function R(a, b, c, d, e) {
            return new R.prototype.init(a, b, c, d, e)
        }

        function S(a, b) {
            var c, d = {
                    height: a
                },
                e = 0;
            for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = xb[e], d["margin" + c] = d["padding" + c] = a;
            return b && (d.opacity = d.width = a), d
        }

        function T(a) {
            return ka.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
        }
        var U, V, W = typeof b,
            X = a.location,
            Y = a.document,
            Z = Y.documentElement,
            $ = a.jQuery,
            _ = a.$,
            aa = {},
            ba = [],
            ca = "1.10.2",
            da = ba.concat,
            ea = ba.push,
            fa = ba.slice,
            ga = ba.indexOf,
            ha = aa.toString,
            ia = aa.hasOwnProperty,
            ja = ca.trim,
            ka = function(a, b) {
                return new ka.fn.init(a, b, V)
            },
            la = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            ma = /\S+/g,
            na = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            oa = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            pa = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            qa = /^[\],:{}\s]*$/,
            ra = /(?:^|:|,)(?:\s*\[)+/g,
            sa = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            ta = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
            ua = /^-ms-/,
            va = /-([\da-z])/gi,
            wa = function(a, b) {
                return b.toUpperCase()
            },
            xa = function(a) {
                (Y.addEventListener || "load" === a.type || "complete" === Y.readyState) && (ya(), ka.ready())
            },
            ya = function() {
                Y.addEventListener ? (Y.removeEventListener("DOMContentLoaded", xa, !1), a.removeEventListener("load", xa, !1)) : (Y.detachEvent("onreadystatechange", xa), a.detachEvent("onload", xa))
            };
        ka.fn = ka.prototype = {
                jquery: ca,
                constructor: ka,
                init: function(a, c, d) {
                    var e, f;
                    if (!a) return this;
                    if ("string" == typeof a) {
                        if (e = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : oa.exec(a), !e || !e[1] && c) return !c || c.jquery ? (c || d).find(a) : this.constructor(c).find(a);
                        if (e[1]) {
                            if (c = c instanceof ka ? c[0] : c, ka.merge(this, ka.parseHTML(e[1], c && c.nodeType ? c.ownerDocument || c : Y, !0)), pa.test(e[1]) && ka.isPlainObject(c))
                                for (e in c) ka.isFunction(this[e]) ? this[e](c[e]) : this.attr(e, c[e]);
                            return this
                        }
                        if (f = Y.getElementById(e[2]), f && f.parentNode) {
                            if (f.id !== e[2]) return d.find(a);
                            this.length = 1, this[0] = f
                        }
                        return this.context = Y, this.selector = a, this
                    }
                    return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : ka.isFunction(a) ? d.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), ka.makeArray(a, this))
                },
                selector: "",
                length: 0,
                toArray: function() {
                    return fa.call(this)
                },
                get: function(a) {
                    return null == a ? this.toArray() : 0 > a ? this[this.length + a] : this[a]
                },
                pushStack: function(a) {
                    var b = ka.merge(this.constructor(), a);
                    return b.prevObject = this, b.context = this.context, b
                },
                each: function(a, b) {
                    return ka.each(this, a, b)
                },
                ready: function(a) {
                    return ka.ready.promise().done(a), this
                },
                slice: function() {
                    return this.pushStack(fa.apply(this, arguments))
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                eq: function(a) {
                    var b = this.length,
                        c = +a + (0 > a ? b : 0);
                    return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
                },
                map: function(a) {
                    return this.pushStack(ka.map(this, function(b, c) {
                        return a.call(b, c, b)
                    }))
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: ea,
                sort: [].sort,
                splice: [].splice
            }, ka.fn.init.prototype = ka.fn, ka.extend = ka.fn.extend = function() {
                var a, c, d, e, f, g, h = arguments[0] || {},
                    i = 1,
                    j = arguments.length,
                    k = !1;
                for ("boolean" == typeof h && (k = h, h = arguments[1] || {}, i = 2), "object" == typeof h || ka.isFunction(h) || (h = {}), j === i && (h = this, --i); j > i; i++)
                    if (null != (f = arguments[i]))
                        for (e in f) a = h[e], d = f[e], h !== d && (k && d && (ka.isPlainObject(d) || (c = ka.isArray(d))) ? (c ? (c = !1, g = a && ka.isArray(a) ? a : []) : g = a && ka.isPlainObject(a) ? a : {}, h[e] = ka.extend(k, g, d)) : d !== b && (h[e] = d));
                return h
            }, ka.extend({
                expando: "jQuery" + (ca + Math.random()).replace(/\D/g, ""),
                noConflict: function(b) {
                    return a.$ === ka && (a.$ = _), b && a.jQuery === ka && (a.jQuery = $), ka
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function(a) {
                    a ? ka.readyWait++ : ka.ready(!0)
                },
                ready: function(a) {
                    if (a === !0 ? !--ka.readyWait : !ka.isReady) {
                        if (!Y.body) return setTimeout(ka.ready);
                        ka.isReady = !0, a !== !0 && --ka.readyWait > 0 || (U.resolveWith(Y, [ka]), ka.fn.trigger && ka(Y).trigger("ready").off("ready"))
                    }
                },
                isFunction: function(a) {
                    return "function" === ka.type(a)
                },
                isArray: Array.isArray || function(a) {
                    return "array" === ka.type(a)
                },
                isWindow: function(a) {
                    return null != a && a == a.window
                },
                isNumeric: function(a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                type: function(a) {
                    return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? aa[ha.call(a)] || "object" : typeof a
                },
                isPlainObject: function(a) {
                    var c;
                    if (!a || "object" !== ka.type(a) || a.nodeType || ka.isWindow(a)) return !1;
                    try {
                        if (a.constructor && !ia.call(a, "constructor") && !ia.call(a.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (d) {
                        return !1
                    }
                    if (ka.support.ownLast)
                        for (c in a) return ia.call(a, c);
                    for (c in a);
                    return c === b || ia.call(a, c)
                },
                isEmptyObject: function(a) {
                    var b;
                    for (b in a) return !1;
                    return !0
                },
                error: function(a) {
                    throw Error(a)
                },
                parseHTML: function(a, b, c) {
                    if (!a || "string" != typeof a) return null;
                    "boolean" == typeof b && (c = b, b = !1), b = b || Y;
                    var d = pa.exec(a),
                        e = !c && [];
                    return d ? [b.createElement(d[1])] : (d = ka.buildFragment([a], b, e), e && ka(e).remove(), ka.merge([], d.childNodes))
                },
                parseJSON: function(c) {
                    return a.JSON && a.JSON.parse ? a.JSON.parse(c) : null === c ? c : "string" == typeof c && (c = ka.trim(c), c && qa.test(c.replace(sa, "@").replace(ta, "]").replace(ra, ""))) ? Function("return " + c)() : (ka.error("Invalid JSON: " + c), b)
                },
                parseXML: function(c) {
                    var d, e;
                    if (!c || "string" != typeof c) return null;
                    try {
                        a.DOMParser ? (e = new DOMParser, d = e.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
                    } catch (f) {
                        d = b
                    }
                    return d && d.documentElement && !d.getElementsByTagName("parsererror").length || ka.error("Invalid XML: " + c), d
                },
                noop: function() {},
                globalEval: function(b) {
                    b && ka.trim(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    })(b)
                },
                camelCase: function(a) {
                    return a.replace(ua, "ms-").replace(va, wa)
                },
                nodeName: function(a, b) {
                    return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
                },
                each: function(a, b, d) {
                    var e, f = 0,
                        g = a.length,
                        h = c(a);
                    if (d) {
                        if (h)
                            for (; g > f && (e = b.apply(a[f], d), e !== !1); f++);
                        else
                            for (f in a)
                                if (e = b.apply(a[f], d), e === !1) break
                    } else if (h)
                        for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++);
                    else
                        for (f in a)
                            if (e = b.call(a[f], f, a[f]), e === !1) break; return a
                },
                trim: ja && !ja.call("\ufeff ") ? function(a) {
                    return null == a ? "" : ja.call(a)
                } : function(a) {
                    return null == a ? "" : (a + "").replace(na, "")
                },
                makeArray: function(a, b) {
                    var d = b || [];
                    return null != a && (c(Object(a)) ? ka.merge(d, "string" == typeof a ? [a] : a) : ea.call(d, a)), d
                },
                inArray: function(a, b, c) {
                    var d;
                    if (b) {
                        if (ga) return ga.call(b, a, c);
                        for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                            if (c in b && b[c] === a) return c
                    }
                    return -1
                },
                merge: function(a, c) {
                    var d = c.length,
                        e = a.length,
                        f = 0;
                    if ("number" == typeof d)
                        for (; d > f; f++) a[e++] = c[f];
                    else
                        for (; c[f] !== b;) a[e++] = c[f++];
                    return a.length = e, a
                },
                grep: function(a, b, c) {
                    var d, e = [],
                        f = 0,
                        g = a.length;
                    for (c = !!c; g > f; f++) d = !!b(a[f], f), c !== d && e.push(a[f]);
                    return e
                },
                map: function(a, b, d) {
                    var e, f = 0,
                        g = a.length,
                        h = c(a),
                        i = [];
                    if (h)
                        for (; g > f; f++) e = b(a[f], f, d), null != e && (i[i.length] = e);
                    else
                        for (f in a) e = b(a[f], f, d), null != e && (i[i.length] = e);
                    return da.apply([], i)
                },
                guid: 1,
                proxy: function(a, c) {
                    var d, e, f;
                    return "string" == typeof c && (f = a[c], c = a, a = f), ka.isFunction(a) ? (d = fa.call(arguments, 2), e = function() {
                        return a.apply(c || this, d.concat(fa.call(arguments)))
                    }, e.guid = a.guid = a.guid || ka.guid++, e) : b
                },
                access: function(a, c, d, e, f, g, h) {
                    var i = 0,
                        j = a.length,
                        k = null == d;
                    if ("object" === ka.type(d)) {
                        f = !0;
                        for (i in d) ka.access(a, c, i, d[i], !0, g, h)
                    } else if (e !== b && (f = !0, ka.isFunction(e) || (h = !0), k && (h ? (c.call(a, e), c = null) : (k = c, c = function(a, b, c) {
                            return k.call(ka(a), c)
                        })), c))
                        for (; j > i; i++) c(a[i], d, h ? e : e.call(a[i], i, c(a[i], d)));
                    return f ? a : k ? c.call(a) : j ? c(a[0], d) : g
                },
                now: function() {
                    return (new Date).getTime()
                },
                swap: function(a, b, c, d) {
                    var e, f, g = {};
                    for (f in b) g[f] = a.style[f], a.style[f] = b[f];
                    e = c.apply(a, d || []);
                    for (f in b) a.style[f] = g[f];
                    return e
                }
            }), ka.ready.promise = function(b) {
                if (!U)
                    if (U = ka.Deferred(), "complete" === Y.readyState) setTimeout(ka.ready);
                    else if (Y.addEventListener) Y.addEventListener("DOMContentLoaded", xa, !1), a.addEventListener("load", xa, !1);
                else {
                    Y.attachEvent("onreadystatechange", xa), a.attachEvent("onload", xa);
                    var c = !1;
                    try {
                        c = null == a.frameElement && Y.documentElement
                    } catch (d) {}
                    c && c.doScroll && function e() {
                        if (!ka.isReady) {
                            try {
                                c.doScroll("left")
                            } catch (a) {
                                return setTimeout(e, 50)
                            }
                            ya(), ka.ready()
                        }
                    }()
                }
                return U.promise(b)
            }, ka.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
                aa["[object " + b + "]"] = b.toLowerCase()
            }), V = ka(Y),
            function(a, b) {
                function c(a, b, c, d) {
                    var e, f, g, h, i, j, k, l, o, p;
                    if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], !a || "string" != typeof a) return c;
                    if (1 !== (h = b.nodeType) && 9 !== h) return [];
                    if (I && !d) {
                        if (e = ta.exec(a))
                            if (g = e[1]) {
                                if (9 === h) {
                                    if (f = b.getElementById(g), !f || !f.parentNode) return c;
                                    if (f.id === g) return c.push(f), c
                                } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g) return c.push(f), c
                            } else {
                                if (e[2]) return aa.apply(c, b.getElementsByTagName(a)), c;
                                if ((g = e[3]) && x.getElementsByClassName && b.getElementsByClassName) return aa.apply(c, b.getElementsByClassName(g)), c
                            }
                        if (x.qsa && (!J || !J.test(a))) {
                            if (l = k = N, o = b, p = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                                for (j = m(a), (k = b.getAttribute("id")) ? l = k.replace(wa, "\\$&") : b.setAttribute("id", l), l = "[id='" + l + "'] ", i = j.length; i--;) j[i] = l + n(j[i]);
                                o = na.test(a) && b.parentNode || b, p = j.join(",")
                            }
                            if (p) try {
                                return aa.apply(c, o.querySelectorAll(p)), c
                            } catch (q) {} finally {
                                k || b.removeAttribute("id")
                            }
                        }
                    }
                    return v(a.replace(ja, "$1"), b, c, d)
                }

                function d() {
                    function a(c, d) {
                        return b.push(c += " ") > z.cacheLength && delete a[b.shift()], a[c] = d
                    }
                    var b = [];
                    return a
                }

                function e(a) {
                    return a[N] = !0, a
                }

                function f(a) {
                    var b = G.createElement("div");
                    try {
                        return !!a(b)
                    } catch (c) {
                        return !1
                    } finally {
                        b.parentNode && b.parentNode.removeChild(b), b = null
                    }
                }

                function g(a, b) {
                    for (var c = a.split("|"), d = a.length; d--;) z.attrHandle[c[d]] = b
                }

                function h(a, b) {
                    var c = b && a,
                        d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || X) - (~a.sourceIndex || X);
                    if (d) return d;
                    if (c)
                        for (; c = c.nextSibling;)
                            if (c === b) return -1;
                    return a ? 1 : -1
                }

                function i(a) {
                    return function(b) {
                        var c = b.nodeName.toLowerCase();
                        return "input" === c && b.type === a
                    }
                }

                function j(a) {
                    return function(b) {
                        var c = b.nodeName.toLowerCase();
                        return ("input" === c || "button" === c) && b.type === a
                    }
                }

                function k(a) {
                    return e(function(b) {
                        return b = +b, e(function(c, d) {
                            for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                        })
                    })
                }

                function l() {}

                function m(a, b) {
                    var d, e, f, g, h, i, j, k = S[a + " "];
                    if (k) return b ? 0 : k.slice(0);
                    for (h = a, i = [], j = z.preFilter; h;) {
                        (!d || (e = la.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ma.exec(h)) && (d = e.shift(), f.push({
                            value: d,
                            type: e[0].replace(ja, " ")
                        }), h = h.slice(d.length));
                        for (g in z.filter) !(e = ra[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                            value: d,
                            type: g,
                            matches: e
                        }), h = h.slice(d.length));
                        if (!d) break
                    }
                    return b ? h.length : h ? c.error(a) : S(a, i).slice(0)
                }

                function n(a) {
                    for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
                    return d
                }

                function o(a, b, c) {
                    var d = b.dir,
                        e = c && "parentNode" === d,
                        f = Q++;
                    return b.first ? function(b, c, f) {
                        for (; b = b[d];)
                            if (1 === b.nodeType || e) return a(b, c, f)
                    } : function(b, c, g) {
                        var h, i, j, k = P + " " + f;
                        if (g) {
                            for (; b = b[d];)
                                if ((1 === b.nodeType || e) && a(b, c, g)) return !0
                        } else
                            for (; b = b[d];)
                                if (1 === b.nodeType || e)
                                    if (j = b[N] || (b[N] = {}), (i = j[d]) && i[0] === k) {
                                        if ((h = i[1]) === !0 || h === y) return h === !0
                                    } else if (i = j[d] = [k], i[1] = a(b, c, g) || y, i[1] === !0) return !0
                    }
                }

                function p(a) {
                    return a.length > 1 ? function(b, c, d) {
                        for (var e = a.length; e--;)
                            if (!a[e](b, c, d)) return !1;
                        return !0
                    } : a[0]
                }

                function q(a, b, c, d, e) {
                    for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
                    return g
                }

                function r(a, b, c, d, f, g) {
                    return d && !d[N] && (d = r(d)), f && !f[N] && (f = r(f, g)), e(function(e, g, h, i) {
                        var j, k, l, m = [],
                            n = [],
                            o = g.length,
                            p = e || u(b || "*", h.nodeType ? [h] : h, []),
                            r = !a || !e && b ? p : q(p, m, a, h, i),
                            s = c ? f || (e ? a : o || d) ? [] : g : r;
                        if (c && c(r, s, h, i), d)
                            for (j = q(s, n), d(j, [], h, i), k = j.length; k--;)(l = j[k]) && (s[n[k]] = !(r[n[k]] = l));
                        if (e) {
                            if (f || a) {
                                if (f) {
                                    for (j = [], k = s.length; k--;)(l = s[k]) && j.push(r[k] = l);
                                    f(null, s = [], j, i)
                                }
                                for (k = s.length; k--;)(l = s[k]) && (j = f ? ca.call(e, l) : m[k]) > -1 && (e[j] = !(g[j] = l))
                            }
                        } else s = q(s === g ? s.splice(o, s.length) : s), f ? f(null, g, s, i) : aa.apply(g, s)
                    })
                }

                function s(a) {
                    for (var b, c, d, e = a.length, f = z.relative[a[0].type], g = f || z.relative[" "], h = f ? 1 : 0, i = o(function(a) {
                            return a === b
                        }, g, !0), j = o(function(a) {
                            return ca.call(b, a) > -1
                        }, g, !0), k = [function(a, c, d) {
                            return !f && (d || c !== D) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d))
                        }]; e > h; h++)
                        if (c = z.relative[a[h].type]) k = [o(p(k), c)];
                        else {
                            if (c = z.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                                for (d = ++h; e > d && !z.relative[a[d].type]; d++);
                                return r(h > 1 && p(k), h > 1 && n(a.slice(0, h - 1).concat({
                                    value: " " === a[h - 2].type ? "*" : ""
                                })).replace(ja, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && n(a))
                            }
                            k.push(c)
                        }
                    return p(k)
                }

                function t(a, b) {
                    var d = 0,
                        f = b.length > 0,
                        g = a.length > 0,
                        h = function(e, h, i, j, k) {
                            var l, m, n, o = [],
                                p = 0,
                                r = "0",
                                s = e && [],
                                t = null != k,
                                u = D,
                                v = e || g && z.find.TAG("*", k && h.parentNode || h),
                                w = P += null == u ? 1 : Math.random() || .1;
                            for (t && (D = h !== G && h, y = d); null != (l = v[r]); r++) {
                                if (g && l) {
                                    for (m = 0; n = a[m++];)
                                        if (n(l, h, i)) {
                                            j.push(l);
                                            break
                                        }
                                    t && (P = w, y = ++d)
                                }
                                f && ((l = !n && l) && p--, e && s.push(l))
                            }
                            if (p += r, f && r !== p) {
                                for (m = 0; n = b[m++];) n(s, o, h, i);
                                if (e) {
                                    if (p > 0)
                                        for (; r--;) s[r] || o[r] || (o[r] = $.call(j));
                                    o = q(o)
                                }
                                aa.apply(j, o), t && !e && o.length > 0 && p + b.length > 1 && c.uniqueSort(j)
                            }
                            return t && (P = w, D = u), s
                        };
                    return f ? e(h) : h
                }

                function u(a, b, d) {
                    for (var e = 0, f = b.length; f > e; e++) c(a, b[e], d);
                    return d
                }

                function v(a, b, c, d) {
                    var e, f, g, h, i, j = m(a);
                    if (!d && 1 === j.length) {
                        if (f = j[0] = j[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && x.getById && 9 === b.nodeType && I && z.relative[f[1].type]) {
                            if (b = (z.find.ID(g.matches[0].replace(xa, ya), b) || [])[0], !b) return c;
                            a = a.slice(f.shift().value.length)
                        }
                        for (e = ra.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !z.relative[h = g.type]);)
                            if ((i = z.find[h]) && (d = i(g.matches[0].replace(xa, ya), na.test(f[0].type) && b.parentNode || b))) {
                                if (f.splice(e, 1), a = d.length && n(f), !a) return aa.apply(c, d), c;
                                break
                            }
                    }
                    return C(a, j)(d, b, !I, c, na.test(a)), c
                }
                var w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + -new Date,
                    O = a.document,
                    P = 0,
                    Q = 0,
                    R = d(),
                    S = d(),
                    T = d(),
                    U = !1,
                    V = function(a, b) {
                        return a === b ? (U = !0, 0) : 0
                    },
                    W = typeof b,
                    X = 1 << 31,
                    Y = {}.hasOwnProperty,
                    Z = [],
                    $ = Z.pop,
                    _ = Z.push,
                    aa = Z.push,
                    ba = Z.slice,
                    ca = Z.indexOf || function(a) {
                        for (var b = 0, c = this.length; c > b; b++)
                            if (this[b] === a) return b;
                        return -1
                    },
                    da = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                    ea = "[\\x20\\t\\r\\n\\f]",
                    fa = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                    ga = fa.replace("w", "w#"),
                    ha = "\\[" + ea + "*(" + fa + ")" + ea + "*(?:([*^$|!~]?=)" + ea + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + ga + ")|)|)" + ea + "*\\]",
                    ia = ":(" + fa + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + ha.replace(3, 8) + ")*)|.*)\\)|)",
                    ja = RegExp("^" + ea + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ea + "+$", "g"),
                    la = RegExp("^" + ea + "*," + ea + "*"),
                    ma = RegExp("^" + ea + "*([>+~]|" + ea + ")" + ea + "*"),
                    na = RegExp(ea + "*[+~]"),
                    oa = RegExp("=" + ea + "*([^\\]'\"]*)" + ea + "*\\]", "g"),
                    pa = RegExp(ia),
                    qa = RegExp("^" + ga + "$"),
                    ra = {
                        ID: RegExp("^#(" + fa + ")"),
                        CLASS: RegExp("^\\.(" + fa + ")"),
                        TAG: RegExp("^(" + fa.replace("w", "w*") + ")"),
                        ATTR: RegExp("^" + ha),
                        PSEUDO: RegExp("^" + ia),
                        CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ea + "*(even|odd|(([+-]|)(\\d*)n|)" + ea + "*(?:([+-]|)" + ea + "*(\\d+)|))" + ea + "*\\)|)", "i"),
                        bool: RegExp("^(?:" + da + ")$", "i"),
                        needsContext: RegExp("^" + ea + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ea + "*((?:-\\d)?\\d*)" + ea + "*\\)|)(?=[^-]|$)", "i")
                    },
                    sa = /^[^{]+\{\s*\[native \w/,
                    ta = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                    ua = /^(?:input|select|textarea|button)$/i,
                    va = /^h\d$/i,
                    wa = /'|\\/g,
                    xa = RegExp("\\\\([\\da-f]{1,6}" + ea + "?|(" + ea + ")|.)", "ig"),
                    ya = function(a, b, c) {
                        var d = "0x" + b - 65536;
                        return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(55296 | d >> 10, 56320 | 1023 & d)
                    };
                try {
                    aa.apply(Z = ba.call(O.childNodes), O.childNodes), Z[O.childNodes.length].nodeType
                } catch (za) {
                    aa = {
                        apply: Z.length ? function(a, b) {
                            _.apply(a, ba.call(b))
                        } : function(a, b) {
                            for (var c = a.length, d = 0; a[c++] = b[d++];);
                            a.length = c - 1
                        }
                    }
                }
                B = c.isXML = function(a) {
                    var b = a && (a.ownerDocument || a).documentElement;
                    return b ? "HTML" !== b.nodeName : !1
                }, x = c.support = {}, F = c.setDocument = function(a) {
                    var c = a ? a.ownerDocument || a : O,
                        d = c.defaultView;
                    return c !== G && 9 === c.nodeType && c.documentElement ? (G = c, H = c.documentElement, I = !B(c), d && d.attachEvent && d !== d.top && d.attachEvent("onbeforeunload", function() {
                        F()
                    }), x.attributes = f(function(a) {
                        return a.className = "i", !a.getAttribute("className")
                    }), x.getElementsByTagName = f(function(a) {
                        return a.appendChild(c.createComment("")), !a.getElementsByTagName("*").length
                    }), x.getElementsByClassName = f(function(a) {
                        return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
                    }), x.getById = f(function(a) {
                        return H.appendChild(a).id = N, !c.getElementsByName || !c.getElementsByName(N).length
                    }), x.getById ? (z.find.ID = function(a, b) {
                        if (typeof b.getElementById !== W && I) {
                            var c = b.getElementById(a);
                            return c && c.parentNode ? [c] : []
                        }
                    }, z.filter.ID = function(a) {
                        var b = a.replace(xa, ya);
                        return function(a) {
                            return a.getAttribute("id") === b
                        }
                    }) : (delete z.find.ID, z.filter.ID = function(a) {
                        var b = a.replace(xa, ya);
                        return function(a) {
                            var c = typeof a.getAttributeNode !== W && a.getAttributeNode("id");
                            return c && c.value === b
                        }
                    }), z.find.TAG = x.getElementsByTagName ? function(a, c) {
                        return typeof c.getElementsByTagName !== W ? c.getElementsByTagName(a) : b
                    } : function(a, b) {
                        var c, d = [],
                            e = 0,
                            f = b.getElementsByTagName(a);
                        if ("*" === a) {
                            for (; c = f[e++];) 1 === c.nodeType && d.push(c);
                            return d
                        }
                        return f
                    }, z.find.CLASS = x.getElementsByClassName && function(a, c) {
                        return typeof c.getElementsByClassName !== W && I ? c.getElementsByClassName(a) : b
                    }, K = [], J = [], (x.qsa = sa.test(c.querySelectorAll)) && (f(function(a) {
                        a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || J.push("\\[" + ea + "*(?:value|" + da + ")"), a.querySelectorAll(":checked").length || J.push(":checked")
                    }), f(function(a) {
                        var b = c.createElement("input");
                        b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("t", ""), a.querySelectorAll("[t^='']").length && J.push("[*^$]=" + ea + "*(?:''|\"\")"), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
                    })), (x.matchesSelector = sa.test(L = H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && f(function(a) {
                        x.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ia)
                    }), J = J.length && RegExp(J.join("|")), K = K.length && RegExp(K.join("|")), M = sa.test(H.contains) || H.compareDocumentPosition ? function(a, b) {
                        var c = 9 === a.nodeType ? a.documentElement : a,
                            d = b && b.parentNode;
                        return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                    } : function(a, b) {
                        if (b)
                            for (; b = b.parentNode;)
                                if (b === a) return !0;
                        return !1
                    }, V = H.compareDocumentPosition ? function(a, b) {
                        if (a === b) return U = !0, 0;
                        var d = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b);
                        return d ? 1 & d || !x.sortDetached && b.compareDocumentPosition(a) === d ? a === c || M(O, a) ? -1 : b === c || M(O, b) ? 1 : E ? ca.call(E, a) - ca.call(E, b) : 0 : 4 & d ? -1 : 1 : a.compareDocumentPosition ? -1 : 1
                    } : function(a, b) {
                        var d, e = 0,
                            f = a.parentNode,
                            g = b.parentNode,
                            i = [a],
                            j = [b];
                        if (a === b) return U = !0, 0;
                        if (!f || !g) return a === c ? -1 : b === c ? 1 : f ? -1 : g ? 1 : E ? ca.call(E, a) - ca.call(E, b) : 0;
                        if (f === g) return h(a, b);
                        for (d = a; d = d.parentNode;) i.unshift(d);
                        for (d = b; d = d.parentNode;) j.unshift(d);
                        for (; i[e] === j[e];) e++;
                        return e ? h(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
                    }, c) : G
                }, c.matches = function(a, b) {
                    return c(a, null, null, b)
                }, c.matchesSelector = function(a, b) {
                    if ((a.ownerDocument || a) !== G && F(a), b = b.replace(oa, "='$1']"), !(!x.matchesSelector || !I || K && K.test(b) || J && J.test(b))) try {
                        var d = L.call(a, b);
                        if (d || x.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
                    } catch (e) {}
                    return c(b, G, null, [a]).length > 0
                }, c.contains = function(a, b) {
                    return (a.ownerDocument || a) !== G && F(a), M(a, b)
                }, c.attr = function(a, c) {
                    (a.ownerDocument || a) !== G && F(a);
                    var d = z.attrHandle[c.toLowerCase()],
                        e = d && Y.call(z.attrHandle, c.toLowerCase()) ? d(a, c, !I) : b;
                    return e === b ? x.attributes || !I ? a.getAttribute(c) : (e = a.getAttributeNode(c)) && e.specified ? e.value : null : e
                }, c.error = function(a) {
                    throw Error("Syntax error, unrecognized expression: " + a)
                }, c.uniqueSort = function(a) {
                    var b, c = [],
                        d = 0,
                        e = 0;
                    if (U = !x.detectDuplicates, E = !x.sortStable && a.slice(0), a.sort(V), U) {
                        for (; b = a[e++];) b === a[e] && (d = c.push(e));
                        for (; d--;) a.splice(c[d], 1)
                    }
                    return a
                }, A = c.getText = function(a) {
                    var b, c = "",
                        d = 0,
                        e = a.nodeType;
                    if (e) {
                        if (1 === e || 9 === e || 11 === e) {
                            if ("string" == typeof a.textContent) return a.textContent;
                            for (a = a.firstChild; a; a = a.nextSibling) c += A(a)
                        } else if (3 === e || 4 === e) return a.nodeValue
                    } else
                        for (; b = a[d]; d++) c += A(b);
                    return c
                }, z = c.selectors = {
                    cacheLength: 50,
                    createPseudo: e,
                    match: ra,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(a) {
                            return a[1] = a[1].replace(xa, ya), a[3] = (a[4] || a[5] || "").replace(xa, ya), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                        },
                        CHILD: function(a) {
                            return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || c.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && c.error(a[0]), a
                        },
                        PSEUDO: function(a) {
                            var c, d = !a[5] && a[2];
                            return ra.CHILD.test(a[0]) ? null : (a[3] && a[4] !== b ? a[2] = a[4] : d && pa.test(d) && (c = m(d, !0)) && (c = d.indexOf(")", d.length - c) - d.length) && (a[0] = a[0].slice(0, c), a[2] = d.slice(0, c)), a.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(a) {
                            var b = a.replace(xa, ya).toLowerCase();
                            return "*" === a ? function() {
                                return !0
                            } : function(a) {
                                return a.nodeName && a.nodeName.toLowerCase() === b
                            }
                        },
                        CLASS: function(a) {
                            var b = R[a + " "];
                            return b || (b = RegExp("(^|" + ea + ")" + a + "(" + ea + "|$)")) && R(a, function(a) {
                                return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== W && a.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(a, b, d) {
                            return function(e) {
                                var f = c.attr(e, a);
                                return null == f ? "!=" === b : b ? (f += "", "=" === b ? f === d : "!=" === b ? f !== d : "^=" === b ? d && 0 === f.indexOf(d) : "*=" === b ? d && f.indexOf(d) > -1 : "$=" === b ? d && f.slice(-d.length) === d : "~=" === b ? (" " + f + " ").indexOf(d) > -1 : "|=" === b ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
                            }
                        },
                        CHILD: function(a, b, c, d, e) {
                            var f = "nth" !== a.slice(0, 3),
                                g = "last" !== a.slice(-4),
                                h = "of-type" === b;
                            return 1 === d && 0 === e ? function(a) {
                                return !!a.parentNode
                            } : function(b, c, i) {
                                var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                                    q = b.parentNode,
                                    r = h && b.nodeName.toLowerCase(),
                                    s = !i && !h;
                                if (q) {
                                    if (f) {
                                        for (; p;) {
                                            for (l = b; l = l[p];)
                                                if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                            o = p = "only" === a && !o && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                        for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)
                                            if (1 === l.nodeType && ++m && l === b) {
                                                k[a] = [P, n, m];
                                                break
                                            }
                                    } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P) m = j[1];
                                    else
                                        for (;
                                            (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)););
                                    return m -= e, m === d || 0 === m % d && m / d >= 0
                                }
                            }
                        },
                        PSEUDO: function(a, b) {
                            var d, f = z.pseudos[a] || z.setFilters[a.toLowerCase()] || c.error("unsupported pseudo: " + a);
                            return f[N] ? f(b) : f.length > 1 ? (d = [a, a, "", b], z.setFilters.hasOwnProperty(a.toLowerCase()) ? e(function(a, c) {
                                for (var d, e = f(a, b), g = e.length; g--;) d = ca.call(a, e[g]), a[d] = !(c[d] = e[g])
                            }) : function(a) {
                                return f(a, 0, d)
                            }) : f
                        }
                    },
                    pseudos: {
                        not: e(function(a) {
                            var b = [],
                                c = [],
                                d = C(a.replace(ja, "$1"));
                            return d[N] ? e(function(a, b, c, e) {
                                for (var f, g = d(a, null, e, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                            }) : function(a, e, f) {
                                return b[0] = a, d(b, null, f, c), !c.pop()
                            }
                        }),
                        has: e(function(a) {
                            return function(b) {
                                return c(a, b).length > 0
                            }
                        }),
                        contains: e(function(a) {
                            return function(b) {
                                return (b.textContent || b.innerText || A(b)).indexOf(a) > -1
                            }
                        }),
                        lang: e(function(a) {
                            return qa.test(a || "") || c.error("unsupported lang: " + a), a = a.replace(xa, ya).toLowerCase(),
                                function(b) {
                                    var c;
                                    do
                                        if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                                    while ((b = b.parentNode) && 1 === b.nodeType);
                                    return !1
                                }
                        }),
                        target: function(b) {
                            var c = a.location && a.location.hash;
                            return c && c.slice(1) === b.id
                        },
                        root: function(a) {
                            return a === H
                        },
                        focus: function(a) {
                            return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                        },
                        enabled: function(a) {
                            return a.disabled === !1
                        },
                        disabled: function(a) {
                            return a.disabled === !0
                        },
                        checked: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return "input" === b && !!a.checked || "option" === b && !!a.selected
                        },
                        selected: function(a) {
                            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                        },
                        empty: function(a) {
                            for (a = a.firstChild; a; a = a.nextSibling)
                                if (a.nodeName > "@" || 3 === a.nodeType || 4 === a.nodeType) return !1;
                            return !0
                        },
                        parent: function(a) {
                            return !z.pseudos.empty(a)
                        },
                        header: function(a) {
                            return va.test(a.nodeName)
                        },
                        input: function(a) {
                            return ua.test(a.nodeName)
                        },
                        button: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return "input" === b && "button" === a.type || "button" === b
                        },
                        text: function(a) {
                            var b;
                            return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || b.toLowerCase() === a.type)
                        },
                        first: k(function() {
                            return [0]
                        }),
                        last: k(function(a, b) {
                            return [b - 1]
                        }),
                        eq: k(function(a, b, c) {
                            return [0 > c ? c + b : c]
                        }),
                        even: k(function(a, b) {
                            for (var c = 0; b > c; c += 2) a.push(c);
                            return a
                        }),
                        odd: k(function(a, b) {
                            for (var c = 1; b > c; c += 2) a.push(c);
                            return a
                        }),
                        lt: k(function(a, b, c) {
                            for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                            return a
                        }),
                        gt: k(function(a, b, c) {
                            for (var d = 0 > c ? c + b : c; b > ++d;) a.push(d);
                            return a
                        })
                    }
                }, z.pseudos.nth = z.pseudos.eq;
                for (w in {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) z.pseudos[w] = i(w);
                for (w in {
                        submit: !0,
                        reset: !0
                    }) z.pseudos[w] = j(w);
                l.prototype = z.filters = z.pseudos, z.setFilters = new l, C = c.compile = function(a, b) {
                    var c, d = [],
                        e = [],
                        f = T[a + " "];
                    if (!f) {
                        for (b || (b = m(a)), c = b.length; c--;) f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                        f = T(a, t(e, d))
                    }
                    return f
                }, x.sortStable = N.split("").sort(V).join("") === N, x.detectDuplicates = U, F(), x.sortDetached = f(function(a) {
                    return 1 & a.compareDocumentPosition(G.createElement("div"))
                }), f(function(a) {
                    return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
                }) || g("type|href|height|width", function(a, c, d) {
                    return d ? b : a.getAttribute(c, "type" === c.toLowerCase() ? 1 : 2)
                }), x.attributes && f(function(a) {
                    return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
                }) || g("value", function(a, c, d) {
                    return d || "input" !== a.nodeName.toLowerCase() ? b : a.defaultValue
                }), f(function(a) {
                    return null == a.getAttribute("disabled")
                }) || g(da, function(a, c, d) {
                    var e;
                    return d ? b : (e = a.getAttributeNode(c)) && e.specified ? e.value : a[c] === !0 ? c.toLowerCase() : null
                }), ka.find = c, ka.expr = c.selectors, ka.expr[":"] = ka.expr.pseudos, ka.unique = c.uniqueSort, ka.text = c.getText, ka.isXMLDoc = c.isXML, ka.contains = c.contains
            }(a);
        var za = {};
        ka.Callbacks = function(a) {
            a = "string" == typeof a ? za[a] || d(a) : ka.extend({}, a);
            var c, e, f, g, h, i, j = [],
                k = !a.once && [],
                l = function(b) {
                    for (e = a.memory && b, f = !0, h = i || 0, i = 0, g = j.length, c = !0; j && g > h; h++)
                        if (j[h].apply(b[0], b[1]) === !1 && a.stopOnFalse) {
                            e = !1;
                            break
                        }
                    c = !1, j && (k ? k.length && l(k.shift()) : e ? j = [] : m.disable())
                },
                m = {
                    add: function() {
                        if (j) {
                            var b = j.length;
                            ! function d(b) {
                                ka.each(b, function(b, c) {
                                    var e = ka.type(c);
                                    "function" === e ? a.unique && m.has(c) || j.push(c) : c && c.length && "string" !== e && d(c)
                                })
                            }(arguments), c ? g = j.length : e && (i = b, l(e))
                        }
                        return this
                    },
                    remove: function() {
                        return j && ka.each(arguments, function(a, b) {
                            for (var d;
                                (d = ka.inArray(b, j, d)) > -1;) j.splice(d, 1), c && (g >= d && g--, h >= d && h--)
                        }), this
                    },
                    has: function(a) {
                        return a ? ka.inArray(a, j) > -1 : !(!j || !j.length)
                    },
                    empty: function() {
                        return j = [], g = 0, this
                    },
                    disable: function() {
                        return j = k = e = b, this
                    },
                    disabled: function() {
                        return !j
                    },
                    lock: function() {
                        return k = b, e || m.disable(), this
                    },
                    locked: function() {
                        return !k
                    },
                    fireWith: function(a, b) {
                        return !j || f && !k || (b = b || [], b = [a, b.slice ? b.slice() : b], c ? k.push(b) : l(b)), this
                    },
                    fire: function() {
                        return m.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!f
                    }
                };
            return m
        }, ka.extend({
            Deferred: function(a) {
                var b = [
                        ["resolve", "done", ka.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", ka.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", ka.Callbacks("memory")]
                    ],
                    c = "pending",
                    d = {
                        state: function() {
                            return c
                        },
                        always: function() {
                            return e.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var a = arguments;
                            return ka.Deferred(function(c) {
                                ka.each(b, function(b, f) {
                                    var g = f[0],
                                        h = ka.isFunction(a[b]) && a[b];
                                    e[f[1]](function() {
                                        var a = h && h.apply(this, arguments);
                                        a && ka.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[g + "With"](this === d ? c.promise() : this, h ? [a] : arguments)
                                    })
                                }), a = null
                            }).promise()
                        },
                        promise: function(a) {
                            return null != a ? ka.extend(a, d) : d
                        }
                    },
                    e = {};
                return d.pipe = d.then, ka.each(b, function(a, f) {
                    var g = f[2],
                        h = f[3];
                    d[f[1]] = g.add, h && g.add(function() {
                        c = h
                    }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                        return e[f[0] + "With"](this === e ? d : this, arguments), this
                    }, e[f[0] + "With"] = g.fireWith
                }), d.promise(e), a && a.call(e, e), e
            },
            when: function(a) {
                var b, c, d, e = 0,
                    f = fa.call(arguments),
                    g = f.length,
                    h = 1 !== g || a && ka.isFunction(a.promise) ? g : 0,
                    i = 1 === h ? a : ka.Deferred(),
                    j = function(a, c, d) {
                        return function(e) {
                            c[a] = this, d[a] = arguments.length > 1 ? fa.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                        }
                    };
                if (g > 1)
                    for (b = Array(g), c = Array(g), d = Array(g); g > e; e++) f[e] && ka.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
                return h || i.resolveWith(d, f), i.promise()
            }
        }), ka.support = function(b) {
            var c, d, e, f, g, h, i, j, k, l = Y.createElement("div");
            if (l.setAttribute("className", "t"), l.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = l.getElementsByTagName("*") || [], d = l.getElementsByTagName("a")[0], !d || !d.style || !c.length) return b;
            f = Y.createElement("select"), h = f.appendChild(Y.createElement("option")), e = l.getElementsByTagName("input")[0], d.style.cssText = "top:1px;float:left;opacity:.5", b.getSetAttribute = "t" !== l.className, b.leadingWhitespace = 3 === l.firstChild.nodeType, b.tbody = !l.getElementsByTagName("tbody").length, b.htmlSerialize = !!l.getElementsByTagName("link").length, b.style = /top/.test(d.getAttribute("style")), b.hrefNormalized = "/a" === d.getAttribute("href"), b.opacity = /^0.5/.test(d.style.opacity), b.cssFloat = !!d.style.cssFloat, b.checkOn = !!e.value, b.optSelected = h.selected, b.enctype = !!Y.createElement("form").enctype, b.html5Clone = "<:nav></:nav>" !== Y.createElement("nav").cloneNode(!0).outerHTML, b.inlineBlockNeedsLayout = !1, b.shrinkWrapBlocks = !1, b.pixelPosition = !1, b.deleteExpando = !0, b.noCloneEvent = !0, b.reliableMarginRight = !0, b.boxSizingReliable = !0, e.checked = !0, b.noCloneChecked = e.cloneNode(!0).checked, f.disabled = !0, b.optDisabled = !h.disabled;
            try {
                delete l.test
            } catch (m) {
                b.deleteExpando = !1
            }
            e = Y.createElement("input"), e.setAttribute("value", ""), b.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), b.radioValue = "t" === e.value, e.setAttribute("checked", "t"), e.setAttribute("name", "t"), g = Y.createDocumentFragment(), g.appendChild(e), b.appendChecked = e.checked, b.checkClone = g.cloneNode(!0).cloneNode(!0).lastChild.checked, l.attachEvent && (l.attachEvent("onclick", function() {
                b.noCloneEvent = !1
            }), l.cloneNode(!0).click());
            for (k in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) l.setAttribute(i = "on" + k, "t"), b[k + "Bubbles"] = i in a || l.attributes[i].expando === !1;
            l.style.backgroundClip = "content-box", l.cloneNode(!0).style.backgroundClip = "", b.clearCloneStyle = "content-box" === l.style.backgroundClip;
            for (k in ka(b)) break;
            return b.ownLast = "0" !== k, ka(function() {
                var c, d, e, f = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                    g = Y.getElementsByTagName("body")[0];
                g && (c = Y.createElement("div"), c.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", g.appendChild(c).appendChild(l), l.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = l.getElementsByTagName("td"), e[0].style.cssText = "padding:0;margin:0;border:0;display:none", j = 0 === e[0].offsetHeight, e[0].style.display = "", e[1].style.display = "none", b.reliableHiddenOffsets = j && 0 === e[0].offsetHeight, l.innerHTML = "", l.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", ka.swap(g, null != g.style.zoom ? {
                    zoom: 1
                } : {}, function() {
                    b.boxSizing = 4 === l.offsetWidth
                }), a.getComputedStyle && (b.pixelPosition = "1%" !== (a.getComputedStyle(l, null) || {}).top, b.boxSizingReliable = "4px" === (a.getComputedStyle(l, null) || {
                    width: "4px"
                }).width, d = l.appendChild(Y.createElement("div")), d.style.cssText = l.style.cssText = f, d.style.marginRight = d.style.width = "0", l.style.width = "1px", b.reliableMarginRight = !parseFloat((a.getComputedStyle(d, null) || {}).marginRight)), typeof l.style.zoom !== W && (l.innerHTML = "", l.style.cssText = f + "width:1px;padding:1px;display:inline;zoom:1", b.inlineBlockNeedsLayout = 3 === l.offsetWidth, l.style.display = "block", l.innerHTML = "<div></div>", l.firstChild.style.width = "5px", b.shrinkWrapBlocks = 3 !== l.offsetWidth, b.inlineBlockNeedsLayout && (g.style.zoom = 1)), g.removeChild(c), c = l = e = d = null)
            }), c = f = g = h = d = e = null, b
        }({});
        var Aa = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
            Ba = /([A-Z])/g;
        ka.extend({
            cache: {},
            noData: {
                applet: !0,
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },
            hasData: function(a) {
                return a = a.nodeType ? ka.cache[a[ka.expando]] : a[ka.expando], !!a && !h(a)
            },
            data: function(a, b, c) {
                return e(a, b, c)
            },
            removeData: function(a, b) {
                return f(a, b)
            },
            _data: function(a, b, c) {
                return e(a, b, c, !0)
            },
            _removeData: function(a, b) {
                return f(a, b, !0)
            },
            acceptData: function(a) {
                if (a.nodeType && 1 !== a.nodeType && 9 !== a.nodeType) return !1;
                var b = a.nodeName && ka.noData[a.nodeName.toLowerCase()];
                return !b || b !== !0 && a.getAttribute("classid") === b
            }
        }), ka.fn.extend({
            data: function(a, c) {
                var d, e, f = null,
                    h = 0,
                    i = this[0];
                if (a === b) {
                    if (this.length && (f = ka.data(i), 1 === i.nodeType && !ka._data(i, "parsedAttrs"))) {
                        for (d = i.attributes; d.length > h; h++) e = d[h].name, 0 === e.indexOf("data-") && (e = ka.camelCase(e.slice(5)), g(i, e, f[e]));
                        ka._data(i, "parsedAttrs", !0)
                    }
                    return f
                }
                return "object" == typeof a ? this.each(function() {
                    ka.data(this, a)
                }) : arguments.length > 1 ? this.each(function() {
                    ka.data(this, a, c)
                }) : i ? g(i, a, ka.data(i, a)) : null
            },
            removeData: function(a) {
                return this.each(function() {
                    ka.removeData(this, a)
                })
            }
        }), ka.extend({
            queue: function(a, c, d) {
                var e;
                return a ? (c = (c || "fx") + "queue", e = ka._data(a, c), d && (!e || ka.isArray(d) ? e = ka._data(a, c, ka.makeArray(d)) : e.push(d)), e || []) : b
            },
            dequeue: function(a, b) {
                b = b || "fx";
                var c = ka.queue(a, b),
                    d = c.length,
                    e = c.shift(),
                    f = ka._queueHooks(a, b),
                    g = function() {
                        ka.dequeue(a, b)
                    };
                "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
            },
            _queueHooks: function(a, b) {
                var c = b + "queueHooks";
                return ka._data(a, c) || ka._data(a, c, {
                    empty: ka.Callbacks("once memory").add(function() {
                        ka._removeData(a, b + "queue"), ka._removeData(a, c)
                    })
                })
            }
        }), ka.fn.extend({
            queue: function(a, c) {
                var d = 2;
                return "string" != typeof a && (c = a, a = "fx", d--), d > arguments.length ? ka.queue(this[0], a) : c === b ? this : this.each(function() {
                    var b = ka.queue(this, a, c);
                    ka._queueHooks(this, a), "fx" === a && "inprogress" !== b[0] && ka.dequeue(this, a)
                })
            },
            dequeue: function(a) {
                return this.each(function() {
                    ka.dequeue(this, a)
                })
            },
            delay: function(a, b) {
                return a = ka.fx ? ka.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                    var d = setTimeout(b, a);
                    c.stop = function() {
                        clearTimeout(d)
                    }
                })
            },
            clearQueue: function(a) {
                return this.queue(a || "fx", [])
            },
            promise: function(a, c) {
                var d, e = 1,
                    f = ka.Deferred(),
                    g = this,
                    h = this.length,
                    i = function() {
                        --e || f.resolveWith(g, [g])
                    };
                for ("string" != typeof a && (c = a, a = b), a = a || "fx"; h--;) d = ka._data(g[h], a + "queueHooks"), d && d.empty && (e++, d.empty.add(i));
                return i(), f.promise(c)
            }
        });
        var Ca, Da, Ea = /[\t\r\n\f]/g,
            Fa = /\r/g,
            Ga = /^(?:input|select|textarea|button|object)$/i,
            Ha = /^(?:a|area)$/i,
            Ia = /^(?:checked|selected)$/i,
            Ja = ka.support.getSetAttribute,
            Ka = ka.support.input;
        ka.fn.extend({
            attr: function(a, b) {
                return ka.access(this, ka.attr, a, b, arguments.length > 1)
            },
            removeAttr: function(a) {
                return this.each(function() {
                    ka.removeAttr(this, a)
                })
            },
            prop: function(a, b) {
                return ka.access(this, ka.prop, a, b, arguments.length > 1)
            },
            removeProp: function(a) {
                return a = ka.propFix[a] || a, this.each(function() {
                    try {
                        this[a] = b, delete this[a]
                    } catch (c) {}
                })
            },
            addClass: function(a) {
                var b, c, d, e, f, g = 0,
                    h = this.length,
                    i = "string" == typeof a && a;
                if (ka.isFunction(a)) return this.each(function(b) {
                    ka(this).addClass(a.call(this, b, this.className))
                });
                if (i)
                    for (b = (a || "").match(ma) || []; h > g; g++)
                        if (c = this[g], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ea, " ") : " ")) {
                            for (f = 0; e = b[f++];) 0 > d.indexOf(" " + e + " ") && (d += e + " ");
                            c.className = ka.trim(d)
                        }
                return this
            },
            removeClass: function(a) {
                var b, c, d, e, f, g = 0,
                    h = this.length,
                    i = 0 === arguments.length || "string" == typeof a && a;
                if (ka.isFunction(a)) return this.each(function(b) {
                    ka(this).removeClass(a.call(this, b, this.className))
                });
                if (i)
                    for (b = (a || "").match(ma) || []; h > g; g++)
                        if (c = this[g], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ea, " ") : "")) {
                            for (f = 0; e = b[f++];)
                                for (; d.indexOf(" " + e + " ") >= 0;) d = d.replace(" " + e + " ", " ");
                            c.className = a ? ka.trim(d) : ""
                        }
                return this
            },
            toggleClass: function(a, b) {
                var c = typeof a;
                return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(ka.isFunction(a) ? function(c) {
                    ka(this).toggleClass(a.call(this, c, this.className, b), b)
                } : function() {
                    if ("string" === c)
                        for (var b, d = 0, e = ka(this), f = a.match(ma) || []; b = f[d++];) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                    else(c === W || "boolean" === c) && (this.className && ka._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : ka._data(this, "__className__") || "")
                })
            },
            hasClass: function(a) {
                for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                    if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(Ea, " ").indexOf(b) >= 0) return !0;
                return !1
            },
            val: function(a) {
                var c, d, e, f = this[0];
                return arguments.length ? (e = ka.isFunction(a), this.each(function(c) {
                    var f;
                    1 === this.nodeType && (f = e ? a.call(this, c, ka(this).val()) : a, null == f ? f = "" : "number" == typeof f ? f += "" : ka.isArray(f) && (f = ka.map(f, function(a) {
                        return null == a ? "" : a + ""
                    })), d = ka.valHooks[this.type] || ka.valHooks[this.nodeName.toLowerCase()], d && "set" in d && d.set(this, f, "value") !== b || (this.value = f))
                })) : f ? (d = ka.valHooks[f.type] || ka.valHooks[f.nodeName.toLowerCase()], d && "get" in d && (c = d.get(f, "value")) !== b ? c : (c = f.value, "string" == typeof c ? c.replace(Fa, "") : null == c ? "" : c)) : void 0
            }
        }), ka.extend({
            valHooks: {
                option: {
                    get: function(a) {
                        var b = ka.find.attr(a, "value");
                        return null != b ? b : a.text
                    }
                },
                select: {
                    get: function(a) {
                        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                            if (c = d[i], !(!c.selected && i !== e || (ka.support.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && ka.nodeName(c.parentNode, "optgroup"))) {
                                if (b = ka(c).val(), f) return b;
                                g.push(b)
                            }
                        return g
                    },
                    set: function(a, b) {
                        for (var c, d, e = a.options, f = ka.makeArray(b), g = e.length; g--;) d = e[g], (d.selected = ka.inArray(ka(d).val(), f) >= 0) && (c = !0);
                        return c || (a.selectedIndex = -1), f
                    }
                }
            },
            attr: function(a, c, d) {
                var e, f, g = a.nodeType;
                return a && 3 !== g && 8 !== g && 2 !== g ? typeof a.getAttribute === W ? ka.prop(a, c, d) : (1 === g && ka.isXMLDoc(a) || (c = c.toLowerCase(), e = ka.attrHooks[c] || (ka.expr.match.bool.test(c) ? Da : Ca)), d === b ? e && "get" in e && null !== (f = e.get(a, c)) ? f : (f = ka.find.attr(a, c), null == f ? b : f) : null !== d ? e && "set" in e && (f = e.set(a, d, c)) !== b ? f : (a.setAttribute(c, d + ""), d) : (ka.removeAttr(a, c), b)) : void 0
            },
            removeAttr: function(a, b) {
                var c, d, e = 0,
                    f = b && b.match(ma);
                if (f && 1 === a.nodeType)
                    for (; c = f[e++];) d = ka.propFix[c] || c, ka.expr.match.bool.test(c) ? Ka && Ja || !Ia.test(c) ? a[d] = !1 : a[ka.camelCase("default-" + c)] = a[d] = !1 : ka.attr(a, c, ""), a.removeAttribute(Ja ? c : d)
            },
            attrHooks: {
                type: {
                    set: function(a, b) {
                        if (!ka.support.radioValue && "radio" === b && ka.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b), c && (a.value = c), b
                        }
                    }
                }
            },
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(a, c, d) {
                var e, f, g, h = a.nodeType;
                return a && 3 !== h && 8 !== h && 2 !== h ? (g = 1 !== h || !ka.isXMLDoc(a), g && (c = ka.propFix[c] || c, f = ka.propHooks[c]), d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && null !== (e = f.get(a, c)) ? e : a[c]) : void 0
            },
            propHooks: {
                tabIndex: {
                    get: function(a) {
                        var b = ka.find.attr(a, "tabindex");
                        return b ? parseInt(b, 10) : Ga.test(a.nodeName) || Ha.test(a.nodeName) && a.href ? 0 : -1
                    }
                }
            }
        }), Da = {
            set: function(a, b, c) {
                return b === !1 ? ka.removeAttr(a, c) : Ka && Ja || !Ia.test(c) ? a.setAttribute(!Ja && ka.propFix[c] || c, c) : a[ka.camelCase("default-" + c)] = a[c] = !0, c
            }
        }, ka.each(ka.expr.match.bool.source.match(/\w+/g), function(a, c) {
            var d = ka.expr.attrHandle[c] || ka.find.attr;
            ka.expr.attrHandle[c] = Ka && Ja || !Ia.test(c) ? function(a, c, e) {
                var f = ka.expr.attrHandle[c],
                    g = e ? b : (ka.expr.attrHandle[c] = b) != d(a, c, e) ? c.toLowerCase() : null;
                return ka.expr.attrHandle[c] = f, g
            } : function(a, c, d) {
                return d ? b : a[ka.camelCase("default-" + c)] ? c.toLowerCase() : null
            }
        }), Ka && Ja || (ka.attrHooks.value = {
            set: function(a, c, d) {
                return ka.nodeName(a, "input") ? (a.defaultValue = c, b) : Ca && Ca.set(a, c, d)
            }
        }), Ja || (Ca = {
            set: function(a, c, d) {
                var e = a.getAttributeNode(d);
                return e || a.setAttributeNode(e = a.ownerDocument.createAttribute(d)), e.value = c += "", "value" === d || c === a.getAttribute(d) ? c : b
            }
        }, ka.expr.attrHandle.id = ka.expr.attrHandle.name = ka.expr.attrHandle.coords = function(a, c, d) {
            var e;
            return d ? b : (e = a.getAttributeNode(c)) && "" !== e.value ? e.value : null
        }, ka.valHooks.button = {
            get: function(a, c) {
                var d = a.getAttributeNode(c);
                return d && d.specified ? d.value : b
            },
            set: Ca.set
        }, ka.attrHooks.contenteditable = {
            set: function(a, b, c) {
                Ca.set(a, "" === b ? !1 : b, c)
            }
        }, ka.each(["width", "height"], function(a, c) {
            ka.attrHooks[c] = {
                set: function(a, d) {
                    return "" === d ? (a.setAttribute(c, "auto"), d) : b
                }
            }
        })), ka.support.hrefNormalized || ka.each(["href", "src"], function(a, b) {
            ka.propHooks[b] = {
                get: function(a) {
                    return a.getAttribute(b, 4)
                }
            }
        }), ka.support.style || (ka.attrHooks.style = {
            get: function(a) {
                return a.style.cssText || b
            },
            set: function(a, b) {
                return a.style.cssText = b + ""
            }
        }), ka.support.optSelected || (ka.propHooks.selected = {
            get: function(a) {
                var b = a.parentNode;
                return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
            }
        }), ka.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            ka.propFix[this.toLowerCase()] = this
        }), ka.support.enctype || (ka.propFix.enctype = "encoding"), ka.each(["radio", "checkbox"], function() {
            ka.valHooks[this] = {
                set: function(a, c) {
                    return ka.isArray(c) ? a.checked = ka.inArray(ka(a).val(), c) >= 0 : b
                }
            }, ka.support.checkOn || (ka.valHooks[this].get = function(a) {
                return null === a.getAttribute("value") ? "on" : a.value
            })
        });
        var La = /^(?:input|select|textarea)$/i,
            Ma = /^key/,
            Na = /^(?:mouse|contextmenu)|click/,
            Oa = /^(?:focusinfocus|focusoutblur)$/,
            Pa = /^([^.]*)(?:\.(.+)|)$/;
        ka.event = {
            global: {},
            add: function(a, c, d, e, f) {
                var g, h, i, j, k, l, m, n, o, p, q, r = ka._data(a);
                if (r) {
                    for (d.handler && (j = d, d = j.handler, f = j.selector), d.guid || (d.guid = ka.guid++), (h = r.events) || (h = r.events = {}), (l = r.handle) || (l = r.handle = function(a) {
                            return typeof ka === W || a && ka.event.triggered === a.type ? b : ka.event.dispatch.apply(l.elem, arguments)
                        }, l.elem = a),
                        c = (c || "").match(ma) || [""], i = c.length; i--;) g = Pa.exec(c[i]) || [], o = q = g[1], p = (g[2] || "").split(".").sort(), o && (k = ka.event.special[o] || {}, o = (f ? k.delegateType : k.bindType) || o, k = ka.event.special[o] || {}, m = ka.extend({
                        type: o,
                        origType: q,
                        data: e,
                        handler: d,
                        guid: d.guid,
                        selector: f,
                        needsContext: f && ka.expr.match.needsContext.test(f),
                        namespace: p.join(".")
                    }, j), (n = h[o]) || (n = h[o] = [], n.delegateCount = 0, k.setup && k.setup.call(a, e, p, l) !== !1 || (a.addEventListener ? a.addEventListener(o, l, !1) : a.attachEvent && a.attachEvent("on" + o, l))), k.add && (k.add.call(a, m), m.handler.guid || (m.handler.guid = d.guid)), f ? n.splice(n.delegateCount++, 0, m) : n.push(m), ka.event.global[o] = !0);
                    a = null
                }
            },
            remove: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l, m, n, o, p, q = ka.hasData(a) && ka._data(a);
                if (q && (k = q.events)) {
                    for (b = (b || "").match(ma) || [""], j = b.length; j--;)
                        if (h = Pa.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                            for (l = ka.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--;) g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                            i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || ka.removeEvent(a, n, q.handle), delete k[n])
                        } else
                            for (n in k) ka.event.remove(a, n + b[j], c, d, !0);
                    ka.isEmptyObject(k) && (delete q.handle, ka._removeData(a, "events"))
                }
            },
            trigger: function(c, d, e, f) {
                var g, h, i, j, k, l, m, n = [e || Y],
                    o = ia.call(c, "type") ? c.type : c,
                    p = ia.call(c, "namespace") ? c.namespace.split(".") : [];
                if (i = l = e = e || Y, 3 !== e.nodeType && 8 !== e.nodeType && !Oa.test(o + ka.event.triggered) && (o.indexOf(".") >= 0 && (p = o.split("."), o = p.shift(), p.sort()), h = 0 > o.indexOf(":") && "on" + o, c = c[ka.expando] ? c : new ka.Event(o, "object" == typeof c && c), c.isTrigger = f ? 2 : 3, c.namespace = p.join("."), c.namespace_re = c.namespace ? RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, c.result = b, c.target || (c.target = e), d = null == d ? [c] : ka.makeArray(d, [c]), k = ka.event.special[o] || {}, f || !k.trigger || k.trigger.apply(e, d) !== !1)) {
                    if (!f && !k.noBubble && !ka.isWindow(e)) {
                        for (j = k.delegateType || o, Oa.test(j + o) || (i = i.parentNode); i; i = i.parentNode) n.push(i), l = i;
                        l === (e.ownerDocument || Y) && n.push(l.defaultView || l.parentWindow || a)
                    }
                    for (m = 0;
                        (i = n[m++]) && !c.isPropagationStopped();) c.type = m > 1 ? j : k.bindType || o, g = (ka._data(i, "events") || {})[c.type] && ka._data(i, "handle"), g && g.apply(i, d), g = h && i[h], g && ka.acceptData(i) && g.apply && g.apply(i, d) === !1 && c.preventDefault();
                    if (c.type = o, !f && !c.isDefaultPrevented() && (!k._default || k._default.apply(n.pop(), d) === !1) && ka.acceptData(e) && h && e[o] && !ka.isWindow(e)) {
                        l = e[h], l && (e[h] = null), ka.event.triggered = o;
                        try {
                            e[o]()
                        } catch (q) {}
                        ka.event.triggered = b, l && (e[h] = l)
                    }
                    return c.result
                }
            },
            dispatch: function(a) {
                a = ka.event.fix(a);
                var c, d, e, f, g, h = [],
                    i = fa.call(arguments),
                    j = (ka._data(this, "events") || {})[a.type] || [],
                    k = ka.event.special[a.type] || {};
                if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                    for (h = ka.event.handlers.call(this, a, j), c = 0;
                        (f = h[c++]) && !a.isPropagationStopped();)
                        for (a.currentTarget = f.elem, g = 0;
                            (e = f.handlers[g++]) && !a.isImmediatePropagationStopped();)(!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, d = ((ka.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), d !== b && (a.result = d) === !1 && (a.preventDefault(), a.stopPropagation()));
                    return k.postDispatch && k.postDispatch.call(this, a), a.result
                }
            },
            handlers: function(a, c) {
                var d, e, f, g, h = [],
                    i = c.delegateCount,
                    j = a.target;
                if (i && j.nodeType && (!a.button || "click" !== a.type))
                    for (; j != this; j = j.parentNode || this)
                        if (1 === j.nodeType && (j.disabled !== !0 || "click" !== a.type)) {
                            for (f = [], g = 0; i > g; g++) e = c[g], d = e.selector + " ", f[d] === b && (f[d] = e.needsContext ? ka(d, this).index(j) >= 0 : ka.find(d, this, null, [j]).length), f[d] && f.push(e);
                            f.length && h.push({
                                elem: j,
                                handlers: f
                            })
                        }
                return c.length > i && h.push({
                    elem: this,
                    handlers: c.slice(i)
                }), h
            },
            fix: function(a) {
                if (a[ka.expando]) return a;
                var b, c, d, e = a.type,
                    f = a,
                    g = this.fixHooks[e];
                for (g || (this.fixHooks[e] = g = Na.test(e) ? this.mouseHooks : Ma.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new ka.Event(f), b = d.length; b--;) c = d[b], a[c] = f[c];
                return a.target || (a.target = f.srcElement || Y), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, c) {
                    var d, e, f, g = c.button,
                        h = c.fromElement;
                    return null == a.pageX && null != c.clientX && (e = a.target.ownerDocument || Y, f = e.documentElement, d = e.body, a.pageX = c.clientX + (f && f.scrollLeft || d && d.scrollLeft || 0) - (f && f.clientLeft || d && d.clientLeft || 0), a.pageY = c.clientY + (f && f.scrollTop || d && d.scrollTop || 0) - (f && f.clientTop || d && d.clientTop || 0)), !a.relatedTarget && h && (a.relatedTarget = h === a.target ? c.toElement : h), a.which || g === b || (a.which = 1 & g ? 1 : 2 & g ? 3 : 4 & g ? 2 : 0), a
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== k() && this.focus) try {
                            return this.focus(), !1
                        } catch (a) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === k() && this.blur ? (this.blur(), !1) : b
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return ka.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : b
                    },
                    _default: function(a) {
                        return ka.nodeName(a.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(a) {
                        a.result !== b && (a.originalEvent.returnValue = a.result)
                    }
                }
            },
            simulate: function(a, b, c, d) {
                var e = ka.extend(new ka.Event, c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? ka.event.trigger(e, null, b) : ka.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, ka.removeEvent = Y.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            var d = "on" + b;
            a.detachEvent && (typeof a[d] === W && (a[d] = null), a.detachEvent(d, c))
        }, ka.Event = function(a, c) {
            return this instanceof ka.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? i : j) : this.type = a, c && ka.extend(this, c), this.timeStamp = a && a.timeStamp || ka.now(), this[ka.expando] = !0, b) : new ka.Event(a, c)
        }, ka.Event.prototype = {
            isDefaultPrevented: j,
            isPropagationStopped: j,
            isImmediatePropagationStopped: j,
            preventDefault: function() {
                var a = this.originalEvent;
                this.isDefaultPrevented = i, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                var a = this.originalEvent;
                this.isPropagationStopped = i, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = i, this.stopPropagation()
            }
        }, ka.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(a, b) {
            ka.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c, d = this,
                        e = a.relatedTarget,
                        f = a.handleObj;
                    return (!e || e !== d && !ka.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
                }
            }
        }), ka.support.submitBubbles || (ka.event.special.submit = {
            setup: function() {
                return ka.nodeName(this, "form") ? !1 : (ka.event.add(this, "click._submit keypress._submit", function(a) {
                    var c = a.target,
                        d = ka.nodeName(c, "input") || ka.nodeName(c, "button") ? c.form : b;
                    d && !ka._data(d, "submitBubbles") && (ka.event.add(d, "submit._submit", function(a) {
                        a._submit_bubble = !0
                    }), ka._data(d, "submitBubbles", !0))
                }), b)
            },
            postDispatch: function(a) {
                a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && ka.event.simulate("submit", this.parentNode, a, !0))
            },
            teardown: function() {
                return ka.nodeName(this, "form") ? !1 : (ka.event.remove(this, "._submit"), b)
            }
        }), ka.support.changeBubbles || (ka.event.special.change = {
            setup: function() {
                return La.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ka.event.add(this, "propertychange._change", function(a) {
                    "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
                }), ka.event.add(this, "click._change", function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1), ka.event.simulate("change", this, a, !0)
                })), !1) : (ka.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    La.test(b.nodeName) && !ka._data(b, "changeBubbles") && (ka.event.add(b, "change._change", function(a) {
                        !this.parentNode || a.isSimulated || a.isTrigger || ka.event.simulate("change", this.parentNode, a, !0)
                    }), ka._data(b, "changeBubbles", !0))
                }), b)
            },
            handle: function(a) {
                var c = a.target;
                return this !== c || a.isSimulated || a.isTrigger || "radio" !== c.type && "checkbox" !== c.type ? a.handleObj.handler.apply(this, arguments) : b
            },
            teardown: function() {
                return ka.event.remove(this, "._change"), !La.test(this.nodeName)
            }
        }), ka.support.focusinBubbles || ka.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var c = 0,
                d = function(a) {
                    ka.event.simulate(b, a.target, ka.event.fix(a), !0)
                };
            ka.event.special[b] = {
                setup: function() {
                    0 === c++ && Y.addEventListener(a, d, !0)
                },
                teardown: function() {
                    0 === --c && Y.removeEventListener(a, d, !0)
                }
            }
        }), ka.fn.extend({
            on: function(a, c, d, e, f) {
                var g, h;
                if ("object" == typeof a) {
                    "string" != typeof c && (d = d || c, c = b);
                    for (g in a) this.on(g, c, d, a[g], f);
                    return this
                }
                if (null == d && null == e ? (e = c, d = c = b) : null == e && ("string" == typeof c ? (e = d, d = b) : (e = d, d = c, c = b)), e === !1) e = j;
                else if (!e) return this;
                return 1 === f && (h = e, e = function(a) {
                    return ka().off(a), h.apply(this, arguments)
                }, e.guid = h.guid || (h.guid = ka.guid++)), this.each(function() {
                    ka.event.add(this, a, e, d, c)
                })
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1)
            },
            off: function(a, c, d) {
                var e, f;
                if (a && a.preventDefault && a.handleObj) return e = a.handleObj, ka(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this;
                if ("object" == typeof a) {
                    for (f in a) this.off(f, c, a[f]);
                    return this
                }
                return (c === !1 || "function" == typeof c) && (d = c, c = b), d === !1 && (d = j), this.each(function() {
                    ka.event.remove(this, a, d, c)
                })
            },
            trigger: function(a, b) {
                return this.each(function() {
                    ka.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, c) {
                var d = this[0];
                return d ? ka.event.trigger(a, c, d, !0) : b
            }
        });
        var Qa = /^.[^:#\[\.,]*$/,
            Ra = /^(?:parents|prev(?:Until|All))/,
            Sa = ka.expr.match.needsContext,
            Ta = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        ka.fn.extend({
            find: function(a) {
                var b, c = [],
                    d = this,
                    e = d.length;
                if ("string" != typeof a) return this.pushStack(ka(a).filter(function() {
                    for (b = 0; e > b; b++)
                        if (ka.contains(d[b], this)) return !0
                }));
                for (b = 0; e > b; b++) ka.find(a, d[b], c);
                return c = this.pushStack(e > 1 ? ka.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
            },
            has: function(a) {
                var b, c = ka(a, this),
                    d = c.length;
                return this.filter(function() {
                    for (b = 0; d > b; b++)
                        if (ka.contains(this, c[b])) return !0
                })
            },
            not: function(a) {
                return this.pushStack(m(this, a || [], !0))
            },
            filter: function(a) {
                return this.pushStack(m(this, a || [], !1))
            },
            is: function(a) {
                return !!m(this, "string" == typeof a && Sa.test(a) ? ka(a) : a || [], !1).length
            },
            closest: function(a, b) {
                for (var c, d = 0, e = this.length, f = [], g = Sa.test(a) || "string" != typeof a ? ka(a, b || this.context) : 0; e > d; d++)
                    for (c = this[d]; c && c !== b; c = c.parentNode)
                        if (11 > c.nodeType && (g ? g.index(c) > -1 : 1 === c.nodeType && ka.find.matchesSelector(c, a))) {
                            c = f.push(c);
                            break
                        }
                return this.pushStack(f.length > 1 ? ka.unique(f) : f)
            },
            index: function(a) {
                return a ? "string" == typeof a ? ka.inArray(this[0], ka(a)) : ka.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(a, b) {
                var c = "string" == typeof a ? ka(a, b) : ka.makeArray(a && a.nodeType ? [a] : a),
                    d = ka.merge(this.get(), c);
                return this.pushStack(ka.unique(d))
            },
            addBack: function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }
        }), ka.each({
            parent: function(a) {
                var b = a.parentNode;
                return b && 11 !== b.nodeType ? b : null
            },
            parents: function(a) {
                return ka.dir(a, "parentNode")
            },
            parentsUntil: function(a, b, c) {
                return ka.dir(a, "parentNode", c)
            },
            next: function(a) {
                return l(a, "nextSibling")
            },
            prev: function(a) {
                return l(a, "previousSibling")
            },
            nextAll: function(a) {
                return ka.dir(a, "nextSibling")
            },
            prevAll: function(a) {
                return ka.dir(a, "previousSibling")
            },
            nextUntil: function(a, b, c) {
                return ka.dir(a, "nextSibling", c)
            },
            prevUntil: function(a, b, c) {
                return ka.dir(a, "previousSibling", c)
            },
            siblings: function(a) {
                return ka.sibling((a.parentNode || {}).firstChild, a)
            },
            children: function(a) {
                return ka.sibling(a.firstChild)
            },
            contents: function(a) {
                return ka.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : ka.merge([], a.childNodes)
            }
        }, function(a, b) {
            ka.fn[a] = function(c, d) {
                var e = ka.map(this, b, c);
                return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = ka.filter(d, e)), this.length > 1 && (Ta[a] || (e = ka.unique(e)), Ra.test(a) && (e = e.reverse())), this.pushStack(e)
            }
        }), ka.extend({
            filter: function(a, b, c) {
                var d = b[0];
                return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? ka.find.matchesSelector(d, a) ? [d] : [] : ka.find.matches(a, ka.grep(b, function(a) {
                    return 1 === a.nodeType
                }))
            },
            dir: function(a, c, d) {
                for (var e = [], f = a[c]; f && 9 !== f.nodeType && (d === b || 1 !== f.nodeType || !ka(f).is(d));) 1 === f.nodeType && e.push(f), f = f[c];
                return e
            },
            sibling: function(a, b) {
                for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
                return c
            }
        });
        var Ua = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            Va = / jQuery\d+="(?:null|\d+)"/g,
            Wa = RegExp("<(?:" + Ua + ")[\\s/>]", "i"),
            Xa = /^\s+/,
            Ya = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            Za = /<([\w:]+)/,
            $a = /<tbody/i,
            _a = /<|&#?\w+;/,
            ab = /<(?:script|style|link)/i,
            bb = /^(?:checkbox|radio)$/i,
            cb = /checked\s*(?:[^=]|=\s*.checked.)/i,
            db = /^$|\/(?:java|ecma)script/i,
            eb = /^true\/(.*)/,
            fb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            gb = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                area: [1, "<map>", "</map>"],
                param: [1, "<object>", "</object>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: ka.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
            },
            hb = n(Y),
            ib = hb.appendChild(Y.createElement("div"));
        gb.optgroup = gb.option, gb.tbody = gb.tfoot = gb.colgroup = gb.caption = gb.thead, gb.th = gb.td, ka.fn.extend({
            text: function(a) {
                return ka.access(this, function(a) {
                    return a === b ? ka.text(this) : this.empty().append((this[0] && this[0].ownerDocument || Y).createTextNode(a))
                }, null, a, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = o(this, a);
                        b.appendChild(a)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = o(this, a);
                        b.insertBefore(a, b.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                })
            },
            remove: function(a, b) {
                for (var c, d = a ? ka.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || ka.cleanData(u(c)), c.parentNode && (b && ka.contains(c.ownerDocument, c) && r(u(c, "script")), c.parentNode.removeChild(c));
                return this
            },
            empty: function() {
                for (var a, b = 0; null != (a = this[b]); b++) {
                    for (1 === a.nodeType && ka.cleanData(u(a, !1)); a.firstChild;) a.removeChild(a.firstChild);
                    a.options && ka.nodeName(a, "select") && (a.options.length = 0)
                }
                return this
            },
            clone: function(a, b) {
                return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                    return ka.clone(this, a, b)
                })
            },
            html: function(a) {
                return ka.access(this, function(a) {
                    var c = this[0] || {},
                        d = 0,
                        e = this.length;
                    if (a === b) return 1 === c.nodeType ? c.innerHTML.replace(Va, "") : b;
                    if (!("string" != typeof a || ab.test(a) || !ka.support.htmlSerialize && Wa.test(a) || !ka.support.leadingWhitespace && Xa.test(a) || gb[(Za.exec(a) || ["", ""])[1].toLowerCase()])) {
                        a = a.replace(Ya, "<$1></$2>");
                        try {
                            for (; e > d; d++) c = this[d] || {}, 1 === c.nodeType && (ka.cleanData(u(c, !1)), c.innerHTML = a);
                            c = 0
                        } catch (f) {}
                    }
                    c && this.empty().append(a)
                }, null, a, arguments.length)
            },
            replaceWith: function() {
                var a = ka.map(this, function(a) {
                        return [a.nextSibling, a.parentNode]
                    }),
                    b = 0;
                return this.domManip(arguments, function(c) {
                    var d = a[b++],
                        e = a[b++];
                    e && (d && d.parentNode !== e && (d = this.nextSibling), ka(this).remove(), e.insertBefore(c, d))
                }, !0), b ? this : this.remove()
            },
            detach: function(a) {
                return this.remove(a, !0)
            },
            domManip: function(a, b, c) {
                a = da.apply([], a);
                var d, e, f, g, h, i, j = 0,
                    k = this.length,
                    l = this,
                    m = k - 1,
                    n = a[0],
                    o = ka.isFunction(n);
                if (o || !(1 >= k || "string" != typeof n || ka.support.checkClone) && cb.test(n)) return this.each(function(d) {
                    var e = l.eq(d);
                    o && (a[0] = n.call(this, d, e.html())), e.domManip(a, b, c)
                });
                if (k && (i = ka.buildFragment(a, this[0].ownerDocument, !1, !c && this), d = i.firstChild, 1 === i.childNodes.length && (i = d), d)) {
                    for (g = ka.map(u(i, "script"), p), f = g.length; k > j; j++) e = i, j !== m && (e = ka.clone(e, !0, !0), f && ka.merge(g, u(e, "script"))), b.call(this[j], e, j);
                    if (f)
                        for (h = g[g.length - 1].ownerDocument, ka.map(g, q), j = 0; f > j; j++) e = g[j], db.test(e.type || "") && !ka._data(e, "globalEval") && ka.contains(h, e) && (e.src ? ka._evalUrl(e.src) : ka.globalEval((e.text || e.textContent || e.innerHTML || "").replace(fb, "")));
                    i = d = null
                }
                return this
            }
        }), ka.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(a, b) {
            ka.fn[a] = function(a) {
                for (var c, d = 0, e = [], f = ka(a), g = f.length - 1; g >= d; d++) c = d === g ? this : this.clone(!0), ka(f[d])[b](c), ea.apply(e, c.get());
                return this.pushStack(e)
            }
        }), ka.extend({
            clone: function(a, b, c) {
                var d, e, f, g, h, i = ka.contains(a.ownerDocument, a);
                if (ka.support.html5Clone || ka.isXMLDoc(a) || !Wa.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (ib.innerHTML = a.outerHTML, ib.removeChild(f = ib.firstChild)), !(ka.support.noCloneEvent && ka.support.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || ka.isXMLDoc(a)))
                    for (d = u(f), h = u(a), g = 0; null != (e = h[g]); ++g) d[g] && t(e, d[g]);
                if (b)
                    if (c)
                        for (h = h || u(a), d = d || u(f), g = 0; null != (e = h[g]); g++) s(e, d[g]);
                    else s(a, f);
                return d = u(f, "script"), d.length > 0 && r(d, !i && u(a, "script")), d = h = e = null, f
            },
            buildFragment: function(a, b, c, d) {
                for (var e, f, g, h, i, j, k, l = a.length, m = n(b), o = [], p = 0; l > p; p++)
                    if (f = a[p], f || 0 === f)
                        if ("object" === ka.type(f)) ka.merge(o, f.nodeType ? [f] : f);
                        else if (_a.test(f)) {
                    for (h = h || m.appendChild(b.createElement("div")), i = (Za.exec(f) || ["", ""])[1].toLowerCase(), k = gb[i] || gb._default, h.innerHTML = k[1] + f.replace(Ya, "<$1></$2>") + k[2], e = k[0]; e--;) h = h.lastChild;
                    if (!ka.support.leadingWhitespace && Xa.test(f) && o.push(b.createTextNode(Xa.exec(f)[0])), !ka.support.tbody)
                        for (f = "table" !== i || $a.test(f) ? "<table>" !== k[1] || $a.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length; e--;) ka.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                    for (ka.merge(o, h.childNodes), h.textContent = ""; h.firstChild;) h.removeChild(h.firstChild);
                    h = m.lastChild
                } else o.push(b.createTextNode(f));
                for (h && m.removeChild(h), ka.support.appendChecked || ka.grep(u(o, "input"), v), p = 0; f = o[p++];)
                    if ((!d || -1 === ka.inArray(f, d)) && (g = ka.contains(f.ownerDocument, f), h = u(m.appendChild(f), "script"), g && r(h), c))
                        for (e = 0; f = h[e++];) db.test(f.type || "") && c.push(f);
                return h = null, m
            },
            cleanData: function(a, b) {
                for (var c, d, e, f, g = 0, h = ka.expando, i = ka.cache, j = ka.support.deleteExpando, k = ka.event.special; null != (c = a[g]); g++)
                    if ((b || ka.acceptData(c)) && (e = c[h], f = e && i[e])) {
                        if (f.events)
                            for (d in f.events) k[d] ? ka.event.remove(c, d) : ka.removeEvent(c, d, f.handle);
                        i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== W ? c.removeAttribute(h) : c[h] = null, ba.push(e))
                    }
            },
            _evalUrl: function(a) {
                return ka.ajax({
                    url: a,
                    type: "GET",
                    dataType: "script",
                    async: !1,
                    global: !1,
                    "throws": !0
                })
            }
        }), ka.fn.extend({
            wrapAll: function(a) {
                if (ka.isFunction(a)) return this.each(function(b) {
                    ka(this).wrapAll(a.call(this, b))
                });
                if (this[0]) {
                    var b = ka(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                        for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;) a = a.firstChild;
                        return a
                    }).append(this)
                }
                return this
            },
            wrapInner: function(a) {
                return this.each(ka.isFunction(a) ? function(b) {
                    ka(this).wrapInner(a.call(this, b))
                } : function() {
                    var b = ka(this),
                        c = b.contents();
                    c.length ? c.wrapAll(a) : b.append(a)
                })
            },
            wrap: function(a) {
                var b = ka.isFunction(a);
                return this.each(function(c) {
                    ka(this).wrapAll(b ? a.call(this, c) : a)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    ka.nodeName(this, "body") || ka(this).replaceWith(this.childNodes)
                }).end()
            }
        });
        var jb, kb, lb, mb = /alpha\([^)]*\)/i,
            nb = /opacity\s*=\s*([^)]*)/,
            ob = /^(top|right|bottom|left)$/,
            pb = /^(none|table(?!-c[ea]).+)/,
            qb = /^margin/,
            rb = RegExp("^(" + la + ")(.*)$", "i"),
            sb = RegExp("^(" + la + ")(?!px)[a-z%]+$", "i"),
            tb = RegExp("^([+-])=(" + la + ")", "i"),
            ub = {
                BODY: "block"
            },
            vb = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            wb = {
                letterSpacing: 0,
                fontWeight: 400
            },
            xb = ["Top", "Right", "Bottom", "Left"],
            yb = ["Webkit", "O", "Moz", "ms"];
        ka.fn.extend({
            css: function(a, c) {
                return ka.access(this, function(a, c, d) {
                    var e, f, g = {},
                        h = 0;
                    if (ka.isArray(c)) {
                        for (f = kb(a), e = c.length; e > h; h++) g[c[h]] = ka.css(a, c[h], !1, f);
                        return g
                    }
                    return d !== b ? ka.style(a, c, d) : ka.css(a, c)
                }, a, c, arguments.length > 1)
            },
            show: function() {
                return y(this, !0)
            },
            hide: function() {
                return y(this)
            },
            toggle: function(a) {
                return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                    x(this) ? ka(this).show() : ka(this).hide()
                })
            }
        }), ka.extend({
            cssHooks: {
                opacity: {
                    get: function(a, b) {
                        if (b) {
                            var c = lb(a, "opacity");
                            return "" === c ? "1" : c
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": ka.support.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(a, c, d, e) {
                if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                    var f, g, h, i = ka.camelCase(c),
                        j = a.style;
                    if (c = ka.cssProps[i] || (ka.cssProps[i] = w(j, i)), h = ka.cssHooks[c] || ka.cssHooks[i], d === b) return h && "get" in h && (f = h.get(a, !1, e)) !== b ? f : j[c];
                    if (g = typeof d, "string" === g && (f = tb.exec(d)) && (d = (f[1] + 1) * f[2] + parseFloat(ka.css(a, c)), g = "number"), !(null == d || "number" === g && isNaN(d) || ("number" !== g || ka.cssNumber[i] || (d += "px"), ka.support.clearCloneStyle || "" !== d || 0 !== c.indexOf("background") || (j[c] = "inherit"), h && "set" in h && (d = h.set(a, d, e)) === b))) try {
                        j[c] = d
                    } catch (k) {}
                }
            },
            css: function(a, c, d, e) {
                var f, g, h, i = ka.camelCase(c);
                return c = ka.cssProps[i] || (ka.cssProps[i] = w(a.style, i)), h = ka.cssHooks[c] || ka.cssHooks[i], h && "get" in h && (g = h.get(a, !0, d)), g === b && (g = lb(a, c, e)), "normal" === g && c in wb && (g = wb[c]), "" === d || d ? (f = parseFloat(g), d === !0 || ka.isNumeric(f) ? f || 0 : g) : g
            }
        }), a.getComputedStyle ? (kb = function(b) {
            return a.getComputedStyle(b, null)
        }, lb = function(a, c, d) {
            var e, f, g, h = d || kb(a),
                i = h ? h.getPropertyValue(c) || h[c] : b,
                j = a.style;
            return h && ("" !== i || ka.contains(a.ownerDocument, a) || (i = ka.style(a, c)), sb.test(i) && qb.test(c) && (e = j.width, f = j.minWidth, g = j.maxWidth, j.minWidth = j.maxWidth = j.width = i, i = h.width, j.width = e, j.minWidth = f, j.maxWidth = g)), i
        }) : Y.documentElement.currentStyle && (kb = function(a) {
            return a.currentStyle
        }, lb = function(a, c, d) {
            var e, f, g, h = d || kb(a),
                i = h ? h[c] : b,
                j = a.style;
            return null == i && j && j[c] && (i = j[c]), sb.test(i) && !ob.test(c) && (e = j.left, f = a.runtimeStyle, g = f && f.left, g && (f.left = a.currentStyle.left), j.left = "fontSize" === c ? "1em" : i, i = j.pixelLeft + "px", j.left = e, g && (f.left = g)), "" === i ? "auto" : i
        }), ka.each(["height", "width"], function(a, c) {
            ka.cssHooks[c] = {
                get: function(a, d, e) {
                    return d ? 0 === a.offsetWidth && pb.test(ka.css(a, "display")) ? ka.swap(a, vb, function() {
                        return B(a, c, e)
                    }) : B(a, c, e) : b
                },
                set: function(a, b, d) {
                    var e = d && kb(a);
                    return z(a, b, d ? A(a, c, d, ka.support.boxSizing && "border-box" === ka.css(a, "boxSizing", !1, e), e) : 0)
                }
            }
        }), ka.support.opacity || (ka.cssHooks.opacity = {
            get: function(a, b) {
                return nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
            },
            set: function(a, b) {
                var c = a.style,
                    d = a.currentStyle,
                    e = ka.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                    f = d && d.filter || c.filter || "";
                c.zoom = 1, (b >= 1 || "" === b) && "" === ka.trim(f.replace(mb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = mb.test(f) ? f.replace(mb, e) : f + " " + e)
            }
        }), ka(function() {
            ka.support.reliableMarginRight || (ka.cssHooks.marginRight = {
                get: function(a, c) {
                    return c ? ka.swap(a, {
                        display: "inline-block"
                    }, lb, [a, "marginRight"]) : b
                }
            }), !ka.support.pixelPosition && ka.fn.position && ka.each(["top", "left"], function(a, c) {
                ka.cssHooks[c] = {
                    get: function(a, d) {
                        return d ? (d = lb(a, c), sb.test(d) ? ka(a).position()[c] + "px" : d) : b
                    }
                }
            })
        }), ka.expr && ka.expr.filters && (ka.expr.filters.hidden = function(a) {
            return 0 >= a.offsetWidth && 0 >= a.offsetHeight || !ka.support.reliableHiddenOffsets && "none" === (a.style && a.style.display || ka.css(a, "display"))
        }, ka.expr.filters.visible = function(a) {
            return !ka.expr.filters.hidden(a)
        }), ka.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(a, b) {
            ka.cssHooks[a + b] = {
                expand: function(c) {
                    for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + xb[d] + b] = f[d] || f[d - 2] || f[0];
                    return e
                }
            }, qb.test(a) || (ka.cssHooks[a + b].set = z)
        });
        var zb = /%20/g,
            Ab = /\[\]$/,
            Bb = /\r?\n/g,
            Cb = /^(?:submit|button|image|reset|file)$/i,
            Db = /^(?:input|select|textarea|keygen)/i;
        ka.fn.extend({
            serialize: function() {
                return ka.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var a = ka.prop(this, "elements");
                    return a ? ka.makeArray(a) : this
                }).filter(function() {
                    var a = this.type;
                    return this.name && !ka(this).is(":disabled") && Db.test(this.nodeName) && !Cb.test(a) && (this.checked || !bb.test(a))
                }).map(function(a, b) {
                    var c = ka(this).val();
                    return null == c ? null : ka.isArray(c) ? ka.map(c, function(a) {
                        return {
                            name: b.name,
                            value: a.replace(Bb, "\r\n")
                        }
                    }) : {
                        name: b.name,
                        value: c.replace(Bb, "\r\n")
                    }
                }).get()
            }
        }), ka.param = function(a, c) {
            var d, e = [],
                f = function(a, b) {
                    b = ka.isFunction(b) ? b() : null == b ? "" : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            if (c === b && (c = ka.ajaxSettings && ka.ajaxSettings.traditional), ka.isArray(a) || a.jquery && !ka.isPlainObject(a)) ka.each(a, function() {
                f(this.name, this.value)
            });
            else
                for (d in a) E(d, a[d], c, f);
            return e.join("&").replace(zb, "+")
        }, ka.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            ka.fn[b] = function(a, c) {
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }
        }), ka.fn.extend({
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
            }
        });
        var Eb, Fb, Gb = ka.now(),
            Hb = /\?/,
            Ib = /#.*$/,
            Jb = /([?&])_=[^&]*/,
            Kb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Lb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Mb = /^(?:GET|HEAD)$/,
            Nb = /^\/\//,
            Ob = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
            Pb = ka.fn.load,
            Qb = {},
            Rb = {},
            Sb = "*/".concat("*");
        try {
            Fb = X.href
        } catch (Tb) {
            Fb = Y.createElement("a"), Fb.href = "", Fb = Fb.href
        }
        Eb = Ob.exec(Fb.toLowerCase()) || [], ka.fn.load = function(a, c, d) {
            if ("string" != typeof a && Pb) return Pb.apply(this, arguments);
            var e, f, g, h = this,
                i = a.indexOf(" ");
            return i >= 0 && (e = a.slice(i, a.length), a = a.slice(0, i)), ka.isFunction(c) ? (d = c, c = b) : c && "object" == typeof c && (g = "POST"), h.length > 0 && ka.ajax({
                url: a,
                type: g,
                dataType: "html",
                data: c
            }).done(function(a) {
                f = arguments, h.html(e ? ka("<div>").append(ka.parseHTML(a)).find(e) : a)
            }).complete(d && function(a, b) {
                h.each(d, f || [a.responseText, b, a])
            }), this
        }, ka.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
            ka.fn[b] = function(a) {
                return this.on(b, a)
            }
        }), ka.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Fb,
                type: "GET",
                isLocal: Lb.test(Eb[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Sb,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": ka.parseJSON,
                    "text xml": ka.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(a, b) {
                return b ? H(H(a, ka.ajaxSettings), b) : H(ka.ajaxSettings, a)
            },
            ajaxPrefilter: F(Qb),
            ajaxTransport: F(Rb),
            ajax: function(a, c) {
                function d(a, c, d, e) {
                    var f, l, s, t, v, x = c;
                    2 !== u && (u = 2, i && clearTimeout(i), k = b, h = e || "", w.readyState = a > 0 ? 4 : 0, f = a >= 200 && 300 > a || 304 === a, d && (t = I(m, w, d)), t = J(m, t, w, f), f ? (m.ifModified && (v = w.getResponseHeader("Last-Modified"), v && (ka.lastModified[g] = v), v = w.getResponseHeader("etag"), v && (ka.etag[g] = v)), 204 === a || "HEAD" === m.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = t.state, l = t.data, s = t.error, f = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), w.status = a, w.statusText = (c || x) + "", f ? p.resolveWith(n, [l, x, w]) : p.rejectWith(n, [w, x, s]), w.statusCode(r), r = b, j && o.trigger(f ? "ajaxSuccess" : "ajaxError", [w, m, f ? l : s]), q.fireWith(n, [w, x]), j && (o.trigger("ajaxComplete", [w, m]), --ka.active || ka.event.trigger("ajaxStop")))
                }
                "object" == typeof a && (c = a, a = b), c = c || {};
                var e, f, g, h, i, j, k, l, m = ka.ajaxSetup({}, c),
                    n = m.context || m,
                    o = m.context && (n.nodeType || n.jquery) ? ka(n) : ka.event,
                    p = ka.Deferred(),
                    q = ka.Callbacks("once memory"),
                    r = m.statusCode || {},
                    s = {},
                    t = {},
                    u = 0,
                    v = "canceled",
                    w = {
                        readyState: 0,
                        getResponseHeader: function(a) {
                            var b;
                            if (2 === u) {
                                if (!l)
                                    for (l = {}; b = Kb.exec(h);) l[b[1].toLowerCase()] = b[2];
                                b = l[a.toLowerCase()]
                            }
                            return null == b ? null : b
                        },
                        getAllResponseHeaders: function() {
                            return 2 === u ? h : null
                        },
                        setRequestHeader: function(a, b) {
                            var c = a.toLowerCase();
                            return u || (a = t[c] = t[c] || a, s[a] = b), this
                        },
                        overrideMimeType: function(a) {
                            return u || (m.mimeType = a), this
                        },
                        statusCode: function(a) {
                            var b;
                            if (a)
                                if (2 > u)
                                    for (b in a) r[b] = [r[b], a[b]];
                                else w.always(a[w.status]);
                            return this
                        },
                        abort: function(a) {
                            var b = a || v;
                            return k && k.abort(b), d(0, b), this
                        }
                    };
                if (p.promise(w).complete = q.add, w.success = w.done, w.error = w.fail, m.url = ((a || m.url || Fb) + "").replace(Ib, "").replace(Nb, Eb[1] + "//"), m.type = c.method || c.type || m.method || m.type, m.dataTypes = ka.trim(m.dataType || "*").toLowerCase().match(ma) || [""], null == m.crossDomain && (e = Ob.exec(m.url.toLowerCase()), m.crossDomain = !(!e || e[1] === Eb[1] && e[2] === Eb[2] && (e[3] || ("http:" === e[1] ? "80" : "443")) === (Eb[3] || ("http:" === Eb[1] ? "80" : "443")))), m.data && m.processData && "string" != typeof m.data && (m.data = ka.param(m.data, m.traditional)), G(Qb, m, c, w), 2 === u) return w;
                j = m.global, j && 0 === ka.active++ && ka.event.trigger("ajaxStart"), m.type = m.type.toUpperCase(), m.hasContent = !Mb.test(m.type), g = m.url, m.hasContent || (m.data && (g = m.url += (Hb.test(g) ? "&" : "?") + m.data, delete m.data), m.cache === !1 && (m.url = Jb.test(g) ? g.replace(Jb, "$1_=" + Gb++) : g + (Hb.test(g) ? "&" : "?") + "_=" + Gb++)), m.ifModified && (ka.lastModified[g] && w.setRequestHeader("If-Modified-Since", ka.lastModified[g]), ka.etag[g] && w.setRequestHeader("If-None-Match", ka.etag[g])), (m.data && m.hasContent && m.contentType !== !1 || c.contentType) && w.setRequestHeader("Content-Type", m.contentType), w.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + Sb + "; q=0.01" : "") : m.accepts["*"]);
                for (f in m.headers) w.setRequestHeader(f, m.headers[f]);
                if (m.beforeSend && (m.beforeSend.call(n, w, m) === !1 || 2 === u)) return w.abort();
                v = "abort";
                for (f in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) w[f](m[f]);
                if (k = G(Rb, m, c, w)) {
                    w.readyState = 1, j && o.trigger("ajaxSend", [w, m]), m.async && m.timeout > 0 && (i = setTimeout(function() {
                        w.abort("timeout")
                    }, m.timeout));
                    try {
                        u = 1, k.send(s, d)
                    } catch (x) {
                        if (!(2 > u)) throw x;
                        d(-1, x)
                    }
                } else d(-1, "No Transport");
                return w
            },
            getJSON: function(a, b, c) {
                return ka.get(a, b, c, "json")
            },
            getScript: function(a, c) {
                return ka.get(a, b, c, "script")
            }
        }), ka.each(["get", "post"], function(a, c) {
            ka[c] = function(a, d, e, f) {
                return ka.isFunction(d) && (f = f || e, e = d, d = b), ka.ajax({
                    url: a,
                    type: c,
                    dataType: f,
                    data: d,
                    success: e
                })
            }
        }), ka.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(a) {
                    return ka.globalEval(a), a
                }
            }
        }), ka.ajaxPrefilter("script", function(a) {
            a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
        }), ka.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var c, d = Y.head || ka("head")[0] || Y.documentElement;
                return {
                    send: function(b, e) {
                        c = Y.createElement("script"), c.async = !0, a.scriptCharset && (c.charset = a.scriptCharset), c.src = a.url, c.onload = c.onreadystatechange = function(a, b) {
                            (b || !c.readyState || /loaded|complete/.test(c.readyState)) && (c.onload = c.onreadystatechange = null, c.parentNode && c.parentNode.removeChild(c), c = null, b || e(200, "success"));
                        }, d.insertBefore(c, d.firstChild)
                    },
                    abort: function() {
                        c && c.onload(b, !0)
                    }
                }
            }
        });
        var Ub = [],
            Vb = /(=)\?(?=&|$)|\?\?/;
        ka.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var a = Ub.pop() || ka.expando + "_" + Gb++;
                return this[a] = !0, a
            }
        }), ka.ajaxPrefilter("json jsonp", function(c, d, e) {
            var f, g, h, i = c.jsonp !== !1 && (Vb.test(c.url) ? "url" : "string" == typeof c.data && !(c.contentType || "").indexOf("application/x-www-form-urlencoded") && Vb.test(c.data) && "data");
            return i || "jsonp" === c.dataTypes[0] ? (f = c.jsonpCallback = ka.isFunction(c.jsonpCallback) ? c.jsonpCallback() : c.jsonpCallback, i ? c[i] = c[i].replace(Vb, "$1" + f) : c.jsonp !== !1 && (c.url += (Hb.test(c.url) ? "&" : "?") + c.jsonp + "=" + f), c.converters["script json"] = function() {
                return h || ka.error(f + " was not called"), h[0]
            }, c.dataTypes[0] = "json", g = a[f], a[f] = function() {
                h = arguments
            }, e.always(function() {
                a[f] = g, c[f] && (c.jsonpCallback = d.jsonpCallback, Ub.push(f)), h && ka.isFunction(g) && g(h[0]), h = g = b
            }), "script") : b
        });
        var Wb, Xb, Yb = 0,
            Zb = a.ActiveXObject && function() {
                var a;
                for (a in Wb) Wb[a](b, !0)
            };
        ka.ajaxSettings.xhr = a.ActiveXObject ? function() {
            return !this.isLocal && K() || L()
        } : K, Xb = ka.ajaxSettings.xhr(), ka.support.cors = !!Xb && "withCredentials" in Xb, Xb = ka.support.ajax = !!Xb, Xb && ka.ajaxTransport(function(c) {
            if (!c.crossDomain || ka.support.cors) {
                var d;
                return {
                    send: function(e, f) {
                        var g, h, i = c.xhr();
                        if (c.username ? i.open(c.type, c.url, c.async, c.username, c.password) : i.open(c.type, c.url, c.async), c.xhrFields)
                            for (h in c.xhrFields) i[h] = c.xhrFields[h];
                        c.mimeType && i.overrideMimeType && i.overrideMimeType(c.mimeType), c.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (h in e) i.setRequestHeader(h, e[h])
                        } catch (j) {}
                        i.send(c.hasContent && c.data || null), d = function(a, e) {
                            var h, j, k, l;
                            try {
                                if (d && (e || 4 === i.readyState))
                                    if (d = b, g && (i.onreadystatechange = ka.noop, Zb && delete Wb[g]), e) 4 !== i.readyState && i.abort();
                                    else {
                                        l = {}, h = i.status, j = i.getAllResponseHeaders(), "string" == typeof i.responseText && (l.text = i.responseText);
                                        try {
                                            k = i.statusText
                                        } catch (m) {
                                            k = ""
                                        }
                                        h || !c.isLocal || c.crossDomain ? 1223 === h && (h = 204) : h = l.text ? 200 : 404
                                    }
                            } catch (n) {
                                e || f(-1, n)
                            }
                            l && f(h, k, l, j)
                        }, c.async ? 4 === i.readyState ? setTimeout(d) : (g = ++Yb, Zb && (Wb || (Wb = {}, ka(a).unload(Zb)), Wb[g] = d), i.onreadystatechange = d) : d()
                    },
                    abort: function() {
                        d && d(b, !0)
                    }
                }
            }
        });
        var $b, _b, ac = /^(?:toggle|show|hide)$/,
            bc = RegExp("^(?:([+-])=|)(" + la + ")([a-z%]*)$", "i"),
            cc = /queueHooks$/,
            dc = [Q],
            ec = {
                "*": [function(a, b) {
                    var c = this.createTween(a, b),
                        d = c.cur(),
                        e = bc.exec(b),
                        f = e && e[3] || (ka.cssNumber[a] ? "" : "px"),
                        g = (ka.cssNumber[a] || "px" !== f && +d) && bc.exec(ka.css(c.elem, a)),
                        h = 1,
                        i = 20;
                    if (g && g[3] !== f) {
                        f = f || g[3], e = e || [], g = +d || 1;
                        do h = h || ".5", g /= h, ka.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
                    }
                    return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
                }]
            };
        ka.Animation = ka.extend(O, {
            tweener: function(a, b) {
                ka.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
                for (var c, d = 0, e = a.length; e > d; d++) c = a[d], ec[c] = ec[c] || [], ec[c].unshift(b)
            },
            prefilter: function(a, b) {
                b ? dc.unshift(a) : dc.push(a)
            }
        }), ka.Tween = R, R.prototype = {
            constructor: R,
            init: function(a, b, c, d, e, f) {
                this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (ka.cssNumber[c] ? "" : "px")
            },
            cur: function() {
                var a = R.propHooks[this.prop];
                return a && a.get ? a.get(this) : R.propHooks._default.get(this)
            },
            run: function(a) {
                var b, c = R.propHooks[this.prop];
                return this.pos = b = this.options.duration ? ka.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : R.propHooks._default.set(this), this
            }
        }, R.prototype.init.prototype = R.prototype, R.propHooks = {
            _default: {
                get: function(a) {
                    var b;
                    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = ka.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
                },
                set: function(a) {
                    ka.fx.step[a.prop] ? ka.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[ka.cssProps[a.prop]] || ka.cssHooks[a.prop]) ? ka.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                }
            }
        }, R.propHooks.scrollTop = R.propHooks.scrollLeft = {
            set: function(a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
            }
        }, ka.each(["toggle", "show", "hide"], function(a, b) {
            var c = ka.fn[b];
            ka.fn[b] = function(a, d, e) {
                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(S(b, !0), a, d, e)
            }
        }), ka.fn.extend({
            fadeTo: function(a, b, c, d) {
                return this.filter(x).css("opacity", 0).show().end().animate({
                    opacity: b
                }, a, c, d)
            },
            animate: function(a, b, c, d) {
                var e = ka.isEmptyObject(a),
                    f = ka.speed(b, c, d),
                    g = function() {
                        var b = O(this, ka.extend({}, a), f);
                        (e || ka._data(this, "finish")) && b.stop(!0)
                    };
                return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
            },
            stop: function(a, c, d) {
                var e = function(a) {
                    var b = a.stop;
                    delete a.stop, b(d)
                };
                return "string" != typeof a && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                    var b = !0,
                        c = null != a && a + "queueHooks",
                        f = ka.timers,
                        g = ka._data(this);
                    if (c) g[c] && g[c].stop && e(g[c]);
                    else
                        for (c in g) g[c] && g[c].stop && cc.test(c) && e(g[c]);
                    for (c = f.length; c--;) f[c].elem !== this || null != a && f[c].queue !== a || (f[c].anim.stop(d), b = !1, f.splice(c, 1));
                    (b || !d) && ka.dequeue(this, a)
                })
            },
            finish: function(a) {
                return a !== !1 && (a = a || "fx"), this.each(function() {
                    var b, c = ka._data(this),
                        d = c[a + "queue"],
                        e = c[a + "queueHooks"],
                        f = ka.timers,
                        g = d ? d.length : 0;
                    for (c.finish = !0, ka.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                    for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                    delete c.finish
                })
            }
        }), ka.each({
            slideDown: S("show"),
            slideUp: S("hide"),
            slideToggle: S("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(a, b) {
            ka.fn[a] = function(a, c, d) {
                return this.animate(b, a, c, d)
            }
        }), ka.speed = function(a, b, c) {
            var d = a && "object" == typeof a ? ka.extend({}, a) : {
                complete: c || !c && b || ka.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !ka.isFunction(b) && b
            };
            return d.duration = ka.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in ka.fx.speeds ? ka.fx.speeds[d.duration] : ka.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                ka.isFunction(d.old) && d.old.call(this), d.queue && ka.dequeue(this, d.queue)
            }, d
        }, ka.easing = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2
            }
        }, ka.timers = [], ka.fx = R.prototype.init, ka.fx.tick = function() {
            var a, c = ka.timers,
                d = 0;
            for ($b = ka.now(); c.length > d; d++) a = c[d], a() || c[d] !== a || c.splice(d--, 1);
            c.length || ka.fx.stop(), $b = b
        }, ka.fx.timer = function(a) {
            a() && ka.timers.push(a) && ka.fx.start()
        }, ka.fx.interval = 13, ka.fx.start = function() {
            _b || (_b = setInterval(ka.fx.tick, ka.fx.interval))
        }, ka.fx.stop = function() {
            clearInterval(_b), _b = null
        }, ka.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, ka.fx.step = {}, ka.expr && ka.expr.filters && (ka.expr.filters.animated = function(a) {
            return ka.grep(ka.timers, function(b) {
                return a === b.elem
            }).length
        }), ka.fn.offset = function(a) {
            if (arguments.length) return a === b ? this : this.each(function(b) {
                ka.offset.setOffset(this, a, b)
            });
            var c, d, e = {
                    top: 0,
                    left: 0
                },
                f = this[0],
                g = f && f.ownerDocument;
            return g ? (c = g.documentElement, ka.contains(c, f) ? (typeof f.getBoundingClientRect !== W && (e = f.getBoundingClientRect()), d = T(g), {
                top: e.top + (d.pageYOffset || c.scrollTop) - (c.clientTop || 0),
                left: e.left + (d.pageXOffset || c.scrollLeft) - (c.clientLeft || 0)
            }) : e) : void 0
        }, ka.offset = {
            setOffset: function(a, b, c) {
                var d = ka.css(a, "position");
                "static" === d && (a.style.position = "relative");
                var e, f, g = ka(a),
                    h = g.offset(),
                    i = ka.css(a, "top"),
                    j = ka.css(a, "left"),
                    k = ("absolute" === d || "fixed" === d) && ka.inArray("auto", [i, j]) > -1,
                    l = {},
                    m = {};
                k ? (m = g.position(), e = m.top, f = m.left) : (e = parseFloat(i) || 0, f = parseFloat(j) || 0), ka.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (l.top = b.top - h.top + e), null != b.left && (l.left = b.left - h.left + f), "using" in b ? b.using.call(a, l) : g.css(l)
            }
        }, ka.fn.extend({
            position: function() {
                if (this[0]) {
                    var a, b, c = {
                            top: 0,
                            left: 0
                        },
                        d = this[0];
                    return "fixed" === ka.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), ka.nodeName(a[0], "html") || (c = a.offset()), c.top += ka.css(a[0], "borderTopWidth", !0), c.left += ka.css(a[0], "borderLeftWidth", !0)), {
                        top: b.top - c.top - ka.css(d, "marginTop", !0),
                        left: b.left - c.left - ka.css(d, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var a = this.offsetParent || Z; a && !ka.nodeName(a, "html") && "static" === ka.css(a, "position");) a = a.offsetParent;
                    return a || Z
                })
            }
        }), ka.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(a, c) {
            var d = /Y/.test(c);
            ka.fn[a] = function(e) {
                return ka.access(this, function(a, e, f) {
                    var g = T(a);
                    return f === b ? g ? c in g ? g[c] : g.document.documentElement[e] : a[e] : (g ? g.scrollTo(d ? ka(g).scrollLeft() : f, d ? f : ka(g).scrollTop()) : a[e] = f, b)
                }, a, e, arguments.length, null)
            }
        }), ka.each({
            Height: "height",
            Width: "width"
        }, function(a, c) {
            ka.each({
                padding: "inner" + a,
                content: c,
                "": "outer" + a
            }, function(d, e) {
                ka.fn[e] = function(e, f) {
                    var g = arguments.length && (d || "boolean" != typeof e),
                        h = d || (e === !0 || f === !0 ? "margin" : "border");
                    return ka.access(this, function(c, d, e) {
                        var f;
                        return ka.isWindow(c) ? c.document.documentElement["client" + a] : 9 === c.nodeType ? (f = c.documentElement, Math.max(c.body["scroll" + a], f["scroll" + a], c.body["offset" + a], f["offset" + a], f["client" + a])) : e === b ? ka.css(c, d, h) : ka.style(c, d, e, h)
                    }, c, g ? e : b, g, null)
                }
            })
        }), ka.fn.size = function() {
            return this.length
        }, ka.fn.andSelf = ka.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = ka : (a.jQuery = a.$ = ka, "function" == typeof define && define.amd && define("jquery", [], function() {
            return ka
        }))
    }(window), ! function(a, b) {
        "function" == typeof define && define.amd ? define("bloodhound", ["jquery"], function(c) {
            return a.Bloodhound = b(c)
        }) : "object" == typeof exports ? module.exports = b(require("jquery")) : a.Bloodhound = b(jQuery)
    }(this, function(a) {
        var b = function() {
                "use strict";
                return {
                    isMsie: function() {
                        return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1
                    },
                    isBlankString: function(a) {
                        return !a || /^\s*$/.test(a)
                    },
                    escapeRegExChars: function(a) {
                        return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                    },
                    isString: function(a) {
                        return "string" == typeof a
                    },
                    isNumber: function(a) {
                        return "number" == typeof a
                    },
                    isArray: a.isArray,
                    isFunction: a.isFunction,
                    isObject: a.isPlainObject,
                    isUndefined: function(a) {
                        return "undefined" == typeof a
                    },
                    isElement: function(a) {
                        return !(!a || 1 !== a.nodeType)
                    },
                    isJQuery: function(b) {
                        return b instanceof a
                    },
                    toStr: function(a) {
                        return b.isUndefined(a) || null === a ? "" : a + ""
                    },
                    bind: a.proxy,
                    each: function(b, c) {
                        function d(a, b) {
                            return c(b, a)
                        }
                        a.each(b, d)
                    },
                    map: a.map,
                    filter: a.grep,
                    every: function(b, c) {
                        var d = !0;
                        return b ? (a.each(b, function(a, e) {
                            return (d = c.call(null, e, a, b)) ? void 0 : !1
                        }), !!d) : d
                    },
                    some: function(b, c) {
                        var d = !1;
                        return b ? (a.each(b, function(a, e) {
                            return (d = c.call(null, e, a, b)) ? !1 : void 0
                        }), !!d) : d
                    },
                    mixin: a.extend,
                    identity: function(a) {
                        return a
                    },
                    clone: function(b) {
                        return a.extend(!0, {}, b)
                    },
                    getIdGenerator: function() {
                        var a = 0;
                        return function() {
                            return a++
                        }
                    },
                    templatify: function(b) {
                        function c() {
                            return String(b)
                        }
                        return a.isFunction(b) ? b : c
                    },
                    defer: function(a) {
                        setTimeout(a, 0)
                    },
                    debounce: function(a, b, c) {
                        var d, e;
                        return function() {
                            var f, g, h = this,
                                i = arguments;
                            return f = function() {
                                d = null, c || (e = a.apply(h, i))
                            }, g = c && !d, clearTimeout(d), d = setTimeout(f, b), g && (e = a.apply(h, i)), e
                        }
                    },
                    throttle: function(a, b) {
                        var c, d, e, f, g, h;
                        return g = 0, h = function() {
                                g = new Date, e = null, f = a.apply(c, d)
                            },
                            function() {
                                var i = new Date,
                                    j = b - (i - g);
                                return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
                            }
                    },
                    stringify: function(a) {
                        return b.isString(a) ? a : JSON.stringify(a)
                    },
                    noop: function() {}
                }
            }(),
            c = "0.11.1",
            d = function() {
                "use strict";

                function a(a) {
                    return a = b.toStr(a), a ? a.split(/\s+/) : []
                }

                function c(a) {
                    return a = b.toStr(a), a ? a.split(/\W+/) : []
                }

                function d(a) {
                    return function(c) {
                        return c = b.isArray(c) ? c : [].slice.call(arguments, 0),
                            function(d) {
                                var e = [];
                                return b.each(c, function(c) {
                                    e = e.concat(a(b.toStr(d[c])))
                                }), e
                            }
                    }
                }
                return {
                    nonword: c,
                    whitespace: a,
                    obj: {
                        nonword: d(c),
                        whitespace: d(a)
                    }
                }
            }(),
            e = function() {
                "use strict";

                function c(c) {
                    this.maxSize = b.isNumber(c) ? c : 100, this.reset(), this.maxSize <= 0 && (this.set = this.get = a.noop)
                }

                function d() {
                    this.head = this.tail = null
                }

                function e(a, b) {
                    this.key = a, this.val = b, this.prev = this.next = null
                }
                return b.mixin(c.prototype, {
                    set: function(a, b) {
                        var c, d = this.list.tail;
                        this.size >= this.maxSize && (this.list.remove(d), delete this.hash[d.key], this.size--), (c = this.hash[a]) ? (c.val = b, this.list.moveToFront(c)) : (c = new e(a, b), this.list.add(c), this.hash[a] = c, this.size++)
                    },
                    get: function(a) {
                        var b = this.hash[a];
                        return b ? (this.list.moveToFront(b), b.val) : void 0
                    },
                    reset: function() {
                        this.size = 0, this.hash = {}, this.list = new d
                    }
                }), b.mixin(d.prototype, {
                    add: function(a) {
                        this.head && (a.next = this.head, this.head.prev = a), this.head = a, this.tail = this.tail || a
                    },
                    remove: function(a) {
                        a.prev ? a.prev.next = a.next : this.head = a.next, a.next ? a.next.prev = a.prev : this.tail = a.prev
                    },
                    moveToFront: function(a) {
                        this.remove(a), this.add(a)
                    }
                }), c
            }(),
            f = function() {
                "use strict";

                function c(a, c) {
                    this.prefix = ["__", a, "__"].join(""), this.ttlKey = "__ttl__", this.keyMatcher = new RegExp("^" + b.escapeRegExChars(this.prefix)), this.ls = c || h, !this.ls && this._noop()
                }

                function d() {
                    return (new Date).getTime()
                }

                function e(a) {
                    return JSON.stringify(b.isUndefined(a) ? null : a)
                }

                function f(b) {
                    return a.parseJSON(b)
                }

                function g(a) {
                    var b, c, d = [],
                        e = h.length;
                    for (b = 0; e > b; b++)(c = h.key(b)).match(a) && d.push(c.replace(a, ""));
                    return d
                }
                var h;
                try {
                    h = window.localStorage, h.setItem("~~~", "!"), h.removeItem("~~~")
                } catch (i) {
                    h = null
                }
                return b.mixin(c.prototype, {
                    _prefix: function(a) {
                        return this.prefix + a
                    },
                    _ttlKey: function(a) {
                        return this._prefix(a) + this.ttlKey
                    },
                    _noop: function() {
                        this.get = this.set = this.remove = this.clear = this.isExpired = b.noop
                    },
                    _safeSet: function(a, b) {
                        try {
                            this.ls.setItem(a, b)
                        } catch (c) {
                            "QuotaExceededError" === c.name && (this.clear(), this._noop())
                        }
                    },
                    get: function(a) {
                        return this.isExpired(a) && this.remove(a), f(this.ls.getItem(this._prefix(a)))
                    },
                    set: function(a, c, f) {
                        return b.isNumber(f) ? this._safeSet(this._ttlKey(a), e(d() + f)) : this.ls.removeItem(this._ttlKey(a)), this._safeSet(this._prefix(a), e(c))
                    },
                    remove: function(a) {
                        return this.ls.removeItem(this._ttlKey(a)), this.ls.removeItem(this._prefix(a)), this
                    },
                    clear: function() {
                        var a, b = g(this.keyMatcher);
                        for (a = b.length; a--;) this.remove(b[a]);
                        return this
                    },
                    isExpired: function(a) {
                        var c = f(this.ls.getItem(this._ttlKey(a)));
                        return b.isNumber(c) && d() > c ? !0 : !1
                    }
                }), c
            }(),
            g = function() {
                "use strict";

                function c(a) {
                    a = a || {}, this.cancelled = !1, this.lastReq = null, this._send = a.transport, this._get = a.limiter ? a.limiter(this._get) : this._get, this._cache = a.cache === !1 ? new e(0) : h
                }
                var d = 0,
                    f = {},
                    g = 6,
                    h = new e(10);
                return c.setMaxPendingRequests = function(a) {
                    g = a
                }, c.resetCache = function() {
                    h.reset()
                }, b.mixin(c.prototype, {
                    _fingerprint: function(b) {
                        return b = b || {}, b.url + b.type + a.param(b.data || {})
                    },
                    _get: function(a, b) {
                        function c(a) {
                            b(null, a), k._cache.set(i, a)
                        }

                        function e() {
                            b(!0)
                        }

                        function h() {
                            d--, delete f[i], k.onDeckRequestArgs && (k._get.apply(k, k.onDeckRequestArgs), k.onDeckRequestArgs = null)
                        }
                        var i, j, k = this;
                        i = this._fingerprint(a), this.cancelled || i !== this.lastReq || ((j = f[i]) ? j.done(c).fail(e) : g > d ? (d++, f[i] = this._send(a).done(c).fail(e).always(h)) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
                    },
                    get: function(c, d) {
                        var e, f;
                        d = d || a.noop, c = b.isString(c) ? {
                            url: c
                        } : c || {}, f = this._fingerprint(c), this.cancelled = !1, this.lastReq = f, (e = this._cache.get(f)) ? d(null, e) : this._get(c, d)
                    },
                    cancel: function() {
                        this.cancelled = !0
                    }
                }), c
            }(),
            h = window.SearchIndex = function() {
                "use strict";

                function c(c) {
                    c = c || {}, c.datumTokenizer && c.queryTokenizer || a.error("datumTokenizer and queryTokenizer are both required"), this.identify = c.identify || b.stringify, this.datumTokenizer = c.datumTokenizer, this.queryTokenizer = c.queryTokenizer, this.reset()
                }

                function d(a) {
                    return a = b.filter(a, function(a) {
                        return !!a
                    }), a = b.map(a, function(a) {
                        return a.toLowerCase()
                    })
                }

                function e() {
                    var a = {};
                    return a[i] = [], a[h] = {}, a
                }

                function f(a) {
                    for (var b = {}, c = [], d = 0, e = a.length; e > d; d++) b[a[d]] || (b[a[d]] = !0, c.push(a[d]));
                    return c
                }

                function g(a, b) {
                    var c = 0,
                        d = 0,
                        e = [];
                    a = a.sort(), b = b.sort();
                    for (var f = a.length, g = b.length; f > c && g > d;) a[c] < b[d] ? c++ : a[c] > b[d] ? d++ : (e.push(a[c]), c++, d++);
                    return e
                }
                var h = "c",
                    i = "i";
                return b.mixin(c.prototype, {
                    bootstrap: function(a) {
                        this.datums = a.datums, this.trie = a.trie
                    },
                    add: function(a) {
                        var c = this;
                        a = b.isArray(a) ? a : [a], b.each(a, function(a) {
                            var f, g;
                            c.datums[f = c.identify(a)] = a, g = d(c.datumTokenizer(a)), b.each(g, function(a) {
                                var b, d, g;
                                for (b = c.trie, d = a.split(""); g = d.shift();) b = b[h][g] || (b[h][g] = e()), b[i].push(f)
                            })
                        })
                    },
                    get: function(a) {
                        var c = this;
                        return b.map(a, function(a) {
                            return c.datums[a]
                        })
                    },
                    search: function(a) {
                        var c, e, j = this;
                        return c = d(this.queryTokenizer(a)), b.each(c, function(a) {
                            var b, c, d, f;
                            if (e && 0 === e.length) return !1;
                            for (b = j.trie, c = a.split(""); b && (d = c.shift());) b = b[h][d];
                            return b && 0 === c.length ? (f = b[i].slice(0), void(e = e ? g(e, f) : f)) : (e = [], !1)
                        }), e ? b.map(f(e), function(a) {
                            return j.datums[a]
                        }) : []
                    },
                    all: function() {
                        var a = [];
                        for (var b in this.datums) a.push(this.datums[b]);
                        return a
                    },
                    reset: function() {
                        this.datums = {}, this.trie = e()
                    },
                    serialize: function() {
                        return {
                            datums: this.datums,
                            trie: this.trie
                        }
                    }
                }), c
            }(),
            i = function() {
                "use strict";

                function a(a) {
                    this.url = a.url, this.ttl = a.ttl, this.cache = a.cache, this.prepare = a.prepare, this.transform = a.transform, this.transport = a.transport, this.thumbprint = a.thumbprint, this.storage = new f(a.cacheKey)
                }
                var c;
                return c = {
                    data: "data",
                    protocol: "protocol",
                    thumbprint: "thumbprint"
                }, b.mixin(a.prototype, {
                    _settings: function() {
                        return {
                            url: this.url,
                            type: "GET",
                            dataType: "json"
                        }
                    },
                    store: function(a) {
                        this.cache && (this.storage.set(c.data, a, this.ttl), this.storage.set(c.protocol, location.protocol, this.ttl), this.storage.set(c.thumbprint, this.thumbprint, this.ttl))
                    },
                    fromCache: function() {
                        var a, b = {};
                        return this.cache ? (b.data = this.storage.get(c.data), b.protocol = this.storage.get(c.protocol), b.thumbprint = this.storage.get(c.thumbprint), a = b.thumbprint !== this.thumbprint || b.protocol !== location.protocol, b.data && !a ? b.data : null) : null
                    },
                    fromNetwork: function(a) {
                        function b() {
                            a(!0)
                        }

                        function c(b) {
                            a(null, e.transform(b))
                        }
                        var d, e = this;
                        a && (d = this.prepare(this._settings()), this.transport(d).fail(b).done(c))
                    },
                    clear: function() {
                        return this.storage.clear(), this
                    }
                }), a
            }(),
            j = function() {
                "use strict";

                function a(a) {
                    this.url = a.url, this.prepare = a.prepare, this.transform = a.transform, this.transport = new g({
                        cache: a.cache,
                        limiter: a.limiter,
                        transport: a.transport
                    })
                }
                return b.mixin(a.prototype, {
                    _settings: function() {
                        return {
                            url: this.url,
                            type: "GET",
                            dataType: "json"
                        }
                    },
                    get: function(a, b) {
                        function c(a, c) {
                            b(a ? [] : e.transform(c))
                        }
                        var d, e = this;
                        return b ? (a = a || "", d = this.prepare(a, this._settings()), this.transport.get(d, c)) : void 0
                    },
                    cancelLastRequest: function() {
                        this.transport.cancel()
                    }
                }), a
            }(),
            k = function() {
                "use strict";

                function d(d) {
                    var e;
                    return d ? (e = {
                        url: null,
                        ttl: 864e5,
                        cache: !0,
                        cacheKey: null,
                        thumbprint: "",
                        prepare: b.identity,
                        transform: b.identity,
                        transport: null
                    }, d = b.isString(d) ? {
                        url: d
                    } : d, d = b.mixin(e, d), !d.url && a.error("prefetch requires url to be set"), d.transform = d.filter || d.transform, d.cacheKey = d.cacheKey || d.url, d.thumbprint = c + d.thumbprint, d.transport = d.transport ? h(d.transport) : a.ajax, d) : null
                }

                function e(c) {
                    var d;
                    return c ? (d = {
                        url: null,
                        cache: !0,
                        prepare: null,
                        replace: null,
                        wildcard: null,
                        limiter: null,
                        rateLimitBy: "debounce",
                        rateLimitWait: 300,
                        transform: b.identity,
                        transport: null
                    }, c = b.isString(c) ? {
                        url: c
                    } : c, c = b.mixin(d, c), !c.url && a.error("remote requires url to be set"), c.transform = c.filter || c.transform, c.prepare = f(c), c.limiter = g(c), c.transport = c.transport ? h(c.transport) : a.ajax, delete c.replace, delete c.wildcard, delete c.rateLimitBy, delete c.rateLimitWait, c) : void 0
                }

                function f(a) {
                    function b(a, b) {
                        return b.url = f(b.url, a), b
                    }

                    function c(a, b) {
                        return b.url = b.url.replace(g, encodeURIComponent(a)), b
                    }

                    function d(a, b) {
                        return b
                    }
                    var e, f, g;
                    return e = a.prepare, f = a.replace, g = a.wildcard, e ? e : e = f ? b : a.wildcard ? c : d
                }

                function g(a) {
                    function c(a) {
                        return function(c) {
                            return b.debounce(c, a)
                        }
                    }

                    function d(a) {
                        return function(c) {
                            return b.throttle(c, a)
                        }
                    }
                    var e, f, g;
                    return e = a.limiter, f = a.rateLimitBy, g = a.rateLimitWait, e || (e = /^throttle$/i.test(f) ? d(g) : c(g)), e
                }

                function h(c) {
                    return function(d) {
                        function e(a) {
                            b.defer(function() {
                                g.resolve(a)
                            })
                        }

                        function f(a) {
                            b.defer(function() {
                                g.reject(a)
                            })
                        }
                        var g = a.Deferred();
                        return c(d, e, f), g
                    }
                }
                return function(c) {
                    var f, g;
                    return f = {
                        initialize: !0,
                        identify: b.stringify,
                        datumTokenizer: null,
                        queryTokenizer: null,
                        sufficient: 5,
                        sorter: null,
                        local: [],
                        prefetch: null,
                        remote: null
                    }, c = b.mixin(f, c || {}), !c.datumTokenizer && a.error("datumTokenizer is required"), !c.queryTokenizer && a.error("queryTokenizer is required"), g = c.sorter, c.sorter = g ? function(a) {
                        return a.sort(g)
                    } : b.identity, c.local = b.isFunction(c.local) ? c.local() : c.local, c.prefetch = d(c.prefetch), c.remote = e(c.remote), c
                }
            }(),
            l = function() {
                "use strict";

                function c(a) {
                    a = k(a), this.sorter = a.sorter, this.identify = a.identify, this.sufficient = a.sufficient, this.local = a.local, this.remote = a.remote ? new j(a.remote) : null, this.prefetch = a.prefetch ? new i(a.prefetch) : null, this.index = new h({
                        identify: this.identify,
                        datumTokenizer: a.datumTokenizer,
                        queryTokenizer: a.queryTokenizer
                    }), a.initialize !== !1 && this.initialize()
                }
                var e;
                return e = window && window.Bloodhound, c.noConflict = function() {
                    return window && (window.Bloodhound = e), c
                }, c.tokenizers = d, b.mixin(c.prototype, {
                    __ttAdapter: function() {
                        function a(a, b, d) {
                            return c.search(a, b, d)
                        }

                        function b(a, b) {
                            return c.search(a, b)
                        }
                        var c = this;
                        return this.remote ? a : b
                    },
                    _loadPrefetch: function() {
                        function b(a, b) {
                            return a ? c.reject() : (e.add(b), e.prefetch.store(e.index.serialize()), void c.resolve())
                        }
                        var c, d, e = this;
                        return c = a.Deferred(), this.prefetch ? (d = this.prefetch.fromCache()) ? (this.index.bootstrap(d), c.resolve()) : this.prefetch.fromNetwork(b) : c.resolve(), c.promise()
                    },
                    _initialize: function() {
                        function a() {
                            b.add(b.local)
                        }
                        var b = this;
                        return this.clear(), (this.initPromise = this._loadPrefetch()).done(a), this.initPromise
                    },
                    initialize: function(a) {
                        return !this.initPromise || a ? this._initialize() : this.initPromise
                    },
                    add: function(a) {
                        return this.index.add(a), this
                    },
                    get: function(a) {
                        return a = b.isArray(a) ? a : [].slice.call(arguments), this.index.get(a)
                    },
                    search: function(a, c, d) {
                        function e(a) {
                            var c = [];
                            b.each(a, function(a) {
                                !b.some(f, function(b) {
                                    return g.identify(a) === g.identify(b)
                                }) && c.push(a)
                            }), d && d(c)
                        }
                        var f, g = this;
                        return f = this.sorter(this.index.search(a)), c(this.remote ? f.slice() : f), this.remote && f.length < this.sufficient ? this.remote.get(a, e) : this.remote && this.remote.cancelLastRequest(), this
                    },
                    all: function() {
                        return this.index.all()
                    },
                    clear: function() {
                        return this.index.reset(), this
                    },
                    clearPrefetchCache: function() {
                        return this.prefetch && this.prefetch.clear(), this
                    },
                    clearRemoteCache: function() {
                        return g.resetCache(), this
                    },
                    ttAdapter: function() {
                        return this.__ttAdapter()
                    }
                }), c
            }();
        return l
    }),
    function(a, b) {
        "function" == typeof define && define.amd ? define("typeahead.js", ["jquery"], function(a) {
            return b(a)
        }) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(jQuery)
    }(this, function(a) {
        var b = function() {
                "use strict";
                return {
                    isMsie: function() {
                        return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1
                    },
                    isBlankString: function(a) {
                        return !a || /^\s*$/.test(a)
                    },
                    escapeRegExChars: function(a) {
                        return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                    },
                    isString: function(a) {
                        return "string" == typeof a
                    },
                    isNumber: function(a) {
                        return "number" == typeof a
                    },
                    isArray: a.isArray,
                    isFunction: a.isFunction,
                    isObject: a.isPlainObject,
                    isUndefined: function(a) {
                        return "undefined" == typeof a
                    },
                    isElement: function(a) {
                        return !(!a || 1 !== a.nodeType)
                    },
                    isJQuery: function(b) {
                        return b instanceof a
                    },
                    toStr: function(a) {
                        return b.isUndefined(a) || null === a ? "" : a + ""
                    },
                    bind: a.proxy,
                    each: function(b, c) {
                        function d(a, b) {
                            return c(b, a)
                        }
                        a.each(b, d)
                    },
                    map: a.map,
                    filter: a.grep,
                    every: function(b, c) {
                        var d = !0;
                        return b ? (a.each(b, function(a, e) {
                            return (d = c.call(null, e, a, b)) ? void 0 : !1
                        }), !!d) : d
                    },
                    some: function(b, c) {
                        var d = !1;
                        return b ? (a.each(b, function(a, e) {
                            return (d = c.call(null, e, a, b)) ? !1 : void 0
                        }), !!d) : d
                    },
                    mixin: a.extend,
                    identity: function(a) {
                        return a
                    },
                    clone: function(b) {
                        return a.extend(!0, {}, b)
                    },
                    getIdGenerator: function() {
                        var a = 0;
                        return function() {
                            return a++
                        }
                    },
                    templatify: function(b) {
                        function c() {
                            return String(b)
                        }
                        return a.isFunction(b) ? b : c
                    },
                    defer: function(a) {
                        setTimeout(a, 0)
                    },
                    debounce: function(a, b, c) {
                        var d, e;
                        return function() {
                            var f, g, h = this,
                                i = arguments;
                            return f = function() {
                                d = null, c || (e = a.apply(h, i))
                            }, g = c && !d, clearTimeout(d), d = setTimeout(f, b), g && (e = a.apply(h, i)), e
                        }
                    },
                    throttle: function(a, b) {
                        var c, d, e, f, g, h;
                        return g = 0, h = function() {
                                g = new Date, e = null, f = a.apply(c, d)
                            },
                            function() {
                                var i = new Date,
                                    j = b - (i - g);
                                return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
                            }
                    },
                    stringify: function(a) {
                        return b.isString(a) ? a : JSON.stringify(a)
                    },
                    noop: function() {}
                }
            }(),
            c = function() {
                "use strict";

                function a(a) {
                    var g, h;
                    return h = b.mixin({}, f, a), g = {
                        css: e(),
                        classes: h,
                        html: c(h),
                        selectors: d(h)
                    }, {
                        css: g.css,
                        html: g.html,
                        classes: g.classes,
                        selectors: g.selectors,
                        mixin: function(a) {
                            b.mixin(a, g)
                        }
                    }
                }

                function c(a) {
                    return {
                        wrapper: '<span class="' + a.wrapper + '"></span>',
                        menu: '<div class="' + a.menu + '"></div>'
                    }
                }

                function d(a) {
                    var c = {};
                    return b.each(a, function(a, b) {
                        c[b] = "." + a
                    }), c
                }

                function e() {
                    var a = {
                        wrapper: {
                            position: "relative",
                            display: "inline-block"
                        },
                        hint: {
                            position: "absolute",
                            top: "0",
                            left: "0",
                            borderColor: "transparent",
                            boxShadow: "none",
                            opacity: "1"
                        },
                        input: {
                            position: "relative",
                            verticalAlign: "top",
                            backgroundColor: "transparent"
                        },
                        inputWithNoHint: {
                            position: "relative",
                            verticalAlign: "top"
                        },
                        menu: {
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: "100",
                            display: "none"
                        },
                        ltr: {
                            left: "0",
                            right: "auto"
                        },
                        rtl: {
                            left: "auto",
                            right: " 0"
                        }
                    };
                    return b.isMsie() && b.mixin(a.input, {
                        backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                    }), a
                }
                var f = {
                    wrapper: "twitter-typeahead",
                    input: "tt-input",
                    hint: "tt-hint",
                    menu: "tt-menu",
                    dataset: "tt-dataset",
                    suggestion: "tt-suggestion",
                    selectable: "tt-selectable",
                    empty: "tt-empty",
                    open: "tt-open",
                    cursor: "tt-cursor",
                    highlight: "tt-highlight"
                };
                return a
            }(),
            d = function() {
                "use strict";

                function c(b) {
                    b && b.el || a.error("EventBus initialized without el"), this.$el = a(b.el)
                }
                var d, e;
                return d = "typeahead:", e = {
                    render: "rendered",
                    cursorchange: "cursorchanged",
                    select: "selected",
                    autocomplete: "autocompleted"
                }, b.mixin(c.prototype, {
                    _trigger: function(b, c) {
                        var e;
                        return e = a.Event(d + b), (c = c || []).unshift(e), this.$el.trigger.apply(this.$el, c), e
                    },
                    before: function(a) {
                        var b, c;
                        return b = [].slice.call(arguments, 1), c = this._trigger("before" + a, b), c.isDefaultPrevented()
                    },
                    trigger: function(a) {
                        var b;
                        this._trigger(a, [].slice.call(arguments, 1)), (b = e[a]) && this._trigger(b, [].slice.call(arguments, 1))
                    }
                }), c
            }(),
            e = function() {
                "use strict";

                function a(a, b, c, d) {
                    var e;
                    if (!c) return this;
                    for (b = b.split(i), c = d ? h(c, d) : c, this._callbacks = this._callbacks || {}; e = b.shift();) this._callbacks[e] = this._callbacks[e] || {
                        sync: [],
                        async: []
                    }, this._callbacks[e][a].push(c);
                    return this
                }

                function b(b, c, d) {
                    return a.call(this, "async", b, c, d)
                }

                function c(b, c, d) {
                    return a.call(this, "sync", b, c, d)
                }

                function d(a) {
                    var b;
                    if (!this._callbacks) return this;
                    for (a = a.split(i); b = a.shift();) delete this._callbacks[b];
                    return this
                }

                function e(a) {
                    var b, c, d, e, g;
                    if (!this._callbacks) return this;
                    for (a = a.split(i), d = [].slice.call(arguments, 1);
                        (b = a.shift()) && (c = this._callbacks[b]);) e = f(c.sync, this, [b].concat(d)), g = f(c.async, this, [b].concat(d)), e() && j(g);
                    return this
                }

                function f(a, b, c) {
                    function d() {
                        for (var d, e = 0, f = a.length; !d && f > e; e += 1) d = a[e].apply(b, c) === !1;
                        return !d
                    }
                    return d
                }

                function g() {
                    var a;
                    return a = window.setImmediate ? function(a) {
                        setImmediate(function() {
                            a()
                        })
                    } : function(a) {
                        setTimeout(function() {
                            a()
                        }, 0)
                    }
                }

                function h(a, b) {
                    return a.bind ? a.bind(b) : function() {
                        a.apply(b, [].slice.call(arguments, 0))
                    }
                }
                var i = /\s+/,
                    j = g();
                return {
                    onSync: c,
                    onAsync: b,
                    off: d,
                    trigger: e
                }
            }(),
            f = function(a) {
                "use strict";

                function c(a, c, d) {
                    for (var e, f = [], g = 0, h = a.length; h > g; g++) f.push(b.escapeRegExChars(a[g]));
                    return e = d ? "\\b(" + f.join("|") + ")\\b" : "(" + f.join("|") + ")", c ? new RegExp(e) : new RegExp(e, "i")
                }
                var d = {
                    node: null,
                    pattern: null,
                    tagName: "strong",
                    className: null,
                    wordsOnly: !1,
                    caseSensitive: !1
                };
                return function(e) {
                    function f(b) {
                        var c, d, f;
                        return (c = h.exec(b.data)) && (f = a.createElement(e.tagName), e.className && (f.className = e.className), d = b.splitText(c.index), d.splitText(c[0].length), f.appendChild(d.cloneNode(!0)), b.parentNode.replaceChild(f, d)), !!c
                    }

                    function g(a, b) {
                        for (var c, d = 3, e = 0; e < a.childNodes.length; e++) c = a.childNodes[e], c.nodeType === d ? e += b(c) ? 1 : 0 : g(c, b)
                    }
                    var h;
                    e = b.mixin({}, d, e), e.node && e.pattern && (e.pattern = b.isArray(e.pattern) ? e.pattern : [e.pattern], h = c(e.pattern, e.caseSensitive, e.wordsOnly), g(e.node, f))
                }
            }(window.document),
            g = function() {
                "use strict";

                function c(c, e) {
                    c = c || {}, c.input || a.error("input is missing"), e.mixin(this), this.$hint = a(c.hint), this.$input = a(c.input), this.query = this.$input.val(), this.queryWhenFocused = this.hasFocus() ? this.query : null, this.$overflowHelper = d(this.$input), this._checkLanguageDirection(), 0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = b.noop)
                }

                function d(b) {
                    return a('<pre aria-hidden="true"></pre>').css({
                        position: "absolute",
                        visibility: "hidden",
                        whiteSpace: "pre",
                        fontFamily: b.css("font-family"),
                        fontSize: b.css("font-size"),
                        fontStyle: b.css("font-style"),
                        fontVariant: b.css("font-variant"),
                        fontWeight: b.css("font-weight"),
                        wordSpacing: b.css("word-spacing"),
                        letterSpacing: b.css("letter-spacing"),
                        textIndent: b.css("text-indent"),
                        textRendering: b.css("text-rendering"),
                        textTransform: b.css("text-transform")
                    }).insertAfter(b)
                }

                function f(a, b) {
                    return c.normalizeQuery(a) === c.normalizeQuery(b)
                }

                function g(a) {
                    return a.altKey || a.ctrlKey || a.metaKey || a.shiftKey
                }
                var h;
                return h = {
                    9: "tab",
                    27: "esc",
                    37: "left",
                    39: "right",
                    13: "enter",
                    38: "up",
                    40: "down"
                }, c.normalizeQuery = function(a) {
                    return b.toStr(a).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
                }, b.mixin(c.prototype, e, {
                    _onBlur: function() {
                        this.resetInputValue(), this.trigger("blurred")
                    },
                    _onFocus: function() {
                        this.queryWhenFocused = this.query, this.trigger("focused")
                    },
                    _onKeydown: function(a) {
                        var b = h[a.which || a.keyCode];
                        this._managePreventDefault(b, a), b && this._shouldTrigger(b, a) && this.trigger(b + "Keyed", a)
                    },
                    _onInput: function() {
                        this._setQuery(this.getInputValue()), this.clearHintIfInvalid(), this._checkLanguageDirection()
                    },
                    _managePreventDefault: function(a, b) {
                        var c;
                        switch (a) {
                            case "up":
                            case "down":
                                c = !g(b);
                                break;
                            default:
                                c = !1
                        }
                        c && b.preventDefault()
                    },
                    _shouldTrigger: function(a, b) {
                        var c;
                        switch (a) {
                            case "tab":
                                c = !g(b);
                                break;
                            default:
                                c = !0
                        }
                        return c
                    },
                    _checkLanguageDirection: function() {
                        var a = (this.$input.css("direction") || "ltr").toLowerCase();
                        this.dir !== a && (this.dir = a, this.$hint.attr("dir", a), this.trigger("langDirChanged", a))
                    },
                    _setQuery: function(a, b) {
                        var c, d;
                        c = f(a, this.query), d = c ? this.query.length !== a.length : !1, this.query = a, b || c ? !b && d && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
                    },
                    bind: function() {
                        var a, c, d, e, f = this;
                        return a = b.bind(this._onBlur, this), c = b.bind(this._onFocus, this), d = b.bind(this._onKeydown, this), e = b.bind(this._onInput, this), this.$input.on("blur.tt", a).on("focus.tt", c).on("keydown.tt", d), !b.isMsie() || b.isMsie() > 9 ? this.$input.on("input.tt", e) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function(a) {
                            h[a.which || a.keyCode] || b.defer(b.bind(f._onInput, f, a))
                        }), this
                    },
                    focus: function() {
                        this.$input.focus()
                    },
                    blur: function() {
                        this.$input.blur()
                    },
                    getLangDir: function() {
                        return this.dir
                    },
                    getQuery: function() {
                        return this.query || ""
                    },
                    setQuery: function(a, b) {
                        this.setInputValue(a), this._setQuery(a, b)
                    },
                    hasQueryChangedSinceLastFocus: function() {
                        return this.query !== this.queryWhenFocused
                    },
                    getInputValue: function() {
                        return this.$input.val()
                    },
                    setInputValue: function(a) {
                        this.$input.val(a), this.clearHintIfInvalid(), this._checkLanguageDirection()
                    },
                    resetInputValue: function() {
                        this.setInputValue(this.query)
                    },
                    getHint: function() {
                        return this.$hint.val()
                    },
                    setHint: function(a) {
                        this.$hint.val(a)
                    },
                    clearHint: function() {
                        this.setHint("")
                    },
                    clearHintIfInvalid: function() {
                        var a, b, c, d;
                        a = this.getInputValue(), b = this.getHint(), c = a !== b && 0 === b.indexOf(a), d = "" !== a && c && !this.hasOverflow(), !d && this.clearHint()
                    },
                    hasFocus: function() {
                        return this.$input.is(":focus")
                    },
                    hasOverflow: function() {
                        var a = this.$input.width() - 2;
                        return this.$overflowHelper.text(this.getInputValue()), this.$overflowHelper.width() >= a
                    },
                    isCursorAtEnd: function() {
                        var a, c, d;
                        return a = this.$input.val().length, c = this.$input[0].selectionStart, b.isNumber(c) ? c === a : document.selection ? (d = document.selection.createRange(), d.moveStart("character", -a), a === d.text.length) : !0
                    },
                    destroy: function() {
                        this.$hint.off(".tt"), this.$input.off(".tt"), this.$overflowHelper.remove(), this.$hint = this.$input = this.$overflowHelper = a("<div>")
                    }
                }), c
            }(),
            h = function() {
                "use strict";

                function c(c, e) {
                    c = c || {}, c.templates = c.templates || {}, c.templates.notFound = c.templates.notFound || c.templates.empty, c.source || a.error("missing source"), c.node || a.error("missing node"), c.name && !h(c.name) && a.error("invalid dataset name: " + c.name), e.mixin(this), this.highlight = !!c.highlight, this.name = c.name || j(), this.limit = c.limit || 5, this.displayFn = d(c.display || c.displayKey), this.templates = g(c.templates, this.displayFn), this.source = c.source.__ttAdapter ? c.source.__ttAdapter() : c.source, this.async = b.isUndefined(c.async) ? this.source.length > 2 : !!c.async, this._resetLastSuggestion(), this.$el = a(c.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
                }

                function d(a) {
                    function c(b) {
                        return b[a]
                    }
                    return a = a || b.stringify, b.isFunction(a) ? a : c
                }

                function g(c, d) {
                    function e(b) {
                        return a("<div>").text(d(b))
                    }
                    return {
                        notFound: c.notFound && b.templatify(c.notFound),
                        pending: c.pending && b.templatify(c.pending),
                        header: c.header && b.templatify(c.header),
                        footer: c.footer && b.templatify(c.footer),
                        suggestion: c.suggestion || e
                    }
                }

                function h(a) {
                    return /^[_a-zA-Z0-9-]+$/.test(a)
                }
                var i, j;
                return i = {
                    val: "tt-selectable-display",
                    obj: "tt-selectable-object"
                }, j = b.getIdGenerator(), c.extractData = function(b) {
                    var c = a(b);
                    return c.data(i.obj) ? {
                        val: c.data(i.val) || "",
                        obj: c.data(i.obj) || null
                    } : null
                }, b.mixin(c.prototype, e, {
                    _overwrite: function(a, b) {
                        b = b || [], b.length ? this._renderSuggestions(a, b) : this.async && this.templates.pending ? this._renderPending(a) : !this.async && this.templates.notFound ? this._renderNotFound(a) : this._empty(), this.trigger("rendered", this.name, b, !1)
                    },
                    _append: function(a, b) {
                        b = b || [], b.length && this.$lastSuggestion.length ? this._appendSuggestions(a, b) : b.length ? this._renderSuggestions(a, b) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(a), this.trigger("rendered", this.name, b, !0)
                    },
                    _renderSuggestions: function(a, b) {
                        var c;
                        c = this._getSuggestionsFragment(a, b), this.$lastSuggestion = c.children().last(), this.$el.html(c).prepend(this._getHeader(a, b)).append(this._getFooter(a, b))
                    },
                    _appendSuggestions: function(a, b) {
                        var c, d;
                        c = this._getSuggestionsFragment(a, b), d = c.children().last(), this.$lastSuggestion.after(c), this.$lastSuggestion = d
                    },
                    _renderPending: function(a) {
                        var b = this.templates.pending;
                        this._resetLastSuggestion(), b && this.$el.html(b({
                            query: a,
                            dataset: this.name
                        }))
                    },
                    _renderNotFound: function(a) {
                        var b = this.templates.notFound;
                        this._resetLastSuggestion(), b && this.$el.html(b({
                            query: a,
                            dataset: this.name
                        }))
                    },
                    _empty: function() {
                        this.$el.empty(), this._resetLastSuggestion()
                    },
                    _getSuggestionsFragment: function(c, d) {
                        var e, g = this;
                        return e = document.createDocumentFragment(), b.each(d, function(b) {
                            var d, f;
                            f = g._injectQuery(c, b), d = a(g.templates.suggestion(f)).data(i.obj, b).data(i.val, g.displayFn(b)).addClass(g.classes.suggestion + " " + g.classes.selectable), e.appendChild(d[0])
                        }), this.highlight && f({
                            className: this.classes.highlight,
                            node: e,
                            pattern: c
                        }), a(e)
                    },
                    _getFooter: function(a, b) {
                        return this.templates.footer ? this.templates.footer({
                            query: a,
                            suggestions: b,
                            dataset: this.name
                        }) : null
                    },
                    _getHeader: function(a, b) {
                        return this.templates.header ? this.templates.header({
                            query: a,
                            suggestions: b,
                            dataset: this.name
                        }) : null
                    },
                    _resetLastSuggestion: function() {
                        this.$lastSuggestion = a()
                    },
                    _injectQuery: function(a, c) {
                        return b.isObject(c) ? b.mixin({
                            _query: a
                        }, c) : c
                    },
                    update: function(b) {
                        function c(a) {
                            g || (g = !0, a = (a || []).slice(0, e.limit), h = a.length, e._overwrite(b, a), h < e.limit && e.async && e.trigger("asyncRequested", b))
                        }

                        function d(c) {
                            c = c || [], !f && h < e.limit && (e.cancel = a.noop, h += c.length, e._append(b, c.slice(0, e.limit - h)), e.async && e.trigger("asyncReceived", b))
                        }
                        var e = this,
                            f = !1,
                            g = !1,
                            h = 0;
                        this.cancel(), this.cancel = function() {
                            f = !0, e.cancel = a.noop, e.async && e.trigger("asyncCanceled", b)
                        }, this.source(b, c, d), !g && c([])
                    },
                    cancel: a.noop,
                    clear: function() {
                        this._empty(), this.cancel(), this.trigger("cleared")
                    },
                    isEmpty: function() {
                        return this.$el.is(":empty")
                    },
                    destroy: function() {
                        this.$el = a("<div>")
                    }
                }), c
            }(),
            i = function() {
                "use strict";

                function c(c, d) {
                    function e(b) {
                        var c = f.$node.find(b.node).first();
                        return b.node = c.length ? c : a("<div>").appendTo(f.$node), new h(b, d)
                    }
                    var f = this;
                    c = c || {}, c.node || a.error("node is required"), d.mixin(this), this.$node = a(c.node), this.query = null, this.datasets = b.map(c.datasets, e)
                }
                return b.mixin(c.prototype, e, {
                    _onSelectableClick: function(b) {
                        this.trigger("selectableClicked", a(b.currentTarget))
                    },
                    _onRendered: function(a, b, c, d) {
                        this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetRendered", b, c, d)
                    },
                    _onCleared: function() {
                        this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetCleared")
                    },
                    _propagate: function() {
                        this.trigger.apply(this, arguments)
                    },
                    _allDatasetsEmpty: function() {
                        function a(a) {
                            return a.isEmpty()
                        }
                        return b.every(this.datasets, a)
                    },
                    _getSelectables: function() {
                        return this.$node.find(this.selectors.selectable)
                    },
                    _removeCursor: function() {
                        var a = this.getActiveSelectable();
                        a && a.removeClass(this.classes.cursor)
                    },
                    _ensureVisible: function(a) {
                        var b, c, d, e;
                        b = a.position().top, c = b + a.outerHeight(!0), d = this.$node.scrollTop(), e = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10), 0 > b ? this.$node.scrollTop(d + b) : c > e && this.$node.scrollTop(d + (c - e))
                    },
                    bind: function() {
                        var a, c = this;
                        return a = b.bind(this._onSelectableClick, this), this.$node.on("click.tt", this.selectors.selectable, a), b.each(this.datasets, function(a) {
                            a.onSync("asyncRequested", c._propagate, c).onSync("asyncCanceled", c._propagate, c).onSync("asyncReceived", c._propagate, c).onSync("rendered", c._onRendered, c).onSync("cleared", c._onCleared, c)
                        }), this
                    },
                    isOpen: function() {
                        return this.$node.hasClass(this.classes.open)
                    },
                    open: function() {
                        this.$node.addClass(this.classes.open)
                    },
                    close: function() {
                        this.$node.removeClass(this.classes.open), this._removeCursor()
                    },
                    setLanguageDirection: function(a) {
                        this.$node.attr("dir", a)
                    },
                    selectableRelativeToCursor: function(a) {
                        var b, c, d, e;
                        return c = this.getActiveSelectable(), b = this._getSelectables(), d = c ? b.index(c) : -1, e = d + a, e = (e + 1) % (b.length + 1) - 1, e = -1 > e ? b.length - 1 : e, -1 === e ? null : b.eq(e)
                    },
                    setCursor: function(a) {
                        this._removeCursor(), (a = a && a.first()) && (a.addClass(this.classes.cursor), this._ensureVisible(a))
                    },
                    getSelectableData: function(a) {
                        return a && a.length ? h.extractData(a) : null
                    },
                    getActiveSelectable: function() {
                        var a = this._getSelectables().filter(this.selectors.cursor).first();
                        return a.length ? a : null
                    },
                    getTopSelectable: function() {
                        var a = this._getSelectables().first();
                        return a.length ? a : null
                    },
                    update: function(a) {
                        function c(b) {
                            b.update(a)
                        }
                        var d = a !== this.query;
                        return d && (this.query = a, b.each(this.datasets, c)), d
                    },
                    empty: function() {
                        function a(a) {
                            a.clear()
                        }
                        b.each(this.datasets, a), this.query = null, this.$node.addClass(this.classes.empty)
                    },
                    destroy: function() {
                        function c(a) {
                            a.destroy()
                        }
                        this.$node.off(".tt"), this.$node = a("<div>"), b.each(this.datasets, c)
                    }
                }), c
            }(),
            j = function() {
                "use strict";

                function a() {
                    i.apply(this, [].slice.call(arguments, 0))
                }
                var c = i.prototype;
                return b.mixin(a.prototype, i.prototype, {
                    open: function() {
                        return !this._allDatasetsEmpty() && this._show(), c.open.apply(this, [].slice.call(arguments, 0))
                    },
                    close: function() {
                        return this._hide(), c.close.apply(this, [].slice.call(arguments, 0))
                    },
                    _onRendered: function() {
                        return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), c._onRendered.apply(this, [].slice.call(arguments, 0))
                    },
                    _onCleared: function() {
                        return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), c._onCleared.apply(this, [].slice.call(arguments, 0))
                    },
                    setLanguageDirection: function(a) {
                        return this.$node.css("ltr" === a ? this.css.ltr : this.css.rtl), c.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
                    },
                    _hide: function() {
                        this.$node.hide()
                    },
                    _show: function() {
                        this.$node.css("display", "block")
                    }
                }), a
            }(),
            k = function() {
                "use strict";

                function c(c, e) {
                    var f, g, h, i, j, k, l, m, n, o, p;
                    c = c || {}, c.input || a.error("missing input"), c.menu || a.error("missing menu"), c.eventBus || a.error("missing event bus"), e.mixin(this), this.eventBus = c.eventBus, this.minLength = b.isNumber(c.minLength) ? c.minLength : 1, this.input = c.input, this.menu = c.menu, this.enabled = !0, this.active = !1, this.input.hasFocus() && this.activate(), this.dir = this.input.getLangDir(), this._hacks(), this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this), f = d(this, "activate", "open", "_onFocused"), g = d(this, "deactivate", "_onBlurred"), h = d(this, "isActive", "isOpen", "_onEnterKeyed"), i = d(this, "isActive", "isOpen", "_onTabKeyed"), j = d(this, "isActive", "_onEscKeyed"), k = d(this, "isActive", "open", "_onUpKeyed"), l = d(this, "isActive", "open", "_onDownKeyed"), m = d(this, "isActive", "isOpen", "_onLeftKeyed"), n = d(this, "isActive", "isOpen", "_onRightKeyed"), o = d(this, "_openIfActive", "_onQueryChanged"), p = d(this, "_openIfActive", "_onWhitespaceChanged"), this.input.bind().onSync("focused", f, this).onSync("blurred", g, this).onSync("enterKeyed", h, this).onSync("tabKeyed", i, this).onSync("escKeyed", j, this).onSync("upKeyed", k, this).onSync("downKeyed", l, this).onSync("leftKeyed", m, this).onSync("rightKeyed", n, this).onSync("queryChanged", o, this).onSync("whitespaceChanged", p, this).onSync("langDirChanged", this._onLangDirChanged, this)
                }

                function d(a) {
                    var c = [].slice.call(arguments, 1);
                    return function() {
                        var d = [].slice.call(arguments);
                        b.each(c, function(b) {
                            return a[b].apply(a, d)
                        })
                    }
                }
                return b.mixin(c.prototype, {
                    _hacks: function() {
                        var c, d;
                        c = this.input.$input || a("<div>"), d = this.menu.$node || a("<div>"), c.on("blur.tt", function(a) {
                            var e, f, g;
                            e = document.activeElement, f = d.is(e), g = d.has(e).length > 0, b.isMsie() && (f || g) && (a.preventDefault(), a.stopImmediatePropagation(), b.defer(function() {
                                c.focus()
                            }))
                        }), d.on("mousedown.tt", function(a) {
                            a.preventDefault()
                        })
                    },
                    _onSelectableClicked: function(a, b) {
                        this.select(b)
                    },
                    _onDatasetCleared: function() {
                        this._updateHint()
                    },
                    _onDatasetRendered: function(a, b, c, d) {
                        this._updateHint(), this.eventBus.trigger("render", c, d, b)
                    },
                    _onAsyncRequested: function(a, b, c) {
                        this.eventBus.trigger("asyncrequest", c, b)
                    },
                    _onAsyncCanceled: function(a, b, c) {
                        this.eventBus.trigger("asynccancel", c, b)
                    },
                    _onAsyncReceived: function(a, b, c) {
                        this.eventBus.trigger("asyncreceive", c, b)
                    },
                    _onFocused: function() {
                        this._minLengthMet() && this.menu.update(this.input.getQuery())
                    },
                    _onBlurred: function() {
                        this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
                    },
                    _onEnterKeyed: function(a, b) {
                        var c;
                        (c = this.menu.getActiveSelectable()) && this.select(c) && b.preventDefault()
                    },
                    _onTabKeyed: function(a, b) {
                        var c;
                        (c = this.menu.getActiveSelectable()) ? this.select(c) && b.preventDefault(): (c = this.menu.getTopSelectable()) && this.autocomplete(c) && b.preventDefault()
                    },
                    _onEscKeyed: function() {
                        this.close()
                    },
                    _onUpKeyed: function() {
                        this.moveCursor(-1)
                    },
                    _onDownKeyed: function() {
                        this.moveCursor(1)
                    },
                    _onLeftKeyed: function() {
                        "rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
                    },
                    _onRightKeyed: function() {
                        "ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
                    },
                    _onQueryChanged: function(a, b) {
                        this._minLengthMet(b) ? this.menu.update(b) : this.menu.empty()
                    },
                    _onWhitespaceChanged: function() {
                        this._updateHint()
                    },
                    _onLangDirChanged: function(a, b) {
                        this.dir !== b && (this.dir = b, this.menu.setLanguageDirection(b))
                    },
                    _openIfActive: function() {
                        this.isActive() && this.open()
                    },
                    _minLengthMet: function(a) {
                        return a = b.isString(a) ? a : this.input.getQuery() || "", a.length >= this.minLength
                    },
                    _updateHint: function() {
                        var a, c, d, e, f, h, i;
                        a = this.menu.getTopSelectable(), c = this.menu.getSelectableData(a), d = this.input.getInputValue(), !c || b.isBlankString(d) || this.input.hasOverflow() ? this.input.clearHint() : (e = g.normalizeQuery(d), f = b.escapeRegExChars(e), h = new RegExp("^(?:" + f + ")(.+$)", "i"), i = h.exec(c.val), i && this.input.setHint(d + i[1]))
                    },
                    isEnabled: function() {
                        return this.enabled
                    },
                    enable: function() {
                        this.enabled = !0
                    },
                    disable: function() {
                        this.enabled = !1
                    },
                    isActive: function() {
                        return this.active
                    },
                    activate: function() {
                        return this.isActive() ? !0 : !this.isEnabled() || this.eventBus.before("active") ? !1 : (this.active = !0, this.eventBus.trigger("active"), !0)
                    },
                    deactivate: function() {
                        return this.isActive() ? this.eventBus.before("idle") ? !1 : (this.active = !1, this.close(), this.eventBus.trigger("idle"), !0) : !0
                    },
                    isOpen: function() {
                        return this.menu.isOpen()
                    },
                    open: function() {
                        return this.isOpen() || this.eventBus.before("open") || (this.menu.open(), this._updateHint(), this.eventBus.trigger("open")), this.isOpen()
                    },
                    close: function() {
                        return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(), this.input.clearHint(), this.input.resetInputValue(), this.eventBus.trigger("close")), !this.isOpen()
                    },
                    setVal: function(a) {
                        this.input.setQuery(b.toStr(a))
                    },
                    getVal: function() {
                        return this.input.getQuery()
                    },
                    select: function(a) {
                        var b = this.menu.getSelectableData(a);
                        return b && !this.eventBus.before("select", b.obj) ? (this.input.setQuery(b.val, !0), this.eventBus.trigger("select", b.obj), this.close(), !0) : !1
                    },
                    autocomplete: function(a) {
                        var b, c, d;
                        return b = this.input.getQuery(), c = this.menu.getSelectableData(a), d = c && b !== c.val, d && !this.eventBus.before("autocomplete", c.obj) ? (this.input.setQuery(c.val), this.eventBus.trigger("autocomplete", c.obj), !0) : !1
                    },
                    moveCursor: function(a) {
                        var b, c, d, e, f;
                        return b = this.input.getQuery(), c = this.menu.selectableRelativeToCursor(a), d = this.menu.getSelectableData(c), e = d ? d.obj : null, f = this._minLengthMet() && this.menu.update(b), f || this.eventBus.before("cursorchange", e) ? !1 : (this.menu.setCursor(c), d ? this.input.setInputValue(d.val) : (this.input.resetInputValue(), this._updateHint()), this.eventBus.trigger("cursorchange", e), !0)
                    },
                    destroy: function() {
                        this.input.destroy(), this.menu.destroy()
                    }
                }), c
            }();
        ! function() {
            "use strict";

            function e(b, c) {
                b.each(function() {
                    var b, d = a(this);
                    (b = d.data(p.typeahead)) && c(b, d)
                })
            }

            function f(a, b) {
                return a.clone().addClass(b.classes.hint).removeData().css(b.css.hint).css(l(a)).prop("readonly", !0).removeAttr("id name placeholder required").attr({
                    autocomplete: "off",
                    spellcheck: "false",
                    tabindex: -1
                })
            }

            function h(a, b) {
                a.data(p.attrs, {
                    dir: a.attr("dir"),
                    autocomplete: a.attr("autocomplete"),
                    spellcheck: a.attr("spellcheck"),
                    style: a.attr("style")
                }), a.addClass(b.classes.input).attr({
                    autocomplete: "off",
                    spellcheck: !1
                });
                try {
                    !a.attr("dir") && a.attr("dir", "auto")
                } catch (c) {}
                return a
            }

            function l(a) {
                return {
                    backgroundAttachment: a.css("background-attachment"),
                    backgroundClip: a.css("background-clip"),
                    backgroundColor: a.css("background-color"),
                    backgroundImage: a.css("background-image"),
                    backgroundOrigin: a.css("background-origin"),
                    backgroundPosition: a.css("background-position"),
                    backgroundRepeat: a.css("background-repeat"),
                    backgroundSize: a.css("background-size")
                }
            }

            function m(a) {
                var c, d;
                c = a.data(p.www), d = a.parent().filter(c.selectors.wrapper), b.each(a.data(p.attrs), function(c, d) {
                    b.isUndefined(c) ? a.removeAttr(d) : a.attr(d, c)
                }), a.removeData(p.typeahead).removeData(p.www).removeData(p.attr).removeClass(c.classes.input), d.length && (a.detach().insertAfter(d), d.remove())
            }

            function n(c) {
                var d, e;
                return d = b.isJQuery(c) || b.isElement(c), e = d ? a(c).first() : [], e.length ? e : null
            }
            var o, p, q;
            o = a.fn.typeahead, p = {
                www: "tt-www",
                attrs: "tt-attrs",
                typeahead: "tt-typeahead"
            }, q = {
                initialize: function(e, l) {
                    function m() {
                        var c, m, q, r, s, t, u, v, w, x, y;
                        b.each(l, function(a) {
                            a.highlight = !!e.highlight
                        }), c = a(this), m = a(o.html.wrapper), q = n(e.hint), r = n(e.menu), s = e.hint !== !1 && !q, t = e.menu !== !1 && !r, s && (q = f(c, o)), t && (r = a(o.html.menu).css(o.css.menu)), q && q.val(""), c = h(c, o), (s || t) && (m.css(o.css.wrapper), c.css(s ? o.css.input : o.css.inputWithNoHint), c.wrap(m).parent().prepend(s ? q : null).append(t ? r : null)), y = t ? j : i, u = new d({
                            el: c
                        }), v = new g({
                            hint: q,
                            input: c
                        }, o), w = new y({
                            node: r,
                            datasets: l
                        }, o), x = new k({
                            input: v,
                            menu: w,
                            eventBus: u,
                            minLength: e.minLength
                        }, o), c.data(p.www, o), c.data(p.typeahead, x)
                    }
                    var o;
                    return l = b.isArray(l) ? l : [].slice.call(arguments, 1), e = e || {}, o = c(e.classNames), this.each(m)
                },
                isEnabled: function() {
                    var a;
                    return e(this.first(), function(b) {
                        a = b.isEnabled()
                    }), a
                },
                enable: function() {
                    return e(this, function(a) {
                        a.enable()
                    }), this
                },
                disable: function() {
                    return e(this, function(a) {
                        a.disable()
                    }), this
                },
                isActive: function() {
                    var a;
                    return e(this.first(), function(b) {
                        a = b.isActive()
                    }), a
                },
                activate: function() {
                    return e(this, function(a) {
                        a.activate()
                    }), this
                },
                deactivate: function() {
                    return e(this, function(a) {
                        a.deactivate()
                    }), this
                },
                isOpen: function() {
                    var a;
                    return e(this.first(), function(b) {
                        a = b.isOpen()
                    }), a
                },
                open: function() {
                    return e(this, function(a) {
                        a.open()
                    }), this
                },
                close: function() {
                    return e(this, function(a) {
                        a.close()
                    }), this
                },
                select: function(b) {
                    var c = !1,
                        d = a(b);
                    return e(this.first(), function(a) {
                        c = a.select(d)
                    }), c
                },
                autocomplete: function(b) {
                    var c = !1,
                        d = a(b);
                    return e(this.first(), function(a) {
                        c = a.autocomplete(d)
                    }), c
                },
                moveCursor: function(a) {
                    var b = !1;
                    return e(this.first(), function(c) {
                        b = c.moveCursor(a)
                    }), b
                },
                val: function(a) {
                    var b;
                    return arguments.length ? (e(this, function(b) {
                        b.setVal(a)
                    }), this) : (e(this.first(), function(a) {
                        b = a.getVal()
                    }), b)
                },
                destroy: function() {
                    return e(this, function(a, b) {
                        m(b), a.destroy()
                    }), this
                }
            }, a.fn.typeahead = function(a) {
                return q[a] ? q[a].apply(this, [].slice.call(arguments, 1)) : q.initialize.apply(this, arguments)
            }, a.fn.typeahead.noConflict = function() {
                return a.fn.typeahead = o, this
            }
        }()
    });
var conf = {
        speedup: 1,
        loop: !0,
        restart: function() {},
        mainParties: ["Conservative", "Labour", "Liberal Democrat", "Scottish National Party"],
        pollTimeout: 3e4,
        dataPath: "./data/",
        isPreview: !0,
        resultsPath: "./data/"
    },
    fmtNaN = function(a) {
        return function(b) {
            return isNaN(b) ? "-" : a(b).replace("+0", "0")
        }
    },
    numf = fmtNaN(d3.format(",f")),
    pct = fmtNaN(d3.format(".1%")),
    pctChange = fmtNaN(d3.format("+.1%")),
    numChange = fmtNaN(d3.format("+")),
    pctShareScale = d3.scale.linear().domain([0, .5]).clamp(!0),
    breaks = d3.range(5).map(function(a) {
        return "q" + a
    }),
    quantizePct = d3.scale.quantize().domain([0, .5]).range(breaks),
    topo, data = {},
    dispatch = d3.dispatch("ready", "dataChange", "stateChange"),
    bundles = {},
    state = function() {
        function a(a) {
            a ? d3.event && d3.event.shiftKey ? state.selected.constituencies.toggle(a) : state.selected.constituencies.has(a) ? state.selected.constituencies.clear() : (state.selected.constituencies.clear(), state.selected.constituencies.toggle(a)) : state.selected.constituencies.clear();
            var b = state.selected.constituencies.values().join("-");
            window.location.hash = b || "0", dispatch.stateChange()
        }

        function b(a) {
            console.log("setSelectedParty", a), state.selected.party = a, dispatch.stateChange()
        }

        function c(a) {
            var b = bundles[a];
            data !== b && (data = b, topo.objects.uk.geometries.forEach(function(a, b) {
                var c = data.idx.constituencyByGss[a.id];
                if (!c) throw new Error("Missing ID " + a.id);
                a.properties.constituency = c, c.geo = a
            }), d3.select("body").classed("is2015", data.is2015).classed("is2010", !data.is2015), dispatch.ready(a))
        }
        var d = {
            selected: {
                constituencies: new OrderedSet,
                setConstituency: a,
                party: null,
                setParty: b
            },
            setBundle: c,
            isIE: !!~window.navigator.userAgent.indexOf("MSIE ") || !!window.navigator.userAgent.match(/Trident.*rv[ :]*11\./),
            isHomePage: !!~window.location.pathname.indexOf("homepage.html")
        };
        return d
    }();
d3.attachTooltip = function(a) {
    function b(a) {
        d3.select(".tooltip").classed("tooltip-hidden", !1).html(""), d3.select(this).classed("tooltipped", !0)
    }

    function c(a) {
        var b = d3.select(".tooltip");
        if (b.size()) {
            var c = d3.event,
                d = c.clientX,
                e = c.clientY,
                f = window.scrollY ? window.scrollY : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
            n = b.node(), nBB = n.getBoundingClientRect(), b.style("top", e + f - nBB.height - 18 + "px"), b.style("left", Math.min(Math.max(0, d - nBB.width / 2), window.innerWidth - nBB.width) + "px")
        }
    }

    function d(a) {
        d3.select(".tooltip").classed("tooltip-hidden", !0), d3.selectAll(".tooltipped").classed("tooltipped", !1)
    }
    a.on("mouseover.attachTooltip", b).on("mousemove.attachTooltip", c).on("mouseout.attachTooltip", d)
};