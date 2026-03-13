import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

const AlertLibraryArticles = () => {
    const [showAll, setShowAll] = useState(false);

    const articles = [
        {
            title: 'Article 1',
            content: (
                <p>
                    Civil servants, professors, and students of the Royal University of Law and Economics who wish to use or borrow books from
                    the library must contact the librarian for information.
                </p>
            ),
        },
        {
            title: 'Article 2',
            content: (
                <>
                    <p>Learners must:</p>
                    <ul className="ml-6 list-disc">
                        <li>Register on the list before reading.</li>
                        <li>Turn off mobile phones and remain silent.</li>
                        <li>No smoking, eating, or drinking.</li>
                        <li>Do not throw away paper or garbage anywhere in the library.</li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Article 3',
            content: (
                <p>
                    The library card includes a photo ID and is valid for one academic year. It is non-transferable and may only be used by the person
                    it was issued to.
                </p>
            ),
        },
        {
            title: 'Article 4',
            content: (
                <>
                    <p>Library card holders can borrow books under the following conditions:</p>
                    <ul className="ml-6 list-disc">
                        <li>
                            Students can borrow up to <strong>2 books at a time</strong> for a maximum of <strong>15 days</strong> and may renew once.
                        </li>
                        <li>
                            Professors and civil servants can borrow up to <strong>5 books</strong> for <strong>30 days</strong>, excluding weekends
                            and national holidays.
                        </li>
                    </ul>
                </>
            ),
        },
        {
            title: 'Article 5',
            content: (
                <p>
                    Borrowers must maintain borrowed books in their original condition. In case of damage or loss, the borrower must pay a fee equal
                    to <strong>twice the book’s price</strong>.
                </p>
            ),
        },
        {
            title: 'Article 6',
            content: (
                <p>
                    Legal documents, dictionaries, certain reference books, and any student correspondence are{' '}
                    <strong>not allowed to be taken outside</strong> the library.
                </p>
            ),
        },
        {
            title: 'Article 7',
            content: (
                <p>
                    All readers must dress appropriately according to school regulations — shirts must be tucked in, and bags or briefcases should be
                    left in designated areas.
                </p>
            ),
        },
        {
            title: 'Article 8',
            content: (
                <p>
                    Librarians have the right to inspect anyone entering or leaving the library. Anyone caught stealing or tearing pages from books
                    will be punished by the university according to these regulations.
                </p>
            ),
        },
        {
            title: 'Article 9',
            content: (
                <p>
                    Borrowers who fail to return books on time will be subject to penalties as determined by the library. In serious cases, borrowing
                    privileges may be suspended for one academic year.
                </p>
            ),
        },
        {
            title: 'Article 10',
            content: (
                <>
                    <p>
                        Books and magazines taken from shelves must be left on the tables after use so that librarians can return them to their proper
                        places.
                    </p>
                    <p>
                        The university encourages all professors and students to act responsibly when using the library, as it is a shared resource
                        for everyone.
                    </p>
                </>
            ),
        },
    ];

    const visibleArticles = showAll ? articles : articles.slice(0, 4);

    return (
        <div className="mt-4 space-y-4">
            {visibleArticles.map((article, index) => (
                <Alert key={index} className="rounded-none border-0 border-l-4 bg-muted dark:border-l-foreground/30">
                    <AlertTitle className="text-foreground">{article.title}</AlertTitle>
                    <AlertDescription className="text-foreground">{article.content}</AlertDescription>
                </Alert>
            ))}

            {articles.length > 3 && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                        {showAll ? (
                            <>
                                Show Less <ChevronUpIcon />
                            </>
                        ) : (
                            <>
                                Show All Articles <ChevronDownIcon />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AlertLibraryArticles;
