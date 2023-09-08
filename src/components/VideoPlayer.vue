<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
    <VideoTrimmer :video-duration="videoDuration" :frames="frames" v-if="playerLoaded"/>
  </div>
</template>

<script>
import videojs from 'video.js';
import VideoTrimmer from "@/components/VideoTrimmer";
import { mapActions } from 'vuex';

export default {
  name: 'VideoPlayer',
  components: {
    VideoTrimmer
  },
  props: {
    sources: {
      type: Array,
      default: () => [
        {
          src: 'https://cdn.realync.com/transcoded-videos-stg/720_f4571304-de10-47d8-9104-9f5a6657856261e6cc26fe1c5b130090f01a/720_f4571304-de10-47d8-9104-9f5a6657856261e6cc26fe1c5b130090f01a_720_mc.mp4',
          type: 'video/mp4'
        }
      ],
    }
  },
  data () {
    return {
      player: null,
      canvas: null,
      context: null,
      numFrames: 12,
      videoDuration: 21.233333,
      frames: [],
      playerLoaded: false
    };
  },
  methods: {
    ...mapActions('frames', ['setVideoFrames']),
    extractFrames () {
      // Create a new video element
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.volume = 0.75;
      video.src = this.sources[0]?.src;
      video.play();
      const frames = [];

      // Handle the 'durationchange' event
      const handleDurationChange = () => {
        const duration = video.duration;
        const interval = duration / this.numFrames;
        let currentTime = 0;

        // Create a canvas element to draw the frames on
        const actualVideoHeight = video.videoHeight;
        const actualVideoWidth = video.videoWidth;
        const thumbnailWidth = 200;
        const thumbnailHeight = (thumbnailWidth / actualVideoWidth) * actualVideoHeight;
        this.canvas.width = thumbnailWidth;
        this.canvas.height = thumbnailHeight;

        // Extract frames from the video
        const extractFrame = () => {
          if (currentTime > duration || frames.length === this.numFrames) {
            video.currentTime = 0;
            return;
          }
          currentTime += interval;
          video.currentTime = currentTime;
          this.context.drawImage(video, 0, 0, thumbnailWidth, thumbnailHeight);
          const dataUrl = this.canvas.toDataURL();

          this.frames.push(dataUrl);
          if(this.frames.length === this.numFrames) {
            this.playerLoaded = true;
          }
          this.setVideoFrames(dataUrl);
          video.requestVideoFrameCallback(extractFrame);
        };
        video.requestVideoFrameCallback(extractFrame);
        video.currentTime = 0;
      };

      video.addEventListener('durationchange', handleDurationChange);
    },
  },
  mounted () {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.player = videojs(this.$refs.videoPlayer, {
      controls: true,
      autoplay: false,
      sources: [
        {
          src: 'https://cdn.realync.com/transcoded-videos-stg/720_f4571304-de10-47d8-9104-9f5a6657856261e6cc26fe1c5b130090f01a/720_f4571304-de10-47d8-9104-9f5a6657856261e6cc26fe1c5b130090f01a_720_mc.mp4',
          type: 'video/mp4'
        }
      ]
    });
    this.extractFrames();
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style scoped lang="scss">
  .video-js {
    height: 500px;
    width: 50%;
  }
</style>