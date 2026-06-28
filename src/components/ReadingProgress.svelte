<script>
    let percentScrolled = $state(0);

    $effect(() => {
        const updateProgress = () => {
            const root = document.documentElement;
            const scrollableHeight = root.scrollHeight - root.clientHeight;
            percentScrolled =
                scrollableHeight > 0
                    ? Math.min(100, (root.scrollTop / scrollableHeight) * 100)
                    : 0;
        };
        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);
        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    });
</script>

<div
    class="reading-progress"
    style={`width:${percentScrolled}%`}
    aria-hidden="true"
></div>

<style>
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--text, #ededed);
        z-index: 50;
        transition: width 0.08s linear;
    }
</style>
