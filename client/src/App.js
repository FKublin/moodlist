import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
        console.log('Checked');
      })
  }

  logOut(){
    this.setState({loggedIn : false}, () => {
      this.props.history.push("/");
    })
    

  }

  generatePlaylist(){
    var seed = { limit: 10, min_energy: 0.4, seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'], min_popularity: 50 };
    spotifyApi.getRecommendations(seed).then((response) => {
      console.log(response)
    })
  }

  render() {
    return (
      <div className="App">
        { !this.state.loggedIn &&
        <a href='http://localhost:8888' > Login to Spotify </a>
        }
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt="Placeholder"/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }

        { this.state.loggedIn &&
          <button onClick={() => this.generatePlaylist()}>
            Generate a playlist
          </button>
        }

        { this.state.loggedIn &&
          <button onClick={() => this.logOut()}>
            Log out
          </button>
        }
      </div>
    );
  }
}

export default withRouter(App);
