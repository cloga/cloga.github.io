/* sigmajs.org - an open-source light-weight JavaScript graph drawing library - Version: 0.1 - Author:  Alexis Jacomy - License: MIT */
var sigma = {
  tools: {},
  classes: {},
  instances: {}
}; 
(function() {
  if (!Array.prototype.some) Array.prototype.some = function(i, m) {
    var f = this.length;
    if ("function" != typeof i) throw new TypeError;
    for (var j = 0; j < f; j++) if (j in this && i.call(m, this[j], j, this)) return ! 0;
    return ! 1
  };
  if (!Array.prototype.forEach) Array.prototype.forEach = function(i, m) {
    var f = this.length;
    if ("function" != typeof i) throw new TypeError;
    for (var j = 0; j < f; j++) j in this && i.call(m, this[j], j, this)
  };
  if (!Array.prototype.map) Array.prototype.map = function(i, m) {
    var f = this.length;
    if ("function" != typeof i) throw new TypeError;
    for (var j = Array(f), n = 0; n < f; n++) n in this && (j[n] = i.call(m, this[n], n, this));
    return j
  };
  if (!Array.prototype.filter) Array.prototype.filter = function(i, m) {
    var f = this.length;
    if ("function" != typeof i) throw new TypeError;
    for (var j = [], n = 0; n < f; n++) if (n in this) {
      var u = this[n];
      i.call(m, u, n, this) && j.push(u)
    }
    return j
  };
  if (!Object.keys) Object.keys = function() {
    var i = Object.prototype.hasOwnProperty,
    m = !{
      toString: null
    }.propertyIsEnumerable("toString"),
    f = "toString,toLocaleString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,constructor".split(","),
    j = f.length;
    return function(n) {
      if ("object" !== typeof n && "function" !== typeof n || null === n) throw new TypeError("Object.keys called on non-object");
      var u = [],
      r;
      for (r in n) i.call(n, r) && u.push(r);
      if (m) for (r = 0; r < j; r++) i.call(n, f[r]) && u.push(f[r]);
      return u
    }
  } ()
})();
sigma.classes.Cascade = function() {
  this.p = {};
  this.config = function(i, m) {
    if ("string" == typeof i && void 0 == m) return this.p[i];
    var f = "object" == typeof i && void 0 == m ? i: {};
    "string" == typeof i && (f[i] = m);
    for (var j in f) void 0 != this.p[j] && (this.p[j] = f[j]);
    return this
  }
};
sigma.classes.EventDispatcher = function() {
  var i = {},
  m = this;
  this.one = function(f, j) {
    if (!j || !f) return m; ("string" == typeof f ? f.split(" ") : f).forEach(function(f) {
      i[f] || (i[f] = []);
      i[f].push({
        h: j,
        one: !0
      })
    });
    return m
  };
  this.bind = function(f, j) {
    if (!j || !f) return m; ("string" == typeof f ? f.split(" ") : f).forEach(function(f) {
      i[f] || (i[f] = []);
      i[f].push({
        h: j,
        one: !1
      })
    });
    
    return m
  };
  this.unbind = function(f, j) {
    f || (i = {});
    var n = "string" == typeof f ? f.split(" ") : f;
    j ? n.forEach(function(f) {
      i[f] && (i[f] = i[f].filter(function(f) {
        return f.h != j
      }));
      i[f] && 0 == i[f].length && delete i[f]
    }) : n.forEach(function(f) {
      delete i[f]
    });
    return m
  };
  this.dispatch = function(f, j) {
    i[f] && (i[f].forEach(function(i) {
      i.h({
        type: f,
        content: j,
        target: m
      })
    }), i[f] = i[f].filter(function(f) {
      return ! f.one
    }));
    return m
  }
}; (function() {
  var i;
  function m() {
    function b(a) {
      return {
        x: a.x,
        y: a.y,
        size: a.size,
        degree: a.degree,
        inDegree: a.inDegree,
        outDegree: a.outDegree,
        displayX: a.displayX,
        displayY: a.displayY,
        displaySize: a.displaySize,
        label: a.label,
        id: a.id,
        color: a.color,
        fixed: a.fixed,
        active: a.active,
        hidden: a.hidden,
        forceLabel: a.forceLabel,
        attr: a.attr
      }
    }
    function l(a) {
    	a=window.event?window.event:a;
      return {
        source: a.source.id,
        target: a.target.id,
        size: a.size,
        type: a.type,
        weight: a.weight,
        displaySize: a.displaySize,
        label: a.label,
        hidden: a.hidden,
        id: a.id,
        attr: a.attr,
        color: a.color
      }
    }
    function g() {
      d.nodes = [];
      d.nodesIndex = {};
      d.edges = [];
      d.edgesIndex = {};
      return d
    }
    sigma.classes.Cascade.call(this);
    sigma.classes.EventDispatcher.call(this);
    var d = this;
    this.p = {
      minNodeSize: 0,
      maxNodeSize: 0,
      minEdgeSize: 0,
      maxEdgeSize: 0,
      scalingMode: "inside",
      nodesPowRatio: 0.5,
      edgesPowRatio: 0
    };
    this.borders = {};
    g();
    this.addNode = function(a, b) {
      if (d.nodesIndex[a]) {
    	  return;
      }
      var b = b || {},
      c = {
        x: 0,
        y: 0,
        size: 1,
        degree: 0,
        inDegree: 0,
        outDegree: 0,
        fixed: !1,
        active: !1,
        hidden: !1,
        forceLabel: !1,
        label: a.toString(),
        id: a.toString(),
        attr: {}
      },
      g;
      for (g in b) switch (g) {
      case "id":
        break;
      case "x":
      case "y":
      case "size":
        c[g] = +b[g];
        break;
      case "fixed":
      case "active":
      case "hidden":
      case "forceLabel":
        c[g] = !!b[g];
        break;
      case "color":
      case "label":
        c[g] = b[g];
        break;
      default:
        c.attr[g] = b[g]
      }
      d.nodes.push(c);
      d.nodesIndex[a.toString()] = c;
      return d
    };
    this.addEdge = function(a, b, c, g) {
      if (d.edgesIndex[a]) return;
      if (!d.nodesIndex[b]) return;
      if (!d.nodesIndex[c]) return;
      g = g || {};
      b = {
        source: d.nodesIndex[b],
        target: d.nodesIndex[c],
        size: 1,
        weight: 1,
        displaySize: 0.5,
        label: a.toString(),
        id: a.toString(),
        hidden: !1,
        attr: {}
      };
      b.source.degree++;
      b.source.outDegree++;
      b.target.degree++;
      b.target.inDegree++;
      for (var o in g) switch (o) {
      case "id":
      case "source":
      case "target":
        break;
      case "hidden":
        b[o] = !!g[o];
        break;
      case "size":
      case "weight":
        b[o] = +g[o];
        break;
      case "color":
        b[o] = g[o].toString();
        break;
      case "type":
        b[o] = g[o].toString();
        break;
      case "label":
        b[o] = g[o];
        break;
      default:
        b.attr[o] = g[o]
      }
      d.edges.push(b);
      d.edgesIndex[a.toString()] = b;
      return d
    };
    this.dropNode = function(a) { ((a instanceof Array ? a: [a]) || []).forEach(function(a) {
        if (d.nodesIndex[a]) {
          var c = null;
          d.nodes.some(function(b, d) {
            return b.id == a ? (c = d, !0) : !1
          });
          null != c && d.nodes.splice(c, 1);
          delete d.nodesIndex[a];
          d.edges = d.edges.filter(function(c) {
            if (c.source.id == a) return delete d.edgesIndex[c.id],
            c.target.degree--,
            c.target.inDegree--,
            !1;
            return c.target.id == a ? (delete d.edgesIndex[c.id], c.source.degree--, c.source.outDegree--, !1) : !0
          })
        } else sigma.log('Node "' + a + '" does not exist.')
      });
      return d
    };
    this.dropEdge = function(a) { ((a instanceof Array ? a: [a]) || []).forEach(function(a) {
        if (d.edgesIndex[a]) {
          d.edgesIndex[a].source.degree--;
          d.edgesIndex[a].source.outDegree--;
          d.edgesIndex[a].target.degree--;
          d.edgesIndex[a].target.inDegree--;
          var c = null;
          d.edges.some(function(b, d) {
            return b.id == a ? (c = d, !0) : !1
          });
          null != c && d.edges.splice(c, 1);
          delete d.edgesIndex[a]
        } else sigma.log('Edge "' + a + '" does not exist.')
      });
      return d
    };
    this.iterEdges = function(a, b) {
      var c = b ? b.map(function(a) {
        return d.edgesIndex[a]
      }) : d.edges,
      g = c.map(l);
      g.forEach(a);
      c.forEach(function(a, c) {
        var b = g[c],
        k;
        for (k in b) switch (k) {
        case "id":
        case "displaySize":
          break;
        case "weight":
        case "size":
          a[k] = +b[k];
          break;
        case "source":
        case "target":
          a[k] = d.nodesIndex[k] || a[k];
          break;
        case "hidden":
          a[k] = !!b[k];
          break;
        case "color":
        case "label":
        case "type":
          a[k] = (b[k] || "").toString();
          break;
        default:
          a.attr[k] = b[k]
        }
      });
      return d
    };
    this.iterNodes = function(a, g) {
      var c = g ? g.map(function(a) {
        return d.nodesIndex[a]
      }) : d.nodes,
      l = c.map(b);
      l.forEach(a);
      c.forEach(function(a, c) {
        var b = l[c],
        d;
        for (d in b) switch (d) {
        case "id":
        case "attr":
        case "degree":
        case "inDegree":
        case "outDegree":
        case "displayX":
        case "displayY":
        case "displaySize":
          break;
        case "x":
        case "y":
        case "size":
          a[d] = +b[d];
          break;
        case "fixed":
        case "active":
        case "hidden":
        case "forceLabel":
          a[d] = !!b[d];
          break;
        case "color":
        case "label":
          a[d] = (b[d] || "").toString();
          break;
        default:
          a.attr[d] = b[d]
        }
      });
      return d
    };
    this.getEdges = function(a) {
      var b = ((a instanceof Array ? a: [a]) || []).map(function(a) {
        return l(d.edgesIndex[a])
      });
      return a instanceof Array ? b: b[0]
    };
    this.getNodes = function(a) {
      var g = ((a instanceof Array ? a: [a]) || []).map(function(a) {
        return b(d.nodesIndex[a])
      });
      return a instanceof Array ? g: g[0]
    };
    this.empty = g;
    this.rescale = function(a, b, c, g) {
      var o = 0,
      h = 0;
      c && d.nodes.forEach(function(a) {
        h = Math.max(a.size, h)
      });
      g && d.edges.forEach(function(a) {
        o = Math.max(a.size, o)
      });
      var h = h || 1,
      o = o || 1,
      l, k, s, p;
      c && d.nodes.forEach(function(a) {
        k = Math.max(a.x, k || a.x);
        l = Math.min(a.x, l || a.x);
        p = Math.max(a.y, p || a.y);
        s = Math.min(a.y, s || a.y)
      });
      var f = "outside" == d.p.scalingMode ? Math.max(a / Math.max(k - l, 1), b / Math.max(p - s, 1)) : Math.min(a / Math.max(k - l, 1), b / Math.max(p - s, 1)),
      i = (d.p.maxNodeSize || h) / f;
      k += i;
      l -= i;
      p += i;
      s -= i;
      var f = "outside" == d.p.scalingMode ? Math.max(a / Math.max(k - l, 1), b / Math.max(p - s, 1)) : Math.min(a / Math.max(k - l, 1), b / Math.max(p - s, 1)),
      j,
      n; ! d.p.maxNodeSize && !d.p.minNodeSize ? (j = 1, n = 0) : d.p.maxNodeSize == d.p.minNodeSize ? (j = 0, n = d.p.maxNodeSize) : (j = (d.p.maxNodeSize - d.p.minNodeSize) / h, n = d.p.minNodeSize);
      var x, m; ! d.p.maxEdgeSize && !d.p.minEdgeSize ? (x = 1, m = 0) : (x = d.p.maxEdgeSize == d.p.minEdgeSize ? 0 : (d.p.maxEdgeSize - d.p.minEdgeSize) / o, m = d.p.minEdgeSize);
      c && d.nodes.forEach(function(c) {
        c.displaySize = c.size * j + n;
        if (!c.fixed) c.displayX = (c.x - (k + l) / 2) * f + a / 2,
        c.displayY = (c.y - (p + s) / 2) * f + b / 2
      });
      g && d.edges.forEach(function(a) {
        a.displaySize = a.size * x + m
      });
      return d
    };
    this.translate = function(a, b, c, g, l) {
      var h = Math.pow(c, d.p.nodesPowRatio);
      g && d.nodes.forEach(function(d) {
        if (!d.fixed) d.displayX = d.displayX * c + a,
        d.displayY = d.displayY * c + b;
        d.displaySize *= h
      });
      h = Math.pow(c, d.p.edgesPowRatio);
      l && d.edges.forEach(function(a) {
        a.displaySize *= h
      });
      return d
    };
    this.setBorders = function() {
      d.borders = {};
      d.nodes.forEach(function(a) {
        d.borders.minX = Math.min(void 0 == d.borders.minX ? a.displayX - a.displaySize: d.borders.minX, a.displayX - a.displaySize);
        d.borders.maxX = Math.max(void 0 == d.borders.maxX ? a.displayX + a.displaySize: d.borders.maxX, a.displayX + a.displaySize);
        d.borders.minY = Math.min(void 0 == d.borders.minY ? a.displayY - a.displaySize: d.borders.minY, a.displayY - a.displaySize);
        d.borders.maxY = Math.max(void 0 == d.borders.maxY ? a.displayY - a.displaySize: d.borders.maxY, a.displayY - a.displaySize)
      })
    };
    this.checkHover = function(a, b) {
      var c, g, l, h = [],
      f = [];
      d.nodes.forEach(function(d) {
        if (d.hidden) d.hover = !1;
        else {
          c = Math.abs(d.displayX - a);
          g = Math.abs(d.displayY - b);
          l = d.displaySize;
          var s = d.hover,
          p = c < l && g < l && Math.sqrt(c * c + g * g) < l;
          if (s && !p) d.hover = !1,
          f.push(d.id);
          else if (p && !s) d.hover = !0,
          h.push(d.id)
        }
      });
      h.length && d.dispatch("overnodes", h);
      f.length && d.dispatch("outnodes", f);
      return d
    }
  }
  function f(b, l) {
    function g() {
      var a;
      a = "<p>GLOBAL :</p>";
      for (var b in d.p.globalProbes) a += "<p>" + b + " : " + d.p.globalProbes[b]() + "</p>";
      a += "<br><p>LOCAL :</p>";
      for (b in d.p.localProbes) a += "<p>" + b + " : " + d.p.localProbes[b]() + "</p>";
      d.p.dom.innerHTML = a;
      return d
    }
    sigma.classes.Cascade.call(this);
    var d = this;
    this.instance = b;
    this.monitoring = !1;
    this.p = {
      fps: 40,
      dom: l,
      globalProbes: {
        "Time (ms)": sigma.chronos.getExecutionTime,
        Queue: sigma.chronos.getQueuedTasksCount,
        Tasks: sigma.chronos.getTasksCount,
        FPS: sigma.chronos.getFPS
      },
      localProbes: {
        "Nodes count": function() {
          return d.instance.graph.nodes.length
        },
        "Edges count": function() {
          return d.instance.graph.edges.length
        }
      }
    };
    this.activate = function() {
      if (!d.monitoring) d.monitoring = window.setInterval(g, 1E3 / d.p.fps);
      return d
    };
    this.desactivate = function() {
      if (d.monitoring) window.clearInterval(d.monitoring),
      d.monitoring = null,
      d.p.dom.innerHTML = "";
      return d
    }
  }
  function j(b) {
    function l(b) {
    	b=window.event?window.event:b;
      if (a.p.mouseEnabled && (g(a.mouseX, a.mouseY, a.ratio * (0 < (void 0 != b.wheelDelta && b.wheelDelta || void 0 != b.detail && -b.detail) ? a.p.zoomMultiply: 1 / a.p.zoomMultiply)), a.p.blockScroll)) b.preventDefault ? b.preventDefault() : b.returnValue = !1
    }
    function g(b, c, g) {
      if (!a.isMouseDown && (window.clearInterval(a.interpolationID), w = void 0 != g, i = a.stageX, j = b, o = a.stageY, k = c, h = g || a.ratio, h = Math.min(Math.max(h, a.p.minRatio), a.p.maxRatio), m = a.p.directZooming ? 1 - (w ? a.p.zoomDelta: a.p.dragDelta) : 0, a.ratio != h || a.stageX != j || a.stageY != k)) d(),
      a.interpolationID = window.setInterval(d, 50),
      a.dispatch("startinterpolate")
    }
    function d() {
      m += w ? a.p.zoomDelta: a.p.dragDelta;
      m = Math.min(m, 1);
      var b = sigma.easing.quadratic.easeout(m),
      c = a.ratio;
      a.ratio = c * (1 - b) + h * b;
      w ? (a.stageX = j + (a.stageX - j) * a.ratio / c, a.stageY = k + (a.stageY - k) * a.ratio / c) : (a.stageX = i * (1 - b) + j * b, a.stageY = o * (1 - b) + k * b);
      a.dispatch("interpolate");
      if (1 <= m) window.clearInterval(a.interpolationID),
      b = a.ratio,
      w ? (a.ratio = h, a.stageX = j + (a.stageX - j) * a.ratio / b, a.stageY = k + (a.stageY - k) * a.ratio / b) : (a.stageX = j, a.stageY = k),
      a.dispatch("stopinterpolate")
    }
    sigma.classes.Cascade.call(this);
    sigma.classes.EventDispatcher.call(this);
    var a = this;
    this.p = {
      minRatio: 1,
      maxRatio: 32,
      marginRatio: 1,
      zoomDelta: 0.1,
      dragDelta: 0.3,
      zoomMultiply: 2,
      directZooming: !1,
      blockScroll: !0,
      inertia: 1.1,
      mouseEnabled: !0
    };
    var f = 0,
    c = 0,
    i = 0,
    o = 0,
    h = 1,
    j = 0,
    k = 0,
    s = 0,
    p = 0,
    C = 0,
    n = 0,
    m = 0,
    w = !1;
    this.stageY = this.stageX = 0;
    this.ratio = 1;
    this.mouseY = this.mouseX = 0;
    this.isMouseDown = !1;
    if($.browser.msie){
    	b.attachEvent("DOMMouseScroll", l, !0);
        b.onmousewheel = l;
        b.onmousemove = function(b) {
        	b=window.event?window.event:b;
          a.mouseX = void 0 != b.offsetX && b.offsetX || void 0 != b.layerX && b.layerX || void 0 != b.clientX && b.clientX;
          a.mouseY = void 0 != b.offsetY && b.offsetY || void 0 != b.layerY && b.layerY || void 0 != b.clientY && b.clientY;
          if (a.isMouseDown) {
            var d = a.mouseX - f + i,
            h = a.mouseY - c + o;
            if (d != a.stageX || h != a.stageY) p = s,
            n = C,
            s = d,
            C = h,
            a.stageX = d,
            a.stageY = h,
            a.dispatch("drag")
          }
          a.dispatch("move");
          b.preventDefault ? b.preventDefault() : b.returnValue = !1
       }
        b.onmousedown = function(b) {
        	b=window.event?window.event:b;
          if (a.p.mouseEnabled) a.isMouseDown = !0,
          a.dispatch("mousedown"),
          i = a.stageX,
          o = a.stageY,
          f = a.mouseX,
          c = a.mouseY,
          p = s = a.stageX,
          n = C = a.stageY,
          a.dispatch("startdrag"),
          b.preventDefault ? b.preventDefault() : b.returnValue = !1
        }
        b.onmouseup = function(b) {
        	b=window.event?window.event:b;
          if (a.p.mouseEnabled && a.isMouseDown) a.isMouseDown = !1,
          a.dispatch("mouseup"),
          (i != a.stageX || o != a.stageY) && g(a.stageX + a.p.inertia * (a.stageX - p), a.stageY + a.p.inertia * (a.stageY - n)),
          b.preventDefault ? b.preventDefault() : b.returnValue = !1
        }
    }else{
    b.addEventListener("DOMMouseScroll", l, !0);
    b.addEventListener("mousewheel", l, !0);
    b.addEventListener("mousemove",
    function(b) {
      a.mouseX = void 0 != b.offsetX && b.offsetX || void 0 != b.layerX && b.layerX || void 0 != b.clientX && b.clientX;
      a.mouseY = void 0 != b.offsetY && b.offsetY || void 0 != b.layerY && b.layerY || void 0 != b.clientY && b.clientY;
      if (a.isMouseDown) {
        var d = a.mouseX - f + i,
        h = a.mouseY - c + o;
        if (d != a.stageX || h != a.stageY) p = s,
        n = C,
        s = d,
        C = h,
        a.stageX = d,
        a.stageY = h,
        a.dispatch("drag")
      }
      a.dispatch("move");
      b.preventDefault ? b.preventDefault() : b.returnValue = !1
    },
    !0);
    b.addEventListener("mousedown",
    function(b) {
      if (a.p.mouseEnabled) a.isMouseDown = !0,
      a.dispatch("mousedown"),
      i = a.stageX,
      o = a.stageY,
      f = a.mouseX,
      c = a.mouseY,
      p = s = a.stageX,
      n = C = a.stageY,
      a.dispatch("startdrag"),
      b.preventDefault ? b.preventDefault() : b.returnValue = !1
    },
    !0);
    document.addEventListener("mouseup",
    function(b) {
      if (a.p.mouseEnabled && a.isMouseDown) a.isMouseDown = !1,
      a.dispatch("mouseup"),
      (i != a.stageX || o != a.stageY) && g(a.stageX + a.p.inertia * (a.stageX - p), a.stageY + a.p.inertia * (a.stageY - n)),
      b.preventDefault ? b.preventDefault() : b.returnValue = !1
    },
    !0);
    }
    this.checkBorders = function() {
      return a
    };
    this.interpolate = g
  }
  
  function n(b, l, g, d, a, f, c) {
    function i(a) {
      var b = d,
      c = "fixed" == h.p.labelSize ? h.p.defaultLabelSize: h.p.labelSizeRatio * a.displaySize;
      b.font = (h.p.hoverFontStyle || h.p.fontStyle || "") + " " + c + "px " + (h.p.hoverFont || h.p.font || "");
      b.fillStyle = "node" == h.p.labelHoverBGColor ? a.color || h.p.defaultNodeColor: h.p.defaultHoverLabelBGColor;
      b.beginPath();
     
      if (h.p.labelHoverShadow) {
    	  b.shadowOffsetX = 0;
	      b.shadowOffsetY = 0;
	      b.shadowBlur = 0;
	      b.shadowColor = h.p.labelHoverShadowColor;
      }
      sigma.tools.drawRoundRect(b, Math.round(a.displayX - c / 2 - 2), Math.round(a.displayY - c / 2 - 2), Math.round(b.measureText(a.label).width + 1.5 * a.displaySize + c / 2 + 4), Math.round(c + 4), Math.round(c / 2 + 2), "left");
     
      b.closePath();
      b.fill();
      b.shadowOffsetX = 0;
      b.shadowOffsetY = 0;
      b.shadowBlur = 0;
      b.beginPath();
      b.fillStyle = "node" == h.p.nodeBorderColor ? a.color || h.p.defaultNodeColor: h.p.defaultNodeBorderColor;
      b.arc(Math.round(a.displayX), Math.round(a.displayY), a.displaySize + h.p.borderSize, 0, 2 * Math.PI, !0);
      b.closePath();
      b.fill();
      b.beginPath();
      b.fillStyle = "node" == h.p.nodeHoverColor ? a.color || h.p.defaultNodeColor: h.p.defaultNodeHoverColor;
      b.arc(Math.round(a.displayX), Math.round(a.displayY), a.displaySize, 0, 2 * Math.PI, !0);
      b.closePath();
      b.fill();
      b.fillStyle = "node" == h.p.labelHoverColor ? a.color || h.p.defaultNodeColor: h.p.defaultLabelHoverColor;
      b.fillText(a.label, Math.round(a.displayX + 1.5 * a.displaySize), Math.round(a.displayY + c / 2 - 3));
      return h
    }
    function o(a) {
      if (isNaN(a.x) || isNaN(a.y)) throw Error("A node's coordinate is not a number (id: " + a.id + ")");
      return ! a.hidden && a.displayX + a.displaySize > -j / 3 && a.displayX - a.displaySize < 4 * j / 3 && a.displayY + a.displaySize > -k / 3 && a.displayY - a.displaySize < 4 * k / 3
    }
    sigma.classes.Cascade.call(this);
    var h = this;
    this.p = {
      labelColor: "default",
      defaultLabelColor: "#000",
      labelHoverBGColor: "default",
      defaultHoverLabelBGColor: "#fff",
      labelHoverShadow: !0,
      labelHoverShadowColor: "#000",
      labelHoverColor: "default",
      defaultLabelHoverColor: "#000",
      labelActiveBGColor: "default",
      defaultActiveLabelBGColor: "#fff",
      labelActiveShadow: !0,
      labelActiveShadowColor: "#000",
      labelActiveColor: "default",
      defaultLabelActiveColor: "#000",
      labelSize: "fixed",
      defaultLabelSize: 12,
      labelSizeRatio: 2,
      labelThreshold: 6,
      font: "Arial",
      hoverFont: "",
      activeFont: "",
      fontStyle: "",
      hoverFontStyle: "",
      activeFontStyle: "",
      edgeColor: "source",
      defaultEdgeColor: "#aaa",
      defaultEdgeType: "line",
      defaultNodeColor: "#aaa",
      nodeHoverColor: "node",
      defaultNodeHoverColor: "#fff",
      nodeActiveColor: "node",
      defaultNodeActiveColor: "#fff",
      borderSize: 0,
      nodeBorderColor: "node",
      defaultNodeBorderColor: "#fff",
      edgesSpeed: 200,
      nodesSpeed: 200,
      labelsSpeed: 200
    };
    var j = f,
    k = c;
    this.currentLabelIndex = this.currentNodeIndex = this.currentEdgeIndex = 0;
    this.task_drawLabel = function() {
      for (var b = a.nodes.length,
      c = 0; c++<h.p.labelsSpeed && h.currentLabelIndex < b;) if (h.isOnScreen(a.nodes[h.currentLabelIndex])) {
        var d = a.nodes[h.currentLabelIndex++],
        l = g;
        if (d.displaySize >= h.p.labelThreshold || d.forceLabel) {
          var f = "fixed" == h.p.labelSize ? h.p.defaultLabelSize: h.p.labelSizeRatio * d.displaySize;
          l.font = h.p.fontStyle + f + "px " + h.p.font;
          l.fillStyle = "node" == h.p.labelColor ? d.color || h.p.defaultNodeColor: h.p.defaultLabelColor;
          l.fillText(d.label, Math.round(d.displayX + 1.5 * d.displaySize), Math.round(d.displayY + f / 2 - 3))
        }
      } else h.currentLabelIndex++;
      return h.currentLabelIndex < b
    };
    
    this.task_drawEdge = function() {
      for (var b = a.edges.length,
      c, d, g = 0; g++<h.p.edgesSpeed && h.currentEdgeIndex < b;) if (e = a.edges[h.currentEdgeIndex], c = e.source, d = e.target, e.hidden || c.hidden || d.hidden || !h.isOnScreen(c) && !h.isOnScreen(d)) h.currentEdgeIndex++;
      else {
        c = a.edges[h.currentEdgeIndex++];
        d = c.source.displayX;
        var f = c.source.displayY,
        o = c.target.displayX,
        i = c.target.displayY,
        j = c.color;
        if (!j) switch (h.p.edgeColor) {
        case "source":
          j = c.source.color || h.p.defaultNodeColor;
          break;
        case "target":
          j = c.target.color || h.p.defaultNodeColor;
          break;
        default:
          j = h.p.defaultEdgeColor
        }
        var k = l;
        switch (c.type || h.p.defaultEdgeType) {
        case "curve":
          k.strokeStyle = j;
          k.lineWidth = c.displaySize / 3;
          k.beginPath();
          k.moveTo(d, f);
          k.quadraticCurveTo((d + o) / 2 + (i - f) / 4, (f + i) / 2 + (d - o) / 4, o, i);
          k.stroke();
          break;
        default:
          k.strokeStyle = j,
          k.lineWidth = c.displaySize / 3,
          k.beginPath(),
          k.moveTo(d, f),
          k.lineTo(o, i),
          k.stroke()
        }
      }
      return h.currentEdgeIndex < b
    };
    this.task_drawNode = function() {
      for (var c = a.nodes.length,
      d = 0; d++<h.p.nodesSpeed && h.currentNodeIndex < c;) if (h.isOnScreen(a.nodes[h.currentNodeIndex])) {
        var g = a.nodes[h.currentNodeIndex++],
        l = Math.round(10 * g.displaySize) / 10,
        f = b;
        f.fillStyle = g.color;
        f.beginPath();
        f.arc(g.displayX, g.displayY, l, 0, 2 * Math.PI, !0);
        f.closePath();
        f.fill();
        g.hover && i(g)
      } else h.currentNodeIndex++;
      return h.currentNodeIndex < c
    };
    this.drawActiveNode = function(a) {
      var b = d;
      if (!o(a)) return h;
      var c = "fixed" == h.p.labelSize ? h.p.defaultLabelSize: h.p.labelSizeRatio * a.displaySize;
      b.font = (h.p.activeFontStyle || h.p.fontStyle || "") + " " + c + "px " + (h.p.activeFont || h.p.font || "");
      b.fillStyle = "node" == h.p.labelHoverBGColor ? a.color || h.p.defaultNodeColor: h.p.defaultActiveLabelBGColor;
      b.beginPath();
      if (h.p.labelActiveShadow) {
    	  b.shadowOffsetX = 0;
    	  b.shadowOffsetY = 0;
    	  b.shadowBlur = 4;
    	  b.shadowColor = h.p.labelActiveShadowColor;
      }
       
      sigma.tools.drawRoundRect(b, Math.round(a.displayX - c / 2 - 2), Math.round(a.displayY - c / 2 - 2), Math.round(b.measureText(a.label).width + 1.5 * a.displaySize + c / 2 + 4), Math.round(c + 4), Math.round(c / 2 + 2), "left");
      b.closePath();
      b.fill();
      b.shadowOffsetX = 0;
      b.shadowOffsetY = 0;
      b.shadowBlur = 0;
      b.beginPath();
      b.fillStyle = "node" == h.p.nodeBorderColor ? a.color || h.p.defaultNodeColor: h.p.defaultNodeBorderColor;
      b.arc(Math.round(a.displayX), Math.round(a.displayY), a.displaySize + h.p.borderSize, 0, 2 * Math.PI, !0);
      b.closePath();
      b.fill();
      b.beginPath();
      b.fillStyle = "node" == h.p.nodeActiveColor ? a.color || h.p.defaultNodeColor: h.p.defaultNodeActiveColor;
      b.arc(Math.round(a.displayX), Math.round(a.displayY), a.displaySize, 0, 2 * Math.PI, !0);
      b.closePath();
      b.fill();
      b.fillStyle = "node" == h.p.labelActiveColor ? a.color || h.p.defaultNodeColor: h.p.defaultLabelActiveColor;
      b.fillText(a.label, Math.round(a.displayX + 1.5 * a.displaySize), Math.round(a.displayY + c / 2 - 3));
      return h
    };
    this.drawHoverNode = i;
    this.isOnScreen = o;
    this.resize = function(a, b) {
      j = a;
      k = b;
      return h
    }
  }
  function u(b, l) {
    function g() {
      sigma.chronos.removeTask("node_" + c.id, 2).removeTask("edge_" + c.id, 2).removeTask("label_" + c.id, 2).stopTasks();
      return c
    }
    function d(a, b) {
      //c.domElements[a] = 
      c.domElements[a] = document.createElement(b);
      if(b == "canvas"){
    	  c.domRoot.appendChild(c.domElements[a]);
    	  if($.browser.msie){    
    		  if($.browser.version != '9.0'){
    			  G_vmlCanvasManager.init_(document);
    		  }
    	  }
  	  }else{
  		  c.domRoot.appendChild(c.domElements[a]);
  	  }
      c.domElements[a].style.position = "absolute";
      c.domElements[a].setAttribute("id", "sigma_" + a + "_" + c.id);
      c.domElements[a].setAttribute("class", "sigma_" + a + "_" + b);
      c.domElements[a].setAttribute("width", c.width);
      c.domElements[a].setAttribute("height", c.height);      
      return c;
    }
    function a() {
      c.p.drawHoverNodes && (c.graph.checkHover(c.mousecaptor.mouseX, c.mousecaptor.mouseY), c.graph.nodes.forEach(function(a) {
        a.hover && !a.active && c.plotter.drawHoverNode(a)
      }));
      return c
    }
    function A() {
      c.p.drawActiveNodes && c.graph.nodes.forEach(function(a) {
        a.active && c.plotter.drawActiveNode(a)
      });
      return c
    }
    sigma.classes.Cascade.call(this);
    sigma.classes.EventDispatcher.call(this);
    var c = this;
    this.id = l.toString();
    this.p = {
      auto: !0,
      drawNodes: 2,
      drawEdges: 1,
      drawLabels: 2,
      lastNodes: 2,
      lastEdges: 0,
      lastLabels: 2,
      drawHoverNodes: !0,
      drawActiveNodes: !0
    };
    this.domRoot = b;
    this.width = this.domRoot.offsetWidth;

    this.height = this.domRoot.offsetHeight;
    this.graph = new m;
    this.domElements = {};
    d("edges", "canvas");
    d("nodes", "canvas");
    d("labels", "canvas");
    d("hover", "canvas");
    d("monitor", "div");
    d("mouse", "canvas");
    
    this.plotter = new n(this.domElements.nodes.getContext("2d"), this.domElements.edges.getContext("2d"), this.domElements.labels.getContext("2d"), this.domElements.hover.getContext("2d"), this.graph, this.width, this.height);
    this.monitor = new f(this, this.domElements.monitor);
    this.mousecaptor = new j(this.domElements.mouse, this.id);
    this.mousecaptor.bind("drag interpolate",
    function() {
      c.draw(c.p.auto ? 2 : c.p.drawNodes, c.p.auto ? 0 : c.p.drawEdges, c.p.auto ? 2 : c.p.drawLabels, !0)
    }).bind("stopdrag stopinterpolate",
    function() {
      c.draw(c.p.auto ? 2 : c.p.drawNodes, c.p.auto ? 1 : c.p.drawEdges, c.p.auto ? 2 : c.p.drawLabels, !0)
    }).bind("mousedown mouseup",
    function(a) {
      var b = c.graph.nodes.filter(function(a) {
        return !! a.hover
      }).map(function(a) {
        return a.id
      });
      c.dispatch("mousedown" == a.type ? "downgraph": "upgraph");
      b.length && c.dispatch("mousedown" == a.type ? "downnodes": "upnodes", b)
    }).bind("move",
    function() {
      c.domElements.hover.getContext("2d").clearRect(0, 0, c.domElements.hover.width, c.domElements.hover.height);
      a();
      A()
    });
    sigma.chronos.bind("startgenerators",
    function() {
      sigma.chronos.getGeneratorsIDs().some(function(a) {
        return !! a.match(RegExp("_ext_" + c.id + "$", ""))
      }) && c.draw(c.p.auto ? 2 : c.p.drawNodes, c.p.auto ? 0 : c.p.drawEdges, c.p.auto ? 2 : c.p.drawLabels)
    }).bind("stopgenerators",
    function() {
      c.draw()
    });
    for (var B = 0; B < i.length; B++) i[B](this);
    this.draw = function(a, b, d, l) {
      if (l && sigma.chronos.getGeneratorsIDs().some(function(a) {
        return !! a.match(RegExp("_ext_" + c.id + "$", ""))
      })) return c;
      a = void 0 == a ? c.p.drawNodes: a;
      b = void 0 == b ? c.p.drawEdges: b;
      d = void 0 == d ? c.p.drawLabels: d;
      l = {
        nodes: a,
        edges: b,
        labels: d
      };
      c.p.lastNodes = a;
      c.p.lastEdges = b;
      c.p.lastLabels = d;
      g();
      c.graph.rescale(c.width, c.height, 0 < a, 0 < b).setBorders();
      c.mousecaptor.checkBorders(c.graph.borders, c.width, c.height);
      c.graph.translate(c.mousecaptor.stageX, c.mousecaptor.stageY, c.mousecaptor.ratio, 0 < a, 0 < b);
      c.dispatch("graphscaled");
      for (var f in c.domElements)"canvas" == c.domElements[f].nodeName.toLowerCase() && (void 0 == l[f] || 0 <= l[f]) && c.domElements[f].getContext("2d").clearRect(0, 0, c.domElements[f].width, c.domElements[f].height);
      c.plotter.currentEdgeIndex = 0;
      c.plotter.currentNodeIndex = 0;
      c.plotter.currentLabelIndex = 0;
      f = null;
      l = !1;
      if (a) if (1 < a) for (; c.plotter.task_drawNode(););
      else sigma.chronos.addTask(c.plotter.task_drawNode, "node_" + c.id, !1),
      l = !0,
      f = "node_" + c.id;
      if (d) if (1 < d) for (; c.plotter.task_drawLabel(););
      else f ? sigma.chronos.queueTask(c.plotter.task_drawLabel, "label_" + c.id, f) : sigma.chronos.addTask(c.plotter.task_drawLabel, "label_" + c.id, !1),
      l = !0,
      f = "label_" + c.id;
      if (b) if (1 < b) for (; c.plotter.task_drawEdge(););
      else f ? sigma.chronos.queueTask(c.plotter.task_drawEdge, "edge_" + c.id, f) : sigma.chronos.addTask(c.plotter.task_drawEdge, "edge_" + c.id, !1),
      l = !0,
      f = "edge_" + c.id;
      c.dispatch("draw");
      c.refresh();
      l && sigma.chronos.runTasks();
      return c
    };
    this.resize = function(a, b) {
      var d = c.width,
      g = c.height;
      void 0 != a && void 0 != b ? (c.width = a, c.height = b) : (c.width = c.domRoot.offsetWidth, c.height = c.domRoot.offsetHeight);
      if (d != c.width || g != c.height) {
        for (var f in c.domElements) c.domElements[f].setAttribute("width", c.width + "px"),
        c.domElements[f].setAttribute("height", c.height + "px");
        c.plotter.resize(c.width, c.height);
        c.draw(c.p.lastNodes, c.p.lastEdges, c.p.lastLabels, !0)
      }
      return c
    };
    this.refresh = function() {
      c.domElements.hover.getContext("2d").clearRect(0, 0, c.domElements.hover.width, c.domElements.hover.height);
      a();
      A();
      return c
    };
    this.drawHover = a;
    this.drawActive = A;
    this.clearSchedule = g;
    if($.browser.msie){
	    window.attachEvent("resize",
	    function() {
	      c.resize()
	    })
    }else{
    	window.addEventListener("resize",
	    function() {
	      c.resize()
	    })
    }
  }
  function r(b) {
    var f = this;
    sigma.classes.EventDispatcher.call(this);
    this._core = b;
    this.kill = function() {};
    this.getID = function() {
      return b.id
    };
    this.configProperties = function(g, d) {
      var a = b.config(g, d);
      return a == b ? f: a
    };
    this.drawingProperties = function(g, d) {
      var a = b.plotter.config(g, d);
      return a == b.plotter ? f: a
    };
    this.mouseProperties = function(g, d) {
      var a = b.mousecaptor.config(g, d);
      return a == b.mousecaptor ? f: a
    };
    this.graphProperties = function(g, d) {
      var a = b.graph.config(g, d);
      return a == b.graph ? f: a
    };
    this.getMouse = function() {
      return {
        mouseX: b.mousecaptor.mouseX,
        mouseY: b.mousecaptor.mouseY,
        down: b.mousecaptor.isMouseDown
      }
    };
    this.position = function(g, d, a) {
      if (0 == arguments.length) return {
        stageX: b.mousecaptor.stageX,
        stageY: b.mousecaptor.stageY,
        ratio: b.mousecaptor.ratio
      };
      b.mousecaptor.stageX = void 0 != g ? g: b.mousecaptor.stageX;
      b.mousecaptor.stageY = void 0 != d ? d: b.mousecaptor.stageY;
      b.mousecaptor.ratio = void 0 != a ? a: b.mousecaptor.ratio;
      return f
    };
    this.goTo = function(g, d, a) {
      b.mousecaptor.interpolate(g, d, a);
      return f
    };
    this.zoomTo = function(g, d, a) {
      a = Math.min(Math.max(b.mousecaptor.config("minRatio"), a), b.mousecaptor.config("maxRatio"));
      a == b.mousecaptor.ratio ? b.mousecaptor.interpolate(g - b.width / 2 + b.mousecaptor.stageX, d - b.height / 2 + b.mousecaptor.stageY) : b.mousecaptor.interpolate((a * g - b.mousecaptor.ratio * b.width / 2) / (a - b.mousecaptor.ratio), (a * d - b.mousecaptor.ratio * b.height / 2) / (a - b.mousecaptor.ratio), a);
      return f
    };
    this.resize = function(g, d) {
      b.resize(g, d);
      return f
    };
    this.draw = function(g, d, a, i) {
      b.draw(g, d, a, i);
      return f
    };
    this.refresh = function() {
      b.refresh();
      return f
    };
    this.addGenerator = function(g, d, a) {
      sigma.chronos.addGenerator(g + "_ext_" + b.id, d, a);
      return f
    };
    this.removeGenerator = function(g) {
      sigma.chronos.removeGenerator(g + "_ext_" + b.id);
      return f
    };
    this.addNode = function(g, d) {
      b.graph.addNode(g, d);
      return f
    };
    this.addEdge = function(g, d, a, i) {
      b.graph.addEdge(g, d, a, i);
      return f
    };
    this.dropNode = function(g) {
      b.graph.dropNode(g);
      return f
    };
    this.dropEdge = function(g) {
      b.graph.dropEdge(g);
      return f
    };
    this.pushGraph = function(g, d) {
      g.nodes && g.nodes.forEach(function(a) {
        a.id && (!d || !b.graph.nodesIndex[a.id]) && f.addNode(a.id, a)
      });
      g.edges && g.edges.forEach(function(a) { (validID = a.source && a.target && a.id) && (!d || !b.graph.edgesIndex[a.id]) && f.addNode(a.id, a.source, a.target, a)
      });
      return f
    };
    this.emptyGraph = function() {
      b.graph.empty();
      return f
    };
    this.getNodesCount = function() {
      return b.graph.nodes.length
    };
    this.getEdgesCount = function() {
      return b.graph.edges.length
    };

    this.iterNodes = function(g, d) {
      b.graph.iterNodes(g, d);
      return f
    };
    this.iterEdges = function(g, d) {
      b.graph.iterEdges(g, d);
      return f
    };
    this.getNodes = function(g) {
      return b.graph.getNodes(g)
    };
    this.getEdges = function(g) {
      return b.graph.getEdges(g)
    };
    this.activateMonitoring = function() {
      return b.monitor.activate()
    };
    this.desactivateMonitoring = function() {
      return b.monitor.desactivate()
    };
    b.bind("downnodes upnodes downgraph upgraph",
    function(b) {
      f.dispatch(b.type, b.content)
    });
    b.graph.bind("overnodes outnodes",
    function(b) {
      f.dispatch(b.type, b.content)
    })
  }
  var y = 0;
  i = void 0;
  i = [];
  sigma.init = function(b) {
    b = new u(b, (++y).toString());
    sigma.instances[y] = new r(b);
    return sigma.instances[y]
  };
  sigma.addPlugin = function(b, f, g) {
    r.prototype[b] = f;
    i.push(g)
  };
  sigma.chronos = new
  function() {
    function b(a) {
      window.setTimeout(a, 0);
      return h
    }
    function f() {
      for (h.dispatch("frameinserted"); m && t.length && g();); ! m || !t.length ? a() : (x = (new Date).getTime(), p++, D = y - r, u = r - D, h.dispatch("insertframe"), b(f))
    }
    function g() {
      z %= t.length;
      if (!t[z].task()) {
        var a = t[z].taskName;
        v = v.filter(function(b) {
          b.taskParent == a && t.push({
            taskName: b.taskName,
            task: b.task
          });
          return b.taskParent != a
        });
        h.dispatch("killed", t.splice(z--, 1)[0])
      }
      z++;
      y = (new Date).getTime() - x;
      return y <= u
    }
    function d() {
      m = !0;
      p = z = 0;
      w = x = (new Date).getTime();
      h.dispatch("start");
      h.dispatch("insertframe");
      b(f);
      return h
    }
    function a() {
      h.dispatch("stop");
      m = !1;
      return h
    }
    function i(a, b, c) {
      if ("function" != typeof a) throw Error('Task "' + b + '" is not a function');
      t.push({
        taskName: b,
        task: a
      });
      m = !(!m && !(c && d() || 1));
      return h
    }
    function c(a) {
      return a ? Object.keys(q).filter(function(a) {
        return !! q[a].on
      }).length: Object.keys(q).length
    }
    function j() {
      Object.keys(q).length ? (h.dispatch("startgenerators"), h.unbind("killed", o), b(function() {
        for (var a in q) q[a].on = !0,
        i(q[a].task, a, !1)
      }), h.bind("killed", o).runTasks()) : h.dispatch("stopgenerators");
      return h
    }
    function o(a) {
      if (void 0 != q[a.content.taskName]) q[a.content.taskName].del || !q[a.content.taskName].condition() ? delete q[a.content.taskName] : q[a.content.taskName].on = !1,
      0 == c(!0) && j()
    }
    sigma.classes.EventDispatcher.call(this);
    var h = this,
    m = !1,
    k = 80,
    n = 0,
    p = 0,
    r = 1E3 / k,
    u = r,
    y = 0,
    w = 0,
    x = 0,
    D = 0,
    q = {},
    t = [],
    v = [],
    z = 0;
    this.frequency = function(a) {
      return void 0 != a ? (k = Math.abs(1 * a), r = 1E3 / k, p = 0, h) : k
    };
    this.runTasks = d;
    this.stopTasks = a;
    this.insertFrame = b;
    this.addTask = i;
    this.queueTask = function(a, b, c) {
      if ("function" != typeof a) throw Error('Task "' + b + '" is not a function');
      if (!t.concat(v).some(function(a) {
        return a.taskName == c
      })) throw Error('Parent task "' + c + '" of "' + b + '" is not attached.');
      v.push({
        taskParent: c,
        taskName: b,
        task: a
      });
      return h
    };
    this.removeTask = function(b, c) {
      if (void 0 == b) t = [],
      1 == c ? v = [] : 2 == c && (t = v, v = []),
      a();
      else {
        var d = "string" == typeof b ? b: "";
        t = t.filter(function(a) {
          return ("string" == typeof b ? a.taskName == b: a.task == b) ? (d = a.taskName, !1) : !0
        });
        0 < c && (v = v.filter(function(a) {
          1 == c && a.taskParent == d && t.push(a);
          return a.taskParent != d
        }))
      }
      m = !(t.length && (!a() || 1));
      return h
    };
    this.addGenerator = function(a, b, d) {
      if (void 0 != q[a]) return h;
      q[a] = {
        task: b,
        condition: d
      };
      0 == c(!0) && j();
      return h
    };
    this.removeGenerator = function(a) {
      if (q[a]) q[a].on = !1,
      q[a].del = !0;
      return h
    };
    this.startGenerators = j;
    this.getGeneratorsIDs = function() {
      return Object.keys(q)
    };
    this.getFPS = function() {
      m && (n = Math.round(1E4 * (p / ((new Date).getTime() - w))) / 10);
      return n
    };
    this.getTasksCount = function() {
      return t.length
    };
    this.getQueuedTasksCount = function() {
      return v.length
    };
    this.getExecutionTime = function() {
      return x - w
    };
    return this
  };
  sigma.debugMode = 0;
  sigma.log = function() {
    if (1 == sigma.debugMode) for (var b in arguments) console.log(arguments[b]);
    else if (1 < sigma.debugMode) for (b in arguments) throw Error(arguments[b]);
    return sigma
  };
  sigma.easing = {
    linear: {},
    quadratic: {}
  };
  sigma.easing.linear.easenone = function(b) {
    return b
  };
  sigma.easing.quadratic.easein = function(b) {
    return b * b
  };
  sigma.easing.quadratic.easeout = function(b) {
    return - b * (b - 2)
  };
  sigma.easing.quadratic.easeinout = function(b) {
    return 1 > (b *= 2) ? 0.5 * b * b: -0.5 * (--b * (b - 2) - 1)
  };
  sigma.tools.drawRoundRect = function(b, f, g, d, a, i, c) {
	  f = f + 10;
    var i = i ? i: 0;
    var j = c ? c: [];
    c = i && (0 <= j.indexOf("topleft") || 0 <= j.indexOf("top") || 0 <= j.indexOf("left"));
    m = i && (0 <= j.indexOf("topright") || 0 <= j.indexOf("top") || 0 <= j.indexOf("right"));
    h = i && (0 <= j.indexOf("bottomleft") || 0 <= j.indexOf("bottom") || 0 <= j.indexOf("left"));
    j = i && (0 <= j.indexOf("bottomright") || 0 <= j.indexOf("bottom") || 0 <= j.indexOf("right"));
    
   
    b.moveTo(f , g + i - 12);
    b.lineTo(f + d, g + i -12);
    b.lineTo(f + d, g + i + 12);
    b.lineTo(f, g + i + 12);
    b.lineTo(f , g + i - 12);
    //c ? b.arcTo(f, g, f + i, g, i) : b.lineTo(f, g);
    //m ? (b.lineTo(f + d - i, g), b.arcTo(f + d, g, f + d, g + i, i)) : b.lineTo(f + d, g);
    //j ? (b.lineTo(f + d, g + a - i), b.arcTo(f + d, g + a, f + d - i, g + a, i)) : b.lineTo(f + d, g + a);
    //h ? (b.lineTo(f + i, g + a), b.arcTo(f, g + a, f, g + a - i, i)) : b.lineTo(f, g + a);
   
  };
  sigma.tools.getRGB = function(b, f) {
    var b = b.toString(),
    g = {
      r: 0,
      g: 0,
      b: 0
    };
    if (3 <= b.length && "#" == b.charAt(0)) {
      var d = b.length - 1;
      6 == d ? g = {
        r: parseInt(b.charAt(1) + b.charAt(2), 16),
        g: parseInt(b.charAt(3) + b.charAt(4), 16),
        b: parseInt(b.charAt(5) + b.charAt(5), 16)
      }: 3 == d && (g = {
        r: parseInt(b.charAt(1) + b.charAt(1), 16),
        g: parseInt(b.charAt(2) + b.charAt(2), 16),
        b: parseInt(b.charAt(3) + b.charAt(3), 16)
      })
    }
    f && (g = [g.r, g.g, g.b]);
    return g
  };
  sigma.tools.rgbToHex = function(b, f, g) {
    return sigma.tools.toHex(b) + sigma.tools.toHex(f) + sigma.tools.toHex(g)
  };
  sigma.tools.toHex = function(b) {
    b = parseInt(b, 10);
    if (isNaN(b)) return "00";
    b = Math.max(0, Math.min(b, 255));
    return "0123456789ABCDEF".charAt((b - b % 16) / 16) + "0123456789ABCDEF".charAt(b % 16)
  };
  sigma.publicPrototype = r.prototype
})();