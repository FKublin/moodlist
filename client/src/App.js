import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.css';
import Playlist from './components/Playlist';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {

  constructor(){
    super();
    const params = this.getHashParams();
    console.log(params);
    const token = params.access_token;
    let user_id = {id : ''};

    if (token) {
      spotifyApi.setAccessToken(token);
    }
  
    spotifyApi.getMe().then((result => { user_id.id = result.id;}))
    console.log(user_id);
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      id: user_id,
      playlist_uri: ''
    }
    console.log(this.state);
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
    //console.log(hashParams);
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
    this.setState({loggedIn : false, id : null, playlist_uri : '' }, () => {
      this.props.history.push("/");
    })
    

  }

  generatePlaylist(){
    //let id = spotifyApi.getMe().then((result) =>{return result.id});
    let seed = { limit: 10, acousticness : 0.0, danceability : 1.0, energy: 1.0, instrumentalness: 0, liveness : 0.0, loudness : -60 ,
       seed_genres: ["electronic", "drum-and-bass", "techno"], popularity: 50, speechiness : 0.5, min_tempo : 150, valence : 0.0 };

     spotifyApi.getRecommendations(seed).then((response) => {
       console.log(response);
      let tracks = [];
      response.tracks.forEach(track => {
        tracks.push(track.uri);
      })
      console.log(tracks)

      let options = {
        "name" : "Moodlist generated playlist",
        "public" : false   
      }

      spotifyApi.createPlaylist(this.state.id.id, options ).then((response) => {
        console.log("Playlist created")
        console.log(response.uri)
        var uri = response.uri;
        spotifyApi.addTracksToPlaylist(this.state.id.id, response.id, tracks)
        .then(response => {
          console.log(response);
          this.setState({ playlist_uri: uri})
        });
      });
    })
    .catch((error) => {console.log(error)});
  }

  render() {
    return (
      <div className="App">
        { !this.state.loggedIn &&
        <a href='http://localhost:8888' > Login to Spotify </a>
        }
        

        { this.state.loggedIn &&
        <div>

          <button onClick={() => this.generatePlaylist()}>
            Generate a playlist
          </button>
        
          <button onClick={() => this.logOut()}>
            Log out
          </button>
          
          <Playlist playlist_uri={this.state.playlist_uri} />
          </div>
        }

      </div>
    );
  }
}

export default withRouter(App);
