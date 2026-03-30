import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function InfiniteScrollList() {
    // 1. State for data, loading, and pagination
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // 2. Ref to keep track of the IntersectionObserver instance
    const observer = useRef();

    // 3. Mock API fetch function
    const fetchItems = (pageNumber) => {
        setIsLoading(true);

        // Simulating a network request delay
        setTimeout(() => {
            const newItems = Array.from({ length: 20 }, (_, i) => `Item ${(pageNumber - 1) * 20 + i + 1}`);
            setItems((prevItems) => [...prevItems, ...newItems]);

            // Assume the backend tells us there are no more items after page 5
            if (pageNumber >= 5) {
                setHasMore(false);
            }
            setIsLoading(false);
        }, 1000);
    };

    // Trigger fetch when 'page' changes
    useEffect(() => {
        fetchItems(page);
    }, [page]);

    // 4. Callback Ref for the very last element in the list
    const lastItemRef = useCallback(
        (node) => {
            // Don't trigger another fetch if we are currently loading
            if (isLoading) return;

            // Disconnect the previous observer so we don't have multiple listeners
            if (observer.current) observer.current.disconnect();

            // Create a new observer
            observer.current = new IntersectionObserver((entries) => {
                // entries[0] represents the node we are observing
                if (entries[0].isIntersecting && hasMore) {
                    // The last element is visible! Increment the page.
                    setPage((prevPage) => prevPage + 1);
                }
            });

            // If a node was passed in, start observing it
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Infinite Scroll Example</h2>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item, index) => {
                    // 5. Attach the ref conditionally to the last item
                    if (items.length === index + 1) {
                        return (
                            <li ref={lastItemRef} key={item} style={listItemStyle}>
                                {item}
                            </li>
                        );
                    } else {
                        return (
                            <li key={item} style={listItemStyle}>
                                {item}
                            </li>
                        );
                    }
                })}
            </ul>

            {/* Loading indicator */}
            {isLoading && <p style={{ textAlign: 'center' }}>Loading more items...</p>}

            {/* End of list indicator */}
            {!hasMore && <p style={{ textAlign: 'center' }}>You have reached the bottom!</p>}
        </div>
    );
}

const listItemStyle = {
    padding: '20px',
    border: '1px solid #ddd',
    marginBottom: '10px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
};