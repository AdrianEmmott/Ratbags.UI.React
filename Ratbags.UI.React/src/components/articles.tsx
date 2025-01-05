import axios from 'axios';
import { useEffect, useState } from 'react';
import { environment } from '../environments';
import { ArticleListItem } from '../interfaces/ArticleListItem';
import { PagedResult } from '../interfaces/PagedResult';
import { ImageDisplay } from './imageDisplay';

function Articles() {
    const [currentPage, setCurrentPage] = useState<number>(1); // essentially skip
    const [pageSize, setPageSize] = useState<number>(3); // essentially take
    const [articles, setArticles] = useState<PagedResult<ArticleListItem>>();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Calculate skip & take based on currentPage and pageSize
                const skip = (currentPage - 1) * pageSize;
                const take = pageSize;

                const response = await axios.get<PagedResult<ArticleListItem>>(
                    `${environment.apiUrl}/api/articles/${skip}/${take}`
                );

                setArticles(response.data);

                console.log(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, [currentPage, pageSize]);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    return (
        <div>
            {articles?.items.map((article) => (
                <div key={article.id}>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <ImageDisplay imageUrl={article.thumbnailImageUrl} subFolder='yak' />
                </div>
            ))}

            {/* pagination */}
            <div>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span style={{ margin: '0 1rem' }}>
                    Page {currentPage}
                </span>

                <button onClick={handleNextPage}>
                    Next
                </button>
            </div>

            {/* page size select */}
            <div style={{ marginTop: '1rem' }}>
                <label htmlFor="pageSize">Page Size:</label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => {
                        setCurrentPage(1); // reset to first page
                        setPageSize(Number(e.target.value));
                    }}
                >
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                </select>
            </div>
        </div>
    );
}

export default Articles;
