<template>
  <div>
    <video ref="videoPlayer" class="video-js" id="video-trimmer"></video>
    <VideoTrimmer :video-duration="videoDuration" :frames="frames" v-if="playerLoaded" :player="player"/>
  </div>
</template>

<script>
import videojs from 'video.js';
require('videojs-offset');
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
          src: 'https://cdn.realync.com/transcoded-videos-stg/1080_0fc074dc-d84a-4841-9061-27b5f925011a/1080_0fc074dc-d84a-4841-9061-27b5f925011a_1080_mc.mp4',
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
      numFrames: 10,
      videoDuration: 0,
      frames: [],
      playerLoaded: false
    };
  },
  methods: {
    ...mapActions('frames', ['setVideoFrames']),
    extractFrames () {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.volume = 0.75;
      video.src = this.sources[0]?.src;
      video.play();
      const frames = [];

      const handleDurationChange = () => {
        const duration = video.duration;
        const interval = duration / this.numFrames;
        let currentTime = 0;
        this.videoDuration = video.duration;

        const actualVideoHeight = video.videoHeight;
        const actualVideoWidth = video.videoWidth;
        const thumbnailWidth = 350;
        const thumbnailHeight = (thumbnailWidth / actualVideoWidth) * actualVideoHeight;
        this.canvas.width = thumbnailWidth;
        this.canvas.height = thumbnailHeight;

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
      sources: this.sources
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