import React from "react";
import L from "leaflet";
import borderData from "./border.js";
import leafletPip from "@mapbox/leaflet-pip";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerPosition: { lat: 44.0286, lng: -72.7317 },
      oldMarkerPosition: { oldLat: 44.0886, oldLng: -72.7317 },
      minimumZoom: 18,
      maximumZoom: 18,
      defaultZoom: 18,
      gameStarted: false,
      borderData: L.geoJSON(borderData),
      currentPoint: { lat: 44.0286, lng: -72.7317 },
      randomCord: { lat: 44.0286, lng: -72.7317 }
    };

    // binding the functions to the state
    this.moveMapNorth = this.moveMapNorth.bind(this);
    this.moveMapSouth = this.moveMapSouth.bind(this);
    this.moveMapEast = this.moveMapEast.bind(this);
    this.moveMapWest = this.moveMapWest.bind(this);

    this.startGame = this.startGame.bind(this);
    this.quitGame = this.quitGame.bind(this);

    this.randomCord = this.randomCord.bind(this);

    this.randomLat = this.randomLat.bind(this);
    this.randomLong = this.randomLong.bind(this);
  }

  // startGame function generates a random point within the declared boundaires 
  startGame() {
    this.setState({
      gameStarted: true
    });
    if (this.state.gameStarted) {
      this.randomCord();
    }
  }

  // formula for generating the random coordinates 
  randomCord() {
    this.setState({
      gameStarted: true
    });
    let randomLat = this.randomLat();
    console.log(randomLat)
    let randomLong = this.randomLong();
    console.log(randomLong)
    let layerLength = leafletPip.pointInLayer(
      [randomLong, randomLat],
      this.state.borderData
    ).length;
    while (!layerLength) {
      randomLat = this.randomLat();
      randomLong = this.randomLong();
      layerLength = leafletPip.pointInLayer(
        [randomLong, randomLat],
        this.state.borderData
      ).length;
      this.setState({
        currentPoint: {lat:randomLat, lng:randomLong}
      })
    }

    this.map.panTo([randomLat, randomLong]);
  }

  // does not function at this time. TODO: activating removes gameStarted state
  quitGame() {
    this.setState({ gameStarted: this });
    if (this.state.gameStarted) {
      this.map.fitWorld([44.0286, -72.7317], 10);
    }
  }

  // checkVermontLocation() {
  //    { randomLat, randomLong } = this.state;
  // }

  randomLat() {
    let lat =
      Math.random() * (45.00541896831666 - 42.730315121762715) +
      42.730315121762715;
    return lat;
  }
  randomLong() {
    let long =
      Math.random() * (71.51022535353107 - 73.35218221090553) +
      73.35218221090553 * -1;
    return long;
  }

  moveMapNorth() {
    const { lat, lng } = this.state.currentPoint;
    this.setState({
      currentPoint: {
        lat: lat + 0.002,
        lng: lng + 0.0
      }
    });
  }

  moveMapSouth() {
    const { lat, lng } = this.state.currentPoint;
    this.setState({
      currentPoint: {
        lat: lat - 0.002,
        lng: lng + 0.0
      }
    });
  }
  moveMapEast() {
    const { lat, lng } = this.state.currentPoint;
    this.setState({
      currentPoint: {
        lat: lat + 0.0,
        lng: lng + 0.002
      }
    });
  }
  moveMapWest() {
    const { lat, lng } = this.state.currentPoint;
    this.setState({
      currentPoint: {
        lat: lat + 0.0,
        lng: lng - 0.002
      }
    });
  }

  componentDidMount() {
    document.querySelector("#score").textContent = `Your Score: 0`;
    this.map = L.map("map", {
      center: [this.state.currentPoint.lat, this.state.currentPoint.lng],
      // maxBounds: [44.0886, -72.7317],
      zoom: this.state.defaultZoom,
      layers: [
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          }
        )
      ]
    });

    this.marker = L.marker(this.state.markerPosition).addTo(this.map);
    this.borderData = L.geoJSON(borderData);
    this.borderData.addTo(this.map);
    const bounds = L.bounds(44.0886, -72.7317);
    this.map.setMinZoom(this.state.minimumZoom);
    this.map.setMaxZoom(this.state.maximumZoom);
    let layerLength = leafletPip.pointInLayer(
      this.state.currentPoint,
      this.borderData
    ).length;
    while (!layerLength) {
      let randomLat = this.randomLat();
      let randomLong = this.randomLong();
      this.setState({
        randomLat: randomLat,
        randomLong: randomLong
      });
      layerLength = leafletPip.pointInLayer(
        [this.state.randomLong, this.state.randomLat],
        this.borderData
      ).length;
    }
  }

  componentDidUpdate() {
    let { markerPosition, oldMarkerPosition, currentPoint } = this.state;
    if (markerPosition.lat !== markerPosition.oldLat) {
      console.log(
        `point is lat: ${this.state.currentPoint.lat} lon: ${
          this.state.currentPoint.lng
        }`
      );
      this.map.panTo(this.state.currentPoint);
    }
  }

  render() {
    return (
      <div>
        <div className="mainControls">
          <button onClick={this.randomCord} map={this.map}>
            {" "}
            Start Game!{" "}
          </button>
          <button onClick={this.makeGuess} map={this.map}>
            {" "}
            Make A Guess!{" "}
          </button>
          <button onClick={this.quitGame} map={this.map}>
            {" "}
            Quit Game!{" "}
          </button>
        </div>

        <div id="map"> </div>

        <div className="directionButtons">
          <button onClick={this.moveMapNorth} map={this.map}>
            {" "}
            Go North!{" "}
          </button>
          <button onClick={this.moveMapSouth} map={this.map}>
            {" "}
            Go South!{" "}
          </button>
          <button onClick={this.moveMapEast} map={this.map}>
            {" "}
            Go East!{" "}
          </button>
          <button onClick={this.moveMapWest} map={this.map}>
            {" "}
            Go West!{" "}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
