import React, { Component } from 'react';
import Peer from 'peerjs';
import './App.css';

class App extends Component {
  state = {
    localID: "",
    remoteID: "",
    localSrc: "",
    remoteSrc: "",
    localStream: null
  };

  componentDidMount(){
    this.peer = new Peer({key: 'tx595d94dtlw61or'});

    this.peer.on('open', (id) => {
      console.log("My peer ID: " + id);
      this.setState({localID: id});
    });

    this.peer.on('call', (call) => {
      console.log("Received call");
      console.log(call);
      call.on('stream', (stream) => {
        if (window.URL) {
          this.setState({remoteSrc: window.URL.createObjectURL(stream)});
        } else  {
          this.setState({remoteSrc: stream});
        }
        console.log("RECEIVED");
      });
      call.answer(this.state.localStream);
    });

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUsermedia;
    const constrains = {
      audio: false,
      video: true
    };
    navigator.getUserMedia(constrains, this.videoHander, this.errorHandler);
  }

  videoHander = (stream) => {
    if (window.URL) {
      this.setState({localSrc: window.URL.createObjectURL(stream)});
    } else  {
      this.setState({localSrc: stream});
    }
    this.setState({localStream: stream});
  };
  errorHandler = (error) => {
    console.log(error)
  };

  callPeer = () => {
    if (this.state.remoteID !== "") {
      console.log(`calling peer ${this.state.remoteID}`);
      const call = this.peer.call(this.state.remoteID, this.state.localStream);
      call.on('stream', (stream) => {
        if (window.URL) {
          this.setState({remoteSrc: window.URL.createObjectURL(stream)});
        } else  {
          this.setState({remoteSrc: stream});
        }
        console.log("RECEIVED");
      });
    }
  };

  updateRemoteID = (event) => {
    this.setState({remoteID: event.target.value});
  };

  render() {
    return (
      <div className="app">
        <ul>
          <li>
            <video className="local" src={this.state.localSrc} autoPlay/>
          </li>
          <li>
            local ID: <input type="text" value={this.state.localID}/>
          </li>
          <li><hr/></li>
          <li>
            <video className="remote" src={this.state.remoteSrc} autoPlay/>
          </li>
          <li>remote -- {this.state.remoteSrc}</li>
          <li>
            remote ID: <input onChange={this.updateRemoteID} type="text"/>
          </li>
          <li><button onClick={this.callPeer}>Call</button></li>
        </ul>
      </div>
    );
  }
}

export default App;
