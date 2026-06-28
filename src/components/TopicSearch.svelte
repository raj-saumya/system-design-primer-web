<script>
    let { items = [], placeholder = "Search topics…" } = $props();

    let query = $state("");
    let activeTags = $state(new Set());

    $effect(() => {
        const deepLinkQuery = new URLSearchParams(window.location.search).get(
            "q",
        );
        if (deepLinkQuery) query = deepLinkQuery;
    });

    const allTags = $derived(
        [...new Set(items.flatMap((item) => item.tags))].sort(),
    );

    const filteredItems = $derived(
        items.filter((item) => {
            const term = query.trim().toLowerCase();
            const matchesTerm =
                !term ||
                item.title.toLowerCase().includes(term) ||
                item.excerpt.toLowerCase().includes(term) ||
                item.tags.some((tag) => tag.toLowerCase().includes(term));
            const matchesTags =
                activeTags.size === 0 ||
                item.tags.some((tag) => activeTags.has(tag));
            return matchesTerm && matchesTags;
        }),
    );

    const toggleTag = (tag) => {
        const next = new Set(activeTags);
        next.has(tag) ? next.delete(tag) : next.add(tag);
        activeTags = next;
    };

    const clearAll = () => {
        activeTags = new Set();
        query = "";
    };
</script>

<div class="search">
    <div class="search-bar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            />
            <line
                x1="16.5"
                y1="16.5"
                x2="21"
                y2="21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            />
        </svg>
        <input
            type="search"
            bind:value={query}
            {placeholder}
            aria-label="Search topics"
        />
        {#if query || activeTags.size}
            <button class="clear" type="button" onclick={clearAll}>Clear</button
            >
        {/if}
    </div>

    <div class="tags">
        {#each allTags as tag}
            <button
                type="button"
                class="chip"
                class:is-active={activeTags.has(tag)}
                aria-pressed={activeTags.has(tag)}
                onclick={() => toggleTag(tag)}>{tag}</button
            >
        {/each}
    </div>

    <p class="result-count">
        {filteredItems.length}
        {filteredItems.length === 1 ? "topic" : "topics"}
    </p>

    <ul class="feed">
        {#each filteredItems as item, index}
            <li>
                <a href={item.url}>
                    <span class="feed-num"
                        >{String(index + 1).padStart(2, "0")}</span
                    >
                    <span class="feed-body">
                        <span class="label">{item.label}</span>
                        <span class="feed-title">{item.title}</span>
                        <p class="feed-excerpt">{item.excerpt}</p>
                    </span>
                    <span class="feed-meta">{item.minutes} min read</span>
                </a>
            </li>
        {/each}
        {#if filteredItems.length === 0}
            <li class="empty">
                No topics match. Try a different term or clear the filters.
            </li>
        {/if}
    </ul>
</div>

<style>
    .search {
        margin-top: 1.5rem;
    }
    .search-bar {
        display: flex;
        align-items: center;
        gap: 0.7rem;
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 0.7rem 1rem;
        background: var(--surface);
    }
    .search-bar:focus-within {
        border-color: var(--text);
    }
    .search-bar svg {
        color: var(--faint);
        flex: none;
    }
    .search-bar input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text);
        font: inherit;
        font-size: 1rem;
    }
    .clear {
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        font: inherit;
        font-size: 0.85rem;
        text-decoration: underline;
        padding: 0;
    }
    .clear:hover {
        color: var(--text);
    }
    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0 0.25rem;
    }
    .result-count {
        margin: 1rem 0 0;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--faint);
    }
    .empty {
        padding: 1.5rem 0.25rem;
        color: var(--muted);
        border-top: 1px solid var(--line);
    }
    .feed {
        list-style: none;
        margin: 1.5rem 0 0;
        padding: 0;
    }
    .feed li {
        border-top: 1px solid var(--line);
    }
    .feed li:last-child {
        border-bottom: 1px solid var(--line);
    }
    .feed a {
        display: grid;
        grid-template-columns: 2.2rem 1fr auto;
        gap: 1.1rem;
        align-items: baseline;
        padding: 1.4rem 0.25rem;
    }
    .feed a:hover .feed-title {
        box-shadow: inset 0 -2px 0 var(--text);
    }
    .feed-num {
        font-style: italic;
        color: var(--faint);
        font-size: 1rem;
    }
    .feed-body .label {
        display: block;
        margin-bottom: 0.35rem;
    }
    .feed-title {
        font-weight: 700;
        font-size: 1.35rem;
        line-height: 1.25;
    }
    .feed-excerpt {
        color: var(--muted);
        font-size: 0.98rem;
        margin: 0.4rem 0 0;
    }
    .feed-meta {
        color: var(--faint);
        font-size: 0.8rem;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
    }
    @media (max-width: 560px) {
        .feed a {
            grid-template-columns: 1fr;
            gap: 0.3rem;
        }
        .feed-num,
        .feed-meta {
            display: none;
        }
    }
</style>
