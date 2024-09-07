ffmpeg -i input_video.mp4 -vf "fps=10,scale=900:-1,setpts=0.6*PTS" output.gif

- scale=900:-1 
    - means width of 900, matches original aspect ratio
- setpts=0.6*PTS
    - means change duration to 0.6 times the original duration (eg 10s becomes 6s or 40% faster)