<script lang="ts">
    export let videoId: string;
    export let startTime: string = '0';
    export let endTime: string | null = null;

    const videoServerUrl = 'http://localhost:3001'; // Adjust this to your video server URL
</script>

<div class="video-message">
    <iframe
        src="{videoServerUrl}/video-embed?id={videoId}&start={startTime}{endTime ? `&end=${endTime}` : ''}"
        width="100%"
        height="400"
        frameborder="0"
        allowfullscreen
    ></iframe>
</div>

<style>
    .video-message {
        margin: 0 342px;
        max-width: 100%; /* Ensure it doesn't exceed the parent width */
    }

    iframe {
        max-width: 100%; /* Ensure the iframe doesn't overflow its container */
    }
</style>