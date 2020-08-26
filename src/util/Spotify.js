export const Spotify = {
    clientId: "84aca04913e7465e83bca4b64b376ddb",
    redirectUri: "http://localhost:3000/",
    accessToken: '',
    resultArray: [],
    uid: '',
    getAccessToken() {
        if (this.accessToken.length > 1) {
            return this.accessToken;
        } else if (this.accessToken.length < 1 && !window.location.href.match(/access_token=([^&]*)/)) {
            window.location = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${this.redirectUri}`
        } else {
            this.accessToken = window.location.href.match(/access_token=([^&]*)/);
            let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
            window.setTimeout(() => this.accessToken = '', expiresIn[1] * 1000);
            window.history.pushState('Access Token', null, '/');
        }
    },
    search(term) {
        if (this.resultArray.length > 20) {
            this.resultArray = []
        }
        if (this.accessToken.length < 1) {
            this.getAccessToken()
        }
        let authToken = {
            headers: { Authorization: `Bearer ${this.accessToken[1]}` }
        }
        console.log(authToken)
        fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, authToken)
            .then(response => response.json())
            .then(data => {
                data.tracks.items.map(track => this.resultArray.push(track))
            })
            .catch(error => console.log(error))
        return this.resultArray
    },
    savePlaylist(playlistName, trackArray) {
        if (this.accessToken.length < 1) {
            this.getAccessToken()
        }
        let authToken = {
            headers: { Authorization: `Bearer ${this.accessToken[1]}` }
        }
        fetch(`https://api.spotify.com/v1/me`, authToken)
            .then(response => response.json())
            .then(data => {
                const otherData = {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.accessToken[1]}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: playlistName })
                }
                fetch(`https://api.spotify.com/v1/users/${data.id}/playlists`, otherData)
                    .then(response => response.json())
                    .then(data => {
                        const thisPlaylist = {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${this.accessToken[1]}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({uris: trackArray})
                        }
                        fetch(`https://api.spotify.com/v1/playlists/${data.id}/tracks`, thisPlaylist)
                    })
                    .catch(error => console.log(error))
            },
            )
            .catch(error => console.log(error))

    }
};

export default Spotify;

