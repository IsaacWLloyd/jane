<script lang="ts">
    export let videoId: string;
    export let startTime: string = '0';
    export let endTime: string | null = null;

    const videoServerUrl = 'http://localhost:3001'; // Adjust this to your video server URL
</script>

<div class="video-message">
    <iframe
        src="{videoServerUrl}/video-embed?id={videoId}&start={startTime}{endTime ? `&end=${endTime}` : ''}"
        width="712"
        height="400"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>

<style>
    .video-message {
        padding: 0px 128px;
    }
</style>
