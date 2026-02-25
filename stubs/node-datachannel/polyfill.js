// Stub polyfill for @ipshipyard/node-datachannel/polyfill
// Provides no-op WebRTC classes for environments where native WebRTC is not needed

class RTCPeerConnection {
  close() {}
  createDataChannel() {
    return new RTCDataChannel();
  }
  createOffer() {
    return Promise.resolve({});
  }
  createAnswer() {
    return Promise.resolve({});
  }
  setLocalDescription() {
    return Promise.resolve();
  }
  setRemoteDescription() {
    return Promise.resolve();
  }
  addIceCandidate() {
    return Promise.resolve();
  }
  addEventListener() {}
  removeEventListener() {}
}

class RTCSessionDescription {
  constructor(init) {
    this.type = init?.type ?? '';
    this.sdp = init?.sdp ?? '';
  }
}

class RTCIceCandidate {
  constructor(init) {
    this.candidate = init?.candidate ?? '';
    this.sdpMid = init?.sdpMid ?? null;
    this.sdpMLineIndex = init?.sdpMLineIndex ?? null;
  }
}

class RTCDataChannel {
  readyState = 'closed';
  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
}

class RTCDataChannelEvent {
  constructor(type, init) {
    this.type = type;
    this.channel = init?.channel ?? null;
  }
}

export {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  RTCDataChannel,
  RTCDataChannelEvent,
};
