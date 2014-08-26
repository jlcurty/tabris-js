tabris.load(function() {

  function example(ctx, width, height) {
    var cx = Math.floor(width / 3);
    var cy = Math.floor(height / 2);
    var unit = width / 12;
    var angle = 0;
    var timerId = null;

    ctx.font = '18px sans-serif';
    ctx.lineJoin = 'round';

    function draw() {
      clear();
      drawAxes();
      drawSine(angle);
      drawCircle(angle);
      drawLever(angle);
      drawFpsLabel();
      speedometer.update();
      angle += Math.PI / 90;
      // cancel pending timer and schedule
      clearTimeout(timerId);
      timerId = setTimeout(draw, 0);
    }

    function clear() {
      // TODO: ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
    }

    function drawAxes() {
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // x and y axes
      ctx.moveTo(cx - 3 * unit, cy);
      ctx.lineTo(cx + 2.25 * Math.PI * unit, cy);
      ctx.moveTo(cx, cy - 1.5 * unit);
      ctx.lineTo(cx, cy + 1.5 * unit);
      // x axis ticks
      ctx.moveTo(cx + Math.PI * unit, cy - 5);
      ctx.lineTo(cx + Math.PI * unit, cy + 5);
      ctx.moveTo(cx + 2 * Math.PI * unit, cy - 5);
      ctx.lineTo(cx + 2 * Math.PI * unit, cy + 5);
      // y axis ticks
      ctx.moveTo(cx - 5, cy + unit);
      ctx.lineTo(cx + 5, cy + unit);
      ctx.moveTo(cx - 5, cy - unit);
      ctx.lineTo(cx + 5, cy - unit);
      ctx.stroke();
      ctx.fillStyle = "#aaa";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText('π', cx + Math.PI * unit, cy + 8);
      ctx.fillText('2π', cx + 2 * Math.PI * unit, cy + 8);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText('1', cx + 8, cy - unit);
      ctx.fillText('-1', cx + 8, cy + unit);
    }

    function drawSine(t) {
      var x, y;
      var steps = 50;
      ctx.beginPath();
      ctx.moveTo(cx, cy + Math.sin(t) * unit);
      for (var i = 0; i <= steps; i++) {
        x = i * 2 * Math.PI / steps;
        y = Math.sin(t + x);
        ctx.lineTo(cx + x * unit, cy + y * unit);
      }
      ctx.strokeStyle = '#fa0';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function drawCircle() {
      var ccx = cx - 1.5 * unit;
      ctx.strokeStyle = '#0af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ccx, cy, unit, 0, 2 * Math.PI);
      ctx.stroke();
    }

    function drawLever(t) {
      var ccx = cx - 1.5 * unit;
      var x = ccx + Math.cos(t) * unit;
      var y = cy + Math.sin(t) * unit;
      ctx.strokeStyle = '#0af';
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // lines
      ctx.moveTo(x, y);
      ctx.lineTo(cx, y);
      ctx.moveTo(ccx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      // hinges
      ctx.lineWidth = 1;
      ctx.beginPath();
      var radius = 3;
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.moveTo(cx + radius / 2, y);
      ctx.arc(cx, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    function drawFpsLabel() {
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = '#000';
      ctx.lineWidth = 1;
      // TODO concat only needed on Rhino
      ctx.fillText("FPS: ".concat(speedometer.fps.toFixed(1)), 10, 10);
    }

    var speedometer = {
      start: 0,
      count: 0,
      fps: 0,
      update: function() {
        var now = Date.now();
        var time = now - this.start;
        this.count++;
        if (this.start === 0) {
          this.start = now;
        } else if (time >= 1000) {
          this.fps = this.count / (time / 1000);
          this.start = now;
          this.count = 0;
        }
      }
    };

    draw();
  }

  var page = tabris.createPage({
    title: "Animation",
    topLevel: true
  });

  var canvas = page.append("Canvas", {
    layoutData: {left: 10, top: 10, right: 10, bottom: 10}
  });

  // TODO hook into resize function on canvas
  tabris._shell.on("Resize", function() {
    // obtain real size from canvas
    var width = 500;
    var height = 250;
    var ctx = tabris.getContext(canvas, width, height);
    example(ctx, width, height);
  });

});