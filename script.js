let videoCam = document.querySelector(".video");
let recordingButton = document.querySelector(".record-action-container");
let recordBtn = document.querySelector(".record-btn");
let captureActionContainer= document.querySelector('.capture-action-container')
let timer= document.querySelector('.timer')
let chunks = [];
let toggleRecord= false;

const accessVideo = async () => {
  // The navigator object provides information about the browser's environment and capabilities.
  //    The MediaDevices interface of the Media Capture and Streams API provides access to connected media input devices like cameras and microphones, as well as screen sharing. In essence, it lets you obtain access to any hardware source of media data.
  const vidStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  videoCam.srcObject = vidStream;

  const mediaRecorder = new MediaRecorder(vidStream);
  mediaRecorder.addEventListener('start', ()=>{
    chunks=[];

  })
  mediaRecorder.addEventListener('stop', ()=>{
    const blob = new Blob(chunks, { type: 'video/mp4' });
    const videoURL = window.URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href= videoURL
    a.download= 'video.mp4';
    a.click();
  })

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  recordingButton.addEventListener("click", () => {
    timer.classList.toggle('display')

   Recording(mediaRecorder);
  });

};
accessVideo();


function Recording(MediaRecorder) {
  toggleRecord= !toggleRecord;
  if(toggleRecord){
  MediaRecorder.start();
  recordBtn.classList.toggle('record-animation')
  startTimmer();
  }
  else{
    MediaRecorder.stop();
    recordBtn.classList.toggle('record-animation')
    startTimmer();
  }
  
}

captureActionContainer.addEventListener('click',()=>{
     const canvas= document.createElement('canvas');
  // Get the 2D context of the canvas
  const context = canvas.getContext('2d');

  // Draw the current frame of the video onto the canvas
  context.drawImage(videoCam, 0, 0, canvas.width, canvas.height);
  
  // You can now use the data URL or perform further actions with the captured image
  const capturedImage = canvas.toDataURL('image/jpeg');
  console.log('Captured Image:', capturedImage);

  const a = document.createElement('a')
  a.href= capturedImage
  a.download= 'img.jpeg';
  a.click();
})

let timmerID;
let counter=1;

function startTimmer(){
  if(toggleRecord){
     //start timmer
      function displayTimmer(){

        let totalSeconds= counter

        let hour = parseInt(totalSeconds/3600);
        totalSeconds= totalSeconds%3600;
    
        let min= parseInt(totalSeconds/60);
        totalSeconds= totalSeconds%60
    
        let second = totalSeconds
         
        hour=  hour <10 ? `0${hour}` : `${hour}`
        min=  min <10 ? `0${min}` : `${min}`
        second=  second <10 ? `0${second}` : `${second}`
        
      
        timer.innerText = `${hour}:${min}:${second}`
    

        counter++;
       }
     
   timmerID=  setInterval(displayTimmer,1000)
  }
  else{
    //stop timmer
    
    clearInterval(timmerID)
    timer.innerText= '00:00:00';
    counter=0;
    
  }
}