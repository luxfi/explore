// Stub for @ipshipyard/node-datachannel
// Native WebRTC module not needed for Lux blockchain explorer

class PeerConnection {
  close() {}
  setLocalDescription() {}
  setRemoteDescription() {}
  addRemoteCandidate() {}
  createDataChannel() {
    return {};
  }
  onLocalDescription() {}
  onLocalCandidate() {}
  onStateChange() {}
  onGatheringStateChange() {}
  onDataChannel() {}
}

class IceUdpMuxListener {
  close() {}
}

export { PeerConnection, IceUdpMuxListener };
export default {};
