import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../..//util/Spotify.js';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  };
  handlePlaylistChange(newPlaylist) {
    this.setState({
      playlistTracks: newPlaylist
    }, () => {console.log(this.state.playlistTracks)})
  }
  addTrack(track) {
    console.log(track)
    if ((this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) === track.id) {
      return
    } else {
      let newPlaylist = [...this.state.playlistTracks, track]
      console.log(newPlaylist)
      this.handlePlaylistChange(newPlaylist)
    };
  };
  handlePlaylistRemove(newPlaylist) {
    this.setState(
      {
        playlistTracks: newPlaylist
      }
    )
  }
  removeTrack(track) {
      let newPlaylist = this.state.playlistTracks.filter(thisTrack => (thisTrack.id !== track.id))
      this.handlePlaylistRemove(newPlaylist)
  };
  updatePlaylistName(name) {
    this.setState( {
      playlistName: name
    })
  };
  async savePlaylist() {
    const uriArray = []
    const mapUris = await this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, mapUris)
    this.setState(
      {
        searchResults: [],
        playlistName: '',
        playlistTracks: []
      }
    )
  };
  async search(searchTerm) {
    let thisSearchResults = await Spotify.search(searchTerm)
    this.setState(
      {
        searchResults: thisSearchResults
      }
    )
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
    </div>
    )
  }
}
export default App;
