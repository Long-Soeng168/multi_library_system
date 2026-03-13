<?php

namespace App\Http\Controllers\FrontPage;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 9);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $type_code = $request->input('type_code');
        $category_code = $request->input('category_code');
        $language_code = $request->input('language_code');

        $query = Post::query();

        if ($type_code) {
            $query->where('type_code', $type_code);
        }
        if ($category_code) {
            $query->where('category_code', $category_code);
        }
        if ($language_code) {
            $query->where('language_code', $language_code);
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where(function ($w) use ($search) {
                    $w->where('title', 'like', "%{$search}%")
                        ->orWhere('title_kh', 'like', "%{$search}%")
                        ->orWhere('keywords', 'like', "%{$search}%")
                        ->orWhere('short_description', 'like', "%{$search}%")
                        ->orWhere('short_description_kh', 'like', "%{$search}%");

                    if (is_numeric($search)) {
                        $w->orWhere('id', $search);
                    }
                });
            });
        }

        $query->where('status', 'published');
        $query->orderBy('id', 'desc');
        $query->select('id', 'title', 'title_kh', 'category_code', 'short_description', 'short_description_kh', 'thumbnail', 'created_at');
        $query->with('category');

        $tableData = $query->paginate($perPage)->onEachSide(1);
        $totalDataCount = Post::where('status', 'published')->count();

        return Inertia::render('FrontPage/Posts/Index', [
            'tableData' => $tableData,
            'totalDataCount' => $totalDataCount,
            'languages' => Language::orderBy('order_index')->orderBy('name')->get(),
            'categories' => PostCategory::orderBy('order_index')
                ->withCount('posts')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Post $post)
    {
        $query = Post::query();
        $query->where('status', 'published');
        $query->where('category_code', $post->category_code);
        $query->where('id', '!=', $post->id);
        $query->orderBy('id', 'desc');
        $query->select('id', 'title', 'title_kh', 'short_description', 'short_description_kh', 'thumbnail', 'created_at', 'category_code');
        $query->with('category');

        $relatedData = $query->limit(6)->get();
        // return $relatedData;

        $post->increment('total_view_count');
        
        return Inertia::render('FrontPage/Posts/Show', [
            'showData' => $post->load('images', 'files', 'category'),
            'relatedData' => $relatedData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
