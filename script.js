class Germs {
    // setting the co-ordinates, radius and the
    // speed of a particle in both the co-ordinates axes.
      constructor() {
        this.x = random(0,width);
        this.y = random(0,height);
        this.r = random(1,8);
        this.xSpeed = random(-2,2);
        this.ySpeed = random(-1,1.5);
      }
    
    // creation of germs.
      createGerms() {
        noStroke();
        fill('rgba(20,169,169,0.5)');
        circle(this.x,this.y,this.r);
      }
    
    // setting the particle in motion.
      moveGerms() {
        if(this.x < 0 || this.x > width)
          this.xSpeed*=-1;
        if(this.y < -0 || this.y > height)
          this.ySpeed*=-1
        this.x+=this.xSpeed;
        this.y+=this.ySpeed;
      }
    
    // this function creates the connections(lines)
    // between particles which are less than a certain distance apart
      joinGerms(germs) {
       germs.forEach(element =>{
          let dis = dist(this.x,this.y,element.x,element.y);
          if(dis<85) {
            stroke('rgba(255,255,255,0.04)');
            line(this.x,this.y,element.x,element.y);
          }
        });
      }
    }
      
    var mapimg;
    
    var centerlat = 0;
    var centerlon = 0;
    
    var lat = 0;
    var lon = 0;
    
    var zoom = 1;
    var covid19;
    
    let canvasWidth = 1024
    let canvasHeight = 600
    
    
    let germs = [];
    
    
    function preload() {
      mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-89.5129,33.7761,3.09,0/1024x600?access_token=pk.eyJ1IjoibW9uaWNhMTMiLCJhIjoiY2t3MWViOWZnMDhvdzJwbzNtbHhkZHM1cyJ9.bbxLioc78ppUpy01Q3YAKw');
      
      death = loadTable('data/all-states-history (1).csv', 'csv', 'header')
    
      covid19 = loadStrings('data/all-states-history (1).csv');
    
    }
    
    
    // change the latitude and longitude to xpos and ypos, get help from https://en.wikipedia.org/wiki/Web_Mercator_projection
    
    function webmercX(lon) {
      lon = radians(lon);
      var a = (256 / PI) * pow(2, zoom);
      var b = lon + PI;
      return a * b;
    }
    
    function webmercY(lat) {
      lat = radians(lat);
      var c = (256 / PI) * pow(2, zoom);
      var d = tan(PI / 4 + lat / 2);
      var e = PI - log(d);
      return c * e;
    }
    // https://www.geeksforgeeks.org/p5-js-changed-function/
    
    function setup() {
      createCanvas(canvasWidth, canvasHeight);
      
      for(let i = 0;i< canvasWidth/10;i++){
        germs.push(new Germs());
      }
    
      cCheckbox = createCheckbox('Positive Case', false);
      cCheckbox.position(20, 10)
      cCheckbox.changed(cChanged);
    
      dCheckbox = createCheckbox('Death', false);
      dCheckbox.position(130, 10)
      dCheckbox.changed(dChanged);
    
    
    resetBtn = 
          createButton("Reset Germs");
        resetBtn.position(windowWidth/4, 10);
        resetBtn.mousePressed(resetAnimation);
    
      translate(width / 2, height / 2);
      imageMode(CENTER);
      image(mapimg, 0, 0);
    }
    
    
    //Positive Cases == red
    function cChanged() {
      translate(width /2, height / 2);
      var cx = webmercX(centerlon);
      var cy = webmercY(centerlat);
    
      for (var i = 0; i < covid19.length; i++) {
        var data = covid19[i].split(/,/);
    
        var lat = data[5];
        var lon = data[6];
        var confirmed = data[7];
        var x = webmercX(lon) - cx;
        var y = webmercY(lat) - cy;
    
        if (this.checked()) {
          var maxconfirmed = log(confirmed) * 2;
          confirmed = pow(1, confirmed);
          var r = map(confirmed, 0, maxconfirmed, 0, 100);
          strokeWeight(2);
          stroke(255, 255, 255, 6);
    
        
          fill(255, 33, 33, 100);
          ellipse(x, y, r, r);
        } else {
          clear()
          //since after clear(), the map image disappear as well, so I call it again.
          imageMode(CENTER);
          image(mapimg, 0, 0);
        }
      }
    }
    
    
    //Death == black
    function dChanged() {
      translate(width / 2, height / 2);
      var cx = webmercX(centerlon);
      var cy = webmercY(centerlat);
    
      for (var i = 0; i < covid19.length; i++) {
        var data = covid19[i].split(/,/);
    
        var lat = data[5];
        var lon = data[6];
        var deaths = data[8];
        var x = webmercX(lon) - cx;
        var y = webmercY(lat) - cy;
    
        if (this.checked()) {
          var maxdeaths = log(deaths) * 2;
          deaths = pow(1, deaths);
          var r1 = map(deaths, 0, maxdeaths, 0, 100);
          strokeWeight(2);
          stroke(255, 255, 255, 6);
          fill(0, 33, 33, 100);
          ellipse(x, y, r1, r1);
        } else {
          clear()
          imageMode(CENTER);
          image(mapimg, 0, 0);
        }
      }
    }
    
    
    
    
    
    
    function draw() {
      rectMode(CENTER);
      noStroke();
      fill(255, 200, 200);
      rect(0, 0, canvasWidth, canvasHeight/6);
      noStroke();
      fill(0);
      textAlign(CENTER);
      textSize(15);
      text('Covid-19 US', width/2.5, 25);
      
      for(let i = 0;i<germs.length;i++) {
        germs[i].createGerms();
        germs[i].moveGerms();
        germs[i].joinGerms(germs.slice(i));
      }
    }
    
    
    
    function resetAnimation() {
    
          clear()
          imageMode(CENTER);
          image( mapimg, 0, 0);
    }