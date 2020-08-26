import React from 'react';
import './Tracklist.css';
import {Track} from '../Track/Track.js'

export class Tracklist extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks: []
        }
    }
    render() {
        return (
        <div className="TrackList">
            {this.props.tracks.map(track => <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval}/>)}
        </div>
        )
    }
};

Tracklist.defaultProps = {
    tracks: []
};