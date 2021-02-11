const Peer = window.Peer;

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const localId = document.getElementById('js-local-id');
  const callTrigger = document.getElementById('js-call-trigger');
  const closeTrigger = document.getElementById('js-close-trigger');
  const remoteVideo = document.getElementById('js-remote-stream');
  const remoteId = document.getElementById('js-remote-id');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');

  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();

  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: true,
    })
    .catch(console.error);

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  // await localVideo.play().catch(console.error);

  const peer = (window.peer = new Peer({
    key: 'f89049b2-d19b-40f4-8bb0-8e0adc710bf4',
    debug: 3,
  }));

  // Register caller handler
  callTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    const mediaConnection = peer.call(remoteId.value, localStream);

    mediaConnection.on('stream', async stream => {
      // Render remote stream for caller
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      await remoteVideo.play().catch(console.error);
    });

    mediaConnection.once('close', () => {
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
    });

    closeTrigger.addEventListener('click', () => mediaConnection.close(true));
  });

  peer.once('open', id => (localId.textContent = id));

  // Register callee handler
  peer.on('call', mediaConnection => {
    mediaConnection.answer(localStream);

    mediaConnection.on('stream', async stream => {
      // Render remote stream for callee
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      await remoteVideo.play().catch(console.error);
    });

    mediaConnection.once('close', () => {
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
    });

    closeTrigger.addEventListener('click', () => mediaConnection.close(true));
  });

  peer.on('error', console.error);
})();

//マウスストーカー
const content = document.getElementById('js-remote-stream');
const item = document.getElementById('item');
$(content)
  .mousemove(function(e){
    item.style.transform = 'translate(' + e.pageX + 'px, ' + e.pageY + 'px)';
  })
  .touchmove(function(e){
    e.preventDefault();
    item.style.transform = 'translate(' + e.pageX + 'px, ' + e.pageY + 'px)';
  });



let video = document.getElementById('js-remote-stream');
var video_w = video.clientWidth;
var video_h = video.clientHeight;

$(window).resize(function(){
  // let video = document.getElementById('js-remote-stream');
  video_w = video.clientWidth;
  video_h = video.clientHeight;
});

//マウス座標取得
$("#js-remote-stream").mousemove(function(e){
  var str = "X座標：" + e.offsetX + '/' + video_w + " Y座標：" + e.offsetY + '/' + video_h;
  document.getElementById("area1").innerText = str;
});
