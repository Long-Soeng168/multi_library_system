{{-- resources/views/errors/404.blade.php --}}
<!DOCTYPE html>
<html lang="en" class="h-full">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 | Page Not Found</title>
    <style>
        html,
        body {
            height: 100%;
            margin: 0;
        }

        body {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(to bottom right, #f9fafb, #f3f4f6, #ffffff);
            color: #111827;
            font-family: system-ui, -apple-system, sans-serif;
            text-align: center;
        }

        body.dark {
            background: linear-gradient(to bottom right, #111827, #1f2937, #000000);
            color: #ffffff;
        }

        .container {
            padding: 0 1rem;
        }

        .container img {
            width: 12rem;
            max-width: 24rem;
            height: auto;
            object-fit: contain;
            margin: 0 auto;
            display: block;
        }

        .title {
            margin-top: 1.5rem;
            font-size: 1.5rem;
            font-weight: 300;
            color: #374151;
        }

        body.dark .title {
            color: #d1d5db;
        }

        .subtitle {
            margin-top: 0.5rem;
            color: #6b7280;
        }

        body.dark .subtitle {
            color: #9ca3af;
        }

        .actions {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
        }

        .back-link {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            color: #6e66cf;
            text-decoration: underline;
            text-underline-offset: 4px;
            transition: opacity 0.2s ease-in-out;
        }

        body.dark .back-link {
            color: #ffffff;
        }

        .back-link:hover {
            opacity: 0.8;
        }

        /* Responsive scaling */
        @media (min-width: 640px) {
            .container img {
                width: 16rem;
            }

            .title {
                font-size: 1.75rem;
            }
        }

        @media (min-width: 768px) {
            .container img {
                width: 20rem;
            }
        }

        @media (min-width: 1024px) {
            .container img {
                width: 24rem;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="/assets/icons/404.png" alt="404">

        <p class="title">Oops! The page you’re looking for doesn’t exist.</p>
        <p class="subtitle">It might have been removed, renamed, or never existed.</p>

        <div class="actions">
            <a href="{{ url('/') }}" class="back-link">Back Home</a>
        </div>
    </div>
</body>

</html>