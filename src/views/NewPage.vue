<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { HandWrite } from "handWrite-js";

const domRef = ref();
let handWrite = new HandWrite();

onMounted(() => {
    handWrite.mount?.(domRef.value);
});

onUnmounted(() => {
    handWrite?.unmount?.();
    handWrite = undefined;
});
</script>

<template>
    <div style="display: inline-block; border: 1px solid #ccc">
        <div ref="domRef" style="width: 300px; height: 500px" />
    </div>
</template>
