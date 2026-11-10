/* Decode the original GIF in the browser; no video conversion. */
AFRAME.registerComponent('animated-gif', {
    schema: { src: { type: 'asset' } },

    init: function () {
        this.frames = null;
        this.frameEnds = [];
        this.frameIndex = -1;
        this.startedAt = null;
        this.removed = false;
        this.request = new AbortController();
        this.loadGIF();
    },

    loadGIF: async function () {
        try {
            var response = await fetch(this.data.src, { signal: this.request.signal });
            if (!response.ok) throw new Error('GIF HTTP ' + response.status);
            var reader = new GifReader(new Uint8Array(await response.arrayBuffer()));
            if (this.removed) return;
            if (!reader.numFrames()) throw new Error('Le GIF ne contient aucune image.');

            var width = reader.width;
            var height = reader.height;
            var pixels = new Uint8ClampedArray(width * height * 4);
            var frames = [];
            var previous = null;
            var restored = null;
            var elapsed = 0;

            for (var i = 0; i < reader.numFrames(); i++) {
                // Restore the transparent background or the previous canvas as required.
                if (previous && previous.disposal === 2) {
                    for (var y = previous.y; y < previous.y + previous.height; y++) {
                        pixels.fill(0, (y * width + previous.x) * 4,
                            (y * width + previous.x + previous.width) * 4);
                    }
                } else if (previous && previous.disposal === 3 && restored) {
                    pixels.set(restored);
                }
                var info = reader.frameInfo(i);
                restored = info.disposal === 3 ? pixels.slice() : null;
                reader.decodeAndBlitFrameRGBA(i, pixels);
                frames.push(new ImageData(pixels.slice(), width, height));
                // GIF delays are stored in hundredths of a second (360 ms here).
                elapsed += info.delay > 0 ? info.delay * 10 : 100;
                this.frameEnds.push(elapsed);
                previous = info;
            }

            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');
            this.texture = new AFRAME.THREE.CanvasTexture(this.canvas);
            this.texture.colorSpace = AFRAME.THREE.SRGBColorSpace;
            this.texture.generateMipmaps = false;
            this.texture.minFilter = AFRAME.THREE.LinearFilter;
            this.texture.magFilter = AFRAME.THREE.LinearFilter;

            // A-Frame may not have created the plane mesh when GIF decoding finishes.
            var mesh = this.el.getObject3D('mesh');
            if (!mesh) {
                mesh = await new Promise((resolve, reject) => {
                    var el = this.el;
                    var timeout = setTimeout(() => {
                        el.removeEventListener('object3dset', onSet);
                        reject(new Error('Le plan 3D n\u2019a pas été initialisé.'));
                    }, 10000);
                    function onSet() {
                        var ready = el.getObject3D('mesh');
                        if (ready) {
                            clearTimeout(timeout);
                            el.removeEventListener('object3dset', onSet);
                            resolve(ready);
                        }
                    }
                    el.addEventListener('object3dset', onSet);
                    onSet();
                });
            }
            if (this.removed) return;
            mesh.material.map = this.texture;
            mesh.material.toneMapped = false;
            mesh.material.needsUpdate = true;
            this.duration = elapsed;
            this.frames = frames;
            this.drawFrame(0);
            this.el.emit('gif-loaded', {}, true);
        } catch (error) {
            if (!this.removed && error.name !== 'AbortError') {
                console.error('GIF AR:', error);
                this.el.emit('gif-error', { error: error }, true);
            }
        }
    },

    drawFrame: function (index) {
        if (index === this.frameIndex) return;
        this.context.putImageData(this.frames[index], 0, 0);
        this.texture.needsUpdate = true;
        this.frameIndex = index;
    },

    tick: function (time) {
        if (!this.frames || !this.el.parentEl.object3D.visible) return;
        if (this.startedAt === null) this.startedAt = time;
        // Use absolute elapsed time to avoid accumulating delays over successive loops.
        var elapsed = (time - this.startedAt) % this.duration;
        var index = 0;
        while (elapsed >= this.frameEnds[index]) index++;
        this.drawFrame(index);
    },

    remove: function () {
        this.removed = true;
        this.request.abort();
        if (this.texture) {
            var mesh = this.el.getObject3D('mesh');
            if (mesh && mesh.material.map === this.texture) mesh.material.map = null;
            this.texture.dispose();
        }
        this.frames = null;
    }
});
